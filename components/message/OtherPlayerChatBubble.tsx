import { Emoji, EmojiStyle } from "emoji-picker-react";
import { MessageUpdate } from "../../Types";
import ProfilePictureFromName from "../ProfilePictureFromName";

interface OtherPlayerChatBubbleProps {
	displayName: string;
	message: MessageUpdate;
	asEmoji?: boolean;
}

const OtherPlayerChatBubble = ({
	displayName,
	message,
	asEmoji = false,
}: OtherPlayerChatBubbleProps) => (
	<div className="flex flex-row justify-start items-end my-2 text-sm gap-2">
		<ProfilePictureFromName name={displayName} />
		<div className="bg-blue-300 text-blue-900  w-fit p-2 px-3 rounded-lg rounded-bl-none">
			<p className="text-xs font-semibold mb-1">
				{message.player.display_name}
			</p>

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
	</div>
);

export default OtherPlayerChatBubble;
