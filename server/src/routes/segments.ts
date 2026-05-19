import { Router } from "express";
import { getDb } from "../database/db.js";

const router = Router();

router.get("/", (_req, res) => {
  const db = getDb();
  const segments = db
    .prepare(
      `SELECT
        segments.*,
        COUNT(customers.id) AS customer_count
      FROM segments
      LEFT JOIN customers ON customers.segment = segments.name
      GROUP BY segments.id
      ORDER BY segments.id`
    )
    .all();

  res.json({ segments });
});

export default router;
