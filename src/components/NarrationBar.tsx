import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Settings2, Play, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { STATION_NARRATIONS } from '../data/lessonData.ts';
import { 
  speakVietnameseFemale, 
  stopSpeaking, 
  addSpeechListener, 
  getIsSpeaking,
  getSavedVoiceConfig
} from '../utils/audio.ts';
import { VoiceSettingsModal } from './VoiceSettingsModal.tsx';

interface NarrationBarProps {
  stationKey: string;
  autoPlayIfEnabled?: boolean;
}

export const NarrationBar: React.FC<NarrationBarProps> = ({ stationKey, autoPlayIfEnabled = false }) => {
  const narration = STATION_NARRATIONS[stationKey] || STATION_NARRATIONS.welcome;
  const [isSpeaking, setIsSpeaking] = useState(getIsSpeaking());
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  useEffect(() => {
    const unsub = addSpeechListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      unsub();
    };
  }, []);

  // Handle auto-narration if enabled in voice config
  useEffect(() => {
    if (autoPlayIfEnabled) {
      const cfg = getSavedVoiceConfig();
      if (cfg.autoNarration) {
        const timer = setTimeout(() => {
          handlePlayNarration();
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [stationKey]);

  const handlePlayNarration = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      setShowSubtitles(true);
      const role = narration.speaker.includes('Lan') ? 'lan' : 'teacher';
      speakVietnameseFemale(narration.scriptVi, {
        role,
        onEnd: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-0.5 rounded-3xl shadow-lg transition-all">
        <div className="bg-white/95 backdrop-blur-md rounded-[22px] p-3 md:p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Speaker label & Sound Wave animation */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                👩‍🏫
              </div>
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-rose-600 tracking-wider">
                  THUYẾT TRÌNH GIỌNG NỮ TRUYỀN CẢM
                </span>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full">
                  {narration.speaker}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-800 leading-tight">
                {narration.title}
              </h4>
            </div>
          </div>

          {/* Audio Wave Visualizer when speaking */}
          {isSpeaking && (
            <div className="flex items-center gap-1 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full animate-pulse">
              <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-5 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <span className="w-1 h-3 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
              <span className="text-xs font-black text-rose-700 ml-1.5">Đang thuyết minh...</span>
            </div>
          )}

          {/* Action Buttons: Play/Stop, View Subtitles, Voice Settings */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* Play/Stop Button */}
            <button
              type="button"
              onClick={handlePlayNarration}
              className={`px-4 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Dừng đọc</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Nghe cô thuyết minh</span>
                </>
              )}
            </button>

            {/* Toggle Subtitles */}
            <button
              type="button"
              onClick={() => setShowSubtitles((prev) => !prev)}
              className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
              title="Xem / Ẩn lời thuyết minh"
            >
              <span>{showSubtitles ? 'Ẩn lời' : 'Xem lời'}</span>
              {showSubtitles ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Voice Settings Gear Button */}
            <button
              type="button"
              onClick={() => setShowVoiceSettings(true)}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-amber-100 text-slate-700 transition-colors"
              title="Tùy chỉnh giọng đọc tiếng Việt"
            >
              <Settings2 className="w-4 h-4 text-amber-700" />
            </button>
          </div>
        </div>

        {/* Subtitle / Script Expansion Drawer */}
        {showSubtitles && (
          <div className="p-4 bg-amber-50/95 rounded-b-[22px] border-t border-amber-200 space-y-2 animate-float">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed">
                  &ldquo;{narration.scriptVi}&rdquo;
                </p>
                <p className="text-xs text-indigo-700 font-semibold italic">
                  English: &ldquo;{narration.scriptEn}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />
    </>
  );
};
