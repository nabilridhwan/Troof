import { MESSAGE_EVENTS } from "@troof/socket";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { SocketProviderContext } from "../../context/SocketProvider";
import Container from "../Container";

interface EmojiReactionScreenProps {
	room_id: string;
}

interface EmojisState {
	emoji: string;
	positionX: number;
	delay: number;
	size: number;
}

const numberOfEmojis = 30;

const EmojiReactionScreen = ({ room_id }: EmojiReactionScreenProps) => {
	const socket = useContext(SocketProviderContext);

	const [emojis, setEmojis] = useState<EmojisState[]>([]);

	// const [emojisWithFinishedAnimations, setEmojisWithFinishedAnimations] =
	useState(0);
	// const [totalEmojisOnScreen, setTotalEmojisOnScreen] = useState(0);

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

				const finalArray = Array.from({ length: numberOfEmojis }).map(
					(_, index) => ({
						emoji: data.message,
						positionX: Math.floor(
							Math.random() * window.innerWidth
						),
						delay: Math.random() * 2000,

						size: Math.floor(Math.random() * 10) + 30,
					})
				);

				// setTotalEmojisOnScreen((prev) => prev + numberOfEmojis);

				console.log(finalArray);

				setEmojis((oldEmojis) => [...oldEmojis, ...finalArray]);

				socket.on("disconnect", () => {
					// socket.disconnect();
				});
			});
		}

		return () => {
			if (socket) {
				// socket.disconnect();
			}
		};
	}, [socket, room_id]);

	return (
		<div
			id="emoji-reaction-screen"
			className="fixed w-screen h-screen bg-transparent top-0 left-0 overflow-hidden pointer-events-none z-50"
		>
			<Container>
				{emojis.map((emoji, index) => (
					<div
						key={index}
						className={`z-50 animate-drop absolute top-0 overflow-hidden pointer-events-none`}
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
