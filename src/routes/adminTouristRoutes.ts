import { Router } from "express";
import { getTourist, deleteTourist, getSingleTourist,  updateTourist, } from "../controllers/touristController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Admin Tourist Routes
router.get("/all", authMiddleware, roleMiddleware(["admin"]), getTourist);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin"]), deleteTourist);
 router.get("/single/:id", authMiddleware, roleMiddleware(["admin", "user"]), getSingleTourist);
    router.put("/update/:id", authMiddleware, roleMiddleware(["admin", "user"]), updateTourist);

export default router;

