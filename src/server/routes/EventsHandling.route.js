import { Router } from "express";
import { createEvent } from "../controllers/EventsHandling.controller.js";

const router = Router();
router.post("/create_event/:userID", createEvent);

export default router;
