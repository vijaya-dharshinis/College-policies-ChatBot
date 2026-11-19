import React from 'react';

// Sri Krishna University Crest
export const SkuCrest = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer golden laurel wreath */}
    <circle cx="50" cy="50" r="46" stroke="#EAB308" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.7"/>
    {/* Laurel branches */}
    <path d="M18 64C14 52 16 34 26 24C28 29 27 38 31 43" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M82 64C86 52 84 34 74 24C72 29 73 38 69 43" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M22 75C28 85 40 88 50 88C60 88 72 85 78 75" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Inner Shield */}
    <path d="M30 26H70V54C70 68 50 78 50 78C50 78 30 68 30 54V26Z" fill="#1E255E" stroke="#F59E0B" strokeWidth="2.5"/>
    {/* Open Book in Shield */}
    <path d="M38 48C43 45 47 46 50 49C53 46 57 45 62 48V60C57 57 53 58 50 61C47 58 43 57 38 60V48Z" fill="#FFFFFF"/>
    <line x1="50" y1="49" x2="50" y2="61" stroke="#1E255E" strokeWidth="1.5"/>
    {/* Star above book */}
    <polygon points="50,34 52,39 57,39 53,42 55,47 50,44 45,47 47,42 43,39 48,39" fill="#FBBF24"/>
  </svg>
);

// SKU Robot Mascot with Graduate Cap & Blue Book
export const RobotMascot = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sparkles around mascot */}
    <path d="M25 45L27 49L31 51L27 53L25 57L23 53L19 51L23 49L25 45Z" fill="#FBBF24"/>
    <path d="M140 35L141.5 38L144.5 39.5L141.5 41L140 44L138.5 41L135.5 39.5L138.5 38L140 35Z" fill="#F59E0B"/>
    <circle cx="138" cy="80" r="2.5" fill="#60A5FA"/>

    {/* Robot Head Outer */}
    <rect x="42" y="44" width="76" height="66" rx="28" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
    {/* Head shadow / bevel */}
    <path d="M46 72C46 56 58 46 74 46H86C102 46 114 56 114 72" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round"/>

    {/* Blue Face Screen */}
    <rect x="52" y="56" width="56" height="42" rx="16" fill="#1E255E"/>

    {/* Cheerful Smiling Eyes */}
    <path d="M62 76C63 71 69 71 70 76" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M90 76C91 71 97 71 98 76" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round"/>
    
    {/* Friendly mouth */}
    <path d="M76 86C78 88 82 88 84 86" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round"/>

    {/* Head Ear Nodes / Antenna */}
    <circle cx="38" cy="77" r="6" fill="#4F46E5"/>
    <circle cx="38" cy="77" r="2.5" fill="#93C5FD"/>
    <circle cx="122" cy="77" r="6" fill="#4F46E5"/>
    <circle cx="122" cy="77" r="2.5" fill="#93C5FD"/>

    {/* Graduation Cap (Mortarboard) */}
    <g transform="translate(18, 12)">
      {/* Cap Skull cap */}
      <path d="M50 32C50 28 74 28 74 32V36C74 39 50 39 50 36V32Z" fill="#1E2238"/>
      {/* Rhombus Diamond Top */}
      <polygon points="62,12 104,26 62,38 20,26" fill="#1E255E" stroke="#374151" strokeWidth="1.5"/>
      <polygon points="62,14 100,26 62,36 24,26" fill="#2E3875"/>
      {/* Button & Golden Tassel */}
      <circle cx="62" cy="26" r="3" fill="#F59E0B"/>
      <path d="M62 26C68 28 76 34 78 44" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="78" cy="46" r="2.5" fill="#D97706"/>
    </g>

    {/* Robot Body */}
    <rect x="54" y="112" width="52" height="36" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2"/>

    {/* Blue Book in Robot Hands */}
    <g transform="translate(50, 102)">
      {/* Open Book Left & Right Page */}
      <path d="M10 12C18 8 28 9 30 14V34C28 29 18 28 10 32V12Z" fill="#2563EB"/>
      <path d="M50 12C42 8 32 9 30 14V34C32 29 42 28 50 32V12Z" fill="#1D4ED8"/>
      {/* White page liners */}
      <path d="M12 14C19 11 27 12 29 16" stroke="#93C5FD" strokeWidth="1.5"/>
      <path d="M48 14C41 11 33 12 31 16" stroke="#93C5FD" strokeWidth="1.5"/>
      {/* Little robot hands holding the book */}
      <circle cx="8" cy="26" r="5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5"/>
      <circle cx="52" cy="26" r="5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5"/>
    </g>
  </svg>
);

