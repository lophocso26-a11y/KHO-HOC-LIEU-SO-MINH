import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLAYGROUND_QUIZ_ITEMS } from '../data/lessonData.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { PlaygroundScene } from './PlaygroundScene.tsx';
import { MascotCharacter } from './MascotCharacter.tsx';

interface PictureQuizProps {
  onCompleteStation: (stars: number) => void;
  onBackToMap: () => void;
}

export const PictureQuiz: React.FC<PictureQuizProps> = ({
  onCompleteStation,
  onBackToMap,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = PLAYGROUND_QUIZ_ITEMS[currentIdx];

  const handleSelectHotspot = (itemId: string) => {
    const idx = PLAYGROUND_QUIZ_ITEMS.findIndex((q) => q.id === itemId);
    if (idx !== -1) {
      sound.playClick();
      setCurrentIdx(idx);
      setSelectedOpt(null);
      setIsAnswered(false);
      speakVietnameseFemale(PLAYGROUND_QUIZ_ITEMS[idx].question, { role: 'teacher' });
    }
  };

  const handleChoose = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (optIdx === currentItem.correctIndex) {
      sound.playSuccess();
      setScore((prev) => prev + 1);
      // Cheerful English encouragement
      speakText('Great job! ' + currentItem.englishAnswer, 'en-US');
    } else {
      sound.playWrong();
      // Show correct answer and pronounce
      setTimeout(() => {
        speakText(currentItem.options[currentItem.correctIndex], 'vi-VN');
      }, 400);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx + 1 < PLAYGROUND_QUIZ_ITEMS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Completed all 5 questions
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const isLastQuestion = currentIdx + 1 === PLAYGROUND_QUIZ_ITEMS.length;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 border-3 border-purple-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-black uppercase">
              TRẠM 5
            </span>
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">
              LOOK AND CHOOSE • NHÌN TRANH, CHỌN CÂU
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-800">
            Khám Phá Sân Chơi Thể Thao
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs md:text-sm text-slate-600 font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-600 inline shrink-0" />
              <span>Chạm vào các bạn nhỏ trên tranh hoặc trả lời lần lượt 5 câu hỏi dưới đây nhé!</span>
            </p>
            <button
              type="button"
              onClick={() => speakVietnameseFemale('Chạm vào các bạn nhỏ trên tranh hoặc trả lời lần lượt 5 câu hỏi dưới đây nhé!', { role: 'teacher' })}
              className="p-1 rounded-full text-purple-600 hover:bg-purple-100 transition-colors shrink-0"
              title="Nghe cô Tuyết hướng dẫn"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counter and back */}
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 border-2 border-purple-300 text-purple-950 px-4 py-2 rounded-2xl font-black text-sm">
            Câu {currentIdx + 1} / {PLAYGROUND_QUIZ_ITEMS.length} (Đúng: {score})
          </div>
          <button
            type="button"
            onClick={onBackToMap}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Bản đồ
          </button>
        </div>
      </div>

      {/* Main Dual Zone Stage: Interactive Playground Canvas on Top/Left, Quiz Deck on Bottom/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Playground Canvas (7 cols on Desktop) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-black text-purple-900 uppercase">
            <span>BỨC TRANH NGÀY HỘI THỂ THAO TRƯỜNG TIỂU HỌC</span>
            <span className="text-purple-600 font-bold">Chạm vào nhân vật để chọn câu hỏi</span>
          </div>

          <PlaygroundScene
            activeCharacterId={currentItem.id}
            onSelectCharacter={handleSelectHotspot}
          />
        </div>

        {/* Quiz Deck (5 cols on Desktop) */}
        <div className="lg:col-span-5 bg-white border-4 border-purple-300 rounded-3xl p-5 md:p-6 shadow-xl space-y-5">
          {/* Header tag */}
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <span className="text-xs font-black text-purple-800 uppercase tracking-wide bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              {currentItem.characterName}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Câu hỏi {currentIdx + 1}/5
            </span>
          </div>

          {/* Question text with speaker button */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg md:text-xl font-black text-slate-900 leading-snug">
              {currentItem.question}
            </h2>
            <button
              type="button"
              onClick={() => speakVietnameseFemale(currentItem.question, { role: 'teacher' })}
              className="p-1 rounded-full text-purple-700 hover:bg-purple-100 transition-colors shrink-0 mt-0.5"
              title="Nghe câu hỏi tiếng Việt"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bilingual conversation hint */}
          <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-indigo-900">
            <div>
              <span className="block text-[11px] text-purple-700 uppercase font-black">
                Giao tiếp song ngữ:
              </span>
              <span>&ldquo;{currentItem.englishQuestion}&rdquo;</span>
            </div>
            <button
              type="button"
              onClick={() => speakText(currentItem.englishQuestion, 'en-US')}
              className="p-1.5 rounded-full bg-white text-indigo-700 hover:bg-purple-100 shadow-sm"
              title="Nghe câu hỏi tiếng Anh"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Options */}
          <div className="space-y-3">
            {currentItem.options.map((optText, optIdx) => {
              const isSelected = selectedOpt === optIdx;
              const isCorrect = optIdx === currentItem.correctIndex;

              let style = 'bg-slate-50 hover:bg-purple-50 border-slate-200 text-slate-800';
              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-md';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleChoose(optIdx)}
                  className={`w-full p-4 rounded-2xl border-3 text-left font-bold text-base transition-all flex items-center justify-between cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{optText}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakVietnameseFemale(optText.replace(/^[A-Z]\.\s*/, ''), { role: 'teacher' });
                      }}
                      className="p-1 rounded-full hover:bg-purple-200/60 text-purple-800 transition-colors"
                      title="Nghe lựa chọn này"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & English answer when answered */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2 animate-float">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-800">
                  Đáp án chuẩn tiếng Việt:
                </span>
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale(currentItem.options[currentItem.correctIndex].replace(/^[A-Z]\.\s*/, ''), { role: 'teacher' })}
                  className="p-1 rounded-full text-amber-800 hover:bg-amber-200 flex items-center gap-1 text-xs font-bold"
                  title="Nghe đáp án tiếng Việt"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe tiếng Việt</span>
                </button>
              </div>
              <p className="text-base font-bold text-slate-900">
                &ldquo;{currentItem.options[currentItem.correctIndex].replace(/^[A-Z]\.\s*/, '')}&rdquo;
              </p>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-800">
                  English Answer:
                </span>
                <button
                  type="button"
                  onClick={() => speakText(currentItem.englishAnswer, 'en-US')}
                  className="p-1 rounded-full text-indigo-700 hover:bg-indigo-100 flex items-center gap-1 text-xs font-bold"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen English</span>
                </button>
              </div>
              <p className="text-base font-extrabold text-indigo-900 italic">
                &ldquo;{currentItem.englishAnswer}&rdquo;
              </p>
            </div>
          )}

          {/* Next Button or Station Completion Button */}
          {isAnswered && (
            <div>
              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>CÂU TIẾP THEO</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onCompleteStation(3)}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer animate-wiggle"
                >
                  <span>HOÀN THÀNH – MỞ KHÓA TRẠM 6</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mascot Cheer */}
      <div className="bg-white/95 border-3 border-amber-300 rounded-3xl p-4 md:p-6 shadow-xl">
        <MascotCharacter
          mascot="nam"
          pose={isAnswered ? 'cheer' : 'think'}
          size="sm"
          speechVi="Quan sát thật kỹ tranh sân trường để thấy từng bạn đang tham gia môn thể thao nào nhé!"
          speechEn="Look closely at the playground to see what each friend is doing!"
        />
      </div>
    </div>
  );
};
