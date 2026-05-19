import { Router } from "express";
import { getDashboardData } from "../services/dashboardService.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getDashboardData());
});

export default router;
