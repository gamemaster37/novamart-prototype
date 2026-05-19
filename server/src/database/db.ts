import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let database: Database.Database | null = null;

const defaultPath = path.resolve(process.cwd(), "data", "novamart-crm.sqlite");

export const databasePath = process.env.DATABASE_PATH || defaultPath;

export function getDb() {
  if (!database) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    database = new Database(databasePath);
    database.pragma("foreign_keys = ON");
  }

  return database;
}

export function closeDb() {
  if (database) {
    database.close();
    database = null;
  }
}
