import { Product, LiveDropEvent, PriceHistoryPoint, WatchlistItem, PriceAlert, RestockAlert, Notification } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p_rtx_5070ti',
    name: 'ASUS TUF Gaming GeForce RTX 5070 Ti 16GB OC',
    brand: 'ASUS',
    category: 'pc_hardware',
    subCategory: 'Graphics Cards',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PC'],
    sku: 'TUF-RTX5070TI-O16G',
    modelNumber: '90YV0KX0-M0NA00',
    description: 'Powered by NVIDIA Blackwell architecture, featuring 16GB GDDR7 memory, Military-grade capacitors, dual ball fan bearings, and axial-tech cooling.',
    specs: {
      'Architecture': 'NVIDIA Blackwell',
      'VRAM': '16GB GDDR7',
      'Memory Bus': '256-bit',
      'Boost Clock': '2,670 MHz',
      'Power Connector': '1x 16-pin 12V-2x6',
      'TDP': '285W',
      'Outputs': '3x DisplayPort 2.1, 1x HDMI 2.1a'
    },
    currentPrice: 81499,
    originalPrice: 89999,
    lowestPrice: 79999,
    averagePrice: 85400,
    highestPrice: 94999,
    dealScore: 94,
    stockStatus: 'In Stock',
    store: 'Amazon',
    updatedAt: '2 min ago',
    lastDropAt: '2 min ago',
    dropPercentage: -9.44,
    watchCount: 1420,
    searchRank: 1,
    rating: 4.9,
    reviewCount: 384,
    allStores: [
      { storeName: 'Amazon', price: 81499, type: 'Physical', stock: 'In Stock', shipping: 'Free Prime Delivery', updatedAt: '2 min ago' },
      { storeName: 'MDComputers', price: 82999, type: 'Physical', stock: 'Limited', shipping: '₹149 Courier', updatedAt: '6 min ago' },
      { storeName: 'VedantComputers', price: 83500, type: 'Physical', stock: 'In Stock', shipping: 'Free Express', updatedAt: '11 min ago' },
      { storeName: 'PrimeABGB', price: 84999, type: 'Physical', stock: 'In Stock', shipping: '₹99', updatedAt: '15 min ago' },
      { storeName: 'EliteHubs', price: 86499, type: 'Physical', stock: 'Limited', shipping: 'Free', updatedAt: '35 min ago' },
    ]
  },
  {
    id: 'p_ps5_slim',
    name: 'PlayStation 5 Slim 1TB Disc Edition',
    brand: 'Sony',
    category: 'console',
    subCategory: 'PlayStation',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PS5'],
    sku: 'CFI-2000A01',
    description: 'PlayStation 5 Slim console delivers next-gen gaming with ultra-fast 1TB NVMe SSD, Ray Tracing, 4K 120Hz output, and Tempest 3D AudioTech.',
    specs: {
      'Storage': '1TB Custom NVMe SSD',
      'Processor': 'Custom 8-core AMD Zen 2 (up to 3.5GHz)',
      'Graphics': 'Custom AMD RDNA 2 (10.28 TFLOPs)',
      'Drive': 'Ultra HD Blu-ray Disc Drive',
      'Resolution': 'Up to 4K 120fps / 8K support'
    },
    currentPrice: 51490,
    originalPrice: 54990,
    lowestPrice: 48990,
    averagePrice: 53200,
    highestPrice: 54990,
    dealScore: 78,
    stockStatus: 'In Stock',
    store: 'Flipkart',
    updatedAt: '4 min ago',
    lastRestockedAt: '4 min ago',
    dropPercentage: -6.36,
    watchCount: 2840,
    searchRank: 2,
    rating: 4.8,
    reviewCount: 1920,
    consoleEditions: [
      { name: '1TB Disc Edition', storage: '1TB', type: 'Disc', price: 51490, stock: 'In Stock', store: 'Flipkart' },
      { name: '1TB Digital Edition', storage: '1TB', type: 'Digital', price: 44990, stock: 'In Stock', store: 'Amazon' },
      { name: 'Spider-Man 2 Bundle', storage: '1TB', type: 'Bundle', price: 56990, stock: 'Limited', store: 'Sony Center' },
    ],
    allStores: [
      { storeName: 'Flipkart', price: 51490, type: 'Physical', stock: 'In Stock', shipping: 'Free Fast Delivery', updatedAt: '4 min ago' },
      { storeName: 'Amazon', price: 52990, type: 'Physical', stock: 'In Stock', shipping: 'Free Prime', updatedAt: '8 min ago' },
      { storeName: 'Sony Center', price: 54990, type: 'Physical', stock: 'In Stock', shipping: 'Free Store Pickup', updatedAt: '20 min ago' },
      { storeName: 'Croma', price: 53990, type: 'Physical', stock: 'Limited', shipping: '₹0 Same Day', updatedAt: '45 min ago' },
      { storeName: 'Reliance Digital', price: 54490, type: 'Physical', stock: 'In Stock', shipping: 'Free', updatedAt: '1h ago' }
    ]
  },
  {
    id: 'p_switch_2',
    name: 'Nintendo Switch 2 (OLED Display Edition)',
    brand: 'Nintendo',
    category: 'console',
    subCategory: 'Nintendo',
    image: 'https://images.unsplash.com/photo-1578269557438-e67d26b88950?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['Nintendo'],
    sku: 'NSW-2026-PRO',
    description: 'The anticipated next-generation hybrid system by Nintendo with 8-inch 1080p OLED screen, DLSS support in 4K TV dock mode, and magnetic Joy-Cons.',
    specs: {
      'Display': '8.0-inch 1080p OLED 120Hz',
      'Processor': 'Custom NVIDIA Tegra T239 with DLSS 3.5',
      'Storage': '256GB UFS 3.1 + microSD Express',
      'Battery': '5000 mAh (up to 7.5 hours)',
      'Dock Output': '4K 60fps via HDMI 2.1'
    },
    currentPrice: 49999,
    originalPrice: 49999,
    lowestPrice: 49999,
    averagePrice: 49999,
    highestPrice: 59999,
    dealScore: 68,
    stockStatus: 'In Stock',
    store: 'Amazon',
    updatedAt: '8 min ago',
    lastRestockedAt: '8 min ago',
    watchCount: 3950,
    searchRank: 3,
    rating: 5.0,
    reviewCount: 42,
    allStores: [
      { storeName: 'Amazon', price: 49999, type: 'Physical', stock: 'In Stock', shipping: 'Free Priority', updatedAt: '8 min ago' },
      { storeName: 'Mx2Games', price: 51999, type: 'Physical', stock: 'Limited', shipping: 'Free', updatedAt: '12 min ago' },
      { storeName: 'Gamestheshop', price: 49999, type: 'Physical', stock: 'Out of Stock', shipping: 'Free', updatedAt: '18 min ago' },
      { storeName: 'E2Z Store', price: 52499, type: 'Physical', stock: 'In Stock', shipping: '₹100', updatedAt: '30 min ago' },
    ]
  },
  {
    id: 'p_elden_ring',
    name: 'Elden Ring: Shadow of the Erdtree Edition',
    brand: 'Bandai Namco',
    category: 'game',
    subCategory: 'Console Games',
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PS5', 'PC', 'Xbox Series X'],
    sku: 'ELDEN-ERD-PS5',
    description: 'Winner of hundreds of Game of the Year awards. Includes the base game and the acclaimed massive expansion Shadow of the Erdtree.',
    currentPrice: 2499,
    originalPrice: 4999,
    lowestPrice: 2499,
    averagePrice: 3850,
    highestPrice: 4999,
    dealScore: 96,
    stockStatus: 'In Stock',
    store: 'Steam',
    updatedAt: '12 min ago',
    lastDropAt: '12 min ago',
    dropPercentage: -50.01,
    watchCount: 1890,
    searchRank: 4,
    rating: 4.95,
    reviewCount: 4500,
    gameEditions: [
      { name: 'Standard Base Game', price: 1799, originalPrice: 3599, features: ['Base Game'], type: 'Digital' },
      { name: 'Shadow of the Erdtree Edition', price: 2499, originalPrice: 4999, features: ['Base Game', 'Shadow of the Erdtree Expansion', 'Digital Artbook'], type: 'Digital' },
      { name: 'Collector’s Physical Edition', price: 9999, originalPrice: 12999, features: ['Physical Disc', 'Messmer the Impaler 46cm Figure', '40-page Hardcover Artbook', 'Official Soundtrack'], type: 'Physical' }
    ],
    allStores: [
      { storeName: 'Steam', price: 2499, type: 'Digital Code', stock: 'In Stock', shipping: 'Instant Key Delivery', updatedAt: '12 min ago' },
      { storeName: 'PlayStation Store', price: 2799, type: 'Digital Code', stock: 'In Stock', shipping: 'Instant Download', updatedAt: '25 min ago' },
      { storeName: 'Xbox Store', price: 2799, type: 'Digital Code', stock: 'In Stock', shipping: 'Instant Download', updatedAt: '40 min ago' },
      { storeName: 'Amazon (Physical Disc)', price: 3199, type: 'Physical', stock: 'In Stock', shipping: 'Free Delivery', updatedAt: '1h ago' }
    ]
  },
  {
    id: 'p_ryzen_9800x3d',
    name: 'AMD Ryzen 7 9800X3D Desktop Processor (8C/16T, 104MB Cache)',
    brand: 'AMD',
    category: 'pc_hardware',
    subCategory: 'CPUs',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PC'],
    sku: '100-100001084WOF',
    description: 'The world’s fastest gaming processor built on Zen 5 architecture featuring 2nd generation 3D V-Cache technology with improved thermal conductivity and unlocked overclocking.',
    specs: {
      'Cores / Threads': '8 Cores / 16 Threads',
      'Base Clock': '4.7 GHz',
      'Boost Clock': '5.2 GHz',
      'L3 Cache': '96MB 3D V-Cache + 8MB L2 (104MB Total)',
      'Socket': 'AM5',
      'TDP': '120W',
      'PCIe Support': 'PCIe 5.0'
    },
    currentPrice: 44999,
    originalPrice: 48999,
    lowestPrice: 42999,
    averagePrice: 46200,
    highestPrice: 51999,
    dealScore: 84,
    stockStatus: 'Limited',
    store: 'PrimeABGB',
    updatedAt: '18 min ago',
    lastDropAt: '18 min ago',
    dropPercentage: -8.16,
    watchCount: 2200,
    searchRank: 5,
    rating: 4.9,
    reviewCount: 310,
    allStores: [
      { storeName: 'PrimeABGB', price: 44999, type: 'Physical', stock: 'Limited', shipping: 'Free Priority', updatedAt: '18 min ago' },
      { storeName: 'MDComputers', price: 45499, type: 'Physical', stock: 'In Stock', shipping: '₹99', updatedAt: '22 min ago' },
      { storeName: 'VedantComputers', price: 45999, type: 'Physical', stock: 'In Stock', shipping: 'Free', updatedAt: '30 min ago' },
      { storeName: 'Amazon', price: 47999, type: 'Physical', stock: 'In Stock', shipping: 'Free Prime', updatedAt: '1h ago' }
    ]
  },
  {
    id: 'p_samsung_990pro',
    name: 'Samsung 990 PRO 2TB PCIe 4.0 M.2 NVMe SSD with Heatsink',
    brand: 'Samsung',
    category: 'pc_hardware',
    subCategory: 'SSDs',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PC', 'PS5'],
    sku: 'MZ-V9P2T0CW',
    description: 'Ultra-fast read/write speeds up to 7,450/6,900 MB/s. PS5 ready with slim integrated heatsink for sustained thermal control.',
    specs: {
      'Capacity': '2TB',
      'Seq Read Speed': 'Up to 7,450 MB/s',
      'Seq Write Speed': 'Up to 6,900 MB/s',
      'Form Factor': 'M.2 2280 NVMe 2.0',
      'PS5 Compatible': 'Yes (Pre-installed Heatsink)'
    },
    currentPrice: 15999,
    originalPrice: 22999,
    lowestPrice: 14999,
    averagePrice: 18500,
    highestPrice: 24999,
    dealScore: 92,
    stockStatus: 'In Stock',
    store: 'Amazon',
    updatedAt: '24 min ago',
    lastDropAt: '24 min ago',
    dropPercentage: -30.43,
    watchCount: 1640,
    searchRank: 6,
    rating: 4.85,
    reviewCount: 1120,
    allStores: [
      { storeName: 'Amazon', price: 15999, type: 'Physical', stock: 'In Stock', shipping: 'Free Prime', updatedAt: '24 min ago' },
      { storeName: 'MDComputers', price: 16499, type: 'Physical', stock: 'In Stock', shipping: 'Free', updatedAt: '40 min ago' },
      { storeName: 'PrimeABGB', price: 16799, type: 'Physical', stock: 'In Stock', shipping: 'Free', updatedAt: '1h ago' }
    ]
  },
  {
    id: 'p_dualsense_edge',
    name: 'Sony DualSense Edge Wireless Controller for PS5 & PC',
    brand: 'Sony',
    category: 'accessory',
    subCategory: 'Controllers',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PS5', 'PC'],
    sku: 'CFI-ZCP1',
    description: 'High-performance ultra-customizable controller with swappable stick modules, changeable stick caps, back buttons, and adjustable trigger travel.',
    specs: {
      'Haptic Feedback': 'Yes (Dynamic Voice Coil Actuators)',
      'Adaptive Triggers': 'Yes (Customizable trigger stop sliders)',
      'Module Replacement': 'Quick release stick modules',
      'Profiles': 'Multiple on-board custom profiles'
    },
    currentPrice: 16990,
    originalPrice: 18990,
    lowestPrice: 15990,
    averagePrice: 17800,
    highestPrice: 18990,
    dealScore: 81,
    stockStatus: 'In Stock',
    store: 'Amazon',
    updatedAt: '35 min ago',
    dropPercentage: -10.53,
    watchCount: 980,
    searchRank: 7,
    rating: 4.7,
    reviewCount: 410,
    allStores: [
      { storeName: 'Amazon', price: 16990, type: 'Physical', stock: 'In Stock', shipping: 'Free Prime', updatedAt: '35 min ago' },
      { storeName: 'Sony Center', price: 17990, type: 'Physical', stock: 'In Stock', shipping: 'Free Store Pickup', updatedAt: '1h ago' },
      { storeName: 'Flipkart', price: 17490, type: 'Physical', stock: 'In Stock', shipping: 'Free', updatedAt: '2h ago' }
    ]
  },
  {
    id: 'p_gta_6',
    name: 'Grand Theft Auto VI (PS5 / Xbox Series X)',
    brand: 'Rockstar Games',
    category: 'game',
    subCategory: 'Console Games',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PS5', 'Xbox Series X'],
    sku: 'GTA6-NEXTGEN-ROW',
    description: 'Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond in the biggest, most immersive evolution of the Grand Theft Auto series yet.',
    currentPrice: 5999,
    originalPrice: 5999,
    lowestPrice: 5999,
    averagePrice: 5999,
    highestPrice: 6999,
    dealScore: 60,
    stockStatus: 'Pre-order',
    store: 'PlayStation Store',
    updatedAt: '45 min ago',
    watchCount: 8420,
    searchRank: 8,
    rating: 5.0,
    reviewCount: 0,
    gameEditions: [
      { name: 'Standard Edition', price: 5999, features: ['Full Game', 'Pre-order In-Game Cash Bonus'], type: 'Digital' },
      { name: 'Deluxe Edition', price: 7499, features: ['Full Game', 'Vice City Classic Vehicles Pack', '3-Day Early Story Access'], type: 'Digital' },
      { name: 'Collector’s Steelbook Edition', price: 11999, features: ['Physical Disc in Steelbook', 'Leonida Fabric Map', 'Lucia & Jason Collectible Pin Set'], type: 'Physical' }
    ],
    allStores: [
      { storeName: 'PlayStation Store', price: 5999, type: 'Digital Code', stock: 'Pre-order', shipping: 'Instant Digital Access', updatedAt: '45 min ago' },
      { storeName: 'Xbox Store', price: 5999, type: 'Digital Code', stock: 'Pre-order', shipping: 'Instant Digital Access', updatedAt: '1h ago' },
      { storeName: 'Amazon', price: 5999, type: 'Physical', stock: 'Pre-order', shipping: 'Release Day Delivery', updatedAt: '2h ago' }
    ]
  },
  {
    id: 'p_wooting_60he',
    name: 'Wooting 60HE+ Analog Hall Effect Gaming Keyboard',
    brand: 'Wooting',
    category: 'accessory',
    subCategory: 'Keyboards',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PC'],
    sku: 'WK6-HE-PLUS-ANSI',
    description: 'The golden standard of esports analog keyboards with Lekker magnetic Hall Effect switches, 0.1mm Rapid Trigger, adjustable actuation point (0.1 - 4.0mm), and true analog input.',
    specs: {
      'Switches': 'Lekker L60 Hall Effect Linear',
      'Actuation Point': '0.1mm to 4.0mm fully adjustable',
      'Rapid Trigger': '0.1mm sensitivity',
      'Polling Rate': '8000Hz (0.125ms response time)',
      'Keycaps': 'Double-shot PBT Cherry Profile'
    },
    currentPrice: 19499,
    originalPrice: 21999,
    lowestPrice: 18999,
    averagePrice: 20500,
    highestPrice: 23999,
    dealScore: 89,
    stockStatus: 'In Stock',
    store: 'GenesisPC',
    updatedAt: '52 min ago',
    dropPercentage: -11.36,
    watchCount: 1310,
    searchRank: 9,
    rating: 4.95,
    reviewCount: 650,
    allStores: [
      { storeName: 'GenesisPC', price: 19499, type: 'Physical', stock: 'In Stock', shipping: 'Free Express', updatedAt: '52 min ago' },
      { storeName: 'Meckeys', price: 19999, type: 'Physical', stock: 'Limited', shipping: 'Free Delivery', updatedAt: '1h ago' },
      { storeName: 'Amazon', price: 21999, type: 'Physical', stock: 'In Stock', shipping: 'Free Prime', updatedAt: '3h ago' }
    ]
  },
  {
    id: 'p_samsung_oled_g9',
    name: 'Samsung Odyssey OLED G9 49" Curved 240Hz 0.03ms Dual QHD Gaming Monitor',
    brand: 'Samsung',
    category: 'pc_hardware',
    subCategory: 'Monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PC', 'PS5', 'Xbox Series X'],
    sku: 'LS49CG954SWXXL',
    description: 'Quantum Dot OLED 49-inch 1800R curved ultra-wide gaming monitor with Neo Quantum Processor Pro, 240Hz refresh rate, 0.03ms (GtG) response time, and VESA DisplayHDR True Black 400.',
    specs: {
      'Screen Size': '49 Inch Curved (32:9 Aspect Ratio)',
      'Resolution': 'Dual QHD (5120 x 1440)',
      'Panel Type': 'QD-OLED',
      'Refresh Rate': '240Hz',
      'Response Time': '0.03ms (GtG)',
      'Sync Tech': 'AMD FreeSync Premium Pro, G-Sync Compatible'
    },
    currentPrice: 114999,
    originalPrice: 149999,
    lowestPrice: 109999,
    averagePrice: 128000,
    highestPrice: 169999,
    dealScore: 93,
    stockStatus: 'In Stock',
    store: 'Amazon',
    updatedAt: '1 hour ago',
    dropPercentage: -23.33,
    watchCount: 1150,
    searchRank: 10,
    rating: 4.8,
    reviewCount: 180,
    allStores: [
      { storeName: 'Amazon', price: 114999, type: 'Physical', stock: 'In Stock', shipping: 'Free White Glove Delivery', updatedAt: '1 hour ago' },
      { storeName: 'Samsung Shop', price: 119999, type: 'Physical', stock: 'In Stock', shipping: 'Free Installation', updatedAt: '2 hours ago' },
      { storeName: 'Croma', price: 122999, type: 'Physical', stock: 'Limited', shipping: 'Free Store Pickup', updatedAt: '4 hours ago' }
    ]
  },
  {
    id: 'p_steam_deck_oled',
    name: 'Valve Steam Deck OLED 512GB Handheld Gaming PC',
    brand: 'Valve',
    category: 'console',
    subCategory: 'Handhelds',
    image: 'https://images.unsplash.com/photo-1612287233207-6b45f49e49a8?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PC'],
    sku: 'V004666-00',
    description: '7.4" 90Hz HDR OLED display, faster 6nm AMD APU, Wi-Fi 6E, and a 50Wh battery delivering 30-50% more game time.',
    currentPrice: 48999,
    originalPrice: 54999,
    lowestPrice: 46999,
    averagePrice: 51200,
    highestPrice: 59999,
    dealScore: 82,
    stockStatus: 'In Stock',
    store: 'Mx2Games',
    updatedAt: '1 hour ago',
    dropPercentage: -10.91,
    watchCount: 2410,
    searchRank: 11,
    rating: 4.9,
    reviewCount: 890,
    allStores: [
      { storeName: 'Mx2Games', price: 48999, type: 'Physical', stock: 'In Stock', shipping: 'Free Express', updatedAt: '1 hour ago' },
      { storeName: 'E2Z Store', price: 49499, type: 'Physical', stock: 'In Stock', shipping: '₹150', updatedAt: '2 hours ago' },
      { storeName: 'Amazon', price: 52999, type: 'Physical', stock: 'Limited', shipping: 'Free Prime', updatedAt: '3 hours ago' }
    ]
  },
  {
    id: 'p_wukong',
    name: 'Black Myth: Wukong',
    brand: 'Game Science',
    category: 'game',
    subCategory: 'PC Games',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600&h=600',
    platform: ['PC', 'PS5'],
    sku: 'BMW-2024-STEAM',
    description: 'An action RPG rooted in Chinese mythology. Set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.',
    currentPrice: 2999,
    originalPrice: 3599,
    lowestPrice: 2699,
    averagePrice: 3350,
    highestPrice: 3599,
    dealScore: 86,
    stockStatus: 'In Stock',
    store: 'Steam',
    updatedAt: '2 hours ago',
    dropPercentage: -16.67,
    watchCount: 3120,
    searchRank: 12,
    rating: 4.9,
    reviewCount: 7800,
    allStores: [
      { storeName: 'Steam', price: 2999, type: 'Digital Code', stock: 'In Stock', shipping: 'Instant Delivery', updatedAt: '2 hours ago' },
      { storeName: 'Epic Games', price: 3059, type: 'Digital Code', stock: 'In Stock', shipping: 'Instant Download', updatedAt: '3 hours ago' },
      { storeName: 'PlayStation Store', price: 3999, type: 'Digital Code', stock: 'In Stock', shipping: 'Instant Download', updatedAt: '4 hours ago' }
    ]
  }
];

