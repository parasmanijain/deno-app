import "https://deno.land/std/dotenv/load.ts";
import { MongoClient, Db } from "npm:mongodb@6.1.0";

let db: Db | undefined;

const MONGODB_USER = Deno.env.get("MONGODB_USER");
const MONGODB_PASSWORD = Deno.env.get("MONGODB_PASSWORD");
const MONGODB_HOST = Deno.env.get("MONGODB_HOST");
const MONGODB_DATABASE = Deno.env.get("MONGODB_DATABASE");

if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_HOST || !MONGODB_DATABASE) {
  throw new Error("Missing MongoDB environment variables");
}

const MONGO_URI = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
  MONGODB_PASSWORD,
)}@${MONGODB_HOST}/${MONGODB_DATABASE}?retryWrites=true&w=majority`;

export async function connect(): Promise<void> {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(MONGODB_DATABASE);
  console.log("✅ Connected to MongoDB");
}

export function getDb(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call connect() first.");
  }
  return db;
}
