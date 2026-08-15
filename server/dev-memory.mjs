// Dev convenience: runs the API against an in-memory MongoDB so the auth
// flow is usable before a real Mongo is provisioned. Data is wiped on exit.
// Run: npm run dev:memory   (use `npm run dev` once MONGODB_URI points at a real DB)
import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./src/app.js";

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri());
console.log("[db] in-memory mongo ready (data is not persisted)");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, async () => {
    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
  });
}
