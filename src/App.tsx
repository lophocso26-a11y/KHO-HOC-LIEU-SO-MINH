import { useState, useEffect } from 'react';
import { Star, Trophy, Info, X } from 'lucide-react';
import { StationId } from './types.ts';
import { LESSON_INFO } from './data/lessonData.ts';
import { AudioControls } from './components/AudioControls.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { JourneyMap, STATIONS_LIST } from './components/JourneyMap.tsx';
import { ActivityDiscovery } from './components/ActivityDiscovery.tsx';
import { MatchingGame } from './components/MatchingGame.tsx';
import { ActionSentences } from './components/ActionSentences.tsx';
import { SentenceBuilder } from './components/SentenceBuilder.tsx';
import { PictureQuiz } from './components/PictureQuiz.tsx';
import { LittleReporter } from './components/LittleReporter.tsx';
import { FinalCelebration } from './components/FinalCelebration.tsx';
import { NarrationBar } from './components/NarrationBar.tsx';
import { VoiceSettingsModal } from './components/VoiceSettingsModal.tsx';

const STORAGE_KEY = 'sports_day_progress_2a7';

export default function App() {
  const [currentStation, setCurrentStation] = useState<StationId>('welcome');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Load progress from localStorage
  const [unlockedStations, setUnlockedStations] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.unlockedStations) return parsed.unlockedStations;
        }
      } catch {}
    }
    return { station1: true }; // station 1 starts unlocked
  });

  const [stationStars, setStationStars] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.stationStars) return parsed.stationStars;
        }
      } catch {}
    }
    return {};
  });

  const [discoveredActivities, setDiscoveredActivities] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.discoveredActivities) return parsed.discoveredActivities;
        }
      } catch {}
    }
    return [];
  });

  const [reporterSentence, setReporterSentence] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.reporterSentence) return parsed.reporterSentence;
        }
      } catch {}
    }
    return '';
  });

  // Save progress changes to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        unlockedStations,
        stationStars,
        discoveredActivities,
        reporterSentence,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {}
  }, [unlockedStations, stationStars, discoveredActivities, reporterSentence]);

  // Total stars
  const totalStars = Object.values(stationStars).reduce((sum, s) => sum + s, 0);

  // Complete a station and unlock next
  const handleCompleteStation = (stationKey: string, starsEarned: number) => {
    setStationStars((prev) => ({
      ...prev,
      [stationKey]: Math.max(prev[stationKey] || 0, starsEarned),
    }));

    // Unlock next station in order
    const stationOrder = ['station1', 'station2', 'station3', 'station4', 'station5', 'station6'];
    const currentIndex = stationOrder.indexOf(stationKey);
    if (currentIndex !== -1 && currentIndex + 1 < stationOrder.length) {
      const nextStationKey = stationOrder[currentIndex + 1];
      setUnlockedStations((prev) => ({
        ...prev,
        [nextStationKey]: true,
      }));
      // Route to next station or back to map
      setCurrentStation(nextStationKey as StationId);
    } else if (currentIndex === stationOrder.length - 1) {
      // Finished all 6 stations! Go to celebration
      setCurrentStation('celebration');
    }
  };

  const handleResetAllProgress = () => {
    if (window.confirm('Em có chắc chắn muốn đặt lại toàn bộ hành trình để chơi lại từ đầu không?')) {
      const initialUnlocked = { station1: true };
      setUnlockedStations(initialUnlocked);
      setStationStars({});
      setDiscoveredActivities([]);
      setReporterSentence('');
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStation('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-50 text-slate-800 flex flex-col font-sans">
      {/* Universal 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 px-4 md:px-8 py-3 shadow-sm flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setCurrentStation('welcome')}
          className="text-lg md:text-xl font-black tracking-tight text-amber-900 hover:text-orange-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🏆</span>
          <span>FUN SPORTS DAY</span>
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-black text-slate-600">
          <button
            type="button"
            onClick={() => setCurrentStation('welcome')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-800 cursor-pointer ${
              currentStation === 'welcome' ? 'text-amber-700 underline underline-offset-4' : ''
            }`}
          >
            Cổng ngày hội
          </button>
          <button
            type="button"
            onClick={() => setCurrentStation('map')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-800 cursor-pointer ${
              currentStation === 'map' ? 'text-amber-700 underline underline-offset-4' : ''
            }`}
          >
            Bản đồ 6 trạm
          </button>
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-amber-800 cursor-pointer"
          >
            Thông tin bài học
          </button>
          <button
            type="button"
            onClick={() => setCurrentStation('celebration')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-800 cursor-pointer ${
              currentStation === 'celebration' ? 'text-amber-700 underline underline-offset-4' : ''
            }`}
          >
            Cổng vinh quang
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area with Audio Controls and Star Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-black text-xs md:text-sm border border-amber-300">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{totalStars} Sao</span>
          </div>

          <AudioControls
            onShowHelp={() => setShowInfoModal(true)}
            onOpenVoiceSettings={() => setShowVoiceModal(true)}
          />
        </div>
      </header>

      {/* Main Content Router with Narration Bar on Top */}
      <main className="flex-1 pb-12 space-y-4">
        {/* Interactive Teacher Narration Bar */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4">
          <NarrationBar stationKey={currentStation} autoPlayIfEnabled={true} />
        </div>

        {currentStation === 'welcome' && (
          <WelcomeScreen onStart={() => setCurrentStation('map')} />
        )}

        {currentStation === 'map' && (
          <JourneyMap
            unlockedStations={unlockedStations}
            stationStars={stationStars}
            onSelectStation={(id) => setCurrentStation(id)}
            onGoHome={() => setCurrentStation('welcome')}
            onResetProgress={handleResetAllProgress}
          />
        )}

        {currentStation === 'station1' && (
          <ActivityDiscovery
            discoveredIds={discoveredActivities}
            onUpdateDiscovered={setDiscoveredActivities}
            onCompleteStation={(stars) => handleCompleteStation('station1', stars)}
            onBackToMap={() => setCurrentStation('map')}
          />
        )}

        {currentStation === 'station2' && (
          <MatchingGame
            onCompleteStation={(stars) => handleCompleteStation('station2', stars)}
            onBackToMap={() => setCurrentStation('map')}
          />
        )}

        {currentStation === 'station3' && (
          <ActionSentences
            onCompleteStation={(stars) => handleCompleteStation('station3', stars)}
            onBackToMap={() => setCurrentStation('map')}
          />
        )}

        {currentStation === 'station4' && (
          <SentenceBuilder
            onCompleteStation={(stars) => handleCompleteStation('station4', stars)}
            onBackToMap={() => setCurrentStation('map')}
          />
        )}

        {currentStation === 'station5' && (
          <PictureQuiz
            onCompleteStation={(stars) => handleCompleteStation('station5', stars)}
            onBackToMap={() => setCurrentStation('map')}
          />
        )}

        {currentStation === 'station6' && (
          <LittleReporter
            savedSentence={reporterSentence}
            onSaveSentence={setReporterSentence}
            onCompleteStation={(stars) => handleCompleteStation('station6', stars)}
            onBackToMap={() => setCurrentStation('map')}
          />
        )}

        {currentStation === 'celebration' && (
          <FinalCelebration
            totalStars={totalStars}
            reporterSentence={reporterSentence}
            onRestartAll={handleResetAllProgress}
            onGoToMap={() => setCurrentStation('map')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-amber-200 py-4 px-6 text-center text-xs text-slate-600 font-semibold">
        <p>
          {LESSON_INFO.school} • {LESSON_INFO.classRoom} • Giáo viên: {LESSON_INFO.teacher}
        </p>
        <p className="mt-1 text-slate-500 font-medium">
          Học liệu số Tiếng Việt 2: {LESSON_INFO.lessonTitle} ({LESSON_INFO.bookSeries})
        </p>
      </footer>

      {/* Lesson Information & Guide Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-black text-slate-900">
                  Thông Tin Bài Học & Hướng Dẫn
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-1.5 font-bold">
                <p><span className="text-amber-900">Giáo viên phụ trách:</span> {LESSON_INFO.teacher}</p>
                <p><span className="text-amber-900">Lớp:</span> {LESSON_INFO.classRoom}</p>
                <p><span className="text-amber-900">Trường:</span> {LESSON_INFO.school}</p>
                <p><span className="text-amber-900">Môn học:</span> {LESSON_INFO.subject} ({LESSON_INFO.bookSeries})</p>
                <p><span className="text-amber-900">Bài:</span> {LESSON_INFO.lessonTitle}</p>
              </div>

              <h4 className="font-black text-slate-900 text-base pt-2">
                Lộ trình 6 Trạm học tập:
              </h4>
              <div className="space-y-2">
                {STATIONS_LIST.map((st) => (
                  <div key={st.id} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-lg">{st.icon}</span>
                    <div>
                      <strong className="text-slate-900 font-extrabold">{st.order}. {st.titleVi}</strong>{' '}
                      <span className="text-xs text-blue-600 font-bold uppercase">({st.titleEn})</span>:
                      <p className="text-xs text-slate-600 font-medium">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1 text-xs font-semibold text-emerald-950">
                <div className="flex items-center gap-1 font-black text-emerald-900">
                  <Trophy className="w-4 h-4" />
                  Mục tiêu cần đạt:
                </div>
                <p>• Mở rộng và làm giàu vốn từ ngữ về hoạt động thể thao, vui chơi (Chạy, Bơi, Đá bóng, Nhảy dây, Đạp xe, Chơi cầu lông).</p>
                <p>• Nhận biết đúng và tự đặt được câu nêu hoạt động trong giao tiếp hàng ngày.</p>
                <p>• Tự tin phát âm các từ vựng và câu ngắn tiếng Anh tương ứng.</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="py-2.5 px-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md cursor-pointer"
              >
                Đã hiểu, vào học ngay!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
}
