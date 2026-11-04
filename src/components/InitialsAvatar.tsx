import React, { useState } from 'react';

interface InitialsAvatarProps {
  firstName: string;
  lastInitial?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  avatarUrl?: string;
  className?: string;
}

interface PersonaVisualSpec {
  photoUrl: string;
  gender: 'male' | 'female';
  bg: string;
  skin: string;
  hair: string;
  shirt: string;
  glasses?: boolean;
  beard?: boolean;
}

const PERSONA_SPECS: Record<string, PersonaVisualSpec> = {
  // Career Guides
  arjun: {
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    gender: 'male',
    bg: '#1E463A',
    skin: '#D99B72',
    hair: '#1C1B18',
    shirt: '#102A2E',
    beard: true,
  },
  vikram: {
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    gender: 'male',
    bg: '#1B3B4B',
    skin: '#D1946A',
    hair: '#181818',
    shirt: '#2F7D5B',
    glasses: true,
  },
  sarah: {
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    gender: 'female',
    bg: '#2D5A7B',
    skin: '#F2C2A5',
    hair: '#5A3825',
    shirt: '#102A2E',
  },
  dev: {
    photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
    gender: 'male',
    bg: '#2B3A42',
    skin: '#C98A63',
    hair: '#1A1A1A',
    shirt: '#8A5A00',
  },
  marcus: {
    photoUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    gender: 'male',
    bg: '#5C4028',
    skin: '#8D5524',
    hair: '#141414',
    shirt: '#1B4D3E',
    beard: true,
  },
  ananya: {
    photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    gender: 'female',
    bg: '#215746',
    skin: '#D99B72',
    hair: '#1A1817',
    shirt: '#8A5A00',
  },
  elena: {
    photoUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
    gender: 'female',
    bg: '#2C5E7A',
    skin: '#F3C6AA',
    hair: '#3A2314',
    shirt: '#2F7D5B',
  },
  karthik: {
    photoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    gender: 'male',
    bg: '#1A3636',
    skin: '#C6865E',
    hair: '#141414',
    shirt: '#2D6B8F',
    glasses: true,
  },
  meera: {
    photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    gender: 'female',
    bg: '#2A634C',
    skin: '#D69A72',
    hair: '#1C1A17',
    shirt: '#102A2E',
  },
  tobias: {
    photoUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
    gender: 'male',
    bg: '#28526E',
    skin: '#F0C0A3',
    hair: '#6B4423',
    shirt: '#102A2E',
    glasses: true,
  },
  rachel: {
    photoUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
    gender: 'female',
    bg: '#1F3A3D',
    skin: '#F1C2A6',
    hair: '#7A4228',
    shirt: '#2F7D5B',
  },
  omar: {
    photoUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
    gender: 'male',
    bg: '#694614',
    skin: '#D79A73',
    hair: '#1A1816',
    shirt: '#102A2E',
    beard: true,
  },
  neha: {
    photoUrl: 'https://randomuser.me/api/portraits/women/49.jpg',
    gender: 'female',
    bg: '#2A5C4A',
    skin: '#D89B74',
    hair: '#1A1817',
    shirt: '#2D6B8F',
  },
  // Pod Members & Switchers
  anand: {
    photoUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
    gender: 'male',
    bg: '#235946',
    skin: '#D3956C',
    hair: '#181715',
    shirt: '#102A2E',
  },
  claire: {
    photoUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
    gender: 'female',
    bg: '#2A5B7C',
    skin: '#F4C8AE',
    hair: '#6E472B',
    shirt: '#2F7D5B',
  },
  rohit: {
    photoUrl: 'https://randomuser.me/api/portraits/men/41.jpg',
    gender: 'male',
    bg: '#6E4B16',
    skin: '#CD8E66',
    hair: '#151515',
    shirt: '#102A2E',
    glasses: true,
  },
  priya: {
    photoUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
    gender: 'female',
    bg: '#1A3E44',
    skin: '#D69870',
    hair: '#1B1918',
    shirt: '#8A5A00',
  },
  mira: {
    photoUrl: 'https://randomuser.me/api/portraits/women/54.jpg',
    gender: 'female',
    bg: '#245E49',
    skin: '#D89A72',
    hair: '#181615',
    shirt: '#2D6B8F',
  },
  james: {
    photoUrl: 'https://randomuser.me/api/portraits/men/62.jpg',
    gender: 'male',
    bg: '#275473',
    skin: '#F0BFA2',
    hair: '#4A3121',
    shirt: '#102A2E',
  },
  simran: {
    photoUrl: 'https://randomuser.me/api/portraits/women/37.jpg',
    gender: 'female',
    bg: '#1A3A3F',
    skin: '#DC9F78',
    hair: '#1A1816',
    shirt: '#2F7D5B',
  },
  david: {
    photoUrl: 'https://randomuser.me/api/portraits/men/83.jpg',
    gender: 'male',
    bg: '#7A3826',
    skin: '#EFC0A4',
    hair: '#3B281B',
    shirt: '#102A2E',
  },
  bharat: {
    photoUrl: 'https://randomuser.me/api/portraits/men/29.jpg',
    gender: 'male',
    bg: '#102A2E',
    skin: '#D5986F',
    hair: '#161616',
    shirt: '#2F7D5B',
  },
  varun: {
    photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
    gender: 'male',
    bg: '#234F68',
    skin: '#D4966D',
    hair: '#1A1A1A',
    shirt: '#102A2E',
  },
  jatin: {
    photoUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
    gender: 'male',
    bg: '#2B5B4A',
    skin: '#D1936B',
    hair: '#161616',
    shirt: '#102A2E',
  },
  astha: {
    photoUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    gender: 'female',
    bg: '#2D6B8F',
    skin: '#DC9E76',
    hair: '#1B1917',
    shirt: '#102A2E',
  },
};

