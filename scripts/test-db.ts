import { dbConnect } from "@/database/mongoose";

async function main() {
  try {
    await dbConnect();
    console.log("OK: Database connection successful!");
    process.exit(0);
  } catch (error) {
    console.error("ERROR: Database connection failed!");
    console.error(error);
    process.exit(1);
  }
}

main();
