import React from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useApp } from '@/src/context/AppContext';
import { formatCurrency, formatPercentage, getDealScoreColor } from '@/src/lib/utils';
import { Clock, TrendingDown, ArrowRight, Bell, Bookmark, Check, ShieldAlert, Zap } from 'lucide-react';

interface LiveDropFeedProps {
  filterStore?: string;
}

export function LiveDropFeed({ filterStore = 'all' }: LiveDropFeedProps) {
  const { liveDrops, settings, setActiveAlertModalProduct, addToWatchlist, isProductInWatchlist } = useApp();

  const filteredDrops = filterStore === 'all'
    ? liveDrops
    : liveDrops.filter(d => d.store.toLowerCase().includes(filterStore.toLowerCase()));

  const getStoreBadgeColor = (store: string) => {
    switch (store.toLowerCase()) {
      case 'best buy':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'newegg':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'steam':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <Card className="flex h-full flex-col bg-[#0B0D11] border-gray-800/80 shadow-sm">
      <CardHeader className="border-b border-gray-800/80 pb-3.5 pt-4 px-4 sm:px-6 bg-[#0E1015]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingDown className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                <span>Real-Time Drop Stream</span>
                {filterStore !== 'all' && (
                  <span className="text-xs font-mono font-normal text-emerald-400 uppercase">
                    [{filterStore}]
                  </span>
                )}
              </CardTitle>
              <p className="text-[11px] text-gray-400">Continuous price verification across active inventory</p>
            </div>
          </div>
          <Link to="/drops" className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1 transition-colors font-medium">
            Full Feed ({liveDrops.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {filteredDrops.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No price drops currently recorded for {filterStore}.
          </div>
        ) : (
          <div className="divide-y divide-gray-800/60">
            {filteredDrops.slice(0, 8).map((drop) => {
              const inWatch = isProductInWatchlist(drop.product.id);
              const storeColor = getStoreBadgeColor(drop.store);

              return (
                <div 
                  key={drop.id} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-[#11141A] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <Link 
                      to={`/product/${drop.product.id}`} 
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-800 bg-[#161920] p-1.5 flex items-center justify-center group-hover:border-gray-700 transition-colors"
                    >
                      <img 
                        src={drop.product.image} 
                        alt={drop.product.name} 
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform" 
                      />
                    </Link>
                    
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 text-[11px]">
                        <span className={`px-2 py-0.5 rounded-md border font-mono font-bold uppercase tracking-wider text-[10px] ${storeColor}`}>
                          {drop.store}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400 font-medium capitalize">
                          {drop.product.category.replace('_', ' ')}
                        </span>
                        {drop.product.subCategory && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500">{drop.product.subCategory}</span>
                          </>
                        )}
                      </div>

                      <Link to={`/product/${drop.product.id}`}>
                        <h4 className="text-sm font-semibold text-gray-200 truncate group-hover:text-emerald-400 transition-colors">
                          {drop.product.name}
                        </h4>
                      </Link>

                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs">
                        <span className="font-bold text-emerald-400 font-mono text-sm tracking-tight">
                          {formatCurrency(drop.newPrice, settings.currency)}
                        </span>
                        {drop.previousPrice > drop.newPrice && (
                          <span className="text-gray-500 line-through font-mono text-xs">
                            {formatCurrency(drop.previousPrice, settings.currency)}
                          </span>
                        )}
                        {drop.percentageChange !== 0 && (
                          <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                            drop.percentageChange < 0 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {formatPercentage(drop.percentageChange)}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-gray-500 ml-1 text-[10px] font-mono">
                          <Clock className="h-3 w-3" />
                          <span>{drop.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side controls */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 border-t sm:border-t-0 border-gray-800/60 pt-2.5 sm:pt-0">
                    <div className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-gray-900 border border-gray-800 ${getDealScoreColor(drop.product.dealScore)}`}>
                      Score {drop.product.dealScore}/100
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => inWatch ? null : addToWatchlist(drop.product.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center ${
                          inWatch 
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                            : 'border-gray-800 bg-[#14171E] text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                        title={inWatch ? "In Watchlist" : "Add to Watchlist"}
                      >
                        {inWatch ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        onClick={() => setActiveAlertModalProduct(drop.product)}
                        className="p-1.5 rounded-lg border border-gray-800 bg-[#14171E] text-gray-300 hover:bg-gray-800 hover:text-white transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Set Price Drop Alert"
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </button>

                      <Link to={`/product/${drop.product.id}`}>
                        <Button size="sm" variant="secondary" className="h-8 text-xs px-3 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700">
                          Inspect
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
