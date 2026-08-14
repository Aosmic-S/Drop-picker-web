import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatPercentage, getDealScoreColor } from '../lib/utils';
import { Flame, Eye, TrendingDown, Star, Sparkles, Bookmark, Bell, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router';

export function TrendingPage() {
  const { products, settings, addToWatchlist, isProductInWatchlist, setActiveAlertModalProduct } = useApp();
  const [activeTab, setActiveTab] = useState<'watched' | 'drops' | 'score'>('watched');

  let sortedProducts = [...products];
  if (activeTab === 'watched') {
    sortedProducts.sort((a, b) => (b.watchCount || 0) - (a.watchCount || 0));
  } else if (activeTab === 'drops') {
    sortedProducts.sort((a, b) => (a.dropPercentage || 0) - (b.dropPercentage || 0));
  } else if (activeTab === 'score') {
    sortedProducts.sort((a, b) => b.dealScore - a.dealScore);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono mb-1">
            <Flame className="h-4 w-4 text-rose-500" />
            <span>Community & Market Velocity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Trending Gaming Hardware & Deals
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            The most tracked, searched, and coveted gaming tech and titles right now.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0D0F12] p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => setActiveTab('watched')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'watched' ? 'bg-gray-800 text-rose-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Most Watched
          </button>
          <button
            onClick={() => setActiveTab('drops')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'drops' ? 'bg-gray-800 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" /> Biggest Drops
          </button>
          <button
            onClick={() => setActiveTab('score')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'score' ? 'bg-gray-800 text-amber-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Star className="h-3.5 w-3.5" /> Top Deal Score
          </button>
        </div>
      </div>

      {/* Ranked List #1 to #10 */}
      <div className="space-y-3">
        {sortedProducts.slice(0, 10).map((product, idx) => {
          const rank = idx + 1;
          const inWatch = isProductInWatchlist(product.id);
          let rankBadgeBg = 'bg-gray-800 text-gray-400';
          if (rank === 1) rankBadgeBg = 'bg-amber-500 text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.4)]';
          if (rank === 2) rankBadgeBg = 'bg-slate-300 text-black font-extrabold';
          if (rank === 3) rankBadgeBg = 'bg-amber-700 text-white font-extrabold';

          return (
            <div
              key={product.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-800 bg-[#0D0F12] hover:border-gray-700 hover:bg-[#12151A] transition-all gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Rank Number */}
                <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center font-mono text-sm ${rankBadgeBg}`}>
                  #{rank}
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="h-16 w-16 shrink-0 rounded-lg border border-gray-800 bg-[#171A20] p-1 flex items-center justify-center overflow-hidden"
                >
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                </Link>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-gray-300 uppercase tracking-wider">{product.brand}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400 capitalize">{product.subCategory || product.category}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">{product.store}</span>
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-100 truncate group-hover:text-rose-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {formatCurrency(product.currentPrice, settings.currency)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.currentPrice && (
                      <span className="text-xs text-gray-500 line-through font-mono">
                        {formatCurrency(product.originalPrice, settings.currency)}
                      </span>
                    )}
                    {product.dropPercentage && (
                      <Badge variant="success" className="font-mono text-xs">
                        {formatPercentage(product.dropPercentage)}
                      </Badge>
                    )}
                    {product.watchCount && (
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                        <Eye className="h-3.5 w-3.5 text-gray-500" /> {product.watchCount.toLocaleString()} tracking
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                <div className={`text-xs font-mono font-bold ${getDealScoreColor(product.dealScore)}`}>
                  Score {product.dealScore}/100
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => inWatch ? null : addToWatchlist(product.id)}
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
                    onClick={() => setActiveAlertModalProduct(product)}
                    className="p-2 rounded-lg border border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Set Alert"
                  >
                    <Bell className="h-4 w-4" />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <Button size="sm" variant="secondary" className="h-8 text-xs">
                      View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
