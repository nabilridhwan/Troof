/** @format */

import {
	BaseNewMessage,
	MessageUpdatedFromServer,
	MESSAGE_EVENTS,
	PlayerIDObject,
	RoomIDObject,
} from "@troof/socket";

import { Server, Socket } from "socket.io";
import ChatModel from "../model/chat";

import { v4 as generateUUIDv4 } from "uuid";

import { Encryption } from "@troof/encrypt";
import { logger } from "@troof/logger";
import prisma from "../database/prisma";
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
		// The messages will be decrypted on the client side
		socket.emit(MESSAGE_EVENTS.LATEST_MESSAGES, messages);
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

		const keyRes = await prisma.keys.findFirst({
			where: {
				room_id: obj.room_id,
			},
			select: {
				private: true,
			},
		});

		if (!keyRes) {
			logger.error(
				`No private key found for ${obj.room_id} while trying to emit back new message to client`
			);
			return;
		}

		// Decrypt the message
		const decryptedMessage = Encryption.decryptWithPrivate(
			obj.message,
			keyRes.private
		);

		if (decryptedMessage.length > 150) {
			logger.error(
				"Won't do anything to this message because it is longer than 150 characters"
			);
			return;
		}

		// Encrypt the message with the private key
		const privateEncryptedMessage = Encryption.encryptWithPrivate(
			decryptedMessage,
			keyRes.private
		);

		logger.warn(privateEncryptedMessage);

		let privateEncryptedObj = {
			...new_obj,
			message: privateEncryptedMessage,
		};

		logger.warn(`Sending back ${JSON.stringify(privateEncryptedObj)}`);

		// ! if it is an reaction, send the unencrypted message to the client via MESSAGE_REACTION for EmojiReactionScreen to handle
		if (obj.type === "reaction") {
			let d = {
				...new_obj,
				message: decryptedMessage,
			};

			// 3. Broadcast it back
			io.to(obj.room_id).emit(MESSAGE_EVENTS.MESSAGE_REACTION, d);
		}

		// 3. Broadcast it back
		io.to(obj.room_id).emit(MESSAGE_EVENTS.MESSAGE_NEW, privateEncryptedObj);

		// 4. Save it to the database (The private encrypted message)
		await ChatModel.pushMessage(privateEncryptedObj);
	};

	const isTypingHandler = (
		data: PlayerIDObject & RoomIDObject & { is_typing: boolean }
	) => {
		socket.broadcast.to(data.room_id).emit(MESSAGE_EVENTS.IS_TYPING, {
			...data,
		});
	};

	socket.on(MESSAGE_EVENTS.IS_TYPING, isTypingHandler);
	socket.on(MESSAGE_EVENTS.JOIN, joinMessageHandler);
	socket.on(MESSAGE_EVENTS.MESSAGE_NEW, newMessageHandler);
};

export default messageHandler;