export const mockLiveDrops: LiveDropEvent[] = [
  {
    id: 'drop_1',
    product: mockProducts[0], // RTX 5070 Ti
    previousPrice: 89999,
    newPrice: 81499,
    percentageChange: -9.44,
    timestamp: '2 min ago',
    type: 'drop',
    store: 'Amazon'
  },
  {
    id: 'drop_2',
    product: mockProducts[1], // PS5 Slim
    previousPrice: 54990,
    newPrice: 51490,
    percentageChange: -6.36,
    timestamp: '4 min ago',
    type: 'restock',
    store: 'Flipkart'
  },
  {
    id: 'drop_3',
    product: mockProducts[2], // Switch 2
    previousPrice: 49999,
    newPrice: 49999,
    percentageChange: 0,
    timestamp: '8 min ago',
    type: 'restock',
    store: 'Amazon'
  },
  {
    id: 'drop_4',
    product: mockProducts[3], // Elden Ring
    previousPrice: 4999,
    newPrice: 2499,
    percentageChange: -50.01,
    timestamp: '12 min ago',
    type: 'deal',
    store: 'Steam'
  },
  {
    id: 'drop_5',
    product: mockProducts[4], // Ryzen 7 9800X3D
    previousPrice: 48999,
    newPrice: 44999,
    percentageChange: -8.16,
    timestamp: '18 min ago',
    type: 'drop',
    store: 'PrimeABGB'
  },
  {
    id: 'drop_6',
    product: mockProducts[5], // Samsung 990 Pro
    previousPrice: 22999,
    newPrice: 15999,
    percentageChange: -30.43,
    timestamp: '24 min ago',
    type: 'deal',
    store: 'Amazon'
  },
  {
    id: 'drop_7',
    product: mockProducts[8], // Wooting 60HE
    previousPrice: 21999,
    newPrice: 19499,
    percentageChange: -11.36,
    timestamp: '52 min ago',
    type: 'drop',
    store: 'GenesisPC'
  },
  {
    id: 'drop_8',
    product: mockProducts[9], // Samsung OLED G9
    previousPrice: 149999,
    newPrice: 114999,
    percentageChange: -23.33,
    timestamp: '1 hour ago',
    type: 'deal',
    store: 'Amazon'
  }
];

