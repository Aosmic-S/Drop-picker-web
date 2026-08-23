import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const svgSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimalist Geometric Drop Mark */}
      <div 
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/60 shadow-sm group-hover:border-emerald-500/50 transition-all duration-200 overflow-hidden`}
        style={{
          boxShadow: '0 2px 8px -1px var(--color-accent-glow, rgba(16,185,129,0.2))'
        }}
      >
        {/* Subtle interior glow */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{ backgroundColor: 'var(--color-accent, #10B981)' }}
        />
        
        {/* Minimalist Precision Drop Icon */}
        <svg
          width={svgSizes[size]}
          height={svgSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Top minimal bar */}
          <path
            d="M5 6H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-gray-400"
          />
          {/* Clean descending sharp chevron drop */}
          <path
            d="M7 11L12 16L17 11"
            stroke="var(--color-accent, #10B981)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Target precision drop point */}
          <circle
            cx="12"
            cy="19"
            r="1.25"
            fill="var(--color-accent, #10B981)"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-sm font-black tracking-wider uppercase text-gray-100 font-mono">
              DROP
            </span>
            <span 
              className="text-sm font-semibold tracking-wider uppercase font-mono"
              style={{ color: 'var(--color-accent, #10B981)' }}
            >
              PICKER
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-medium mt-0.5">
            Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
