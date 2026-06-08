import React from 'react';
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG
} from "@/lib/constants";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";

const StockDetails = async ({ params }: StockDetailsPageProps) => {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    const session = await auth.api.getSession({
        headers: await headers()
    });

    let isInWatchlist = false;
    if (session?.user?.email) {
        const watchlistSymbols = await getWatchlistSymbolsByEmail(session.user.email);
        isInWatchlist = watchlistSymbols.includes(upperSymbol);
    }

    const scriptBaseUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

    return (
        <main className="flex min-h-screen p-4 md:p-8">
            <div className="grid stock-details-container">
                {/* Left Column */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <TradingViewWidget
                        scriptUrl={`${scriptBaseUrl}symbol-info.js`}
                        config={SYMBOL_INFO_WIDGET_CONFIG(upperSymbol)}
                        height={170}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBaseUrl}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(upperSymbol)}
                        height={600}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBaseUrl}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(upperSymbol)}
                        height={600}
                    />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-8">
                    <WatchlistButton
                        symbol={upperSymbol}
                        company={upperSymbol}
                        isInWatchlist={isInWatchlist}
                    />
                    
                    <TradingViewWidget
                        scriptUrl={`${scriptBaseUrl}technical-analysis.js`}
                        config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(upperSymbol)}
                        height={400}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBaseUrl}symbol-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(upperSymbol)}
                        height={440}
                    />
                    <TradingViewWidget
                        scriptUrl={`${scriptBaseUrl}financials.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(upperSymbol)}
                        height={464}
                    />
                </div>
            </div>
        </main>
    );
};

export default StockDetails;
