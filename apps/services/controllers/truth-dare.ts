/** @format */

import { SuccessResponse } from "@troof/responses";
import type { Request, Response } from "express";

import all_dare from "@troof/truth-or-dare/output/all_dare.json";
import all_truth from "@troof/truth-or-dare/output/all_truth.json";

const TruthDare = {
	GetAllTruths: async (req: Request, res: Response) => {
		return new SuccessResponse("All truths", {
			length: all_truth.length,
			data: all_truth,
		}).handleResponse(req, res);
	},

	GetAllDares: async (req: Request, res: Response) => {
		return new SuccessResponse("All dares", {
			length: all_dare.length,
			data: all_dare,
		}).handleResponse(req, res);
	},
};

export default TruthDare;
