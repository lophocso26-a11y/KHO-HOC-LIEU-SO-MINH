import React from 'react';
import { Lock, Star, Sparkles, CheckCircle2, RotateCcw, Home, Trophy, ArrowRight, Volume2 } from 'lucide-react';
import { StationId } from '../types.ts';
import { sound, speakVietnameseFemale, speakText } from '../utils/audio.ts';
import { NamSvg, LanSvg } from './MascotCharacter.tsx';

interface JourneyMapProps {
  unlockedStations: Record<string, boolean>;
  stationStars: Record<string, number>;
  onSelectStation: (id: StationId) => void;
  onGoHome: () => void;
  onResetProgress: () => void;
}

export const STATIONS_LIST: {
  id: StationId;
  order: number;
  titleVi: string;
  titleEn: string;
  desc: string;
  icon: string;
  color: string;
  bgGrad: string;
}[] = [
  {
    id: 'station1',
    order: 1,
    titleVi: 'Khám phá hoạt động',
    titleEn: 'FUN SPORTS DAY',
    desc: 'Làm quen 6 môn thể thao vui nhộn song ngữ',
    icon: '🏃',
    color: 'border-rose-400 text-rose-600',
    bgGrad: 'from-rose-500 to-red-600',
  },
  {
    id: 'station2',
    order: 2,
    titleVi: 'Săn tìm từ ngữ',
    titleEn: 'FIND THE WORDS',
    desc: 'Kéo thả nối từ tiếng Việt với hình tương ứng',
    icon: '🎯',
    color: 'border-emerald-400 text-emerald-600',
    bgGrad: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'station3',
    order: 3,
    titleVi: 'Những câu nói về hoạt động',
    titleEn: 'ACTION SENTENCES',
    desc: 'Nhận biết câu nêu hoạt động & quy tắc ngữ pháp',
    icon: '💡',
    color: 'border-amber-400 text-amber-600',
    bgGrad: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'station4',
    order: 4,
    titleVi: 'Ghép thành câu',
    titleEn: 'MAKE A SENTENCE',
    desc: 'Sắp xếp thẻ từ để tạo câu hoàn chỉnh',
    icon: '🧩',
    color: 'border-blue-400 text-blue-600',
    bgGrad: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'station5',
    order: 5,
    titleVi: 'Nhìn tranh, chọn câu',
    titleEn: 'LOOK AND CHOOSE',
    desc: 'Khám phá sân trường & giải 5 câu hỏi trắc nghiệm',
    icon: '🔍',
    color: 'border-purple-400 text-purple-600',
    bgGrad: 'from-purple-500 to-fuchsia-600',
  },
  {
    id: 'station6',
    order: 6,
    titleVi: 'Phóng viên nhí',
    titleEn: 'LITTLE REPORTER',
    desc: 'Cầm micro phỏng vấn & sáng tạo câu nêu hoạt động',
    icon: '🎙️',
    color: 'border-pink-400 text-pink-600',
    bgGrad: 'from-pink-500 to-rose-600',
  },
];

