import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { User, Shield, Award, Bookmark, Bell, Zap, Clock, ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router';

export function ProfilePage() {
  const { watchlist, priceAlerts, settings } = useApp();

  const totalTrackedValue = watchlist.reduce((acc, item) => acc + item.product.currentPrice, 0);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Profile Header */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center">
              <div className="h-full w-full bg-[#0D0F12] rounded-full flex items-center justify-center text-emerald-400 font-bold text-xl">
                DP
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-100">Gaming Commerce Operator</h2>
                <Badge variant="success" className="font-mono text-[10px] py-0 px-1.5 uppercase">
                  PRO TIER
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">operator@droppicker.internal • Member since 2026</p>
            </div>
          </div>

          <Link to="/settings">
            <Button variant="outline" size="sm" className="text-xs">
              <Settings className="h-3.5 w-3.5 mr-1.5" /> Account Settings
            </Button>
          </Link>
        </div>
      </Card>

      {/* Account Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Portfolio Value Tracked</span>
            <Bookmark className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-gray-100">
            {formatCurrency(totalTrackedValue, settings.currency)}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{watchlist.length} hardware items</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Active Price Triggers</span>
            <Bell className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">
            {priceAlerts.length} Active
          </div>
          <span className="text-[10px] text-gray-500 font-mono">24/7 API Monitoring</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Estimated Savings Caught</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatCurrency(18500, settings.currency)}
          </div>
          <span className="text-[10px] text-emerald-500/80 font-mono">From 6 price drops</span>
        </Card>
      </div>

      {/* Tracked Categories Overview */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6">
        <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-4">
          Subscribed Category Priorities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'PC Graphics Cards', status: 'Priority Instant', color: 'text-emerald-400' },
            { name: 'Consoles (PS5 & Switch 2)', status: 'Restock Alert', color: 'text-blue-400' },
            { name: 'Fast NVMe SSDs', status: 'Lowest Price', color: 'text-purple-400' },
            { name: 'Esports Peripherals', status: 'Deal Score 80+', color: 'text-amber-400' },
          ].map(cat => (
            <div key={cat.name} className="p-3 rounded-lg bg-[#12151A] border border-gray-800">
              <div className="text-xs font-semibold text-gray-200">{cat.name}</div>
              <div className={`text-[10px] font-mono mt-1 ${cat.color}`}>{cat.status}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
