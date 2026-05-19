import { Router } from "express";
import { getCampaignAnalytics, getCampaigns } from "../services/campaignService.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    campaigns: getCampaigns(),
    analytics: getCampaignAnalytics()
  });
});

export default router;
