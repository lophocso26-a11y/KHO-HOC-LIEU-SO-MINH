import React, { useState } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACTION_SENTENCE_QUESTIONS } from '../data/lessonData.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { SportIllustration } from './SportIllustrations.tsx';
import { MascotCharacter } from './MascotCharacter.tsx';

interface ActionSentencesProps {
  onCompleteStation: (stars: number) => void;
  onBackToMap: () => void;
}

export const ActionSentences: React.FC<ActionSentencesProps> = ({
  onCompleteStation,
  onBackToMap,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummaryCard, setShowSummaryCard] = useState(false);

  const currentQ = ACTION_SENTENCE_QUESTIONS[currentIndex];

  const handleChooseOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(optIdx);
    setIsAnswered(true);

    if (optIdx === currentQ.correctIndex) {
      sound.playSuccess();
      setCorrectCount((prev) => prev + 1);
      speakText(currentQ.optionsVi[optIdx], 'vi-VN');
    } else {
      sound.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < ACTION_SENTENCE_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      // Completed all questions
      setShowSummaryCard(true);
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePronounce = (text: string, lang: 'vi-VN' | 'en-US') => {
    speakText(text, lang);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 border-3 border-amber-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black uppercase">
              TRẠM 3
            </span>
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
              ACTION SENTENCES • CÂU NÊU HOẠT ĐỘNG
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-800">
            Nhận Biết Câu Nêu Hoạt Động
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-semibold">
            Quan sát tranh và chọn câu tiếng Việt nêu đúng hoạt động của nhân vật nhé!
          </p>
        </div>

        {/* Counter and back */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 border-2 border-amber-300 text-amber-950 px-4 py-2 rounded-2xl font-black text-sm">
            Câu {currentIndex + 1} / {ACTION_SENTENCE_QUESTIONS.length}
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

      {!showSummaryCard ? (
        /* Question Card */
        <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Illustration */}
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-2 border-amber-200">
              <SportIllustration sportId={currentQ.imagePrompt} />
            </div>

            {/* Right: Question and 3 options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
                  Nhân vật: {currentQ.character}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Chọn 1 đáp án đúng nhất
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                  Bức tranh trên thể hiện câu nêu hoạt động nào?
                </h2>
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale('Bức tranh trên thể hiện câu nêu hoạt động nào?', { role: 'teacher' })}
                  className="p-1 rounded-full text-amber-700 hover:bg-amber-100 transition-colors shrink-0"
                  title="Nghe câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options list */}
              <div className="space-y-3">
                {currentQ.optionsVi.map((optionText, optIdx) => {
                  const isSelected = selectedOptionIndex === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;

                  let btnStyle = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black shadow-md';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleChooseOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border-3 text-left font-bold text-base md:text-lg transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{optionText}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakVietnameseFemale(optionText.replace(/^[A-Z]\.\s*/, ''), { role: 'teacher' });
                          }}
                          className="p-1 rounded-full hover:bg-amber-200/60 text-amber-800 transition-colors"
                          title="Nghe câu này"
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

              {/* Feedback box when answered */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2 animate-float">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-indigo-700">
                      Tích hợp Tiếng Anh:
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePronounce(currentQ.englishSentence, 'en-US')}
                      className="p-1 rounded-full text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Volume2 className="w-4 h-4" />
                      Nghe phát âm
                    </button>
                  </div>
                  <p className="text-base font-extrabold text-indigo-900 italic">
                    &ldquo;{currentQ.englishSentence}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-700 font-medium">
                      {currentQ.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={() => speakVietnameseFemale(currentQ.explanation, { role: 'teacher' })}
                      className="p-1 rounded-full text-amber-800 hover:bg-amber-200 transition-colors shrink-0 flex items-center gap-1 text-xs font-bold"
                      title="Nghe giải thích"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Next Question Button */}
              {isAnswered && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < ACTION_SENTENCE_QUESTIONS.length
                      ? 'CÂU TIẾP THEO'
                      : 'XEM BẢNG KIẾN THỨC & HOÀN THÀNH'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Knowledge Card Summary (BẢNG KIẾN THỨC BỔ ÍCH) */
        <div className="bg-white border-4 border-amber-400 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-700">
              <BookOpen className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              GHI NHỚ KIẾN THỨC TIẾNG VIỆT LỚP 2
            </h2>
            <p className="text-sm font-extrabold text-amber-700 uppercase">
              BÀI HỌC: CÂU NÊU HOẠT ĐỘNG
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-3 border-amber-300 rounded-3xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📌</span>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-amber-950">
                    Câu nêu hoạt động là gì?
                  </h3>
                  <p className="mt-1 text-base md:text-lg font-bold text-slate-800 leading-relaxed">
                    <span className="text-amber-800 font-black">Câu nêu hoạt động</span> dùng để nói về{' '}
                    <span className="text-rose-600 underline decoration-wavy">hoạt động</span> của người hoặc con vật, đồ vật.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => speakVietnameseFemale('Câu nêu hoạt động là gì? Câu nêu hoạt động dùng để nói về hoạt động của người hoặc con vật, đồ vật.', { role: 'teacher' })}
                className="px-3 py-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                title="Nghe cô giảng bài"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe cô giảng</span>
              </button>
            </div>

            <div className="pt-2 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-slate-800">
              <div className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Ví dụ 1:</span>
                  <span className="text-blue-700">Nam</span> <span className="text-rose-600">đá bóng</span>.
                  <span className="text-xs text-slate-500 block font-normal italic mt-0.5">&ldquo;đá bóng&rdquo; là từ chỉ hoạt động.</span>
                </div>
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale('Nam đá bóng.', { role: 'teacher' })}
                  className="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 shrink-0"
                  title="Nghe câu"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Ví dụ 2:</span>
                  <span className="text-blue-700">Lan</span> <span className="text-rose-600">nhảy dây</span>.
                  <span className="text-xs text-slate-500 block font-normal italic mt-0.5">&ldquo;nhảy dây&rdquo; là từ chỉ hoạt động.</span>
                </div>
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale('Lan nhảy dây.', { role: 'teacher' })}
                  className="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 shrink-0"
                  title="Nghe câu"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Ví dụ 3:</span>
                  <span className="text-blue-700">Các bạn nhỏ</span> <span className="text-rose-600">chơi cầu lông</span>.
                </div>
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale('Các bạn nhỏ chơi cầu lông.', { role: 'teacher' })}
                  className="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 shrink-0"
                  title="Nghe câu"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Ví dụ 4:</span>
                  <span className="text-blue-700">Bạn Mai</span> <span className="text-rose-600">đạp xe</span>.
                </div>
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale('Bạn Mai đạp xe.', { role: 'teacher' })}
                  className="p-1.5 rounded-full hover:bg-amber-100 text-amber-800 shrink-0"
                  title="Nghe câu"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <MascotCharacter
              mascot="lan"
              pose="cheer"
              size="sm"
              speechVi="Các bạn hãy nhớ: Câu nêu hoạt động luôn có từ chỉ hoạt động nhé!"
              speechEn="Action sentences tell what someone is doing!"
            />

            <button
              type="button"
              onClick={() => onCompleteStation(3)}
              className="py-4 px-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer animate-wiggle"
            >
              <span>HOÀN THÀNH – MỞ KHÓA TRẠM 4</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
