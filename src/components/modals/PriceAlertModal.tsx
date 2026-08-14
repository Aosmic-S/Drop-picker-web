import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Product } from '@/src/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatCurrency } from '@/src/lib/utils';
import { Bell, X, Check, ShieldCheck, Mail, Globe, Smartphone } from 'lucide-react';

interface PriceAlertModalProps {
  product: Product | null;
  onClose: () => void;
}

export function PriceAlertModal({ product, onClose }: PriceAlertModalProps) {
  const { createPriceAlert, createRestockAlert, settings } = useApp();

  if (!product) return null;

  const defaultTarget = Math.round(product.currentPrice * 0.9);
  const [targetPrice, setTargetPrice] = useState<number>(defaultTarget);
  const [condition, setCondition] = useState<'below_target' | 'percent_drop' | 'all_time_low' | 'any_drop'>('below_target');
  const [selectedStore, setSelectedStore] = useState<string>('Any Store');
  const [channels, setChannels] = useState<{ in_app: boolean; email: boolean; browser: boolean }>({
    in_app: true,
    email: true,
    browser: false
  });
  const [isRestockMode, setIsRestockMode] = useState<boolean>(product.stockStatus === 'Out of Stock');

  const discountFromCurrent = Math.round(((product.currentPrice - targetPrice) / product.currentPrice) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeChannels: ('in_app' | 'email' | 'browser')[] = [];
    if (channels.in_app) activeChannels.push('in_app');
    if (channels.email) activeChannels.push('email');
    if (channels.browser) activeChannels.push('browser');

    if (isRestockMode) {
      createRestockAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        currentPrice: product.currentPrice,
        store: selectedStore,
        platform: product.platform?.[0],
        channels: activeChannels
      });
    } else {
      createPriceAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        targetPrice,
        currentPrice: product.currentPrice,
        category: product.category,
        store: selectedStore,
        triggerCondition: condition,
        channels: activeChannels
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-xl border border-gray-800 bg-[#0D0F12] shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-[#12151A]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-100">Set Price & Stock Alert</h3>
              <p className="text-xs text-gray-400">Instant notification when target is triggered</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product mini preview */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-4 bg-[#08090B]">
          <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-contain bg-[#171A20] p-1 border border-gray-800 shrink-0" />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-gray-100 truncate">{product.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">Current: <span className="font-bold font-mono text-emerald-400">{formatCurrency(product.currentPrice, settings.currency)}</span></span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-400">All-time Low: <span className="font-mono text-gray-300">{formatCurrency(product.lowestPrice, settings.currency)}</span></span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-[#12151A] p-1 rounded-lg border border-gray-800">
            <button
              type="button"
              onClick={() => setIsRestockMode(false)}
              className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                !isRestockMode ? 'bg-gray-800 text-gray-100 shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Price Drop Alert
            </button>
            <button
              type="button"
              onClick={() => setIsRestockMode(true)}
              className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                isRestockMode ? 'bg-gray-800 text-gray-100 shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Restock Monitor
            </button>
          </div>

          {!isRestockMode ? (
            <>
              {/* Target Price Configuration */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-300">Target Trigger Price</label>
                  <span className="text-xs text-emerald-400 font-mono font-medium">
                    {discountFromCurrent > 0 ? `${discountFromCurrent}% below current` : 'At current price'}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 font-mono">₹</span>
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="pl-8 font-mono text-base font-bold bg-[#12151A]"
                    min={1}
                    max={product.currentPrice * 2}
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex gap-2 mt-2.5">
                  {[
                    { label: '-5%', val: Math.round(product.currentPrice * 0.95) },
                    { label: '-10%', val: Math.round(product.currentPrice * 0.90) },
                    { label: '-15%', val: Math.round(product.currentPrice * 0.85) },
                    { label: 'Historic Low', val: product.lowestPrice }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setTargetPrice(preset.val)}
                      className="px-2.5 py-1 text-[11px] rounded bg-gray-800/80 hover:bg-gray-700 text-gray-300 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Condition */}
              <div>
                <label className="text-xs font-medium text-gray-300 mb-2 block">Notification Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-gray-800 bg-[#12151A] px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-700"
                >
                  <option value="below_target">Drop Below My Target Price</option>
                  <option value="all_time_low">Any Match or Beat of All-Time Historic Low</option>
                  <option value="percent_drop">Any Drop of 10% or Greater</option>
                  <option value="any_drop">Any Price Decrease Detected</option>
                </select>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
              We monitor stock across all major retailers in real-time. The instant inventory is detected, an alert will be dispatched to your selected channels.
            </div>
          )}

          {/* Store Selection */}
          <div>
            <label className="text-xs font-medium text-gray-300 mb-2 block">Track Retailer</label>
            <select
              value={selectedStore}
              onChange={e => setSelectedStore(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-800 bg-[#12151A] px-3 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-700"
            >
              <option value="Any Store">Any Store (Recommended — Lowest available)</option>
              <option value="Amazon">Amazon</option>
              <option value="Flipkart">Flipkart</option>
              <option value="MDComputers">MDComputers</option>
              <option value="PrimeABGB">PrimeABGB</option>
              <option value="VedantComputers">VedantComputers</option>
              <option value="Steam">Steam (Digital)</option>
              <option value="PlayStation Store">PlayStation Store</option>
            </select>
          </div>

          {/* Channels */}
          <div>
            <label className="text-xs font-medium text-gray-300 mb-2 block">Alert Channels</label>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-800 bg-[#12151A] cursor-pointer hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={channels.in_app}
                  onChange={e => setChannels(c => ({ ...c, in_app: e.target.checked }))}
                  className="rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs text-gray-300 flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-gray-400" /> In-App</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-800 bg-[#12151A] cursor-pointer hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={e => setChannels(c => ({ ...c, email: e.target.checked }))}
                  className="rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs text-gray-300 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" /> Email</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-gray-800 bg-[#12151A] cursor-pointer hover:bg-gray-800/50">
                <input
                  type="checkbox"
                  checked={channels.browser}
                  onChange={e => setChannels(c => ({ ...c, browser: e.target.checked }))}
                  className="rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs text-gray-300 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-gray-400" /> Browser</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
              <Check className="mr-1.5 h-4 w-4" /> Save & Activate Alert
            </Button>
          </div>
        </form>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
