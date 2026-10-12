import React from 'react';

interface SportIllustrationProps {
  sportId: string;
  className?: string;
}

export const SportIllustration: React.FC<SportIllustrationProps> = ({ sportId, className = 'w-full h-full' }) => {
  switch (sportId) {
    case 'run':
      return <RunIllustration className={className} />;
    case 'swim':
      return <SwimIllustration className={className} />;
    case 'football':
      return <FootballIllustration className={className} />;
    case 'rope':
      return <JumpRopeIllustration className={className} />;
    case 'bike':
      return <BikeIllustration className={className} />;
    case 'badminton':
      return <BadmintonIllustration className={className} />;
    default:
      return <FootballIllustration className={className} />;
  }
};

/** 1. Chạy - Run */
export const RunIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="180" rx="20" fill="url(#runGrad)" />
    <defs>
      <linearGradient id="runGrad" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEE2E2" />
        <stop stopColor="#FECACA" />
      </linearGradient>
    </defs>

    {/* Running Track Lanes */}
    <path d="M0 130C60 120 180 120 240 130L240 180L0 180Z" fill="#F87171" />
    <path d="M0 152C80 144 160 144 240 152" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="8 6" />
    <path d="M0 172C80 166 160 166 240 172" stroke="#FFFFFF" strokeWidth="3" />

    {/* Sun and Clouds */}
    <circle cx="205" cy="35" r="18" fill="#FBBF24" opacity="0.9" />
    <path d="M30 40C30 34 36 30 42 30C46 25 54 25 58 30C64 30 70 35 70 41H30Z" fill="#FFFFFF" opacity="0.85" />

    {/* Speed Lines */}
    <path d="M45 80H75M35 95H70M50 110H80" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />

    {/* Running Child */}
    {/* Body leaning forward */}
    <ellipse cx="120" cy="85" rx="14" ry="22" transform="rotate(22 120 85)" fill="#EF4444" />
    <circle cx="121" cy="85" r="7" fill="#FFFFFF" />
    <text x="121" y="88" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#EF4444">1</text>

    {/* Head & Cap */}
    <circle cx="138" cy="55" r="15" fill="#FCD34D" />
    <circle cx="143" cy="53" r="2.5" fill="#1E293B" />
    <path d="M140 59C143 62 147 61 149 59" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    {/* Red athletic visor */}
    <path d="M125 48C132 40 148 40 155 48L165 48C162 45 152 42 142 42C130 42 125 48 125 48Z" fill="#DC2626" />

    {/* Front Leg sprinting forward */}
    <path d="M128 102L152 118L170 115" stroke="#FCD34D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="168" y="110" width="16" height="8" rx="4" fill="#1E293B" />

    {/* Back Leg kicking back */}
    <path d="M112 96L92 110L72 100" stroke="#FCD34D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="62" y="94" width="16" height="8" rx="4" fill="#1E293B" />

    {/* Pumping Arms */}
    <path d="M128 75L148 70L158 84" stroke="#FCD34D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M115 78L95 86L90 102" stroke="#FCD34D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 2. Bơi - Swim */
export const SwimIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="180" rx="20" fill="url(#swimGrad)" />
    <defs>
      <linearGradient id="swimGrad" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0F2FE" />
        <stop stopColor="#BAE6FD" />
      </linearGradient>
    </defs>

    {/* Swimming Pool Lane Markers */}
    <line x1="0" y1="65" x2="240" y2="65" stroke="#0284C7" strokeWidth="3" strokeDasharray="10 8" />
    <line x1="0" y1="145" x2="240" y2="145" stroke="#0284C7" strokeWidth="3" strokeDasharray="10 8" />

    {/* Blue Water Ripples and Waves */}
    <path d="M0 90C30 84 50 96 80 90C110 84 130 96 160 90C190 84 210 96 240 90L240 180L0 180Z" fill="#38BDF8" fillOpacity="0.8" />
    <path d="M0 115C35 110 55 122 90 115C125 108 145 122 180 115C215 108 235 120 240 115L240 180L0 180Z" fill="#0284C7" fillOpacity="0.9" />

    {/* Swimmer */}
    {/* Body in water */}
    <ellipse cx="120" cy="110" rx="36" ry="12" fill="#0369A1" />

    {/* Head with Blue Swim Cap & Goggles */}
    <circle cx="150" cy="98" r="16" fill="#FCD34D" />
    <path d="M142 84C156 84 166 92 166 104H134C134 92 142 84 142 84Z" fill="#2563EB" />
    {/* Goggles */}
    <rect x="150" y="94" width="14" height="7" rx="3" fill="#1E293B" />
    <rect x="152" y="95" width="10" height="5" rx="2" fill="#67E8F9" />
    <line x1="145" y1="97" x2="150" y2="97" stroke="#1E293B" strokeWidth="2" />

    {/* Swimming Freestyle Arm reaching out */}
    <path d="M136 98C130 80 150 70 170 80L174 84" stroke="#FCD34D" strokeWidth="9" strokeLinecap="round" />

    {/* Water Splashes */}
    <circle cx="75" cy="108" r="5" fill="#FFFFFF" opacity="0.9" />
    <circle cx="68" cy="116" r="3.5" fill="#FFFFFF" opacity="0.9" />
    <circle cx="62" cy="105" r="4" fill="#FFFFFF" opacity="0.8" />
    <circle cx="185" cy="85" r="4" fill="#FFFFFF" opacity="0.8" />
    <circle cx="192" cy="92" r="3" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

