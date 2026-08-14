import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { TrendingDown, CheckCircle2, RefreshCcw, Bell, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-500/30 bg-[#0D0F12] text-emerald-400';

        if (toast.type === 'drop') {
          Icon = TrendingDown;
          borderClass = 'border-emerald-500/40 bg-[#0D0F12] text-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.15)]';
        } else if (toast.type === 'restock') {
          Icon = RefreshCcw;
          borderClass = 'border-blue-500/40 bg-[#0D0F12] text-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.15)]';
        } else if (toast.type === 'alert') {
          Icon = Bell;
          borderClass = 'border-amber-500/40 bg-[#0D0F12] text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-gray-700 bg-[#0D0F12] text-gray-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-200 ${borderClass}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-gray-100">{toast.title}</h5>
              {toast.message && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
