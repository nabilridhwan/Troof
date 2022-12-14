/** @format */

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
	<motion.div
		transition={{ duration: 1 }}
		onDoubleClick={() => onReply(message.id)}
		whileTap={{
			scale: [1, 0.9, 1],
			transition: {
				duration: 0.2,
				ease: "easeIn",
			},
		}}
		style={{
			originX: 0,
		}}
		className="mb-2.5 flex flex-row items-end justify-start gap-2 text-sm"
	>
		<ProfilePictureFromName name={displayName} />

		<div className="max-w-[80%]">
			<p className="mb-1 text-xs font-medium text-black/80">
				{message.display_name}
			</p>

			<motion.div className="max-w-fit cursor-pointer rounded-2xl rounded-bl-none border border-black/10 bg-neutral-100 p-1.5 px-3 text-black">
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
		</div>
	</motion.div>
);

export default OtherPlayerChatBubble;
