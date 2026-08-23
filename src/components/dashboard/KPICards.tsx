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
      label: 'Price Drops', 
      value: `${dropsCount}`, 
      change: dropsCount > 0 ? `${dropsCount} verified drops` : 'Listening to feed', 
      trend: 'up', 
      icon: TrendingDown, 
      color: 'text-emerald-400',
      path: '/drops'
    },
    { 
      label: 'Live Restocks', 
      value: `${inStockCount}`, 
      change: inStockCount > 0 ? `${inStockCount} in stock` : '0 in stock', 
      trend: 'up', 
      icon: RefreshCcw, 
      color: 'text-blue-400',
      path: '/restocks'
    },
    { 
      label: 'Active Deals', 
      value: `${totalDeals}`, 
      change: totalDeals > 0 ? `${totalDeals} discounted` : '0 active', 
      trend: 'up', 
      icon: Tag, 
      color: 'text-emerald-500',
      path: '/deals'
    },
    { 
      label: 'Watchlist Items', 
      value: `${watchlist.length}`, 
      change: `${watchlist.length} tracked`, 
      trend: 'neutral', 
      icon: Bookmark, 
      color: 'text-gray-300',
      path: '/watchlist'
    },
    { 
      label: 'Tracked Products', 
      value: `${products.length}`, 
      change: `${products.length} live items`, 
      trend: 'up', 
      icon: Package, 
      color: 'text-gray-400',
      path: '/pc-hardware'
    },
    { 
      label: 'Active Alerts', 
      value: `${activeAlertsCount}`, 
      change: activeAlertsCount > 0 ? `${activeAlertsCount} active` : 'None active', 
      trend: 'up', 
      icon: BellRing, 
      color: 'text-amber-400',
      path: '/alerts/price'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi, idx) => (
        <Link key={idx} to={kpi.path} className="group block">
          <Card className="bg-[#0D0F12] border-gray-800/80 hover:border-gray-700 p-4 flex flex-col justify-between transition-colors h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-gray-400 truncate">{kpi.label}</span>
              <kpi.icon className={`h-4 w-4 ${kpi.color} opacity-80 group-hover:scale-110 transition-transform`} />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono tracking-tight text-gray-100">{kpi.value}</div>
              <div className="text-[10px] font-medium font-mono text-emerald-400 mt-1">
                {kpi.change}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
