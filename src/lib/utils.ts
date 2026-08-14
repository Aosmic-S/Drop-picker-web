import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currency } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Exchange rates relative to INR
const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; locale: string }> = {
  INR: { rate: 1, symbol: '₹', locale: 'en-IN' },
  USD: { rate: 0.012, symbol: '$', locale: 'en-US' },
  EUR: { rate: 0.011, symbol: '€', locale: 'de-DE' },
  GBP: { rate: 0.0095, symbol: '£', locale: 'en-GB' },
};

export function formatCurrency(value: number, currency: Currency = 'INR'): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
  const converted = value * config.rate;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
    minimumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(converted);
}

export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function getDealScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-emerald-500";
  if (score >= 60) return "text-blue-400";
  if (score >= 40) return "text-amber-400";
  return "text-rose-500";
}

export function getDealScoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Weak";
}

export function getDealScoreBg(score: number): string {
  if (score >= 90) return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  if (score >= 75) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
  if (score >= 60) return "bg-blue-500/10 border-blue-500/20 text-blue-400";
  if (score >= 40) return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  return "bg-rose-500/10 border-rose-500/20 text-rose-500";
}

export function getStockColor(stock: string): string {
  switch (stock?.toLowerCase()) {
    case "in stock":
      return "text-emerald-400";
    case "limited":
      return "text-amber-400";
    case "out of stock":
      return "text-rose-400";
    case "pre-order":
      return "text-blue-400";
    default:
      return "text-gray-400";
  }
}

export function getStockBadgeVariant(stock: string): 'success' | 'warning' | 'destructive' | 'info' | 'secondary' {
  switch (stock?.toLowerCase()) {
    case "in stock":
      return "success";
    case "limited":
      return "warning";
    case "out of stock":
      return "destructive";
    case "pre-order":
      return "info";
    default:
      return "secondary";
  }
}

export function timeAgo(timestamp: string | number): string {
  if (typeof timestamp === 'string' && timestamp.includes('ago')) {
    return timestamp;
  }
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
