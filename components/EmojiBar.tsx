import { Emoji, EmojiStyle } from "emoji-picker-react";
import { motion } from "framer-motion";

const emojis = {
	laughing: "1f923",
	heart_eyes: "1fae3",
	angry: "1f621",
	crying: "1f92e",
	thumbs_up: "1f44d",
	heart: "1f62d",
	thumbs_down: "1f44e",
	pleading_face: "1f97a",
	broken_hear: "1f494",
};

interface EmojiReactionBarProps {
	handleReaction: (emoji: string) => void;
}

const EmojiReactionBar = ({ handleReaction }: EmojiReactionBarProps) => {
	return (
		<div className="flex flex-wrap justify-center gap-4 my-2 mx-auto w-fit">
			{Object.values(emojis).map((emoji, index) => (
				<motion.button
					key={index}
					whileTap={{ scale: 0.9 }}
					whileHover={{ scale: 1.1 }}
					onClick={() => handleReaction(emoji)}
				>
					<Emoji
						unified={emoji}
						emojiStyle={EmojiStyle.APPLE}
						size={24}
					/>
				</motion.button>
			))}
		</div>
	);
};

export default EmojiReactionBar;
