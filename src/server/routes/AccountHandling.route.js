import { Router } from "express";
import {
  accountLogin,
  accountSignUp,
  changePassword,
  changeUsername,
  deleteAccount,
} from "../controllers/AccountHandling.controller.js";

const router = Router();

router.post("/sign_up", accountSignUp);

router.post("/login", accountLogin);

router.patch("/change_username/:id", changeUsername);

router.patch("/change_password/:id", changePassword);

router.delete("/delete_account/:id", deleteAccount);

export default router;
