/** @format */

import { Prisma } from "@prisma/client";
import { Encryption } from "@troof/encrypt";
import { logger } from "@troof/logger";
import { Action, Status } from "@troof/socket";
import prisma from "../database/prisma";
import Sequence from "./sequence";

const RoomModel = {
	deleteRoom: async (roomId: string) => {
		logger.warn(`Delete room called, deleting room with id ${roomId}`);
		return await prisma.game.delete({
			where: {
				room_id: roomId,
			},
		});
	},

	getNumberOfPeopleInRoom: async (roomId: string) => {
		const players = await prisma.player.aggregate({
			where: {
				game_room_id: roomId,
			},

			_count: {
				player_id: true,
			},
		});

		return players._count;
	},

	getRoom: async (selectObject: Prisma.gameWhereInput) => {
		return await prisma.game.findFirst({
			where: selectObject,
		});
	},

	getRooms: async (selectObject: Prisma.gameWhereInput) => {
		return await prisma.game.findMany({
			where: selectObject,
		});
	},

	createNewRoom: async (
		roomId: string,
		player: Omit<
			Prisma.playerCreateInput,
			"is_party_leader" | "game" | "player_id"
		>
	) => {
		// ! Generate key pair

		logger.warn("Generating key pair");
		const keys = await Encryption.generateKeyPair();
		logger.warn("Generated key pair");

		const { private: privK, public: pubK } = keys;

		// Create the game
		const currentPlayersInGame = await prisma.game.create({
			data: {
				room_id: roomId,
				status: Status.In_Lobby,
				player: {
					create: {
						...player,
						is_party_leader: true,
					},
				},
				keys: {
					create: {
						private: privK,
						public: pubK,
					},
				},
			},

			select: {
				player: true,
			},
		});

		// Select the first player in the game
		const currentPlayer = currentPlayersInGame.player[0];

		// Create the first log
		await prisma.log.create({
			data: {
				game_room_id: roomId,
				player_id: currentPlayer.player_id,
				action: Action.Waiting_For_Selection,
				data: "",
			},
		});

		// Set the current player of the sequence
		await Sequence.setCurrentPlayer(roomId, currentPlayer.player_id);

		return {
			room_id: roomId,
			player: currentPlayer,
		};
	},

	removePlayerFromRoom: async (roomId: string, playerId: string) => {
		const remainingPlayers = await prisma.player.delete({
			where: {
				player_id: playerId,
			},
			select: {
				game: {
					select: {
						player: true,
					},
				},
			},
		});

		return remainingPlayers.game.player;
	},

	updateRoomStatus: async (roomId: string, status: Status) => {
		const game = await prisma.game.update({
			where: {
				room_id: roomId,
			},
			data: {
				status: status,
				status_updated_at: new Date(),
			},
		});

		return game;
	},

	startGame: async (roomId: string) => {
		return await RoomModel.updateRoomStatus(roomId, Status.In_Game);
	},

	updateRoomLeader: async (roomId: string, playerId: string) => {
		logger.info(`Updating room leader to ${playerId}`);
		logger.info(`Setting all players to not be the leader`);

		// Set all players to not be the leader
		await prisma.player.updateMany({
			where: {
				game_room_id: roomId,
			},
			data: {
				is_party_leader: false,
			},
		});

		logger.info(`Updating the player to be the leader`);

		const latestPlayersAfterChanging = await prisma.game.update({
			where: {
				room_id: roomId,
			},
			data: {
				player: {
					update: {
						where: {
							player_id: playerId,
						},
						data: {
							is_party_leader: true,
						},
					},
				},
			},
			select: {
				player: {
					where: {
						game_room_id: roomId,
					},
				},
			},
		});

		logger.info(`Done updating the room leader`);

		return latestPlayersAfterChanging;
	},
};

export default RoomModel;
