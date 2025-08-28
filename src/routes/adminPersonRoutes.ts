import { createPerson, getSinglePerson, getAllPerson, updatePerson, deletePerson } from "../controllers/adminPersonal";
import express from "express";
const router = express.Router();

// this routes or for the Profile Page 

router.post("/create-person", createPerson);
router.get("/getsingleperson/:id", getSinglePerson);
router.get("/getallperson", getAllPerson);
router.put("/updateperson/:id", updatePerson);
router.delete("/delete-person/:id", deletePerson);

export default router;


