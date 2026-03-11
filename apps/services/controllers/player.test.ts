import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyMock = vi.fn();

vi.mock("@troof/jwt", () => ({
	JWT: {
		verify: verifyMock,
	},
}));

const prismaMock = {
	player: {
		findFirst: vi.fn(),
	},
};

vi.mock("../database/prisma", () => ({
	default: prismaMock,
}));

const createResponse = () => {
	const json = vi.fn();
	const status = vi.fn().mockReturnValue({ json });
	return { status, json };
};

describe("Player controller authorization", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns bad request when token header is missing", async () => {
		const { default: Player } = await import("./player");
		const res = createResponse();

		await Player.Find({ headers: {} } as any, res as any);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Token not found",
			})
		);
	});

	it("returns bad request when token verification fails", async () => {
		verifyMock.mockReturnValue(null);

		const { default: Player } = await import("./player");
		const res = createResponse();

		await Player.Find({ headers: { token: "bad-token" } } as any, res as any);

		expect(verifyMock).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Invalid token",
			})
		);
	});

	it("returns not found when verified player does not exist", async () => {
		verifyMock.mockReturnValue({ player_id: "p1" });
		prismaMock.player.findFirst.mockResolvedValue(null);

		const { default: Player } = await import("./player");
		const res = createResponse();

		await Player.Find({ headers: { token: "valid-token" } } as any, res as any);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Player not found",
			})
		);
	});

	it("returns success when player exists for a valid token", async () => {
		verifyMock.mockReturnValue({ player_id: "p1" });
		prismaMock.player.findFirst.mockResolvedValue({
			player_id: "p1",
			display_name: "Alice",
		});

		const { default: Player } = await import("./player");
		const res = createResponse();

		await Player.Find({ headers: { token: "valid-token" } } as any, res as any);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Player found",
			})
		);
	});
});
