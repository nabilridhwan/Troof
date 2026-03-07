/** @format */

import { Prisma } from "@prisma/client";
import prisma from "../database/prisma";

const getNextTurnIndexForRoom = async (
	roomId: string,
	tx: Prisma.TransactionClient
) => {
	const { _max } = await tx.player.aggregate({
		where: {
			game_room_id: roomId,
		},
		_max: {
			turn_index: true,
		},
	});

	const maxTurnIndex = _max.turn_index;
	return (maxTurnIndex ?? -1) + 1;
};

const PlayerModel = {
	getPlayer: async (selectObject: Prisma.playerWhereInput) => {
		return await prisma.player.findFirst({
			where: selectObject,
		});
	},

	getPlayers: async (selectObject: Prisma.playerWhereInput) => {
		return await prisma.player.findMany({
			where: selectObject,
			orderBy: {
				joined_at: "asc",
			},
		});
	},

	getPlayersInRoom: async (roomId: string) => {
		return await PlayerModel.getPlayers({ game_room_id: roomId });
	},

	setPlayerAsPartyLeader: async (playerId: string) => {
		return await prisma.player.update({
			where: {
				player_id: playerId,
			},
			data: {
				is_party_leader: true,
			},
		});
	},

	createPlayer: async (player: Prisma.playerCreateInput) => {
		return await prisma.player.create({
			data: {
				...player,
			},
		});
	},

	createPlayerInRoom: async ({
		roomId,
		displayName,
	}: {
		roomId: string;
		displayName: string;
	}) => {
		return await prisma.$transaction(
			async (tx) => {
				const nextTurnIndex = await getNextTurnIndexForRoom(roomId, tx);

				return await tx.player.create({
					data: {
						display_name: displayName,
						turn_index: nextTurnIndex,
						game: {
							connect: {
								room_id: roomId,
							},
						},
					},
				});
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
			}
		);
	},

	updatePlayerName: async (playerId: string, newName: string) => {
		return await prisma.player.update({
			where: {
				player_id: playerId,
			},
			data: {
				display_name: newName,
			},
		});
	},
};

export default PlayerModel;
