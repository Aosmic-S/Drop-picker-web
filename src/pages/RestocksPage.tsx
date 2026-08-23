import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency, getStockBadgeVariant } from '../lib/utils';
import { RefreshCcw, BellRing, Search, CheckCircle2, AlertTriangle, XCircle, Store, Zap } from 'lucide-react';
import { Link } from 'react-router';

export function RestocksPage() {
  const { products, settings, setActiveAlertModalProduct } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = products.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStock === 'in_stock' && p.stockStatus !== 'In Stock') return false;
    if (filterStock === 'limited' && p.stockStatus !== 'Limited') return false;
    if (filterStock === 'out_of_stock' && p.stockStatus !== 'Out of Stock') return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const uniqueStores = new Set<string>();
  products.forEach(p => {
    if (p.store) uniqueStores.add(p.store);
    p.allStores?.forEach(s => uniqueStores.add(s.storeName));
  });
  const storeCount = uniqueStores.size || 5;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Retail Inventory Radar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Real-Time Restocks & Stock Tracker
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Tracking inventory availability for hard-to-find GPUs, consoles, handhelds, and hardware.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0D0F12] border border-gray-800 rounded-lg p-1.5 px-3 text-xs text-gray-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>{storeCount} Stores Polled</span>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#12151A] p-1 rounded-lg border border-gray-800">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'pc_hardware', label: 'PC Hardware' },
              { id: 'console', label: 'Consoles' },
              { id: 'accessory', label: 'Accessories' },
              { id: 'game', label: 'Games' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filterCategory === cat.id ? 'bg-gray-800 text-blue-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Stock status filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Stock:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'in_stock', label: 'In Stock' },
              { id: 'limited', label: 'Limited' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setFilterStock(s.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  filterStock === s.id
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-[#12151A] border border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Filter by product..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#12151A]"
            />
          </div>
        </div>
      </Card>

      {/* Grid of Stock Items */}
      {filtered.length === 0 ? (
        <Card className="bg-[#0D0F12] border-gray-800 p-12 text-center">
          <RefreshCcw className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">No stock records found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            No items currently match your stock and category filter. Try clearing filters or scraping additional store links.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => {
            const inStock = product.stockStatus === 'In Stock';
            const isLimited = product.stockStatus === 'Limited';

            return (
              <Card key={product.id} className="bg-[#0D0F12] border-gray-800 hover:border-gray-700 flex flex-col justify-between p-5 transition-all group">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant={getStockBadgeVariant(product.stockStatus)} className="uppercase font-mono text-[10px]">
                      {product.stockStatus}
                    </Badge>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                      <Store className="h-3.5 w-3.5" />
                      {product.store}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-[#171A20] border border-gray-800 p-1 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{product.brand}</span>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="text-base font-bold font-mono text-gray-100 mt-1">
                        {formatCurrency(product.currentPrice, settings.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Retailer Availability Pill Row */}
                  {product.allStores && product.allStores.length > 0 && (
                    <div className="space-y-1.5 my-3 pt-3 border-t border-gray-800/60">
                      <div className="text-[11px] font-semibold text-gray-400">Retailer Breakdown:</div>
                      <div className="space-y-1">
                        {product.allStores.slice(0, 3).map(store => (
                          <div key={store.storeName} className="flex items-center justify-between text-xs p-1.5 rounded bg-[#12151A]">
                            <span className="text-gray-300">{store.storeName}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-gray-200">{formatCurrency(store.price, settings.currency)}</span>
                              <span className={`text-[10px] font-mono uppercase ${store.stock === 'In Stock' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {store.stock}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-800/60 mt-2">
                  <Button
                    onClick={() => setActiveAlertModalProduct(product)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <BellRing className="mr-1.5 h-3.5 w-3.5 text-blue-400" /> Restock Alert
                  </Button>
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button size="sm" className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-gray-200">
                      View Stores
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
