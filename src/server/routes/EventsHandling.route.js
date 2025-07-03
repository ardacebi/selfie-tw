import { Router } from "express";
import {
  createEvent,
  getAllUserEvents,
} from "../controllers/EventsHandling.controller.js";

const router = Router();
router.post("/create_event/:userID", createEvent);
router.get("/get_all_user_events/:userID", getAllUserEvents);

export default router;
