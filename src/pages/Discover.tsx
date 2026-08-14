import React, { useState } from 'react';
import { useLocation, Link } from 'react-router';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency, formatPercentage, getDealScoreColor, getStockBadgeVariant } from '../lib/utils';
import { Search, SlidersHorizontal, ArrowUpDown, Bookmark, Bell, Check, Cpu, Gamepad2, MonitorPlay, Headphones, Filter } from 'lucide-react';
import { ProductCategory } from '../types';

export function Discover() {
  const location = useLocation();
  const { products, settings, addToWatchlist, isProductInWatchlist, setActiveAlertModalProduct } = useApp();

  // Route-based category matching
  let categoryFilter: ProductCategory | 'all' = 'all';
  let categoryTitle = 'Discover All Gaming Products';
  let CategoryIcon = Cpu;
  let categoryDesc = 'Browse through GPUs, CPUs, consoles, games, and esports accessories.';

  if (location.pathname === '/pc-hardware') {
    categoryFilter = 'pc_hardware';
    categoryTitle = 'PC Hardware Tracking Terminal';
    CategoryIcon = Cpu;
    categoryDesc = 'Graphics Cards, CPUs, Motherboards, RAM, NVMe SSDs, and Liquid Coolers.';
  } else if (location.pathname === '/consoles') {
    categoryFilter = 'console';
    categoryTitle = 'Gaming Consoles & Handhelds';
    CategoryIcon = Gamepad2;
    categoryDesc = 'PlayStation 5, Xbox Series X, Nintendo Switch 2, and Steam Deck OLED.';
  } else if (location.pathname === '/games') {
    categoryFilter = 'game';
    categoryTitle = 'Video Games, Editions & DLCs';
    CategoryIcon = MonitorPlay;
    categoryDesc = 'Track physical discs and digital keys across Steam, PSN, and Xbox.';
  } else if (location.pathname === '/accessories') {
    categoryFilter = 'accessory';
    categoryTitle = 'Gaming Gear & Accessories';
    CategoryIcon = Headphones;
    categoryDesc = 'Esports Keyboards, Mice, DualSense Controllers, and Headsets.';
  }

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [stockOnly, setStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'deal_score' | 'price_asc' | 'price_desc' | 'popular'>('deal_score');

  // Extract available subcategories for current category
  const categoryProducts = categoryFilter === 'all' 
    ? products 
    : products.filter(p => p.category === categoryFilter);

  const subCategories = ['all', ...Array.from(new Set(categoryProducts.map(p => p.subCategory).filter(Boolean)))];
  const brands = ['all', ...Array.from(new Set(categoryProducts.map(p => p.brand).filter(Boolean)))];

  // Filtering
  const filteredProducts = categoryProducts.filter(product => {
    if (selectedSubCategory !== 'all' && product.subCategory !== selectedSubCategory) return false;
    if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
    if (stockOnly && product.stockStatus !== 'In Stock') return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sorting
  filteredProducts.sort((a, b) => {
    if (sortBy === 'deal_score') return b.dealScore - a.dealScore;
    if (sortBy === 'price_asc') return a.currentPrice - b.currentPrice;
    if (sortBy === 'price_desc') return b.currentPrice - a.currentPrice;
    if (sortBy === 'popular') return (b.watchCount || 0) - (a.watchCount || 0);
    return 0;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <CategoryIcon className="h-4 w-4" />
            <span>Commerce Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            {categoryTitle}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {categoryDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0D0F12] border border-gray-800 rounded-lg p-2 px-3 text-xs text-gray-300 font-mono">
          <span className="text-emerald-400 font-bold">{filteredProducts.length}</span> Products Listed
        </div>
      </div>

      {/* Subcategory Pill Bar */}
      {subCategories.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl bg-[#0D0F12] border border-gray-800 no-scrollbar">
          {subCategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                selectedSubCategory === sub
                  ? 'bg-gray-800 text-emerald-400 font-semibold shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {sub === 'all' ? 'All Subcategories' : sub}
            </button>
          ))}
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-400">Brand:</span>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="h-8 rounded-md border border-gray-800 bg-[#12151A] px-2 text-xs text-gray-200 focus:outline-none"
              >
                {brands.map(b => (
                  <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>
                ))}
              </select>
            </div>

            {/* In-stock toggle */}
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer bg-[#12151A] border border-gray-800 px-2.5 py-1.5 rounded-md hover:bg-gray-800/50">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={e => setStockOnly(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-0"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sorting */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="h-8 rounded-md border border-gray-800 bg-[#12151A] px-2 text-xs text-gray-200 focus:outline-none"
              >
                <option value="deal_score">Highest Deal Score</option>
                <option value="popular">Most Tracked</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search in category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-xs bg-[#12151A]"
            />
          </div>
        </div>
      </Card>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="bg-[#0D0F12] border-gray-800 p-12 text-center">
          <Search className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">No matching products found</h3>
          <p className="text-xs text-gray-500 mt-1">Try resetting the subcategory, brand, or search filters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const inWatch = isProductInWatchlist(product.id);
            const hasDiscount = product.originalPrice && product.originalPrice > product.currentPrice;

            return (
              <Card key={product.id} className="bg-[#0D0F12] border-gray-800 hover:border-gray-700 flex flex-col justify-between p-4 transition-all group">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant={getStockBadgeVariant(product.stockStatus)} className="font-mono text-[9px] py-0 px-1 uppercase">
                      {product.stockStatus}
                    </Badge>
                    <span className="text-[10px] font-mono font-bold text-gray-400">{product.store}</span>
                  </div>

                  <Link to={`/product/${product.id}`} className="h-36 w-full rounded-lg bg-[#171A20] border border-gray-800/80 p-2 flex items-center justify-center mb-3 overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                  </Link>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
                      {product.brand} • {product.subCategory}
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-100 line-clamp-2 group-hover:text-emerald-400 transition-colors h-10">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {formatCurrency(product.currentPrice, settings.currency)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-500 line-through font-mono">
                        {formatCurrency(product.originalPrice!, settings.currency)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-3 border-t border-gray-800/60 mt-3">
                  <button
                    onClick={() => inWatch ? null : addToWatchlist(product.id)}
                    className={`p-1.5 rounded-md border text-xs transition-colors ${
                      inWatch ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700'
                    }`}
                    title={inWatch ? "In Watchlist" : "Watch"}
                  >
                    {inWatch ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={() => setActiveAlertModalProduct(product)}
                    className="p-1.5 rounded-md border border-gray-800 bg-gray-800/60 text-gray-300 hover:bg-gray-700 transition-colors"
                    title="Alert"
                  >
                    <Bell className="h-3.5 w-3.5" />
                  </button>

                  <Link to={`/product/${product.id}`} className="flex-1">
                    <Button size="sm" variant="secondary" className="w-full h-7 text-xs">
                      Inspect
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
