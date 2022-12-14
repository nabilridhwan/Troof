/** @format */

import { logger } from "@troof/logger";
import { MessageUpdatedFromServer, SystemMessage } from "@troof/socket";
import prisma from "../database/prisma";

const ChatModel = {
	pushSystemMessage: async (message: SystemMessage) => {
		logger.error(
			"Not pushing system message. System message are not supported."
		);
		// const { room_id, message: messageText, type } = message;

		// // Encrypt the message
		// const keyRes = await prisma.keys.findFirst({
		// 	where: {
		// 		room_id,
		// 	},
		// 	select: {
		// 		public: true,
		// 	},
		// });

		// if (!keyRes) {
		// 	logger.error(
		// 		`No private key found for ${room_id} while trying to save system message`
		// 	);
		// 	return;
		// }

		// return await prisma.chat.create({
		// 	data: {
		// 		room_id,
		// 		message: Encryption.encryptWithPublic(messageText, keyRes.public),
		// 		type,
		// 	},
		// });
	},

	pushMessage: async (message: MessageUpdatedFromServer) => {
		const {
			room_id,
			message: messageText,
			type,
			reply_to,
			id,
			display_name,
		} = message;

		return await prisma.chat.create({
			data: {
				id,
				room_id,
				display_name,
				message: messageText,
				type,
				reply_to,
			},
		});
	},

	getLatestMessagesByRoomID: async (room_id: string) => {
		return await prisma.chat.findMany({
			where: {
				room_id,
			},
			select: {
				created_at: true,
				type: true,
				message: true,
				room_id: true,
				player_id: true,
				display_name: true,
				id: true,
				reply_to: true,
			},
			take: 30,
			orderBy: {
				created_at: "desc",
			},
		});
	},
};

export default ChatModel;
