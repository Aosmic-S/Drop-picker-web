import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { 
  User, 
  Shield, 
  Award, 
  Bookmark, 
  Bell, 
  Zap, 
  Clock, 
  ArrowRight, 
  Settings, 
  Database, 
  LogIn, 
  LogOut, 
  Check, 
  KeyRound, 
  Mail, 
  RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router';
import { isSupabaseConfigured } from '../lib/supabase';

export function ProfilePage() {
  const { 
    watchlist, 
    priceAlerts, 
    settings, 
    currentUser, 
    loginWithSupabase, 
    registerWithSupabase, 
    logoutSupabase, 
    syncWithSupabaseDatabase 
  } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const totalTrackedValue = watchlist.reduce((acc, item) => acc + item.product.currentPrice, 0);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthLoading(true);
    if (authMode === 'login') {
      await loginWithSupabase(email, password || undefined);
    } else {
      await registerWithSupabase(email, password || undefined);
    }
    setAuthLoading(false);
    setIsAuthModalOpen(false);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await syncWithSupabaseDatabase();
    setTimeout(() => setSyncing(false), 800);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Profile Header */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center">
              <div className="h-full w-full bg-[#0D0F12] rounded-full flex items-center justify-center text-emerald-400 font-bold text-xl">
                {currentUser?.email ? currentUser.email.substring(0, 2).toUpperCase() : 'DP'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-100">
                  {currentUser?.email || 'Gaming Commerce Operator'}
                </h2>
                <Badge variant={isSupabaseConfigured ? 'success' : 'default'} className="font-mono text-[10px] py-0 px-1.5 uppercase">
                  {isSupabaseConfigured ? 'SUPABASE CLOUD SYNC' : 'LOCAL PRO TIER'}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {currentUser?.isAnonymous ? 'Guest session • Local database' : `Authenticated account • ID: ${currentUser?.id.substring(0, 8)}...`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSupabaseConfigured && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSync}
                disabled={syncing}
                className="text-xs gap-1.5 border-gray-700"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Data'}
              </Button>
            )}

            {isSupabaseConfigured && currentUser?.isAnonymous ? (
              <Button
                size="sm"
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-xs gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign In / Up
              </Button>
            ) : isSupabaseConfigured ? (
              <Button
                variant="outline"
                size="sm"
                onClick={logoutSupabase}
                className="text-xs gap-1.5 border-gray-700 text-gray-400 hover:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" /> Log Out
              </Button>
            ) : null}

            <Link to="/settings">
              <Button variant="outline" size="sm" className="text-xs">
                <Settings className="h-3.5 w-3.5 mr-1.5" /> Settings
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Supabase Status Banner */}
      {isSupabaseConfigured ? (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-gray-300">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <strong>Supabase Database Active:</strong> Watchlist, alerts, and live price updates are synchronizing in real-time.
            </span>
          </div>
          <Link to="/settings" className="text-emerald-400 hover:underline font-mono text-[11px]">
            Manage Supabase Schema →
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-800 bg-[#0D0F12] text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-500" />
            <span>Running with local client persistence. Add your Supabase credentials in Settings to sync across devices.</span>
          </div>
          <Link to="/settings" className="text-emerald-400 hover:underline font-mono text-[11px]">
            Configure Supabase →
          </Link>
        </div>
      )}

      {/* Account Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Portfolio Value Tracked</span>
            <Bookmark className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-gray-100">
            {formatCurrency(totalTrackedValue, settings.currency)}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{watchlist.length} hardware items</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Active Price Triggers</span>
            <Bell className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">
            {priceAlerts.length} Active
          </div>
          <span className="text-[10px] text-gray-500 font-mono">24/7 API Monitoring</span>
        </Card>

        <Card className="bg-[#0D0F12] border-gray-800 p-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Estimated Savings Caught</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatCurrency(18500, settings.currency)}
          </div>
          <span className="text-[10px] text-emerald-500/80 font-mono">From 6 price drops</span>
        </Card>
      </div>

      {/* Tracked Categories Overview */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6">
        <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-4">
          Subscribed Category Priorities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'PC Graphics Cards', status: 'Priority Instant', color: 'text-emerald-400' },
            { name: 'Consoles (PS5 & Switch 2)', status: 'Restock Alert', color: 'text-blue-400' },
            { name: 'Fast NVMe SSDs', status: 'Lowest Price', color: 'text-purple-400' },
            { name: 'Esports Peripherals', status: 'Deal Score 80+', color: 'text-amber-400' },
          ].map(cat => (
            <div key={cat.name} className="p-3 rounded-lg bg-[#12151A] border border-gray-800">
              <div className="text-xs font-semibold text-gray-200">{cat.name}</div>
              <div className={`text-[10px] font-mono mt-1 ${cat.color}`}>{cat.status}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Supabase Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0D0F12] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-gray-100 uppercase font-mono">
                  {authMode === 'login' ? 'Supabase Sign In' : 'Create Supabase Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-gray-800 bg-[#08090B] pl-9 pr-3 py-2 text-xs text-gray-100 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-800 bg-[#08090B] px-3 py-2 text-xs text-gray-100 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs py-2.5"
                >
                  {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Supabase' : 'Create Account'}
                </Button>

                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs text-gray-400 hover:text-emerald-400 transition-colors text-center py-1"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
