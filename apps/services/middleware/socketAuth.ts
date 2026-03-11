import { JWT } from "@troof/jwt";
import { logger } from "@troof/logger";
import { PlayerIDObject } from "@troof/socket";
import { ExtendedError, Socket } from "socket.io";

const socketAuthMiddleware = (
	socket: Socket,
	next: (err?: ExtendedError) => void
) => {
	const { token } = socket.handshake.headers;

	if (typeof token !== "string" || !token) {
		logger.error("Authentication error: token is missing or invalid type");
		return next(new Error("Authentication error"));
	}

	const verifiedData = JWT.verify<PlayerIDObject>(
		token,
		process.env.JWT_SECRET!
	);

	if (!verifiedData) {
		return next(new Error("Authentication error - cannot verify token"));
	}

	socket.data.player_id = verifiedData.player_id;
	next();
};

export default socketAuthMiddleware;
