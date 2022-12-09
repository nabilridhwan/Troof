/** @format */

import express from "express";
import TruthDare from "../controllers/truth-dare";

const truthRouter = express.Router();

truthRouter.get("/", TruthDare.GetAllTruths);

export default truthRouter;
