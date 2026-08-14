import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/src/context/AppContext';
import { 
  Search, 
  TrendingDown, 
  RefreshCcw, 
  Bookmark, 
  Bell, 
  Cpu, 
  Gamepad2, 
  MonitorPlay, 
  Headphones, 
  BarChart3, 
  Zap, 
  ExternalLink,
  Store,
  Tag
} from 'lucide-react';
import { formatCurrency, getDealScoreColor } from '@/src/lib/utils';

export function CommandPalette() {
  const { isCommandOpen, setIsCommandOpen, products, settings, triggerLiveDropSimulation } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandOpen]);

  if (!isCommandOpen) return null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.store.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const quickNavs = [
    { label: 'View Live Drops', path: '/drops', icon: TrendingDown, category: 'Navigation' },
    { label: 'View Recent Restocks', path: '/restocks', icon: RefreshCcw, category: 'Navigation' },
    { label: 'Today\'s Best Deals', path: '/deals', icon: Tag, category: 'Navigation' },
    { label: 'Open Watchlist', path: '/watchlist', icon: Bookmark, category: 'Navigation' },
    { label: 'Price Alerts Center', path: '/alerts/price', icon: Bell, category: 'Navigation' },
    { label: 'PC Hardware Tracking', path: '/pc-hardware', icon: Cpu, category: 'Categories' },
    { label: 'Console Intelligence', path: '/consoles', icon: Gamepad2, category: 'Categories' },
    { label: 'Video Games Tracker', path: '/games', icon: MonitorPlay, category: 'Categories' },
    { label: 'Gaming Accessories', path: '/accessories', icon: Headphones, category: 'Categories' },
    { label: 'Market Analytics & Volatility', path: '/analytics/market', icon: BarChart3, category: 'Analytics' },
  ].filter(nav => nav.label.toLowerCase().includes(query.toLowerCase()));

  const allResults = [
    ...filteredProducts.map(p => ({ type: 'product', data: p })),
    ...quickNavs.map(n => ({ type: 'nav', data: n })),
    { type: 'action', data: { label: '⚡ Simulate Live Flash Drop / Restock Event', action: () => triggerLiveDropSimulation() } }
  ];

  const handleSelect = (item: any) => {
    setIsCommandOpen(false);
    if (item.type === 'product') {
      navigate(`/product/${item.data.id}`);
    } else if (item.type === 'nav') {
      navigate(item.data.path);
    } else if (item.type === 'action') {
      item.data.action();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        handleSelect(allResults[selectedIndex]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-xl border border-gray-800 bg-[#0D0F12] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center border-b border-gray-800 px-4 py-3.5 bg-[#12151A]">
          <Search className="h-5 w-5 text-gray-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, games, consoles, brands, commands..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
          />
          <kbd className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-gray-700 bg-gray-800 text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Products Group */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Products & Hardware
              </div>
              <div className="space-y-1">
                {filteredProducts.map((p, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelect({ type: 'product', data: p })}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-gray-800 text-gray-100' : 'text-gray-300 hover:bg-[#171A20]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover bg-gray-900 border border-gray-800 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{p.name}</div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
                            <span className="text-gray-400 uppercase font-semibold">{p.brand}</span>
                            <span>•</span>
                            <span>{p.store}</span>
                            <span>•</span>
                            <span className="uppercase">{p.stockStatus}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-xs font-bold font-mono text-emerald-400">
                          {formatCurrency(p.currentPrice, settings.currency)}
                        </div>
                        <div className={`text-[10px] font-mono font-bold ${getDealScoreColor(p.dealScore)}`}>
                          Score {p.dealScore}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Navigations */}
          {quickNavs.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Quick Navigation
              </div>
              <div className="space-y-1">
                {quickNavs.map((nav, idx) => {
                  const globalIdx = filteredProducts.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <div
                      key={nav.label}
                      onClick={() => handleSelect({ type: 'nav', data: nav })}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-gray-800 text-gray-100' : 'text-gray-400 hover:bg-[#171A20] hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-medium">
                        <nav.icon className="h-4 w-4 text-gray-400" />
                        {nav.label}
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase">{nav.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Simulation */}
          <div>
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Live Engine Controls
            </div>
            <div
              onClick={() => handleSelect({ type: 'action', data: { action: () => triggerLiveDropSimulation() } })}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedIndex === allResults.length - 1 ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'text-emerald-400 hover:bg-[#171A20]'
              }`}
            >
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium">⚡ Trigger Real-time Flash Drop / Restock Simulation</span>
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-gray-800 px-4 py-2.5 bg-[#08090B] flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">↑</kbd> <kbd className="font-mono bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">↵</kbd> Select</span>
          </div>
          <span>Drop Picker Intelligence</span>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={() => setIsCommandOpen(false)} />
    </div>
  );
}