// Calendar & Clock Card Illustration (from screenshot)
export const CalendarIllustration = ({ className = "w-28 h-28" }) => (
  <svg className={className} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Soft warm glow background container */}
    <rect x="10" y="10" width="120" height="120" rx="24" fill="#FEF3C7" fillOpacity="0.6"/>
    
    {/* Sparkles */}
    <path d="M100 22L102 26L106 28L102 30L100 34L98 30L94 28L98 26L100 22Z" fill="#FBBF24"/>
    <path d="M26 40L27 42L29 43L27 44L26 46L25 44L23 43L25 42L26 40Z" fill="#F59E0B"/>

    {/* Calendar Base */}
    <rect x="28" y="32" width="62" height="64" rx="12" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2.5"/>
    <path d="M28 44C28 37.3726 33.3726 32 40 32H78C84.6274 32 90 37.3726 90 44V48H28V44Z" fill="#3B82F6"/>

    {/* Calendar spiral rings */}
    <rect x="40" y="26" width="6" height="12" rx="3" fill="#1E3A8A"/>
    <rect x="72" y="26" width="6" height="12" rx="3" fill="#1E3A8A"/>

    {/* Calendar Checkmarks */}
    <path d="M38 58L42 62L48 56" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M54 58L58 62L64 56" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 72L42 76L48 70" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M54 72L58 76L64 70" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Clock overlapping bottom right */}
    <circle cx="88" cy="88" r="24" fill="#FFFFFF" stroke="#1E255E" strokeWidth="4"/>
    <circle cx="88" cy="88" r="3" fill="#1E255E"/>
    <line x1="88" y1="88" x2="88" y2="74" stroke="#1E255E" strokeWidth="3" strokeLinecap="round"/>
    <line x1="88" y1="88" x2="98" y2="88" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Glowing Open Book for Sidebar Bottom (from screenshot)
export const GlowingBook = ({ className = "w-36 h-28" }) => (
  <svg className={className} viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Upward golden glowing rays */}
    <defs>
      <linearGradient id="glowGrad" x1="80" y1="90" x2="80" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8"/>
        <stop offset="50%" stopColor="#C084FC" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="bookCoverGrad" x1="80" y1="60" x2="80" y2="95" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F46E5"/>
        <stop offset="100%" stopColor="#1E1B4B"/>
      </linearGradient>
    </defs>

    {/* Light cone */}
    <polygon points="80,75 140,10 20,10" fill="url(#glowGrad)"/>

    {/* Magical floating stars/sparkles */}
    <polygon points="80,18 82,23 87,24 82,27 80,32 78,27 73,24 78,23" fill="#FEF08A"/>
    <polygon points="50,28 51.5,31.5 55,32.5 51.5,34.5 50,38 48.5,34.5 45,32.5 48.5,31.5" fill="#FDE047"/>
    <polygon points="112,25 113.5,28 117,29 113.5,31 112,34 110.5,31 107,29 110.5,28" fill="#FDE047"/>
    <circle cx="95" cy="35" r="2" fill="#E9D5FF"/>
    <circle cx="68" cy="40" r="1.5" fill="#E0F2FE"/>

    {/* Open Book Cover & Spine */}
    <path d="M22 84C42 78 72 79 80 88C88 79 118 78 138 84V94C118 88 88 89 80 98C72 89 42 88 22 94V84Z" fill="url(#bookCoverGrad)"/>

    {/* Open Book Pages (Multi-tiered) */}
    <path d="M26 80C44 74 72 75 80 83C88 75 116 74 134 80V87C116 81 88 82 80 90C72 82 44 81 26 87V80Z" fill="#F1F5F9"/>
    <path d="M28 75C46 69 72 70 80 78C88 70 114 69 132 75V82C114 76 88 77 80 85C72 77 46 76 28 82V75Z" fill="#FFFFFF"/>

    {/* Golden/Purple Magic Feather Quill */}
    <g transform="translate(100, 48) rotate(-35)">
      <path d="M12 0C18 10 20 32 14 44C12 40 10 26 6 18C10 14 11 6 12 0Z" fill="#E879F9"/>
      <path d="M14 44L15 49L12 46L14 44Z" fill="#F59E0B"/>
      <line x1="12" y1="2" x2="14" y2="46" stroke="#FDE047" strokeWidth="1.2"/>
    </g>
  </svg>
);

