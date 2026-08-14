import React from 'react';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '@/src/context/AppContext';
import { formatCurrency } from '@/src/lib/utils';
import { Clock, ArrowRight, RefreshCcw, Tag } from 'lucide-react';

export function RestockFeed() {
  const { products, settings } = useApp();
  const restocks = products.filter(p => p.stockStatus === 'In Stock').slice(0, 4);

  return (
    <Card className="flex h-full flex-col bg-[#0D0F12] border-gray-800">
      <CardHeader className="border-b border-gray-800 pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 text-blue-400" />
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-200">Recent Restocks</CardTitle>
          </div>
          <Link to="/restocks" className="text-[11px] text-gray-400 hover:text-blue-400 flex items-center gap-0.5 transition-colors">
            More <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="divide-y divide-gray-800/50">
          {restocks.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id} 
              className="flex items-center justify-between p-3.5 hover:bg-[#12151A] transition-colors block group"
            >
              <div className="min-w-0 flex-1 pr-3">
                <h4 className="text-xs font-medium text-gray-200 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                  <Badge variant="info" className="uppercase font-mono text-[9px] py-0 px-1">IN STOCK</Badge>
                  <span className="font-semibold text-gray-300">{product.store}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">{product.updatedAt}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold text-gray-100">
                  {formatCurrency(product.currentPrice, settings.currency)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TodayDeals() {
  const { products, settings } = useApp();
  const deals = products
    .filter(p => p.originalPrice && p.currentPrice < p.originalPrice)
    .sort((a, b) => b.dealScore - a.dealScore)
    .slice(0, 4);

  return (
    <Card className="flex h-full flex-col bg-[#0D0F12] border-gray-800">
      <CardHeader className="border-b border-gray-800 pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-200">Top Curated Deals</CardTitle>
          </div>
          <Link to="/deals" className="text-[11px] text-gray-400 hover:text-emerald-400 flex items-center gap-0.5 transition-colors">
            More <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="divide-y divide-gray-800/50">
          {deals.map((product) => {
            const discount = product.originalPrice ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100) : 0;
            return (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id} 
                className="flex gap-3 p-3.5 hover:bg-[#12151A] transition-colors block group items-center"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#171A20] p-1 border border-gray-800 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-1 flex-col justify-center min-w-0">
                  <h4 className="text-xs font-medium text-gray-200 truncate group-hover:text-emerald-400 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs mt-0.5">
                    <Badge variant="success" className="font-mono text-[9px] py-0 px-1">-{discount}%</Badge>
                    <span className="font-bold text-emerald-400 font-mono text-xs">
                      {formatCurrency(product.currentPrice, settings.currency)}
                    </span>
                    <span className="text-gray-500 line-through font-mono text-[10px]">
                      {formatCurrency(product.originalPrice!, settings.currency)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
