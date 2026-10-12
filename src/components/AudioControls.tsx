import React, { useState } from 'react';
import { Volume2, VolumeX, Music, HelpCircle, Mic } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface AudioControlsProps {
  onShowHelp?: () => void;
  onOpenVoiceSettings?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ onShowHelp, onOpenVoiceSettings }) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isBgmOn, setIsBgmOn] = useState(sound.getIsBgmPlaying());

  const handleToggleMute = () => {
    sound.playClick();
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (nextMuted) {
      setIsBgmOn(false);
    }
  };

  const handleToggleBgm = () => {
    sound.playClick();
    if (isMuted) {
      sound.setMuted(false);
      setIsMuted(false);
    }
    const playing = sound.toggleBGM();
    setIsBgmOn(playing);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Background Music Toggle */}
      <button
        type="button"
        onClick={handleToggleBgm}
        className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm ${
          isBgmOn
            ? 'bg-emerald-500 text-white shadow-emerald-200 animate-pulse'
            : 'bg-white/90 text-slate-700 hover:bg-slate-100 border border-slate-200'
        }`}
        title={isBgmOn ? 'Tắt nhạc nền vui tươi' : 'Bật nhạc nền vui tươi'}
      >
        <Music className={`w-3.5 h-3.5 ${isBgmOn ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">{isBgmOn ? 'Nhạc nền: Bật' : 'Nhạc nền'}</span>
      </button>

      {/* Sound Effects Mute Toggle */}
      <button
        type="button"
        onClick={handleToggleMute}
        className={`p-2 rounded-full transition-all shadow-sm ${
          isMuted
            ? 'bg-rose-100 text-rose-600 border border-rose-300'
            : 'bg-white/90 text-amber-800 hover:bg-amber-100 border border-slate-200'
        }`}
        title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Voice Settings Trigger */}
      {onOpenVoiceSettings && (
        <button
          type="button"
          onClick={onOpenVoiceSettings}
          className="p-2 rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 border border-slate-200 shadow-sm"
          title="Tùy chỉnh giọng đọc tiếng Việt"
        >
          <Mic className="w-4 h-4" />
        </button>
      )}

      {/* Help info */}
      {onShowHelp && (
        <button
          type="button"
          onClick={onShowHelp}
          className="p-2 rounded-full bg-white/90 text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm"
          title="Thông tin bài học & hướng dẫn"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
        </button>
      )}
    </div>
  );
};
