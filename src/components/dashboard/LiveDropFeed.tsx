import React from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useApp } from '@/src/context/AppContext';
import { formatCurrency, formatPercentage, getDealScoreColor } from '@/src/lib/utils';
import { Clock, TrendingDown, ArrowRight, Bell, Bookmark, Check } from 'lucide-react';

export function LiveDropFeed() {
  const { liveDrops, settings, setActiveAlertModalProduct, addToWatchlist, isProductInWatchlist } = useApp();

  return (
    <Card className="flex h-full flex-col bg-[#0D0F12] border-gray-800">
      <CardHeader className="border-b border-gray-800 pb-3 pt-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-sm font-semibold text-gray-100">Live Drops Feed</CardTitle>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
              Realtime Stream
            </span>
          </div>
          <Link to="/drops" className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1 transition-colors">
            View All ({liveDrops.length}) <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="divide-y divide-gray-800/60">
          {liveDrops.slice(0, 7).map((drop) => {
            const inWatch = isProductInWatchlist(drop.product.id);
            return (
              <div 
                key={drop.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-[#12151A] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <Link to={`/product/${drop.product.id}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-800 bg-[#171A20] p-1 flex items-center justify-center">
                    <img 
                      src={drop.product.image} 
                      alt={drop.product.name} 
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform" 
                    />
                  </Link>
                  
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 text-[11px]">
                      <span className="font-bold text-gray-300 uppercase tracking-wider">{drop.store}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 capitalize">{drop.product.category.replace('_', ' ')}</span>
                      {drop.product.platform?.[0] && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400">{drop.product.platform[0]}</span>
                        </>
                      )}
                    </div>

                    <Link to={`/product/${drop.product.id}`}>
                      <h4 className="text-sm font-medium text-gray-100 truncate group-hover:text-emerald-400 transition-colors">
                        {drop.product.name}
                      </h4>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                      {drop.type === 'restock' ? (
                        <Badge variant="info" className="uppercase font-mono text-[10px] py-0 px-1.5">RESTOCKED</Badge>
                      ) : (
                        <>
                          <span className="font-bold text-emerald-400 font-mono text-sm">
                            {formatCurrency(drop.newPrice, settings.currency)}
                          </span>
                          {drop.previousPrice > drop.newPrice && (
                            <span className="text-gray-500 line-through font-mono text-xs">
                              {formatCurrency(drop.previousPrice, settings.currency)}
                            </span>
                          )}
                          {drop.percentageChange !== 0 && (
                            <Badge variant={drop.percentageChange < 0 ? "success" : "destructive"} className="font-mono text-[10px] py-0 px-1">
                              {formatPercentage(drop.percentageChange)}
                            </Badge>
                          )}
                        </>
                      )}
                      <div className="flex items-center gap-1 text-gray-500 ml-1 text-[10px]">
                        <Clock className="h-3 w-3" />
                        <span>{drop.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-gray-800/60 pt-2 sm:pt-0">
                  <div className={`text-[10px] font-bold font-mono uppercase tracking-wider ${getDealScoreColor(drop.product.dealScore)}`}>
                    Deal Score {drop.product.dealScore}/100
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => inWatch ? null : addToWatchlist(drop.product.id)}
                      className={`p-1.5 rounded-md border text-xs transition-colors ${
                        inWatch 
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                          : 'border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      title={inWatch ? "In Watchlist" : "Add to Watchlist"}
                    >
                      {inWatch ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      onClick={() => setActiveAlertModalProduct(drop.product)}
                      className="p-1.5 rounded-md border border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      title="Set Alert"
                    >
                      <Bell className="h-3.5 w-3.5" />
                    </button>

                    <Link to={`/product/${drop.product.id}`}>
                      <Button size="sm" variant="secondary" className="h-7 text-xs px-2.5">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
