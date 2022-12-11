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

const messageHandler = (io: Server, socket: Socket) => {
	logger.info("Registered message handler");

	const joinMessageHandler = async (obj: RoomIDObject) => {
		socket.join(obj.room_id);

		// Get the latest 10 chat messages
		const messages = await ChatModel.getLatestMessagesByRoomID(obj.room_id);

		// Send the messages back to the client
		// The messages will be decrypted on the client side
		socket.emit(MESSAGE_EVENTS.LATEST_MESSAGES, messages);
	};

	// This method handles new message/reaction
	const newMessageHandler = async (obj: BaseNewMessage) => {
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

		console.log(keyRes.private);

		// Decrypt the message
		const decryptedMessage = Encryption.decryptWithPrivate(
			obj.message,
			keyRes.private
		);

		logger.warn(decryptedMessage);

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

		// 3. Broadcast it back
		io.to(obj.room_id).emit(MESSAGE_EVENTS.MESSAGE_NEW, privateEncryptedObj);

		// 4. Save it to the database (The private encrypted message)
		await ChatModel.pushMessage(privateEncryptedObj);
	};

	const isTypingHandler = (
		data: PlayerIDObject & RoomIDObject & { is_typing: boolean }
	) => {
		socket.broadcast.emit(MESSAGE_EVENTS.IS_TYPING, {
			...data,
		});
	};

	socket.on(MESSAGE_EVENTS.IS_TYPING, isTypingHandler);
	socket.on(MESSAGE_EVENTS.JOIN, joinMessageHandler);
	socket.on(MESSAGE_EVENTS.MESSAGE_NEW, newMessageHandler);
};

export default messageHandler;
