/** @format */

import { CHAT_EVENTS } from "@troof/socket";
import { useContext, useEffect, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";

interface EmojisState {
	emoji: string;
	positionX: number;
	delay: number;
	size: number;
}

const NUMBER_OF_EMOJIS = 30;

interface UseEmojiReactionOptions {
	room_id: string;
}

export function useEmojiReaction({ room_id }: UseEmojiReactionOptions) {
	const socket = useContext(SocketProviderContext);
	const [emojis, setEmojis] = useState<EmojisState[]>([]);

	useEffect(() => {
		if (!socket) return;

		const onMessageReaction = (data: { message: string }) => {
			const burst = Array.from({ length: NUMBER_OF_EMOJIS }).map(() => ({
				emoji: data.message,
				positionX: Math.floor(Math.random() * window.innerWidth),
				delay: Math.random() * 2000,
				size: Math.floor(Math.random() * 10) + 30,
			}));

			setEmojis((old) => [...old, ...burst]);
		};

		socket.on(CHAT_EVENTS.MESSAGE_REACTION, onMessageReaction);

		return () => {
			socket.off(CHAT_EVENTS.MESSAGE_REACTION, onMessageReaction);
		};
	}, [socket, room_id]);

	return { emojis };
}
