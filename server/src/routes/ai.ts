import { Router } from "express";
import {
  generateCampaignRecommendation,
  generateCustomerRecommendation,
  generateTicketResponse
} from "../services/deepseekService.js";

const router = Router();

router.post("/customer-recommendation", async (req, res, next) => {
  try {
    const customerId = Number(req.body?.customer_id ?? req.body?.customerId);
    if (!Number.isInteger(customerId)) {
      throw Object.assign(new Error("customer_id is required"), { status: 400 });
    }

    res.json(await generateCustomerRecommendation(customerId));
  } catch (error) {
    next(error);
  }
});

router.post("/campaign-recommendation", async (req, res, next) => {
  try {
    const rawCampaignId = req.body?.campaign_id ?? req.body?.campaignId;
    const campaignId = rawCampaignId ? Number(rawCampaignId) : undefined;

    if (campaignId !== undefined && !Number.isInteger(campaignId)) {
      throw Object.assign(new Error("campaign_id must be numeric"), { status: 400 });
    }

    res.json(await generateCampaignRecommendation(campaignId));
  } catch (error) {
    next(error);
  }
});

router.post("/ticket-response", async (req, res, next) => {
  try {
    const supportCaseId = Number(req.body?.support_case_id ?? req.body?.supportCaseId);
    if (!Number.isInteger(supportCaseId)) {
      throw Object.assign(new Error("support_case_id is required"), { status: 400 });
    }

    res.json(await generateTicketResponse(supportCaseId));
  } catch (error) {
    next(error);
  }
});

export default router;
