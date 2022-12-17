/** @format */

import { generateRoomID } from "@troof/helpers";
import { JWT } from "@troof/jwt";
import { logger } from "@troof/logger";
import {
	BadRequest,
	NotFoundResponse,
	SuccessResponse,
} from "@troof/responses";
import { Status } from "@troof/socket";
import type { Request, Response } from "express";
import { z, ZodError, ZodIssue } from "zod";
import PlayerModel from "../model/player";
import RoomModel from "../model/room";

const GetRoomSchema = z.object({
	room_id: z.string(),
});

const JoinRoomSchema = z.object({
	room_id: z.string(),
	display_name: z.string().max(20),
});

const CreateRoomSchema = z.object({
	display_name: z.string().max(20),
});

const Room = {
	Get: async (req: Request<{}, {}, {}, { room_id: string }>, res: Response) => {
		try {
			GetRoomSchema.parse(req.query);
		} catch (error) {
			if (error instanceof ZodError) {
				const e = error.flatten((issue: ZodIssue) => ({
					message: issue.message,
					error: issue.code,
				}));

				return new BadRequest("Invalid request", e).handleResponse(req, res);
			}
		}

		const { room_id } = req.query;

		// Check if the room exists
		const room = await RoomModel.getRoom({
			room_id,
			status: {
				not: Status.Game_Over,
			},
		});

		if (!room) {
			return new NotFoundResponse("Room does not exist", {}).handleResponse(
				req,
				res
			);
		}

		// Return the room and player_id
		return new SuccessResponse("Successfully got room", {
			room_id,
			status: room.status,
		}).handleResponse(req, res);
	},

	Join: async (
		req: Request<{}, {}, { room_id: string; display_name: string }>,
		res: Response
	) => {
		try {
			JoinRoomSchema.parse(req.body);
		} catch (error) {
			if (error instanceof ZodError) {
				const e = error.flatten((issue: ZodIssue) => ({
					message: issue.message,
					error: issue.code,
				}));

				return new BadRequest("Invalid request", e).handleResponse(req, res);
			}
		}

		const { room_id, display_name } = req.body;

		// Check if the room exists
		const room = await RoomModel.getRoom({
			room_id: room_id.toLowerCase(),
			status: {
				not: Status.Game_Over,
			},
		});

		if (!room) {
			return new NotFoundResponse("Room does not exist", {}).handleResponse(
				req,
				res
			);
		}

		const { player_id: playerCount } = await RoomModel.getNumberOfPeopleInRoom(
			room_id
		);

		// Limit the number of players
		if (playerCount >= 8) {
			logger.error("Room is full!");
			// Tell the users that the room is full
			return new NotFoundResponse(
				"Room is full. Maximum of 8 players allowed.",
				{}
			).handleResponse(req, res);
		}

		// Create a new player
		const { player_id } = await PlayerModel.createPlayer({
			display_name,
			game: {
				connect: {
					room_id: room.room_id,
				},
			},
		});

		const token = JWT.generate(
			{
				player_id,
			},
			process.env.JWT_SECRET!
		);

		// Return the room and player_id
		new SuccessResponse("Successfully joined room", {
			player_id,
			room_id,
			status: room.status,
			token,
		}).handleResponse(req, res);
	},

	Create: async (
		req: Request<{}, {}, { display_name: string }>,
		res: Response
	) => {
		try {
			CreateRoomSchema.parse(req.body);
		} catch (error: any | ZodError) {
			if (error instanceof ZodError) {
				const e = error.flatten((issue: ZodIssue) => ({
					message: issue.message,
					error: issue.code,
				}));

				return new BadRequest("Invalid request", e).handleResponse(req, res);
			}
		}

		// Generate a room_id
		logger.info(`Created room with id ${generateRoomID().toUpperCase()}`);

		const room_id = generateRoomID();

		// Get the display name
		const { display_name } = req.body;

		// Create a game and select the room ID
		const { room_id: insertedRoomID, player } = await RoomModel.createNewRoom(
			room_id,
			{
				display_name,
			}
		);

		const token = JWT.generate(
			{
				player_id: player.player_id,
			},
			process.env.JWT_SECRET!
		);

		new SuccessResponse("Room Created", {
			room_id: insertedRoomID,
			room_creator: player,
			token,
		}).handleResponse(req, res);
	},
};

export default Room;
