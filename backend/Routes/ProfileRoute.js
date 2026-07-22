import { getProfile } from "../Controllers/ProfileController.js";
import express from "express";
import { userVerification } from "../Middlewares/AuthMiddleware.js";
import {
  updateUsername,
  updatePassword,
  uploadResume,
  getResume,
  deleteResume,
} from "../Controllers/ProfileController.js";
import upload from "../Middlewares/Upload.js";

const router = express.Router();

router.get("/", userVerification, getProfile);
router.put("/username", userVerification, updateUsername);
router.put("/password", userVerification, updatePassword);
router.post(
  "/upload-resume",
  userVerification,
  upload.single("resume"),
  uploadResume,
);
router.get("/upload-resume", userVerification, getResume);
router.delete("/delete-resume", userVerification, deleteResume);

export default router;