export const mockWatchlist: WatchlistItem[] = [
  {
    id: 'w_1',
    productId: 'p_rtx_5070ti',
    product: mockProducts[0],
    targetPrice: 80000,
    addedAt: '2026-08-10',
    notifyOnDrop: true,
    notifyOnRestock: true
  },
  {
    id: 'w_2',
    productId: 'p_ps5_slim',
    product: mockProducts[1],
    targetPrice: 49990,
    addedAt: '2026-08-11',
    notifyOnDrop: true,
    notifyOnRestock: true
  },
  {
    id: 'w_3',
    productId: 'p_switch_2',
    product: mockProducts[2],
    targetPrice: 49999,
    addedAt: '2026-08-12',
    notifyOnDrop: false,
    notifyOnRestock: true
  },
  {
    id: 'w_4',
    productId: 'p_elden_ring',
    product: mockProducts[3],
    targetPrice: 2500,
    addedAt: '2026-08-01',
    notifyOnDrop: true,
    notifyOnRestock: false
  },
  {
    id: 'w_5',
    productId: 'p_ryzen_9800x3d',
    product: mockProducts[4],
    targetPrice: 43000,
    addedAt: '2026-08-05',
    notifyOnDrop: true,
    notifyOnRestock: true
  }
];

export const mockPriceAlerts: PriceAlert[] = [
  {
    id: 'alt_1',
    productId: 'p_rtx_5070ti',
    productName: 'ASUS TUF Gaming GeForce RTX 5070 Ti 16GB',
    productImage: mockProducts[0].image,
    targetPrice: 80000,
    currentPrice: 81499,
    category: 'pc_hardware',
    store: 'Any Store',
    triggerCondition: 'below_target',
    channels: ['in_app', 'email', 'browser'],
    status: 'active',
    createdAt: '3 days ago'
  },
  {
    id: 'alt_2',
    productId: 'p_elden_ring',
    productName: 'Elden Ring: Shadow of the Erdtree Edition',
    productImage: mockProducts[3].image,
    targetPrice: 2500,
    currentPrice: 2499,
    category: 'game',
    store: 'Steam',
    triggerCondition: 'below_target',
    channels: ['in_app', 'browser'],
    status: 'triggered',
    createdAt: '1 week ago',
    lastTriggeredAt: '12 min ago'
  },
  {
    id: 'alt_3',
    productId: 'p_samsung_oled_g9',
    productName: 'Samsung Odyssey OLED G9 49" 240Hz',
    productImage: mockProducts[9].image,
    targetPrice: 115000,
    currentPrice: 114999,
    category: 'pc_hardware',
    store: 'Amazon',
    triggerCondition: 'below_target',
    channels: ['in_app', 'email'],
    status: 'triggered',
    createdAt: '2 weeks ago',
    lastTriggeredAt: '1 hour ago'
  },
  {
    id: 'alt_4',
    productId: 'p_ryzen_9800x3d',
    productName: 'AMD Ryzen 7 9800X3D Desktop Processor',
    productImage: mockProducts[4].image,
    targetPrice: 42000,
    currentPrice: 44999,
    category: 'pc_hardware',
    store: 'PrimeABGB',
    triggerCondition: 'below_target',
    channels: ['in_app', 'email'],
    status: 'active',
    createdAt: '4 days ago'
  }
];

