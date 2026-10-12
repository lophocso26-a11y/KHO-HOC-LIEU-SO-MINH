import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACTIVITIES_DATA } from '../data/lessonData.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { SportIllustration } from './SportIllustrations.tsx';
import { MascotCharacter } from './MascotCharacter.tsx';

interface MatchingGameProps {
  onCompleteStation: (stars: number) => void;
  onBackToMap: () => void;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  onCompleteStation,
  onBackToMap,
}) => {
  // Shuffled word cards
  const [words, setWords] = useState(() => {
    return [...ACTIVITIES_DATA]
      .map((a) => ({ id: a.id, nameVi: a.nameVi, nameEn: a.nameEn }))
      .sort(() => Math.random() - 0.5);
  });

  // Matched pairs mapping: { sportId: true }
  const [matches, setMatches] = useState<Record<string, boolean>>({});

  // Touch / Click selected word state (for touch screens and interactive whiteboards)
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  // Error shake indicator for a sport or word
  const [shakeId, setShakeId] = useState<string | null>(null);

  // Mascot feedback state
  const [feedback, setFeedback] = useState<{ vi: string; en: string; type: 'idle' | 'success' | 'retry' }>({
    vi: 'Em hãy chọn một thẻ từ rồi chạm vào bức tranh tương ứng nhé!',
    en: 'Select a word card, then tap the matching picture!',
    type: 'idle',
  });

  const matchedCount = Object.keys(matches).length;
  const isAllMatched = matchedCount === ACTIVITIES_DATA.length;

  const handleSelectWord = (wordId: string) => {
    sound.playClick();
    setSelectedWordId(wordId);
    const item = ACTIVITIES_DATA.find((a) => a.id === wordId);
    if (item) {
      speakText(item.nameVi, 'vi-VN');
    }
  };

  const handleDropOrTapTarget = (targetSportId: string) => {
    if (matches[targetSportId]) return; // already matched
    if (!selectedWordId) {
      setFeedback({
        vi: 'Em hãy nhấn chọn một thẻ từ ở phía trên trước nhé!',
        en: 'Please select a word card above first!',
        type: 'idle',
      });
      sound.playClick();
      return;
    }

    if (selectedWordId === targetSportId) {
      // Correct match!
      sound.playSuccess();
      const nextMatches = { ...matches, [targetSportId]: true };
      setMatches(nextMatches);
      setSelectedWordId(null);
      setFeedback({
        vi: 'Chính xác! Bạn làm rất tốt!',
        en: 'Excellent! Well done!',
        type: 'success',
      });

      if (Object.keys(nextMatches).length === ACTIVITIES_DATA.length) {
        sound.playFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } else {
      // Wrong match
      sound.playWrong();
      setShakeId(targetSportId);
      setTimeout(() => setShakeId(null), 600);
      setFeedback({
        vi: 'Chưa chính xác rồi. Em hãy thử lại nhé!',
        en: 'Not quite. Please try again!',
        type: 'retry',
      });
    }
  };

  // Drag and drop handlers for mouse users
  const handleDragStart = (e: React.DragEvent, wordId: string) => {
    e.dataTransfer.setData('text/plain', wordId);
    setSelectedWordId(wordId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSportId: string) => {
    e.preventDefault();
    const wordId = e.dataTransfer.getData('text/plain') || selectedWordId;
    if (wordId) {
      setSelectedWordId(wordId);
      handleDropOrTapTarget(targetSportId);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setMatches({});
    setSelectedWordId(null);
    setWords([...ACTIVITIES_DATA].map((a) => ({ id: a.id, nameVi: a.nameVi, nameEn: a.nameEn })).sort(() => Math.random() - 0.5));
    setFeedback({
      vi: 'Đã đặt lại trò chơi. Cùng nối lại từ đầu nào!',
      en: 'Game reset. Let\'s match again!',
      type: 'idle',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 border-3 border-emerald-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-black uppercase">
              TRẠM 2
            </span>
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
              FIND THE WORDS • SĂN TÌM TỪ NGỮ
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-800">
            Nối Từ Với Hình Ảnh Hoạt Động
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs md:text-sm text-slate-600 font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600 inline shrink-0" />
              <span>&ldquo;Look and match!&rdquo; – Nhấn hoặc kéo thẻ từ vào bức tranh phù hợp.</span>
            </p>
            <button
              type="button"
              onClick={() => speakVietnameseFemale('Em hãy kéo hoặc chạm thẻ từ vào đúng hình ảnh hoạt động thể thao nhé!', { role: 'teacher' })}
              className="p-1 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors shrink-0"
              title="Nghe cô Tuyết hướng dẫn"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counter and actions */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 border-2 border-emerald-300 text-emerald-950 px-4 py-2 rounded-2xl font-black text-sm">
            Đúng: {matchedCount} / 6 cặp
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Làm lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onBackToMap}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Bản đồ
          </button>
        </div>
      </div>

      {/* Word Cards Row (Available Words to match) */}
      <div className="bg-emerald-50/70 border-3 border-emerald-200 rounded-3xl p-4 md:p-5 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            KHO THẺ TỪ NGỮ TIẾNG VIỆT (Nhấn chọn thẻ):
          </span>
          {selectedWordId && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-200/80 px-2.5 py-0.5 rounded-full animate-pulse">
              Đang chọn: &ldquo;{ACTIVITIES_DATA.find((a) => a.id === selectedWordId)?.nameVi}&rdquo;
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {words.map((item) => {
            const isMatched = matches[item.id];
            const isSelected = selectedWordId === item.id;

            if (isMatched) {
              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-3 bg-emerald-100/60 border-2 border-emerald-300 text-emerald-600 font-bold text-sm text-center opacity-60 flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="line-through">{item.nameVi}</span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onClick={() => handleSelectWord(item.id)}
                className={`cursor-pointer rounded-2xl p-2.5 sm:p-3 text-center border-3 font-black text-base shadow-md transition-all transform active:scale-95 flex flex-col items-center justify-between gap-1 ${
                  isSelected
                    ? 'bg-amber-300 border-amber-500 text-amber-950 scale-105 shadow-lg ring-4 ring-amber-200'
                    : 'bg-white hover:bg-emerald-50 border-emerald-300 text-slate-800 hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-center gap-1 w-full">
                  <span>{item.nameVi}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakVietnameseFemale(item.nameVi, { role: 'teacher' });
                    }}
                    className="p-1 hover:bg-amber-200/80 rounded-full text-amber-800 transition-colors"
                    title="Nghe tiếng Việt"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1 w-full border-t border-slate-100 pt-0.5">
                  <span className="text-[10px] text-blue-600 uppercase font-extrabold">
                    {item.nameEn}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(item.nameEn, 'en-US');
                    }}
                    className="p-0.5 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                    title="Listen in English"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Picture Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
        {ACTIVITIES_DATA.map((sport) => {
          const isMatched = matches[sport.id];
          const isShaking = shakeId === sport.id;

          return (
            <div
              key={sport.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, sport.id)}
              onClick={() => handleDropOrTapTarget(sport.id)}
              className={`rounded-3xl p-3 sm:p-4 border-4 transition-all duration-200 flex flex-col items-center justify-between cursor-pointer ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-200'
                  : isShaking
                  ? 'bg-rose-50 border-rose-400 animate-wiggle'
                  : selectedWordId
                  ? 'bg-white border-amber-300 hover:border-emerald-500 hover:bg-emerald-50/40 shadow-lg'
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-md'
              }`}
            >
              {/* Illustration container */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-inner">
                <SportIllustration sportId={sport.id} />
              </div>

              {/* Match Slot Target Area */}
              <div
                className={`w-full py-2.5 px-3 rounded-2xl text-center font-black text-sm sm:text-base flex items-center justify-center gap-1.5 transition-all ${
                  isMatched
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-600'
                }`}
              >
                {isMatched ? (
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakVietnameseFemale(sport.nameVi, { role: 'teacher' });
                      }}
                      className="px-2 py-0.5 rounded-full hover:bg-emerald-600 transition-colors flex items-center gap-1"
                      title="Nghe tiếng Việt"
                    >
                      <span>{sport.nameVi}</span>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-100" />
                    </button>
                    <span className="text-emerald-200 text-xs">/</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(sport.nameEn, 'en-US');
                      }}
                      className="px-2 py-0.5 rounded-full hover:bg-emerald-600 transition-colors flex items-center gap-1 text-xs uppercase font-extrabold text-emerald-100"
                      title="Listen in English"
                    >
                      <span>{sport.nameEn}</span>
                      <Volume2 className="w-3 h-3 text-emerald-200" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm font-bold text-slate-500">
                    {selectedWordId ? '👉 Chạm để nối vào đây' : 'Thả hoặc chạm thẻ vào đây'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mascot Guidance Feedback & Next Station Button */}
      <div className="bg-white/95 border-3 border-amber-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <MascotCharacter
          mascot="lan"
          pose={isAllMatched ? 'cheer' : feedback.type === 'retry' ? 'think' : 'wave'}
          size="sm"
          speechVi={feedback.vi}
          speechEn={feedback.en}
        />

        {isAllMatched && (
          <button
            type="button"
            onClick={() => onCompleteStation(3)}
            className="py-4 px-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-xl shadow-emerald-200 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer animate-wiggle"
          >
            <span>HOÀN THÀNH – MỞ KHÓA TRẠM 3</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
