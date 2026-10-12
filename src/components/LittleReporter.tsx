import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, Award, ArrowRight, Lightbulb, HelpCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { REPORTER_PROMPTS } from '../data/lessonData.ts';
import { ReporterPrompt } from '../types.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { SportIllustration } from './SportIllustrations.tsx';
import { MascotCharacter, NamSvg } from './MascotCharacter.tsx';

interface LittleReporterProps {
  savedSentence: string;
  onSaveSentence: (sentence: string) => void;
  onCompleteStation: (stars: number) => void;
  onBackToMap: () => void;
}

export const LittleReporter: React.FC<LittleReporterProps> = ({
  savedSentence,
  onSaveSentence,
  onCompleteStation,
  onBackToMap,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<ReporterPrompt>(REPORTER_PROMPTS[0]);
  const [inputText, setInputText] = useState(savedSentence || '');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Feedback state from Teacher Tuyết
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'valid' | 'needs_work';
    title: string;
    details: string;
  }>({
    status: 'idle',
    title: 'Gợi ý từ cô giáo Nguyễn Thị Tuyết:',
    details: 'Em hãy chọn một hoạt động, sau đó viết hoặc nói câu nêu hoạt động gồm: [Ai / Con gì] + [Làm gì (từ chỉ hoạt động)] nhé!',
  });

  const [hasAwardedBadge, setHasAwardedBadge] = useState(false);

  // Speech Recognition API if available
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const rec = new (SpeechRecognition as new () => {
            lang: string;
            continuous: boolean;
            interimResults: boolean;
            onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
            onerror: (e: { error: string }) => void;
            onend: () => void;
            start: () => void;
            stop: () => void;
          })();
          rec.lang = 'vi-VN';
          rec.continuous = false;
          rec.interimResults = false;

          rec.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              setInputText(transcript);
              validateSentence(transcript);
            }
          };

          rec.onerror = (err) => {
            console.warn('Speech recognition error:', err);
            setRecordingError('Trình duyệt chưa nhận diện được âm thanh. Em có thể nhập câu vào ô văn bản bên dưới nhé!');
            setIsRecording(false);
          };

          rec.onend = () => {
            setIsRecording(false);
          };

          recognitionRef.current = rec;
        } catch {
          // Fallback to media recorder or manual typing
        }
      }
    }
  }, []);

  const handleSelectActivity = (p: ReporterPrompt) => {
    sound.playClick();
    setSelectedPrompt(p);
  };

  const startRecording = async () => {
    sound.playClick();
    setRecordingError(null);

    // Try Speech Recognition first
    if (recognitionRef.current) {
      try {
        const rec = recognitionRef.current as { start: () => void };
        rec.start();
        setIsRecording(true);
        return;
      } catch (err) {
        console.warn('Could not start SpeechRecognition:', err);
      }
    }

    // Otherwise use MediaRecorder for audio recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone permission denied or not available:', err);
        setRecordingError('Chưa được cấp quyền Micro. Em hãy gõ câu trực tiếp vào ô văn bản phía dưới nhé!');
      }
    } else {
      setRecordingError('Trình duyệt hiện tại chưa hỗ trợ micro trực tiếp. Em hãy gõ câu trực tiếp vào ô văn bản nhé!');
    }
  };

  const stopRecording = () => {
    sound.playClick();
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        (recognitionRef.current as { stop: () => void }).stop();
      } catch {}
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  /**
   * Rule-based pedagogical validator for Grade 2 action sentences:
   * 1. Checks basic length (at least 3 words)
   * 2. Checks presence of action keywords (đá bóng, nhảy dây, đạp xe, bơi, chạy, chơi, etc.)
   * 3. Provides intelligent constructive guidance from Teacher Tuyết
   */
  const validateSentence = (sentence: string) => {
    const trimmed = sentence.trim();
    if (!trimmed) {
      setFeedback({
        status: 'needs_work',
        title: 'Lời khuyên từ cô Tuyết:',
        details: 'Em chưa nhập câu. Hãy quan sát tranh và viết một câu hoàn chỉnh nhé!',
      });
      return;
    }

    const words = trimmed.split(/\s+/);
    if (words.length < 3) {
      sound.playWrong();
      setFeedback({
        status: 'needs_work',
        title: 'Câu hơi ngắn:',
        details: 'Câu cần có đầy đủ người thực hiện và hoạt động. Ví dụ: "Nam đang đá bóng." Em hãy viết thêm nhé!',
      });
      return;
    }

    const lower = trimmed.toLowerCase();
    const actionKeywords = [
      'đá bóng', 'chơi bóng', 'nhảy dây', 'đạp xe', 'đi xe', 'bơi', 'bơi lội',
      'chạy', 'chạy bộ', 'chơi cầu lông', 'đánh cầu lông', 'tập thể dục', 'vận động',
      'chuyền bóng', 'sút bóng'
    ];

    const hasAction = actionKeywords.some((act) => lower.includes(act));

    if (hasAction) {
      sound.playSuccess();
      setFeedback({
        status: 'valid',
        title: 'Cô Tuyết khen ngợi:',
        details: `Rất tốt! Câu "${trimmed}" của em đã nêu đúng hoạt động và rất sinh động!`,
      });
      onSaveSentence(trimmed);
      setHasAwardedBadge(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sound.playWrong();
      setFeedback({
        status: 'needs_work',
        title: 'Lưu ý từ cô Tuyết:',
        details: 'Câu của em nên có từ chỉ hoạt động thể thao (như: chạy, bơi, đá bóng, nhảy dây, đạp xe, chơi cầu lông). Em hãy bổ sung thêm nhé!',
      });
    }
  };

  const handleSubmitText = () => {
    validateSentence(inputText);
  };

  const handleUseSample = () => {
    sound.playClick();
    setInputText(selectedPrompt.sampleSentenceVi);
    validateSentence(selectedPrompt.sampleSentenceVi);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 border-3 border-pink-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-xs font-black uppercase">
              TRẠM 6
            </span>
            <span className="text-xs font-extrabold text-pink-600 uppercase tracking-wider">
              LITTLE REPORTER • PHÓNG VIÊN NHÍ
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-800">
            Thử Tài Làm Phóng Viên Thể Thao
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-pink-600 inline" />
            <span>Cầm micro phỏng vấn ngày hội: Chọn một môn thể thao, sau đó nói hoặc viết câu nêu hoạt động!</span>
          </p>
        </div>

        {/* Action and back */}
        <div className="flex items-center gap-3">
          {hasAwardedBadge && (
            <div className="bg-pink-100 border-2 border-pink-300 text-pink-950 px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5">
              <Award className="w-4 h-4 text-pink-600" />
              <span>Huy hiệu Phóng Viên Nhí!</span>
            </div>
          )}
          <button
            type="button"
            onClick={onBackToMap}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Bản đồ
          </button>
        </div>
      </div>

      {/* Main Dual Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Sports Selector & Illustration Card (5 cols) */}
        <div className="lg:col-span-5 bg-white border-4 border-pink-300 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100 pb-2">
            <span className="text-xs font-black uppercase text-pink-700">
              1. Chọn môn thể thao em muốn phỏng vấn:
            </span>
          </div>

          {/* Activity chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REPORTER_PROMPTS.map((p) => {
              const isSelected = p.id === selectedPrompt.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectActivity(p)}
                  className={`p-2.5 rounded-2xl font-bold text-xs text-center border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pink-500 border-pink-600 text-white shadow-md scale-102'
                      : 'bg-slate-50 hover:bg-pink-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block">{p.labelVi}</span>
                  <span className="text-[10px] opacity-80 uppercase block">{p.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Picture preview */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-pink-200">
            <SportIllustration sportId={selectedPrompt.activityId} />
          </div>

          {/* Sample sentence & bilingual speech button */}
          <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-pink-900 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Câu mẫu tham khảo:
              </span>
              <button
                type="button"
                onClick={handleUseSample}
                className="text-[11px] font-bold text-pink-700 hover:text-pink-900 underline"
              >
                Dùng câu mẫu này
              </button>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-800">
              <span>&ldquo;{selectedPrompt.sampleSentenceVi}&rdquo;</span>
              <button
                type="button"
                onClick={() => speakVietnameseFemale(selectedPrompt.sampleSentenceVi, { role: 'teacher' })}
                className="p-1 rounded-full text-pink-700 hover:bg-pink-100 transition-colors shrink-0"
                title="Nghe câu mẫu tiếng Việt"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 italic pt-1 border-t border-pink-200/60">
              <span>{selectedPrompt.sampleSentenceEn}</span>
              <button
                type="button"
                onClick={() => speakText(selectedPrompt.sampleSentenceEn, 'en-US')}
                className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100"
                title="Nghe tiếng Anh"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Reporter Mic & Sentence Input Deck (7 cols) */}
        <div className="lg:col-span-7 bg-white border-4 border-pink-300 rounded-3xl p-5 md:p-6 shadow-xl space-y-5">
          {/* Nam & Lan with Reporter Mic Illustration */}
          <div className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200 rounded-2xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20">
                <NamSvg pose="mic" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-black text-pink-950">
                  Micro Phóng Viên Nhí 2A7
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  &ldquo;Hãy nói hoặc gõ một câu nêu hoạt động thật hay nào!&rdquo;
                </p>
              </div>
            </div>

            {/* Microphone Recording Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-4 rounded-full font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-105'
              }`}
              title={isRecording ? 'Nhấn để dừng ghi âm' : 'Nhấn để bật micro nói'}
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="text-xs sm:text-sm font-bold hidden sm:inline">
                {isRecording ? 'Đang nghe...' : 'Bật Micro'}
              </span>
            </button>
          </div>

          {/* Micro Recording Notice if any */}
          {recordingError && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5 font-medium">
              ℹ️ {recordingError}
            </p>
          )}

          {recordedAudioUrl && (
            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-2xl border border-pink-200">
              <span className="text-xs font-bold text-pink-900">Giọng nói đã thu âm:</span>
              <audio src={recordedAudioUrl} controls className="h-8 max-w-xs" />
            </div>
          )}

          {/* Text Input Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                2. Nhập câu nêu hoạt động tiếng Việt của em:
              </label>
              {inputText.trim() && (
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale(inputText, { role: 'teacher' })}
                  className="px-2.5 py-1 bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs rounded-full flex items-center gap-1 transition-colors"
                  title="Nghe đọc lại câu của em"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Đọc câu của em</span>
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ví dụ: Bạn Lan đang chơi cầu lông cùng bạn bè..."
                rows={3}
                className="w-full p-4 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 text-base md:text-lg font-bold text-slate-800 outline-none resize-none transition-all"
              />
              <button
                type="button"
                onClick={handleSubmitText}
                className="absolute right-3 bottom-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs md:text-sm rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
              >
                <span>Kiểm tra</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Teacher Tuyết's Feedback Box */}
          <div
            className={`p-4 rounded-2xl border-2 space-y-1 transition-all ${
              feedback.status === 'valid'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : feedback.status === 'needs_work'
                ? 'bg-amber-50 border-amber-400 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {feedback.status === 'valid' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                )}
                <h4 className="text-sm font-black">{feedback.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => speakVietnameseFemale(feedback.title + '. ' + feedback.details, { role: 'teacher' })}
                className="p-1 rounded-full hover:bg-black/10 text-slate-700 transition-colors shrink-0"
                title="Nghe cô nhận xét"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-medium pl-7">{feedback.details}</p>
          </div>

          {/* Award Badge Display & Next Stage Button */}
          {hasAwardedBadge && (
            <div className="p-4 bg-gradient-to-r from-amber-100 via-pink-100 to-rose-100 border-2 border-pink-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-2xl shadow-md">
                  🎖️
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-black text-pink-950">
                    TRAO HUY HIỆU: PHÓNG VIÊN NHÍ XUẤT SẮC
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold">
                    Em đã tự tin đặt câu nêu hoạt động trong ngày hội thể thao!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCompleteStation(3)}
                className="w-full sm:w-auto py-3 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>ĐẾN CỔNG KẾT THÚC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
