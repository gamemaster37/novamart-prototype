import "dotenv/config";
import cors from "cors";
import express from "express";
import dashboardRoutes from "./routes/dashboard.js";
import customerRoutes from "./routes/customers.js";
import segmentRoutes from "./routes/segments.js";
import campaignRoutes from "./routes/campaigns.js";
import supportCaseRoutes from "./routes/supportCases.js";
import aiRoutes from "./routes/ai.js";
import { initDatabase } from "./database/init.js";
import { seedDatabase } from "./database/seed.js";
import { getDb } from "./database/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.BACKEND_PORT || process.env.PORT || 8080);

initDatabase();
const customerCount = (getDb().prepare("SELECT COUNT(*) AS count FROM customers").get() as any).count;
if (!customerCount) {
  seedDatabase();
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "novamart-crm-api" });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/segments", segmentRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/support-cases", supportCaseRoutes);
app.use("/api/ai", aiRoutes);
app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`NovaMart CRM API listening on ${port}`);
});
