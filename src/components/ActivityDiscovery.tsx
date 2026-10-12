import React, { useState } from 'react';
import { Volume2, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACTIVITIES_DATA } from '../data/lessonData.ts';
import { ActivityItem } from '../types.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { SportIllustration } from './SportIllustrations.tsx';
import { MascotCharacter } from './MascotCharacter.tsx';

interface ActivityDiscoveryProps {
  discoveredIds: string[];
  onUpdateDiscovered: (ids: string[]) => void;
  onCompleteStation: (stars: number) => void;
  onBackToMap: () => void;
}

export const ActivityDiscovery: React.FC<ActivityDiscoveryProps> = ({
  discoveredIds,
  onUpdateDiscovered,
  onCompleteStation,
  onBackToMap,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem>(ACTIVITIES_DATA[0]);
  const [hasCompleted, setHasCompleted] = useState(discoveredIds.length >= ACTIVITIES_DATA.length);

  const handleCardClick = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    sound.playClick();

    if (!discoveredIds.includes(activity.id)) {
      const nextDiscovered = [...discoveredIds, activity.id];
      onUpdateDiscovered(nextDiscovered);
      sound.playStar();

      if (nextDiscovered.length >= ACTIVITIES_DATA.length && !hasCompleted) {
        setHasCompleted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handlePronounceEn = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakText(text, 'en-US');
  };

  const handlePronounceVi = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakText(text, 'vi-VN');
  };

  const handleFinish = () => {
    sound.playSuccess();
    onCompleteStation(3); // 3 stars
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/95 border-3 border-amber-300 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-black uppercase">
              TRẠM 1
            </span>
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">
              FUN SPORTS DAY
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-800">
            Khám Phá Các Hoạt Động Thể Thao
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs md:text-sm text-slate-600 font-semibold">
              Nhấn vào từng môn thể thao để xem từ vựng song ngữ và nghe phát âm chuẩn nhé!
            </p>
            <button
              type="button"
              onClick={() => speakVietnameseFemale('Nhấn vào từng môn thể thao để xem từ vựng song ngữ và nghe phát âm chuẩn nhé!', { role: 'teacher' })}
              className="p-1 rounded-full text-amber-600 hover:bg-amber-100 transition-colors shrink-0"
              title="Nghe hướng dẫn của cô Tuyết"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counter and back */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 border-2 border-amber-300 text-amber-950 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Đã khám phá: {discoveredIds.length} / 6</span>
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

      {/* Main Interactive Stage: 6 Activity Cards + Spotlight Inspection Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: The 6 Grid Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ACTIVITIES_DATA.map((act) => {
            const isDiscovered = discoveredIds.includes(act.id);
            const isSelected = selectedActivity.id === act.id;

            return (
              <div
                key={act.id}
                onClick={() => handleCardClick(act)}
                className={`relative group rounded-3xl p-3 sm:p-4 border-4 cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 shadow-xl scale-102 ring-4 ring-amber-200'
                    : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-lg'
                }`}
              >
                {/* Discovered Star / Check badge */}
                {isDiscovered && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
                    <CheckCircle className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* SVG Illustration Container */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-2 shadow-inner group-hover:scale-105 transition-transform duration-200">
                  <SportIllustration sportId={act.id} />
                </div>

                {/* Vietnamese Name with Pronounce Button */}
                <div className="flex items-center justify-center gap-1.5 w-full">
                  <span className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                    {act.nameVi}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handlePronounceVi(e, act.nameVi)}
                    className="p-1 rounded-full text-amber-600 hover:bg-amber-100 transition-colors"
                    title="Nghe tiếng Việt"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* English Name & Pronounce Button */}
                <div className="mt-1 flex items-center justify-center gap-1.5 w-full">
                  <span className="text-xs sm:text-sm font-extrabold text-blue-600 uppercase">
                    {act.nameEn}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handlePronounceEn(e, act.nameEn)}
                    className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Nghe tiếng Anh"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Spotlight Inspection Deck & Mascot Feedback */}
        <div className="space-y-4">
          {/* Detailed Selected Card View */}
          <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Chi tiết hoạt động
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                /{selectedActivity.pronounceEn}/
              </span>
            </div>

            {/* Large illustration */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md">
              <SportIllustration sportId={selectedActivity.id} />
            </div>

            {/* Names & Audio Actions */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {selectedActivity.nameVi}
                </h3>
                <button
                  type="button"
                  onClick={(e) => handlePronounceVi(e, selectedActivity.nameVi)}
                  className="p-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                  title="Nghe tiếng Việt"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-black text-blue-600 uppercase tracking-wide">
                  {selectedActivity.nameEn}
                </span>
                <button
                  type="button"
                  onClick={(e) => handlePronounceEn(e, selectedActivity.nameEn)}
                  className="p-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  title="Nghe phát âm tiếng Anh"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium pt-1">
                {selectedActivity.descriptionVi}
              </p>
            </div>

            {/* Example sentence box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 space-y-1.5">
              <span className="text-[11px] font-black uppercase text-amber-800 block">
                Câu mẫu nêu hoạt động:
              </span>
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                <span>{selectedActivity.exampleSentenceVi}</span>
                <button
                  type="button"
                  onClick={(e) => handlePronounceVi(e, selectedActivity.exampleSentenceVi)}
                  className="p-1 text-amber-700 hover:text-amber-900"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 italic">
                <span>{selectedActivity.exampleSentenceEn}</span>
                <button
                  type="button"
                  onClick={(e) => handlePronounceEn(e, selectedActivity.exampleSentenceEn)}
                  className="p-1 text-indigo-600 hover:text-indigo-800"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mascot cheering */}
          <div className="bg-white/90 border-2 border-amber-200 rounded-3xl p-4 shadow-md">
            <MascotCharacter
              mascot="nam"
              pose={hasCompleted ? 'cheer' : 'wave'}
              size="sm"
              speechVi={
                hasCompleted
                  ? 'Tuyệt vời! Bạn đã khám phá đủ 6 môn thể thao rồi đấy!'
                  : 'Hãy nhấn vào từng môn thể thao để mở khóa nhé!'
              }
              speechEn={
                hasCompleted
                  ? 'Awesome! You explored all 6 sports!'
                  : 'Click each sport to explore!'
              }
            />
          </div>

          {/* Completion CTA */}
          {hasCompleted && (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-xl shadow-emerald-200/60 flex items-center justify-center gap-2 transform hover:scale-102 active:scale-98 transition-all cursor-pointer animate-wiggle"
            >
              <span>HOÀN THÀNH – TIẾP TỤC TRẠM 2</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
