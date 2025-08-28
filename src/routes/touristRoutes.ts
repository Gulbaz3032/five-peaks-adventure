import express from "express";
import {
  registerTourist,
  loginTourist,
  getTourist,
  deleteTourist,
  forgetPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/touristController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Public Routes
router.post("/register", registerTourist);
router.post("/login", loginTourist);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Protected Routes

router.get("/all", authMiddleware, roleMiddleware(["admin"]), getTourist);
router.delete("/delete:id", authMiddleware, roleMiddleware(["admin"]), deleteTourist);

export default router;
