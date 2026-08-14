export default function Logo({ className = "", textClassName = "text-xl", dark = false }) {
  return (
    <a href="/" className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-9 w-9 drop-shadow-[0_4px_8px_rgba(242,101,34,0.35)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
        fill="none"
      >
        <path
          d="M6 8h4.2c1.9 0 3.5 1.3 3.9 3.1L16 16"
          stroke="#F26522"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M16 16h39.5c2 0 3.4 1.9 2.8 3.8l-5.4 17.4a4 4 0 0 1-3.8 2.8H24.6a4 4 0 0 1-3.9-3.1L16 16Z"
          fill="#F26522"
          opacity="0.14"
        />
        <path
          d="M16 16h39.5c2 0 3.4 1.9 2.8 3.8l-5.4 17.4a4 4 0 0 1-3.8 2.8H24.6a4 4 0 0 1-3.9-3.1L16 16Z"
          stroke="#F26522"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
        <rect x="26" y="16" width="18" height="24" rx="3" fill="#F26522" />
        <rect x="32" y="20" width="6" height="16" rx="1.4" fill="white" />
        <rect x="27" y="25" width="16" height="6" rx="1.4" fill="white" />
        <circle cx="26" cy="52" r="4" fill="#F26522" />
        <circle cx="46" cy="52" r="4" fill="#F26522" />
        <path d="M21.5 44h27" stroke="#F26522" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
      <span className={`${textClassName} font-extrabold tracking-tight`}>
        <span className={dark ? "text-white" : "text-navy"}>MED</span>
        <span className="text-orange">-MART</span>
      </span>
    </a>
  );
}
