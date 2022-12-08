/** @format */

import express from "express";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { version } from "./package.json";

import logger, { MorganStreamer } from "@troof/logger";
import { SuccessResponse } from "@troof/responses";
import { ServerToClientEvents } from "@troof/socket";
import all_dares from "@troof/truth-or-dare/output/all_dares.json";
import all_truths from "@troof/truth-or-dare/output/all_truths.json";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import playerRouter from "./routers/playerRouter";
import roomRouter from "./routers/roomRouter";
import gameHandler from "./socket/gameHandler";
import messageHandler from "./socket/messageHandler";
import roomHandler from "./socket/roomHandler";

const app = express();
const server = http.createServer(app);
const io = new Server<ServerToClientEvents>(server, {
	cors: {
		origin: "*",
	},
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
