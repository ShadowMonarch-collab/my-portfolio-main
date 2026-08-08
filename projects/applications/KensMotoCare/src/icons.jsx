import React from 'react';

// Hand-drawn 24px stroke icon set — one consistent weight, currentColor,
// replaces the mockup's emojis so status colors tint the glyphs.
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

const GLYPHS = {
  oil: <path d="M12 3.2c3.4 4 5.8 6.9 5.8 9.8a5.8 5.8 0 1 1-11.6 0c0-2.9 2.4-5.8 5.8-9.8z" />,
  gear: <><circle cx="12" cy="12" r="3.1" /><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M18.5 5.5l-1.9 1.9M7.4 16.6l-1.9 1.9" /></>,
  cvt: <><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M17.8 2.8v3.6h3.6" /></>,
  air: <path d="M3 8h9.5a2.4 2.4 0 1 0-2.4-2.4M3 12.2h13.5a2.4 2.4 0 1 1-2.4 2.4M3 16.4h6.5a2.2 2.2 0 1 1-2.2 2.2" />,
  spark: <path d="M13.2 2.5L5.5 13.2h5l-1.7 8.3 7.7-10.7h-5l1.7-8.3z" />,
  throttle: <><path d="M9.5 7V4.8h5V7" /><rect x="7.6" y="7" width="8.8" height="13" rx="2" /><path d="M10.5 11h3M4.5 4.5l1.4 1.4M3.2 8h2M4.5 11.5l1.4-1.4" /></>,
  pads: <><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="2.6" /><path d="M12 6.2v1.6M12 16.2v1.6M6.2 12h1.6M16.2 12h1.6" /></>,
  shoes: <><circle cx="12" cy="12" r="8.2" /><path d="M8.2 8.6a4.9 4.9 0 0 0 0 6.8M15.8 8.6a4.9 4.9 0 0 1 0 6.8" /></>,
  susp: <path d="M12 2.8v2.7M8.5 5.5h7M9 5.5l6 2.6-6 2.6 6 2.6-6 2.6 6 2.6M12 18.5v2.7" />,
  battery: <><rect x="3.5" y="8" width="17" height="11" rx="2" /><path d="M7.5 8V5.8M16.5 8V5.8M6.8 13.5h3.4M8.5 11.8v3.4M14 13.5h3.4" /></>,
  vbelt: <><circle cx="6.3" cy="12" r="2.7" /><circle cx="17.7" cy="12" r="2.7" /><path d="M6.3 9.3h11.4M6.3 14.7h11.4" /></>,
  engine: <><rect x="7.8" y="4" width="8.4" height="5.6" rx="1.2" /><path d="M10 2.5h4M10.4 9.6v3.4h3.2V9.6" /><circle cx="12" cy="17.4" r="2.9" /></>,
  wrench: <path d="M14.9 6.2a4.3 4.3 0 0 0-5.7 5.7L3.4 17.7l2.9 2.9 5.8-5.8a4.3 4.3 0 0 0 5.7-5.7l-2.7 2.7-2.5-.9-.9-2.5 2.7-2.7z" />,
  camera: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M8.5 7l1.5-2.5h4L15.5 7" /><circle cx="12" cy="13.3" r="3.4" /></>,
  check: <path d="M4.5 12.5l4.8 4.8L19.5 6.5" />
};

const CAT_TO_GLYPH = {
  Engine: 'engine', Transmission: 'gear', CVT: 'vbelt',
  Brakes: 'pads', Suspension: 'susp', Electrical: 'battery'
};

// Brand logo mark — the same wrench badge used for the app/home-screen icon,
// as a cyan gradient tile for use in an inline logo lockup.
export function LogoMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="mcLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5FCBFA" />
          <stop offset="1" stopColor="#2FA8E0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#mcLogoGrad)" />
      <g transform="translate(20 20) scale(1.3) translate(-11.4 -13.4)" fill="#08131E">
        <path d="M14.9 6.2a4.3 4.3 0 0 0-5.7 5.7L3.4 17.7l2.9 2.9 5.8-5.8a4.3 4.3 0 0 0 5.7-5.7l-2.7 2.7-2.5-.9-.9-2.5 2.7-2.7z" />
      </g>
    </svg>
  );
}

export function Icon({ glyph, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...STROKE} aria-hidden="true" style={{ display: 'block' }}>
      {GLYPHS[glyph] || GLYPHS.wrench}
    </svg>
  );
}
export function ItemIcon({ id, size = 20 }) { return <Icon glyph={id} size={size} />; }
export function CatIcon({ name, size = 18 }) { return <Icon glyph={CAT_TO_GLYPH[name]} size={size} />; }
