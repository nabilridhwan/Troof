import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { MESSAGE_EVENTS } from "../../Types";
import Container from "../Container";

interface EmojiReactionScreenProps {
	room_id: string;
}

interface EmojisState {
	batch: string;
	emoji: string;
	positionX: number;
	delay: number;
}

const EmojiReactionScreen = ({ room_id }: EmojiReactionScreenProps) => {
	const { socket } = useSocket();

	const [emojis, setEmojis] = useState<EmojisState[]>([]);

	useEffect(() => {
		if (socket) {
			console.log("Emitting joined reaction channel");

			socket.emit(MESSAGE_EVENTS.JOIN, {
				room_id,
			});

			socket.on(MESSAGE_EVENTS.MESSAGE_REACTION, (data) => {
				console.log("New reaction data");
				console.log(data);

				// Make a new emoji object with the emoji and a random position and random delay but get like 15 of them
				// and then set the emojis state to that array

				console.log(window.innerWidth);

				const finalArray = Array.from({ length: 15 }).map(
					(_, index) => ({
						batch: data.created_at + data.player_id + data.message,
						emoji: data.message,
						positionX: Math.floor(
							Math.random() * window.innerWidth
						),
						delay: Math.random() * 1000,
					})
				);

				console.log(finalArray);

				setEmojis((oldEmojis) => [...oldEmojis, ...finalArray]);
			});
		}
	}, [socket, room_id]);

	return (
		<div
			className="fixed w-screen h-screen bg-transparent top-0 left-0 overflow-hidden pointer-events-none"
			onAnimationEndCapture={() => console.log("Finally completed")}
		>
			<Container>
				{emojis.map((emoji, index) => (
					<div
						key={index}
						className={`animate-drop absolute top-0 overflow-hidden pointer-events-none`}
						style={{
							opacity: 0,
							animationDelay: `${emoji.delay}ms`,
							left: `${emoji.positionX}px`,
						}}
					>
						<Emoji
							unified={emoji.emoji}
							emojiStyle={EmojiStyle.APPLE}
							size={Math.floor(Math.random() * 10) + 30}
						/>
					</div>
				))}
			</Container>
		</div>
	);
};

export default EmojiReactionScreen;