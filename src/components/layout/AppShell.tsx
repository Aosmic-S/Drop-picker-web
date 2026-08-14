import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastContainer } from '../common/ToastContainer';
import { CommandPalette } from '../common/CommandPalette';
import { PriceAlertModal } from '../modals/PriceAlertModal';
import { useApp } from '@/src/context/AppContext';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeAlertModalProduct, setActiveAlertModalProduct } = useApp();

  return (
    <div className="min-h-screen bg-[#08090B] text-gray-100 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <TopBar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
      <CommandPalette />
      
      {activeAlertModalProduct && (
        <PriceAlertModal
          product={activeAlertModalProduct}
          onClose={() => setActiveAlertModalProduct(null)}
        />
      )}
    </div>
  );
}
