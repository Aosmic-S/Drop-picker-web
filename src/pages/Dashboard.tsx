import React, { useState } from 'react';
import { KPICards } from '../components/dashboard/KPICards';
import { LiveDropFeed } from '../components/dashboard/LiveDropFeed';
import { RestockFeed, TodayDeals } from '../components/dashboard/SideFeeds';
import { useApp } from '@/src/context/AppContext';
import { 
  TrendingDown, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  RefreshCw, 
  Database,
  Globe
} from 'lucide-react';
import { Link } from 'react-router';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const { 
    liveDrops, 
    settings, 
    setIsScrapeModalOpen, 
    triggerBackendScrapeJob, 
    syncWithSupabaseDatabase,
    isSupabaseActive
  } = useApp();

  const [isScraping, setIsScraping] = useState(false);

  const handleTriggerScraper = async () => {
    setIsScraping(true);
    await triggerBackendScrapeJob('all', 'all');
    await syncWithSupabaseDatabase();
    setIsScraping(false);
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Live Market Ticker */}
      {liveDrops.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-gray-800 bg-[#0D0F12] p-2.5 text-xs no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0 px-1.5 font-mono font-bold text-emerald-400 text-[11px]">
            <Flame className="h-3.5 w-3.5 text-emerald-400" />
            <span>MARKET TICKER</span>
          </div>
          <div className="h-3.5 w-[1px] bg-gray-800 shrink-0" />
          <div className="flex items-center gap-5 text-xs whitespace-nowrap">
            {liveDrops.slice(0, 6).map(drop => (
              <Link 
                key={drop.id} 
                to={`/product/${drop.product.id}`} 
                className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
              >
                <span className="font-semibold text-gray-300 truncate max-w-[140px] sm:max-w-[200px]">
                  {drop.product.brand} {drop.product.name.split(' ').slice(0, 3).join(' ')}
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {formatCurrency(drop.newPrice, settings.currency)}
                </span>
                {drop.percentageChange !== 0 && (
                  <span className={`font-mono text-[10px] ${drop.percentageChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ({drop.percentageChange > 0 ? '+' : ''}{drop.percentageChange.toFixed(1)}%)
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>E-Commerce & Gaming Terminal</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-100">
            Real-Time Drop & Deal Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Tracking live stock & pricing from Amazon, Flipkart, Steam, Croma & PS Store.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsScrapeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md shadow-emerald-500/10 min-h-[38px]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Scrape URL</span>
          </button>

          <button
            onClick={handleTriggerScraper}
            disabled={isScraping}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 bg-[#12151A] hover:bg-gray-800 text-gray-200 text-xs font-semibold transition-colors min-h-[38px]"
            title="Dispatch Scraper Crawler Daemon"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-gray-400 ${isScraping ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isScraping ? 'Syncing...' : 'Sync Scrapers'}</span>
          </button>

          <Link
            to="/drops"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-colors min-h-[38px]"
          >
            <span>Live Drops</span>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <KPICards />

      {/* Main Grid: Feed + Sideboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[460px] lg:h-[560px]">
          <LiveDropFeed />
        </div>
        <div className="space-y-6 min-h-[460px] lg:h-[560px] flex flex-col">
          <div className="flex-1 min-h-[220px]">
            <RestockFeed />
          </div>
          <div className="flex-1 min-h-[220px]">
            <TodayDeals />
          </div>
        </div>
      </div>
    </div>
  );
}
