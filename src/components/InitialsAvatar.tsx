import React from 'react';

interface InitialsAvatarProps {
  firstName: string;
  lastInitial?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  className?: string;
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  firstName,
  lastInitial,
  size = 'md',
  bgColor,
  className = '',
}) => {
  const f = (firstName || 'P').trim()[0]?.toUpperCase() || 'P';
  const l = (lastInitial || '').replace(/[^a-zA-Z]/g, '')[0]?.toUpperCase() || '';
  const initials = `${f}${l}`;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-medium',
    xl: 'w-16 h-16 text-xl font-medium',
  }[size];

  // Calm muted background tokens
  const defaultBg = bgColor || '#102A2E';

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full text-white shrink-0 select-none ${sizeClasses} ${className}`}
      style={{ backgroundColor: defaultBg }}
      aria-label={`${firstName} ${lastInitial || ''}`}
    >
      <span className="leading-none tracking-tight">{initials}</span>
    </div>
  );
};
