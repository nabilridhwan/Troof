import { Server, Socket } from "socket.io";
import prisma from "../database/prisma";
import { getNextPlayer } from "../utils/getNextPlayer";
import { TRUTH_OR_DARE_GAME } from "./events.types";

interface IRoomID {
	room_id: string;
}

interface IPlayer {
	player_id: string;
}

const truthOrDareHandler = (io: Server, socket: Socket) => {
	const joinHandler = async (obj: IRoomID) => {
		console.log(`Received joined room ${obj.room_id}`);

		// Obtain the logs
		const logData = await prisma.log.findFirst({
			where: {
				game_room_id: obj.room_id,
			},
			orderBy: {
				created_at: "desc",
			},
		});

		const sequenceData = await prisma.player_sequence.findFirst({
			where: {
				game_room_id: obj.room_id,
			},
		});

		// Broadcast the log to the room
		console.log("Broadcasting back");
		socket.emit(TRUTH_OR_DARE_GAME.INCOMING_DATA, {
			...logData,
			player_id: sequenceData?.current_player_id,
		});
	};

	const truthHandler = async (obj: IRoomID & IPlayer) => {
		console.log(`Truth received from ${obj.player_id}`);
		// Emit a dare to the room for the player
		const truth = `Truth ${Math.floor(Math.random() * 100)}`;

		// Find the player
		const sequenceData = await prisma.player_sequence.findFirst({
			where: {
				game_room_id: obj.room_id,
			},
		});

		if (!sequenceData) return;

		const { sequence, current_player_id } = sequenceData;

		if (!sequence) return;

		// Write to the database the next person's turn
		const nextPlayerID = getNextPlayer(
			current_player_id,
			sequence as string[]
		);

		await prisma.player_sequence.update({
			where: {
				game_room_id: obj.room_id,
			},
			data: {
				current_player_id: nextPlayerID,
			},
		});

		// Write to log
		const logData = await prisma.log.create({
			data: {
				game_room_id: obj.room_id,
				player_id: sequenceData.current_player_id,
				action: "truth",
				data: truth,
			},
			select: {
				action: true,
				data: true,
				player_id: true,
			},
		});

		io.emit(TRUTH_OR_DARE_GAME.INCOMING_DATA, {
			...logData,
		});
	};

	const dareHandler = async (obj: IRoomID & IPlayer) => {
		console.log(`Dare received from ${obj.player_id}`);

		// Emit a dare to the room for the player
		const dare = `Dare ${Math.floor(Math.random() * 100)}`;

		// Find the player
		const sequenceData = await prisma.player_sequence.findFirst({
			where: {
				game_room_id: obj.room_id,
			},
		});

		if (!sequenceData) return;

		const { sequence, current_player_id } = sequenceData;

		if (!sequence) return;

		// Write to the database the next person's turn
		const nextPlayerID = getNextPlayer(
			current_player_id,
			sequence as string[]
		);

		await prisma.player_sequence.update({
			where: {
				game_room_id: obj.room_id,
			},
			data: {
				current_player_id: nextPlayerID,
			},
		});

		console.log("Done updating sequence");

		// Write to log
		const logData = await prisma.log.create({
			data: {
				game_room_id: obj.room_id,
				player_id: sequenceData.current_player_id,
				action: "dare",
				data: dare,
			},
			select: {
				action: true,
				data: true,
				player_id: true,
			},
		});

		io.emit(TRUTH_OR_DARE_GAME.INCOMING_DATA, {
			...logData,
		});
	};

	socket.on(TRUTH_OR_DARE_GAME.SELECT_TRUTH, truthHandler);
	socket.on(TRUTH_OR_DARE_GAME.SELECT_DARE, dareHandler);
	socket.on(TRUTH_OR_DARE_GAME.JOINED, joinHandler);
};

export default truthOrDareHandler;
