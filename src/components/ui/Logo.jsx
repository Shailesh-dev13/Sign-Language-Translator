// src/components/ui/Logo.jsx
export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-label="Signa AI logo"
      role="img"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00D2FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#9D4EDD', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path
        d="M30 70 L30 40 Q30 30 40 30 L40 60 M50 20 L50 60 M60 25 L60 60 M70 35 L70 65"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      <circle cx="50" cy="50" r="35" fill="none" stroke="url(#logoGrad)" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
      <circle cx="30" cy="40" r="2" fill="#00D2FF" />
      <circle cx="50" cy="20" r="2" fill="#00D2FF" />
      <circle cx="60" cy="25" r="2" fill="#9D4EDD" />
      <circle cx="70" cy="35" r="2" fill="#9D4EDD" />
    </svg>
  );
}
