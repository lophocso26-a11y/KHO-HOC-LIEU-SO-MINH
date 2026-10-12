import React, { useState, useEffect } from 'react';
import { Volume2, Check, Settings2, X, Sparkles, Play, Square, RotateCcw, Award } from 'lucide-react';
import { 
  speakVietnameseFemale, 
  stopSpeaking,
  replaySpeaking,
  getIsSpeaking,
  addSpeechListener
} from '../utils/audio.ts';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MANDATORY_TEST_PHRASES = [
  {
    id: 1,
    title: 'Câu 1: Lời chào mừng ngày hội',
    text: 'Xin chào các em yêu quý! Chào mừng các em đến với Ngày hội thể thao và vui chơi!',
    role: 'teacher' as const,
    speaker: 'Cô giáo Tuyết',
  },
  {
    id: 2,
    title: 'Câu 2: Hướng dẫn quan sát tranh',
    text: 'Các em hãy quan sát thật kỹ bức tranh và chọn câu nêu hoạt động phù hợp nhé!',
    role: 'teacher' as const,
    speaker: 'Cô giáo Tuyết',
  },
  {
    id: 3,
    title: 'Câu 3: Lời khen ngợi khi trả lời đúng',
    text: 'Chính xác! Cô khen em!',
    role: 'teacher' as const,
    speaker: 'Cô giáo Tuyết',
  },
  {
    id: 4,
    title: 'Câu 4: Lời động viên khi làm chưa đúng',
    text: 'Chưa đúng rồi, em hãy thử lại nhé!',
    role: 'teacher' as const,
    speaker: 'Cô giáo Tuyết',
  },
  {
    id: 5,
    title: 'Câu 5: Giao nhiệm vụ ghép câu hoàn chỉnh',
    text: 'Các em hãy sắp xếp các từ ngữ để tạo thành một câu nêu hoạt động hoàn chỉnh.',
    role: 'teacher' as const,
    speaker: 'Cô giáo Tuyết',
  },
];

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [isSpeaking, setIsSpeaking] = useState(getIsSpeaking());
  const [currentText, setCurrentText] = useState('');
  const [activePhraseId, setActivePhraseId] = useState<number | null>(null);

  useEffect(() => {
    const unsub = addSpeechListener((speaking, text) => {
      setIsSpeaking(speaking);
      setCurrentText(text);
      if (!speaking) {
        setActivePhraseId(null);
      }
    });
    return () => {
      unsub();
    };
  }, []);

  if (!isOpen) return null;

  const handlePlayPhrase = (phrase: typeof MANDATORY_TEST_PHRASES[0]) => {
    if (isSpeaking && activePhraseId === phrase.id) {
      stopSpeaking();
      setActivePhraseId(null);
      return;
    }

    setActivePhraseId(phrase.id);
    speakVietnameseFemale(phrase.text, {
      role: phrase.role,
      onEnd: () => setActivePhraseId(null),
    });
  };

  const handleTestRole = (role: 'teacher' | 'lan' | 'nam') => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const testText =
      role === 'teacher'
        ? 'Xin chào các em học sinh lớp 2A7! Cô Tuyết rất vui được cùng các em học bài Ngày hội thể thao và vui chơi!'
        : role === 'lan'
        ? 'Xin chào các bạn! Mình là bé Lan, chúng mình cùng nhảy dây và thi đua nhé!'
        : 'Xin chào các bạn! Mình là bé Nam, cùng mình đá bóng và chạy thật nhanh nào!';

    speakVietnameseFemale(testText, { role });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 md:p-7 max-w-xl w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center font-black text-xl shadow-md">
              🎙️
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                Giọng Đọc AI Giáo Viên Tiểu Học
              </h3>
              <p className="text-xs text-rose-600 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mô hình Gemini TTS AI (gemini-3.8-flash-lite-tts)</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Status Banner */}
        <div className="p-3 bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
          <span className="text-2xl">👩‍🏫</span>
          <div className="text-xs text-slate-700 space-y-1">
            <span className="font-black text-amber-950 block text-xs md:text-sm">
              Giọng Nữ Cô Giáo Nguyễn Thị Tuyết (Chuẩn Tiếng Việt Có Dấu)
            </span>
            <p className="leading-snug">
              Toàn bộ giọng đọc trên website được tạo bởi <strong>Gemini AI TTS</strong> qua máy chủ backend, phát âm chuẩn xác từng dấu thanh (hỏi, ngã, sắc, huyền, nặng), ngắt nghỉ tự nhiên, ấm áp và khích lệ học sinh lớp 2. Âm thanh được lưu trữ tự động để phát lại tức thì.
            </p>
          </div>
        </div>

        {/* Global Controls when Speaking */}
        {isSpeaking && (
          <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-black text-rose-900">
                Đang phát: &ldquo;{currentText.slice(0, 45)}...&rdquo;
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={stopSpeaking}
                className="px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-xl shadow-sm hover:bg-rose-700 flex items-center gap-1"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Dừng</span>
              </button>
              <button
                type="button"
                onClick={replaySpeaking}
                className="p-1 text-rose-700 hover:bg-rose-100 rounded-xl"
                title="Phát lại"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 5 Mandatory Test Phrases Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              Kiểm tra 5 câu tiếng Việt có dấu chuẩn:
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              Nhấn nút loa để nghe thử
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {MANDATORY_TEST_PHRASES.map((phrase) => {
              const isThisPlaying = isSpeaking && activePhraseId === phrase.id;
              return (
                <div
                  key={phrase.id}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                    isThisPlaying
                      ? 'bg-amber-100/90 border-amber-400 shadow-md ring-2 ring-amber-300'
                      : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-wide block">
                      {phrase.title}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      &ldquo;{phrase.text}&rdquo;
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlayPhrase(phrase)}
                    className={`shrink-0 p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      isThisPlaying
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-white hover:bg-amber-500 text-amber-900 hover:text-white border border-amber-200'
                    }`}
                    title={isThisPlaying ? 'Dừng phát' : 'Nghe câu này'}
                  >
                    {isThisPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Nghe</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mascot Voice Character Testing */}
        <div className="space-y-2 pt-2 border-t border-amber-100">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            Nghe thử 3 vai nhân vật trong ngày hội:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleTestRole('teacher')}
              className="py-2.5 px-2 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-black text-xs text-center transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="text-lg">👩‍🏫</span>
              <span>Cô giáo Tuyết</span>
            </button>
            <button
              type="button"
              onClick={() => handleTestRole('lan')}
              className="py-2.5 px-2 rounded-2xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-950 font-black text-xs text-center transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="text-lg">👧</span>
              <span>Bé Lan (2A7)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTestRole('nam')}
              className="py-2.5 px-2 rounded-2xl bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-950 font-black text-xs text-center transition-all cursor-pointer flex flex-col items-center gap-1"
            >
              <span className="text-lg">👦</span>
              <span>Bé Nam (2A7)</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-between border-t border-amber-100 text-xs">
          <span className="text-slate-500 font-medium">
            Tách biệt audio Tiếng Việt &amp; Tiếng Anh riêng biệt.
          </span>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="py-2.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
