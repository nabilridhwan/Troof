/** @format */

import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useEmojiReaction } from "../../hooks/useEmojiReaction";
import Container from "../Container";

interface EmojiReactionScreenProps {
	room_id: string;
}

const EmojiReactionScreen = ({ room_id }: EmojiReactionScreenProps) => {
	const { emojis } = useEmojiReaction({ room_id });

	return (
		<div
			id="emoji-reaction-screen"
			className="pointer-events-none fixed top-0 left-0 z-50 h-screen w-screen overflow-hidden bg-transparent"
		>
			<Container>
				{emojis.map((emoji, index) => (
					<div
						key={index}
						className={`pointer-events-none absolute top-0 z-50 animate-drop overflow-hidden`}
						style={{
							opacity: 0,
							animationDelay: `${emoji.delay}ms`,
							left: `${emoji.positionX}px`,
						}}
					>
						<Emoji
							unified={emoji.emoji}
							emojiStyle={EmojiStyle.APPLE}
							size={emoji.size}
						/>
					</div>
				))}
			</Container>
		</div>
	);
};

export default EmojiReactionScreen;
