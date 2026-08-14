import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency, formatPercentage, getDealScoreColor } from '../lib/utils';
import { TrendingDown, Filter, Zap, Volume2, VolumeX, Pause, Play, Bell, Bookmark, Check, ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router';

export function LiveDropsPage() {
  const { liveDrops, triggerLiveDropSimulation, settings, addToWatchlist, isProductInWatchlist, setActiveAlertModalProduct } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minDropPercent, setMinDropPercent] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'pc_hardware', label: 'PC Hardware' },
    { id: 'console', label: 'Consoles' },
    { id: 'game', label: 'Games' },
    { id: 'accessory', label: 'Accessories' }
  ];

  const filteredDrops = liveDrops.filter(drop => {
    if (selectedCategory !== 'all' && drop.product.category !== selectedCategory) return false;
    if (minDropPercent > 0 && Math.abs(drop.percentageChange) < minDropPercent) return false;
    if (searchQuery && !drop.product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !drop.store.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-Time Ingestion Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Live Price Drops
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Instant price slashes and discount drops detected across e-commerce APIs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              soundEnabled ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-gray-800 bg-[#12151A] text-gray-400 hover:text-gray-200'
            }`}
            title="Toggle Audio Ding on Drop"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">Audio Alerts</span>
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isPaused ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-gray-800 bg-[#12151A] text-gray-400 hover:text-gray-200'
            }`}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span>{isPaused ? 'Resume' : 'Pause Stream'}</span>
          </button>

          <Button
            onClick={triggerLiveDropSimulation}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs h-9"
          >
            <Zap className="h-3.5 w-3.5 mr-1" /> Simulate Drop Event
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#12151A] p-1 rounded-lg border border-gray-800">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat.id ? 'bg-gray-800 text-emerald-400 shadow font-semibold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Drop Tier Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Min Drop:</span>
            {[
              { label: 'All', val: 0 },
              { label: '>5%', val: 5 },
              { label: '>10%', val: 10 },
              { label: '>20%', val: 20 },
              { label: '>30%', val: 30 },
            ].map(tier => (
              <button
                key={tier.label}
                onClick={() => setMinDropPercent(tier.val)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  minDropPercent === tier.val 
                    ? 'bg-emerald-500 text-black font-bold' 
                    : 'bg-[#12151A] border border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search feed..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#12151A]"
            />
          </div>
        </div>
      </Card>

      {/* Main Live Drop Stream Cards */}
      <div className="space-y-3">
        {filteredDrops.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-gray-800 bg-[#0D0F12]">
            <TrendingDown className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-300">No drops match your filters</h3>
            <p className="text-xs text-gray-500 mt-1">Try resetting the minimum drop percentage or search term.</p>
          </div>
        ) : (
          filteredDrops.map((drop) => {
            const inWatch = isProductInWatchlist(drop.product.id);
            const absoluteSaved = drop.previousPrice > drop.newPrice ? drop.previousPrice - drop.newPrice : 0;

            return (
              <div
                key={drop.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-800 bg-[#0D0F12] hover:border-gray-700 hover:bg-[#12151A] transition-all gap-4 shadow-sm"
              >
                {/* Product details */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <Link
                    to={`/product/${drop.product.id}`}
                    className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg border border-gray-800 bg-[#171A20] p-1.5 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={drop.product.image}
                      alt={drop.product.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-gray-300 uppercase tracking-wider">{drop.store}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 capitalize">{drop.product.subCategory || drop.product.category}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500 text-[11px]">{drop.timestamp}</span>
                    </div>

                    <Link to={`/product/${drop.product.id}`}>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-100 truncate group-hover:text-emerald-400 transition-colors">
                        {drop.product.name}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="text-lg font-bold font-mono text-emerald-400">
                        {formatCurrency(drop.newPrice, settings.currency)}
                      </span>
                      {drop.previousPrice > drop.newPrice && (
                        <span className="text-xs text-gray-500 line-through font-mono">
                          {formatCurrency(drop.previousPrice, settings.currency)}
                        </span>
                      )}
                      {drop.percentageChange !== 0 && (
                        <Badge variant={drop.percentageChange < 0 ? "success" : "destructive"} className="font-mono text-xs">
                          {formatPercentage(drop.percentageChange)}
                        </Badge>
                      )}
                      {absoluteSaved > 0 && (
                        <span className="text-xs font-mono text-emerald-500 font-semibold">
                          Save {formatCurrency(absoluteSaved, settings.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side metrics and actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getDealScoreColor(drop.product.dealScore)} bg-gray-900 border-gray-800`}>
                      Deal Score {drop.product.dealScore}/100
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => inWatch ? null : addToWatchlist(drop.product.id)}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        inWatch
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      title={inWatch ? "In Watchlist" : "Add to Watchlist"}
                    >
                      {inWatch ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() => setActiveAlertModalProduct(drop.product)}
                      className="p-2 rounded-lg border border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      title="Set Price Alert"
                    >
                      <Bell className="h-4 w-4" />
                    </button>

                    <Link to={`/product/${drop.product.id}`}>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
