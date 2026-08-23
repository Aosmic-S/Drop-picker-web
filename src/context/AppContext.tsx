import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Product, 
  LiveDropEvent, 
  WatchlistItem, 
  PriceAlert, 
  RestockAlert, 
  Notification, 
  Currency, 
  UserSettings 
} from '../types';
import { 
  getIsSupabaseConfigured,
  getSupabase,
  setSupabaseCredentials,
  clearSupabaseCredentials
} from '../lib/supabase';
import {
  fetchProductsFromSupabase,
  updateProductPriceInSupabase,
  fetchWatchlistFromSupabase,
  syncWatchlistItemToSupabase,
  removeWatchlistItemFromSupabase,
  fetchPriceAlertsFromSupabase,
  syncPriceAlertToSupabase,
  deleteAlertFromSupabase,
  createProductInSupabase,
  deleteProductFromSupabase,
  subscribeToSupabaseRealtime,
  getSupabaseUser,
  signInWithEmail,
  signUpWithEmail,
  signOutSupabase,
  UserAuthProfile
} from '../lib/supabaseService';
import { 
  scrapeUrlWithBrightData, 
  ScrapedProductData 
} from '../lib/brightDataService';
import { 
  triggerLiveScraper, 
  getBackendApiUrl,
  ScrapeJobResult
} from '../lib/backendService';

interface Toast {
  id: string;
  type: 'success' | 'drop' | 'restock' | 'info' | 'alert';
  title: string;
  message?: string;
}

interface AppContextType {
  products: Product[];
  liveDrops: LiveDropEvent[];
  watchlist: WatchlistItem[];
  priceAlerts: PriceAlert[];
  restockAlerts: RestockAlert[];
  notifications: Notification[];
  settings: UserSettings;
  toasts: Toast[];
  isCommandOpen: boolean;
  isScrapeModalOpen: boolean;
  activeAlertModalProduct: Product | null;
  lastUpdatedTime: string;
  currentUser: UserAuthProfile | null;
  isSupabaseActive: boolean;
  isDatabaseLoading: boolean;
  supabaseError: string | null;
  
  // Actions
  setCurrency: (currency: Currency) => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  addToWatchlist: (productId: string, targetPrice?: number) => void;
  removeFromWatchlist: (productId: string) => void;
  updateWatchlistTarget: (productId: string, targetPrice: number) => void;
  isProductInWatchlist: (productId: string) => boolean;
  
  createPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => void;
  deletePriceAlert: (id: string) => void;
  togglePriceAlertStatus: (id: string) => void;
  
