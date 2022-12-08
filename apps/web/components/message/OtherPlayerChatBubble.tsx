import { RegexHelper } from "@troof/helpers";
import { MessageUpdatedFromServer } from "@troof/socket";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { motion } from "framer-motion";
import ProfilePictureFromName from "../ProfilePictureFromName";

interface OtherPlayerChatBubbleProps {
	displayName: string;
	message: MessageUpdatedFromServer;
	asEmoji?: boolean;
	asReply?: boolean;
	onReply: (id: string) => void;
	replyMessage?: MessageUpdatedFromServer;
}

const OtherPlayerChatBubble = ({
	displayName,
	message,
	asEmoji = false,
	asReply = false,
	onReply,
	replyMessage,
}: OtherPlayerChatBubbleProps) => (
	<motion.div className="flex flex-row justify-start items-end my-2 text-sm gap-2">
		<ProfilePictureFromName name={displayName} />
		<motion.div
			onDoubleClick={() => onReply(message.id)}
			whileHover={{ scale: 1.05 }}
			whileTap={{
				scale: [0.95, 1],
				transition: {
					duration: 0.2,
					ease: "easeIn",
				},
			}}
			className="bg-blue-300 text-blue-900 max-w-[80%] p-2 px-3 rounded-lg rounded-bl-none cursor-pointer"
		>
			<p className="text-xs font-semibold mb-1">{message.display_name}</p>

			{/* This is a message that needs reply */}
			{asReply && (
				<div className="mb-1">
					{replyMessage ? (
						<>
							<div className="bg-gray-200 rounded-lg p-2">
								<p className="text-xs font-semibold mb-1">
									{replyMessage?.display_name}
								</p>

								{replyMessage.type === "reaction" ? (
									<Emoji
										unified={replyMessage.message}
										emojiStyle={EmojiStyle.APPLE}
										size={20}
									/>
								) : (
									<p
										className="break-words"
										dangerouslySetInnerHTML={{
											__html: RegexHelper.globalReplaceLinksAndImages(
												replyMessage!.message
											),
										}}
									/>
								)}
							</div>
						</>
					) : (
						<div className="bg-gray-200 rounded-lg p-2">
							<p className="break-words italic text-xs">
								Couldn&apos;t find the message
							</p>
						</div>
					)}
				</div>
			)}

			{asEmoji ? (
				<Emoji
					unified={message.message}
					emojiStyle={EmojiStyle.APPLE}
					size={30}
				/>
			) : (
				<p
					className="break-words"
					dangerouslySetInnerHTML={{
						__html: RegexHelper.globalReplaceLinksAndImages(
							message.message
						),
					}}
				/>
			)}
			<div />
		</motion.div>
	</motion.div>
);

export default OtherPlayerChatBubble;
