/** @format */

import { SuccessResponse } from "@troof/responses";
import type { Request, Response } from "express";
import prisma from "../database/prisma";

const TruthDare = {
	GetAllTruths: async (req: Request, res: Response) => {
		const truths = await prisma.question.findMany({
			where: { type: "truth", available: true, under_review: false },
			select: { id: true, type: true, data: true, batch_name: true },
			orderBy: { created_at: "asc" },
		});

		return new SuccessResponse("All truths", {
			length: truths.length,
			data: truths,
		}).handleResponse(req, res);
	},

	GetAllDares: async (req: Request, res: Response) => {
		const dares = await prisma.question.findMany({
			where: { type: "dare", available: true, under_review: false },
			select: { id: true, type: true, data: true, batch_name: true },
			orderBy: { created_at: "asc" },
		});

		return new SuccessResponse("All dares", {
			length: dares.length,
			data: dares,
		}).handleResponse(req, res);
	},
};

export default TruthDare;
