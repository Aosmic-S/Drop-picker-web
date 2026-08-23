import React, { useState, useEffect } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Currency, ThemeType } from '../types';
import { 
  Settings, 
  Globe, 
  Bell, 
  Check, 
  DollarSign, 
  Palette, 
  Database, 
  Copy, 
  ExternalLink,
  Code,
  Key,
  Server,
  Activity,
  AlertCircle,
  RefreshCw,
  Zap,
  Terminal,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { isSupabaseConfigured, getSupabaseStatus, SUPABASE_SCHEMA_SQL } from '../lib/supabase';
import { testSupabaseConnection } from '../lib/supabaseService';
import { 
  getBackendApiUrl, 
  setCustomBackendApiUrl, 
  pingBackendService, 
  triggerLiveScraper 
} from '../lib/backendService';
import { 
  getBrightDataConfig, 
  saveBrightDataConfig, 
  testBrightDataConnection 
} from '../lib/brightDataService';

export function SettingsPage() {
  const { settings, setCurrency, updateSettings, addToast, syncWithSupabaseDatabase } = useApp();
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  // Main Backend (Aosmic-S/Drop-Picker) State
  const [backendUrlInput, setBackendUrlInput] = useState(getBackendApiUrl());
  const [isTestingBackend, setIsTestingBackend] = useState(false);
  const [backendTestResult, setBackendTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [selectedScrapeStore, setSelectedScrapeStore] = useState('all');

  // Bright Data Scraping & Web Unlocker state
  const initialBd = getBrightDataConfig();
  const [brightDataKey, setBrightDataKey] = useState(initialBd.apiKey || '');
  const [brightDataZone, setBrightDataZone] = useState(initialBd.customerZone || 'web_unlocker_1');
  const [isTestingBrightData, setIsTestingBrightData] = useState(false);
  const [brightDataTestResult, setBrightDataTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const supabaseStatus = getSupabaseStatus();

  const currencies: { code: Currency; label: string; desc: string }[] = [
    { code: 'INR', label: 'Indian Rupee (₹ INR)', desc: 'Optimized for Indian retailers (Amazon.in, Flipkart, Croma, MDComputers)' },
    { code: 'USD', label: 'US Dollar ($ USD)', desc: 'North America / Global pricing reference' },
    { code: 'EUR', label: 'Euro (€ EUR)', desc: 'European retail pricing reference' },
    { code: 'GBP', label: 'British Pound (£ GBP)', desc: 'United Kingdom retail pricing' },
  ];

  const themeOptions: {
    id: ThemeType;
    name: string;
    description: string;
    bgHex: string;
    surfaceHex: string;
    accentHex: string;
    accentGlow: string;
    tag: string;
  }[] = [
    {
      id: 'obsidian',
      name: 'Obsidian Onyx',
      description: 'Deep stealth graphite with vibrant neon emerald accents.',
      bgHex: '#08090B',
      surfaceHex: '#12151A',
      accentHex: '#10B981',
      accentGlow: 'rgba(16, 185, 129, 0.4)',
      tag: 'Default Pro'
    },
    {
      id: 'oled',
      name: 'Midnight OLED',
      description: 'True pitch black 100% #000000 with crisp ice-blue contrasts.',
      bgHex: '#000000',
      surfaceHex: '#0C0C0E',
      accentHex: '#38BDF8',
      accentGlow: 'rgba(56, 189, 248, 0.4)',
      tag: 'OLED Battery Safe'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      description: 'High-contrast dark matrix void with electric cyan and magenta.',
      bgHex: '#050811',
      surfaceHex: '#0F172A',
      accentHex: '#06B6D4',
      accentGlow: 'rgba(6, 182, 212, 0.4)',
      tag: 'Gamer Neon'
    },
    {
      id: 'slate',
      name: 'Slate Titanium',
      description: 'Industrial charcoal steel paired with modern indigo accents.',
      bgHex: '#0B0F17',
      surfaceHex: '#1F2937',
      accentHex: '#818CF8',
      accentGlow: 'rgba(129, 140, 248, 0.4)',
      tag: 'Modern Studio'
    },
    {
      id: 'ember',
      name: 'Ember Stealth',
      description: 'Dark warm basalt coal ignited with fiery ember orange accents.',
      bgHex: '#0C0A09',
      surfaceHex: '#1C1917',
      accentHex: '#F97316',
      accentGlow: 'rgba(249, 115, 22, 0.4)',
      tag: 'Warm Fire'
    },
    {
      id: 'light',
      name: 'Minimalist Light',
      description: 'Crisp, high-contrast studio off-white with dark obsidian typography.',
      bgHex: '#F8FAFC',
      surfaceHex: '#FFFFFF',
      accentHex: '#059669',
      accentGlow: 'rgba(5, 150, 105, 0.3)',
      tag: 'Daylight Mode'
    },
  ];

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    addToast({
      type: 'success',
      title: 'SQL Schema Copied',
      message: 'Paste into Supabase SQL Editor to execute.'
    });
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const sampleEnvText = `# Supabase Environment Variables
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-api-key"

# Drop Picker Backend API (https://github.com/Aosmic-S/Drop-Picker)
VITE_BACKEND_API_URL="http://localhost:8000"

# Bright Data Web Scraper & Unlocker API
VITE_BRIGHTDATA_API_KEY="your-brightdata-api-token"
VITE_BRIGHTDATA_ZONE="web_unlocker_1"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnvText);
    setCopiedEnv(true);
    addToast({
      type: 'success',
      title: '.env Template Copied',
      message: 'Paste into your project root .env file'
    });
    setTimeout(() => setCopiedEnv(false), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        latencyMs: res.latencyMs
      });
      if (res.success) {
        await syncWithSupabaseDatabase();
      }
    } catch (e: any) {
      setTestResult({
        tested: true,
        success: false,
        message: e.message || 'Unknown network error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveBackendUrl = () => {
    setCustomBackendApiUrl(backendUrlInput);
    addToast({
      type: 'success',
      title: 'Backend URL Configured',
      message: backendUrlInput || 'Defaulting to localhost:8000'
    });
  };

  const handleTestBackend = async () => {
    setIsTestingBackend(true);
    setBackendTestResult(null);
    try {
      const res = await pingBackendService(backendUrlInput);
      setBackendTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        latencyMs: res.latencyMs
      });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Drop Picker Backend Connected',
          message: `Latency: ${res.latencyMs}ms`
        });
      }
    } catch (e: any) {
      setBackendTestResult({
        tested: true,
        success: false,
        message: e.message || 'Connection failed'
      });
    } finally {
      setIsTestingBackend(false);
    }
  };

  const handleSaveBrightData = () => {
    saveBrightDataConfig(brightDataKey, brightDataZone);
    addToast({
      type: 'success',
      title: 'Bright Data Credentials Saved',
      message: `Active Zone: ${brightDataZone}`
    });
  };

  const handleTestBrightData = async () => {
    setIsTestingBrightData(true);
    setBrightDataTestResult(null);
    try {
      const res = await testBrightDataConnection(brightDataKey, brightDataZone);
      setBrightDataTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        latencyMs: res.latencyMs
      });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Bright Data Verified',
          message: res.message
        });
      }
    } catch (e: any) {
      setBrightDataTestResult({
        tested: true,
        success: false,
        message: e.message || 'Bright Data check failed'
      });
    } finally {
      setIsTestingBrightData(false);
    }
  };

  const handleTriggerScraper = async () => {
    setIsScraping(true);
    try {
      const res = await triggerLiveScraper(selectedScrapeStore, 'all');
      addToast({
        type: 'info',
        title: 'Scraper Daemon Dispatched',
        message: res.message
      });
      await syncWithSupabaseDatabase();
    } catch (e: any) {
      addToast({
        type: 'alert',
        title: 'Trigger Scraper Failed',
        message: e.message
      });
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
          <Settings className="h-4 w-4 text-emerald-400" />
          <span>Platform Preferences & Integration</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-100">
          Preferences, APIs & Backend Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Configure Bright Data unlockers, Supabase persistence, Drop-Picker daemon, and visual themes.
        </p>
      </div>

      {/* Visual Theme Selection */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-gray-100">Visual Themes & Color Modes</h3>
              <p className="text-xs text-gray-400">Select a curated palette tailored for gaming hardware monitoring.</p>
            </div>
          </div>
          <span className="text-xs font-mono uppercase text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            Active: {settings.theme || 'obsidian'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {themeOptions.map(theme => {
            const isSelected = (settings.theme || 'obsidian') === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => updateSettings({ theme: theme.id })}
                className={`group relative p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500/60 bg-[#141820] shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/40'
                    : 'border-gray-800 bg-[#08090B] hover:border-gray-700 hover:bg-[#0D1015]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white font-mono">
                      {theme.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800/80 text-gray-400 border border-gray-700/60">
                      {theme.tag}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                    {theme.description}
                  </p>
                </div>

                {/* Color Swatch Preview Bar */}
                <div className="mt-2 pt-2 border-t border-gray-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="h-4 w-4 rounded-full border border-gray-600 shadow-sm"
                      style={{ backgroundColor: theme.bgHex }}
                      title="Background"
                    />
                    <div 
                      className="h-4 w-4 rounded-full border border-gray-600 shadow-sm"
                      style={{ backgroundColor: theme.surfaceHex }}
                      title="Surface Card"
                    />
                    <div 
                      className="h-4 w-4 rounded-full border border-gray-400 shadow-sm"
                      style={{ backgroundColor: theme.accentHex }}
                      title="Accent Color"
                    />
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-500 group-hover:text-gray-300 font-mono">
                      Select →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Bright Data Scraping & Web Unlocker Configuration Card */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <span>Bright Data Web Unlocker & Scraping API</span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-3 w-3" /> Anti-Bot Bypass
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Direct integration with Bright Data to scrape live product pricing, stock availability, and specifications across protected storefronts.
              </p>
            </div>
          </div>

          <a
            href="https://brightdata.com/cp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-mono"
          >
            <span>Bright Data CP</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Bright Data API Token / Customer Key
              </label>
              <input
                type="password"
                value={brightDataKey}
                onChange={e => setBrightDataKey(e.target.value)}
                placeholder="Bearer token or API token..."
                className="w-full rounded-lg border border-gray-800 bg-[#08090B] px-3 py-2 text-xs font-mono text-gray-200 placeholder:text-gray-600 focus:border-emerald-500 focus:outline-none min-h-[40px]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Customer Zone / Web Unlocker Zone
              </label>
              <input
                type="text"
                value={brightDataZone}
                onChange={e => setBrightDataZone(e.target.value)}
                placeholder="web_unlocker_1"
                className="w-full rounded-lg border border-gray-800 bg-[#08090B] px-3 py-2 text-xs font-mono text-gray-200 placeholder:text-gray-600 focus:border-emerald-500 focus:outline-none min-h-[40px]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveBrightData}
              className="text-xs border-gray-700 hover:border-gray-500 min-h-[36px]"
            >
              Save Bright Data Config
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestBrightData}
              disabled={isTestingBrightData}
              className="text-xs border-gray-700 hover:border-emerald-500 text-emerald-400 gap-1.5 min-h-[36px]"
            >
              <Zap className={`h-3.5 w-3.5 ${isTestingBrightData ? 'animate-pulse' : ''}`} />
              {isTestingBrightData ? 'Verifying...' : 'Test Bright Data API'}
            </Button>
          </div>

          {brightDataTestResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              brightDataTestResult.success
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}>
              {brightDataTestResult.success ? (
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              )}
              <div>
                <div className="font-semibold">{brightDataTestResult.message}</div>
                {brightDataTestResult.latencyMs > 0 && (
                  <div className="text-[11px] font-mono opacity-80 mt-0.5">
                    Latency: {brightDataTestResult.latencyMs}ms
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main Backend Integration Card (Aosmic-S/Drop-Picker) */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <span>Drop Picker Main Backend Service</span>
                <span className="inline-flex items-center gap-1 rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-sky-400 border border-sky-500/20">
                  <Terminal className="h-3 w-3" /> Aosmic-S/Drop-Picker
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Connected crawler daemon for real-time web scrapers (Amazon, Flipkart, Steam, Croma), price anomaly crawlers, and restock monitors.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/Aosmic-S/Drop-Picker/tree/main"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-mono"
          >
            <span>View Repo on GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Backend URL Configuration & Test */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-300 block">
            Backend API Endpoint URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={backendUrlInput}
              onChange={e => setBackendUrlInput(e.target.value)}
              placeholder="http://localhost:8000 or https://your-backend.com"
              className="flex-1 rounded-lg border border-gray-800 bg-[#08090B] px-3 py-2 text-xs font-mono text-gray-200 placeholder:text-gray-600 focus:border-emerald-500 focus:outline-none min-h-[40px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveBackendUrl}
              className="text-xs border-gray-700 hover:border-gray-500 min-h-[36px]"
            >
              Save Endpoint
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestBackend}
              disabled={isTestingBackend}
              className="text-xs border-gray-700 hover:border-emerald-500 gap-1.5 text-emerald-400 min-h-[36px]"
            >
              <Zap className={`h-3.5 w-3.5 ${isTestingBackend ? 'animate-pulse' : ''}`} />
              {isTestingBackend ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>

          {/* Test Result Callout */}
          {backendTestResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              backendTestResult.success
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}>
              {backendTestResult.success ? (
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              )}
              <div className="space-y-0.5">
                <div className="font-semibold">{backendTestResult.message}</div>
                {backendTestResult.latencyMs && (
                  <div className="text-[11px] font-mono opacity-80">
                    Round-trip latency: {backendTestResult.latencyMs}ms
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Scraper Worker Trigger */}
        <div className="pt-2 border-t border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
              <span>Trigger Background Scraper Worker</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Dispatch an on-demand crawl job to fetch fresh prices from Indian & Global storefronts.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedScrapeStore}
              onChange={e => setSelectedScrapeStore(e.target.value)}
              className="rounded-lg border border-gray-800 bg-[#08090B] px-2.5 py-1.5 text-xs text-gray-300 focus:border-emerald-500 focus:outline-none font-mono min-h-[36px]"
            >
              <option value="all">All Retailers (Amazon, Flipkart, Steam, Croma)</option>
              <option value="amazon">Amazon India</option>
              <option value="flipkart">Flipkart</option>
              <option value="steam">Steam Store</option>
              <option value="croma">Croma Retail</option>
              <option value="playstation">PlayStation Store</option>
            </select>

            <Button
              variant="default"
              size="sm"
              onClick={handleTriggerScraper}
              disabled={isScraping}
              className="text-xs bg-emerald-500 text-black hover:bg-emerald-400 font-semibold gap-1.5 shrink-0 min-h-[36px]"
            >
              <Zap className={`h-3.5 w-3.5 ${isScraping ? 'animate-spin' : ''}`} />
              {isScraping ? 'Triggering...' : 'Launch Scrape Job'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Supabase Credentials & Database Setup Card */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <span>Supabase Database & Auth Integration</span>
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-500/30">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-400 border border-amber-500/20">
                    Keys Needed
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400">
                Connect your cloud Supabase database to persist user watchlists, price alert subscriptions, and custom price records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEnv}
              className="text-xs border-gray-700 hover:border-gray-500 gap-1.5 min-h-[36px]"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedEnv ? 'Copied .env!' : 'Copy .env variables'}
            </Button>
          </div>
        </div>

        {/* Required Credentials Checklist */}
        <div className="rounded-xl border border-gray-800 bg-[#08090B] p-4 space-y-3">
          <div className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-emerald-400" />
            <span>Credentials to add in your Environment (.env)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-gray-800/80 bg-[#12151A]/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400">VITE_SUPABASE_URL</span>
                <span className="text-[10px] text-gray-500 font-mono">Required (Client)</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Your unique Supabase Project URL.
              </p>
              <div className="text-[10px] text-gray-500 pt-1">
                📍 Found in Supabase Dashboard → <strong>Project Settings → API</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-800/80 bg-[#12151A]/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400">VITE_SUPABASE_ANON_KEY</span>
                <span className="text-[10px] text-gray-500 font-mono">Required (Public)</span>
              </div>
              <p className="text-[11px] text-gray-400">
                The public anonymous API key for client-side queries.
              </p>
              <div className="text-[10px] text-gray-500 pt-1">
                📍 Found in Supabase Dashboard → <strong>Project Settings → API</strong>
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold gap-1.5 min-h-[36px]"
            >
              <Activity className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              {isTesting ? 'Testing Endpoint...' : '⚡ Test Supabase Connection'}
            </Button>
          </div>

          {/* Diagnostic Result Callout */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              testResult.success
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}>
              {testResult.success ? (
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div className="space-y-0.5">
                <div className="font-semibold">{testResult.message}</div>
                {testResult.latencyMs && (
                  <div className="text-[11px] font-mono opacity-80">
                    Round-trip latency: {testResult.latencyMs}ms
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Database Schema & SQL Executor */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <button
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              className="text-xs font-semibold text-gray-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors text-left"
            >
              <Code className="h-3.5 w-3.5 shrink-0" />
              <span>{showSqlSchema ? 'Hide Database Tables SQL' : 'View SQL Schema to create Drop Picker tables in Supabase'}</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySql}
              className="text-xs border-gray-700 hover:border-gray-500 gap-1.5 min-h-[34px] self-start sm:self-auto"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}
            </Button>
          </div>

          {showSqlSchema && (
            <div className="relative rounded-xl border border-gray-800 bg-[#08090B] p-4 text-xs font-mono text-gray-300 overflow-x-auto max-h-72">
              <pre className="text-[11px] leading-relaxed text-emerald-300/90 whitespace-pre">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          )}
        </div>
      </Card>

      {/* Currency Selection */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-gray-100">Primary Display Currency</h3>
            <p className="text-xs text-gray-400">All prices and price history curves will render in this currency.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currencies.map(c => (
            <div
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between min-h-[48px] ${
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
                <div className="h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Dispatch Channels */}
      <Card className="bg-[#0D0F12] border-gray-800 p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Bell className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-bold text-gray-100">Global Notification Channels</h3>
            <p className="text-xs text-gray-400">How you receive instant price drop and restock triggers.</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-800 bg-[#08090B] cursor-pointer hover:border-gray-700 min-h-[48px]">
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

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-800 bg-[#08090B] cursor-pointer hover:border-gray-700 min-h-[48px]">
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

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-800 bg-[#08090B] cursor-pointer hover:border-gray-700 min-h-[48px]">
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
