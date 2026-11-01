/** Place at: src/lib/mongodb.ts */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

// Reuse one client across hot reloads in development
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export const client = globalForMongo._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

export const db = client.db(process.env.MONGODB_DB || "booknook");
