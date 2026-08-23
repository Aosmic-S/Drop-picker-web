import React from 'react';
import { NavLink, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  TrendingDown, 
  Compass, 
  Bookmark, 
  Menu
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext';
import { cn } from '@/src/lib/utils';

interface MobileNavProps {
  onOpenSidebar: () => void;
}

export function MobileNav({ onOpenSidebar }: MobileNavProps) {
  const { watchlist, liveDrops } = useApp();
  const location = useLocation();

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Drops',
      path: '/drops',
      icon: TrendingDown,
      badge: liveDrops.length > 0 ? liveDrops.length : null
    },
    {
      name: 'Discover',
      path: '/discover',
      icon: Compass,
      badge: null
    },
    {
      name: 'Watchlist',
      path: '/watchlist',
      icon: Bookmark,
      badge: watchlist.length > 0 ? watchlist.length : null
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-800/90 bg-[#08090B]/95 px-2 backdrop-blur-xl md:hidden pb-safe"
    >
      {navItems.map(item => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors min-h-[44px]",
              isActive ? "text-emerald-400 font-semibold" : "text-gray-400 hover:text-gray-200"
            )}
          >
            <div className="relative">
              <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-400 stroke-[2.2]" : "text-gray-400")} />
              {item.badge !== null && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-black">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">{item.name}</span>
            {isActive && (
              <span className="absolute bottom-0 h-0.5 w-6 rounded-full bg-emerald-400" />
            )}
          </NavLink>
        );
      })}

      {/* Menu / Drawer Trigger */}
      <button
        onClick={onOpenSidebar}
        className="flex flex-1 flex-col items-center justify-center py-1 text-center text-gray-400 hover:text-gray-200 min-h-[44px] transition-colors"
        aria-label="Open Full Navigation Menu"
      >
        <Menu className="h-5 w-5" />
        <span className="text-[10px] tracking-tight mt-1">Menu</span>
      </button>
    </nav>
  );
}