export const mockRestockAlerts: RestockAlert[] = [
  {
    id: 'rst_1',
    productId: 'p_switch_2',
    productName: 'Nintendo Switch 2 (OLED Display Edition)',
    productImage: mockProducts[2].image,
    currentPrice: 49999,
    store: 'Any Store',
    platform: 'Nintendo',
    status: 'in_stock',
    createdAt: '5 days ago',
    channels: ['in_app', 'email', 'browser']
  },
  {
    id: 'rst_2',
    productId: 'p_ps5_slim',
    productName: 'PlayStation 5 Slim 1TB Disc Edition',
    productImage: mockProducts[1].image,
    currentPrice: 51490,
    store: 'Flipkart',
    platform: 'PS5',
    status: 'in_stock',
    createdAt: '2 days ago',
    channels: ['in_app', 'browser']
  },
  {
    id: 'rst_3',
    productId: 'p_wooting_60he',
    productName: 'Wooting 60HE+ Analog Mechanical Gaming Keyboard',
    productImage: mockProducts[8].image,
    currentPrice: 19499,
    store: 'GenesisPC',
    platform: 'PC',
    status: 'in_stock',
    createdAt: '1 week ago',
    channels: ['in_app', 'email']
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'price_drop',
    title: 'Price Drop Detected',
    message: 'ASUS TUF RTX 5070 Ti 16GB dropped to ₹81,499 (−₹8,500) on Amazon.',
    timestamp: '2 min ago',
    read: false,
    productId: 'p_rtx_5070ti',
    discountPercent: 9.44,
    price: 81499
  },
  {
    id: 'notif_2',
    type: 'restock',
    title: 'Item Restocked',
    message: 'PlayStation 5 Slim 1TB Disc Edition is back in stock at Flipkart for ₹51,490.',
    timestamp: '4 min ago',
    read: false,
    productId: 'p_ps5_slim',
    price: 51490
  },
  {
    id: 'notif_3',
    type: 'target_reached',
    title: 'Target Price Reached',
    message: 'Elden Ring: Shadow of the Erdtree reached your target price of ₹2,500 (Now ₹2,499 on Steam).',
    timestamp: '12 min ago',
    read: false,
    productId: 'p_elden_ring',
    discountPercent: 50.01,
    price: 2499
  },
  {
    id: 'notif_4',
    type: 'deal_alert',
    title: 'Exceptional Deal (Score 92)',
    message: 'Samsung 990 PRO 2TB PCIe 4.0 SSD with Heatsink dropped by 30% to ₹15,999.',
    timestamp: '24 min ago',
    read: true,
    productId: 'p_samsung_990pro',
    discountPercent: 30.43,
    price: 15999
  },
  {
    id: 'notif_5',
    type: 'target_reached',
    title: 'Target Price Reached',
    message: 'Samsung Odyssey OLED G9 49" 240Hz dropped below your ₹1,15,000 threshold to ₹1,14,999.',
    timestamp: '1 hour ago',
    read: true,
    productId: 'p_samsung_oled_g9',
    discountPercent: 23.33,
    price: 114999
  }
];

