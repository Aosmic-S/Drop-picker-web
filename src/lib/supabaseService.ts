import { getSupabase, isSupabaseConfigured } from './supabase';
import { Product, ProductCategory, StockStatus, WatchlistItem, PriceAlert, RestockAlert, Notification, LiveDropEvent } from '../types';

export interface UserAuthProfile {
  id: string;
  email?: string;
  isAnonymous?: boolean;
}

// 1. Connection Diagnostic Tester
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tablesFound?: string[];
  latencyMs?: number;
}> {
  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured) {
    return {
      success: false,
      message: 'Supabase credentials not configured in environment (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY required).',
    };
  }

  const startTime = Date.now();
  try {
    // Attempt a light ping/query
    const { error } = await supabase.from('products').select('id').limit(1);
    const latencyMs = Date.now() - startTime;

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.products" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! (Database tables need to be created using the SQL schema in Settings).',
          latencyMs,
          tablesFound: []
        };
      }
      return {
        success: false,
        message: `Connected to Supabase endpoint, but query failed: ${error.message} (Code: ${error.code})`,
        latencyMs
      };
    }

    return {
      success: true,
      message: 'Successfully connected and verified Supabase database!',
      latencyMs,
      tablesFound: ['products']
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Connection failed: ${msg}`,
    };
  }
}

function mapSupabaseRowToProduct(row: any): Product {
  const currentPrice = Number(row.current_price ?? row.price ?? row.final_price ?? row.sale_price ?? row.amount ?? 0);
  const rawOrigPrice = row.original_price ?? row.list_price ?? row.regular_price ?? row.msrp ?? row.previous_price;
  const originalPrice = rawOrigPrice && Number(rawOrigPrice) > currentPrice ? Number(rawOrigPrice) : undefined;
  const lowestPrice = Number(row.lowest_price ?? row.min_price ?? (currentPrice > 0 ? currentPrice : 0));
  const highestPrice = Number(row.highest_price ?? row.max_price ?? (originalPrice || currentPrice));
  const averagePrice = Number(row.average_price ?? row.avg_price ?? currentPrice);
  
  let stockStatus: StockStatus = 'In Stock';
  const rawStatus = String(row.stock_status || '').toLowerCase();
  if (rawStatus.includes('out') || row.in_stock === false || row.stock === 0 || row.availability === 'out_of_stock') {
    stockStatus = 'Out of Stock';
  } else if (rawStatus.includes('limit')) {
    stockStatus = 'Limited';
  } else if (rawStatus.includes('pre')) {
    stockStatus = 'Pre-order';
  } else {
    stockStatus = 'In Stock';
  }

  const rawStore = String(row.store || row.retailer || row.vendor || row.source || 'Best Buy');
  let store: 'Best Buy' | 'Newegg' | 'Steam' | string = 'Best Buy';
  if (rawStore.toLowerCase().includes('newegg')) store = 'Newegg';
  else if (rawStore.toLowerCase().includes('steam')) store = 'Steam';
  else if (rawStore.toLowerCase().includes('best buy') || rawStore.toLowerCase().includes('bestbuy')) store = 'Best Buy';
  else store = rawStore;

  const defaultImg = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400';
  const image = row.image || row.image_url || row.img_url || row.thumbnail || row.picture || defaultImg;

  let category: ProductCategory = 'pc_hardware';
  const rawCat = String(row.category || '').toLowerCase();
  if (rawCat.includes('console')) category = 'console';
  else if (rawCat.includes('game')) category = 'game';
  else if (rawCat.includes('accessory')) category = 'accessory';
  else category = 'pc_hardware';

  return {
    id: String(row.id || row._id || `prod_${Math.random().toString(36).slice(2, 9)}`),
    name: String(row.name || row.title || row.product_name || 'Hardware Product'),
    brand: String(row.brand || row.manufacturer || 'Tech'),
    category,
    subCategory: row.sub_category || row.subcategory,
    image,
    currentPrice,
    originalPrice,
    lowestPrice,
    averagePrice,
    highestPrice,
    dealScore: Number(row.deal_score ?? (originalPrice ? Math.min(99, Math.round(((originalPrice - currentPrice) / originalPrice) * 100) + 50) : 75)),
    stockStatus,
    store,
    specs: typeof row.specs === 'object' && row.specs !== null ? row.specs : {},
    allStores: Array.isArray(row.all_stores) && row.all_stores.length > 0 ? row.all_stores : [
      {
        store,
        price: currentPrice,
        stockStatus,
        url: row.url || row.product_url || row.link || '#'
      }
    ],
    updatedAt: row.updated_at ? new Date(row.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
  };
}

// 2. Products Sync
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    // 1. Try standard 'products' table
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data && data.length > 0) {
      return data.map(mapSupabaseRowToProduct);
    }

    // 2. If 'products' is empty or error, check fallback table names
    if (error && error.code === '42P01') {
      const fallbacks = ['product', 'items', 'hardware_products', 'items_tracked'];
      for (const tbl of fallbacks) {
        const { data: fallbackData, error: fallbackError } = await supabase.from(tbl).select('*');
        if (!fallbackError && fallbackData && fallbackData.length > 0) {
          return fallbackData.map(mapSupabaseRowToProduct);
        }
      }
    }

    if (data && data.length === 0) {
      return [];
    }

    if (error) {
      console.warn('Supabase products query notification:', error.message);
    }

    return [];
  } catch (e) {
    console.error('Error in fetchProductsFromSupabase:', e);
    return null;
  }
}

// 3. Create or Insert Product into Supabase
export async function createProductInSupabase(product: Product): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      sub_category: product.subCategory,
      image: product.image,
      current_price: product.currentPrice,
      original_price: product.originalPrice,
      lowest_price: product.lowestPrice,
      average_price: product.averagePrice,
      highest_price: product.highestPrice,
      deal_score: product.dealScore,
      stock_status: product.stockStatus,
      store: product.store,
      specs: product.specs,
      all_stores: product.allStores,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.warn('Failed to insert product into Supabase:', error.message);
      return false;
    }

    // Record initial price history entry
    await supabase.from('price_history').insert({
      product_id: product.id,
      price: product.currentPrice,
      store: product.store,
      event: 'initial_tracked_price',
      recorded_at: new Date().toISOString()
    });

    return true;
  } catch (e) {
    console.error('Supabase product creation error:', e);
    return false;
  }
}

// 4. Update single product price in Supabase
export async function updateProductPriceInSupabase(productId: string, newPrice: number, store?: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('products').update({
      current_price: newPrice,
      store: store || undefined,
      updated_at: new Date().toISOString()
    }).eq('id', productId);

    if (error) {
      console.warn('Failed to update product in Supabase:', error.message);
      return false;
    }

    // Record to price_history table
    await supabase.from('price_history').insert({
      product_id: productId,
      price: newPrice,
      store: store || 'Amazon',
      event: 'price_update',
      recorded_at: new Date().toISOString()
    });

    return true;
  } catch (e) {
    console.error('Supabase price update error:', e);
    return false;
  }
}

// 5. Delete product from Supabase
export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    return !error;
  } catch {
    return false;
  }
}

// 6. Fetch Price History from Supabase
export async function fetchPriceHistoryFromSupabase(productId: string): Promise<{
  date: string;
  price: number;
  store: string;
  event?: string;
}[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', productId)
      .order('recorded_at', { ascending: true });

    if (error || !data) return [];

    return data.map((row: any) => ({
      date: new Date(row.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(row.price),
      store: row.store,
      event: row.event
    }));
  } catch {
    return [];
  }
}

// 7. Watchlist Synchronization
export async function fetchWatchlistFromSupabase(userId: string): Promise<WatchlistItem[] | null> {
  const supabase = getSupabase();
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('watchlist')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      product: row.products ? {
        id: row.products.id,
        name: row.products.name,
        brand: row.products.brand,
        category: row.products.category,
        subCategory: row.products.sub_category,
        image: row.products.image,
        currentPrice: Number(row.products.current_price),
        originalPrice: row.products.original_price ? Number(row.products.original_price) : undefined,
        lowestPrice: Number(row.products.lowest_price),
        averagePrice: Number(row.products.average_price),
        highestPrice: Number(row.products.highest_price),
        dealScore: row.products.deal_score ?? 70,
        stockStatus: row.products.stock_status || 'In Stock',
        store: row.products.store || 'Amazon',
        specs: row.products.specs || {},
        allStores: row.products.all_stores || [],
        updatedAt: 'Live',
      } : null,
      targetPrice: Number(row.target_price),
      addedAt: row.added_at ? new Date(row.added_at).toISOString().split('T')[0] : 'Today',
      notifyOnDrop: row.notify_drop ?? true,
      notifyOnRestock: row.notify_restock ?? true
    })).filter(item => Boolean(item.product));
  } catch (e) {
    return null;
  }
}

export async function syncWatchlistItemToSupabase(userId: string, item: WatchlistItem): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase.from('watchlist').upsert({
      id: item.id,
      user_id: userId,
      product_id: item.productId,
      target_price: item.targetPrice,
      notify_drop: item.notifyOnDrop,
      notify_restock: item.notifyOnRestock,
      added_at: new Date().toISOString()
    });
    return !error;
  } catch {
    return false;
  }
}

export async function removeWatchlistItemFromSupabase(userId: string, productId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    return !error;
  } catch {
    return false;
  }
}

// 8. Price Alerts Synchronization
export async function fetchPriceAlertsFromSupabase(userId: string): Promise<PriceAlert[] | null> {
  const supabase = getSupabase();
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*, products(*)')
      .eq('user_id', userId)
      .eq('type', 'price_drop');

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      productName: row.products?.name || 'Tracked Product',
      productImage: row.products?.image || '',
      category: row.products?.category || 'pc_hardware',
      store: row.products?.store || 'Amazon',
      currentPrice: row.products?.current_price ? Number(row.products.current_price) : 0,
      targetPrice: Number(row.target_price),
      triggerCondition: row.trigger_condition || 'below_target',
      channels: row.channels || ['in_app'],
      status: row.status || 'active',
      createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recently'
    }));
  } catch {
    return null;
  }
}

export async function syncPriceAlertToSupabase(userId: string, alert: PriceAlert): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || !userId) return false;

  try {
    const { error } = await supabase.from('alerts').upsert({
      id: alert.id,
      user_id: userId,
      product_id: alert.productId,
      type: 'price_drop',
      target_price: alert.targetPrice,
      trigger_condition: alert.triggerCondition,
      channels: alert.channels,
      status: alert.status,
      created_at: new Date().toISOString()
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAlertFromSupabase(alertId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('alerts').delete().eq('id', alertId);
    return !error;
  } catch {
    return false;
  }
}

// 9. Realtime Subscriptions Handler
export function subscribeToSupabaseRealtime(
  onProductChange?: (product: Product) => void,
  onPriceDrop?: (event: LiveDropEvent) => void
) {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('drop_picker_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload: any) => {
          if (payload.new) {
            const mapped: Product = {
              id: payload.new.id,
              name: payload.new.name,
              brand: payload.new.brand,
              category: payload.new.category,
              subCategory: payload.new.sub_category,
              image: payload.new.image,
              currentPrice: Number(payload.new.current_price),
              originalPrice: payload.new.original_price ? Number(payload.new.original_price) : undefined,
              lowestPrice: Number(payload.new.lowest_price),
              averagePrice: Number(payload.new.average_price),
              highestPrice: Number(payload.new.highest_price),
              dealScore: payload.new.deal_score ?? 70,
              stockStatus: payload.new.stock_status || 'In Stock',
              store: payload.new.store || 'Amazon',
              specs: payload.new.specs || {},
              allStores: payload.new.all_stores || [],
              updatedAt: 'Just now'
            };

            onProductChange?.(mapped);

            // If price decreased, trigger live drop event
            if (payload.old && payload.new.current_price < payload.old.current_price) {
              const prevPrice = Number(payload.old.current_price);
              const newPrice = Number(payload.new.current_price);
              const dropPercent = Math.round(((prevPrice - newPrice) / prevPrice) * 100);

              const dropEvent: LiveDropEvent = {
                id: `drop_${Date.now()}`,
                product: mapped,
                previousPrice: prevPrice,
                newPrice: newPrice,
                percentageChange: -dropPercent,
                timestamp: 'Just now',
                type: 'drop',
                store: mapped.store
              };

              onPriceDrop?.(dropEvent);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Realtime subscription not established:', e);
    return () => {};
  }
}

// 10. Supabase Auth Helpers
export async function getSupabaseUser(): Promise<UserAuthProfile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      isAnonymous: user.is_anonymous
    };
  } catch {
    return null;
  }
}

export async function signInWithEmail(email: string, password?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication failed' };
  }
}

export async function signUpWithEmail(email: string, password?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password: password || 'DropPicker123!',
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Sign up failed' };
  }
}

export async function signOutSupabase(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch {
    return false;
  }
}