const FALLBACK_SPECS: PersonaVisualSpec[] = [
  {
    photoUrl: 'https://randomuser.me/api/portraits/men/34.jpg',
    gender: 'male',
    bg: '#1F4B3F',
    skin: '#D5986F',
    hair: '#1A1A1A',
    shirt: '#102A2E',
  },
  {
    photoUrl: 'https://randomuser.me/api/portraits/women/42.jpg',
    gender: 'female',
    bg: '#2A5978',
    skin: '#E5AE8C',
    hair: '#2B1D14',
    shirt: '#2F7D5B',
  },
  {
    photoUrl: 'https://randomuser.me/api/portraits/men/48.jpg',
    gender: 'male',
    bg: '#28495C',
    skin: '#CFA68A',
    hair: '#221A15',
    shirt: '#8A5A00',
    glasses: true,
  },
  {
    photoUrl: 'https://randomuser.me/api/portraits/women/57.jpg',
    gender: 'female',
    bg: '#5B4224',
    skin: '#D89B74',
    hair: '#181615',
    shirt: '#102A2E',
  },
];

function resolvePersonaSpec(firstName: string, explicitUrl?: string): PersonaVisualSpec {
  const normalized = (firstName || '').trim().toLowerCase().split(/\s+/)[0] || 'user';
  if (PERSONA_SPECS[normalized]) {
    return explicitUrl
      ? { ...PERSONA_SPECS[normalized], photoUrl: explicitUrl }
      : PERSONA_SPECS[normalized];
  }
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) % FALLBACK_SPECS.length;
  }
  const spec = FALLBACK_SPECS[Math.abs(hash) % FALLBACK_SPECS.length];
  return explicitUrl ? { ...spec, photoUrl: explicitUrl } : spec;
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

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-medium',
    xl: 'w-16 h-16 text-xl font-medium',
  }[size];

  const spec = resolvePersonaSpec(firstName, avatarUrl);
  const background = bgColor || spec.bg;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none overflow-hidden border border-[#D3DDD8] dark:border-[#2A403C] shadow-2xs ${sizeClasses} ${className}`}
      style={{ backgroundColor: background }}
      aria-label={`${firstName} ${lastInitial || ''}`.trim()}
      title={`${firstName} ${lastInitial || ''}`.trim()}
    >
      {/* Always-present illustrated human persona portrait SVG underneath (instant render & offline-proof) */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        aria-hidden="true"
      >
        <rect width="100" height="100" fill={background} />
        {/* Shoulders / Suit */}
        <path
          d="M16 100 C16 74, 84 74, 84 100 Z"
          fill={spec.shirt}
        />
        {/* Shirt collar V */}
        <polygon points="42,78 58,78 50,92" fill="#FFFFFF" opacity="0.9" />
        {/* Neck */}
        <rect x="43" y="60" width="14" height="18" rx="5" fill={spec.skin} />
        {/* Back hair for female persona */}
        {spec.gender === 'female' && (
          <path
            d="M24 44 C22 65, 28 76, 35 76 L65 76 C72 76, 78 65, 76 44 Z"
            fill={spec.hair}
          />
        )}
        {/* Ears */}
        <circle cx="29" cy="48" r="5" fill={spec.skin} />
        <circle cx="71" cy="48" r="5" fill={spec.skin} />
        {/* Head */}
        <ellipse cx="50" cy="46" rx="21" ry="24" fill={spec.skin} />
        {/* Hair top */}
        {spec.gender === 'female' ? (
          <path
            d="M28 44 C28 22, 72 22, 72 44 C66 32, 52 29, 38 35 C33 37, 30 41, 28 44 Z"
            fill={spec.hair}
          />
        ) : (
          <path
            d="M29 41 C28 21, 72 21, 71 41 C67 31, 33 31, 29 41 Z"
            fill={spec.hair}
          />
        )}
        {/* Eyes */}
        <circle cx="42" cy="46" r="2.3" fill="#1A1A1A" />
        <circle cx="58" cy="46" r="2.3" fill="#1A1A1A" />
        {/* Eyebrows */}
        <path
          d="M37 41 Q42 39 46 41"
          stroke={spec.hair}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M54 41 Q58 39 63 41"
          stroke={spec.hair}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Optional Glasses */}
        {spec.glasses && (
          <g stroke="#102A2E" strokeWidth="1.8" fill="none">
            <rect x="35" y="42" width="13" height="9" rx="2.5" />
            <rect x="52" y="42" width="13" height="9" rx="2.5" />
            <line x1="48" y1="46" x2="52" y2="46" />
          </g>
        )}
        {/* Optional Beard */}
        {spec.beard && (
          <path
            d="M31 52 C33 67, 67 67, 69 52 C65 61, 35 61, 31 52 Z"
            fill={spec.hair}
            opacity="0.75"
          />
        )}
        {/* Warm Smile */}
        <path
          d="M43 56 Q50 62 57 56"
          stroke="#6E3B28"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Realistic human portrait photo overlay */}
      {!imgFailed && spec.photoUrl && (
        <img
          src={spec.photoUrl}
          alt={`${firstName} ${lastInitial || ''}`.trim()}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      )}
    </div>
  );
};
