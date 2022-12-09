/** @format */

import { logger } from "@troof/logger";
import prisma from "../database/prisma";

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
		const currentPlayer = await Sequence.getCurrentPlayer(roomId);

		if (!currentPlayer) {
			logger.error("No current player found. Aborting setNextPlayer");
			return;
		}

		logger.info(`Current player: ${currentPlayer}`);
		const players = await prisma.player.findMany({
			where: {
				game_room_id: roomId,
			},
			select: {
				player_id: true,
			},
		});

		const currentPlayerIndex = players.findIndex(
			(player) => player.player_id === currentPlayer!.current_player_id
		);
		const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
		const nextPlayer = players[nextPlayerIndex];

		logger.info(`Current player index: ${currentPlayerIndex}`);
		logger.info(`Current player: ${JSON.stringify(currentPlayer)}`);

		logger.info(`Next player index: ${nextPlayerIndex}`);
		logger.info(`Next player: ${JSON.stringify(nextPlayer)}`);

		return await Sequence.setCurrentPlayer(roomId, nextPlayer.player_id);
	},

	// TODO: Export this to external place
	getNextPlayerID: async (roomId: string) => {
		logger.info("Get next player model called");
		const currentPlayer = await Sequence.getCurrentPlayer(roomId);

		if (!currentPlayer) {
			logger.error("No current player found. Aborting setNextPlayer");
			return;
		}

		logger.info(`Current player: ${currentPlayer}`);

		const players = await prisma.player.findMany({
			where: {
				game_room_id: roomId,
			},
			select: {
				player_id: true,
			},
		});

		const currentPlayerIndex = players.findIndex(
			(player) => player.player_id === currentPlayer!.current_player_id
		);
		const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
		const nextPlayer = players[nextPlayerIndex];

		logger.info(`Current player index: ${currentPlayerIndex}`);
		logger.info(`Current player: ${JSON.stringify(currentPlayer)}`);

		logger.info(`Next player index: ${nextPlayerIndex}`);
		logger.info(`Next player: ${JSON.stringify(nextPlayer)}`);

		return nextPlayer.player_id;
	},
};

export default Sequence;
