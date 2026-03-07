/** @format */

import { logger } from "@troof/logger";
import prisma from "../database/prisma";

const getOrderedPlayersInRoom = async (roomId: string) => {
	return await prisma.player.findMany({
		where: {
			game_room_id: roomId,
		},
		select: {
			player_id: true,
		},
		orderBy: [{ joined_at: "asc" }, { player_id: "asc" }],
	});
};

const getNextPlayerId = async (roomId: string) => {
	const currentPlayer = await prisma.player_sequence.findFirst({
		where: {
			game_room_id: roomId,
		},
		select: {
			current_player_id: true,
		},
	});

	if (!currentPlayer) {
		logger.error("No current player found in sequence");
		return;
	}

	const players = await getOrderedPlayersInRoom(roomId);

	if (players.length === 0) {
		logger.warn(`No active players found in room ${roomId}`);
		return;
	}

	const currentPlayerIndex = players.findIndex(
		(player) => player.player_id === currentPlayer.current_player_id
	);

	if (currentPlayerIndex === -1) {
		logger.warn(
			`Current player ${currentPlayer.current_player_id} is not active in room ${roomId}; wrapping to first active player`
		);
		return players[0].player_id;
	}

	const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
	return players[nextPlayerIndex].player_id;
};

const Sequence = {
	setCurrentPlayer: async (roomId: string, playerId: string) => {
		logger.info(
			`Set current player model called: Setting ${playerId} to be the current player`
		);
		return await prisma.player_sequence.upsert({
			where: {
				game_room_id: roomId,
			},

			update: {
				current_player_id: playerId,
			},

			create: {
				game_room_id: roomId,
				current_player_id: playerId,
			},
		});
	},

	getCurrentPlayer: async (roomId: string) => {
		return await prisma.player_sequence.findFirst({
			where: {
				game_room_id: roomId,
			},
		});
	},

	setNextPlayer: async (roomId: string) => {
		logger.info("Set next player model called");
		const nextPlayerId = await getNextPlayerId(roomId);

		if (!nextPlayerId) {
			logger.error("No next player found. Aborting setNextPlayer");
			return;
		}

		logger.info(`Next player: ${nextPlayerId}`);
		return await Sequence.setCurrentPlayer(roomId, nextPlayerId);
	},

	// TODO: Export this to external place
	getNextPlayerID: async (roomId: string) => {
		logger.info("Get next player model called");
		const nextPlayerId = await getNextPlayerId(roomId);

		if (!nextPlayerId) {
			logger.error("No next player found. Aborting getNextPlayerID");
			return;
		}

		logger.info(`Next player id: ${nextPlayerId}`);
		return nextPlayerId;
	},
};

export default Sequence;
