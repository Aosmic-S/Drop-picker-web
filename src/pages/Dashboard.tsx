import React from 'react';
import { KPICards } from '../components/dashboard/KPICards';
import { LiveDropFeed } from '../components/dashboard/LiveDropFeed';
import { RestockFeed, TodayDeals } from '../components/dashboard/SideFeeds';
import { useApp } from '@/src/context/AppContext';
import { TrendingDown, Zap, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { Link } from 'react-router';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const { liveDrops, triggerLiveDropSimulation, settings, products } = useApp();

  return (
    <div className="flex flex-col gap-6">
      {/* Live Market Ticker */}
      <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-gray-800 bg-[#0D0F12] p-2.5 text-xs no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0 px-2 font-mono font-bold text-emerald-400">
          <Flame className="h-4 w-4 text-emerald-400" />
          <span>MARKET TICKER</span>
        </div>
        <div className="h-4 w-[1px] bg-gray-800 shrink-0" />
        <div className="flex items-center gap-6 text-xs whitespace-nowrap">
          {liveDrops.slice(0, 5).map(drop => (
            <Link key={drop.id} to={`/product/${drop.product.id}`} className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
              <span className="font-semibold text-gray-300">{drop.product.brand} {drop.product.name.split(' ').slice(0, 3).join(' ')}</span>
              <span className="font-mono text-emerald-400 font-bold">{formatCurrency(drop.newPrice, settings.currency)}</span>
              {drop.percentageChange !== 0 && (
                <span className={`font-mono text-[10px] ${drop.percentageChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({drop.percentageChange > 0 ? '+' : ''}{drop.percentageChange.toFixed(1)}%)
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <span>● Gaming Commerce Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Real-Time Drop & Deal Terminal
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitoring hardware, consoles, games, and accessories across 48+ verified retailers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerLiveDropSimulation}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Simulate Live Drop</span>
          </button>
          <Link
            to="/drops"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-800 text-gray-200 text-xs font-semibold hover:bg-gray-700 transition-colors"
          >
            <span>Live Stream</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <KPICards />

      {/* Main Grid: Feed + Sideboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[560px]">
          <LiveDropFeed />
        </div>
        <div className="space-y-6 h-[560px] flex flex-col">
          <div className="flex-1 min-h-0">
            <RestockFeed />
          </div>
          <div className="flex-1 min-h-0">
            <TodayDeals />
          </div>
        </div>
      </div>
    </div>
  );
}
