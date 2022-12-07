import { IconMessage, IconMoodHappy, IconSend, IconX } from "@tabler/icons";
import {
	BaseNewMessage,
	MessageUpdatedFromServer,
	MESSAGE_EVENTS,
	SystemMessage,
} from "@troof/config";
import EmojiPicker, {
	Emoji,
	EmojiClickData,
	EmojiStyle,
	SuggestionMode,
} from "emoji-picker-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketProviderContext } from "../../context/SocketProvider";
import findMessageById from "../../utils/findMessageById";
import EmojiReactionBar from "../EmojiBar";
import GifPicker from "./GifPicker";
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
	const [replyToMessage, setReplyToMessage] =
		useState<MessageUpdatedFromServer | null>(null);

	const socket = useContext(SocketProviderContext);
	const inputElementRef = useRef<HTMLInputElement>(null);

	const [inputFocused, setInputFocused] = useState(false);

	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showGifPicker, setShowGifPicker] = useState(false);

	const [messages, setMessages] = useState<
		(MessageUpdatedFromServer | SystemMessage)[]
	>([]);
	const [inputMessage, setInputMessage] = useState("");

	const [peopleTyping, setPeopleTyping] = useState<string[]>([]);
	const uniquePeopleTyping = Array.from(new Set(peopleTyping));

	const messagesBoxRefElement = useRef<HTMLDivElement>(null);
	const lastMessageElementRef = useRef<HTMLDivElement>(null);

	const sendMessage = (content: string) => {
		console.log("Reply to: ", replyToMessage ? replyToMessage.id : "null");
		const newMessageObject: BaseNewMessage = {
			room_id,
			display_name,
			reply_to: replyToMessage ? replyToMessage.id : null,
			message: content,
			type: "message",
			created_at: new Date(),
		};

		console.log(`Sending message to server:`);
		console.log(newMessageObject);

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

		setInputMessage("");

		setReplyToMessage(null);
	};

	const sendReaction = (emoji: string) => {
		console.log(
			"Reaction to: ",
			replyToMessage ? replyToMessage.id : "null"
		);
		setInputMessage("");

		const newMessageObject: BaseNewMessage = {
			room_id,
			display_name,
			reply_to: replyToMessage ? replyToMessage.id : null,
			message: emoji,
			type: "reaction",
			created_at: new Date(),
		};

		if (socket) {
			console.log("Emitting new message");

			// Emit to socket
			socket.emit(MESSAGE_EVENTS.MESSAGE_REACTION, newMessageObject);
		}
		setReplyToMessage(null);
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
					display_name: "",
					reply_to: null,
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
				top: lastMessageElementRef.current.offsetTop,
				behavior: "smooth",
			});
		}
	}, [messages]);

	const handleMessageSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
		if (e) e.preventDefault();

		// if (inputElementRef.current) {
		// 	// blur the input
		// 	inputElementRef.current.blur();
		// }

		if (inputMessage.length > 0) {
			sendMessage(inputMessage);
		}

		setInputFocused(false);
		setInputMessage("");
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
		setShowEmojiPicker(false);
		setShowGifPicker(false);
	};

	const handleBlur = () => {
		setInputFocused(false);
	};

	const handleSelectGif = (url: string) => {
		console.log(url);
		sendMessage(url);
		setShowGifPicker(false);
	};

	const handleReply = (message_id: string) => {
		const m = findMessageById(
			message_id,
			messages as MessageUpdatedFromServer[]
		);

		if (!m) return;

		console.log(m);

		setReplyToMessage(m);

		if (inputElementRef.current) {
			inputElementRef.current.focus();
		}
	};

	return (
		<div className="w-full h-full chatbox">
			{/* Chat box */}
			<div
				ref={messagesBoxRefElement}
				className="h-[300px] lg:min-h-[85%] relative bg-black/5 p-2 rounded-xl overflow-auto mb-2 border border-black/10"
			>
				{!messages.length && (
					<p className="text-center text-gray-500">
						No messages yet. Say something!
					</p>
				)}
				{messages.map(
					(
						message: MessageUpdatedFromServer | SystemMessage,
						index
					) => {
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
												onReply={handleReply}
												asReply={!!message.reply_to}
												replyMessage={
													!!message.reply_to
														? findMessageById(
																message.reply_to,
																messages as MessageUpdatedFromServer[]
														  )
														: undefined
												}
												displayName={
													message.display_name
												}
												message={message}
											/>
										) : (
											<OtherPlayerChatBubble
												onReply={handleReply}
												asReply={!!message.reply_to}
												replyMessage={
													!!message.reply_to
														? findMessageById(
																message.reply_to,
																messages as MessageUpdatedFromServer[]
														  )
														: undefined
												}
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
												asEmoji={
													message.type === "reaction"
												}
												onReply={handleReply}
												asReply={!!message.reply_to}
												replyMessage={
													!!message.reply_to
														? findMessageById(
																message.reply_to,
																messages as MessageUpdatedFromServer[]
														  )
														: undefined
												}
												displayName={
													message.display_name
												}
												message={message}
											/>
										) : (
											<OtherPlayerChatBubble
												asEmoji={
													message.type === "reaction"
												}
												onReply={handleReply}
												asReply={!!message.reply_to}
												replyMessage={
													!!message.reply_to
														? findMessageById(
																message.reply_to,
																messages as MessageUpdatedFromServer[]
														  )
														: undefined
												}
												displayName={
													message.display_name
												}
												message={message}
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

			{/* Emoji button and gif button */}
			<div className="">
				<div className="relative">
					{showEmojiPicker && (
						<>
							<div className="absolute bottom-14 -left-3 z-30">
								<EmojiPicker
									lazyLoadEmojis={true}
									previewConfig={{
										showPreview: false,
									}}
									skinTonesDisabled={true}
									suggestedEmojisMode={SuggestionMode.RECENT}
									onEmojiClick={(
										emojiData: EmojiClickData
									) => {
										handleReaction(emojiData.unified);
										setShowEmojiPicker(false);
									}}
									emojiStyle={EmojiStyle.APPLE}
								/>
							</div>
						</>
					)}
				</div>

				{/* Gif picker */}
				<div className="relative">
					<AnimatePresence>
						{showGifPicker && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
								className="my-2 absolute w-[350px] bottom-14 right-0 z-30"
							>
								<GifPicker onSelectGif={handleSelectGif} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* ! Overlay such that when the user clicks it, it will close both emoji and gif picker */}
			{/* {(showEmojiPicker || showGifPicker) && (
				<div
					onClick={() => {
						setShowEmojiPicker(false);
						setShowGifPicker(false);
					}}
					className="fixed top-0 left-0 w-screen h-screen bg-transparent pointer-events-auto"
				/>
			)} */}

			<LayoutGroup>
				{/* Reply message  */}
				<AnimatePresence mode="popLayout">
					{replyToMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className=" bg-black/5 border relative border-black/10 rounded-lg p-2 px-3 items-center space-y-1 my-1 w-full"
						>
							<div className="items-center gap-2 text-xs">
								<div className="flex gap-1 opacity-60">
									<IconMessage size={16} />
									<p>
										Replying to{" "}
										<span className="text-black/70 font-bold">
											{replyToMessage.display_name}
										</span>
										...
									</p>
								</div>

								{replyToMessage.type === "reaction" ? (
									<Emoji
										unified={replyToMessage.message}
										emojiStyle={EmojiStyle.APPLE}
										size={20}
									/>
								) : (
									<p
										className="line-clamp-1"
										title={replyToMessage.message}
									>
										{replyToMessage.message}
									</p>
								)}
							</div>

							<button
								className="absolute right-1 top-1"
								onClick={() => setReplyToMessage(null)}
							>
								<IconX size={18} />
							</button>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.form layout="size" onSubmit={handleMessageSubmit}>
					<div className="flex gap-2">
						{/* Gif and Emoji buttons */}

						<motion.button
							type="button"
							whileTap={{ scale: 0.9 }}
							whileHover={{ scale: 1.05 }}
							onClick={() => {
								setShowGifPicker(false);
								setShowEmojiPicker(!showEmojiPicker);
							}}
							className="my-2 p-2 flex items-center gap-2 text-center justify-center text-black/60"
						>
							<IconMoodHappy
								size={20}
								className="text-black/50"
							/>
						</motion.button>

						<motion.button
							type="button"
							whileTap={{ scale: 0.9 }}
							whileHover={{ scale: 1.05 }}
							onClick={() => {
								setShowEmojiPicker(false);
								setShowGifPicker(!showGifPicker);
							}}
							className="my-2 p-2 flex items-center gap-2 text-center justify-center text-black/60"
						>
							<p className="text-sm font-black">GIF</p>
						</motion.button>

						<div className="relative gap-3 flex items-center justify-center flex-1">
							<input
								ref={inputElementRef}
								onFocus={handleFocus}
								onBlur={handleBlur}
								tabIndex={0}
								placeholder="Type a message..."
								className="h-[15px]"
								value={inputMessage}
								onChange={handleTyping}
							/>

							<button
								type="submit"
								disabled={inputMessage.length === 0}
								className="disabled:opacity-50 bg-primary absolute right-0 mr-1 p-2.5 rounded-lg flex items-center gap-2 text-center justify-center"
							>
								<IconSend size={18} />
							</button>
						</div>
					</div>
				</motion.form>
			</LayoutGroup>
		</div>
	);
};

export default ChatBox;
