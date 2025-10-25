import "dotenv/config";
import mongoose from "mongoose";
import { log } from "util";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log(`ERROR: Database connection failed!`);
    process.exit(1);
  }

  try {
    const startedAt = Date.now();
    await mongoose.connect(uri, { bufferCommands: false });
    const elapsed = Date.now() - startedAt;

    const dbName = mongoose.connection?.name || "(unknown)";
    const dbHost = mongoose.connection?.host || "(unknown)";

    console.log(`OK: Connected to MongoDB: [
            db: "${dbName}",
            host: "${dbHost}",
            time: "${elapsed}ms"
            ]`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("ERROR: Database connection failed!");
    console.error(error);

    try {
      await mongoose.connection.close();
    } catch {}

    process.exit(1);
  }
}

main();
