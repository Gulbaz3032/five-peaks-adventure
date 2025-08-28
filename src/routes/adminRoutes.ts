import express from "express";
import { createAdmin, updateAdmin, getAllAdmins} from "../controllers/adminController";
import  { upload } from "../middleware/multerMiddleware";
const router = express.Router();


// this are the Tourists Data routes 

router.post("/create-admin", upload.single("profileImage"), createAdmin);
router.get("/getall", getAllAdmins)
router.put("/update/:id", upload.single("profileImage"), updateAdmin);



export default router