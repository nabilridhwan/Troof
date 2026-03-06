/** @format */

import express, { Router } from "express";
import TruthDare from "../controllers/truth-dare";

const truthRouter: Router = express.Router();

truthRouter.get("/", TruthDare.GetAllTruths);

export default truthRouter;
