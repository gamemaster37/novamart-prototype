import { getDb } from "../database/db.js";

export function getCampaigns() {
  return getDb().prepare("SELECT * FROM campaigns ORDER BY start_date DESC").all();
}

export function getCampaignById(id: number) {
  return getDb().prepare("SELECT * FROM campaigns WHERE id = ?").get(id);
}

export function getCampaignAnalytics() {
  const db = getDb();
  const summary = db
    .prepare(
      `SELECT
        COUNT(*) AS totalCampaigns,
        ROUND(AVG(conversion_rate), 1) AS averageConversion,
        ROUND(SUM(revenue_generated), 2) AS totalRevenue
      FROM campaigns`
    )
    .get() as any;

  return {
    totalCampaigns: Number(summary.totalCampaigns),
    averageConversion: Number(summary.averageConversion || 0),
    totalRevenue: Number(summary.totalRevenue || 0),
    topCampaigns: db.prepare("SELECT * FROM campaigns ORDER BY revenue_generated DESC LIMIT 3").all()
  };
}
