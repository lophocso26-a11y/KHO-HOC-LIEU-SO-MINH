/**
 * Comprehensive Audio and Speech synthesis engine for "Fun Sports Day"
 * Uses Web Audio API for 100% resilient sound effects and background melody.
 * Uses Web Speech API for clear English and Vietnamese pronunciations.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBGM();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  /** Soft friendly button click sound */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio fallback silent
    }
  }

  /** Joyful success sound for correct answer */
  public playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
      });
    } catch {}
  }

  /** Sparkly star collection chime */
  public playStar() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [659.25, 880, 1046.5, 1318.51]; // E5, A5, C6, E6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.36);
      });
    } catch {}
  }

  /** Gentle cartoon boing for wrong attempt (encouraging, not harsh) */
  public playWrong() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {}
  }

  /** Sports whistle for festival kickoff */
  public playWhistle() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2600, ctx.currentTime);

      mod.frequency.setValueAtTime(35, ctx.currentTime);
      modGain.gain.setValueAtTime(300, ctx.currentTime);

      mod.connect(modGain);
      modGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      mod.start();
      osc.start();
      mod.stop(ctx.currentTime + 0.36);
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  }

  /** Grand victory celebration fanfare */
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [
        { f: 523.25, t: 0, d: 0.15 },    // C5
        { f: 523.25, t: 0.16, d: 0.15 }, // C5
        { f: 523.25, t: 0.32, d: 0.15 }, // C5
        { f: 659.25, t: 0.48, d: 0.3 },  // E5
        { f: 587.33, t: 0.8, d: 0.15 },  // D5
        { f: 783.99, t: 0.96, d: 0.55 }, // G5
        { f: 1046.5, t: 1.52, d: 0.8 },  // C6
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d + 0.05);
      });
    } catch {}
  }

  /** Cheerful gentle acoustic synth loop for background music */
  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public startBGM() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.stopBGM();
    this.isBgmPlaying = true;

    // Cheerful playful melody chords (C major, F major, G major, C)
    const pattern = [
      523.25, 659.25, 783.99, 659.25, 
      698.46, 880.00, 698.46, 587.33, 
      783.99, 987.77, 880.00, 783.99, 
      1046.50, 783.99, 659.25, 523.25
    ];
    let step = 0;

    const playStep = () => {
      if (!this.isBgmPlaying || this.isMuted) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const freq = pattern[step % pattern.length];
        step++;

        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.025, ctx.currentTime); // gentle background level
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch {}
    };

    this.bgmInterval = window.setInterval(playStep, 320);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundEngine();

import { aiSpeech } from './aiSpeech.ts';

// Proxy speech listeners from AI Speech Engine
export function addSpeechListener(fn: (speaking: boolean, text: string, role: string) => void) {
  return aiSpeech.addListener((state) => {
    fn(state.isPlaying, state.currentText, state.voiceRole);
  });
}

export function getIsSpeaking(): boolean {
  return aiSpeech.getIsPlaying();
}

export function getCurrentNarrationText(): string {
  return aiSpeech.getCurrentText();
}

export interface VoiceConfig {
  preferredVoiceName: string;
  speed: number;
  autoNarration: boolean;
}

const VOICE_CONFIG_KEY = 'sports_day_voice_config_v1';

export function getSavedVoiceConfig(): VoiceConfig {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(VOICE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return {
    preferredVoiceName: 'Gemini AI Voice (Cô Tuyết)',
    speed: 0.88,
    autoNarration: false,
  };
}

export function saveVoiceConfig(cfg: Partial<VoiceConfig>) {
  if (typeof window !== 'undefined') {
    const current = getSavedVoiceConfig();
    const updated = { ...current, ...cfg };
    localStorage.setItem(VOICE_CONFIG_KEY, JSON.stringify(updated));
  }
}

/**
 * Natural, warm Vietnamese Teacher / Student Voiceover using Gemini AI TTS
 */
export function speakVietnameseFemale(
  text: string,
  options?: {
    role?: 'teacher' | 'lan' | 'nam';
    pitch?: number;
    rate?: number;
    onEnd?: () => void;
    onError?: (err: Error) => void;
  }
) {
  aiSpeech.playSpeech(text, {
    voiceRole: options?.role || 'teacher',
    lang: 'vi',
    onEnd: options?.onEnd,
    onError: options?.onError,
  });
}

/**
 * General speech helper - separates Vietnamese and English audio clips
 */
export function speakText(
  text: string,
  lang: 'en-US' | 'vi-VN' = 'en-US',
  onEnd?: () => void
) {
  if (lang === 'vi-VN') {
    speakVietnameseFemale(text, { role: 'teacher', onEnd });
  } else {
    // English pronunciation clip via native English model voice
    aiSpeech.playSpeech(text, {
      voiceRole: 'teacher',
      lang: 'en',
      onEnd,
    });
  }
}

export function stopSpeaking() {
  aiSpeech.stop();
}

export function replaySpeaking() {
  aiSpeech.replay();
}
