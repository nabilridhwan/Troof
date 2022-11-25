import { Server, Socket } from "socket.io";
import prisma from "../database/prisma";
import { STATUS } from "../utils/GameDataTypes";
import { EVENTS } from "./events.types";

interface IRoomID {
	room_id: string;
}

interface DisconnectedRoom extends IRoomID {
	player_id: string;
}

interface StatusChange extends IRoomID {
	status: STATUS;
}

const roomHandler = (io: Server, socket: Socket) => {
	const joinRoomHandler = async (obj: IRoomID) => {
		// Join the room ID
		socket.join(obj.room_id);

		// Find all the players in the room
		const players = await prisma.player.findMany({
			where: {
				game_room_id: obj.room_id,
			},
		});

		const game = await prisma.game.findFirst({
			where: {
				room_id: obj.room_id,
			},
		});

		// Broadcast back the room
		io.to(obj.room_id).emit(EVENTS.ROOM_PLAYERS_UPDATE, players);

		if (game) {
			// Broadcast status
			io.to(obj.room_id).emit(EVENTS.STATUS_CHANGE, {
				status: game.status,
			});
		}
	};

	const disconnectedHandler = async (obj: DisconnectedRoom) => {
		console.log(`Disconnected received from ${obj.player_id}`);
		// Remove the player from the room

		// await prisma.player.delete({
		// 	where: {
		// 		player_id: obj.player_id,
		// 	},
		// });

		// Find all the players in the room
		const players = await prisma.player.findMany({
			where: {
				game_room_id: obj.room_id,
			},
		});

		// Broadcast back to each room the latest players
		io.to(obj.room_id).emit(EVENTS.ROOM_PLAYERS_UPDATE, players);
	};

	const statusChangeHandler = async (obj: StatusChange) => {
		console.log(
			`Status changed to ${obj.status} received for ${obj.room_id}`
		);
		// Write to database that the game has started
		const { status } = await prisma.game.update({
			where: {
				room_id: obj.room_id,
			},
			data: {
				status: obj.status,
			},

			select: {
				status: true,
			},
		});

		// Broadcast to the room that the game has started
		io.to(obj.room_id).emit(EVENTS.STATUS_CHANGE, { status });
	};

	socket.on(EVENTS.STATUS_CHANGE, statusChangeHandler);
	socket.on(EVENTS.DISCONNECTED, disconnectedHandler);
	socket.on(EVENTS.JOIN_ROOM, joinRoomHandler);
};

export default roomHandler;
