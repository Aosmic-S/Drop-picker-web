import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  mockProducts, 
  mockLiveDrops, 
  mockWatchlist, 
  mockPriceAlerts, 
  mockRestockAlerts, 
  mockNotifications 
} from '../lib/mockData';

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
  activeAlertModalProduct: Product | null;
  lastUpdatedTime: string;
  
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
  setActiveAlertModalProduct: (product: Product | null) => void;
  triggerLiveDropSimulation: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Admin & Modifiers
  adminUpdateProductPrice: (productId: string, newPrice: number, store?: string) => void;
  adminUpdateStock: (productId: string, status: Product['stockStatus']) => void;
  adminAddProduct: (product: Product) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('drop_picker_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const [liveDrops, setLiveDrops] = useState<LiveDropEvent[]>(() => {
    const saved = localStorage.getItem('drop_picker_live_drops');
    return saved ? JSON.parse(saved) : mockLiveDrops;
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('drop_picker_watchlist');
    return saved ? JSON.parse(saved) : mockWatchlist;
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('drop_picker_price_alerts');
    return saved ? JSON.parse(saved) : mockPriceAlerts;
  });

  const [restockAlerts, setRestockAlerts] = useState<RestockAlert[]>(() => {
    const saved = localStorage.getItem('drop_picker_restock_alerts');
    return saved ? JSON.parse(saved) : mockRestockAlerts;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('drop_picker_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('drop_picker_settings');
    return saved ? JSON.parse(saved) : {
      currency: 'INR',
      region: 'India (IN)',
      theme: 'dark',
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
  const [activeAlertModalProduct, setActiveAlertModalProduct] = useState<Product | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');

  // Persistence helpers
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

  // Real-time live simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdatedTime('Just now');
    }, 15000);
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
    addToast({
      type: 'success',
      title: '✓ Added to Watchlist',
      message: `Monitoring ${product.name} across all stores.`
    });
  };

  const removeFromWatchlist = (productId: string) => {
    const item = watchlist.find(w => w.productId === productId);
    setWatchlist(prev => prev.filter(w => w.productId !== productId));
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
        return { ...w, targetPrice };
      }
      return w;
    }));
    addToast({
      type: 'success',
      title: 'Target Price Updated',
      message: `New target: ₹${targetPrice.toLocaleString('en-IN')}`
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
    addToast({
      type: 'alert',
      title: '✓ Price Alert Created',
      message: `Notify below ₹${alertData.targetPrice.toLocaleString('en-IN')}`
    });
  };

  const deletePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
    addToast({
      type: 'info',
      title: 'Price Alert Removed'
    });
  };

  const togglePriceAlertStatus = (id: string) => {
    setPriceAlerts(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'active' ? 'paused' : 'active';
        return { ...a, status: nextStatus };
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
      title: 'All notifications marked as read'
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast({
      type: 'info',
      title: 'Notifications Cleared'
    });
  };

  // Live Drop Simulation Function
  const triggerLiveDropSimulation = () => {
    const candidateProducts = [...products];
    const randomProduct = candidateProducts[Math.floor(Math.random() * candidateProducts.length)];
    const isDrop = Math.random() > 0.3;
    
    if (isDrop) {
      const dropPct = -(Math.floor(Math.random() * 20) + 5);
      const oldPrice = randomProduct.currentPrice;
      const newPrice = Math.round(oldPrice * (1 + dropPct / 100));
      
      const newEvent: LiveDropEvent = {
        id: `drop_${Date.now()}`,
        product: { ...randomProduct, currentPrice: newPrice },
        previousPrice: oldPrice,
        newPrice: newPrice,
        percentageChange: dropPct,
        timestamp: 'Just now',
        type: 'drop',
        store: randomProduct.store
      };

      setLiveDrops(prev => [newEvent, ...prev.slice(0, 19)]);
      
      // Update product in list
      setProducts(prev => prev.map(p => p.id === randomProduct.id ? {
        ...p,
        currentPrice: newPrice,
        updatedAt: 'Just now',
        lowestPrice: Math.min(p.lowestPrice, newPrice),
        dealScore: Math.min(99, p.dealScore + 6)
      } : p));

      // Add Notification
      const notif: Notification = {
        id: `notif_${Date.now()}`,
        type: 'price_drop',
        title: 'Flash Drop Detected',
        message: `${randomProduct.name} dropped by ${Math.abs(dropPct)}% to ₹${newPrice.toLocaleString('en-IN')}`,
        timestamp: 'Just now',
        read: false,
        productId: randomProduct.id,
        price: newPrice,
        discountPercent: Math.abs(dropPct)
      };
      setNotifications(prev => [notif, ...prev]);

      addToast({
        type: 'drop',
        title: `↓ Price dropped ₹${(oldPrice - newPrice).toLocaleString('en-IN')}`,
        message: `${randomProduct.name} on ${randomProduct.store}`
      });
    } else {
      // Restock Simulation
      const newEvent: LiveDropEvent = {
        id: `rst_${Date.now()}`,
        product: randomProduct,
        previousPrice: randomProduct.currentPrice,
        newPrice: randomProduct.currentPrice,
        percentageChange: 0,
        timestamp: 'Just now',
        type: 'restock',
        store: randomProduct.store
      };

      setLiveDrops(prev => [newEvent, ...prev.slice(0, 19)]);

      const notif: Notification = {
        id: `notif_${Date.now()}`,
        type: 'restock',
        title: 'Item Restocked',
        message: `${randomProduct.name} is back in stock at ${randomProduct.store}.`,
        timestamp: 'Just now',
        read: false,
        productId: randomProduct.id,
        price: randomProduct.currentPrice
      };
      setNotifications(prev => [notif, ...prev]);

      addToast({
        type: 'restock',
        title: `● ${randomProduct.name} Restocked`,
        message: `Now available on ${randomProduct.store}`
      });
    }
  };

  const adminUpdateProductPrice = (productId: string, newPrice: number, store: string = 'Amazon') => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const oldPrice = p.currentPrice;
        const pctChange = ((newPrice - oldPrice) / oldPrice) * 100;
        
        // Add drop event
        const dropEvent: LiveDropEvent = {
          id: `admin_drop_${Date.now()}`,
          product: { ...p, currentPrice: newPrice },
          previousPrice: oldPrice,
          newPrice,
          percentageChange: pctChange,
          timestamp: 'Just now',
          type: newPrice < oldPrice ? 'drop' : 'price_hike',
          store: store || p.store
        };
        setLiveDrops(drops => [dropEvent, ...drops]);

        return {
          ...p,
          currentPrice: newPrice,
          lowestPrice: Math.min(p.lowestPrice, newPrice),
          highestPrice: Math.max(p.highestPrice, newPrice),
          updatedAt: 'Just now'
        };
      }
      return p;
    }));

    addToast({
      type: 'success',
      title: 'Admin: Price Updated',
      message: `Product price set to ₹${newPrice.toLocaleString('en-IN')}`
    });
  };

  const adminUpdateStock = (productId: string, status: Product['stockStatus']) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockStatus: status, updatedAt: 'Just now' } : p));
    addToast({
      type: 'info',
      title: 'Admin: Stock Updated',
      message: `Status changed to ${status}`
    });
  };

  const adminAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    addToast({
      type: 'success',
      title: 'Admin: Product Added',
      message: newProduct.name
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
        activeAlertModalProduct,
        lastUpdatedTime,
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
        setActiveAlertModalProduct,
        triggerLiveDropSimulation,
        addToast,
        removeToast,
        adminUpdateProductPrice,
        adminUpdateStock,
        adminAddProduct
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
