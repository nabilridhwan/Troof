import { Server, Socket } from "socket.io";
import prisma from "../database/prisma";
import { TRUTH_OR_DARE_GAME } from "./events.types";

interface IRoomID {
	room_id: string;
}

interface IPlayer {
	player_id: string;
}

const truthOrDareHandler = (io: Server, socket: Socket) => {
	const truthHandler = async (obj: IRoomID & IPlayer) => {
		// Emit a dare to the room for the player
		const truth = `Truth ${Math.floor(Math.random() * 100)}`;

		// Find the player
		const player = await prisma.player.findFirst({
			where: {
				player_id: obj.player_id,
			},
		});

		io.to(obj.room_id).emit(TRUTH_OR_DARE_GAME.NEW_DATA, {
			player,
			data: truth,
		});
	};

	const nextPlayerHandler = async (obj: IRoomID) => {
		// Find the player in the room that is next
		const player = await prisma.player.findMany({
			where: {
				game_room_id: obj.room_id,
			},
		});

		// Randomly select a player from the room using Math.random()
		const randomPlayer = player[Math.floor(Math.random() * player.length)];

		// Emit the player to the room
		io.to(obj.room_id).emit(TRUTH_OR_DARE_GAME.CURRENT_TURN, randomPlayer);
	};

	socket.on(TRUTH_OR_DARE_GAME.TRUTH, truthHandler);
	socket.on(TRUTH_OR_DARE_GAME.CURRENT_TURN, nextPlayerHandler);
};

export default truthOrDareHandler;
