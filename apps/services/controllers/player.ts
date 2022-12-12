/** @format */

import { JWT } from "@troof/jwt";
import {
	BadRequest,
	NotFoundResponse,
	SuccessResponse,
} from "@troof/responses";
import { PlayerIDObject } from "@troof/socket";
import type { Request, Response } from "express";
import prisma from "../database/prisma";

const Player = {
	Find: async (req: Request, res: Response) => {
		if (!req.headers.token)
			return new BadRequest("Token not found", []).handleResponse(req, res);

		const { token } = req.headers;

		const d = JWT.verify<PlayerIDObject>(
			token as string,
			process.env.JWT_SECRET as string
		);

		if (!d) return new BadRequest("Invalid token", []).handleResponse(req, res);

		const player = await prisma.player.findFirst({
			where: {
				player_id: d.player_id,
			},
		});

		if (!player) {
			return new NotFoundResponse("Player not found", []).handleResponse(
				req,
				res
			);
		}

		return new SuccessResponse("Player found", player).handleResponse(req, res);
	},
};

export default Player;
