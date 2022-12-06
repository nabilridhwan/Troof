import { Emoji, EmojiStyle } from "emoji-picker-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const OriginalEmojiBar = [
	{
		unified: "1f923",
		original: "1f923",
		count: 0,
	},

	{
		unified: "1f621",
		original: "1f621",
		count: 0,
	},
	{
		unified: "1f97a",
		original: "1f97a",
		count: 0,
	},
	{
		unified: "1f92e",
		original: "1f92e",
		count: 0,
	},
	{
		unified: "1f44d",
		original: "1f44d",
		count: 0,
	},

	{
		unified: "1f44e",
		original: "1f44e",
		count: 0,
	},

	{
		unified: "1f494",
		original: "1f494",
		count: 0,
	},
];

type EmojiInBar = typeof OriginalEmojiBar;

interface EmojiReactionBarProps {
	handleReaction: (emoji: string) => void;
}

const EmojiReactionBar = ({ handleReaction }: EmojiReactionBarProps) => {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const [emojiBar, setEmojiBar] = useState<EmojiInBar>(OriginalEmojiBar);

	const updateEmojiBar = () => {
		// EPR data is the data for emoji picker react, which is the library we use to display the emoji picker.
		const eprData = localStorage.getItem("epr_suggested");

		if (!eprData) return;

		const eprDataJSON: EmojiInBar = JSON.parse(eprData);

		// Sort the eprDataJSON by count, so that the top emoji is at the top
		const sortedEprDataJSon = eprDataJSON
			.sort((a, b) => b.count - a.count)
			.slice(0, 7);

		if (sortedEprDataJSon.length === 7) {
			// Replace the whole emoji bar with the new one
			setEmojiBar(sortedEprDataJSon);
			return;
		}

		// Append it to emojiBar and take the last 8 of the whole emoji bar
		const newEmojiBar = [...emojiBar, ...sortedEprDataJSon].slice(-7);
		setEmojiBar(newEmojiBar);
	};

	useEffect(() => {
		updateEmojiBar();
	}, []);

	return (
		<div className="relative flex flex-wrap justify-center gap-4 my-2 mx-auto w-fit">
			{Object.values(emojiBar).map((emoji, index) => (
				<motion.button
					key={index}
					whileTap={{ scale: 0.9 }}
					whileHover={{ scale: 1.1 }}
					onClick={() => handleReaction(emoji.unified)}
				>
					<Emoji
						unified={emoji.unified}
						emojiStyle={EmojiStyle.APPLE}
						size={24}
					/>
				</motion.button>
			))}
		</div>
	);
};

export default EmojiReactionBar;
