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
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import prisma from "./database/prisma";
import dareRouter from "./routers/dareRouter";
import playerRouter from "./routers/playerRouter";
import roomRouter from "./routers/roomRouter";
import truthRouter from "./routers/truthRouter";
import gameHandler from "./socket/gameHandler";
import messageHandler from "./socket/messageHandler";
import roomHandler from "./socket/roomHandler";

// const pubClient = new Redis({
// 	host: process.env.REDIS_HOST || "localhost",
// 	port: parseInt(process.env.REDIS_PORT || "6379", 10),
// 	password: process.env.REDIS_PASSWORD || undefined,
// 	username: process.env.REDIS_USERNAME || undefined,
// });

// const subClient = pubClient.duplicate();

// pubClient.on("error", (err) => {
// 	logger.error("Redis Client Error", err);
// });

// subClient.on("error", (err) => {
// 	logger.error("Redis Sub Client Error", err);
// });

const app = express();
const server = http.createServer(app);
const io = new Server<ServerToClientEvents>(server, {
	cors: {
		origin: "*",
	},
	transports: ["websocket", "polling"],
});

// Config dotenv
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

let mStreamer = new MorganStreamer();
app.use(morgan("combined", { stream: mStreamer }));
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
	const [dares, truths] = await Promise.all([
		prisma.question.count({
			where: { type: "dare", available: true, under_review: false },
		}),
		prisma.question.count({
			where: { type: "truth", available: true, under_review: false },
		}),
	]);

	return new SuccessResponse("Server is running", {
		version,
		dares,
		truths,
		total: dares + truths,
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
