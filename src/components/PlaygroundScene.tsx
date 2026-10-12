import React from 'react';

interface PlaygroundSceneProps {
  activeCharacterId?: string;
  onSelectCharacter?: (id: string) => void;
  className?: string;
}

export const PlaygroundScene: React.FC<PlaygroundSceneProps> = ({
  activeCharacterId,
  onSelectCharacter,
  className = 'w-full h-auto',
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border-4 border-amber-300 shadow-xl bg-sky-200 select-none ${className}`}>
      {/* Sky and clouds background */}
      <svg viewBox="0 0 1000 560" className="w-full h-full block" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="560" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7DD3FC" />
            <stop stopColor="#BAE6FD" offset="0.35" />
            <stop stopColor="#F0FDF4" offset="0.55" />
          </linearGradient>

          <linearGradient id="grassG" x1="0" y1="200" x2="0" y2="560" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ADE80" />
            <stop stopColor="#22C55E" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1000" height="560" fill="url(#skyG)" />

        {/* Sun */}
        <circle cx="880" cy="80" r="45" fill="#FBBF24" opacity="0.9" />
        <circle cx="880" cy="80" r="60" fill="#FDE68A" opacity="0.4" />

        {/* Fluffy Clouds */}
        <path d="M120 70C120 55 135 45 150 45C160 30 185 30 195 45C210 45 220 55 220 70H120Z" fill="#FFFFFF" opacity="0.85" />
        <path d="M620 90C620 78 632 70 644 70C652 58 672 58 680 70C692 70 700 78 700 90H620Z" fill="#FFFFFF" opacity="0.85" />

        {/* Distant Trees & School Building */}
        <rect x="420" y="110" width="160" height="70" rx="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        <polygon points="410,110 500,70 590,110" fill="#EF4444" />
        <rect x="480" y="130" width="40" height="50" fill="#B45309" />
        <text x="500" y="105" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B91C1C">TH ĐỖ NGỌC DU</text>

        {/* Rolling Green Hills & Playground Grass */}
        <path d="M0 160C200 140 380 180 600 160C800 140 920 170 1000 160V560H0V160Z" fill="url(#grassG)" />

        {/* Winding Cobblestone Running / Walking Path */}
        <path d="M0 240C220 220 380 320 620 280C820 250 900 320 1000 290L1000 360C860 380 780 330 580 340C360 360 200 280 0 310Z" fill="#FDE68A" opacity="0.75" />

        {/* Running Track Oval in lower-left */}
        <path d="M80 340C80 280 320 280 320 340C320 400 80 400 80 340Z" stroke="#EF4444" strokeWidth="26" fill="#F87171" opacity="0.8" />
        <path d="M80 340C80 280 320 280 320 340C320 400 80 400 80 340Z" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 6" fill="none" />

        {/* Swimming Pool Section in right side */}
        <rect x="760" y="360" width="220" height="150" rx="16" fill="#38BDF8" stroke="#0284C7" strokeWidth="5" />
        <path d="M760 390C800 385 850 400 900 390C950 385 980 395 980 390" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />
        <path d="M760 440C810 435 860 450 910 440C950 435 980 445 980 440" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />

        {/* Soccer Goal & Field in Center */}
        <ellipse cx="660" cy="450" rx="110" ry="45" stroke="#FFFFFF" strokeWidth="3" fill="#22C55E" />
        <rect x="700" y="400" width="70" height="40" stroke="#FFFFFF" strokeWidth="4" fill="#FFFFFF22" rx="4" />
        <line x1="700" y1="420" x2="770" y2="420" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="735" y1="400" x2="735" y2="440" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Badminton Court in Top Center */}
        <rect x="360" y="210" width="120" height="60" fill="#059669" stroke="#FFFFFF" strokeWidth="2" rx="4" />
        <line x1="420" y1="205" x2="420" y2="275" stroke="#E2E8F0" strokeWidth="3" />
        <line x1="360" y1="240" x2="480" y2="240" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Bunting Festive Flags across the top */}
        <path d="M0 40Q250 80 500 50Q750 80 1000 40" stroke="#E2E8F0" strokeWidth="2" fill="none" />
        {/* Colorful Triangles */}
        <polygon points="40,47 60,75 80,51" fill="#EF4444" />
        <polygon points="120,55 140,83 160,58" fill="#F59E0B" />
        <polygon points="200,63 220,91 240,65" fill="#10B981" />
        <polygon points="280,65 300,93 320,63" fill="#3B82F6" />
        <polygon points="360,60 380,88 400,58" fill="#EC4899" />
        <polygon points="440,54 460,82 480,52" fill="#8B5CF6" />
        <polygon points="520,53 540,81 560,55" fill="#EF4444" />
        <polygon points="600,60 620,88 640,63" fill="#F59E0B" />
        <polygon points="680,66 700,94 720,66" fill="#10B981" />
        <polygon points="760,64 780,92 800,61" fill="#3B82F6" />
        <polygon points="840,56 860,84 880,53" fill="#EC4899" />
        <polygon points="920,48 940,76 960,43" fill="#8B5CF6" />

        {/* 1. CHARACTER: Bạn Minh Chạy (pq1) at (~200, 340) */}
        <g 
          className="cursor-pointer transition-transform hover:scale-110"
          onClick={() => onSelectCharacter?.('pq1')}
        >
          {activeCharacterId === 'pq1' && (
            <circle cx="200" cy="335" r="48" fill="#FDE047" opacity="0.4" filter="url(#softGlow)" />
          )}
          {/* Runner */}
          <ellipse cx="200" cy="355" rx="22" ry="6" fill="#00000022" />
          <circle cx="200" cy="305" r="14" fill="#FCD34D" />
          <circle cx="204" cy="303" r="2" fill="#1E293B" />
          <path d="M192 300C198 290 212 290 214 300" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
          {/* Leaning body */}
          <rect x="190" y="320" width="20" height="24" rx="5" fill="#EF4444" transform="rotate(15 190 320)" />
          <path d="M194 340L214 360L226 358" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" />
          <path d="M188 335L172 348L156 342" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" />
          {/* Label Tag */}
          <rect x="160" y="270" width="80" height="22" rx="11" fill={activeCharacterId === 'pq1' ? '#EF4444' : '#FFFFFF'} stroke="#DC2626" strokeWidth="2" />
          <text x="200" y="285" textAnchor="middle" fontSize="11" fontWeight="bold" fill={activeCharacterId === 'pq1' ? '#FFFFFF' : '#991B1B'}>
            Bạn Minh 🏃
          </text>
        </g>

        {/* 2. CHARACTER: Bé Lan Nhảy Dây (pq2) at (~490, 360) */}
        <g 
          className="cursor-pointer transition-transform hover:scale-110"
          onClick={() => onSelectCharacter?.('pq2')}
        >
          {activeCharacterId === 'pq2' && (
            <circle cx="490" cy="355" r="48" fill="#FDE047" opacity="0.4" filter="url(#softGlow)" />
          )}
          <ellipse cx="490" cy="385" rx="20" ry="6" fill="#00000022" />
          {/* Rope arc */}
          <path d="M465 350C468 310 512 310 515 350" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <circle cx="490" cy="335" r="13" fill="#FCD34D" />
          <ellipse cx="475" cy="336" rx="6" ry="8" fill="#1F2937" />
          <ellipse cx="505" cy="336" rx="6" ry="8" fill="#1F2937" />
          <path d="M482 348H498L502 368H478Z" fill="#FACC15" />
          <path d="M486 368L484 378M494 368L496 378" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" />
          {/* Label Tag */}
          <rect x="450" y="295" width="80" height="22" rx="11" fill={activeCharacterId === 'pq2' ? '#F59E0B' : '#FFFFFF'} stroke="#D97706" strokeWidth="2" />
          <text x="490" y="310" textAnchor="middle" fontSize="11" fontWeight="bold" fill={activeCharacterId === 'pq2' ? '#FFFFFF' : '#B45309'}>
            Bé Lan 🪢
          </text>
        </g>

        {/* 3. CHARACTER: Bạn Nam Đá Bóng (pq3) at (~650, 440) */}
        <g 
          className="cursor-pointer transition-transform hover:scale-110"
          onClick={() => onSelectCharacter?.('pq3')}
        >
          {activeCharacterId === 'pq3' && (
            <circle cx="650" cy="435" r="48" fill="#FDE047" opacity="0.4" filter="url(#softGlow)" />
          )}
          <ellipse cx="640" cy="470" rx="22" ry="6" fill="#00000022" />
          {/* Nam with soccer ball */}
          <circle cx="640" cy="420" r="14" fill="#FCD34D" />
          <path d="M630 415C635 405 650 405 652 415" stroke="#1F2937" strokeWidth="5" strokeLinecap="round" />
          <rect x="630" y="434" width="20" height="24" rx="5" fill="#2563EB" />
          <path d="M644 458L658 468L672 466" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />
          {/* Ball */}
          <circle cx="682" cy="466" r="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
          <polygon points="682,461 686,464 685,468 680,468 679,464" fill="#1E293B" />
          {/* Label Tag */}
          <rect x="610" y="380" width="80" height="22" rx="11" fill={activeCharacterId === 'pq3' ? '#2563EB' : '#FFFFFF'} stroke="#1D4ED8" strokeWidth="2" />
          <text x="650" y="395" textAnchor="middle" fontSize="11" fontWeight="bold" fill={activeCharacterId === 'pq3' ? '#FFFFFF' : '#1E40AF'}>
            Bạn Nam ⚽
          </text>
        </g>

        {/* 4. CHARACTER: Các bạn nhỏ bơi lội (pq4) at (~870, 420) */}
        <g 
          className="cursor-pointer transition-transform hover:scale-110"
          onClick={() => onSelectCharacter?.('pq4')}
        >
          {activeCharacterId === 'pq4' && (
            <circle cx="870" cy="425" r="48" fill="#FDE047" opacity="0.4" filter="url(#softGlow)" />
          )}
          {/* Swimmer head & splashing water */}
          <ellipse cx="870" cy="435" rx="30" ry="10" fill="#0284C7" />
          <circle cx="880" cy="420" r="13" fill="#FCD34D" />
          <path d="M872 410C882 408 892 415 892 423H870C870 415 872 410 872 410Z" fill="#3B82F6" />
          {/* Arm stroke */}
          <path d="M870 422C865 405 885 395 900 405" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />
          {/* Water drops */}
          <circle cx="850" cy="425" r="3" fill="#FFFFFF" />
          <circle cx="895" cy="415" r="2.5" fill="#FFFFFF" />
          {/* Label Tag */}
          <rect x="820" y="370" width="100" height="22" rx="11" fill={activeCharacterId === 'pq4' ? '#0284C7' : '#FFFFFF'} stroke="#0369A1" strokeWidth="2" />
          <text x="870" y="385" textAnchor="middle" fontSize="11" fontWeight="bold" fill={activeCharacterId === 'pq4' ? '#FFFFFF' : '#075985'}>
            Các bạn nhỏ 🏊
          </text>
        </g>

        {/* 5. CHARACTER: Bạn Tuấn đạp xe (pq5) at (~730, 240) */}
        <g 
          className="cursor-pointer transition-transform hover:scale-110"
          onClick={() => onSelectCharacter?.('pq5')}
        >
          {activeCharacterId === 'pq5' && (
            <circle cx="730" cy="245" r="48" fill="#FDE047" opacity="0.4" filter="url(#softGlow)" />
          )}
          <ellipse cx="730" cy="275" rx="24" ry="5" fill="#00000022" />
          {/* Mini bicycle */}
          <circle cx="710" cy="265" r="12" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF44" />
          <circle cx="750" cy="265" r="12" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF44" />
          <line x1="710" y1="265" x2="730" y2="245" stroke="#8B5CF6" strokeWidth="3" />
          <line x1="730" y1="245" x2="750" y2="265" stroke="#8B5CF6" strokeWidth="3" />
          <line x1="710" y1="265" x2="750" y2="265" stroke="#8B5CF6" strokeWidth="3" />
          {/* Rider Tuấn */}
          <circle cx="730" cy="225" r="10" fill="#FCD34D" />
          <path d="M722 222C722 215 730 213 738 217L740 222H722Z" fill="#F97316" />
          <line x1="730" y1="235" x2="728" y2="250" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" />
          {/* Label Tag */}
          <rect x="690" y="190" width="80" height="22" rx="11" fill={activeCharacterId === 'pq5' ? '#8B5CF6' : '#FFFFFF'} stroke="#7C3AED" strokeWidth="2" />
          <text x="730" y="205" textAnchor="middle" fontSize="11" fontWeight="bold" fill={activeCharacterId === 'pq5' ? '#FFFFFF' : '#6D28D9'}>
            Bạn Tuấn 🚲
          </text>
        </g>
      </svg>
    </div>
  );
};
