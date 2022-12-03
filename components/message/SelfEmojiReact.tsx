import { Emoji, EmojiStyle } from "emoji-picker-react";
import { MessageUpdate } from "../../Types";

interface OtherPlayerEmojiReactionProps {
	message: MessageUpdate;
}

const SelfEmojiReaction = ({ message }: OtherPlayerEmojiReactionProps) => (
	<div className="flex flex-row justify-end my-2">
		<div className="bg-gray-50 w-fit p-2 rounded-lg rounded-br-none">
			<Emoji
				unified={message.message}
				emojiStyle={EmojiStyle.APPLE}
				size={30}
			/>
			<div />
		</div>
	</div>
);

export default SelfEmojiReaction;
