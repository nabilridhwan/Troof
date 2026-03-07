/** @format */

import {
	IconLock,
	IconMessage,
	IconMoodHappy,
	IconSend,
	IconX,
} from "@tabler/icons";
import { MessageUpdatedFromServer, SystemMessage } from "@troof/socket";
import {
	Emoji,
	EmojiClickData,
	EmojiStyle,
	SuggestionMode,
} from "emoji-picker-react";

// Dynamic imports
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
	ssr: false,
});

const GifPicker = dynamic(() => import("../GifPicker"), {
	ssr: false,
});

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { useRoomContext } from "../../context/RoomContext";
import { useChat } from "../../hooks/useChat";
import findMessageById from "../../utils/findMessageById";
import EmojiReactionBar from "../EmojiBar";
import OtherPlayerChatBubble from "./OtherPlayerChatBubble";
import SelfChatBubble from "./SelfChatBubble";

const ChatBox = () => {
	const { room_id, player, bootstrap } = useRoomContext();
	const display_name = player.display_name;

	const [replyToMessage, setReplyToMessage] =
		useState<MessageUpdatedFromServer | null>(null);

	const emojiPickerBlockScreenId = useId();
	const [emojiDisabled, setEmojiDisabled] = useState(false);
	const [inputFocused, setInputFocused] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showGifPicker, setShowGifPicker] = useState(false);
	const [inputMessage, setInputMessage] = useState("");

	const inputElementRef = useRef<HTMLInputElement>(null);
	const messagesBoxRefElement = useRef<HTMLDivElement>(null);
	const lastMessageElementRef = useRef<HTMLDivElement>(null);

	const { messages, uniquePeopleTyping, sendMessage, isReady } = useChat({
		room_id,
		display_name,
		inputMessage,
		initialMessages: bootstrap.latest_messages,
	});

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		if (messagesBoxRefElement.current && lastMessageElementRef.current) {
			messagesBoxRefElement.current.scrollBy({
				top: lastMessageElementRef.current.offsetTop,
				behavior: "smooth",
			});
		}
	}, [messages]);

	const handleSend = (content: string, type: "message" | "reaction") => {
		sendMessage(content, type, replyToMessage?.id ?? null);
		setInputMessage("");
		setReplyToMessage(null);
	};

	const handleMessageSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
		if (e) e.preventDefault();
		if (inputMessage.length > 0) {
			handleSend(inputMessage, "message");
		}
		setInputFocused(false);
		setInputMessage("");
	};

	const handleReaction = (emoji: string) => {
		handleSend(emoji, "reaction");
		setEmojiDisabled(true);
		setTimeout(() => setEmojiDisabled(false), 2000);
	};

	const handleSelectGif = (url: string) => {
		handleSend(url, "message");
		setShowGifPicker(false);
	};

	const handleReply = (message_id: string) => {
		const m = findMessageById(
			message_id,
			messages as MessageUpdatedFromServer[]
		);
		if (!m) return;
		setReplyToMessage(m);
		if (inputElementRef.current) inputElementRef.current.focus();
	};

	const handleFocus = () => {
		setInputFocused(true);
		setShowEmojiPicker(false);
		setShowGifPicker(false);
	};

	const handleBlur = () => setInputFocused(false);

	return (
		<div className="chatbox h-full w-full">
			<div className="mb-2 flex items-center justify-center gap-1 rounded-xl py-2 text-xs text-black/50">
				<IconLock size={16} />
				<p>Messages are secured with end-to-end encryption.</p>
			</div>

			{/* Chat box */}
			<div
				ref={messagesBoxRefElement}
				className="relative mb-2 h-[450px] overflow-auto rounded-xl border border-black/10 bg-black/5 p-2 lg:min-h-[85%]"
			>
				<AnimatePresence>
					{!messages.length && (
						<p className="text-center text-sm text-gray-500">
							No messages yet. Say something!
						</p>
					)}
					{messages.map(
						(message: MessageUpdatedFromServer | SystemMessage, index) => {
							return (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.4,
										layout: index * 10 + 1,
									}}
									layout="position"
									key={index}
									ref={
										index === messages.length - 1 ? lastMessageElementRef : null
									}
								>
									{message.type === "message" && (
										<>
											{message.display_name === display_name ? (
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
													displayName={message.display_name}
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
													displayName={message.display_name}
													message={message}
												/>
											)}
										</>
									)}

									{message.type === "reaction" && (
										<>
											{message.display_name === display_name ? (
												<SelfChatBubble
													asEmoji={message.type === "reaction"}
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
													displayName={message.display_name}
													message={message}
												/>
											) : (
												<OtherPlayerChatBubble
													asEmoji={message.type === "reaction"}
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
													displayName={message.display_name}
													message={message}
												/>
											)}
										</>
									)}

									{message.type === "system" && (
										<div className="my-5 flex flex-row justify-center text-xs">
											<div className="w-fit rounded-lg bg-black/10 p-2 text-center">
												<p>{message.message}</p>
											</div>
										</div>
									)}
								</motion.div>
							);
						}
					)}
				</AnimatePresence>
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
							className="my-1 text-xs italic text-opacity-50"
						>
							{uniquePeopleTyping.length > 3 ? (
								<>People are typing...</>
							) : (
								<>
									{uniquePeopleTyping.join(", ")}{" "}
									{uniquePeopleTyping.length > 1 ? "are" : "is"} typing...
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
							<div className="absolute -left-3 bottom-14 z-30">
								{/* Emoji blocking screen */}
								<AnimatePresence>
									{emojiDisabled && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ ease: "easeOut" }}
											id={emojiPickerBlockScreenId}
											className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm"
										>
											Please Wait!
										</motion.div>
									)}
								</AnimatePresence>

								<EmojiPicker
									lazyLoadEmojis={true}
									previewConfig={{
										showPreview: false,
									}}
									skinTonesDisabled={true}
									suggestedEmojisMode={SuggestionMode.RECENT}
									onEmojiClick={(emojiData: EmojiClickData) => {
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
								className="absolute bottom-14 right-0 z-30 my-2 w-[350px]"
							>
								<GifPicker onSelectGif={handleSelectGif} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<LayoutGroup>
				{/* Reply message  */}
				<AnimatePresence mode="popLayout">
					{replyToMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="relative my-1 w-full items-center space-y-1 rounded-lg border border-black/10 bg-black/5 p-2 px-3"
						>
							<div className="items-center gap-2 text-xs">
								<div className="flex gap-1 opacity-60">
									<IconMessage size={16} />
									<p>
										Replying to{" "}
										<span className="font-bold text-black/70">
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
									<p className="line-clamp-1" title={replyToMessage.message}>
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
						<motion.button
							type="button"
							whileTap={{ scale: 0.9 }}
							whileHover={{ scale: 1.05 }}
							onClick={() => {
								setShowGifPicker(false);
								setShowEmojiPicker(!showEmojiPicker);
							}}
							className="my-2 flex items-center justify-center gap-2 p-2 text-center text-black/60"
						>
							<IconMoodHappy size={20} className="text-black/50" />
						</motion.button>

						<motion.button
							type="button"
							whileTap={{ scale: 0.9 }}
							whileHover={{ scale: 1.05 }}
							onClick={() => {
								setShowEmojiPicker(false);
								setShowGifPicker(!showGifPicker);
							}}
							className="my-2 flex items-center justify-center gap-2 p-2 text-center text-black/60"
						>
							<p className="text-sm font-black">GIF</p>
						</motion.button>

						<div className="relative flex flex-1 items-center justify-center gap-3">
							<input
								maxLength={150}
								ref={inputElementRef}
								onFocus={handleFocus}
								onBlur={handleBlur}
								tabIndex={0}
								disabled={!isReady}
								placeholder="Type a message..."
								className="h-[15px] border-[1px]"
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
							/>

							<button
								type="submit"
								disabled={inputMessage.length === 0}
								className="absolute right-0 mr-1 flex items-center justify-center gap-2 rounded-lg bg-primary p-2.5 text-center disabled:opacity-50"
							>
								<IconSend size={18} />
							</button>
						</div>
					</div>

					<p className="mb-5 text-right text-xs text-black/50">
						{inputMessage.length}/150
					</p>
				</motion.form>
			</LayoutGroup>
		</div>
	);
};

export default ChatBox;