// Campus Neoclassical Building Silhouette for Header Background
export const CampusHeaderArt = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 500 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="campusSky" x1="250" y1="0" x2="250" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    <rect width="500" height="120" fill="url(#campusSky)"/>

    {/* Soft cherry blossoms / trees on side */}
    <circle cx="460" cy="40" r="28" fill="#FBCFE8" fillOpacity="0.5"/>
    <circle cx="485" cy="55" r="22" fill="#F472B6" fillOpacity="0.3"/>
    <circle cx="435" cy="65" r="18" fill="#F9A8D4" fillOpacity="0.4"/>
    <circle cx="35" cy="45" r="25" fill="#FBCFE8" fillOpacity="0.35"/>

    {/* Central Dome & Columns University Building */}
    <g opacity="0.65" transform="translate(140, 20)">
      {/* Dome */}
      <path d="M100 35C100 20 115 10 125 10C135 10 150 20 150 35H100Z" fill="#94A3B8"/>
      <rect x="122" y="4" width="6" height="7" fill="#64748B"/>
      <line x1="125" y1="0" x2="125" y2="5" stroke="#EAB308" strokeWidth="2"/>

      {/* Main Pediment Triangle */}
      <polygon points="125,32 80,48 170,48" fill="#CBD5E1"/>

      {/* Building Block */}
      <rect x="60" y="48" width="130" height="52" fill="#E2E8F0"/>
      <rect x="0" y="58" width="60" height="42" fill="#F1F5F9"/>
      <rect x="190" y="58" width="60" height="42" fill="#F1F5F9"/>

      {/* Columns */}
      <rect x="88" y="48" width="6" height="42" fill="#94A3B8"/>
      <rect x="108" y="48" width="6" height="42" fill="#94A3B8"/>
      <rect x="136" y="48" width="6" height="42" fill="#94A3B8"/>
      <rect x="156" y="48" width="6" height="42" fill="#94A3B8"/>

      {/* Arched Central Entrance */}
      <path d="M112 90V74C112 68 138 68 138 74V90H112Z" fill="#475569"/>

      {/* Windows row */}
      <rect x="10" y="65" width="8" height="12" rx="2" fill="#94A3B8"/>
      <rect x="26" y="65" width="8" height="12" rx="2" fill="#94A3B8"/>
      <rect x="42" y="65" width="8" height="12" rx="2" fill="#94A3B8"/>
      <rect x="200" y="65" width="8" height="12" rx="2" fill="#94A3B8"/>
      <rect x="216" y="65" width="8" height="12" rx="2" fill="#94A3B8"/>
      <rect x="232" y="65" width="8" height="12" rx="2" fill="#94A3B8"/>
    </g>
  </svg>
);

// Graduation Cap for bottom right decoration
export const GraduationCapDeco = ({ className = "w-20 h-20" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,22 88,38 50,54 12,38" fill="#4F46E5" stroke="#312E81" strokeWidth="2.5"/>
    <path d="M28 47V66C28 72 50 78 50 78C50 78 72 72 72 66V47" fill="#4338CA" stroke="#312E81" strokeWidth="2.5"/>
    <path d="M50 40C58 44 76 50 82 68" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="82" cy="70" r="3" fill="#D97706"/>
    <path d="M85 24L87 28L91 30L87 32L85 36L83 32L79 30L83 28L85 24Z" fill="#FBBF24"/>
    <circle cx="18" cy="65" r="2" fill="#FBBF24"/>
  </svg>
);
