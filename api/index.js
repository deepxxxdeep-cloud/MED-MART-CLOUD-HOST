// Vercel serverless entry point. Vercel auto-detects files under /api and
// turns them into functions; the Express app is a valid (req, res) handler,
// so we just make sure Mongo is connected before delegating to it.
//
// Everything under /api/* is routed here by vercel.json, and the Express
// router already mounts its routes at /api/*, so paths line up 1:1.
import app from "../server/src/app.js";
import connectDB from "../server/src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error("[db] connection failed:", err.message);
    return res.status(503).json({ message: "Database unavailable" });
  }
  return app(req, res);
}
