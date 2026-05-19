import "dotenv/config";
import { fileURLToPath } from "node:url";
import { getDb } from "./db.js";
import { initDatabase } from "./init.js";

type CustomerSeed = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  string
];

const customers: CustomerSeed[] = [
  ["Amelia", "Hart", "amelia.hart@example.com", "0401 220 145", "High-value customers", "Platinum", "Home Appliances", "2026-05-11", 4820, "Low", "Loyalty system"],
  ["Noah", "Singh", "noah.singh@example.com", "0402 441 772", "Frequent buyers", "Gold", "Groceries", "2026-05-16", 1880, "Low", "POS"],
  ["Mia", "Chen", "mia.chen@example.com", "0403 887 230", "At-risk customers", "Silver", "Beauty", "2026-02-08", 970, "High", "Email marketing"],
  ["Liam", "Walker", "liam.walker@example.com", "0404 530 118", "New customers", "Bronze", "Electronics", "2026-05-18", 320, "Medium", "E-commerce"],
  ["Ava", "Brown", "ava.brown@example.com", "0405 731 450", "Dormant customers", "Silver", "Fashion", "2026-01-02", 1430, "High", "POS"],
  ["Ethan", "Nguyen", "ethan.nguyen@example.com", "0406 901 667", "High-value customers", "Platinum", "Electronics", "2026-05-02", 5235, "Low", "E-commerce"],
  ["Isla", "Martin", "isla.martin@example.com", "0407 443 990", "Frequent buyers", "Gold", "Homewares", "2026-05-14", 2210, "Low", "Loyalty system"],
  ["Oliver", "Taylor", "oliver.taylor@example.com", "0408 120 337", "At-risk customers", "Bronze", "Sports", "2026-02-18", 760, "Medium", "POS"],
  ["Grace", "Wilson", "grace.wilson@example.com", "0409 554 610", "New customers", "Bronze", "Groceries", "2026-05-19", 210, "Low", "E-commerce"],
  ["Lucas", "Patel", "lucas.patel@example.com", "0410 832 442", "High-value customers", "Platinum", "Furniture", "2026-04-27", 3975, "Medium", "Loyalty system"],
  ["Sophie", "King", "sophie.king@example.com", "0411 672 050", "Dormant customers", "Silver", "Beauty", "2025-12-16", 1195, "High", "Email marketing"],
  ["Henry", "Scott", "henry.scott@example.com", "0412 331 880", "Frequent buyers", "Gold", "Groceries", "2026-05-12", 1755, "Low", "POS"],
  ["Chloe", "Adams", "chloe.adams@example.com", "0413 925 740", "At-risk customers", "Silver", "Fashion", "2026-03-01", 1345, "Medium", "E-commerce"],
  ["Jack", "Roberts", "jack.roberts@example.com", "0414 627 318", "New customers", "Bronze", "Sports", "2026-05-17", 450, "Low", "Email marketing"],
  ["Zoe", "Evans", "zoe.evans@example.com", "0415 773 901", "High-value customers", "Gold", "Home Appliances", "2026-04-30", 2880, "Low", "Loyalty system"]
];

const purchases = [
  [1, "Smart Washer Bundle", "Home Appliances", 1299, "2026-05-11"],
  [1, "Air Fryer Pro", "Home Appliances", 249, "2026-04-20"],
  [2, "Weekly Family Grocery Pack", "Groceries", 185, "2026-05-16"],
  [2, "Organic Pantry Bundle", "Groceries", 132, "2026-05-04"],
  [3, "Skin Care Renewal Set", "Beauty", 115, "2026-02-08"],
  [4, "Wireless Earbuds", "Electronics", 179, "2026-05-18"],
  [5, "Winter Jacket", "Fashion", 220, "2026-01-02"],
  [6, "OLED Television", "Electronics", 2499, "2026-05-02"],
  [6, "Soundbar", "Electronics", 499, "2026-04-09"],
  [7, "Kitchen Storage Set", "Homewares", 95, "2026-05-14"],
  [7, "Bedding Refresh Kit", "Homewares", 210, "2026-04-28"],
  [8, "Running Shoes", "Sports", 155, "2026-02-18"],
  [9, "Fresh Produce Starter Box", "Groceries", 76, "2026-05-19"],
  [10, "Dining Table", "Furniture", 1399, "2026-04-27"],
  [10, "Office Chair", "Furniture", 420, "2026-03-26"],
  [11, "Fragrance Gift Set", "Beauty", 160, "2025-12-16"],
  [12, "Weekly Essentials", "Groceries", 142, "2026-05-12"],
  [12, "Coffee Subscription", "Groceries", 48, "2026-05-01"],
  [13, "Designer Denim", "Fashion", 180, "2026-03-01"],
  [14, "Yoga Starter Kit", "Sports", 125, "2026-05-17"],
  [15, "Robot Vacuum", "Home Appliances", 699, "2026-04-30"],
  [15, "Steam Mop", "Home Appliances", 230, "2026-04-12"]
];

