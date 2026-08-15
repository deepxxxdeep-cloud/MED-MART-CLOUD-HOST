import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing — copy .env.example to .env and fill it in.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("[db] connected");
  app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
} catch (err) {
  console.error("[db] connection failed:", err.message);
  process.exit(1);
}
