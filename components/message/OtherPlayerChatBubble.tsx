import { MessageUpdate } from "../../Types";

interface OtherPlayerChatBubbleProps {
	message: MessageUpdate;
}

const OtherPlayerChatBubble = ({ message }: OtherPlayerChatBubbleProps) => (
	<div className="flex flex-row justify-start my-2">
		<div className="bg-blue-500 text-white/95 w-fit p-2 px-3 rounded-lg rounded-bl-none">
			<p className="text-xs font-bold ">{message.player.display_name}</p>

			<p>{message.message}</p>

			<div />
		</div>
	</div>
);

export default OtherPlayerChatBubble;
