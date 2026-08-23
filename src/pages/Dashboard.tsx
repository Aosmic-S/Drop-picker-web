import React, { useState } from 'react';
import { KPICards } from '../components/dashboard/KPICards';
import { LiveDropFeed } from '../components/dashboard/LiveDropFeed';
import { RestockFeed, TodayDeals } from '../components/dashboard/SideFeeds';
import { useApp } from '@/src/context/AppContext';
import { 
  TrendingDown, 
  ArrowRight, 
  Flame, 
  Store,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const { 
    products,
    liveDrops, 
    settings, 
  } = useApp();

  const [selectedStore, setSelectedStore] = useState<string>('all');

  // Filtered drops based on retailer filter
  const filteredDrops = selectedStore === 'all' 
    ? liveDrops 
    : liveDrops.filter(d => d.store.toLowerCase().includes(selectedStore.toLowerCase()));

  const activeRetailers = [
    { name: 'Best Buy', slug: 'best buy', status: 'Online', itemsCount: products.filter(p => p.store === 'Best Buy' || p.allStores?.some(s => s.storeName === 'Best Buy')).length, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
    { name: 'Newegg', slug: 'newegg', status: 'Online', itemsCount: products.filter(p => p.store === 'Newegg' || p.allStores?.some(s => s.storeName === 'Newegg')).length, color: 'text-orange-400 border-orange-500/20 bg-orange-500/5' },
    { name: 'Steam', slug: 'steam', status: 'Online', itemsCount: products.filter(p => p.store === 'Steam' || p.allStores?.some(s => s.storeName === 'Steam')).length, color: 'text-sky-400 border-sky-500/20 bg-sky-500/5' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Live Market Price Ticker */}
      {liveDrops.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-gray-800/80 bg-[#0B0D11] px-3.5 py-2.5 text-xs no-scrollbar shadow-sm">
          <div className="flex items-center gap-1.5 shrink-0 font-mono font-bold text-emerald-400 text-[11px] tracking-wide">
            <Zap className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>MARKET STREAM</span>
          </div>
          <div className="h-4 w-px bg-gray-800 shrink-0" />
          <div className="flex items-center gap-6 text-xs whitespace-nowrap">
            {liveDrops.slice(0, 8).map(drop => (
              <Link 
                key={drop.id} 
                to={`/product/${drop.product.id}`} 
                className="flex items-center gap-2 hover:text-emerald-300 transition-colors group"
              >
                <span className="font-mono text-[10px] text-gray-500 uppercase px-1.5 py-0.5 rounded bg-gray-800/60 border border-gray-800">
                  {drop.store}
                </span>
                <span className="font-medium text-gray-300 truncate max-w-[160px] sm:max-w-[220px] group-hover:text-white transition-colors">
                  {drop.product.name.split(' ').slice(0, 4).join(' ')}
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {formatCurrency(drop.newPrice, settings.currency)}
                </span>
                {drop.percentageChange !== 0 && (
                  <span className={`font-mono text-[10px] font-semibold ${drop.percentageChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ({drop.percentageChange > 0 ? '+' : ''}{drop.percentageChange.toFixed(1)}%)
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Institutional Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-b from-[#101318] to-[#0A0C0F] p-6 rounded-2xl border border-gray-800/80 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>TERMINAL ACTIVE // BEST BUY • NEWEGG • STEAM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Hardware & Gaming Price Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
            Real-time automated price discovery, instant restock signals, and historical low-watermark indexing across North American tech retail and digital distribution.
          </p>
        </div>

        {/* Retailer Quick Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
          {activeRetailers.map(r => (
            <button
              key={r.slug}
              onClick={() => setSelectedStore(selectedStore === r.slug ? 'all' : r.slug)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                selectedStore === r.slug 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/30' 
                  : 'bg-[#12151B] border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold">{r.name}</span>
              <span className="text-[10px] text-gray-500">({r.itemsCount})</span>
            </button>
          ))}

          {selectedStore !== 'all' && (
            <button
              onClick={() => setSelectedStore('all')}
              className="text-[11px] text-gray-400 hover:text-gray-200 underline font-mono px-1 py-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* KPIs & Metrics Section */}
      <KPICards />

      {/* Main Grid: Feed + Sideboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[500px]">
          <LiveDropFeed filterStore={selectedStore} />
        </div>
        <div className="space-y-6 flex flex-col min-h-[500px]">
          <div className="flex-1 min-h-[240px]">
            <RestockFeed />
          </div>
          <div className="flex-1 min-h-[240px]">
            <TodayDeals />
          </div>
        </div>
      </div>
    </div>
  );
}
