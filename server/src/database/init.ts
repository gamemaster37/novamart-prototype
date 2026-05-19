import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function initDatabase() {
  const schemaPath = path.resolve(__dirname, "../../database/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  getDb().exec(schema);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase();
  console.log("Database initialized.");
}
