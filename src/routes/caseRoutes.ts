import { Router } from "express";
import { createCase, getCases, getCaseById, updateCase, deleteCase } from "../controllers/caseController";

const router = Router();

router.post("/create", createCase);
router.get("/all", getCases);
router.get("/single/:id", getCaseById);
router.put("/update/:id", updateCase);
router.delete("/delete/:id", deleteCase);

export default router;
