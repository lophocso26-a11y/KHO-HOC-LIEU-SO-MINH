import React from 'react';
import { Play, Sparkles, Award, Heart, Volume2 } from 'lucide-react';
import { LESSON_INFO } from '../data/lessonData.ts';
import { sound, speakText, speakVietnameseFemale } from '../utils/audio.ts';
import { NamSvg, LanSvg } from './MascotCharacter.tsx';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const greetingVi = "Xin chào các bạn! Hãy cùng chúng mình khám phá những hoạt động thể thao và vui chơi thú vị nhé!";
  const greetingEn = "Welcome to Fun Sports Day!";

  const handleStart = () => {
    sound.playWhistle();
    setTimeout(() => {
      sound.playSuccess();
      onStart();
    }, 300);
  };

  const handleSpeak = (text: string, lang: 'vi-VN' | 'en-US') => {
    speakText(text, lang);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden">
      {/* Decorative Balloons & Festive Bunting Arc */}
      <div className="absolute top-0 inset-x-0 h-28 pointer-events-none flex justify-around items-start opacity-90">
        <div className="w-12 h-16 rounded-full bg-rose-500 shadow-md animate-float" style={{ animationDelay: '0s' }} />
        <div className="w-10 h-14 rounded-full bg-amber-400 shadow-md animate-float" style={{ animationDelay: '0.4s' }} />
        <div className="w-14 h-18 rounded-full bg-sky-500 shadow-md animate-float" style={{ animationDelay: '0.8s' }} />
        <div className="w-11 h-15 rounded-full bg-emerald-500 shadow-md animate-float" style={{ animationDelay: '1.2s' }} />
        <div className="w-13 h-17 rounded-full bg-purple-500 shadow-md animate-float" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* Top Pedagogical Banner: Teacher, Class & School Info */}
      <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md border-2 border-amber-300 rounded-3xl p-4 shadow-md text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm font-bold text-amber-900">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-600" />
            {LESSON_INFO.school}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-300">
            {LESSON_INFO.classRoom}
          </span>
          <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-300 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            GV: {LESSON_INFO.teacher}
          </span>
        </div>
        <p className="mt-2 text-xs md:text-sm text-slate-600 font-medium">
          Môn Tiếng Việt lớp 2 • Bộ sách <span className="text-emerald-700 font-bold">{LESSON_INFO.bookSeries}</span>
        </p>
      </div>

      {/* Main Gate Hero Section */}
      <div className="relative z-10 my-4 md:my-6 w-full max-w-5xl flex flex-col items-center text-center">
        {/* Arch Header Ribbon */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold px-6 py-2 rounded-full shadow-lg text-sm md:text-base tracking-wide uppercase animate-wiggle">
          <Sparkles className="w-5 h-5" />
          CHỦ ĐỀ HỌC TẬP TÍCH HỢP TIẾNG ANH
          <Sparkles className="w-5 h-5" />
        </div>

        {/* Big Dual Language Titles */}
        <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-emerald-600 to-rose-600 tracking-tight drop-shadow-sm">
          {LESSON_INFO.themeVi}
        </h1>
        <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-600 tracking-wide">
          {LESSON_INFO.themeEn}
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-700 font-semibold max-w-2xl">
          {LESSON_INFO.lessonTitle}
        </p>

        {/* Two Characters Welcoming with Speech Bubble */}
        <div className="mt-6 w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {/* Bé Nam */}
          <div 
            onClick={() => speakVietnameseFemale('Xin chào các bạn! Mình là Nam. Chào mừng các bạn đến với Ngày hội Thể thao và Vui chơi!', { role: 'nam' })}
            className="flex flex-col items-center cursor-pointer group"
            title="Chạm để nghe Bé Nam chào mừng"
          >
            <div className="w-36 h-44 md:w-44 md:h-52 group-hover:scale-105 transition-transform">
              <NamSvg pose="wave" />
            </div>
            <span className="mt-1 text-sm font-black text-blue-700 bg-blue-100 group-hover:bg-blue-200 px-3 py-0.5 rounded-full flex items-center gap-1 transition-colors">
              <span>Bé Nam (2A7)</span>
              <Volume2 className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Central Speech Card & Start CTA */}
          <div className="flex flex-col items-center max-w-md w-full">
            <div className="w-full bg-white border-4 border-amber-300 rounded-3xl p-5 shadow-xl text-center relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl">👋</span>
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                  Lời chào từ hai bạn nhỏ
                </span>
                <span className="text-xl">🎉</span>
              </div>

              {/* Vietnamese Greeting */}
              <p className="text-base md:text-lg font-bold text-slate-800 leading-snug">
                &ldquo;{greetingVi}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => handleSpeak(greetingVi, 'vi-VN')}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Nghe lời chào (Tiếng Việt)
              </button>

              <div className="my-2 border-t border-amber-200" />

              {/* English Greeting */}
              <p className="text-sm md:text-base font-extrabold text-indigo-700 italic">
                &ldquo;{greetingEn}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => handleSpeak(greetingEn, 'en-US')}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Listen (English)
              </button>
            </div>

            {/* BIG START BUTTON */}
            <button
              type="button"
              onClick={handleStart}
              className="mt-6 w-full py-4 px-8 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-black text-xl md:text-2xl shadow-xl shadow-orange-300/60 transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white cursor-pointer"
            >
              <Play className="w-8 h-8 fill-current" />
              <span>BẮT ĐẦU HÀNH TRÌNH</span>
              <Sparkles className="w-7 h-7" />
            </button>
            <span className="mt-2 text-xs font-bold text-slate-500">
              Nhấn nút để mở Bản đồ 6 Trạm học tập thú vị!
            </span>
          </div>

          {/* Bé Lan */}
          <div 
            onClick={() => speakVietnameseFemale('Chào các bạn, mình là Lan! Chúng mình hãy cùng nhau khám phá và học thật nhiều điều bổ ích nhé!', { role: 'lan' })}
            className="flex flex-col items-center cursor-pointer group"
            title="Chạm để nghe Bé Lan chào mừng"
          >
            <div className="w-36 h-44 md:w-44 md:h-52 group-hover:scale-105 transition-transform">
              <LanSvg pose="wave" />
            </div>
            <span className="mt-1 text-sm font-black text-amber-700 bg-amber-100 group-hover:bg-amber-200 px-3 py-0.5 rounded-full flex items-center gap-1 transition-colors">
              <span>Bé Lan (2A7)</span>
              <Volume2 className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 text-center mt-4">
        <div className="bg-white/80 border border-emerald-200 rounded-2xl p-2.5">
          <span className="text-xl">🏃</span>
          <div className="text-xs font-bold text-slate-800">6 Môn thể thao</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Tích hợp Tiếng Anh</div>
        </div>
        <div className="bg-white/80 border border-blue-200 rounded-2xl p-2.5">
          <span className="text-xl">🧩</span>
          <div className="text-xs font-bold text-slate-800">Trò chơi kéo thả</div>
          <div className="text-[11px] text-blue-600 font-semibold">Tương tác trực tiếp</div>
        </div>
        <div className="bg-white/80 border border-amber-200 rounded-2xl p-2.5">
          <span className="text-xl">✍️</span>
          <div className="text-xs font-bold text-slate-800">Câu nêu hoạt động</div>
          <div className="text-[11px] text-amber-600 font-semibold">Ghép câu chuẩn xác</div>
        </div>
        <div className="bg-white/80 border border-rose-200 rounded-2xl p-2.5">
          <span className="text-xl">🎙️</span>
          <div className="text-xs font-bold text-slate-800">Phóng viên nhí</div>
          <div className="text-[11px] text-rose-600 font-semibold">Ghi âm & Đặt câu</div>
        </div>
      </div>
    </div>
  );
};
