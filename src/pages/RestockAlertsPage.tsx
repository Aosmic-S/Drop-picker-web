import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { BellRing, Trash2, Smartphone, Mail, Globe, Store, Plus } from 'lucide-react';
import { Link } from 'react-router';

export function RestockAlertsPage() {
  const { restockAlerts, deleteRestockAlert, settings, setIsCommandOpen } = useApp();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono mb-1">
            <BellRing className="h-4 w-4 text-blue-400" />
            <span>Out-Of-Stock Watchdog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Restock Alerts
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Instant stock notifications dispatched the second units are detected at retailer checkouts.
          </p>
        </div>

        <Button
          onClick={() => setIsCommandOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs h-9"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Subscribe New Item
        </Button>
      </div>

      {/* Restock Alerts List */}
      {restockAlerts.length === 0 ? (
        <Card className="bg-[#0D0F12] border-gray-800 p-12 text-center">
          <BellRing className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-300">No active restock monitors</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Subscribe to out-of-stock GPUs, Nintendo Switch 2, or PS5 consoles to get alerted immediately.
          </p>
          <Button
            onClick={() => setIsCommandOpen(true)}
            variant="outline"
            size="sm"
            className="mt-4 text-xs"
          >
            Find Hard-To-Find Items
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restockAlerts.map(alert => (
            <Card key={alert.id} className="bg-[#0D0F12] border-gray-800 p-5 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Badge variant="info" className="uppercase font-mono text-[10px]">
                    ● {alert.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                    <Store className="h-3.5 w-3.5" />
                    {alert.store}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <img src={alert.productImage} alt={alert.productName} className="h-14 w-14 rounded-lg bg-[#171A20] border border-gray-800 p-1 object-contain shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${alert.productId}`}>
                      <h4 className="text-sm font-semibold text-gray-100 truncate hover:text-blue-400 transition-colors">
                        {alert.productName}
                      </h4>
                    </Link>
                    <div className="text-sm font-bold font-mono text-gray-200 mt-1">
                      {formatCurrency(alert.currentPrice, settings.currency)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 bg-[#12151A] p-2 rounded-lg border border-gray-800/80">
                  <span>Channels:</span>
                  <div className="flex items-center gap-2">
                    {alert.channels.includes('in_app') && <span className="flex items-center gap-1"><Smartphone className="h-3 w-3 text-emerald-400" /> App</span>}
                    {alert.channels.includes('email') && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-blue-400" /> Email</span>}
                    {alert.channels.includes('browser') && <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-purple-400" /> Web</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800/60 mt-4">
                <span className="text-[11px] text-gray-500">Subscribed {alert.createdAt}</span>
                <button
                  onClick={() => deleteRestockAlert(alert.id)}
                  className="p-1.5 rounded-md border border-gray-800 bg-gray-800 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                  title="Remove Subscription"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
