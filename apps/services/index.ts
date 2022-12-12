/** @format */

import express from "express";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { version } from "./package.json";

import { JWT } from "@troof/jwt";
import { logger, MorganStreamer } from "@troof/logger";
import { SuccessResponse } from "@troof/responses";
import { PlayerIDObject, ServerToClientEvents } from "@troof/socket";
import all_dares from "@troof/truth-or-dare/output/all_dare.json";
import all_truths from "@troof/truth-or-dare/output/all_truth.json";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import dareRouter from "./routers/dareRouter";
import playerRouter from "./routers/playerRouter";
import roomRouter from "./routers/roomRouter";
import truthRouter from "./routers/truthRouter";
import gameHandler from "./socket/gameHandler";
import messageHandler from "./socket/messageHandler";
import roomHandler from "./socket/roomHandler";

const app = express();
const server = http.createServer(app);
const io = new Server<ServerToClientEvents>(server, {
	cors: {
		origin: "*",
	},
	transports: ["websocket", "polling"],
});

// Config dotenv
dotenv.config();

let mStreamer = new MorganStreamer();
app.use(morgan("combined", { stream: mStreamer }));
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
	// TODO: Keep version somewhere sage
	return new SuccessResponse("Server is running", {
		version,
		dares: all_dares.length,
		truths: all_truths.length,
		total: all_dares.length + all_truths.length,
	}).handleResponse(req, res);
});

// Routers
app.use("/api/room", roomRouter);
app.use("/api/player", playerRouter);

app.use("/api/truth", truthRouter);
app.use("/api/dare", dareRouter);

// ! Token middleware
io.use((socket, next) => {
	let { token } = socket.handshake.headers;

	if (typeof token !== "string") {
		logger.error("Token is not a string");
		return;
	}

	if (!token) {
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
});

io.on("connection", (socket) => {
	logger.warn(`Current active sockets: ${io.engine.clientsCount}`);
	logger.info(`A user connected (${socket.id})`);

	roomHandler(io, socket);
	gameHandler(io, socket);
	messageHandler(io, socket);

	socket.on("disconnect", () => {
		logger.warn("Current active sockets: ", io.engine.clientsCount);
	});
});

server.listen(process.env.PORT, () => {
	logger.info(`listening on *:${process.env.PORT}`);
});
