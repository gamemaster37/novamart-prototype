import { getDb } from "../database/db.js";
import { routeSupportCase } from "./routingService.js";

export function getSupportCases() {
  return getDb()
    .prepare(
      `SELECT
        support_cases.*,
        customers.first_name || ' ' || customers.last_name AS customer_name,
        customers.segment AS customer_segment
      FROM support_cases
      JOIN customers ON customers.id = support_cases.customer_id
      ORDER BY support_cases.created_at DESC`
    )
    .all();
}

export function getSupportCaseById(id: number) {
  return getDb()
    .prepare(
      `SELECT
        support_cases.*,
        customers.first_name || ' ' || customers.last_name AS customer_name,
        customers.email AS customer_email,
        customers.segment AS customer_segment,
        customers.loyalty_status,
        customers.lifetime_value,
        customers.churn_risk
      FROM support_cases
      JOIN customers ON customers.id = support_cases.customer_id
      WHERE support_cases.id = ?`
    )
    .get(id);
}

export function createSupportCase(input: { customer_id: number; title: string; description: string }) {
  const routing = routeSupportCase({
    customerId: input.customer_id,
    title: input.title,
    description: input.description
  });

  const result = getDb()
    .prepare(
      `INSERT INTO support_cases (
        customer_id, title, description, category, priority, status, assigned_team
      ) VALUES (?, ?, ?, ?, ?, 'Open', ?)`
    )
    .run(input.customer_id, input.title, input.description, routing.category, routing.priority, routing.assignedTeam);

  return getSupportCaseById(Number(result.lastInsertRowid));
}

export function updateSupportCase(id: number, updates: Record<string, string>) {
  const allowed = ["status", "priority", "assigned_team", "category"];
  const entries = Object.entries(updates).filter(([key, value]) => allowed.includes(key) && typeof value === "string" && value.trim());

  if (!entries.length) {
    return getSupportCaseById(id);
  }

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  getDb()
    .prepare(`UPDATE support_cases SET ${setClause} WHERE id = ?`)
    .run(...entries.map(([, value]) => value), id);

  return getSupportCaseById(id);
}
