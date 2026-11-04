import React, { useState } from 'react';

interface InitialsAvatarProps {
  firstName: string;
  lastInitial?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  avatarUrl?: string;
  className?: string;
}

const PERSONA_AVATAR_MAP: Record<string, string> = {
  // Career Guides
  arjun: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  vikram: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  dev: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  marcus: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  ananya: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  elena: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  karthik: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  meera: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  tobias: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  rachel: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  omar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  neha: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  // Pod Members & Switchers
  anand: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  claire: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  rohit: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  priya: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  mira: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  james: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  simran: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  david: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  bharat: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  varun: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  jatin: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  astha: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
};

const FALLBACK_PORTRAIT_POOL = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=faces&auto=format&q=80',
];

function getPersonaImageUrl(firstName: string, explicitUrl?: string): string {
  if (explicitUrl) return explicitUrl;
  const normalized = (firstName || '').trim().toLowerCase().split(/\s+/)[0] || 'user';
  if (PERSONA_AVATAR_MAP[normalized]) {
    return PERSONA_AVATAR_MAP[normalized];
  }
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) % FALLBACK_PORTRAIT_POOL.length;
  }
  return FALLBACK_PORTRAIT_POOL[Math.abs(hash) % FALLBACK_PORTRAIT_POOL.length];
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  firstName,
  lastInitial,
  size = 'md',
  bgColor,
  avatarUrl,
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const f = (firstName || 'P').trim()[0]?.toUpperCase() || 'P';
  const l = (lastInitial || '').replace(/[^a-zA-Z]/g, '')[0]?.toUpperCase() || '';
  const initials = `${f}${l}`;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-medium',
    xl: 'w-16 h-16 text-xl font-medium',
  }[size];

  const defaultBg = bgColor || '#102A2E';
  const resolvedPhotoUrl = getPersonaImageUrl(firstName, avatarUrl);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full text-white shrink-0 select-none overflow-hidden border border-[#D3DDD8] dark:border-[#2A403C] ${sizeClasses} ${className}`}
      style={{ backgroundColor: defaultBg }}
      aria-label={`${firstName} ${lastInitial || ''}`}
    >
      {!imgFailed && resolvedPhotoUrl ? (
        <img
          src={resolvedPhotoUrl}
          alt={`${firstName} ${lastInitial || ''}`.trim()}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="leading-none tracking-tight">{initials}</span>
      )}
    </div>
  );
};
