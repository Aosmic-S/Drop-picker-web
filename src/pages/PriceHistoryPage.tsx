import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockMarketAnalytics } from '../lib/mockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { LineChart, BarChart3, Scale, TrendingDown, Store, CheckCircle2, Zap } from 'lucide-react';

export function PriceHistoryPage() {
  const { settings } = useApp();
  const [selectedTimeline, setSelectedTimeline] = useState<'30D' | '90D' | '1Y'>('30D');

  const trendData = [
    { period: 'Jan', gpus: 100, cpus: 100, ssds: 100, consoles: 100 },
    { period: 'Feb', gpus: 96, cpus: 98, ssds: 94, consoles: 99 },
    { period: 'Mar', gpus: 92, cpus: 95, ssds: 88, consoles: 97 },
    { period: 'Apr', gpus: 89, cpus: 91, ssds: 82, consoles: 96 },
    { period: 'May', gpus: 85, cpus: 88, ssds: 79, consoles: 94 },
    { period: 'Jun', gpus: 82, cpus: 86, ssds: 75, consoles: 92 },
    { period: 'Jul', gpus: 80, cpus: 84, ssds: 72, consoles: 91 },
    { period: 'Aug', gpus: 78, cpus: 82, ssds: 69, consoles: 89 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <LineChart className="h-4 w-4 text-emerald-400" />
            <span>Macro Commerce Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Market Trends & Store Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Historic pricing cycles, store competitiveness indices, and category deflation trends.
          </p>
        </div>

        {/* Timeline Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0D0F12] p-1 rounded-lg border border-gray-800">
          {(['30D', '90D', '1Y'] as const).map(time => (
            <button
              key={time}
              onClick={() => setSelectedTimeline(time)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                selectedTimeline === time ? 'bg-gray-800 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <span className="text-xs text-gray-400">Avg Hardware Discount</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            -{mockMarketAnalytics.averageHardwareDiscount}%
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Vs MSRP baseline</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <span className="text-xs text-gray-400">Avg Game Discount</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            -{mockMarketAnalytics.averageGameDiscount}%
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Across Steam & PSN</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <span className="text-xs text-gray-400">Market Volatility</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {mockMarketAnalytics.marketVolatilityIndex}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Low price swing risk</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <span className="text-xs text-gray-400">Monthly Market Shift</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {mockMarketAnalytics.monthlyMarketChange}%
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">Deflationary savings</span>
        </Card>
      </div>

      {/* Main Interactive Category Index Chart */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6">
        <CardHeader className="p-0 pb-4 border-b border-gray-800/80 mb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-gray-100 uppercase tracking-wider">
              Category Price Trajectory Index (Base = 100)
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">Tracking index deflation across key categories</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span> GPUs
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-400"></span> CPUs
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span> SSDs
            </span>
          </div>
        </CardHeader>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#4b5563" fontSize={11} tickLine={false} />
              <YAxis stroke="#4b5563" fontSize={11} tickLine={false} domain={[60, 105]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#12151A', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Area type="monotone" dataKey="gpus" stroke="#10b981" fillOpacity={1} fill="url(#colorGpu)" strokeWidth={2} name="GPUs Index" />
              <Area type="monotone" dataKey="cpus" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} name="CPUs Index" />
              <Area type="monotone" dataKey="ssds" stroke="#a855f7" fillOpacity={0} strokeWidth={2} name="SSDs Index" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category Performance Breakdown Table */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6">
        <CardHeader className="p-0 pb-4 border-b border-gray-800/80 mb-4">
          <CardTitle className="text-sm font-bold text-gray-100 uppercase tracking-wider">
            Category Market Health Metrics
          </CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 font-mono">
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">7-Day Price Movement</th>
                <th className="pb-3 font-semibold">Average Discount</th>
                <th className="pb-3 font-semibold">Inventory Status</th>
                <th className="pb-3 font-semibold text-right">Price Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {mockMarketAnalytics.categoryTrends.map(cat => (
                <tr key={cat.name} className="hover:bg-[#12151A] transition-colors">
                  <td className="py-3 font-medium text-gray-200">{cat.name}</td>
                  <td className={`py-3 ${cat.weeklyChange < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {cat.weeklyChange}%
                  </td>
                  <td className="py-3 text-gray-300">-{cat.discountAvg}%</td>
                  <td className="py-3 text-gray-400">{cat.stockLevel}</td>
                  <td className="py-3 text-right text-gray-200 font-bold">{cat.indexValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Store Competitiveness Matrix */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6">
        <CardHeader className="p-0 pb-4 border-b border-gray-800/80 mb-4 flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-gray-100 uppercase tracking-wider">
              Retailer Competitiveness & Price Match Intelligence
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">Which store delivers the most frequent price drops and best deals?</p>
          </div>
          <Scale className="h-5 w-5 text-gray-500" />
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 font-mono">
                <th className="pb-3 font-semibold">Retailer</th>
                <th className="pb-3 font-semibold">Lowest Price Share</th>
                <th className="pb-3 font-semibold">Avg Shipping Speed</th>
                <th className="pb-3 font-semibold">Deal Drop Frequency</th>
                <th className="pb-3 font-semibold text-right">Reliability Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {mockMarketAnalytics.storeCompetitiveness.map(store => (
                <tr key={store.store} className="hover:bg-[#12151A] transition-colors">
                  <td className="py-3.5 font-bold text-gray-100 flex items-center gap-2">
                    <Store className="h-3.5 w-3.5 text-gray-400" /> {store.store}
                  </td>
                  <td className="py-3.5 text-emerald-400 font-bold">{store.lowestPriceShare}</td>
                  <td className="py-3.5 text-gray-300">{store.avgShippingSpeed}</td>
                  <td className="py-3.5 text-gray-400">{store.dealFrequency}</td>
                  <td className="py-3.5 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {store.reliabilityScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
