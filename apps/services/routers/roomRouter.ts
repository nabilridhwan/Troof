/** @format */

import express from "express";
import Room from "../controllers/room";
import VerifyCaptcha from "../middleware/VerifyCaptcha";

const roomRouter = express.Router();

roomRouter.get("/", Room.Get);

roomRouter.post(
	"/create",
	(req, res, next) => VerifyCaptcha(req, res, next)("troof_captcha_token"),
	Room.Create
);

roomRouter.post(
	"/join",
	(req, res, next) => VerifyCaptcha(req, res, next)("troof_captcha_token"),
	Room.Join
);

export default roomRouter;
