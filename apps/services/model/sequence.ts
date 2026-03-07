/** @format */

import { logger } from "@troof/logger";
import prisma from "../database/prisma";

type SequencePlayer = {
	player_id: string;
	turn_index: number | null;
};

type SequenceState = {
	game_room_id: string;
	current_turn_index: number;
	current_player_id: string;
	version: number;
};

const getOrderedPlayersInRoom = async (roomId: string) => {
	return await prisma.player.findMany({
		where: {
			game_room_id: roomId,
			turn_index: {
				not: null,
			},
		},
		select: {
			player_id: true,
			turn_index: true,
		},
		orderBy: [{ turn_index: "asc" }, { joined_at: "asc" }, { player_id: "asc" }],
	});
};

const resolveCurrentPlayerFromState = (
	players: SequencePlayer[],
	currentTurnIndex: number
) => {
	const exactMatch = players.find(
		(player) => player.turn_index === currentTurnIndex
	);

	if (exactMatch) {
		return {
			player: exactMatch,
			resolvedTurnIndex: currentTurnIndex,
		};
	}

	const firstPlayer = players[0];
	if (!firstPlayer || firstPlayer.turn_index === null) {
		return;
	}

	return {
		player: firstPlayer,
		resolvedTurnIndex: firstPlayer.turn_index,
	};
};

const resolveNextPlayerFromState = (
	players: SequencePlayer[],
	currentTurnIndex: number
) => {
	const currentIdx = players.findIndex(
		(player) => player.turn_index === currentTurnIndex
	);

	if (currentIdx === -1) {
		return players[0];
	}

	const nextIdx = (currentIdx + 1) % players.length;
	return players[nextIdx];
};

const buildSequenceState = (
	roomId: string,
	player: SequencePlayer,
	currentTurnIndex: number,
	version: number
): SequenceState | undefined => {
	if (player.turn_index === null) {
		return;
	}

	return {
		game_room_id: roomId,
		current_turn_index: currentTurnIndex,
		current_player_id: player.player_id,
		version,
	};
};

const ensureSequenceState = async (roomId: string) => {
	const players = await getOrderedPlayersInRoom(roomId);

	if (players.length === 0) {
		logger.warn(`No players with turn_index found in room ${roomId}`);
		return;
	}

	const firstTurnIndex = players[0].turn_index;
	if (firstTurnIndex === null) {
		logger.error(`Cannot initialize sequence for room ${roomId}`);
		return;
	}

	return await prisma.player_sequence.upsert({
		where: {
			game_room_id: roomId,
		},
		update: {},
		create: {
			game_room_id: roomId,
			current_turn_index: firstTurnIndex,
		},
	});
};

const getCurrentSequenceState = async (roomId: string) => {
	let sequence = await prisma.player_sequence.findUnique({
		where: {
			game_room_id: roomId,
		},
	});

	if (!sequence) {
		sequence = (await ensureSequenceState(roomId)) ?? null;
	}

	if (!sequence) {
		return;
	}

	const players = await getOrderedPlayersInRoom(roomId);

	if (players.length === 0) {
		logger.warn(`No active players found in room ${roomId}`);
		return;
	}

	const resolved = resolveCurrentPlayerFromState(
		players,
		sequence.current_turn_index
	);

	if (!resolved) {
		logger.error(`Unable to resolve current player in room ${roomId}`);
		return;
	}

	const { player, resolvedTurnIndex } = resolved;

	if (resolvedTurnIndex !== sequence.current_turn_index) {
		sequence = await prisma.player_sequence.update({
			where: {
				game_room_id: roomId,
			},
			data: {
				current_turn_index: resolvedTurnIndex,
				version: {
					increment: 1,
				},
			},
		});
	}

	return buildSequenceState(
		roomId,
		player,
		resolvedTurnIndex,
		sequence.version
	);
};

const Sequence = {
	setCurrentPlayer: async (roomId: string, playerId: string) => {
		logger.info(
			`Set current player model called: Setting ${playerId} to be the current player`
		);

		const player = await prisma.player.findFirst({
			where: {
				player_id: playerId,
				game_room_id: roomId,
				turn_index: {
					not: null,
				},
			},
			select: {
				turn_index: true,
			},
		});

		if (!player || player.turn_index === null) {
			logger.error(
				`Cannot set current player ${playerId} for room ${roomId}; missing room-scoped turn_index`
			);
			return;
		}

		const sequence = await prisma.player_sequence.upsert({
			where: {
				game_room_id: roomId,
			},

			update: {
				current_turn_index: player.turn_index,
				version: {
					increment: 1,
				},
			},

			create: {
				game_room_id: roomId,
				current_turn_index: player.turn_index,
			},
		});

		return {
			game_room_id: roomId,
			current_turn_index: sequence.current_turn_index,
			current_player_id: playerId,
			version: sequence.version,
		};
	},

	getCurrentPlayer: async (roomId: string) => {
		return await getCurrentSequenceState(roomId);
	},

	setNextPlayer: async (roomId: string) => {
		logger.info("Set next player model called");

		for (let attempt = 0; attempt < 3; attempt += 1) {
			const nextPlayer = await prisma.$transaction(async (tx) => {
				let sequence = await tx.player_sequence.findUnique({
					where: {
						game_room_id: roomId,
					},
				});

				const players = await tx.player.findMany({
					where: {
						game_room_id: roomId,
						turn_index: {
							not: null,
						},
					},
					select: {
						player_id: true,
						turn_index: true,
					},
					orderBy: [{ turn_index: "asc" }, { joined_at: "asc" }, { player_id: "asc" }],
				});

				if (players.length === 0) {
					return;
				}

				if (!sequence) {
					const firstPlayer = players[0];
					if (firstPlayer.turn_index === null) {
						return;
					}

					sequence = await tx.player_sequence.create({
						data: {
							game_room_id: roomId,
							current_turn_index: firstPlayer.turn_index,
						},
					});
				}

				const next = resolveNextPlayerFromState(players, sequence.current_turn_index);
				if (!next || next.turn_index === null) {
					return;
				}

				const updated = await tx.player_sequence.updateMany({
					where: {
						game_room_id: roomId,
						version: sequence.version,
					},
					data: {
						current_turn_index: next.turn_index,
						version: {
							increment: 1,
						},
					},
				});

				if (updated.count === 0) {
					return;
				}

				return {
					game_room_id: roomId,
					current_turn_index: next.turn_index,
					current_player_id: next.player_id,
					version: sequence.version + 1,
				};
			});

			if (nextPlayer) {
				logger.info(`Next player: ${nextPlayer.current_player_id}`);
				return nextPlayer;
			}

			logger.warn(
				`setNextPlayer contention/missing-state for room ${roomId}, retrying attempt ${attempt + 1}`
			);
		}

		logger.error("No next player found. Aborting setNextPlayer");
		return;
	},

	getNextPlayerID: async (roomId: string) => {
		logger.info("Get next player model called");

		const sequence = await getCurrentSequenceState(roomId);
		if (!sequence) {
			logger.error("No current sequence found. Aborting getNextPlayerID");
			return;
		}

		const players = await getOrderedPlayersInRoom(roomId);
		if (players.length === 0) {
			logger.error("No players found. Aborting getNextPlayerID");
			return;
		}

		const nextPlayer = resolveNextPlayerFromState(
			players,
			sequence.current_turn_index
		);
		if (!nextPlayer) {
			logger.error("No next player found. Aborting getNextPlayerID");
			return;
		}

		logger.info(`Next player id: ${nextPlayer.player_id}`);
		return nextPlayer.player_id;
	},
};

export default Sequence;
