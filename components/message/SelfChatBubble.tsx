import { MessageUpdate } from "../../Types";

interface SelfChatBubbleProps {
	message: MessageUpdate;
	overrideMessageContent?: React.ElementType;
}

const SelfChatBubble = ({
	message,
	overrideMessageContent: OverrideComponent,
}: SelfChatBubbleProps) => (
	<div className="flex flex-row justify-end my-2">
		<div className="bg-gray-50 w-fit p-2 rounded-lg rounded-br-none">
			{OverrideComponent ? (
				<OverrideComponent />
			) : (
				<p>{message.message}</p>
			)}
			<div />
		</div>
	</div>
);

export default SelfChatBubble;
