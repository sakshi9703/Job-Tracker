import { Signup, Login } from "../Controllers/AuthController.js";
import express from "express";
import { userVerification } from "../Middlewares/AuthMiddleware.js";
import { validate } from "../Middlewares/Validate.js";
import { signupSchema, loginSchema } from "../Validations/authValidation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), Signup);
router.post("/login", validate(loginSchema), Login);
router.post("/", userVerification);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  path: "/",
});

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
