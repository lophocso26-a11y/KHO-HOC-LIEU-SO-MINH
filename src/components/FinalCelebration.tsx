import React, { useState, useEffect } from 'react';
import { Trophy, Star, Volume2, Sparkles, ExternalLink, RotateCcw, Home, Award, QrCode, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACTIVITIES_DATA, LESSON_INFO, BADGES_DATA } from '../data/lessonData.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { SportIllustration } from './SportIllustrations.tsx';
import { NamSvg, LanSvg } from './MascotCharacter.tsx';

interface FinalCelebrationProps {
  totalStars: number;
  reporterSentence?: string;
  onRestartAll: () => void;
  onGoToMap: () => void;
}

export const FinalCelebration: React.FC<FinalCelebrationProps> = ({
  totalStars,
  reporterSentence,
  onRestartAll,
  onGoToMap,
}) => {
  // Quizizz configuration state (allows teacher to edit URL or leave blank)
  const [quizizzUrl, setQuizizzUrl] = useState(LESSON_INFO.defaultQuizizzUrl);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customInputUrl, setCustomInputUrl] = useState(LESSON_INFO.defaultQuizizzUrl);
  const [showQrCode, setShowQrCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Final mini challenge state
  const [selectedSportId, setSelectedSportId] = useState(ACTIVITIES_DATA[0].id);
  const [customSentence, setCustomSentence] = useState(reporterSentence || '');
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);

  useEffect(() => {
    sound.playFanfare();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, []);

  const handleLaunchQuizizz = () => {
    sound.playClick();
    if (!quizizzUrl || quizizzUrl.trim() === '') {
      alert('Giáo viên chưa cập nhật liên kết luyện tập. Vui lòng cập nhật liên kết Quizizz!');
      return;
    }
    window.open(quizizzUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (quizizzUrl) {
      navigator.clipboard.writeText(quizizzUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSaveQuizizzConfig = () => {
    setQuizizzUrl(customInputUrl.trim());
    setShowConfigModal(false);
    sound.playSuccess();
  };

  const handleCheckFinalSentence = () => {
    if (!customSentence.trim()) return;
    sound.playSuccess();
    setFinalFeedback(`Cô Tuyết chúc mừng: Câu "${customSentence.trim()}" rất chuẩn và đáng khen!`);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const selectedSport = ACTIVITIES_DATA.find((a) => a.id === selectedSportId) || ACTIVITIES_DATA[0];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Top Navigation Strip */}
      <div className="flex items-center justify-between bg-white/90 border-2 border-amber-300 rounded-3xl p-4 shadow-md">
        <button
          type="button"
          onClick={onGoToMap}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Bản đồ hành trình</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black px-4 py-1.5 rounded-full text-sm shadow">
            <Star className="w-5 h-5 fill-amber-100 text-amber-100" />
            <span>{totalStars} / 18 Sao</span>
          </div>

          <button
            type="button"
            onClick={onRestartAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs transition-colors"
            title="Làm lại toàn bộ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>

      {/* Main The Fun Gate Arch */}
      <div className="relative bg-gradient-to-b from-amber-300 via-orange-200 to-amber-100 border-4 border-amber-400 rounded-3xl p-6 md:p-10 shadow-2xl text-center overflow-hidden">
        {/* Floating Celebration Stars */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-black px-6 py-2 rounded-full shadow-lg text-xs md:text-sm uppercase animate-wiggle">
          <Sparkles className="w-4 h-4" />
          CỔNG VINH QUANG • THE FUN GATE
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight drop-shadow-sm">
          CHÚC MỪNG CÁC NHÀ VÔ ĐỊCH 2A7!
        </h1>
        <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-extrabold text-orange-700 tracking-wide">
          CONGRATULATIONS ON FUN SPORTS DAY!
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-700 font-bold max-w-2xl mx-auto">
          Các em đã hoàn thành xuất sắc 6 trạm học tập môn Tiếng Việt lớp 2 của cô giáo {LESSON_INFO.teacher}!
        </p>

        {/* Audio congratulations buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => speakVietnameseFemale(`Chúc mừng các nhà vô địch 2A7! Các em đã hoàn thành xuất sắc 6 trạm học tập môn Tiếng Việt lớp 2 của cô giáo ${LESSON_INFO.teacher}!`, { role: 'teacher' })}
            className="px-4 py-2 rounded-full bg-white/95 hover:bg-white text-amber-900 font-black text-xs sm:text-sm border-2 border-amber-300 shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            title="Nghe cô Tuyết chúc mừng"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Nghe cô Tuyết chúc mừng</span>
          </button>
          <button
            type="button"
            onClick={() => speakText('Congratulations on Fun Sports Day!', 'en-US')}
            className="px-4 py-2 rounded-full bg-indigo-50/95 hover:bg-indigo-50 text-indigo-900 font-black text-xs sm:text-sm border-2 border-indigo-200 shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            title="Listen in English"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>English Praise</span>
          </button>
        </div>

        {/* Both Mascots with Gold Championship Trophies */}
        <div className="my-6 flex items-center justify-center gap-4 sm:gap-10">
          <div className="flex flex-col items-center">
            <div className="w-32 h-40 sm:w-44 sm:h-52">
              <NamSvg pose="trophy" />
            </div>
            <span className="text-xs font-black text-blue-800 bg-white/80 px-3 py-0.5 rounded-full">
              Bé Nam
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-2xl border-4 border-white animate-float">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-amber-900 fill-amber-300" />
            </div>
            <span className="mt-2 text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wider">
              Cúp Vô Địch 2A7
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-32 h-40 sm:w-44 sm:h-52">
              <LanSvg pose="trophy" />
            </div>
            <span className="text-xs font-black text-amber-800 bg-white/80 px-3 py-0.5 rounded-full">
              Bé Lan
            </span>
          </div>
        </div>

        {/* Teacher's Commendation Note */}
        <div className="max-w-2xl mx-auto bg-white/95 border-2 border-amber-300 rounded-3xl p-5 shadow-lg text-slate-800 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-rose-600 block">
            💌 Lời nhắn nhủ từ cô giáo {LESSON_INFO.teacher}:
          </span>
          <p className="text-sm md:text-base font-bold italic leading-relaxed">
            &ldquo;Cô rất vui và tự hào vì các em lớp 2A7 đã chăm chỉ khám phá, ghi nhớ được các từ ngữ về thể thao và đặt được những câu nêu hoạt động rất chuẩn xác, sinh động. Chúc các em luôn khỏe mạnh và yêu thích môn Tiếng Việt!&rdquo;
          </p>
        </div>
      </div>

      {/* Vocabulary Collection Summary: 6 Bilingual Sports */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700">
              BỘ SƯU TẬP TỪ VỰNG HOẠT ĐỘNG THỂ THAO ĐÃ HỌC
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-800">
              6 Môn Thể Thao Song Ngữ
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Chạm vào loa để nghe phát âm
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {ACTIVITIES_DATA.map((sport) => (
            <div
              key={sport.id}
              className="bg-amber-50/60 hover:bg-amber-100/70 border-2 border-amber-200 rounded-2xl p-3 flex flex-col items-center text-center transition-all group"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 shadow-inner">
                <SportIllustration sportId={sport.id} />
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm sm:text-base font-black text-slate-900">
                  {sport.nameVi}
                </span>
                <button
                  type="button"
                  onClick={() => speakVietnameseFemale(sport.nameVi, { role: 'teacher' })}
                  className="p-0.5 text-amber-700 hover:text-amber-900"
                  title="Nghe tiếng Việt"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[11px] font-extrabold text-blue-600 uppercase">
                  {sport.nameEn}
                </span>
                <button
                  type="button"
                  onClick={() => speakText(sport.nameEn, 'en-US')}
                  className="p-0.5 text-blue-600 hover:text-blue-800"
                  title="Nghe tiếng Anh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Collection Strip */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <h3 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>Bộ Huy Hiệu Thành Tích Đạt Được (6/6)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES_DATA.map((b) => (
            <div
              key={b.id}
              className="bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-3 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-md mb-2">
                🎖️
              </div>
              <span className="text-xs font-black text-slate-900 leading-tight">
                {b.titleVi}
              </span>
              <span className="text-[10px] font-bold text-amber-700 uppercase mt-0.5">
                {b.titleEn}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                {b.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Challenge: "Hãy chọn một hoạt động và đặt một câu nêu hoạt động" */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✍️</span>
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-900">
              Nhiệm Vụ Cuối Cùng: Tự Đặt Một Câu Nêu Hoạt Động
            </h3>
            <p className="text-xs md:text-sm text-slate-600 font-semibold">
              Hãy chọn một hoạt động thể thao yêu thích và viết câu nêu hoạt động hoàn chỉnh nhé!
            </p>
          </div>
        </div>

        {/* Sports picker */}
        <div className="flex flex-wrap gap-2">
          {ACTIVITIES_DATA.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => setSelectedSportId(sp.id)}
              className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                selectedSportId === sp.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {sp.nameVi} ({sp.nameEn})
            </button>
          ))}
        </div>

        {/* Input box and check */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customSentence}
                onChange={(e) => setCustomSentence(e.target.value)}
                placeholder={`Ví dụ: Bạn Nam đang ${selectedSport.nameVi.toLowerCase()}...`}
                className="flex-1 p-3.5 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 text-base font-bold outline-none"
              />
              <button
                type="button"
                onClick={handleCheckFinalSentence}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all cursor-pointer shrink-0"
              >
                Gửi câu
              </button>
            </div>
            {finalFeedback && (
              <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl p-2.5">
                {finalFeedback}
              </p>
            )}
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-slate-700">
            <span className="block text-amber-800 font-black mb-1">Gợi ý câu mẫu:</span>
            <span>&ldquo;{selectedSport.exampleSentenceVi}&rdquo;</span>
            <span className="block text-indigo-700 italic font-semibold mt-0.5">
              &ldquo;{selectedSport.exampleSentenceEn}&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* QUIZIZZ PRACTICE SECTION (LET'S PLAY! – LUYỆN TẬP THÊM) */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wide">
            🎮 BÀI TẬP VỀ NHÀ & LUYỆN TẬP BÙNG NỔ
          </span>
          <h2 className="text-2xl md:text-3xl font-black">
            LET&apos;S PLAY! – LUYỆN TẬP THÊM QUIZIZZ
          </h2>
          <p className="text-xs md:text-sm opacity-90 max-w-xl font-medium">
            Thực hiện bài kiểm tra trắc nghiệm sinh động trên Quizizz để ghi điểm số cao nhất cho lớp 2A7!
          </p>
          {quizizzUrl ? (
            <p className="text-xs font-mono bg-black/20 px-3 py-1 rounded-lg inline-block break-all">
              Liên kết: {quizizzUrl}
            </p>
          ) : (
            <p className="text-xs font-bold text-amber-200">
              ⚠️ Giáo viên chưa cập nhật liên kết luyện tập.
            </p>
          )}
        </div>

        {/* Buttons: Launch Quizizz, Show QR, Configure URL */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {quizizzUrl ? (
            <button
              type="button"
              onClick={handleLaunchQuizizz}
              className="py-4 px-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-lg shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>VÀO THI QUIZIZZ</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="py-4 px-6 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm border border-white/40"
            >
              Cập nhật liên kết
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowQrCode((prev) => !prev)}
            className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-colors"
            title="Xem mã QR để quét bằng điện thoại/iPad"
          >
            <QrCode className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 rounded-full text-xs font-bold text-white/80 hover:text-white bg-black/20 hover:bg-black/30 transition-colors"
          >
            Cấu hình link
          </button>
        </div>
      </div>

      {/* QR Code Modal / Display */}
      {showQrCode && (
        <div className="bg-white border-4 border-purple-400 rounded-3xl p-6 shadow-2xl max-w-md mx-auto text-center space-y-4 animate-float">
          <h4 className="text-lg font-black text-slate-900">
            Mã QR Luyện Tập Quizizz Lớp 2A7
          </h4>
          <p className="text-xs text-slate-600 font-medium">
            Quét mã này bằng camera điện thoại hoặc iPad để làm bài ngay!
          </p>

          {/* Clean High-Contrast Vector QR Representation */}
          <div className="w-48 h-48 mx-auto p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner flex flex-col items-center justify-center">
            {/* Standard SVG QR Code symbol */}
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="#1E293B">
              <rect x="10" y="10" width="25" height="25" fill="#1E293B" rx="3" />
              <rect x="14" y="14" width="17" height="17" fill="#FFFFFF" rx="2" />
              <rect x="18" y="18" width="9" height="9" fill="#1E293B" />

              <rect x="65" y="10" width="25" height="25" fill="#1E293B" rx="3" />
              <rect x="69" y="14" width="17" height="17" fill="#FFFFFF" rx="2" />
              <rect x="73" y="18" width="9" height="9" fill="#1E293B" />

              <rect x="10" y="65" width="25" height="25" fill="#1E293B" rx="3" />
              <rect x="14" y="69" width="17" height="17" fill="#FFFFFF" rx="2" />
              <rect x="18" y="73" width="9" height="9" fill="#1E293B" />

              {/* Data modules pattern */}
              <rect x="42" y="15" width="8" height="8" />
              <rect x="42" y="30" width="8" height="8" />
              <rect x="15" y="45" width="8" height="8" />
              <rect x="30" y="45" width="8" height="8" />
              <rect x="45" y="45" width="12" height="12" />
              <rect x="65" y="45" width="8" height="8" />
              <rect x="80" y="45" width="8" height="8" />
              <rect x="45" y="65" width="8" height="8" />
              <rect x="65" y="65" width="12" height="8" />
              <rect x="65" y="80" width="8" height="10" />
              <rect x="80" y="75" width="10" height="15" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : null}
              <span>{copiedLink ? 'Đã sao chép link!' : 'Sao chép liên kết'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQrCode(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Teacher Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-purple-400 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-900">
              Cấu hình liên kết Quizizz (Dành cho Giáo viên)
            </h3>
            <p className="text-xs text-slate-600">
              Cô giáo Nguyễn Thị Tuyết có thể dán liên kết bài tập Quizizz mới tại đây:
            </p>

            <input
              type="url"
              value={customInputUrl}
              onChange={(e) => setCustomInputUrl(e.target.value)}
              placeholder="https://quizizz.com/join?gc=..."
              className="w-full p-3 rounded-2xl border-2 border-purple-300 focus:border-purple-500 font-mono text-sm outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveQuizizzConfig}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md"
              >
                Lưu liên kết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
