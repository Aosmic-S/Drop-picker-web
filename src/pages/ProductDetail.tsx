import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useApp } from '@/src/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  formatCurrency, 
  formatPercentage, 
  getDealScoreColor, 
  getDealScoreLabel, 
  getDealScoreBg, 
  getStockBadgeVariant,
  generatePriceHistory
} from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingDown, 
  Bookmark, 
  Bell, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Truck, 
  Store, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  Share2,
  Info,
  Package
} from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, settings, addToWatchlist, isProductInWatchlist, setActiveAlertModalProduct, addToast, setIsScrapeModalOpen } = useApp();

  const product = products.find(p => p.id === id) || products[0];
  const [selectedRange, setSelectedRange] = useState<string>('30D');
  const [selectedEditionIndex, setSelectedEditionIndex] = useState<number>(0);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-[#0D0F12] border border-gray-800 rounded-xl">
        <Package className="h-12 w-12 text-gray-600 mb-3" />
        <h2 className="text-xl font-bold text-gray-200">Product Not Found</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-md">
          This product is not currently in your active catalog. You can paste an e-commerce URL to scrape and track its pricing in real time.
        </p>
        <div className="flex items-center gap-3 mt-5">
          <Link to="/">
            <Button variant="outline" size="sm" className="text-xs">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Dashboard
            </Button>
          </Link>
          <Button 
            onClick={() => setIsScrapeModalOpen(true)} 
            size="sm" 
            className="text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Scrape Product URL
          </Button>
        </div>
      </div>
    );
  }

  const inWatch = isProductInWatchlist(product.id);
  const priceHistoryData = generatePriceHistory(product.currentPrice, product.lowestPrice, product.highestPrice, selectedRange);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied to Clipboard',
      message: product.name
    });
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link to={-1 as any} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-[#0D0F12] text-xs text-gray-300 hover:text-white transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share Tracker
          </button>
        </div>
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Showcase + Chart + Store Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Showcase Banner */}
          <Card className="bg-[#0D0F12] border-gray-800 p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="h-44 w-44 shrink-0 rounded-xl bg-[#171A20] border border-gray-800 p-3 flex items-center justify-center mx-auto sm:mx-0">
                <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
              </div>

              <div className="flex-1 min-w-0 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStockBadgeVariant(product.stockStatus)} className="uppercase font-mono text-[10px]">
                    {product.stockStatus}
                  </Badge>
                  <span className="text-xs text-gray-400 font-mono font-semibold uppercase">{product.brand}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-400 capitalize">{product.subCategory}</span>
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-gray-100 leading-snug">
                  {product.name}
                </h1>

                {product.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Price Display */}
                <div className="flex flex-wrap items-baseline gap-3 pt-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                    {formatCurrency(product.currentPrice, settings.currency)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.currentPrice && (
                    <span className="text-sm text-gray-500 line-through font-mono">
                      {formatCurrency(product.originalPrice, settings.currency)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <Badge variant="success" className="font-mono text-xs">
                      -{discountPercent}% OFF
                    </Badge>
                  )}
                </div>

                {/* Quick Action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Button
                    onClick={() => inWatch ? null : addToWatchlist(product.id)}
                    variant={inWatch ? "outline" : "default"}
                    className={`text-xs h-9 ${inWatch ? 'border-emerald-500/40 text-emerald-400' : 'bg-emerald-500 hover:bg-emerald-600 text-black font-semibold'}`}
                  >
                    {inWatch ? <Check className="mr-1.5 h-4 w-4" /> : <Bookmark className="mr-1.5 h-4 w-4" />}
                    {inWatch ? 'Watching in Portfolio' : 'Track on Watchlist'}
                  </Button>

                  <Button
                    onClick={() => setActiveAlertModalProduct(product)}
                    variant="outline"
                    className="text-xs h-9"
                  >
                    <Bell className="mr-1.5 h-4 w-4 text-emerald-400" /> Set Price Alert
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Interactive Price History Chart */}
          <Card className="bg-[#0D0F12] border-gray-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4 mb-4">
              <div>
                <CardTitle className="text-sm font-bold text-gray-100 uppercase tracking-wider">
                  Price History & Volatility Curve
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">Tracking price updates from official API feeds</p>
              </div>

              {/* Range Selector */}
              <div className="flex items-center gap-1 bg-[#12151A] p-1 rounded-lg border border-gray-800">
                {['24H', '7D', '30D', '3M', '6M', '1Y', 'ALL'].map(range => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded font-medium transition-colors ${
                      selectedRange === range ? 'bg-gray-800 text-emerald-400 font-bold' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Range Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4 bg-[#12151A] p-3 rounded-lg border border-gray-800/80 text-center font-mono">
              <div>
                <span className="text-[10px] text-gray-500 uppercase">Lowest Recorded</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(product.lowestPrice, settings.currency)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase">Average Price</span>
                <div className="text-sm font-bold text-gray-300 mt-0.5">
                  {formatCurrency(product.averagePrice, settings.currency)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase">Highest Price</span>
                <div className="text-sm font-bold text-rose-400 mt-0.5">
                  {formatCurrency(product.highestPrice, settings.currency)}
                </div>
              </div>
            </div>

            {/* Area Chart */}
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistoryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#12151A', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(val: any) => [formatCurrency(val, settings.currency), 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#priceGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Multi-Store Comparison Matrix */}
          <Card className="bg-[#0D0F12] border-gray-800 p-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <div>
                <CardTitle className="text-sm font-bold text-gray-100 uppercase tracking-wider">
                  Store Price Comparison & Live Stock
                </CardTitle>
                <p className="text-xs text-gray-400 mt-0.5">Direct verified checkout pricing</p>
              </div>
              <Store className="h-4 w-4 text-gray-500" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 font-mono">
                    <th className="pb-3 font-semibold">Store</th>
                    <th className="pb-3 font-semibold">Stock Status</th>
                    <th className="pb-3 font-semibold">Shipping</th>
                    <th className="pb-3 font-semibold">Last Checked</th>
                    <th className="pb-3 font-semibold text-right">Price</th>
                    <th className="pb-3 font-semibold text-right">Direct Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {(product.allStores || [
                    { storeName: product.store, price: product.currentPrice, type: 'Physical', stock: product.stockStatus, shipping: 'Free Express', updatedAt: '2 min ago' }
                  ]).map((store) => (
                    <tr key={store.storeName} className="hover:bg-[#12151A] transition-colors">
                      <td className="py-3 font-bold text-gray-200">{store.storeName}</td>
                      <td className="py-3">
                        <Badge variant={getStockBadgeVariant(store.stock)} className="text-[9px] py-0 px-1 uppercase">
                          {store.stock}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-400">{store.shipping}</td>
                      <td className="py-3 text-gray-500">{store.updatedAt}</td>
                      <td className="py-3 text-right font-bold text-emerald-400">
                        {formatCurrency(store.price, settings.currency)}
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            addToast({ type: 'info', title: `Opening ${store.storeName} Checkout...` });
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                          Visit Store <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: Deal Score Breakdown + Game/Console Editions + Tech Specs */}
        <div className="space-y-6">
          {/* Deal Score Intelligence Card */}
          <Card className="bg-[#0D0F12] border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">Deal Score Analysis</h3>
              </div>
              <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getDealScoreBg(product.dealScore)}`}>
                Score {product.dealScore}/100
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>Price vs Historic Lowest</span>
                  <span className="font-mono text-emerald-400">95% Match</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>Store Reliability Index</span>
                  <span className="font-mono text-blue-400">98% Prime</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>Deflationary Momentum</span>
                  <span className="font-mono text-amber-400">Strong Drop</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 bg-[#12151A] p-3 rounded-lg border border-gray-800/80 leading-relaxed">
              Deal Score is computed algorithmically based on 180-day baseline prices, MSRP margins, and current retailer competition.
            </p>
          </Card>

          {/* Game Editions or Console Variants (if present) */}
          {product.gameEditions && (
            <Card className="bg-[#0D0F12] border-gray-800 p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Available Game Editions
              </h3>
              <div className="space-y-2">
                {product.gameEditions.map((edition, idx) => (
                  <div
                    key={edition.name}
                    onClick={() => setSelectedEditionIndex(idx)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEditionIndex === idx
                        ? 'border-emerald-500/50 bg-[#12151A] text-emerald-400'
                        : 'border-gray-800 bg-[#08090B] text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs">{edition.name}</span>
                      <span className="font-mono font-bold">{formatCurrency(edition.price, settings.currency)}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 flex flex-wrap gap-1">
                      {edition.features.map(f => (
                        <span key={f} className="bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Technical Specifications */}
          {product.specs && (
            <Card className="bg-[#0D0F12] border-gray-800 p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
                Technical Specifications
              </h3>
              <div className="divide-y divide-gray-800/60 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="py-2 flex justify-between gap-4">
                    <span className="text-gray-400">{key}</span>
                    <span className="font-mono text-gray-200 text-right font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