/** 3. Đá bóng - Play Football */
export const FootballIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="180" rx="20" fill="url(#ballGrad)" />
    <defs>
      <linearGradient id="ballGrad" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D1FAE5" />
        <stop stopColor="#A7F3D0" />
      </linearGradient>
    </defs>

    {/* Green Soccer Pitch */}
    <path d="M0 115C60 110 180 110 240 115L240 180L0 180Z" fill="#10B981" />
    <ellipse cx="120" cy="148" rx="55" ry="20" stroke="#FFFFFF" strokeWidth="3" fill="none" />
    <line x1="120" y1="115" x2="120" y2="180" stroke="#FFFFFF" strokeWidth="3" />

    {/* Soccer Goal in the distance */}
    <rect x="180" y="70" width="46" height="50" stroke="#FFFFFF" strokeWidth="3.5" fill="#FFFFFF22" rx="4" />
    <line x1="180" y1="86" x2="226" y2="86" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="180" y1="102" x2="226" y2="102" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="195" y1="70" x2="195" y2="120" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="210" y1="70" x2="210" y2="120" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Player Kicking */}
    {/* Body */}
    <rect x="70" y="75" width="24" height="32" rx="6" fill="#3B82F6" />
    {/* Head */}
    <circle cx="82" cy="58" r="14" fill="#FCD34D" />
    <path d="M72 52C75 42 89 42 92 52" stroke="#1F2937" strokeWidth="6" strokeLinecap="round" />
    <circle cx="86" cy="57" r="2" fill="#1E293B" />
    <path d="M84 63C86 65 90 65 91 63" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />

    {/* Supporting Leg */}
    <path d="M76 107L72 135L66 138" stroke="#FCD34D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="60" y="136" width="14" height="6" rx="3" fill="#1E293B" />

    {/* Kicking Leg forward towards ball */}
    <path d="M88 107L104 125L124 122" stroke="#FCD34D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="122" y="118" width="14" height="7" rx="3" fill="#EF4444" />

    {/* Soccer Ball with Motion Lines */}
    <circle cx="146" cy="122" r="13" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
    <polygon points="146,115 151,119 149,125 143,125 141,119" fill="#1E293B" />
    {/* Speed lines */}
    <path d="M162 120L174 117M160 126L172 126" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** 4. Nhảy dây - Jump Rope */
export const JumpRopeIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="180" rx="20" fill="url(#ropeGrad)" />
    <defs>
      <linearGradient id="ropeGrad" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" />
        <stop stopColor="#FDE68A" />
      </linearGradient>
    </defs>

    {/* Ground with Flowers and Grass */}
    <path d="M0 140C60 135 180 135 240 140L240 180L0 180Z" fill="#84CC16" />
    <circle cx="40" cy="155" r="4" fill="#F43F5E" />
    <circle cx="200" cy="155" r="4" fill="#F43F5E" />

    {/* Jumping Girl (Bé Lan) in Mid-Air */}
    {/* Jump Rope Arc */}
    <path d="M78 98C82 30 158 30 162 98" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
    <path d="M78 98C84 165 156 165 162 98" stroke="#EF4444" strokeWidth="3.5" strokeDasharray="6 4" opacity="0.6" />

    {/* Sparkles around rope */}
    <path d="M120 28L122 34L128 36L122 38L120 44L118 38L112 36L118 34Z" fill="#F59E0B" />
    <path d="M95 48L96 52L100 53L96 54L95 58L94 54L90 53L94 52Z" fill="#F59E0B" />

    {/* Girl Character - Floating above ground */}
    {/* Head with pigtails */}
    <circle cx="120" cy="62" r="14" fill="#FCD34D" />
    <ellipse cx="102" cy="64" rx="7" ry="10" fill="#1F2937" />
    <ellipse cx="138" cy="64" rx="7" ry="10" fill="#1F2937" />
    <circle cx="124" cy="61" r="2" fill="#1E293B" />
    <path d="M121 66C123 68 127 68 128 66" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />

    {/* Yellow Sport Dress */}
    <path d="M110 76H130L135 102H105L110 76Z" fill="#FACC15" />

    {/* Both Arms holding the jump rope handles */}
    <path d="M110 82L82 96" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" />
    <rect x="76" y="93" width="7" height="12" rx="2" fill="#DC2626" />

    <path d="M130 82L158 96" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" />
    <rect x="157" y="93" width="7" height="12" rx="2" fill="#DC2626" />

    {/* Legs tucked up jumping */}
    <path d="M114 102L112 120L118 123" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="116" y="121" width="10" height="5" rx="2.5" fill="#EC4899" />

    <path d="M126 102L128 120L122 123" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="120" y="121" width="10" height="5" rx="2.5" fill="#EC4899" />
  </svg>
);

