import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe retrieval of environment variables without relying on vite types in tsc
const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
  hasAnonKey: boolean;
}

export function getSupabaseStatus(): SupabaseConfigStatus {
  return {
    isConfigured: isSupabaseConfigured,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 18)}...` : 'Not set',
    hasAnonKey: Boolean(supabaseAnonKey),
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
