 'use server';

import { connectToDatabase } from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.model";

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  try {
    const mongooseConnection = await connectToDatabase();
    const db = mongooseConnection.connection.db;
    if (!db) throw new Error('Database connection not found');

    // Find the user by email in the user collection (Better Auth)
    const user = await db.collection('user').findOne({ email });

    if (!user) {
      return [];
    }

    const userId = user.id || user._id.toString();

    // Query the Watchlist by userId
    const watchlistItems = await Watchlist.find({ userId });

    // Return just the symbols as strings
    return watchlistItems.map((item) => item.symbol);
  } catch (error) {
    console.error('Error in getWatchlistSymbolsByEmail:', error);
    return [];
  }
}
