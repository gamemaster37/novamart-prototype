import { getDb } from "../database/db.js";

export function getCustomers() {
  return getDb()
    .prepare(
      `SELECT
        id,
        first_name,
        last_name,
        first_name || ' ' || last_name AS name,
        email,
        phone,
        segment,
        loyalty_status,
        preferred_category,
        last_purchase_date,
        lifetime_value,
        churn_risk,
        data_source,
        created_at
      FROM customers
      ORDER BY lifetime_value DESC`
    )
    .all();
}

export function getCustomerProfile(id: number) {
  const db = getDb();
  const customer = db
    .prepare(
      `SELECT
        id,
        first_name,
        last_name,
        first_name || ' ' || last_name AS name,
        email,
        phone,
        segment,
        loyalty_status,
        preferred_category,
        last_purchase_date,
        lifetime_value,
        churn_risk,
        data_source,
        created_at
      FROM customers
      WHERE id = ?`
    )
    .get(id);

  if (!customer) {
    return null;
  }

  return {
    customer,
    purchases: db.prepare("SELECT * FROM purchases WHERE customer_id = ? ORDER BY purchase_date DESC").all(id),
    interactions: db.prepare("SELECT * FROM interactions WHERE customer_id = ? ORDER BY created_at DESC LIMIT 10").all(id),
    supportCases: db.prepare("SELECT * FROM support_cases WHERE customer_id = ? ORDER BY created_at DESC").all(id),
    aiRecommendations: db
      .prepare("SELECT * FROM ai_recommendations WHERE customer_id = ? ORDER BY created_at DESC LIMIT 5")
      .all(id)
      .map((row: any) => ({ ...row, response: safeJson(row.response), is_fallback: Boolean(row.is_fallback) }))
  };
}

export function getCustomerById(id: number) {
  return getDb()
    .prepare(
      `SELECT
        id,
        first_name,
        last_name,
        first_name || ' ' || last_name AS name,
        email,
        phone,
        segment,
        loyalty_status,
        preferred_category,
        last_purchase_date,
        lifetime_value,
        churn_risk,
        data_source
      FROM customers
      WHERE id = ?`
    )
    .get(id);
}

function safeJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
