import React from 'react';

export const GenomeLogo: React.FC<{ size?: number; color?: string; className?: string }> = ({ 
  size = 32, 
  color = "var(--color-primary)",
  className = ""
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ minWidth: size, minHeight: size }}
    >
      <defs>
        <linearGradient id="genome-grad-1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="genome-grad-2" x1="100" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Outer bounding architectural frame representing the deterministic bounds */}
      <rect x="8" y="8" width="84" height="84" rx="20" stroke={color} strokeWidth="4" fill="none" opacity="0.15" />
      <rect x="16" y="16" width="68" height="68" rx="12" stroke={color} strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="4 4" />
      
      {/* Geometric DNA-like interwoven lattice representing Design DNA */}
      <path d="M 25 75 Q 50 15 75 75" stroke="url(#genome-grad-1)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 25 25 Q 50 85 75 25" stroke="url(#genome-grad-2)" strokeWidth="6" strokeLinecap="round" />
      
      {/* Horizontal connecting nodes representing L1, L2, L3, L4 parameters */}
      <line x1="36" y1="40" x2="64" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
      <line x1="45" y1="50" x2="55" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="1"/>
      <line x1="36" y1="60" x2="64" y2="60" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>

      {/* Decorative technical nodes */}
      <circle cx="8" cy="8" r="4" fill={color} />
      <circle cx="92" cy="92" r="4" fill={color} />
      <circle cx="8" cy="92" r="4" fill={color} opacity="0.4"/>
      <circle cx="92" cy="8" r="4" fill={color} opacity="0.4"/>
    </svg>
  );
};
