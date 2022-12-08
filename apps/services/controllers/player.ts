/** @format */

import { NotFoundResponse, SuccessResponse } from "@troof/responses";
import type { Request, Response } from "express";
import prisma from "../database/prisma";

const Player = {
	Find: async (
		req: Request<{}, {}, {}, { player_id: string }>,
		res: Response
	) => {
		const { player_id } = req.query;

		const player = await prisma.player.findFirst({
			where: {
				player_id,
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
