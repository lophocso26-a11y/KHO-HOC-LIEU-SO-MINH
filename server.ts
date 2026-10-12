import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Audio cache directory
const CACHE_DIR = path.join(__dirname, 'public', 'audio_cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Serve cached audio statically
app.use('/audio_cache', express.static(CACHE_DIR));

// Initialize Gemini client on server
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getCacheKey(text: string, voiceRole: string, lang: string): string {
  const hash = crypto
    .createHash('sha256')
    .update(`${text.trim()}_${voiceRole}_${lang}`)
    .digest('hex')
    .slice(0, 24);
  return `tts_${hash}.wav`;
}

async function generateSpeechAudio(text: string, voiceRole: string = 'teacher', lang: string = 'vi'): Promise<Buffer> {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured on server.');
  }

  const isEnglish = lang === 'en';
  let voiceName = 'Kore';
  let promptStyle = 'A warm, gentle, patient, and joyful Vietnamese female elementary school teacher speaking naturally and clearly to 2nd grade students, pronouncing every Vietnamese tone mark distinctly with friendly pedagogical pauses.';

  if (isEnglish) {
    voiceName = 'Kore';
    promptStyle = 'A clear, friendly, articulate native English teacher pronouncing words and simple sentences accurately and at a gentle pace for elementary school children.';
  } else if (voiceRole === 'lan') {
    voiceName = 'Kore';
    promptStyle = 'A cheerful, bright 8-year-old Vietnamese schoolgirl speaking happily, playfully and clearly with natural Vietnamese pronunciation.';
  } else if (voiceRole === 'nam') {
    voiceName = 'Puck';
    promptStyle = 'An energetic, polite 8-year-old Vietnamese schoolboy speaking enthusiastically, lively and clearly with natural Vietnamese pronunciation.';
  }

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: promptStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
  } catch (err: any) {
    console.warn('[TTS] gemini-3.8-flash-tts failed, trying gemini-3.8-flash-lite-tts:', err?.message);
    response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: promptStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
  }

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) {
    throw new Error('No audio returned from Gemini TTS model');
  }

  return Buffer.from(base64, 'base64');
}

// 5 Mandatory Test Phrases specified in prompt
export const TEST_PHRASES = [
  {
    id: 'test_1',
    role: 'teacher',
    text: 'Xin chào các em yêu quý! Chào mừng các em đến với Ngày hội thể thao và vui chơi!',
    label: 'Lời chào mừng ngày hội',
  },
  {
    id: 'test_2',
    role: 'teacher',
    text: 'Các em hãy quan sát thật kỹ bức tranh và chọn câu nêu hoạt động phù hợp nhé!',
    label: 'Hướng dẫn quan sát tranh',
  },
  {
    id: 'test_3',
    role: 'teacher',
    text: 'Chính xác! Cô khen em!',
    label: 'Lời khen ngợi khi trả lời đúng',
  },
  {
    id: 'test_4',
    role: 'teacher',
    text: 'Chưa đúng rồi, em hãy thử lại nhé!',
    label: 'Lời động viên khi trả lời sai',
  },
  {
    id: 'test_5',
    role: 'teacher',
    text: 'Các em hãy sắp xếp các từ ngữ để tạo thành một câu nêu hoạt động hoàn chỉnh.',
    label: 'Giao nhiệm vụ ghép câu',
  },
];

// API: TTS Status
app.get('/api/tts/status', (req, res) => {
  res.json({
    available: !!ai,
    hasApiKey: !!apiKey,
    provider: 'gemini-tts',
    model: 'gemini-3.8-flash-lite-tts',
    cacheCount: fs.existsSync(CACHE_DIR) ? fs.readdirSync(CACHE_DIR).length : 0,
  });
});

// API: Synthesize Text to Speech
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceRole = 'teacher', lang = 'vi' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text parameter is required' });
      return;
    }

    const cleanText = text.trim();
    const fileName = getCacheKey(cleanText, voiceRole, lang);
    const filePath = path.join(CACHE_DIR, fileName);

    // Check disk cache
    if (fs.existsSync(filePath)) {
      res.json({
        audioUrl: `/audio_cache/${fileName}`,
        cached: true,
        text: cleanText,
        voiceRole,
        lang,
      });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Gemini TTS is unavailable because GEMINI_API_KEY is not set.',
        needConfig: true,
      });
      return;
    }

    // Generate new audio via Gemini TTS
    const buffer = await generateSpeechAudio(cleanText, voiceRole, lang);
    fs.writeFileSync(filePath, buffer);

    res.json({
      audioUrl: `/audio_cache/${fileName}`,
      cached: false,
      text: cleanText,
      voiceRole,
      lang,
    });
  } catch (error: any) {
    console.error('Gemini TTS synthesis error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to synthesize speech',
    });
  }
});

// API: Get 5 test phrases with pre-synthesized / cached status
app.get('/api/tts/test-phrases', async (req, res) => {
  try {
    const results = [];
    for (const phrase of TEST_PHRASES) {
      const fileName = getCacheKey(phrase.text, phrase.role, 'vi');
      const filePath = path.join(CACHE_DIR, fileName);
      const isCached = fs.existsSync(filePath);

      results.push({
        ...phrase,
        fileName,
        audioUrl: `/audio_cache/${fileName}`,
        isCached,
      });
    }
    res.json({ testPhrases: results });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Error checking test phrases' });
  }
});

// Preload test phrases on server boot
async function preloadEssentialAudio() {
  if (!ai) return;
  console.log('[TTS Server] Pre-generating essential lesson audio cache...');
  for (const phrase of TEST_PHRASES) {
    const fileName = getCacheKey(phrase.text, phrase.role, 'vi');
    const filePath = path.join(CACHE_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      try {
        console.log(`[TTS Server] Synthesizing: "${phrase.text.slice(0, 30)}..."`);
        const buf = await generateSpeechAudio(phrase.text, phrase.role, 'vi');
        fs.writeFileSync(filePath, buf);
      } catch (err) {
        console.warn(`[TTS Server] Could not preload phrase "${phrase.text}":`, err);
      }
    }
  }
  console.log('[TTS Server] Audio cache ready.');
}

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] FUN SPORTS DAY full-stack server running on http://0.0.0.0:${PORT}`);
    // Warm up the 5 test phrases in background
    preloadEssentialAudio().catch(console.error);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
});
