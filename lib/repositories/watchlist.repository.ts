import { Watchlist, WatchListItem } from "@/database/models/watchlist.model";
import { dbConnect } from "@/database/mongoose";

export interface CreateWatchlistItem {
  userId: string;
  symbol: string;
  company: string;
}

// Simplified return type that works with Mongoose lean() results
type LeanWatchListItem = {
  _id: string;
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
  __v?: number;
};

export interface WatchlistRepository {
  findByUserId(userId: string): Promise<LeanWatchListItem[]>;
  findByUserIdAndSymbol(userId: string, symbol: string): Promise<LeanWatchListItem | null>;
  create(item: CreateWatchlistItem): Promise<WatchListItem>;
  delete(userId: string, symbol: string): Promise<boolean>;
}

export class MongoWatchlistRepository implements WatchlistRepository {
  async findByUserId(userId: string): Promise<LeanWatchListItem[]> {
    await dbConnect();
    return Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean() as unknown as LeanWatchListItem[];
  }

  async findByUserIdAndSymbol(
    userId: string,
    symbol: string
  ): Promise<LeanWatchListItem | null> {
    await dbConnect();
    return Watchlist.findOne({
      userId,
      symbol: symbol.toUpperCase(),
    }).lean() as unknown as LeanWatchListItem | null;
  }

  async create(item: CreateWatchlistItem): Promise<WatchListItem> {
    await dbConnect();
    const newItem = new Watchlist({
      userId: item.userId,
      symbol: item.symbol.toUpperCase(),
      company: item.company,
    });
    return newItem.save();
  }

  async delete(userId: string, symbol: string): Promise<boolean> {
    await dbConnect();
    const result = await Watchlist.deleteOne({
      userId,
      symbol: symbol.toUpperCase(),
    });
    return result.deletedCount > 0;
  }
}

export const watchlistRepository = new MongoWatchlistRepository();
