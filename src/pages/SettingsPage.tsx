import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Currency } from '../types';
import { Settings, Globe, Bell, Volume2, ShieldCheck, Check, DollarSign } from 'lucide-react';

export function SettingsPage() {
  const { settings, setCurrency, updateSettings } = useApp();

  const currencies: { code: Currency; label: string; desc: string }[] = [
    { code: 'INR', label: 'Indian Rupee (₹ INR)', desc: 'Optimized for Indian retailers (Amazon.in, MDComputers, Vedant, PrimeABGB)' },
    { code: 'USD', label: 'US Dollar ($ USD)', desc: 'North America / Global pricing reference' },
    { code: 'EUR', label: 'Euro (€ EUR)', desc: 'European retail pricing reference' },
    { code: 'GBP', label: 'British Pound (£ GBP)', desc: 'United Kingdom retail pricing' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
          <Settings className="h-4 w-4 text-emerald-400" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
          Preferences & Alert Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure regional currency, notification channels, and data polling intervals.
        </p>
      </div>

      {/* Currency Selection */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-gray-100">Primary Display Currency</h3>
            <p className="text-xs text-gray-400">All prices and price history curves will render in this currency.</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {currencies.map(c => (
            <div
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                settings.currency === c.code 
                  ? 'border-emerald-500/50 bg-[#12151A] text-emerald-400 shadow' 
                  : 'border-gray-800 bg-[#08090B] text-gray-300 hover:border-gray-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold font-mono">{c.label}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{c.desc}</div>
              </div>
              {settings.currency === c.code && (
                <div className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Dispatch Channels */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Bell className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-gray-100">Global Notification Channels</h3>
            <p className="text-xs text-gray-400">How you receive instant price drop and restock triggers.</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-800 bg-[#08090B] cursor-pointer hover:border-gray-700">
            <div>
              <div className="text-xs font-semibold text-gray-200">In-App Floating Toasts & Live Drawer</div>
              <div className="text-[11px] text-gray-500">Instant toast badges in the bottom-right corner</div>
            </div>
            <input
              type="checkbox"
              checked={settings.alertChannels.inApp}
              onChange={e => updateSettings({
                alertChannels: { ...settings.alertChannels, inApp: e.target.checked }
              })}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-800 bg-[#08090B] cursor-pointer hover:border-gray-700">
            <div>
              <div className="text-xs font-semibold text-gray-200">Email Alerts Dispatch</div>
              <div className="text-[11px] text-gray-500">Send immediate notifications for drops {'>'} 10%</div>
            </div>
            <input
              type="checkbox"
              checked={settings.alertChannels.email}
              onChange={e => updateSettings({
                alertChannels: { ...settings.alertChannels, email: e.target.checked }
              })}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-800 bg-[#08090B] cursor-pointer hover:border-gray-700">
            <div>
              <div className="text-xs font-semibold text-gray-200">Audio Chime on Live Drops</div>
              <div className="text-[11px] text-gray-500">Subtle sound cue when a live drop event is detected</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableAudioAlerts}
              onChange={e => updateSettings({ enableAudioAlerts: e.target.checked })}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-0"
            />
          </label>
        </div>
      </Card>
    </div>
  );
}
