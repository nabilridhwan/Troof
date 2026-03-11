import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
	player: {
		aggregate: vi.fn(),
		create: vi.fn(),
	},
	$transaction: vi.fn(),
};

vi.mock("../database/prisma", () => ({
	default: prismaMock,
}));

describe("PlayerModel.createPlayerInRoom", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("assigns the next turn index for a new player", async () => {
		prismaMock.player.aggregate.mockResolvedValue({
			_max: {
				turn_index: 2,
			},
		});

		prismaMock.player.create.mockResolvedValue({
			player_id: "p-3",
			display_name: "Carol",
			turn_index: 3,
		});

		prismaMock.$transaction.mockImplementation(async (callback) => {
			return callback(prismaMock);
		});

		const { default: PlayerModel } = await import("./player");

		const player = await PlayerModel.createPlayerInRoom({
			roomId: "room-1",
			displayName: "Carol",
		});

		expect(prismaMock.player.aggregate).toHaveBeenCalledWith({
			where: {
				game_room_id: "room-1",
			},
			_max: {
				turn_index: true,
			},
		});

		expect(prismaMock.player.create).toHaveBeenCalledWith({
			data: {
				display_name: "Carol",
				turn_index: 3,
				game: {
					connect: {
						room_id: "room-1",
					},
				},
			},
		});

		expect(player).toMatchObject({
			player_id: "p-3",
			turn_index: 3,
		});
	});

	it("starts at turn index 0 when room has no indexed players", async () => {
		prismaMock.player.aggregate.mockResolvedValue({
			_max: {
				turn_index: null,
			},
		});

		prismaMock.player.create.mockResolvedValue({
			player_id: "p-1",
			display_name: "Alice",
			turn_index: 0,
		});

		prismaMock.$transaction.mockImplementation(async (callback) => {
			return callback(prismaMock);
		});

		const { default: PlayerModel } = await import("./player");

		const player = await PlayerModel.createPlayerInRoom({
			roomId: "room-2",
			displayName: "Alice",
		});

		expect(prismaMock.player.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					turn_index: 0,
				}),
			})
		);

		expect(player.turn_index).toBe(0);
	});
});