const interactions = [
  [1, "Loyalty review", "Phone", "Asked about platinum reward eligibility after large appliance purchase.", "Completed", "2026-05-12"],
  [2, "Promo click", "Email", "Clicked weekly grocery bundle offer.", "Completed", "2026-05-15"],
  [3, "Win-back email", "Email", "Opened beauty category reactivation campaign but did not purchase.", "Open", "2026-04-18"],
  [4, "Welcome message", "SMS", "Received new customer onboarding discount.", "Completed", "2026-05-18"],
  [5, "Dormant journey", "Email", "No response to fashion seasonal promotion.", "Open", "2026-04-21"],
  [6, "Delivery update", "Chat", "Requested tracking for television order.", "Completed", "2026-05-03"],
  [7, "Product review", "Email", "Submitted positive homewares review.", "Completed", "2026-05-16"],
  [8, "Support follow-up", "Phone", "Discussed delayed sports order.", "Completed", "2026-03-02"],
  [10, "Furniture consultation", "Store", "Discussed add-on chairs for dining set.", "Completed", "2026-04-29"],
  [12, "Subscription query", "Chat", "Asked about changing coffee delivery cadence.", "Completed", "2026-05-05"],
  [15, "Care plan offer", "Email", "Clicked extended care plan offer for appliances.", "Completed", "2026-05-01"]
];

const supportCases = [
  [1, "Invoice copy requested", "Customer needs a copy of the smart washer invoice for warranty registration.", "Billing issue", "Medium", "Open", "Billing Support", "2026-05-13"],
  [3, "Beauty order voucher not applied", "Discount code failed during checkout and customer is frustrated.", "Billing issue", "High", "In progress", "Billing Support", "2026-05-01"],
  [5, "Complaint about delayed refund", "Dormant customer complained that a fashion return refund is delayed.", "Complaint", "Medium", "Open", "General Support", "2026-04-24"],
  [6, "Television delivery window missed", "High-value customer reports delivery team missed the nominated window.", "Delivery issue", "High", "In progress", "Logistics Support", "2026-05-04"],
  [7, "Loyalty points missing", "Points from recent bedding order are not visible in loyalty account.", "Loyalty points issue", "Medium", "Resolved", "Loyalty Support", "2026-05-15"],
  [8, "Unable to reset password", "Customer cannot access online account to track order.", "Technical issue", "Medium", "Open", "Digital Support", "2026-03-03"],
  [10, "Furniture assembly question", "Customer needs guidance on booking assembly service.", "General enquiry", "Low", "Resolved", "General Support", "2026-04-30"],
  [12, "Subscription delivery change", "Customer wants coffee subscription moved to Fridays.", "Delivery issue", "Low", "Open", "Logistics Support", "2026-05-06"]
];

const campaigns = [
  ["Platinum Appliance Upgrade", "High-value customers", "Email", "Active", "2026-05-01", "2026-05-31", 18.4, 46200],
  ["Weekly Grocery Saver", "Frequent buyers", "SMS", "Active", "2026-05-10", "2026-05-24", 22.1, 18800],
  ["Beauty Win-back", "At-risk customers", "Email", "Active", "2026-04-15", "2026-05-30", 9.8, 7200],
  ["Welcome to NovaMart", "New customers", "Email", "Active", "2026-05-01", "2026-06-15", 14.6, 5100],
  ["Dormant Fashion Reactivation", "Dormant customers", "Email", "Paused", "2026-04-01", "2026-05-15", 5.4, 2600],
  ["Homewares Review Rewards", "Frequent buyers", "Push", "Completed", "2026-03-01", "2026-04-15", 16.2, 9400]
];

const segments = [
  ["High-value customers", "Customers with strong lifetime value and high strategic retention importance.", "Lifetime value above $2,000"],
  ["Frequent buyers", "Customers with repeated recent purchases and high engagement.", "5+ purchases in last 90 days"],
  ["At-risk customers", "Customers showing reduced purchase recency or medium/high churn risk.", "No purchase in 60+ days"],
  ["New customers", "Recently acquired customers in onboarding campaigns.", "First purchase or signup in the last 30 days"],
  ["Dormant customers", "Customers requiring reactivation campaigns.", "No purchase in 120+ days"]
];

export function seedDatabase() {
  initDatabase();
  const db = getDb();

  db.exec(`
    DELETE FROM ai_recommendations;
    DELETE FROM support_cases;
    DELETE FROM interactions;
    DELETE FROM purchases;
    DELETE FROM campaigns;
    DELETE FROM segments;
    DELETE FROM customers;
    DELETE FROM sqlite_sequence WHERE name IN ('customers','purchases','interactions','support_cases','campaigns','segments','ai_recommendations');
  `);

  const insertCustomer = db.prepare(`
    INSERT INTO customers (
      first_name, last_name, email, phone, segment, loyalty_status, preferred_category,
      last_purchase_date, lifetime_value, churn_risk, data_source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPurchase = db.prepare("INSERT INTO purchases (customer_id, product_name, category, amount, purchase_date) VALUES (?, ?, ?, ?, ?)");
  const insertInteraction = db.prepare("INSERT INTO interactions (customer_id, type, channel, summary, status, created_at) VALUES (?, ?, ?, ?, ?, ?)");
  const insertSupportCase = db.prepare("INSERT INTO support_cases (customer_id, title, description, category, priority, status, assigned_team, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const insertCampaign = db.prepare("INSERT INTO campaigns (name, target_segment, channel, status, start_date, end_date, conversion_rate, revenue_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  const insertSegment = db.prepare("INSERT INTO segments (name, description, rule_description) VALUES (?, ?, ?)");

  const tx = db.transaction(() => {
    customers.forEach((row) => insertCustomer.run(...row));
    purchases.forEach((row) => insertPurchase.run(...row));
    interactions.forEach((row) => insertInteraction.run(...row));
    supportCases.forEach((row) => insertSupportCase.run(...row));
    campaigns.forEach((row) => insertCampaign.run(...row));
    segments.forEach((row) => insertSegment.run(...row));
  });

  tx();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
  console.log("Database seeded.");
}
