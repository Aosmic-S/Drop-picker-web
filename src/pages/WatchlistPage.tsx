import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency, getStockBadgeVariant } from '../lib/utils';
import { Bookmark, Trash2, Bell, ExternalLink, ArrowRight, Plus, Search, Edit2, Check } from 'lucide-react';
import { Link } from 'react-router';

export function WatchlistPage() {
  const { watchlist, removeFromWatchlist, updateWatchlistTarget, settings, setActiveAlertModalProduct, setIsCommandOpen } = useApp();
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [tempTarget, setTempTarget] = useState<number>(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const totalTrackedValue = watchlist.reduce((acc, item) => acc + item.product.currentPrice, 0);
  const totalTargetValue = watchlist.reduce((acc, item) => acc + item.targetPrice, 0);
  const totalPotentialSavings = totalTrackedValue - totalTargetValue;

  const filteredWatchlist = watchlist.filter(item => {
    if (filterCategory !== 'all' && item.product.category !== filterCategory) return false;
    return true;
  });

  const handleStartEdit = (id: string, currentTarget: number) => {
    setEditingTargetId(id);
    setTempTarget(currentTarget);
  };

  const handleSaveEdit = (productId: string) => {
    updateWatchlistTarget(productId, tempTarget);
    setEditingTargetId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <Bookmark className="h-4 w-4 text-emerald-400" />
            <span>Personal Portfolio Monitor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            My Product Watchlist
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Tracked items with custom target prices and automated drop notifications.
          </p>
        </div>

        <Button
          onClick={() => setIsCommandOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs h-9"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add Product to Watchlist
        </Button>
      </div>

      {/* Summary KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <span className="text-xs text-gray-400">Total Tracked Value</span>
          <div className="text-xl font-bold font-mono text-gray-100 mt-1">
            {formatCurrency(totalTrackedValue, settings.currency)}
          </div>
          <span className="text-[10px] text-gray-500">{watchlist.length} active items</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <span className="text-xs text-gray-400">Portfolio Target Value</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {formatCurrency(totalTargetValue, settings.currency)}
          </div>
          <span className="text-[10px] text-emerald-500/80 font-mono font-medium">Desired checkout total</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <span className="text-xs text-gray-400">Potential Target Savings</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {formatCurrency(Math.max(0, totalPotentialSavings), settings.currency)}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            {totalTrackedValue > 0 ? `${Math.round((totalPotentialSavings / totalTrackedValue) * 100)}% discount goal` : '0%'}
          </span>
        </Card>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-[#0D0F12] p-1.5 rounded-lg border border-gray-800 overflow-x-auto">
        {[
          { id: 'all', label: `All Items (${watchlist.length})` },
          { id: 'pc_hardware', label: 'PC Hardware' },
          { id: 'console', label: 'Consoles' },
          { id: 'game', label: 'Games' },
          { id: 'accessory', label: 'Accessories' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              filterCategory === cat.id ? 'bg-gray-800 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Watchlist Items */}
      {filteredWatchlist.length === 0 ? (
        <Card className="bg-[#0D0F12] border-gray-800 p-12 text-center">
          <Bookmark className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">Your Watchlist is empty</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Add PC hardware, consoles, or games to monitor price drops and get notified the moment they drop.
          </p>
          <Button
            onClick={() => setIsCommandOpen(true)}
            variant="outline"
            size="sm"
            className="mt-4 text-xs"
          >
            Search Products to Track
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredWatchlist.map((item) => {
            const isEditing = editingTargetId === item.id;
            const diff = item.product.currentPrice - item.targetPrice;
            const isReached = item.product.currentPrice <= item.targetPrice;

            return (
              <div
                key={item.id}
                className="group flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-800 bg-[#0D0F12] hover:border-gray-700 transition-all gap-4"
              >
                {/* Product details */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="h-16 w-16 shrink-0 rounded-lg border border-gray-800 bg-[#171A20] p-1.5 flex items-center justify-center overflow-hidden"
                  >
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain" />
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-gray-400 uppercase">{item.product.brand}</span>
                      <span className="text-gray-600">•</span>
                      <Badge variant={getStockBadgeVariant(item.product.stockStatus)} className="font-mono text-[9px] py-0 px-1 uppercase">
                        {item.product.stockStatus}
                      </Badge>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500 text-[11px]">{item.product.store}</span>
                    </div>

                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="text-sm font-semibold text-gray-100 truncate hover:text-emerald-400 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-sm font-bold font-mono text-gray-100">
                        Current: {formatCurrency(item.product.currentPrice, settings.currency)}
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        Added: {item.addedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Price & Trigger state */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8 bg-[#12151A] p-3 rounded-lg border border-gray-800/80">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Your Target Price</div>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Input
                          type="number"
                          value={tempTarget}
                          onChange={e => setTempTarget(Number(e.target.value))}
                          className="h-7 w-28 text-xs font-mono font-bold bg-gray-900"
                        />
                        <button
                          onClick={() => handleSaveEdit(item.productId)}
                          className="p-1 rounded bg-emerald-500 text-black hover:bg-emerald-600"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-base font-bold font-mono text-emerald-400">
                          {formatCurrency(item.targetPrice, settings.currency)}
                        </span>
                        <button
                          onClick={() => handleStartEdit(item.id, item.targetPrice)}
                          className="text-gray-500 hover:text-gray-300 p-0.5"
                          title="Edit Target Price"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Status</div>
                    <div className="mt-1">
                      {isReached ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                          ✓ TARGET REACHED
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-gray-400">
                          Needs {formatCurrency(diff, settings.currency)} drop
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 justify-end">
                  <button
                    onClick={() => setActiveAlertModalProduct(item.product)}
                    className="p-2 rounded-lg border border-gray-800 bg-[#12151A] text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    title="Alert Configuration"
                  >
                    <Bell className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => removeFromWatchlist(item.productId)}
                    className="p-2 rounded-lg border border-gray-800 bg-[#12151A] text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <Link to={`/product/${item.product.id}`}>
                    <Button size="sm" variant="secondary" className="h-8 text-xs">
                      Inspect
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
