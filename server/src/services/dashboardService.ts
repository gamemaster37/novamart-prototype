import { getDb } from "../database/db.js";

export function getDashboardData() {
  const db = getDb();
  const totalCustomers = Number((db.prepare("SELECT COUNT(*) AS count FROM customers").get() as any).count);
  const activeCustomers = Number(
    (db.prepare("SELECT COUNT(*) AS count FROM customers WHERE date(last_purchase_date) >= date('now', '-90 days')").get() as any).count
  );
  const monthlySales = Number(
    (db.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM purchases WHERE date(purchase_date) >= date('now', '-30 days')").get() as any).total
  );
  const openSupportCases = Number(
    (db.prepare("SELECT COUNT(*) AS count FROM support_cases WHERE status IN ('Open', 'In progress')").get() as any).count
  );
  const averageConversion = Number(
    (db.prepare("SELECT ROUND(AVG(conversion_rate), 1) AS rate FROM campaigns").get() as any).rate || 0
  );
  const retentionRate = totalCustomers ? Math.round((activeCustomers / totalCustomers) * 1000) / 10 : 0;

  const salesTrend = db
    .prepare(
      `SELECT strftime('%Y-%m', purchase_date) AS month, ROUND(SUM(amount), 2) AS sales
       FROM purchases
       GROUP BY month
       ORDER BY month`
    )
    .all();

  const segmentBreakdown = db
    .prepare("SELECT segment AS name, COUNT(*) AS value FROM customers GROUP BY segment ORDER BY value DESC")
    .all();

  const campaignPerformance = db
    .prepare("SELECT name, conversion_rate, revenue_generated FROM campaigns ORDER BY revenue_generated DESC")
    .all();

  const supportStatusBreakdown = db
    .prepare("SELECT status AS name, COUNT(*) AS value FROM support_cases GROUP BY status")
    .all();

  const highRisk = Number((db.prepare("SELECT COUNT(*) AS count FROM customers WHERE churn_risk = 'High'").get() as any).count);
  const topCampaign = db
    .prepare("SELECT name, conversion_rate FROM campaigns ORDER BY conversion_rate DESC LIMIT 1")
    .get() as any;

  return {
    kpis: {
      totalCustomers,
      activeCustomers,
      monthlySales,
      retentionRate,
      openSupportCases,
      campaignConversionRate: averageConversion
    },
    charts: {
      salesTrend,
      segmentBreakdown,
      campaignPerformance,
      supportStatusBreakdown
    },
    insightSummary: `${highRisk} customers are marked high churn risk. ${topCampaign?.name || "The active campaigns"} is the strongest campaign by conversion, and support volume is concentrated in open or in-progress cases requiring follow-up.`
  };
}
