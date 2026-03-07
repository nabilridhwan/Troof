/** @format */

import {
	BaseNewMessage,
	CHAT_EVENTS,
	MessageUpdatedFromServer,
	SystemMessage,
} from "@troof/socket";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketProviderContext } from "../context/SocketProvider";

interface UseChatOptions {
	room_id: string;
	display_name: string;
	inputMessage: string;
	initialMessages?: MessageUpdatedFromServer[];
}

export function useChat({
	room_id,
	display_name,
	inputMessage,
	initialMessages,
}: UseChatOptions) {
	const socket = useContext(SocketProviderContext);

	const [messages, setMessages] = useState<
		(MessageUpdatedFromServer | SystemMessage)[]
	>(() => {
		if (!initialMessages?.length) {
			return [];
		}

		return [...initialMessages].reverse();
	});
	const [peopleTyping, setPeopleTyping] = useState<string[]>([]);
	const uniquePeopleTyping = Array.from(new Set(peopleTyping));

	const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const doneTypingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	useEffect(() => {
		if (!socket) return;

		const onMessageNew = (data: MessageUpdatedFromServer) => {
			setMessages((old) => [...old, data]);
		};

		const onDisconnect = () => {
			const systemMsg: SystemMessage = {
				message:
					"You have been disconnected from the server. This page will refresh.",
				type: "system",
				display_name: "",
				reply_to: null,
				created_at: new Date(),
				room_id,
			};
			setMessages((old) => [...old, systemMsg]);
		};

		const onIsTyping = (data: { is_typing: boolean; display_name: string }) => {
			if (data.is_typing) {
				setPeopleTyping((old) => [...old, data.display_name]);
				return;
			}

			setPeopleTyping((old) =>
				old.filter((person) => person !== data.display_name)
			);
		};

		socket.on(CHAT_EVENTS.MESSAGE_NEW, onMessageNew);
		socket.on("disconnect", onDisconnect);
		socket.on(CHAT_EVENTS.IS_TYPING, onIsTyping);

		return () => {
			socket.off(CHAT_EVENTS.MESSAGE_NEW, onMessageNew);
			socket.off("disconnect", onDisconnect);
			socket.off(CHAT_EVENTS.IS_TYPING, onIsTyping);
		};
	}, [socket, room_id]);

	// Typing indicator
	useEffect(() => {
		if (!socket || inputMessage.trim().length === 0) return;

		if (doneTypingTimeoutRef.current)
			clearTimeout(doneTypingTimeoutRef.current);

		typingTimeoutRef.current = setTimeout(() => {
			socket.emit(CHAT_EVENTS.IS_TYPING, {
				room_id,
				display_name,
				is_typing: true,
			});

			doneTypingTimeoutRef.current = setTimeout(() => {
				socket.emit(CHAT_EVENTS.IS_TYPING, {
					room_id,
					display_name,
					is_typing: false,
				});
			}, 3500);
		}, 100);

		return () => {
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
			if (doneTypingTimeoutRef.current)
				clearTimeout(doneTypingTimeoutRef.current);
		};
	}, [inputMessage, display_name, room_id, socket]);

	const sendMessage = (
		content: string,
		type: "message" | "reaction",
		replyTo: string | null
	) => {
		if (!socket) return;
		if (content.length > 150) return;

		const newMessage: BaseNewMessage = {
			room_id,
			display_name,
			reply_to: replyTo,
			message: content,
			type,
			created_at: new Date(),
		};

		socket.emit(CHAT_EVENTS.IS_TYPING, {
			room_id,
			display_name,
			is_typing: false,
		});
		socket.emit(CHAT_EVENTS.MESSAGE_NEW, newMessage);
	};

	return {
		messages,
		uniquePeopleTyping,
		sendMessage,
		isReady: true,
	};
}
