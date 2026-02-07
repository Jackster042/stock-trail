import { dbConnect } from "@/database/mongoose";

async function main() {
  try {
    await dbConnect();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

main();
