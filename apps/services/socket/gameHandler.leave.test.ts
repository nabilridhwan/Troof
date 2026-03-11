import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	CHAT_EVENTS,
	ROOM_EVENTS,
	Status,
	TRUTH_OR_DARE_EVENTS,
} from "@troof/socket";

const pushSystemMessageMock = vi.fn();

vi.mock("../model/chat", () => ({
	default: {
		pushSystemMessage: pushSystemMessageMock,
	},
}));

const playerModelMock = {
	getPlayer: vi.fn(),
	getPlayers: vi.fn(),
	getPlayersInRoom: vi.fn(),
};

vi.mock("../model/player", () => ({
	default: playerModelMock,
}));

const roomModelMock = {
	updateRoomStatus: vi.fn(),
	updateRoomLeader: vi.fn(),
	removePlayerFromRoom: vi.fn(),
};

vi.mock("../model/room", () => ({
	default: roomModelMock,
}));

const sequenceMock = {
	getCurrentPlayer: vi.fn(),
	setNextPlayer: vi.fn(),
};

vi.mock("../model/sequence", () => ({
	default: sequenceMock,
}));

vi.mock("@troof/helpers/server", () => ({
	get_dare: vi.fn(),
	get_truth: vi.fn(),
}));

vi.mock("../database/prisma", () => ({
	default: {
		log: {
			create: vi.fn(),
		},
	},
}));

const createIoMock = () => {
	const emit = vi.fn();
	return {
		emit,
		to: vi.fn(() => ({ emit })),
	};
};

const createSocketMock = () => {
	const handlers: Record<string, (obj: any) => Promise<void>> = {};

	return {
		handlers,
		socket: {
			data: {
				player_id: "player-1",
			},
			on: vi.fn((event: string, callback: (obj: any) => Promise<void>) => {
				handlers[event] = callback;
			}),
		},
	};
};

describe("gameHandler leave flow", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("marks room as game_over when current player leaves and no players remain", async () => {
		sequenceMock.getCurrentPlayer.mockResolvedValue({
			current_player_id: "player-1",
		});

		playerModelMock.getPlayer.mockResolvedValue({
			player_id: "player-1",
			display_name: "Alice",
			is_party_leader: true,
		});

		playerModelMock.getPlayers.mockResolvedValue([]);

		const io = createIoMock();
		const { socket, handlers } = createSocketMock();

		const { default: gameHandler } = await import("./gameHandler");
		gameHandler(io as any, socket as any);

		await handlers[TRUTH_OR_DARE_EVENTS.LEAVE_GAME]({
			room_id: "room-1",
			player_id: "player-1",
		});

		expect(roomModelMock.updateRoomStatus).toHaveBeenCalledWith(
			"room-1",
			Status.Game_Over
		);
		expect(roomModelMock.removePlayerFromRoom).not.toHaveBeenCalled();
		expect(io.to).toHaveBeenCalledWith("room-1");
		expect(io.emit).toHaveBeenCalledWith(
			CHAT_EVENTS.MESSAGE_SYSTEM,
			expect.objectContaining({
				message: "Alice has left the game",
			})
		);
	});

	it("reassigns leader when leader leaves and one player remains", async () => {
		sequenceMock.getCurrentPlayer.mockResolvedValue({
			current_player_id: "player-2",
		});

		playerModelMock.getPlayer.mockResolvedValue({
			player_id: "player-1",
			display_name: "Alice",
			is_party_leader: true,
		});

		playerModelMock.getPlayers.mockResolvedValue([{ player_id: "player-2" }]);
		playerModelMock.getPlayersInRoom.mockResolvedValue([
			{ player_id: "player-2" },
		]);

		const io = createIoMock();
		const { socket, handlers } = createSocketMock();

		const { default: gameHandler } = await import("./gameHandler");
		gameHandler(io as any, socket as any);

		await handlers[TRUTH_OR_DARE_EVENTS.LEAVE_GAME]({
			room_id: "room-1",
			player_id: "player-1",
		});

		expect(roomModelMock.updateRoomLeader).toHaveBeenCalledWith(
			"room-1",
			"player-2"
		);
		expect(roomModelMock.removePlayerFromRoom).toHaveBeenCalledWith(
			"room-1",
			"player-1"
		);
		expect(io.emit).toHaveBeenCalledWith(ROOM_EVENTS.PLAYERS_UPDATE, [
			{ player_id: "player-2" },
		]);
	});
});
