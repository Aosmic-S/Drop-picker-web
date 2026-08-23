import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency, formatPercentage, getDealScoreColor, getDealScoreLabel, getDealScoreBg } from '../lib/utils';
import { Tag, Sparkles, SlidersHorizontal, Search, Bell, Bookmark, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function DealsPage() {
  const { products, settings, addToWatchlist, isProductInWatchlist, setActiveAlertModalProduct } = useApp();
  const [minDealScore, setMinDealScore] = useState<number>(75);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const deals = products
    .filter(p => {
      if (p.dealScore < minDealScore) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.dealScore - a.dealScore);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Algorithmically Verified Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Curated Gaming Deals & Bargains
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Every deal is scored against 180-day price history, retailer reliability, and current market value.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0D0F12] border border-gray-800 rounded-lg p-2 px-3.5 text-xs text-gray-300 font-mono">
            <span className="text-emerald-400 font-bold">{deals.length}</span> Verified Deals
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#12151A] p-1 rounded-lg border border-gray-800">
            {[
              { id: 'all', label: 'All Deals' },
              { id: 'pc_hardware', label: 'PC Hardware' },
              { id: 'console', label: 'Consoles' },
              { id: 'game', label: 'Games' },
              { id: 'accessory', label: 'Accessories' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat.id ? 'bg-gray-800 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Deal Score Threshold */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Min Score:
            </span>
            {[
              { label: 'All Deals', val: 50 },
              { label: 'Good (60+)', val: 60 },
              { label: 'Excellent (75+)', val: 75 },
              { label: 'Exceptional (90+)', val: 90 },
            ].map(tier => (
              <button
                key={tier.label}
                onClick={() => setMinDealScore(tier.val)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  minDealScore === tier.val 
                    ? 'bg-emerald-500 text-black font-bold' 
                    : 'bg-[#12151A] border border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search deals..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#12151A]"
            />
          </div>
        </div>
      </Card>

      {/* Grid of Deals */}
      {deals.length === 0 ? (
        <Card className="bg-[#0D0F12] border-gray-800 p-12 text-center">
          <Tag className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">No deals match your filter</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try lowering the Deal Score threshold or selecting "All Deals" to see all available discounts.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map(product => {
            const discountPct = product.originalPrice ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100) : 0;
            const savings = product.originalPrice ? product.originalPrice - product.currentPrice : 0;
            const inWatch = isProductInWatchlist(product.id);

            return (
              <Card key={product.id} className="bg-[#0D0F12] border-gray-800 hover:border-gray-700 p-5 flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getDealScoreBg(product.dealScore)}`}>
                      Score {product.dealScore} • {getDealScoreLabel(product.dealScore)}
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">{product.store}</span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="h-20 w-20 shrink-0 rounded-lg bg-[#171A20] border border-gray-800 p-1 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-bold text-gray-500">{product.brand}</div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-emerald-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold font-mono text-emerald-400">
                          {formatCurrency(product.currentPrice, settings.currency)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through font-mono">
                            {formatCurrency(product.originalPrice, settings.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Savings pill */}
                  <div className="bg-[#12151A] rounded-lg p-2.5 border border-gray-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">Total Savings:</span>
                    <span className="text-emerald-400 font-bold">
                      {savings > 0 ? `${formatCurrency(savings, settings.currency)} (${discountPct}% OFF)` : 'At All-Time Low'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-800/60 mt-4">
                  <button
                    onClick={() => inWatch ? null : addToWatchlist(product.id)}
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      inWatch ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700'
                    }`}
                    title={inWatch ? "In Watchlist" : "Add to Watchlist"}
                  >
                    {inWatch ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => setActiveAlertModalProduct(product)}
                    className="p-2 rounded-lg border border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700 transition-colors"
                    title="Alert"
                  >
                    <Bell className="h-4 w-4" />
                  </button>

                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button size="sm" className="w-full text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                      View Deal <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