export function generatePriceHistory(basePrice: number, lowest: number, highest: number, range: string = '30D'): PriceHistoryPoint[] {
  const points: PriceHistoryPoint[] = [];
  let numPoints = 30;
  let intervalDays = 1;

  if (range === '24H') {
    numPoints = 24;
    for (let i = 0; i < 24; i++) {
      const hour = (24 - i);
      const timeStr = `${hour}h ago`;
      const variance = (Math.sin(i / 3) * 0.02);
      const price = Math.round(basePrice * (1 + variance));
      points.unshift({ date: timeStr, price });
    }
    return points;
  }

  if (range === '7D') { numPoints = 7; intervalDays = 1; }
  else if (range === '30D') { numPoints = 30; intervalDays = 1; }
  else if (range === '3M') { numPoints = 45; intervalDays = 2; }
  else if (range === '6M') { numPoints = 60; intervalDays = 3; }
  else if (range === '1Y') { numPoints = 52; intervalDays = 7; }
  else if (range === 'ALL') { numPoints = 70; intervalDays = 10; }

  const now = new Date('2026-08-14T07:00:00Z');
  
  for (let i = numPoints - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * intervalDays * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Simulate natural price trajectory from higher launch to drops and spikes
    const progress = (numPoints - 1 - i) / (numPoints - 1);
    const trend = Math.sin(progress * Math.PI * 3) * ((highest - lowest) * 0.25);
    let price = Math.round(highest - progress * (highest - basePrice) + trend);
    
    if (i === 0) price = basePrice;
    if (price < lowest) price = lowest;
    if (price > highest) price = highest;
    
    const event = i === 1 ? 'drop' : (i === 15 ? 'hike' : undefined);
    points.push({ date: dateStr, price, event });
  }

  return points;
}

