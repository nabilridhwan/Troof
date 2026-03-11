import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
	player: {
		findFirst: vi.fn(),
		findMany: vi.fn(),
	},
	player_sequence: {
		findUnique: vi.fn(),
		upsert: vi.fn(),
		update: vi.fn(),
		create: vi.fn(),
		updateMany: vi.fn(),
	},
	$transaction: vi.fn(),
};

vi.mock("../database/prisma", () => ({
	default: prismaMock,
}));

describe("Sequence model", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sets a selected current player using room-scoped turn index", async () => {
		prismaMock.player.findFirst.mockResolvedValue({
			turn_index: 2,
		});

		prismaMock.player_sequence.upsert.mockResolvedValue({
			current_turn_index: 2,
			version: 4,
		});

		const { default: Sequence } = await import("./sequence");

		const result = await Sequence.setCurrentPlayer("room-1", "player-3");

		expect(prismaMock.player.findFirst).toHaveBeenCalledWith({
			where: {
				player_id: "player-3",
				game_room_id: "room-1",
				turn_index: {
					not: null,
				},
			},
			select: {
				turn_index: true,
			},
		});

		expect(result).toEqual({
			game_room_id: "room-1",
			current_turn_index: 2,
			current_player_id: "player-3",
			version: 4,
		});
	});

	it("advances to the next player turn", async () => {
		const tx = {
			player_sequence: {
				findUnique: vi.fn().mockResolvedValue({
					game_room_id: "room-1",
					current_turn_index: 0,
					version: 7,
				}),
				create: vi.fn(),
				updateMany: vi.fn().mockResolvedValue({ count: 1 }),
			},
			player: {
				findMany: vi.fn().mockResolvedValue([
					{ player_id: "p1", turn_index: 0 },
					{ player_id: "p2", turn_index: 1 },
				]),
			},
		};

		prismaMock.$transaction.mockImplementation(async (callback) => {
			return callback(tx);
		});

		const { default: Sequence } = await import("./sequence");
		const next = await Sequence.setNextPlayer("room-1");

		expect(tx.player_sequence.updateMany).toHaveBeenCalledWith({
			where: {
				game_room_id: "room-1",
				version: 7,
			},
			data: {
				current_turn_index: 1,
				version: {
					increment: 1,
				},
			},
		});

		expect(next).toEqual({
			game_room_id: "room-1",
			current_turn_index: 1,
			current_player_id: "p2",
			version: 8,
		});
	});

	it("returns undefined when no players are available for next turn", async () => {
		const tx = {
			player_sequence: {
				findUnique: vi.fn().mockResolvedValue({
					game_room_id: "room-1",
					current_turn_index: 0,
					version: 1,
				}),
				create: vi.fn(),
				updateMany: vi.fn(),
			},
			player: {
				findMany: vi.fn().mockResolvedValue([]),
			},
		};

		prismaMock.$transaction.mockImplementation(async (callback) => {
			return callback(tx);
		});

		const { default: Sequence } = await import("./sequence");
		const next = await Sequence.setNextPlayer("room-1");

		expect(next).toBeUndefined();
		expect(tx.player_sequence.updateMany).not.toHaveBeenCalled();
	});
});
