import { Emoji, EmojiStyle } from "emoji-picker-react";
import { MessageUpdate } from "../../Types";

interface OtherPlayerEmojiReactionProps {
	message: MessageUpdate;
}

const OtherPlayerEmojiReaction = ({
	message,
}: OtherPlayerEmojiReactionProps) => (
	<div className="flex flex-row justify-start my-2">
		<div className="bg-blue-500 text-white/95 w-fit p-2 rounded-lg rounded-bl-none">
			<p className="text-xs font-bold ">{message.player.display_name}</p>

			<Emoji unified={message.message} emojiStyle={EmojiStyle.APPLE} />

			<div />
		</div>
	</div>
);

export default OtherPlayerEmojiReaction;
