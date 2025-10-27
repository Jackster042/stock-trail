"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { dbConnect } from "@/database/mongoose";
import { string } from "better-auth";

export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await dbConnect();
    const db = mongoose?.connection.db;
    if (!db) throw new Error(`MongoDB connection Not Found!`);

    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();

    return items.map((item) => String(item.symbol));
  } catch (error) {
    console.error("Error fetching symbols", error);
    return [];
  }
}
