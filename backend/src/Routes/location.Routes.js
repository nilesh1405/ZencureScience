import express from "express";
import { getStates, getCities } from "../Controllers/location.Controller.js";

const router = express.Router();

router.get("/states", getStates);
router.get("/cities/:state", getCities);

export default router;
