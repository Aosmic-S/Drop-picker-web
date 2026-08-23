export type ProductCategory = 'pc_hardware' | 'console' | 'game' | 'accessory';

export type SubCategory = 
  | 'Graphics Cards'
  | 'CPUs'
  | 'Motherboards'
  | 'RAM'
  | 'SSDs'
  | 'HDDs'
  | 'Power Supplies'
  | 'PC Cases'
  | 'CPU Coolers'
  | 'Fans'
  | 'Monitors'
  | 'Gaming Laptops'
  | 'Prebuilt PCs'
  | 'PlayStation'
  | 'Xbox'
  | 'Nintendo'
  | 'Handhelds'
  | 'PC Games'
  | 'Console Games'
  | 'Controllers'
  | 'Keyboards'
  | 'Mice'
  | 'Headsets'
  | 'Microphones'
  | 'Webcams'
  | 'Racing Wheels'
  | 'VR Headsets'
  | 'Capture Cards';

export type StockStatus = 'In Stock' | 'Limited' | 'Out of Stock' | 'Pre-order';

export interface StoreListing {
  storeName: string;
  price: number;
  type: 'Physical' | 'Digital' | 'Digital Code' | 'Retail Box';
  stock: StockStatus;
  shipping: string;
  updatedAt: string;
  url?: string;
  affiliateUrl?: string;
}

export interface GameEdition {
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  type: 'Digital' | 'Physical';
}

export interface ConsoleEdition {
  name: string;
  storage: string;
  type: 'Disc' | 'Digital' | 'Bundle';
  price: number;
  stock: StockStatus;
  store: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory: SubCategory | string;
  image: string;
  platform?: string[];
  sku?: string;
  modelNumber?: string;
  description?: string;
  specs?: Record<string, string>;
  
  // Pricing
  currentPrice: number;
  originalPrice?: number;
  lowestPrice: number;
  averagePrice: number;
  highestPrice: number;
  
  // Deals & Stock
  dealScore: number;
  stockStatus: StockStatus;
  store: string;
  allStores?: StoreListing[];
  
  // Editions (for games / consoles)
  gameEditions?: GameEdition[];
  consoleEditions?: ConsoleEdition[];
  
  // Metrics & Activity
  rating?: number;
  reviewCount?: number;
  watchCount?: number;
  searchRank?: number;
  dropPercentage?: number;
  
  // Timeline
  updatedAt: string;
  lastRestockedAt?: string;
  lastDropAt?: string;
}

export interface LiveDropEvent {
  id: string;
  product: Product;
  previousPrice: number;
  newPrice: number;
  percentageChange: number;
  timestamp: string;
  type: 'drop' | 'restock' | 'deal' | 'price_hike';
  store: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  store?: string;
  event?: 'drop' | 'hike' | 'restock';
}

export interface WatchlistItem {
  id: string;
  productId: string;
  product: Product;
  targetPrice: number;
  addedAt: string;
  notifyOnDrop: boolean;
  notifyOnRestock: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  targetPrice: number;
  currentPrice: number;
  category: ProductCategory;
  store: string;
  triggerCondition: 'below_target' | 'percent_drop' | 'all_time_low' | 'any_drop';
  channels: ('in_app' | 'email' | 'browser')[];
  status: 'active' | 'triggered' | 'paused';
  createdAt: string;
  lastTriggeredAt?: string;
}

export interface RestockAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  currentPrice: number;
  store: string;
  platform?: string;
  status: 'active' | 'in_stock' | 'paused';
  createdAt: string;
  channels: ('in_app' | 'email' | 'browser')[];
}

export interface Notification {
  id: string;
  type: 'price_drop' | 'restock' | 'target_reached' | 'deal_alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  productId?: string;
  discountPercent?: number;
  price?: number;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type ThemeType = 'obsidian' | 'oled' | 'cyberpunk' | 'slate' | 'ember' | 'light';

export interface UserSettings {
  currency: Currency;
  region: string;
  theme: ThemeType;
  enableAudioAlerts: boolean;
  liveFeedRefreshRate: number; // in seconds
  alertChannels: {
    inApp: boolean;
    email: boolean;
    browser: boolean;
  };
}

