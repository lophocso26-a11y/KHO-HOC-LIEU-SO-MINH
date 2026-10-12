/**
 * AI Audio Player for FUN SPORTS DAY
 * Uses server-side Gemini TTS (gemini-3.8-flash-lite-tts) with disk & memory caching.
 * Ensures natural, warm Vietnamese female teacher voice and separate native English speech clips.
 */

export interface SpeechOptions {
  voiceRole?: 'teacher' | 'lan' | 'nam';
  lang?: 'vi' | 'en';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

export type SpeechStateListener = (state: {
  isPlaying: boolean;
  currentText: string;
  voiceRole: string;
  lang: string;
  audioUrl?: string;
  error?: string | null;
}) => void;

class AiSpeechEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentText: string = '';
  private currentRole: string = 'teacher';
  private currentLang: string = 'vi';
  private isMuted: boolean = false;
  private cache = new Map<string, string>(); // memory cache: "text_role_lang" -> audioUrl
  private listeners = new Set<SpeechStateListener>();
  private lastOptions: SpeechOptions | null = null;

  public addListener(listener: SpeechStateListener): () => void {
    this.listeners.add(listener);
    // Emit initial state
    listener({
      isPlaying: this.isPlaying,
      currentText: this.currentText,
      voiceRole: this.currentRole,
      lang: this.currentLang,
    });
    return () => this.listeners.delete(listener);
  }

  private notify(error: string | null = null) {
    this.listeners.forEach((fn) => {
      try {
        fn({
          isPlaying: this.isPlaying,
          currentText: this.currentText,
          voiceRole: this.currentRole,
          lang: this.currentLang,
          audioUrl: this.currentAudio?.src,
          error,
        });
      } catch {}
    });
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isPlaying) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentText(): string {
    return this.currentText;
  }

  /**
   * Stop any ongoing speech playback immediately
   */
  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isPlaying = false;
    this.notify();
  }

  /**
   * Replay the last spoken text
   */
  public replay() {
    if (this.currentText) {
      this.playSpeech(this.currentText, this.lastOptions || undefined);
    }
  }

  /**
   * High quality client fallback using Web Speech API with tailored pedagogical pitch & rate
   */
  private playFallbackSpeech(text: string, options?: SpeechOptions) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isPlaying = false;
      this.notify('Trình duyệt không hỗ trợ phát âm thanh');
      if (options?.onEnd) options.onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const isEnglish = (options?.lang || 'vi') === 'en';

      utterance.lang = isEnglish ? 'en-US' : 'vi-VN';
      utterance.rate = isEnglish ? 0.9 : 0.88;
      utterance.pitch = options?.voiceRole === 'lan' ? 1.15 : options?.voiceRole === 'nam' ? 0.95 : 1.05;

      const voices = window.speechSynthesis.getVoices();
      if (isEnglish) {
        const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')));
        if (enVoice) utterance.voice = enVoice;
      } else {
        const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VN') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('tiếng việt') || v.name.toLowerCase().includes('hoaimy'));
        if (viVoice) utterance.voice = viVoice;
      }

      this.isPlaying = true;
      this.notify();
      if (options?.onStart) options.onStart();

      utterance.onend = () => {
        this.isPlaying = false;
        this.notify();
        if (options?.onEnd) options.onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('[Fallback SpeechSynthesis] event:', e);
        this.isPlaying = false;
        this.notify();
        if (options?.onEnd) options.onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('[Fallback SpeechSynthesis] error:', e);
      this.isPlaying = false;
      this.notify();
      if (options?.onEnd) options.onEnd();
    }
  }

  /**
   * Play speech using Gemini AI TTS with automatic fallback to Web Speech API
   */
  public async playSpeech(text: string, options?: SpeechOptions): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) return;
    if (this.isMuted) return;

    // 1. Immediately stop any current audio to prevent overlapping voices
    this.stop();

    const voiceRole = options?.voiceRole || 'teacher';
    const lang = options?.lang || 'vi';
    this.currentText = cleanText;
    this.currentRole = voiceRole;
    this.currentLang = lang;
    this.lastOptions = options || null;

    const cacheKey = `${cleanText}_${voiceRole}_${lang}`;

    try {
      let audioUrl = this.cache.get(cacheKey);

      if (!audioUrl) {
        // Request server backend /api/tts
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voiceRole,
            lang,
          }),
        });

        if (!res.ok) {
          console.warn(`[AI Speech] /api/tts returned ${res.status}. Seamlessly falling back to SpeechSynthesis.`);
          this.playFallbackSpeech(cleanText, options);
          return;
        }

        const data = await res.json();
        audioUrl = data.audioUrl;
        if (!audioUrl) {
          console.warn('[AI Speech] No audioUrl returned. Falling back to SpeechSynthesis.');
          this.playFallbackSpeech(cleanText, options);
          return;
        }

        this.cache.set(cacheKey, audioUrl);
      }

      // Create and play Audio element
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      this.isPlaying = true;
      this.notify();

      if (options?.onStart) options.onStart();

      audio.onended = () => {
        this.isPlaying = false;
        this.currentAudio = null;
        this.notify();
        if (options?.onEnd) options.onEnd();
      };

      audio.onerror = (e) => {
        console.warn('[AI Speech] Audio element error. Falling back to SpeechSynthesis:', e);
        this.currentAudio = null;
        this.playFallbackSpeech(cleanText, options);
      };

      await audio.play().catch((playErr) => {
        console.warn('[AI Speech] audio.play() blocked or failed, falling back:', playErr);
        this.playFallbackSpeech(cleanText, options);
      });
    } catch (err: any) {
      console.warn('[AI Speech] Fetch or network error, invoking fallback:', err);
      this.playFallbackSpeech(cleanText, options);
    }
  }
}

export const aiSpeech = new AiSpeechEngine();