export const mockMarketAnalytics = {
  averageHardwareDiscount: 14.8,
  averageGameDiscount: 32.4,
  activeDealsCount: 418,
  priceDropsCount: 247,
  restocksCount: 63,
  marketVolatilityIndex: 'Low (4.2%)',
  averageMarketPrice: 52480,
  weeklyMarketChange: -4.8,
  monthlyMarketChange: -8.2,
  categoryTrends: [
    { name: 'Graphics Cards', weeklyChange: -6.4, discountAvg: 12.2, stockLevel: 'Good (88%)', indexValue: 142 },
    { name: 'Processors', weeklyChange: -4.1, discountAvg: 9.8, stockLevel: 'Moderate (74%)', indexValue: 128 },
    { name: 'SSDs & Storage', weeklyChange: -11.5, discountAvg: 26.4, stockLevel: 'Abundant (96%)', indexValue: 95 },
    { name: 'Gaming Consoles', weeklyChange: -2.3, discountAvg: 5.6, stockLevel: 'Restocked (91%)', indexValue: 110 },
    { name: 'Video Games', weeklyChange: -18.2, discountAvg: 41.5, stockLevel: 'Digital/Instant (100%)', indexValue: 82 },
    { name: 'Keyboards & Mice', weeklyChange: -7.6, discountAvg: 18.0, stockLevel: 'Good (85%)', indexValue: 104 },
  ],
  storeCompetitiveness: [
    { store: 'Amazon', lowestPriceShare: '42.6%', avgShippingSpeed: '1.2 Days', dealFrequency: 'Very High', reliabilityScore: 98 },
    { store: 'Steam', lowestPriceShare: '64.8%', avgShippingSpeed: 'Instant Key', dealFrequency: 'Seasonal Peaks', reliabilityScore: 100 },
    { store: 'MDComputers', lowestPriceShare: '24.2%', avgShippingSpeed: '2.5 Days', dealFrequency: 'High', reliabilityScore: 94 },
    { store: 'Flipkart', lowestPriceShare: '18.4%', avgShippingSpeed: '1.8 Days', dealFrequency: 'Flash Drops', reliabilityScore: 92 },
    { store: 'PrimeABGB', lowestPriceShare: '21.0%', avgShippingSpeed: '2.8 Days', dealFrequency: 'Moderate', reliabilityScore: 95 },
    { store: 'GenesisPC', lowestPriceShare: '35.0%', avgShippingSpeed: '2.1 Days', dealFrequency: 'Specialty Elite', reliabilityScore: 97 },
  ]
};
