import { IconSend } from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import {
	Message,
	MessageUpdate,
	MESSAGE_EVENTS,
	SystemMessage,
} from "../../Types";

interface ChatBoxProps {
	room_id: string;
	player_id: string;
}

const ChatBox = ({ room_id, player_id }: ChatBoxProps) => {
	const { socket } = useSocket();

	const [messages, setMessages] = useState<(MessageUpdate | SystemMessage)[]>(
		[]
	);
	const [inputMessage, setInputMessage] = useState("");

	const messagesBoxRefElement = useRef<HTMLDivElement>(null);
	const lastMessageElementRef = useRef<HTMLDivElement>(null);

	const sendMessage = (messageType: Message["type"]) => {
		setInputMessage("");

		const newMessageObject: Message = {
			room_id,
			player_id,
			message: inputMessage,
			type: messageType,
			created_at: new Date(),
		};

		if (socket) {
			console.log("Emitting new message");

			// Emit to socket
			socket.emit(MESSAGE_EVENTS.MESSAGE_NEW, newMessageObject);
		}
	};

	useEffect(() => {
		if (socket) {
			console.log("Emitting joined chatbox");

			socket.emit(MESSAGE_EVENTS.JOIN, {
				room_id,
			});

			socket.on(MESSAGE_EVENTS.MESSAGE_NEW, (data) => {
				setMessages((oldMessages) => [...oldMessages, data]);
			});

			socket.on(MESSAGE_EVENTS.MESSAGE_SYSTEM, (data) => {
				setMessages((oldMessages) => [...oldMessages, data]);
			});
		}
	}, [socket]);

	useEffect(() => {
		if (messagesBoxRefElement.current && lastMessageElementRef.current) {
			messagesBoxRefElement.current.scrollBy({
				top: 100000,
				behavior: "smooth",
			});
		}
	}, [messages]);

	const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (inputMessage.length > 0) {
			sendMessage("message");
		}
	};

	return (
		<div>
			<div
				ref={messagesBoxRefElement}
				className="h-[300px] bg-black/5 p-3 rounded-xl overflow-auto mb-2"
			>
				{!messages.length && (
					<p className="text-center text-gray-500">
						No messages yet. Say something!
					</p>
				)}
				{messages.map(
					(message: MessageUpdate | SystemMessage, index) => {
						return (
							<div
								key={index}
								ref={
									index === messages.length - 1
										? lastMessageElementRef
										: null
								}
							>
								{message.type === "message" && (
									<>
										{message.player_id === player_id ? (
											<div className="flex flex-row justify-end my-1">
												<div className="bg-gray-50 w-fit p-2 rounded-lg">
													<p>{message.message}</p>
													<div />
												</div>
											</div>
										) : (
											<div className="flex flex-row justify-start my-1 ">
												<div className="bg-blue-500 text-white/95 w-fit p-2 rounded-lg">
													<p className="text-xs font-bold ">
														{
															message.player
																.display_name
														}
													</p>

													<p>{message.message}</p>

													<div />
												</div>
											</div>
										)}
									</>
								)}

								{message.type === "system" && (
									<div className="text-xs flex flex-row justify-center my-5">
										<div className="bg-black/10 w-fit p-2 rounded-lg">
											<p>{message.message}</p>
										</div>
									</div>
								)}
							</div>
						);
					}
				)}
			</div>

			<form onSubmit={handleMessageSubmit}>
				<div className="flex gap-2">
					<input
						tabIndex={0}
						placeholder="Type a message..."
						className="flex-1 h-[10px]"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
					/>

					<button className="bg-blue-500 rounded-lg px-4 text-white">
						<IconSend size={18} />
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatBox;
