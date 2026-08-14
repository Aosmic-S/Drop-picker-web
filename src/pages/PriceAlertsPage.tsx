import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { Bell, BellRing, Plus, Trash2, Pause, Play, CheckCircle2, AlertCircle, Smartphone, Mail, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function PriceAlertsPage() {
  const { priceAlerts, deletePriceAlert, togglePriceAlertStatus, settings, setIsCommandOpen } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = priceAlerts.filter(a => {
    if (filterStatus === 'active' && a.status !== 'active') return false;
    if (filterStatus === 'triggered' && a.status !== 'triggered') return false;
    if (filterStatus === 'paused' && a.status !== 'paused') return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <BellRing className="h-4 w-4 text-emerald-400" />
            <span>Automated Price Triggers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Price Alerts Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your custom price thresholds, discount triggers, and automated notification channels.
          </p>
        </div>

        <Button
          onClick={() => setIsCommandOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs h-9"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Create New Price Alert
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 bg-[#0D0F12] p-1.5 rounded-lg border border-gray-800">
        {[
          { id: 'all', label: `All Alerts (${priceAlerts.length})` },
          { id: 'active', label: 'Active Triggers' },
          { id: 'triggered', label: 'Triggered Drops' },
          { id: 'paused', label: 'Paused' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterStatus === tab.id ? 'bg-gray-800 text-emerald-400 font-semibold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <Card className="bg-[#0D0F12] border-gray-800 p-12 text-center">
          <Bell className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">No price alerts found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Set target price thresholds on any product to receive instant alerts when a price drop occurs.
          </p>
          <Button
            onClick={() => setIsCommandOpen(true)}
            variant="outline"
            size="sm"
            className="mt-4 text-xs"
          >
            Browse Products & Set Alerts
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(alert => {
            const isTriggered = alert.status === 'triggered';
            const isPaused = alert.status === 'paused';

            return (
              <Card key={alert.id} className="bg-[#0D0F12] border-gray-800 p-5 flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge
                      variant={isTriggered ? 'success' : (isPaused ? 'secondary' : 'info')}
                      className="uppercase font-mono text-[10px]"
                    >
                      {alert.status}
                    </Badge>
                    <span className="text-[11px] text-gray-500 font-mono">Store: {alert.store}</span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <img src={alert.productImage} alt={alert.productName} className="h-14 w-14 rounded-lg bg-[#171A20] border border-gray-800 p-1 object-contain shrink-0" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${alert.productId}`}>
                        <h4 className="text-sm font-semibold text-gray-100 truncate hover:text-emerald-400 transition-colors">
                          {alert.productName}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="text-gray-400">Current: <span className="font-mono font-bold text-gray-200">{formatCurrency(alert.currentPrice, settings.currency)}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Target configuration box */}
                  <div className="bg-[#12151A] rounded-lg p-3 border border-gray-800/80 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Target Trigger:</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {formatCurrency(alert.targetPrice, settings.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-500">Condition:</span>
                      <span className="text-gray-300 capitalize">{alert.triggerCondition.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Active Channels */}
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400">
                    <span>Channels:</span>
                    <div className="flex items-center gap-2">
                      {alert.channels.includes('in_app') && <span className="flex items-center gap-1"><Smartphone className="h-3 w-3 text-emerald-400" /> App</span>}
                      {alert.channels.includes('email') && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-blue-400" /> Email</span>}
                      {alert.channels.includes('browser') && <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-purple-400" /> Web</span>}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800/60 mt-4">
                  <div className="text-[11px] text-gray-500">
                    Created {alert.createdAt}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePriceAlertStatus(alert.id)}
                      className="p-1.5 rounded-md border border-gray-800 bg-gray-800 text-gray-300 hover:text-white"
                      title={isPaused ? "Resume Alert" : "Pause Alert"}
                    >
                      {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => deletePriceAlert(alert.id)}
                      className="p-1.5 rounded-md border border-gray-800 bg-gray-800 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete Alert"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
