import { Emoji, EmojiStyle } from "emoji-picker-react";
import { motion } from "framer-motion";
import { MessageUpdatedFromServer } from "../../Types";
import { RegexHelper } from "../../utils/regexHelpers";
import ProfilePictureFromName from "../ProfilePictureFromName";

interface SelfChatBubbleProps {
	displayName: string;
	message: MessageUpdatedFromServer;
	asEmoji?: boolean;
	asReply?: boolean;
	onReply: (id: string) => void;
	replyMessage?: MessageUpdatedFromServer;
}

const SelfChatBubble = ({
	displayName,
	message,
	asEmoji = false,
	asReply = false,
	onReply,
	replyMessage,
}: SelfChatBubbleProps) => (
	<motion.div className=" max-w-full flex flex-row justify-end items-end my-2 text-sm gap-2 relative">
		<motion.div
			onClick={() => onReply(message.id)}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			className="bg-gray-100 max-w-[80%]  p-2 px-3 rounded-lg rounded-br-none cursor-pointer"
		>
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

		<ProfilePictureFromName name={displayName} />
	</motion.div>
);

export default SelfChatBubble;
