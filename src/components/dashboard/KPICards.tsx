import React from 'react';
import { TrendingDown, RefreshCcw, Tag, Bookmark, Package, BellRing } from 'lucide-react';
import { Card } from '../ui/Card';
import { useApp } from '@/src/context/AppContext';
import { Link } from 'react-router';

export function KPICards() {
  const { products, liveDrops, watchlist, priceAlerts } = useApp();

  const totalDeals = products.filter(p => p.originalPrice && p.currentPrice < p.originalPrice).length;
  const inStockCount = products.filter(p => p.stockStatus === 'In Stock').length;
  const activeAlertsCount = priceAlerts.filter(a => a.status === 'active').length;
  const dropsCount = liveDrops.filter(d => d.type === 'drop').length;

  const kpis = [
    { 
      label: 'VERIFIED DROPS', 
      value: `${dropsCount}`, 
      subtext: 'Active reductions', 
      icon: TrendingDown, 
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      path: '/drops'
    },
    { 
      label: 'IN-STOCK ITEMS', 
      value: `${inStockCount}`, 
      subtext: 'Ready to order', 
      icon: RefreshCcw, 
      color: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      path: '/restocks'
    },
    { 
      label: 'LIVE DEALS', 
      value: `${totalDeals}`, 
      subtext: 'Below standard MSRP', 
      icon: Tag, 
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      path: '/deals'
    },
    { 
      label: 'TRACKED CATALOG', 
      value: `${products.length}`, 
      subtext: 'Hardware & Games', 
      icon: Package, 
      color: 'text-gray-300',
      badgeBg: 'bg-gray-800 text-gray-300 border-gray-700',
      path: '/pc-hardware'
    },
    { 
      label: 'WATCHLIST QUEUE', 
      value: `${watchlist.length}`, 
      subtext: 'Custom targets', 
      icon: Bookmark, 
      color: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      path: '/watchlist'
    },
    { 
      label: 'PRICE ALERTS', 
      value: `${activeAlertsCount}`, 
      subtext: 'Listening triggers', 
      icon: BellRing, 
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      path: '/alerts/price'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi, idx) => (
        <Link key={idx} to={kpi.path} className="group block focus:outline-none">
          <div className="h-full rounded-xl border border-gray-800/80 bg-[#0B0D11] hover:bg-[#10131A] hover:border-gray-700 p-4 flex flex-col justify-between transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase truncate">
                {kpi.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${kpi.badgeBg}`}>
                <kpi.icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-gray-100 group-hover:text-emerald-400 transition-colors">
                {kpi.value}
              </div>
              <div className="text-[11px] font-medium text-gray-400 mt-1 truncate">
                {kpi.subtext}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