  createRestockAlert: (alert: Omit<RestockAlert, 'id' | 'createdAt' | 'status'>) => void;
  deleteRestockAlert: (id: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  setIsCommandOpen: (open: boolean) => void;
  setIsScrapeModalOpen: (open: boolean) => void;
  setActiveAlertModalProduct: (product: Product | null) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // API Integration Actions
  scrapeAndTrackUrl: (url: string) => Promise<{ success: boolean; product?: ScrapedProductData; message: string }>;
  triggerBackendScrapeJob: (store?: string, category?: string) => Promise<{ success: boolean; job?: ScrapeJobResult; message: string }>;
  
  // Supabase Auth & Sync
  loginWithSupabase: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerWithSupabase: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutSupabase: () => Promise<void>;
  syncWithSupabaseDatabase: () => Promise<void>;
  saveSupabaseConfig: (url: string, anonKey: string) => Promise<boolean>;
  
  // Admin & Modifiers
  adminUpdateProductPrice: (productId: string, newPrice: number, store?: string) => void;
  adminUpdateStock: (productId: string, status: Product['stockStatus']) => void;
  adminAddProduct: (product: Product) => void;
  adminDeleteProduct: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(() => getIsSupabaseConfigured());
  const [isDatabaseLoading, setIsDatabaseLoading] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Pure real database products state (starts empty - no fake items)
  const [products, setProducts] = useState<Product[]>(() => {
    // Purge any legacy dummy items
    const saved = localStorage.getItem('drop_picker_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isReal = parsed.filter(p => !p.id?.startsWith('prod_rtx') && !p.id?.startsWith('prod_ryzen') && !p.id?.startsWith('prod_steam_deck'));
          if (isReal.length > 0) {
            return isReal;
          }
        }
      } catch {
        // clean up
      }
    }
    return [];
  });

  const [liveDrops, setLiveDrops] = useState<LiveDropEvent[]>(() => {
    const saved = localStorage.getItem('drop_picker_live_drops');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const isReal = parsed.filter(d => !d.id?.startsWith('drop_init_') && !d.product?.id?.startsWith('prod_rtx'));
          if (isReal.length > 0) return isReal;
        }
      } catch {}
    }
    return [];
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('drop_picker_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('drop_picker_price_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [restockAlerts, setRestockAlerts] = useState<RestockAlert[]>(() => {
    const saved = localStorage.getItem('drop_picker_restock_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('drop_picker_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<UserAuthProfile | null>(() => {
    const saved = localStorage.getItem('drop_picker_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('drop_picker_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.theme === 'dark') {
        parsed.theme = 'obsidian';
      }
      return parsed;
    }
    return {
      currency: 'USD',
      region: 'United States (US)',
      theme: 'obsidian',
      enableAudioAlerts: false,
      liveFeedRefreshRate: 30,
      alertChannels: {
        inApp: true,
        email: true,
        browser: false,
      }
    };
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState(false);
  const [activeAlertModalProduct, setActiveAlertModalProduct] = useState<Product | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');

  // Apply theme to document root
  useEffect(() => {
    const currentTheme = settings.theme || 'obsidian';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }, [settings.theme]);

  // Fetch real dataset from Supabase
  const syncWithSupabaseDatabase = useCallback(async () => {
    const configured = getIsSupabaseConfigured();
    setIsSupabaseActive(configured);
    
    if (!configured) {
      setSupabaseError('Supabase credentials not yet configured. Connect Supabase in Settings or environment to query live database.');
      return;
    }

    setIsDatabaseLoading(true);
    setSupabaseError(null);

    try {
      // 1. Query real products table
      const remoteProducts = await fetchProductsFromSupabase();
      if (remoteProducts !== null) {
        setProducts(remoteProducts);
        localStorage.setItem('drop_picker_products', JSON.stringify(remoteProducts));

        // Recompute drops from real products that have a discount
        const computedDrops: LiveDropEvent[] = remoteProducts
          .filter(p => p.originalPrice && p.currentPrice < p.originalPrice)
          .map((p, idx) => {
            const oldP = p.originalPrice!;
            const newP = p.currentPrice;
            const pct = ((newP - oldP) / oldP) * 100;
            return {
              id: `drop_${p.id}_${idx}`,
              product: p,
              previousPrice: oldP,
              newPrice: newP,
              percentageChange: Number(pct.toFixed(1)),
              timestamp: p.updatedAt || 'Recent',
              store: p.store,
              type: 'drop' as const
            };
          });

        setLiveDrops(computedDrops);
        localStorage.setItem('drop_picker_live_drops', JSON.stringify(computedDrops));
      }

      // 2. Fetch remote watchlist if logged in
      if (currentUser?.id && !currentUser.isAnonymous) {
        const remoteWatchlist = await fetchWatchlistFromSupabase(currentUser.id);
        if (remoteWatchlist) {
          setWatchlist(remoteWatchlist);
        }

        const remoteAlerts = await fetchPriceAlertsFromSupabase(currentUser.id);
        if (remoteAlerts) {
          setPriceAlerts(remoteAlerts);
        }
      }
      setLastUpdatedTime('Just now');
    } catch (err: any) {
      console.warn('Supabase synchronization error:', err);
      setSupabaseError(err?.message || 'Failed to query Supabase database');
    } finally {
      setIsDatabaseLoading(false);
    }
  }, [currentUser]);

  // Load from Supabase on startup & setup Realtime subscriptions
  useEffect(() => {
    syncWithSupabaseDatabase();

    const supabase = getSupabase();
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userProf: UserAuthProfile = {
            id: session.user.id,
            email: session.user.email,
            isAnonymous: false,
          };
          setCurrentUser(userProf);
          localStorage.setItem('drop_picker_auth_user', JSON.stringify(userProf));
        }
      });

      const unsubscribeRealtime = subscribeToSupabaseRealtime(
        (updatedProduct) => {
          setProducts(prev => {
            const idx = prev.findIndex(p => p.id === updatedProduct.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = updatedProduct;
              return next;
            }
            return [updatedProduct, ...prev];
          });
          setLastUpdatedTime('Just now');
        },
        (dropEvent) => {
          setLiveDrops(prev => [dropEvent, ...prev.slice(0, 49)]);
          addToast({
            type: 'drop',
            title: `Live Drop: ${dropEvent.product.name}`,
            message: `Price changed on ${dropEvent.store}: $${dropEvent.newPrice.toFixed(2)}`
          });
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
        unsubscribeRealtime();
      };
    }
  }, [syncWithSupabaseDatabase]);

  const saveSupabaseConfig = async (url: string, anonKey: string): Promise<boolean> => {
    setSupabaseCredentials(url, anonKey);
    setIsSupabaseActive(true);
    await syncWithSupabaseDatabase();
    return true;
  };

  // Persistence helpers
  useEffect(() => {
    localStorage.setItem('drop_picker_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('drop_picker_live_drops', JSON.stringify(liveDrops));
  }, [liveDrops]);

  useEffect(() => {
    localStorage.setItem('drop_picker_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('drop_picker_price_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    localStorage.setItem('drop_picker_restock_alerts', JSON.stringify(restockAlerts));
  }, [restockAlerts]);

  useEffect(() => {
    localStorage.setItem('drop_picker_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('drop_picker_settings', JSON.stringify(settings));
  }, [settings]);

  // Global Keyboard shortcuts (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isCommandOpen) {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandOpen]);

  // Live status ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdatedTime('Just now');
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setCurrency = (currency: Currency) => {
    setSettings(prev => ({ ...prev, currency }));
    addToast({
      type: 'info',
      title: `Currency Changed to ${currency}`,
    });
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
    addToast({
      type: 'info',
      title: 'Settings Saved',
    });
  };

  // Scrape any URL with Bright Data & Add to Catalog
  const scrapeAndTrackUrl = async (url: string): Promise<{ success: boolean; product?: ScrapedProductData; message: string }> => {
    const backendUrl = getBackendApiUrl();
    const result = await scrapeUrlWithBrightData(url, backendUrl);
    
    if (result.success && result.product) {
      const p = result.product;
      const newProd: Product = {
        id: `prod_${Date.now()}`,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subCategory: p.subCategory,
        image: p.image,
        currentPrice: p.currentPrice,
        originalPrice: p.originalPrice,
        lowestPrice: p.currentPrice,
        averagePrice: p.originalPrice || p.currentPrice,
        highestPrice: p.originalPrice || p.currentPrice,
        dealScore: p.dealScore,
        stockStatus: p.stockStatus,
        store: p.store,
        specs: p.specs,
        allStores: [
          {
            storeName: p.store,
            price: p.currentPrice,
            url: p.url,
            stock: p.stockStatus,
            type: 'Physical',
            shipping: 'Free Express',
            updatedAt: 'Just now'
          }
        ],
        updatedAt: 'Just now'
      };

      // Add to local state
      setProducts(prev => [newProd, ...prev]);

      // Sync to Supabase
      if (isSupabaseActive) {
        await createProductInSupabase(newProd);
      }

      addToast({
        type: 'success',
        title: 'Product Scraped & Ingested',
        message: `${newProd.name} (${newProd.store})`
      });

      return {
        success: true,
        product: p,
        message: result.message
      };
    }

    return {
      success: false,
      message: result.message
    };
  };

  // Trigger Backend Scrape Job
  const triggerBackendScrapeJob = async (store: string = 'all', category: string = 'all') => {
    const res = await triggerLiveScraper(store, category);
    if (res.success) {
      addToast({
        type: 'info',
        title: 'Scraper Daemon Dispatched',
        message: res.message
      });
    }
    return res;
  };

  const addToWatchlist = (productId: string, targetPrice?: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (watchlist.some(w => w.productId === productId)) {
      addToast({
        type: 'info',
        title: 'Already in Watchlist',
        message: `${product.name} is currently being tracked.`
      });
      return;
    }

    const newItem: WatchlistItem = {
      id: `w_${Date.now()}`,
      productId,
      product,
      targetPrice: targetPrice || Math.round(product.currentPrice * 0.9),
      addedAt: new Date().toISOString().split('T')[0],
      notifyOnDrop: true,
      notifyOnRestock: true
    };

    setWatchlist(prev => [newItem, ...prev]);

    // Persist to Supabase if configured
    if (isSupabaseActive && currentUser?.id) {
      syncWatchlistItemToSupabase(currentUser.id, newItem);
    }

    addToast({
      type: 'success',
      title: '✓ Added to Watchlist',
      message: `Monitoring ${product.name} across all stores.`
    });
  };

  const removeFromWatchlist = (productId: string) => {
    const item = watchlist.find(w => w.productId === productId);
    setWatchlist(prev => prev.filter(w => w.productId !== productId));
    
    if (isSupabaseActive && currentUser?.id) {
      removeWatchlistItemFromSupabase(currentUser.id, productId);
    }

    if (item) {
      addToast({
        type: 'info',
        title: 'Removed from Watchlist',
        message: item.product.name
      });
    }
  };

  const updateWatchlistTarget = (productId: string, targetPrice: number) => {
    setWatchlist(prev => prev.map(w => {
      if (w.productId === productId) {
        const updated = { ...w, targetPrice };
        if (isSupabaseActive && currentUser?.id) {
          syncWatchlistItemToSupabase(currentUser.id, updated);
        }
        return updated;
      }
      return w;
    }));
    addToast({
      type: 'success',
      title: 'Target Price Updated',
      message: `New target: $${targetPrice.toFixed(2)}`
    });
  };

  const isProductInWatchlist = (productId: string) => {
    return watchlist.some(w => w.productId === productId);
  };

  const createPriceAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alt_${Date.now()}`,
      status: 'active',
      createdAt: 'Just now'
    };
    setPriceAlerts(prev => [newAlert, ...prev]);

    if (isSupabaseActive && currentUser?.id) {
      syncPriceAlertToSupabase(currentUser.id, newAlert);
    }

    addToast({
      type: 'alert',
      title: '✓ Price Alert Created',
      message: `Notify below $${alertData.targetPrice.toFixed(2)}`
    });
  };

  const deletePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
    if (isSupabaseActive) {
      deleteAlertFromSupabase(id);
    }
    addToast({
      type: 'info',
      title: 'Price Alert Removed'
    });
  };

  const togglePriceAlertStatus = (id: string) => {
    setPriceAlerts(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus: 'active' | 'paused' = a.status === 'active' ? 'paused' : 'active';
        const updated: PriceAlert = { ...a, status: nextStatus };
        if (isSupabaseActive && currentUser?.id) {
          syncPriceAlertToSupabase(currentUser.id, updated);
        }
        return updated;
      }
      return a;
    }));
  };

  const createRestockAlert = (alertData: Omit<RestockAlert, 'id' | 'createdAt' | 'status'>) => {
    const newAlert: RestockAlert = {
      ...alertData,
      id: `rst_${Date.now()}`,
      status: 'active',
      createdAt: 'Just now'
    };
    setRestockAlerts(prev => [newAlert, ...prev]);
    addToast({
      type: 'restock',
      title: '✓ Restock Alert Subscribed',
      message: `Will alert when ${alertData.productName} is in stock.`
    });
  };

  const deleteRestockAlert = (id: string) => {
    setRestockAlerts(prev => prev.filter(a => a.id !== id));
    if (isSupabaseActive) {
      deleteAlertFromSupabase(id);
    }
    addToast({
      type: 'info',
      title: 'Restock Alert Removed'
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'All Notifications Read'
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast({
      type: 'info',
      title: 'Notification Center Cleared'
    });
  };

  // Supabase Auth wrappers
  const loginWithSupabase = async (email: string, password?: string) => {
    const res = await signInWithEmail(email, password);
    if (res.success) {
      const user = await getSupabaseUser();
      setCurrentUser(user);
      if (user) localStorage.setItem('drop_picker_auth_user', JSON.stringify(user));
      syncWithSupabaseDatabase();
      addToast({
        type: 'success',
        title: 'Logged In with Supabase',
        message: email
      });
    } else {
      addToast({
        type: 'alert',
        title: 'Login Failed',
        message: res.error
      });
    }
    return res;
  };

  const registerWithSupabase = async (email: string, password?: string) => {
    const res = await signUpWithEmail(email, password);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'Sign Up Successful',
        message: 'Account registered with Supabase.'
      });
    } else {
      addToast({
        type: 'alert',
        title: 'Sign Up Failed',
        message: res.error
      });
    }
    return res;
  };

  const logoutSupabase = async () => {
    await signOutSupabase();
    setCurrentUser(null);
    localStorage.removeItem('drop_picker_auth_user');
    addToast({
      type: 'info',
      title: 'Signed Out of Supabase'
    });
  };

  const adminUpdateProductPrice = (productId: string, newPrice: number, store?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const prevPrice = p.currentPrice;
        const lowestPrice = Math.min(p.lowestPrice, newPrice);
        const highestPrice = Math.max(p.highestPrice, newPrice);
        const updated = {
          ...p,
          currentPrice: newPrice,
          lowestPrice,
          highestPrice,
          store: store || p.store,
          updatedAt: 'Just now'
        };

        if (isSupabaseActive) {
          updateProductPriceInSupabase(productId, newPrice, store);
        }

        if (newPrice < prevPrice) {
          const dropPercent = Math.round(((prevPrice - newPrice) / prevPrice) * 100);
          const dropEvent: LiveDropEvent = {
            id: `drop_${Date.now()}`,
            product: updated,
            previousPrice: prevPrice,
            newPrice: newPrice,
            percentageChange: -dropPercent,
            timestamp: 'Just now',
            type: 'drop',
            store: store || p.store
          };
          setLiveDrops(drops => [dropEvent, ...drops.slice(0, 49)]);
        }

        return updated;
      }
      return p;
    }));

    addToast({
      type: 'success',
      title: 'Price Updated',
      message: `Product price set to $${newPrice.toFixed(2)}`
    });
  };

  const adminUpdateStock = (productId: string, status: Product['stockStatus']) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockStatus: status, updatedAt: 'Just now' } : p));
    addToast({
      type: 'info',
      title: 'Stock Updated',
      message: `Status changed to ${status}`
    });
  };

  const adminAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    if (isSupabaseActive) {
      createProductInSupabase(newProduct);
    }
    addToast({
      type: 'success',
      title: 'Product Ingested',
      message: newProduct.name
    });
  };

  const adminDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (isSupabaseActive) {
      deleteProductFromSupabase(productId);
    }
    addToast({
      type: 'info',
      title: 'Product Removed'
    });
  };

  return (
    <AppContext.Provider
      value={{
        products,
        liveDrops,
        watchlist,
        priceAlerts,
        restockAlerts,
        notifications,
        settings,
        toasts,
        isCommandOpen,
        isScrapeModalOpen,
        activeAlertModalProduct,
        lastUpdatedTime,
        currentUser,
        isSupabaseActive,
        isDatabaseLoading,
        supabaseError,
        setCurrency,
        updateSettings,
        addToWatchlist,
        removeFromWatchlist,
        updateWatchlistTarget,
        isProductInWatchlist,
        createPriceAlert,
        deletePriceAlert,
        togglePriceAlertStatus,
        createRestockAlert,
        deleteRestockAlert,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        setIsCommandOpen,
        setIsScrapeModalOpen,
        setActiveAlertModalProduct,
        addToast,
        removeToast,
        scrapeAndTrackUrl,
        triggerBackendScrapeJob,
        loginWithSupabase,
        registerWithSupabase,
        logoutSupabase,
        syncWithSupabaseDatabase,
        saveSupabaseConfig,
        adminUpdateProductPrice,
        adminUpdateStock,
        adminAddProduct,
        adminDeleteProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
