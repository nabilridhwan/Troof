/** @format */

import {
	BaseNewMessage,
	CHAT_EVENTS,
	MessageUpdatedFromServer,
	PlayerIDObject,
	RoomIDObject,
} from "@troof/socket";

import { Server, Socket } from "socket.io";
import ChatModel from "../model/chat";

import { v4 as generateUUIDv4 } from "uuid";

import { logger } from "@troof/logger";
import PlayerModel from "../model/player";

const messageHandler = (io: Server, socket: Socket) => {
	logger.info("Registered message handler");

	const joinMessageHandler = async (obj: RoomIDObject) => {
		// ! Check if the player is part of the room
		const p = await PlayerModel.getPlayer({
			player_id: socket.data.player_id,
			game_room_id: obj.room_id,
		});

		if (!p) {
			logger.error("Can't join room: Player is not part of the room");
			return;
		}

		socket.join(obj.room_id);

		// Get the latest 10 chat messages
		const messages = await ChatModel.getLatestMessagesByRoomID(obj.room_id);

		// Send the messages back to the client
		socket.emit(CHAT_EVENTS.LATEST_MESSAGES, messages);
	};

	// This method handles new message/reaction
	const newMessageHandler = async (obj: BaseNewMessage) => {
		// ! Check if the player is part of the room
		const p = await PlayerModel.getPlayer({
			player_id: socket.data.player_id,
			game_room_id: obj.room_id,
		});

		if (!p) {
			logger.error("Can't join room: Player is not part of the room");
			return;
		}

		logger.info(obj);
		logger.info(
			`Received new message (${obj.type}). Sending it to ${obj.room_id}`
		);

		// 1. Generate UUID v4
		const u = generateUUIDv4();

		// 2. Update obj with the new UUID
		let new_obj: MessageUpdatedFromServer = {
			...obj,
			id: u,
		};

		if (obj.message.length > 150) {
			logger.error(
				"Won't do anything to this message because it is longer than 150 characters"
			);
			return;
		}

		let outgoingMessage = {
			...new_obj,
			message: obj.message,
		};

		logger.warn(`Sending back ${JSON.stringify(outgoingMessage)}`);

		// ! if it is an reaction, send the unencrypted message to the client via MESSAGE_REACTION for EmojiReactionScreen to handle
		if (obj.type === "reaction") {
			let d = {
				...new_obj,
				message: obj.message,
			};

			// 3. Broadcast it back
			io.to(obj.room_id).emit(CHAT_EVENTS.MESSAGE_REACTION, d);
		}

		// 3. Broadcast it back
		io.to(obj.room_id).emit(CHAT_EVENTS.MESSAGE_NEW, outgoingMessage);

		// 4. Save it to the database
		await ChatModel.pushMessage(outgoingMessage);
	};

	const isTypingHandler = (
		data: PlayerIDObject & RoomIDObject & { is_typing: boolean }
	) => {
		socket.broadcast.to(data.room_id).emit(CHAT_EVENTS.IS_TYPING, {
			...data,
		});
	};

	socket.on(CHAT_EVENTS.IS_TYPING, isTypingHandler);
	// socket.on(CHAT_EVENTS.JOIN, joinMessageHandler);
	socket.on(CHAT_EVENTS.MESSAGE_NEW, newMessageHandler);
};

export default messageHandler;
