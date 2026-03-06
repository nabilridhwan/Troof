/** @format */

import express, { Router } from "express";
import TruthDare from "../controllers/truth-dare";

const dareRouter: Router = express.Router();

dareRouter.get("/", TruthDare.GetAllDares);

export default dareRouter;
