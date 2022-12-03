import { Emoji, EmojiStyle } from "emoji-picker-react";
import { MessageUpdate } from "../../Types";

interface OtherPlayerChatBubbleProps {
	message: MessageUpdate;
	asEmoji?: boolean;
}

const OtherPlayerChatBubble = ({
	message,
	asEmoji = false,
}: OtherPlayerChatBubbleProps) => (
	<div className="flex flex-row justify-start my-2 text-sm">
		<div className="bg-blue-300  w-fit p-2 px-3 rounded-lg rounded-bl-none">
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
