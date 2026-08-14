import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { LiveDropsPage } from './pages/LiveDropsPage';
import { RestocksPage } from './pages/RestocksPage';
import { TrendingPage } from './pages/TrendingPage';
import { DealsPage } from './pages/DealsPage';
import { Discover } from './pages/Discover';
import { WatchlistPage } from './pages/WatchlistPage';
import { PriceAlertsPage } from './pages/PriceAlertsPage';
import { RestockAlertsPage } from './pages/RestockAlertsPage';
import { PriceHistoryPage } from './pages/PriceHistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { ProductDetail } from './pages/ProductDetail';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/drops" element={<LiveDropsPage />} />
            <Route path="/restocks" element={<RestocksPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/deals" element={<DealsPage />} />
            
            {/* Discover Category Routes */}
            <Route path="/pc-hardware" element={<Discover />} />
            <Route path="/consoles" element={<Discover />} />
            <Route path="/games" element={<Discover />} />
            <Route path="/accessories" element={<Discover />} />
            <Route path="/discover" element={<Discover />} />

            {/* Tracking Routes */}
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/alerts/price" element={<PriceAlertsPage />} />
            <Route path="/alerts/restock" element={<RestockAlertsPage />} />
            <Route path="/history" element={<PriceHistoryPage />} />
            
            {/* Analytics Routes */}
            <Route path="/analytics/market" element={<PriceHistoryPage />} />
            <Route path="/analytics/stores" element={<PriceHistoryPage />} />

            {/* System & Utility Routes */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Product Details */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
