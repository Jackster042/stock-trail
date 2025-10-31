"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { dbConnect } from "@/database/mongoose";
import { auth } from "../better-auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getStockDetails } from "./finnhub.actions";
import { warn } from "console";

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

export async function addToWatchlist(symbol: string, company: string) {
  try {
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
  } catch (error) {
    console.error("Error adding to watchlist", error);
    throw new Error("Failed to add stock to watchlist");
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
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
  } catch (error) {
    console.error("Error deleting stock", error);
    throw new Error("Failed to delete stock");
  }
}

export async function getUserWatchlist() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const watchlist = await Watchlist.find({ userId: session?.user.id })
      .sort({ addedAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(watchlist));
  } catch (error) {
    console.error("Error fetching user watchlist", error);
    throw new Error("Failed to fetch user watchlist");
  }
}

export const getWatchlistWithData = async () => {
  try {
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

          console.table(stockData);

          if (!stockData) {
            console.warn(`Failed to fetch data for ${item.symbol}`);
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
        } catch (error) {
          console.warn(`Failed to fetch data for ${item.symbol}`, error);
          return item;
        }
      })
    );

    return JSON.parse(JSON.stringify(stocksWithData));
  } catch (error) {
    console.error(`Error fetching watchlist data`, error);
    throw new Error(`Failed to fetch watchlist data`);
  }
};
