import { Emoji, EmojiStyle } from "emoji-picker-react";
import { MessageUpdate } from "../../Types";

interface SelfChatBubbleProps {
	message: MessageUpdate;
	asEmoji?: boolean;
}

const SelfChatBubble = ({ message, asEmoji = false }: SelfChatBubbleProps) => (
	<div className="flex flex-row justify-end my-2 text-sm">
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
	</div>
);

export default SelfChatBubble;
