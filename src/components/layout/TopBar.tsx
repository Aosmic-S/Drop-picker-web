import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  Search, 
  Bell, 
  Bookmark, 
  User, 
  TrendingDown, 
  Check, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext';
import { Currency } from '@/src/types';
import { formatCurrency } from '@/src/lib/utils';

export function TopBar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { 
    setIsCommandOpen, 
    watchlist, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    settings, 
    setCurrency, 
    lastUpdatedTime,
    triggerLiveDropSimulation 
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'INR', label: 'INR (₹)', symbol: '₹' },
    { code: 'USD', label: 'USD ($)', symbol: '$' },
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
    { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-800 bg-[#08090B]/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="flex items-center gap-3 rounded-lg border border-gray-800 bg-[#12151A] px-3.5 py-1.5 text-xs text-gray-400 hover:border-gray-700 hover:text-gray-200 transition-colors w-64 sm:w-80 md:w-96 text-left group"
        >
          <Search className="h-4 w-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
          <span className="truncate">Search products, games, consoles, brands...</span>
          <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-gray-700 bg-[#171A20] px-1.5 font-mono text-[10px] text-gray-400 sm:flex">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Simulator & Status */}
        <button
          onClick={triggerLiveDropSimulation}
          title="Click to simulate an instant live drop/restock event"
          className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-gray-300 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-colors lg:flex"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
          <span className="font-semibold text-emerald-400 tracking-wider text-[11px]">LIVE</span>
          <span className="text-[10px] text-gray-500">• Updated {lastUpdatedTime}</span>
        </button>

        {/* Currency Switcher */}
        <div className="relative" ref={currencyRef}>
          <button
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-800 bg-[#12151A] text-xs font-mono font-medium text-gray-300 hover:border-gray-700 transition-colors"
          >
            <span>{settings.currency}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
          </button>

          {isCurrencyOpen && (
            <div className="absolute right-0 mt-2 w-32 rounded-xl border border-gray-800 bg-[#0D0F12] py-1 shadow-2xl z-50">
              {currencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                    settings.currency === c.code ? 'bg-gray-800 text-emerald-400 font-semibold' : 'text-gray-300 hover:bg-[#171A20]'
                  }`}
                >
                  <span>{c.label}</span>
                  {settings.currency === c.code && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist Icon Button */}
        <Link
          to="/watchlist"
          className="relative p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800/60 transition-colors"
          title="Watchlist"
        >
          <Bookmark className="h-5 w-5" />
          {watchlist.length > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-700 text-[9px] font-mono font-bold text-gray-200">
              {watchlist.length}
            </span>
          )}
        </Link>

        {/* Notifications Center */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800/60 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-mono font-bold text-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-800 bg-[#0D0F12] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[480px]">
              <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 bg-[#12151A]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-gray-500 hover:text-rose-400 transition-colors p-1"
                    title="Clear all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.productId) {
                          navigate(`/product/${n.productId}`);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                        n.read ? 'hover:bg-[#12151A] opacity-75' : 'bg-[#12151A]/60 hover:bg-[#12151A]'
                      }`}
                    >
                      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${!n.read ? 'bg-emerald-500' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-gray-200 truncate">{n.title}</span>
                          <span className="text-[10px] text-gray-500 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-gray-800 p-2 bg-[#08090B] text-center">
                <Link
                  to="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs text-emerald-400 hover:underline block py-1"
                >
                  View All Notifications in Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User profile / Avatar */}
        <Link
          to="/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-gray-100 hover:border-gray-500 transition-colors"
          title="Account & Settings"
        >
          <User className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
