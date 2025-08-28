import { Router } from "express"

import { getDashboardStats } from "../controllers/dashboardController"

const router = Router();

router.get('/home', getDashboardStats);

export default router