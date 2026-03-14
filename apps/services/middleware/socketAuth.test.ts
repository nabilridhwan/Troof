import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyMock = vi.fn();

vi.mock("@troof/jwt", () => ({
	JWT: {
		verify: verifyMock,
	},
}));

describe("socketAuthMiddleware", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("rejects missing token", async () => {
		const { default: socketAuthMiddleware } = await import("./socketAuth");

		const next = vi.fn();
		const socket = {
			handshake: {
				headers: {},
			},
			data: {},
		};

		socketAuthMiddleware(socket as any, next as any);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
		expect(next.mock.calls[0][0].message).toBe("Authentication error");
	});

	it("rejects non-string token", async () => {
		const { default: socketAuthMiddleware } = await import("./socketAuth");

		const next = vi.fn();
		const socket = {
			handshake: {
				headers: {
					token: ["bad-token-array"],
				},
			},
			data: {},
		};

		socketAuthMiddleware(socket as any, next as any);

		expect(next).toHaveBeenCalledWith(expect.any(Error));
		expect(next.mock.calls[0][0].message).toBe("Authentication error");
	});

	it("rejects invalid token", async () => {
		verifyMock.mockReturnValue(null);

		const { default: socketAuthMiddleware } = await import("./socketAuth");

		const next = vi.fn();
		const socket = {
			handshake: {
				headers: {
					token: "bad-token",
				},
			},
			data: {},
		};

		socketAuthMiddleware(socket as any, next as any);

		expect(verifyMock).toHaveBeenCalled();
		expect(next).toHaveBeenCalledWith(expect.any(Error));
		expect(next.mock.calls[0][0].message).toBe(
			"Authentication error - cannot verify token"
		);
	});

	it("authorizes valid token and sets socket player_id", async () => {
		verifyMock.mockReturnValue({ player_id: "player-1" });

		const { default: socketAuthMiddleware } = await import("./socketAuth");

		const next = vi.fn();
		const socket: {
			handshake: {
				headers: {
					token: string;
				};
			};
			data: Record<string, any>;
		} = {
			handshake: {
				headers: {
					token: "valid-token",
				},
			},
			data: {},
		};

		socketAuthMiddleware(socket as any, next as any);

		expect(socket.data.player_id).toBe("player-1");
		expect(next).toHaveBeenCalledWith();
	});
});
