import mongoose from "mongoose";

/**
 * Serverless-safe connection.
 *
 * On Vercel every invocation may run in a fresh module scope but reuses the
 * same warm container, so the connection is cached on globalThis. Without
 * this each request would open a new pool and quickly exhaust Atlas's
 * connection limit. bufferCommands:false makes queries fail fast instead of
 * hanging if the connection dropped.
 */
const globalCache = globalThis;
globalCache._medmartMongoose ??= { conn: null, promise: null };
const cached = globalCache._medmartMongoose;

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  cached.promise ??= mongoose
    .connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    })
    .catch((err) => {
      // Clear the failed promise so the next request can retry.
      cached.promise = null;
      throw err;
    });

  cached.conn = await cached.promise;
  return cached.conn;
}
