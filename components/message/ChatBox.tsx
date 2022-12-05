import { IconSend } from "@tabler/icons";
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
}

const ChatBox = ({ room_id, player_id }: ChatBoxProps) => {
	const socket = useContext(SocketProviderContext);

	const [messages, setMessages] = useState<(MessageUpdate | SystemMessage)[]>(
		[]
	);
	const [inputMessage, setInputMessage] = useState("");

	const messagesBoxRefElement = useRef<HTMLDivElement>(null);
	const lastMessageElementRef = useRef<HTMLDivElement>(null);

	const sendMessage = (messageType: Message["type"]) => {
		setInputMessage("");

		const newMessageObject: Message = {
			room_id,
			player_id,
			message: inputMessage,
			type: messageType,
			created_at: new Date(),
		};

		if (socket) {
			console.log("Emitting new message");

			// Emit to socket
			socket.emit(MESSAGE_EVENTS.MESSAGE_NEW, newMessageObject);
		}
	};

	const sendReaction = (emoji: string) => {
		setInputMessage("");

		const newMessageObject: Message = {
			room_id,
			player_id,
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

		if (inputMessage.length > 0) {
			sendMessage("message");
		}
	};

	const handleReaction = (emoji: string) => {
		sendReaction(emoji);
	};

	return (
		<div className="w-full h-full">
			{/* Chat box */}
			<div
				ref={messagesBoxRefElement}
				className="h-[300px] md:h-[600px] bg-black/5 p-3 rounded-xl overflow-auto mb-2"
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
										{message.player_id === player_id ? (
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
										{message.player_id === player_id ? (
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

			{/* Emoji Bar */}
			<EmojiReactionBar handleReaction={handleReaction} />

			<form onSubmit={handleMessageSubmit}>
				<div className="flex gap-2">
					<input
						tabIndex={0}
						placeholder="Type a message..."
						className="flex-1 h-[10px] text-sm"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
					/>

					<button className="bg-blue-300 text-blue-900 rounded-lg px-4">
						<IconSend size={18} />
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatBox;
