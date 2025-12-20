import { Router } from "express";
import { updateUserAvatar } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.patch(
  "/users/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  updateUserAvatar
);

export default router;
