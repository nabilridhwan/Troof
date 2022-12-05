import { IconSend } from "@tabler/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketProviderContext } from "../../context/SocketProvider";
import {
	Message,
	MessageUpdate,
	MESSAGE_EVENTS,
	SystemMessage,
} from "../../Types";
import EmojiReactionBar from "../EmojiBar";
import OtherPlayerChatBubble from "./OtherPlayerChatBubble";
import SelfChatBubble from "./SelfChatBubble";

interface ChatBoxProps {
	room_id: string;
	player_id: string;
	display_name: string;
}

let typingTimeout: NodeJS.Timeout;
let doneTypingTimeout: NodeJS.Timeout;

const ChatBox = ({ room_id, player_id, display_name }: ChatBoxProps) => {
	const socket = useContext(SocketProviderContext);
	const inputElementRef = useRef<HTMLInputElement>(null);

	const [inputFocused, setInputFocused] = useState(false);

	const [messages, setMessages] = useState<(MessageUpdate | SystemMessage)[]>(
		[]
	);
	const [inputMessage, setInputMessage] = useState("");

	const [peopleTyping, setPeopleTyping] = useState<string[]>([]);
	const uniquePeopleTyping = Array.from(new Set(peopleTyping));

	const messagesBoxRefElement = useRef<HTMLDivElement>(null);
	const lastMessageElementRef = useRef<HTMLDivElement>(null);

	const sendMessage = (messageType: Message["type"]) => {
		setInputMessage("");

		const newMessageObject: Message = {
			room_id,
			display_name,
			message: inputMessage,
			type: messageType,
			created_at: new Date(),
		};

		if (socket) {
			// Stop typing
			socket.emit(MESSAGE_EVENTS.IS_TYPING, {
				room_id,
				display_name,
				is_typing: false,
			});

			console.log("Emitting new message");

			// Emit to socket
			socket.emit(MESSAGE_EVENTS.MESSAGE_NEW, newMessageObject);
		}
	};

	const sendReaction = (emoji: string) => {
		setInputMessage("");

		const newMessageObject: Message = {
			room_id,
			display_name,
			message: emoji,
			type: "reaction",
			created_at: new Date(),
		};

		if (socket) {
			console.log("Emitting new message");

			// Emit to socket
			socket.emit(MESSAGE_EVENTS.MESSAGE_REACTION, newMessageObject);
		}
	};

	useEffect(() => {
		if (socket) {
			console.log("Emitting joined chatbox");

			socket.emit(MESSAGE_EVENTS.JOIN, {
				room_id,
			});

			socket.on(MESSAGE_EVENTS.LATEST_MESSAGES, (data) => {
				// We reverse the array because we want the latest messages to be at the bottom
				// However the server sends the latest messages at the top
				setMessages([...data.reverse()]);
			});

			socket.on(MESSAGE_EVENTS.MESSAGE_NEW, (data) => {
				setMessages((oldMessages) => [...oldMessages, data]);
			});

			socket.on(MESSAGE_EVENTS.MESSAGE_REACTION, (data) => {
				setMessages((oldMessages) => [...oldMessages, data]);
			});

			socket.on(MESSAGE_EVENTS.MESSAGE_SYSTEM, (data) => {
				setMessages((oldMessages) => [...oldMessages, data]);
			});

			socket.on("disconnect", () => {
				const disconnectedSystemMessage: SystemMessage = {
					message:
						"You have been disconnected from the server. The page will refresh in 3 seconds.",
					type: "system",
					created_at: new Date(),
					room_id,
				};
				setMessages((oldMessages) => [
					...oldMessages,
					disconnectedSystemMessage,
				]);
			});

			socket.on(MESSAGE_EVENTS.IS_TYPING, (data) => {
				console.log(data);

				// Remove people when their is_typing is false
				// Otherwise add them to the list

				if (data.is_typing) {
					setPeopleTyping((oldPeopleTyping) => [
						...oldPeopleTyping,
						data.display_name,
					]);
				}

				if (!data.is_typing) {
					setPeopleTyping((oldPeopleTyping) =>
						oldPeopleTyping.filter(
							(person) => person !== data.display_name
						)
					);
				}
			});
		}
	}, [socket]);

	useEffect(() => {
		console.log("Messages");
		console.log(messages);
		if (messagesBoxRefElement.current && lastMessageElementRef.current) {
			messagesBoxRefElement.current.scrollBy({
				top: 100000,
				behavior: "smooth",
			});
		}
	}, [messages]);

	const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// if (inputElementRef.current) {
		// 	// blur the input
		// 	inputElementRef.current.blur();
		// }

		if (inputMessage.length > 0) {
			sendMessage("message");
		}
	};

	const handleReaction = (emoji: string) => {
		sendReaction(emoji);
	};

	const handleTyping = (e: any) => {
		setInputMessage(e.target.value);
	};

	// Use effect to emit typing event
	useEffect(() => {
		if (inputMessage.trim().length > 0) {
			if (doneTypingTimeout) clearTimeout(doneTypingTimeout);

			if (socket) {
				// Check if input is focused
				typingTimeout = setTimeout(() => {
					socket.emit(MESSAGE_EVENTS.IS_TYPING, {
						room_id,
						display_name,
						is_typing: true,
					});

					doneTypingTimeout = setTimeout(() => {
						socket.emit(MESSAGE_EVENTS.IS_TYPING, {
							room_id,
							display_name,
							is_typing: false,
						});
					}, 3500);
				}, 100);
			}
		}
	}, [inputMessage, inputFocused]);

	const handleFocus = () => {
		setInputFocused(true);
	};

	const handleBlur = () => {
		setInputFocused(false);
	};

	return (
		<div className="w-full h-full">
			{/* Chat box */}
			<div
				ref={messagesBoxRefElement}
				className="h-[300px] md:h-[600px] relative bg-black/5 p-3 rounded-xl overflow-auto mb-2"
			>
				{!messages.length && (
					<p className="text-center text-gray-500">
						No messages yet. Say something!
					</p>
				)}
				{messages.map(
					(message: MessageUpdate | SystemMessage, index) => {
						return (
							<div
								key={index}
								ref={
									index === messages.length - 1
										? lastMessageElementRef
										: null
								}
							>
								{message.type === "message" && (
									<>
										{message.display_name ===
										display_name ? (
											<SelfChatBubble
												displayName={
													message.display_name
												}
												message={message}
											/>
										) : (
											<OtherPlayerChatBubble
												displayName={
													message.display_name
												}
												message={message}
											/>
										)}
									</>
								)}

								{message.type === "reaction" && (
									<>
										{message.display_name ===
										display_name ? (
											<SelfChatBubble
												displayName={
													message.display_name
												}
												message={message}
												asEmoji
											/>
										) : (
											<OtherPlayerChatBubble
												displayName={
													message.display_name
												}
												message={message}
												asEmoji
											/>
										)}
									</>
								)}

								{message.type === "system" && (
									<div className="text-xs flex flex-row justify-center my-5">
										<div className="bg-black/10 w-fit p-2 rounded-lg text-center">
											<p>{message.message}</p>
										</div>
									</div>
								)}
							</div>
						);
					}
				)}
			</div>

			<div className="h-4">
				<AnimatePresence>
					{uniquePeopleTyping.length > 0 && (
						<motion.p
							layout
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="text-xs my-1 italic text-opacity-50"
						>
							{uniquePeopleTyping.length > 3 ? (
								<>People are typing...</>
							) : (
								<>
									{uniquePeopleTyping.join(", ")}{" "}
									{uniquePeopleTyping.length > 1
										? "are"
										: "is"}{" "}
									typing...
								</>
							)}
						</motion.p>
					)}
				</AnimatePresence>
			</div>

			{/* Emoji Bar */}
			<EmojiReactionBar handleReaction={handleReaction} />

			<form onSubmit={handleMessageSubmit}>
				<div className="flex-col flex gap-2">
					<input
						ref={inputElementRef}
						onFocus={handleFocus}
						onBlur={handleBlur}
						tabIndex={0}
						placeholder="Type a message..."
						className="h-[10px] text-sm"
						value={inputMessage}
						onChange={handleTyping}
					/>

					<button className="flex-1 py-3 bg-blue-300 text-blue-900 rounded-lg px-4 flex items-center gap-2">
						<IconSend size={18} />
						Send
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatBox;
