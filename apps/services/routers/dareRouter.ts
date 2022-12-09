/** @format */

import express from "express";
import TruthDare from "../controllers/truth-dare";

const dareRouter = express.Router();

dareRouter.get("/", TruthDare.GetAllDares);

export default dareRouter;
