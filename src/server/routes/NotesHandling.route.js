import { Router } from "express";
import {
  createNote
} from "../controllers/NotesHandling.controller.js";

const router = Router();

router.post("/create_note/:id", createNote);

export default router;
