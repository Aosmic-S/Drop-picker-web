import React from 'react';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  TrendingDown, 
  RefreshCcw, 
  Flame, 
  Tag, 
  Cpu, 
  Gamepad2, 
  MonitorPlay, 
  Headphones, 
  Bookmark, 
  Bell, 
  BellRing, 
  LineChart, 
  BarChart3, 
  Scale, 
  Settings, 
  User, 
  ShieldAlert,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useApp } from '@/src/context/AppContext';
import { Logo } from '@/src/components/common/Logo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { watchlist, priceAlerts, liveDrops } = useApp();

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Live Drops', path: '/drops', icon: TrendingDown, badge: `${liveDrops.length}` },
        { name: 'Restocks', path: '/restocks', icon: RefreshCcw },
        { name: 'Trending', path: '/trending', icon: Flame },
        { name: 'Deals', path: '/deals', icon: Tag },
      ]
    },
    {
      title: 'Discover',
      items: [
        { name: 'PC Hardware', path: '/pc-hardware', icon: Cpu },
        { name: 'Consoles', path: '/consoles', icon: Gamepad2 },
        { name: 'Games', path: '/games', icon: MonitorPlay },
        { name: 'Accessories', path: '/accessories', icon: Headphones },
      ]
    },
    {
      title: 'Track',
      items: [
        { name: 'Watchlist', path: '/watchlist', icon: Bookmark, badge: watchlist.length > 0 ? `${watchlist.length}` : undefined },
        { name: 'Price Alerts', path: '/alerts/price', icon: Bell, badge: priceAlerts.length > 0 ? `${priceAlerts.length}` : undefined },
        { name: 'Restock Alerts', path: '/alerts/restock', icon: BellRing },
        { name: 'Price History', path: '/history', icon: LineChart },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Market Trends', path: '/analytics/market', icon: BarChart3 },
        { name: 'Store Comparison', path: '/analytics/stores', icon: Scale },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Admin Console', path: '/admin', icon: ShieldAlert },
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Account', path: '/profile', icon: User },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-[#08090B] transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800/80 bg-[#0D0F12]">
          <NavLink to="/" onClick={onClose} className="flex items-center group">
            <Logo size="md" />
          </NavLink>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 md:hidden hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Nav list */}
        <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navGroups.map((group, i) => (
            <div key={i}>
              <h2 className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">
                {group.title}
              </h2>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                          isActive
                            ? "bg-gray-800 text-emerald-400 font-semibold"
                            : "text-gray-400 hover:bg-[#12151A] hover:text-gray-200"
                        )
                      }
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Tagline */}
        <div className="border-t border-gray-800/80 p-4 bg-[#0D0F12] flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-400">DROP PICKER</span>
            <span className="text-[10px] text-gray-600">Track the drop. Catch the deal.</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            v2.4
          </div>
        </div>
      </aside>
    </>
  );
}
