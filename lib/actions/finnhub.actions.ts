'use server';

import { 
  getDateRange, 
  validateArticle, 
  formatArticle, 
  calculateNewsDistribution 
} from "@/lib/utils";

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit = revalidateSeconds !== undefined
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
}

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  try {
    const { from, to } = getDateRange(5);

    if (symbols && symbols.length > 0) {
      const cleanSymbols = symbols.map(s => s.trim().toUpperCase());
      const { itemsPerSymbol } = calculateNewsDistribution(cleanSymbols.length);
      
      const allArticles: MarketNewsArticle[] = [];
      const seenUrls = new Set<string>();

      // Loop max 6 times, round-robin through symbols
      for (let i = 0; i < 6; i++) {
        const symbolIndex = i % cleanSymbols.length;
        const symbol = cleanSymbols[symbolIndex];
        
        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
        
        try {
          const rawArticles: RawNewsArticle[] = await fetchJSON<RawNewsArticle[]>(url, 3600);
          
          // Find one valid article not already seen
          const validArticle = rawArticles.find(article => 
            validateArticle(article) && !seenUrls.has(article.url!)
          );

          if (validArticle) {
            seenUrls.add(validArticle.url!);
            allArticles.push(formatArticle(validArticle, true, symbol, i));
          }
        } catch (err) {
          console.error(`Error fetching news for ${symbol}:`, err);
          // Continue to next symbol
        }

        if (allArticles.length >= 6) break;
      }

      // If no symbol news found, fallback to general news
      if (allArticles.length === 0) {
        return getNews();
      }

      return allArticles.sort((a, b) => b.datetime - a.datetime);
    } else {
      // Fetch general market news
      const url = `${FINNHUB_BASE_URL}/news?category=general&token=${NEXT_PUBLIC_FINNHUB_API_KEY}`;
      const rawArticles: RawNewsArticle[] = await fetchJSON<RawNewsArticle[]>(url, 3600);

      const formattedArticles = rawArticles
        .filter(validateArticle)
        .map((article, index) => formatArticle(article, false, undefined, index));

      // Deduplicate by id/url/headline
      const seen = new Set<string>();
      const uniqueArticles: MarketNewsArticle[] = [];

      for (const article of formattedArticles) {
        const identifier = `${article.id}-${article.url}-${article.headline}`;
        if (!seen.has(identifier)) {
          seen.add(identifier);
          uniqueArticles.push(article);
        }
        if (uniqueArticles.length >= 6) break;
      }

      return uniqueArticles;
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news');
  }
}
