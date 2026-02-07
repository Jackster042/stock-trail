"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { dbConnect } from "@/database/mongoose";
import { auth } from "../better-auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getStockDetails } from "./finnhub.actions";

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
  } catch {
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string) {
  try {
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const existingItem = await Watchlist.findOne({
      userId: session?.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (existingItem) {
      return {
        success: false,
        message: "Stock already added to watchlist",
      };
    }

    const newItem = new Watchlist({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company,
    });

    await newItem.save();
    revalidatePath("/watchlist");
    return {
      success: true,
      message: "Stock added to watchlist",
    };
  } catch {
    throw new Error("Failed to add stock to watchlist");
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    await dbConnect();
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    await Watchlist.deleteOne({
      userId: session?.user.id,
      symbol: symbol.toUpperCase(),
    });
    revalidatePath("/watchlist");

    return {
      success: true,
      message: "Stock removed from watchlist",
    };
  } catch {
    throw new Error("Failed to delete stock");
  }
}

export async function getUserWatchlist() {
  try {
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const watchlist = await Watchlist.find({ userId: session?.user.id })
      .sort({ addedAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(watchlist));
  } catch {
    throw new Error("Failed to fetch user watchlist");
  }
}

export const getWatchlistWithData = async () => {
  try {
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const watchlist = await Watchlist.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();

    if (watchlist.length === 0) return [];

    const stocksWithData = await Promise.all(
      watchlist.map(async (item) => {
        try {
          const stockData = await getStockDetails(item.symbol);

          if (!stockData) {
            return item;
          }
          return {
            company: stockData.company,
            symbol: stockData.symbol,
            currentPrice: stockData.currentPrice,
            priceFormatted: stockData.priceFormatted,
            changeFormatted: stockData.changeFormatted,
            changePercent: stockData.changePercent,
            marketCap: stockData.marketCapFormatted,
            peRatio: stockData.peRatio,
          };
        } catch {
          return item;
        }
      })
    );

    return JSON.parse(JSON.stringify(stocksWithData));
  } catch {
    throw new Error(`Failed to fetch watchlist data`);
  }
};
