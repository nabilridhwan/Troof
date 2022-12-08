/** @format */

import { RegexHelper } from "@troof/helpers";
import { MessageUpdatedFromServer } from "@troof/socket";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { motion } from "framer-motion";
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
	<motion.div className=" relative my-2 flex max-w-full flex-row items-end justify-end gap-2 text-sm">
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
			className="max-w-[80%] cursor-pointer  rounded-lg rounded-br-none bg-gray-100 p-2 px-3"
		>
			{/* This is a message that needs reply */}
			{asReply && (
				<div className="mb-1">
					{replyMessage ? (
						<>
							<div className="rounded-lg bg-gray-200 p-2">
								<p className="mb-1 text-xs font-semibold">
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
						<div className="rounded-lg bg-gray-200 p-2">
							<p className="break-words text-xs italic">
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
						__html: RegexHelper.globalReplaceLinksAndImages(message.message),
					}}
				/>
			)}
			<div />
		</motion.div>

		<ProfilePictureFromName name={displayName} />
	</motion.div>
);

export default SelfChatBubble;
