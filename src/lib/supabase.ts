import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project connection provided for real dataset synchronization
const DEFAULT_SUPABASE_URL = 'https://pvvscrgxcylithvaajip.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dnNjcmd4Y3lsaXRodmFhamlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MTEyNTMsImV4cCI6MjEwMjI4NzI1M30.TUHdUVTphvKuE3lvsuQmQRQPFBIYDifYOsR3RLVoPmg';

// Safe retrieval of environment variables or local storage configuration
const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  let url = metaEnv.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  let anonKey = metaEnv.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('drop_picker_supabase_url');
    const customKey = localStorage.getItem('drop_picker_supabase_anon_key');
    if (customUrl) url = customUrl;
    if (customKey) anonKey = customKey;
  }

  return { url, anonKey };
}

let supabaseInstance: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getIsSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(
    url && 
    anonKey && 
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-key')
  );
}

export const isSupabaseConfigured = getIsSupabaseConfigured();

export function setSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('drop_picker_supabase_url', url.trim());
    localStorage.setItem('drop_picker_supabase_anon_key', anonKey.trim());
    supabaseInstance = null;
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('drop_picker_supabase_url');
    localStorage.removeItem('drop_picker_supabase_anon_key');
    supabaseInstance = null;
  }
}

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  const configured = Boolean(
    url && 
    anonKey && 
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-key')
  );

  if (!configured) {
    return null;
  }

  if (!supabaseInstance || lastUsedUrl !== url || lastUsedKey !== anonKey) {
    supabaseInstance = createClient(url, anonKey);
    lastUsedUrl = url;
    lastUsedKey = anonKey;
  }

  return supabaseInstance;
}

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
  hasAnonKey: boolean;
}

export function getSupabaseStatus(): SupabaseConfigStatus {
  const { url, anonKey } = getSupabaseCredentials();
  const configured = Boolean(
    url && 
    anonKey && 
    !url.includes('your-project-id') &&
    !anonKey.includes('your-anon-key')
  );

  return {
    isConfigured: configured,
    url: url ? (url.length > 24 ? `${url.substring(0, 24)}...` : url) : 'Not set',
    hasAnonKey: Boolean(anonKey),
  };
}

export const SUPABASE_SCHEMA_SQL = `-- Drop Picker Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Products Table
create table if not exists public.products (
  id text primary key,
  name text not null,
  brand text not null,
  category text not null,
  sub_category text not null,
  image text not null,
  current_price numeric not null,
  original_price numeric,
  lowest_price numeric not null,
  average_price numeric not null,
  highest_price numeric not null,
  deal_score integer default 50,
  stock_status text default 'In Stock',
  store text not null,
  specs jsonb default '{}'::jsonb,
  all_stores jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Price History Table
create table if not exists public.price_history (
  id bigserial primary key,
  product_id text references public.products(id) on delete cascade,
  price numeric not null,
  store text not null,
  event text,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Price & Restock Alerts Table
create table if not exists public.alerts (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id text references public.products(id) on delete cascade,
  type text not null check (type in ('price_drop', 'restock')),
  target_price numeric,
  trigger_condition text,
  channels jsonb default '["in_app"]'::jsonb,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. User Watchlist Table
create table if not exists public.watchlist (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id text references public.products(id) on delete cascade,
  target_price numeric,
  notify_drop boolean default true,
  notify_restock boolean default true,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.price_history enable row level security;
alter table public.alerts enable row level security;
alter table public.watchlist enable row level security;

-- Public read access for products and price history
create policy "Allow public read access on products"
  on public.products for select
  using (true);

create policy "Allow public read access on price_history"
  on public.price_history for select
  using (true);

-- User-scoped access for alerts and watchlist
create policy "Users can manage their own alerts"
  on public.alerts for all
  using (auth.uid() = user_id);

create policy "Users can manage their own watchlist"
  on public.watchlist for all
  using (auth.uid() = user_id);
`;
