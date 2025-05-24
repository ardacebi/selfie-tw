import { Router } from "express";
import {
  createNote,
  getAllUserNotes,
  getNoteById,
} from "../controllers/NotesHandling.controller.js";

const router = Router();

router.post("/create_note/:id", createNote);
router.get("/get_all_user_notes/:id", getAllUserNotes);
router.get("/get_note_by_id", getNoteById);

export default router;
