import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakText, speakVietnameseFemale } from '../utils/audio.ts';

export type MascotName = 'nam' | 'lan' | 'both';
export type MascotPose = 'wave' | 'cheer' | 'mic' | 'trophy' | 'think';

interface MascotCharacterProps {
  mascot: MascotName;
  pose?: MascotPose;
  speechVi?: string;
  speechEn?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  mascot,
  pose = 'wave',
  speechVi,
  speechEn,
  size = 'md',
  showSpeech = true,
}) => {
  const sizeClasses = {
    sm: 'w-20 h-24',
    md: 'w-32 h-36',
    lg: 'w-44 h-48',
    xl: 'w-56 h-60',
  }[size];

  const handleSpeak = (text: string, lang: 'vi-VN' | 'en-US') => {
    if (lang === 'vi-VN') {
      const role = mascot === 'lan' ? 'lan' : mascot === 'nam' ? 'nam' : 'teacher';
      speakVietnameseFemale(text, { role });
    } else {
      speakText(text, lang);
    }
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Visual Character Illustration */}
      <div 
        onClick={() => speechVi && handleSpeak(speechVi, 'vi-VN')}
        className={`relative ${sizeClasses} flex items-end justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform`}
        title={speechVi ? "Chạm vào nhân vật để nghe nói" : undefined}
      >
        {mascot === 'nam' && <NamSvg pose={pose} />}
        {mascot === 'lan' && <LanSvg pose={pose} />}
        {mascot === 'both' && (
          <div className="flex items-end -space-x-4">
            <div className="w-28 h-36">
              <NamSvg pose={pose} />
            </div>
            <div className="w-28 h-36">
              <LanSvg pose={pose} />
            </div>
          </div>
        )}
      </div>

      {/* Speech Bubble */}
      {showSpeech && (speechVi || speechEn) && (
        <div className="relative bg-white/95 backdrop-blur-sm border-2 border-amber-300 rounded-2xl p-3 md:p-4 shadow-lg shadow-amber-200/40 max-w-sm md:max-w-md animate-float">
          {/* Bubble tail */}
          <div className="absolute -left-2.5 top-6 w-3 h-3 bg-white border-l-2 border-b-2 border-amber-300 rotate-45" />

          {/* Character Label */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-100">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {mascot === 'nam' ? 'Bé Nam' : mascot === 'lan' ? 'Bé Lan' : 'Nam & Lan'}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
              Lớp 2A7
            </span>
          </div>

          {/* Speech Text */}
          {speechVi && (
            <div className="flex items-start gap-1.5 text-slate-800 text-sm md:text-base font-bold leading-snug">
              <span>{speechVi}</span>
              <button
                type="button"
                onClick={() => handleSpeak(speechVi, 'vi-VN')}
                title="Nghe giọng đọc tiếng Việt"
                className="shrink-0 p-1 rounded-full text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {speechEn && (
            <div className="mt-1 flex items-start gap-1.5 text-indigo-700 text-xs md:text-sm font-semibold italic">
              <span>&ldquo;{speechEn}&rdquo;</span>
              <button
                type="button"
                onClick={() => handleSpeak(speechEn, 'en-US')}
                title="Listen in English"
                className="shrink-0 p-1 rounded-full text-indigo-500 hover:text-indigo-800 hover:bg-indigo-50 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// SVG illustration of Bé Nam (energetic boy, blue shirt, black hair)
export const NamSvg: React.FC<{ pose?: MascotPose }> = ({ pose = 'wave' }) => (
  <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-md overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shadow */}
    <ellipse cx="80" cy="192" rx="42" ry="7" fill="#00000018" />

    {/* Legs */}
    <rect x="62" y="142" width="12" height="34" rx="6" fill="#F8B195" />
    <rect x="86" y="142" width="12" height="34" rx="6" fill="#F8B195" />

    {/* Shoes (Blue sneakers with white soles) */}
    <path d="M54 174C54 171 60 170 68 170H76V184H54C54 184 52 178 54 174Z" fill="#1D4ED8" />
    <rect x="52" y="181" width="26" height="5" rx="2" fill="#FFFFFF" />
    <path d="M84 170H92C100 170 106 171 106 174C108 178 106 184 106 184H84V170Z" fill="#1D4ED8" />
    <rect x="82" y="181" width="26" height="5" rx="2" fill="#FFFFFF" />

    {/* Shorts (Sporty navy shorts with white side stripe) */}
    <path d="M56 122H104V146H84V136H76V146H56V122Z" fill="#1E3A8A" />
    <line x1="58" y1="124" x2="58" y2="144" stroke="#FFFFFF" strokeWidth="2" />
    <line x1="102" y1="124" x2="102" y2="144" stroke="#FFFFFF" strokeWidth="2" />

    {/* Body / Jersey (Bright vibrant athletic blue #2563EB with yellow 2A7 badge) */}
    <rect x="52" y="74" width="56" height="52" rx="10" fill="#2563EB" />
    {/* Collar */}
    <path d="M70 74C70 80 90 80 90 74" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
    {/* Jersey number / text */}
    <circle cx="80" cy="100" r="13" fill="#FFFFFF" />
    <text x="80" y="104" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1D4ED8">2A7</text>

    {/* Arms depending on pose */}
    {pose === 'wave' && (
      <>
        {/* Left arm down */}
        <path d="M52 82L38 116" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        {/* Right arm waving up */}
        <path d="M106 82L126 56L138 64" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        <circle cx="140" cy="62" r="7" fill="#F8B195" />
      </>
    )}

    {pose === 'cheer' && (
      <>
        {/* Both arms raised in victory */}
        <path d="M52 82L34 50" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        <path d="M108 82L126 50" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        <circle cx="32" cy="48" r="7" fill="#F8B195" />
        <circle cx="128" cy="48" r="7" fill="#F8B195" />
      </>
    )}

    {pose === 'mic' && (
      <>
        <path d="M52 82L42 110" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        {/* Holding reporter mic */}
        <path d="M106 82L96 102" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        <rect x="94" y="94" width="8" height="18" rx="2" fill="#374151" />
        <circle cx="98" cy="92" r="7" fill="#9CA3AF" />
        <rect x="95" y="100" width="6" height="5" rx="1" fill="#EF4444" />
      </>
    )}

    {pose === 'trophy' && (
      <>
        <path d="M52 82L64 100" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        <path d="M108 82L96 100" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        {/* Mini trophy in hands */}
        <path d="M72 88H88L84 102H76L72 88Z" fill="#F59E0B" />
        <circle cx="80" cy="93" r="3" fill="#FDE047" />
      </>
    )}

    {pose === 'think' && (
      <>
        <path d="M52 82L44 116" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
        {/* Hand touching chin */}
        <path d="M106 82L98 68" stroke="#F8B195" strokeWidth="12" strokeLinecap="round" />
      </>
    )}

    {/* Neck */}
    <rect x="74" y="66" width="12" height="12" rx="4" fill="#F8B195" />

    {/* Head & Face */}
    <circle cx="80" cy="48" r="26" fill="#F8B195" />

    {/* Cheerful cute face */}
    {/* Eyes with cheerful shine */}
    <ellipse cx="71" cy="46" rx="3.5" ry="4.5" fill="#1E293B" />
    <circle cx="72.5" cy="44.5" r="1.5" fill="#FFFFFF" />
    <ellipse cx="89" cy="46" rx="3.5" ry="4.5" fill="#1E293B" />
    <circle cx="90.5" cy="44.5" r="1.5" fill="#FFFFFF" />

    {/* Eyebrows */}
    <path d="M66 38C69 36 74 37 76 39" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M84 39C86 37 91 36 94 38" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

    {/* Rosy cheeks */}
    <circle cx="66" cy="53" r="4.5" fill="#F43F5E" fillOpacity="0.35" />
    <circle cx="94" cy="53" r="4.5" fill="#F43F5E" fillOpacity="0.35" />

    {/* Wide joyful smile */}
    <path d="M72 54C75 61 85 61 88 54" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M73 54C75 60 85 60 87 54Z" fill="#DC2626" />

    {/* Boy's Hair (spiky, friendly black/dark brown hair) */}
    <path d="M54 44C52 26 66 18 80 18C94 18 108 26 106 44C100 32 94 30 80 32C66 30 60 34 54 44Z" fill="#1F2937" />
    <path d="M60 26L66 16L74 24L82 14L90 24L98 17L102 28" stroke="#1F2937" strokeWidth="4" strokeLinejoin="round" />

    {/* Athletic Headband */}
    <path d="M54 36H106" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
    <circle cx="80" cy="36" r="3" fill="#FFFFFF" />
  </svg>
);

// SVG illustration of Bé Lan (cheerful girl, yellow sports jersey, pigtails)
export const LanSvg: React.FC<{ pose?: MascotPose }> = ({ pose = 'wave' }) => (
  <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-md overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shadow */}
    <ellipse cx="80" cy="192" rx="42" ry="7" fill="#00000018" />

    {/* Legs */}
    <rect x="62" y="142" width="12" height="34" rx="6" fill="#FCD34D" />
    <rect x="86" y="142" width="12" height="34" rx="6" fill="#FCD34D" />

    {/* Shoes (Pink sneakers with white soles) */}
    <path d="M54 174C54 171 60 170 68 170H76V184H54C54 184 52 178 54 174Z" fill="#EC4899" />
    <rect x="52" y="181" width="26" height="5" rx="2" fill="#FFFFFF" />
    <path d="M84 170H92C100 170 106 171 106 174C108 178 106 184 106 184H84V170Z" fill="#EC4899" />
    <rect x="82" y="181" width="26" height="5" rx="2" fill="#FFFFFF" />

    {/* Sporty Skirt (Orange-red pleated athletic skirt) */}
    <path d="M54 122H106L112 142H48L54 122Z" fill="#F97316" />
    <line x1="68" y1="124" x2="66" y2="140" stroke="#EA580C" strokeWidth="2" />
    <line x1="80" y1="124" x2="80" y2="140" stroke="#EA580C" strokeWidth="2" />
    <line x1="92" y1="124" x2="94" y2="140" stroke="#EA580C" strokeWidth="2" />

    {/* Body / Jersey (Bright vibrant sunny yellow #FACC15 jersey) */}
    <rect x="52" y="74" width="56" height="50" rx="10" fill="#FACC15" />
    {/* Collar */}
    <path d="M70 74C70 80 90 80 90 74" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
    {/* Jersey Flower/Heart emblem */}
    <circle cx="80" cy="98" r="12" fill="#FFFFFF" />
    <path d="M80 94C77 90 73 93 75 97C77 101 80 103 80 103C80 103 83 101 85 97C87 93 83 90 80 94Z" fill="#EF4444" />

    {/* Arms depending on pose */}
    {pose === 'wave' && (
      <>
        {/* Right arm waving */}
        <path d="M106 82L126 56L138 64" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        <circle cx="140" cy="62" r="7" fill="#FCD34D" />
        {/* Left arm with thumb up */}
        <path d="M52 82L34 94" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        <circle cx="32" cy="95" r="7" fill="#FCD34D" />
      </>
    )}

    {pose === 'cheer' && (
      <>
        {/* Both hands up cheering */}
        <path d="M52 82L34 52" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        <path d="M108 82L126 52" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        <circle cx="32" cy="50" r="7" fill="#FCD34D" />
        <circle cx="128" cy="50" r="7" fill="#FCD34D" />
      </>
    )}

    {pose === 'mic' && (
      <>
        <path d="M106 82L116 110" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        {/* Holding reporter microphone */}
        <path d="M52 82L64 100" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        <rect x="62" y="94" width="8" height="18" rx="2" fill="#374151" />
        <circle cx="66" cy="92" r="7" fill="#F43F5E" />
        <rect x="63" y="100" width="6" height="5" rx="1" fill="#F59E0B" />
      </>
    )}

    {pose === 'trophy' && (
      <>
        <path d="M52 82L66 100" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        <path d="M108 82L94 100" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        {/* Gold medal around neck */}
        <circle cx="80" cy="112" r="7" fill="#F59E0B" />
        <path d="M74 88L77 106M86 88L83 106" stroke="#EF4444" strokeWidth="3" />
      </>
    )}

    {pose === 'think' && (
      <>
        <path d="M106 82L116 116" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
        <path d="M52 82L62 68" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" />
      </>
    )}

    {/* Neck */}
    <rect x="74" y="66" width="12" height="12" rx="4" fill="#FCD34D" />

    {/* Girl's Twin Pigtails with ribbons */}
    {/* Left pigtail */}
    <ellipse cx="44" cy="52" rx="14" ry="18" fill="#1F2937" transform="rotate(-15 44 52)" />
    <circle cx="52" cy="46" r="5" fill="#EC4899" />
    {/* Right pigtail */}
    <ellipse cx="116" cy="52" rx="14" ry="18" fill="#1F2937" transform="rotate(15 116 52)" />
    <circle cx="108" cy="46" r="5" fill="#EC4899" />

    {/* Head & Face */}
    <circle cx="80" cy="48" r="26" fill="#FCD34D" />

    {/* Cheerful face */}
    <ellipse cx="71" cy="46" rx="3.5" ry="4.5" fill="#1E293B" />
    <circle cx="72.5" cy="44.5" r="1.5" fill="#FFFFFF" />
    <ellipse cx="89" cy="46" rx="3.5" ry="4.5" fill="#1E293B" />
    <circle cx="90.5" cy="44.5" r="1.5" fill="#FFFFFF" />

    {/* Eyebrows */}
    <path d="M66 38C69 36 74 37 76 39" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M84 39C86 37 91 36 94 38" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />

    {/* Rosy cheeks */}
    <circle cx="65" cy="53" r="5" fill="#F43F5E" fillOpacity="0.4" />
    <circle cx="95" cy="53" r="5" fill="#F43F5E" fillOpacity="0.4" />

    {/* Big smile with sparkles */}
    <path d="M72 54C75 62 85 62 88 54" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M73 54C75 61 85 61 87 54Z" fill="#DC2626" />

    {/* Girl's Bangs */}
    <path d="M56 42C56 26 68 20 80 20C92 20 104 26 104 42C96 32 90 32 80 34C70 32 64 32 56 42Z" fill="#1F2937" />
  </svg>
);
