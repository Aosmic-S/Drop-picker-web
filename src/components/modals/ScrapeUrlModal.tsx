import React, { useState } from 'react';
import { 
  X, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useApp } from '@/src/context/AppContext';
import { formatCurrency } from '@/src/lib/utils';
import { detectStoreFromUrl, ScrapedProductData } from '@/src/lib/brightDataService';

interface ScrapeUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScrapeUrlModal({ isOpen, onClose }: ScrapeUrlModalProps) {
  const { scrapeAndTrackUrl, settings, isSupabaseActive } = useApp();
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    product?: ScrapedProductData;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const detected = urlInput.trim() ? detectStoreFromUrl(urlInput.trim()) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await scrapeAndTrackUrl(urlInput.trim());
      setResult({
        success: res.success,
        product: res.product,
        message: res.message
      });
      if (res.success) {
        setUrlInput('');
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Scrape request failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl border border-gray-800 bg-[#0D0F12] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800/80 px-4 sm:px-6 py-4 bg-[#12151A]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-100">Live URL Price Scraper</h2>
              <p className="text-[11px] text-gray-400">Bright Data & Drop-Picker crawler pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Paste E-Commerce Product URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  type="url"
                  placeholder="https://www.amazon.in/dp/... or Flipkart, Steam URL"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  className="pl-9 text-xs bg-[#12151A] border-gray-800 focus:border-emerald-500 min-h-[42px]"
                  required
                />
              </div>
              {detected && urlInput.trim() && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400 font-mono px-1">
                  <span>Detected Store: <strong className="text-emerald-400">{detected.store}</strong></span>
                  <span className="text-gray-500">{detected.domain}</span>
                </div>
              )}
            </div>

            {/* Quick Store Compatibility Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400">
              <span className="text-gray-500">Supported Retailers:</span>
              {['Amazon', 'Flipkart', 'Steam', 'Croma', 'PS Store', 'Reliance Digital'].map(store => (
                <span key={store} className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700/60 font-mono text-gray-300">
                  {store}
                </span>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm h-11 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Unlocking & Scraping via Bright Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Scrape Live Price & Track Product</span>
                </>
              )}
            </Button>
          </form>

          {/* Scrape Result Output */}
          {result && (
            <div className={`p-4 rounded-xl border text-xs space-y-3 ${
              result.success 
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' 
                : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
            }`}>
              <div className="flex items-start gap-2.5">
                {result.success ? (
                  <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-gray-100">{result.message}</div>
                  {isSupabaseActive && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Database className="h-3 w-3" /> Synchronized with Supabase catalog table.
                    </div>
                  )}
                </div>
              </div>

              {result.product && (
                <div className="p-3 rounded-lg bg-[#08090B] border border-gray-800 text-gray-200 flex gap-3 items-center">
                  <img 
                    src={result.product.image} 
                    alt={result.product.name} 
                    className="h-14 w-14 rounded-md object-cover bg-gray-900 border border-gray-800 shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate text-gray-100">{result.product.name}</div>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Store: {result.product.store} • Brand: {result.product.brand}
                    </div>
                    <div className="text-xs font-bold font-mono text-emerald-400 mt-1">
                      Live Price: {formatCurrency(result.product.currentPrice, settings.currency)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-800 px-4 sm:px-6 py-3 bg-[#08090B] flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Anti-bot Web Unlocker Active</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