export const JourneyMap: React.FC<JourneyMapProps> = ({
  unlockedStations,
  stationStars,
  onSelectStation,
  onGoHome,
  onResetProgress,
}) => {
  // Total stars calculation
  const totalStars = Object.values(stationStars).reduce((sum, s) => sum + s, 0);
  const completedStationsCount = STATIONS_LIST.filter(
    (st) => (stationStars[st.id] ?? 0) > 0
  ).length;
  const progressPercent = Math.round((completedStationsCount / 6) * 100);
  const allCompleted = completedStationsCount >= 6;

  const handleStationClick = (stId: StationId, isUnlocked: boolean) => {
    if (!isUnlocked) {
      sound.playWrong();
      return;
    }
    sound.playClick();
    onSelectStation(stId);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 backdrop-blur border-3 border-amber-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onGoHome}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Quay về Cổng ngày hội"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs sm:text-sm">Trang chủ</span>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-2">
              <span>BẢN ĐỒ HÀNH TRÌNH</span>
              <span className="text-sm font-extrabold text-amber-600 uppercase bg-amber-100 px-3 py-0.5 rounded-full">
                6 Trạm Học Tập
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs md:text-sm text-slate-600 font-semibold">
                Hoàn thành từng trạm để mở khóa thử thách tiếp theo và thu thập 18 ngôi sao!
              </p>
              <button
                type="button"
                onClick={() => speakVietnameseFemale('Hoàn thành từng trạm để mở khóa thử thách tiếp theo và thu thập 18 ngôi sao nhé!', { role: 'teacher' })}
                className="p-1 rounded-full text-amber-700 hover:bg-amber-100 transition-colors shrink-0"
                title="Nghe hướng dẫn bản đồ"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stars Tally & Reset Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 px-4 py-2 rounded-2xl font-black text-base shadow-md">
            <Star className="w-6 h-6 fill-amber-100 text-amber-100 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{totalStars} / 18 Sao</span>
          </div>

          <button
            type="button"
            onClick={onResetProgress}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
            title="Đặt lại toàn bộ hành trình"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-4 shadow-md">
        <div className="flex justify-between items-center mb-2 text-xs md:text-sm font-extrabold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Tiến độ ngày hội: {completedStationsCount}/6 Trạm hoàn thành
          </span>
          <span className="text-amber-700 font-black">{progressPercent}%</span>
        </div>
        <div className="w-full h-4 bg-amber-100 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cartoon Winding Map with Station Nodes */}
      <div className="relative bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 rounded-3xl p-6 md:p-10 border-4 border-amber-300 shadow-2xl overflow-hidden">
        {/* Animated decorative mascots in corners */}
        <div className="absolute top-4 right-4 hidden lg:flex items-center gap-2 pointer-events-none opacity-80">
          <div className="w-20 h-28">
            <LanSvg pose="cheer" />
          </div>
          <div className="w-20 h-28">
            <NamSvg pose="cheer" />
          </div>
        </div>

        {/* 6 Stations Grid / Winding Path */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {STATIONS_LIST.map((st) => {
            const isUnlocked = unlockedStations[st.id] ?? false;
            const stars = stationStars[st.id] ?? 0;
            const isCompleted = stars > 0;

            return (
              <div
                key={st.id}
                onClick={() => handleStationClick(st.id, isUnlocked)}
                className={`relative group rounded-3xl p-5 border-4 transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-white cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 border-amber-300'
                    : 'bg-slate-100/90 border-slate-300 opacity-70 cursor-not-allowed'
                }`}
              >
                {/* Station Order Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md bg-gradient-to-br ${
                      isUnlocked ? st.bgGrad : 'from-slate-400 to-slate-500'
                    }`}
                  >
                    {st.order}
                  </div>

                  {/* Lock / Completed Status */}
                  <div className="flex items-center gap-1.5">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Xong
                      </span>
                    ) : !isUnlocked ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                        <Lock className="w-3.5 h-3.5" />
                        Đang khóa
                      </span>
                    ) : (
                      <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full animate-pulse">
                        Đang mở
                      </span>
                    )}
                  </div>
                </div>

                {/* Station Icon & Title */}
                <div className="flex items-start gap-3">
                  <span className="text-4xl p-2 rounded-2xl bg-amber-50 border border-amber-200">
                    {st.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-lg font-black text-slate-800 leading-snug">
                        {st.titleVi}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakVietnameseFemale(`Trạm ${st.order}: ${st.titleVi}. ${st.desc}`, { role: 'teacher' });
                        }}
                        className="p-1 rounded-full hover:bg-amber-100 text-amber-700 transition-colors shrink-0"
                        title="Nghe giới thiệu trạm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <h4 className="text-xs font-extrabold text-amber-600 uppercase tracking-wide">
                        {st.titleEn}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(st.titleEn, 'en-US');
                        }}
                        className="p-0.5 text-amber-600 hover:text-amber-800"
                        title="Listen English name"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 font-medium">
                      {st.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Stars and Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {/* Stars for this station */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starNum) => (
                      <Star
                        key={starNum}
                        className={`w-5 h-5 ${
                          stars >= starNum
                            ? 'text-amber-400 fill-amber-400 drop-shadow'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Play CTA */}
                  {isUnlocked && (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 group-hover:from-amber-600 group-hover:to-orange-600 flex items-center gap-1 shadow-md transition-all"
                    >
                      <span>{isCompleted ? 'Luyện lại' : 'Vào trạm'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Celebration Gate Banner if All Completed */}
        {allCompleted && (
          <div className="mt-8 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 text-white text-center shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-wiggle">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-white/20 rounded-2xl text-4xl">🏆</div>
              <div>
                <h3 className="text-xl font-black">CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH 6 TRẠM!</h3>
                <p className="text-xs sm:text-sm font-semibold opacity-95">
                  Cánh cổng The Fun Gate đã mở rộng chào đón bạn nhận cúp và tham gia Quizizz!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectStation('celebration')}
              className="py-3 px-6 rounded-full bg-white text-orange-600 font-black text-base shadow-lg hover:bg-amber-50 transition-transform hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>ĐẾN CỔNG VINH QUANG</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
