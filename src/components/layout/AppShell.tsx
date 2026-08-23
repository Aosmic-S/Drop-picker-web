import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/ToastContainer';
import { CommandPalette } from '../common/CommandPalette';
import { PriceAlertModal } from '../modals/PriceAlertModal';
import { useApp } from '@/src/context/AppContext';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    activeAlertModalProduct, 
    setActiveAlertModalProduct, 
  } = useApp();

  return (
    <div className="min-h-screen bg-[#08090B] text-gray-100 flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex min-h-screen flex-1 flex-col md:pl-64 w-full">
        <TopBar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 px-3 py-4 sm:px-6 md:py-8 lg:px-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav onOpenSidebar={() => setSidebarOpen(true)} />

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
