/** @format */

import express, { Router } from "express";
import Player from "../controllers/player";

const playerRouter: Router = express.Router();

playerRouter.get("/", Player.Find);

export default playerRouter;
