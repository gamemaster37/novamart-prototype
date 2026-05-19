import { Router } from "express";
import { getCustomerById } from "../services/customerService.js";
import { createSupportCase, getSupportCases, updateSupportCase } from "../services/supportCaseService.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ supportCases: getSupportCases() });
});

router.post("/", (req, res, next) => {
  const { customer_id, title, description } = req.body ?? {};

  if (!Number.isInteger(Number(customer_id)) || !title?.trim() || !description?.trim()) {
    next(Object.assign(new Error("customer_id, title, and description are required"), { status: 400 }));
    return;
  }

  if (!getCustomerById(Number(customer_id))) {
    next(Object.assign(new Error("Customer not found"), { status: 404 }));
    return;
  }

  const supportCase = createSupportCase({
    customer_id: Number(customer_id),
    title: title.trim(),
    description: description.trim()
  });

  res.status(201).json({ supportCase });
});

router.patch("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    next(Object.assign(new Error("Invalid support case id"), { status: 400 }));
    return;
  }

  const supportCase = updateSupportCase(id, req.body ?? {});
  if (!supportCase) {
    next(Object.assign(new Error("Support case not found"), { status: 404 }));
    return;
  }

  res.json({ supportCase });
});

export default router;
