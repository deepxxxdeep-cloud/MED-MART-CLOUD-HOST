import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import orderRoutes from "./routes/order.routes.js";
import revenueRoutes from "./routes/revenue.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.set("trust proxy", 1);

// Webhooks mount before the JSON parser: their signature is computed over the
// raw bytes, and parsing would destroy them.
app.use("/api/webhooks", webhookRoutes);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// credentials:true is required for the httpOnly auth cookie to travel.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[error]", err.message);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "account";
    return res.status(409).json({ message: `That ${field} is already registered` });
  }
  if (err.name === "ValidationError") {
    return res.status(422).json({ message: err.message });
  }

  return res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
});

export default app;
