import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Volume2, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SENTENCE_BUILDER_TASKS } from '../data/lessonData.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { MascotCharacter } from './MascotCharacter.tsx';

interface SentenceBuilderProps {
  onCompleteStation: (stars: number) => void;
  onBackToMap: () => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  onCompleteStation,
  onBackToMap,
}) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const currentTask = SENTENCE_BUILDER_TASKS[taskIndex];

  // Available tokens bank (shuffled)
  const [bankTokens, setBankTokens] = useState<string[]>(() => {
    return [...SENTENCE_BUILDER_TASKS[0].tokens].sort(() => Math.random() - 0.5);
  });

  // Selected tokens in sentence area
  const [placedTokens, setPlacedTokens] = useState<string[]>([]);

  // Validation feedback state: null | 'correct' | 'wrong'
  const [validationStatus, setValidationStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const handlePickToken = (token: string, tokenIdx: number) => {
    sound.playClick();
    speakVietnameseFemale(token.replace(/\.$/, ''), { role: 'teacher' });
    setPlacedTokens((prev) => [...prev, token]);
    setBankTokens((prev) => prev.filter((_, i) => i !== tokenIdx));
    setValidationStatus('idle');
  };

  const handleRemovePlacedToken = (token: string, tokenIdx: number) => {
    sound.playClick();
    setPlacedTokens((prev) => prev.filter((_, i) => i !== tokenIdx));
    setBankTokens((prev) => [...prev, token]);
    setValidationStatus('idle');
  };

  const handleCheck = () => {
    if (placedTokens.length === 0) return;
    const constructedSentence = placedTokens.join(' ').trim();
    // Normalize string compare
    const cleanConstructed = constructedSentence.replace(/\s+/g, ' ');
    const cleanTarget = currentTask.targetSentence.replace(/\s+/g, ' ');

    if (cleanConstructed === cleanTarget) {
      // Correct!
      sound.playSuccess();
      setValidationStatus('correct');
      speakText(cleanTarget, 'vi-VN');
      setCompletedTasksCount((prev) => Math.max(prev, taskIndex + 1));

      if (taskIndex + 1 === SENTENCE_BUILDER_TASKS.length) {
        sound.playFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } else {
      // Wrong
      sound.playWrong();
      setValidationStatus('wrong');
    }
  };

  const handleResetCurrent = () => {
    sound.playClick();
    setPlacedTokens([]);
    setBankTokens([...currentTask.tokens].sort(() => Math.random() - 0.5));
    setValidationStatus('idle');
  };

  const handleNextTask = () => {
    sound.playClick();
    if (taskIndex + 1 < SENTENCE_BUILDER_TASKS.length) {
      const nextIndex = taskIndex + 1;
      setTaskIndex(nextIndex);
      setPlacedTokens([]);
      setBankTokens([...SENTENCE_BUILDER_TASKS[nextIndex].tokens].sort(() => Math.random() - 0.5));
      setValidationStatus('idle');
    }
  };

  const handleSpeakSample = () => {
    speakText(currentTask.targetSentence, 'vi-VN');
  };

  const handleSpeakEnglish = () => {
    speakText(currentTask.englishSentence, 'en-US');
  };

  const isAllTasksDone = completedTasksCount >= SENTENCE_BUILDER_TASKS.length;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 border-3 border-blue-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-black uppercase">
              TRẠM 4
            </span>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              MAKE A SENTENCE • GHÉP THÀNH CÂU
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-800">
            Ghép Từ Thành Câu Hoàn Chỉnh
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs md:text-sm text-slate-600 font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600 inline shrink-0" />
              <span>&ldquo;Make a sentence!&rdquo; – Chạm vào các thẻ từ để xếp thành câu nêu hoạt động có nghĩa.</span>
            </p>
            <button
              type="button"
              onClick={() => speakVietnameseFemale('Các em hãy sắp xếp các từ ngữ để tạo thành một câu nêu hoạt động hoàn chỉnh.', { role: 'teacher' })}
              className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors shrink-0"
              title="Nghe cô Tuyết giao nhiệm vụ"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counter and back */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 border-2 border-blue-300 text-blue-950 px-4 py-2 rounded-2xl font-black text-sm">
            Câu {taskIndex + 1} / {SENTENCE_BUILDER_TASKS.length}
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

      {/* Main Builder Stage */}
      <div className="bg-white border-4 border-blue-300 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Sample audio & Hint bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-xs md:text-sm font-bold text-blue-900">
              Gợi ý: {currentTask.hint}
            </span>
            <button
              type="button"
              onClick={() => speakVietnameseFemale('Gợi ý: ' + currentTask.hint, { role: 'teacher' })}
              className="p-1 rounded-full text-blue-700 hover:bg-blue-100 transition-colors"
              title="Nghe gợi ý"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSpeakSample}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Nghe câu mẫu
            </button>
            <button
              type="button"
              onClick={handleSpeakEnglish}
              className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Listen in English
            </button>
          </div>
        </div>

        {/* Sentence Drop / Placement Zone */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            KHU VỰC GHÉP CÂU (Chạm vào từ để đưa vào câu hoặc gỡ ra):
          </label>
          <div
            className={`min-h-[100px] rounded-3xl p-4 md:p-6 border-3 transition-all flex flex-wrap items-center gap-3 ${
              validationStatus === 'correct'
                ? 'bg-emerald-50 border-emerald-400 shadow-md ring-4 ring-emerald-100'
                : validationStatus === 'wrong'
                ? 'bg-rose-50 border-rose-400 animate-wiggle'
                : 'bg-slate-50/80 border-dashed border-blue-300'
            }`}
          >
            {placedTokens.length === 0 ? (
              <span className="text-sm md:text-base font-bold text-slate-400 italic">
                👉 Nhấn các thẻ từ bên dưới để ghép vào đây...
              </span>
            ) : (
              placedTokens.map((tok, i) => (
                <button
                  key={`${tok}-${i}`}
                  type="button"
                  onClick={() => handleRemovePlacedToken(tok, i)}
                  className="px-5 py-3 rounded-2xl bg-white border-2 border-blue-400 text-blue-900 font-black text-lg md:text-xl shadow-md hover:bg-rose-50 hover:border-rose-400 hover:text-rose-700 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                  title="Chạm để gỡ ra"
                >
                  {tok}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Available Tokens Bank */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            CÁC THẺ TỪ CẦN SẮP XẾP:
          </label>
          <div className="flex flex-wrap gap-3 min-h-[60px] p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
            {bankTokens.length === 0 ? (
              <span className="text-xs font-semibold text-slate-500 italic">
                Đã đưa hết thẻ vào khu vực ghép câu. Hãy bấm &ldquo;KIỂM TRA&rdquo; nhé!
              </span>
            ) : (
              bankTokens.map((tok, i) => (
                <button
                  key={`${tok}-${i}`}
                  type="button"
                  onClick={() => handlePickToken(tok, i)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-lg md:text-xl shadow-md border-2 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {tok}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Validation Result Banner */}
        {validationStatus === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-float">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-base font-black text-emerald-950">
                  Chính xác! Câu hoàn chỉnh: &ldquo;{currentTask.targetSentence}&rdquo;
                </h4>
                <p className="text-xs font-bold text-emerald-800 italic">
                  Tiếng Anh: &ldquo;{currentTask.englishSentence}&rdquo;
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => speakVietnameseFemale(currentTask.targetSentence, { role: 'teacher' })}
                className="px-3 py-1.5 rounded-full bg-emerald-200 text-emerald-900 hover:bg-emerald-300 font-bold text-xs flex items-center gap-1.5"
                title="Nghe tiếng Việt"
              >
                <Volume2 className="w-4 h-4" />
                <span>Tiếng Việt</span>
              </button>
              <button
                type="button"
                onClick={() => speakText(currentTask.englishSentence, 'en-US')}
                className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-900 hover:bg-indigo-200 font-bold text-xs flex items-center gap-1.5"
                title="Listen in English"
              >
                <Volume2 className="w-4 h-4" />
                <span>English</span>
              </button>
            </div>
          </div>
        )}

        {validationStatus === 'wrong' && (
          <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-base font-black text-rose-950">
                  Chưa đúng thứ tự rồi! Em hãy đọc lại gợi ý và thử lại nhé!
                </h4>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakVietnameseFemale('Chưa đúng rồi, em hãy thử lại nhé!', { role: 'teacher' })}
              className="p-1.5 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-900 shrink-0"
              title="Nghe cô động viên"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={placedTokens.length === 0}
              className={`py-3 px-8 rounded-full font-black text-base shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                placedTokens.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transform hover:scale-105 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>KIỂM TRA</span>
            </button>

            <button
              type="button"
              onClick={handleResetCurrent}
              className="py-3 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>LÀM LẠI</span>
            </button>
          </div>

          {/* Next Task or Complete Station Button */}
          {validationStatus === 'correct' && (
            <div>
              {taskIndex + 1 < SENTENCE_BUILDER_TASKS.length ? (
                <button
                  type="button"
                  onClick={handleNextTask}
                  className="py-3.5 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base shadow-lg flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>CÂU TIẾP THEO</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onCompleteStation(3)}
                  className="py-3.5 px-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer animate-wiggle"
                >
                  <span>HOÀN THÀNH – MỞ KHÓA TRẠM 5</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lan mascot congratulating */}
      <div className="bg-white/95 border-3 border-amber-300 rounded-3xl p-4 md:p-6 shadow-xl">
        <MascotCharacter
          mascot="lan"
          pose={isAllTasksDone ? 'cheer' : 'wave'}
          size="sm"
          speechVi={
            isAllTasksDone
              ? 'Tuyệt vời lắm! Bạn đã ghép thành công tất cả các câu nêu hoạt động rồi!'
              : 'Hãy chú ý: Câu nêu hoạt động thường bắt đầu bằng người hoặc vật thực hiện hoạt động nhé!'
          }
          speechEn={
            isAllTasksDone
              ? 'Awesome job! You built all sentences perfectly!'
              : 'Remember: Start with who is doing the action!'
          }
        />
      </div>
    </div>
  );
};
