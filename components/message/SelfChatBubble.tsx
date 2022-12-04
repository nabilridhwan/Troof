import { Emoji, EmojiStyle } from "emoji-picker-react";
import { MessageUpdate } from "../../Types";
import ProfilePictureFromName from "../ProfilePictureFromName";

interface SelfChatBubbleProps {
	displayName: string;
	message: MessageUpdate;
	asEmoji?: boolean;
}

const SelfChatBubble = ({
	displayName,
	message,
	asEmoji = false,
}: SelfChatBubbleProps) => (
	<div className="flex flex-row justify-end items-end my-2 text-sm gap-2">
		<div className="bg-gray-100 w-fit p-2 px-3 rounded-lg rounded-br-none">
			{asEmoji ? (
				<Emoji
					unified={message.message}
					emojiStyle={EmojiStyle.APPLE}
					size={30}
				/>
			) : (
				<p>{message.message}</p>
			)}
			<div />
		</div>

		<ProfilePictureFromName name={displayName} />
	</div>
);

export default SelfChatBubble;
