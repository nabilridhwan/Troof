/** @format */

import { Encryption } from "@troof/encrypt";
import {
	BaseNewMessage,
	MESSAGE_EVENTS,
	MessageUpdatedFromServer,
	SystemMessage,
} from "@troof/socket";
import { useContext, useEffect, useRef, useState } from "react";
import {
	PublicKeyProviderContext,
	UsePublicKeyType,
} from "../context/PublicKeyProvider";
import { SocketProviderContext } from "../context/SocketProvider";

interface UseChatOptions {
	room_id: string;
	display_name: string;
	inputMessage: string;
}

export function useChat({ room_id, display_name, inputMessage }: UseChatOptions) {
	const socket = useContext(SocketProviderContext);
	const { publicKey } = useContext(PublicKeyProviderContext) as UsePublicKeyType;

	const [messages, setMessages] = useState<
		(MessageUpdatedFromServer | SystemMessage)[]
	>([]);
	const [peopleTyping, setPeopleTyping] = useState<string[]>([]);
	const uniquePeopleTyping = Array.from(new Set(peopleTyping));

	const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const doneTypingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	useEffect(() => {
		if (!socket) return;

		socket.emit(MESSAGE_EVENTS.JOIN, { room_id });

		socket.on(MESSAGE_EVENTS.LATEST_MESSAGES, (data) => {
			if (!publicKey) return;
			const decrypted = data.reverse().map((d) => ({
				...d,
				message: Encryption.decryptWithPublic(d.message, publicKey),
			}));
			setMessages([...decrypted]);
		});

		socket.on(MESSAGE_EVENTS.MESSAGE_NEW, (data) => {
			if (!publicKey) return;
			setMessages((old) => [
				...old,
				{
					...data,
					message: Encryption.decryptWithPublic(data.message, publicKey),
				},
			]);
		});

		socket.on("disconnect", () => {
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
		});

		socket.on(MESSAGE_EVENTS.IS_TYPING, (data) => {
			if (data.is_typing) {
				setPeopleTyping((old) => [...old, data.display_name]);
			} else {
				setPeopleTyping((old) =>
					old.filter((person) => person !== data.display_name)
				);
			}
		});
	}, [socket, publicKey, room_id]);

	// Typing indicator
	useEffect(() => {
		if (!socket || inputMessage.trim().length === 0) return;

		if (doneTypingTimeoutRef.current)
			clearTimeout(doneTypingTimeoutRef.current);

		typingTimeoutRef.current = setTimeout(() => {
			socket.emit(MESSAGE_EVENTS.IS_TYPING, {
				room_id,
				display_name,
				is_typing: true,
			});

			doneTypingTimeoutRef.current = setTimeout(() => {
				socket.emit(MESSAGE_EVENTS.IS_TYPING, {
					room_id,
					display_name,
					is_typing: false,
				});
			}, 3500);
		}, 100);
	}, [inputMessage, display_name, room_id, socket]);

	const sendMessage = (
		content: string,
		type: "message" | "reaction",
		replyTo: string | null
	) => {
		if (!publicKey || !socket) return;
		if (content.length > 150) return;

		const encrypted = Encryption.encryptWithPublic(content, publicKey);

		const newMessage: BaseNewMessage = {
			room_id,
			display_name,
			reply_to: replyTo,
			message: encrypted,
			type,
			created_at: new Date(),
		};

		socket.emit(MESSAGE_EVENTS.IS_TYPING, {
			room_id,
			display_name,
			is_typing: false,
		});
		socket.emit(MESSAGE_EVENTS.MESSAGE_NEW, newMessage);
	};

	return {
		messages,
		uniquePeopleTyping,
		sendMessage,
		isReady: !!publicKey,
	};
}