/** 5. Đạp xe - Ride a Bike */
export const BikeIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="180" rx="20" fill="url(#bikeGrad)" />
    <defs>
      <linearGradient id="bikeGrad" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EDE9FE" />
        <stop stopColor="#DDD6FE" />
      </linearGradient>
    </defs>

    {/* Paved Bike Path */}
    <path d="M0 130C60 126 180 126 240 130L240 180L0 180Z" fill="#64748B" />
    <line x1="0" y1="155" x2="240" y2="155" stroke="#FACC15" strokeWidth="4" strokeDasharray="14 10" />

    {/* Bike Wheels */}
    {/* Back Wheel */}
    <circle cx="70" cy="134" r="22" stroke="#1E293B" strokeWidth="5" fill="#FFFFFF44" />
    <circle cx="70" cy="134" r="4" fill="#64748B" />
    <line x1="48" y1="134" x2="92" y2="134" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="70" y1="112" x2="70" y2="156" stroke="#94A3B8" strokeWidth="1.5" />

    {/* Front Wheel */}
    <circle cx="160" cy="134" r="22" stroke="#1E293B" strokeWidth="5" fill="#FFFFFF44" />
    <circle cx="160" cy="134" r="4" fill="#64748B" />
    <line x1="138" y1="134" x2="182" y2="134" stroke="#94A3B8" strokeWidth="1.5" />
    <line x1="160" y1="112" x2="160" y2="156" stroke="#94A3B8" strokeWidth="1.5" />

    {/* Bike Frame (Vibrant Purple #8B5CF6) */}
    <line x1="70" y1="134" x2="108" y2="134" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />
    <line x1="108" y1="134" x2="152" y2="98" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />
    <line x1="70" y1="134" x2="102" y2="98" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />
    <line x1="102" y1="98" x2="152" y2="98" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />
    <line x1="108" y1="134" x2="102" y2="98" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />
    <line x1="152" y1="98" x2="160" y2="134" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />

    {/* Seat and Handlebars */}
    <path d="M96 95H108" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
    <path d="M148 90L154 84H164" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

    {/* Kid Riding Bike */}
    <circle cx="118" cy="56" r="13" fill="#FCD34D" />
    {/* Safety Helmet */}
    <path d="M106 54C106 43 118 40 130 46L134 52H106Z" fill="#F97316" />
    <path d="M116 70L112 96" stroke="#3B82F6" strokeWidth="14" strokeLinecap="round" />
    {/* Arm to Handlebar */}
    <path d="M116 74L152 86" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />
    {/* Leg to Pedal */}
    <path d="M112 94L116 114L108 126" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="104" y="124" width="10" height="5" rx="2" fill="#1E293B" />
  </svg>
);

/** 6. Chơi cầu lông - Play Badminton */
export const BadmintonIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 240 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="180" rx="20" fill="url(#badmGrad)" />
    <defs>
      <linearGradient id="badmGrad" x1="0" y1="0" x2="240" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCE7F3" />
        <stop stopColor="#FBCFE8" />
      </linearGradient>
    </defs>

    {/* Court Floor */}
    <path d="M0 120C60 115 180 115 240 120L240 180L0 180Z" fill="#047857" />
    <line x1="0" y1="140" x2="240" y2="140" stroke="#FFFFFF" strokeWidth="3" />
    <line x1="0" y1="165" x2="240" y2="165" stroke="#FFFFFF" strokeWidth="3" />

    {/* Badminton Net in Center */}
    <rect x="140" y="70" width="8" height="70" fill="#E2E8F0" />
    <rect x="144" y="80" width="85" height="35" fill="#FFFFFF44" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 3" />
    <line x1="144" y1="80" x2="229" y2="80" stroke="#FFFFFF" strokeWidth="4" />

    {/* Player with Racket */}
    <circle cx="70" cy="58" r="14" fill="#FCD34D" />
    <path d="M60 52C63 42 77 42 80 52" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
    <circle cx="74" cy="57" r="2" fill="#1E293B" />

    {/* Athletic Shirt */}
    <rect x="60" y="72" width="22" height="30" rx="5" fill="#EC4899" />
    {/* Legs */}
    <path d="M65 102L60 130L55 133" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="50" y="132" width="12" height="5" rx="2.5" fill="#1E293B" />
    <path d="M77 102L84 128L92 130" stroke="#FCD34D" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="90" y="128" width="12" height="5" rx="2.5" fill="#1E293B" />

    {/* Arm swing with Badminton Racket */}
    <path d="M76 76L98 62L106 48" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />
    {/* Racket Handle and Net Oval */}
    <line x1="106" y1="48" x2="118" y2="35" stroke="#94A3B8" strokeWidth="3.5" />
    <ellipse cx="126" cy="27" rx="12" ry="9" stroke="#EC4899" strokeWidth="3" fill="#FFFFFF33" transform="rotate(-30 126 27)" />

    {/* Flying Shuttlecock */}
    <path d="M152 46L164 52L158 58Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
    <circle cx="164" cy="52" r="3.5" fill="#EF4444" />
    {/* Motion arcs */}
    <path d="M125 40C136 34 148 38 155 45" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
  </svg>
);
