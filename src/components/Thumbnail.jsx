import { useEffect, useState } from 'react'
import { getProductImages } from '../utils/images.js'

// Product imagery.
// If a product has a real photo (single `image` or an `images` array placed in
// /public/images), we show it. A specific `src` can be passed to show one chosen
// image (used by the gallery). Otherwise — or if a file is missing — we fall back
// to a dependency-free themed SVG so the catalogue always looks complete.

const THEMES = {
  Engines: { bg: '#1f2a37', accent: '#ef4444' },
  'Engine Parts': { bg: '#243244', accent: '#f59e0b' },
  'Alloy Wheels': { bg: '#2a2f3a', accent: '#60a5fa' },
  'Car Parts': { bg: '#213042', accent: '#34d399' },
}

function EngineIcon({ accent }) {
  return (
    <g fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="60" y="80" width="90" height="70" rx="8" />
      <path d="M150 100 h26 v40 h-26" />
      <path d="M60 95 h-18 v40 h18" />
      <path d="M78 80 v-18 h40 v18" />
      <path d="M92 62 v-14" />
      <circle cx="105" cy="115" r="16" />
    </g>
  )
}

function WheelIcon({ accent }) {
  return (
    <g fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="110" cy="110" r="58" />
      <circle cx="110" cy="110" r="18" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const r = (deg * Math.PI) / 180
        return (
          <line
            key={deg}
            x1={110 + Math.cos(r) * 18}
            y1={110 + Math.sin(r) * 18}
            x2={110 + Math.cos(r) * 56}
            y2={110 + Math.sin(r) * 56}
          />
        )
      })}
    </g>
  )
}

function PartIcon({ accent }) {
  return (
    <g fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="110" cy="110" r="34" />
      <circle cx="110" cy="110" r="12" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180
        return (
          <line
            key={deg}
            x1={110 + Math.cos(r) * 34}
            y1={110 + Math.sin(r) * 34}
            x2={110 + Math.cos(r) * 50}
            y2={110 + Math.sin(r) * 50}
          />
        )
      })}
    </g>
  )
}

function iconFor(category, accent) {
  if (category === 'Engines') return <EngineIcon accent={accent} />
  if (category === 'Alloy Wheels') return <WheelIcon accent={accent} />
  return <PartIcon accent={accent} />
}

function PlaceholderSvg({ product, className }) {
  const theme = THEMES[product.category] || THEMES['Car Parts']
  return (
    <svg
      className={className}
      viewBox="0 0 220 220"
      role="img"
      aria-label={product.name}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`grad-${product.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.bg} />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="220" height="220" fill={`url(#grad-${product.id})`} />
      {iconFor(product.category, theme.accent)}
    </svg>
  )
}

export default function Thumbnail({ product, src, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false)
  const resolved = src ?? getProductImages(product)[0]

  // Re-try when the chosen image changes (e.g. switching gallery thumbnails).
  useEffect(() => {
    setImgFailed(false)
  }, [resolved])

  if (resolved && !imgFailed) {
    return (
      <img
        src={resolved}
        alt={product.name}
        className={className}
        loading="lazy"
        onError={() => setImgFailed(true)}
      />
    )
  }

  return <PlaceholderSvg product={product} className={className} />
}
