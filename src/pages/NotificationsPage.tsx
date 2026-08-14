import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { Bell, CheckCheck, Trash2, ArrowRight, TrendingDown, RefreshCcw, Sparkles, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications, settings } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'price_drop' | 'restock'>('all');
  const navigate = useNavigate();

  const filtered = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'price_drop' && n.type !== 'price_drop' && n.type !== 'target_reached') return false;
    if (filter === 'restock' && n.type !== 'restock') return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <Bell className="h-4 w-4 text-emerald-400" />
            <span>Activity & Alert Inbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Notifications Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Complete audit trail of triggered price drops, target hits, and stock alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={markAllNotificationsAsRead}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" /> Mark All Read
          </Button>
          <Button
            onClick={clearNotifications}
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear All
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 bg-[#0D0F12] p-1.5 rounded-lg border border-gray-800">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${notifications.filter(n => !n.read).length})` },
          { id: 'price_drop', label: 'Price Drops' },
          { id: 'restock', label: 'Restocks' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filter === t.id ? 'bg-gray-800 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card className="bg-[#0D0F12] border-gray-800 p-12 text-center">
          <Bell className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">No notifications in this filter</h3>
          <p className="text-xs text-gray-500 mt-1">You're completely caught up with all live updates.</p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(n => {
            let Icon = TrendingDown;
            let iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            if (n.type === 'restock') {
              Icon = RefreshCcw;
              iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            } else if (n.type === 'deal_alert') {
              Icon = Sparkles;
              iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            }

            return (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.productId) navigate(`/product/${n.productId}`);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  n.read 
                    ? 'border-gray-800/80 bg-[#0D0F12] opacity-80 hover:opacity-100 hover:border-gray-700' 
                    : 'border-emerald-500/30 bg-[#12151A] shadow-[0_2px_12px_rgba(16,185,129,0.05)] hover:border-emerald-500/50'
                }`}
              >
                <div className={`p-2 rounded-lg border ${iconColor} shrink-0 mt-0.5`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                      {n.title}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-mono shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{n.message}</p>
                </div>

                {n.productId && (
                  <div className="shrink-0 text-gray-400 hover:text-emerald-400 self-center">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
