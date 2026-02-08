"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { dbConnect } from "@/database/mongoose";
import { auth } from "../better-auth/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getStockDetails } from "./finnhub.actions";
import { watchlistRepository } from "../repositories/watchlist.repository";
import { logger } from "../utils/logger";

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
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const existingItem = await watchlistRepository.findByUserIdAndSymbol(
      session.user.id,
      symbol
    );

    if (existingItem) {
      return {
        success: false,
        message: "Stock already added to watchlist",
      };
    }

    await watchlistRepository.create({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company,
    });

    revalidatePath("/watchlist");
    return {
      success: true,
      message: "Stock added to watchlist",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    logger.error("Failed to add stock to watchlist", {
      symbol,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to add stock to watchlist");
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    await watchlistRepository.delete(session.user.id, symbol);
    revalidatePath("/watchlist");

    return {
      success: true,
      message: "Stock removed from watchlist",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    logger.error("Failed to remove stock from watchlist", {
      symbol,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to delete stock");
  }
}

export async function getUserWatchlist() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");

    const watchlist = await watchlistRepository.findByUserId(session.user.id);
    return JSON.parse(JSON.stringify(watchlist));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    logger.error("Failed to fetch user watchlist", {
      userId: session?.user?.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to fetch user watchlist");
  }
}

export const getWatchlistWithData = async () => {
  // Capture userId early so it's available in the error handler without a redundant session call
  let userId: string | undefined;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in");
    userId = session.user.id;

    const watchlist = await watchlistRepository.findByUserId(userId);

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
        } catch (error) {
          logger.error(`Failed to fetch data for ${item.symbol}`, {
            symbol: item.symbol,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return item;
        }
      })
    );

    return JSON.parse(JSON.stringify(stocksWithData));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    logger.error("Failed to fetch watchlist with data", {
      userId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to fetch watchlist data");
  }
};
