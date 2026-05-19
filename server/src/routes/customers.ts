import { Router } from "express";
import { getCustomerProfile, getCustomers } from "../services/customerService.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ customers: getCustomers() });
});

router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    next(Object.assign(new Error("Invalid customer id"), { status: 400 }));
    return;
  }

  const profile = getCustomerProfile(id);
  if (!profile) {
    next(Object.assign(new Error("Customer not found"), { status: 404 }));
    return;
  }

  res.json(profile);
});

export default router;
