import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const CACHE_DIR = path.resolve('public', 'audio_cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('No GEMINI_API_KEY found.');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' },
  },
});

function getCacheKey(text, voiceRole, lang) {
  const hash = crypto
    .createHash('sha256')
    .update(`${text.trim()}_${voiceRole}_${lang}`)
    .digest('hex')
    .slice(0, 24);
  return `tts_${hash}.wav`;
}

async function synthesize(text, voiceRole = 'teacher', lang = 'vi') {
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

  const response = await ai.models.generateContent({
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

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) throw new Error('No audio returned');
  return Buffer.from(base64, 'base64');
}

const ITEMS_TO_CACHE = [
  // 5 Mandatory Test Phrases
  { text: 'Xin chào các em yêu quý! Chào mừng các em đến với Ngày hội thể thao và vui chơi!', role: 'teacher', lang: 'vi' },
  { text: 'Các em hãy quan sát thật kỹ bức tranh và chọn câu nêu hoạt động phù hợp nhé!', role: 'teacher', lang: 'vi' },
  { text: 'Chính xác! Cô khen em!', role: 'teacher', lang: 'vi' },
  { text: 'Chưa đúng rồi, em hãy thử lại nhé!', role: 'teacher', lang: 'vi' },
  { text: 'Các em hãy sắp xếp các từ ngữ để tạo thành một câu nêu hoạt động hoàn chỉnh.', role: 'teacher', lang: 'vi' },

  // Key feedback phrases
  { text: 'Chính xác! Bạn làm rất tốt!', role: 'lan', lang: 'vi' },
  { text: 'Em hãy thử lại nhé!', role: 'teacher', lang: 'vi' },
  { text: 'Tuyệt vời! Bạn đã khám phá đủ 6 môn thể thao rồi đấy!', role: 'teacher', lang: 'vi' },
  { text: 'Hãy quan sát thật kỹ tranh sân trường để thấy từng bạn đang tham gia môn thể thao nào nhé!', role: 'teacher', lang: 'vi' },

  // 6 Sports Vietnamese
  { text: 'Chạy', role: 'teacher', lang: 'vi' },
  { text: 'Bơi', role: 'teacher', lang: 'vi' },
  { text: 'Đá bóng', role: 'teacher', lang: 'vi' },
  { text: 'Nhảy dây', role: 'teacher', lang: 'vi' },
  { text: 'Đạp xe', role: 'teacher', lang: 'vi' },
  { text: 'Chơi cầu lông', role: 'teacher', lang: 'vi' },

  // 6 Sports English (Separated audio clip!)
  { text: 'Run', role: 'teacher', lang: 'en' },
  { text: 'Swim', role: 'teacher', lang: 'en' },
  { text: 'Play football', role: 'teacher', lang: 'en' },
  { text: 'Jump rope', role: 'teacher', lang: 'en' },
  { text: 'Ride a bike', role: 'teacher', lang: 'en' },
  { text: 'Play badminton', role: 'teacher', lang: 'en' },
];

async function run() {
  console.log(`Starting synthesis of ${ITEMS_TO_CACHE.length} audio items...`);
  for (const item of ITEMS_TO_CACHE) {
    const key = getCacheKey(item.text, item.role, item.lang);
    const targetFile = path.join(CACHE_DIR, key);
    if (fs.existsSync(targetFile)) {
      console.log(`[Cached] ${item.text.slice(0, 35)}...`);
      continue;
    }
    try {
      console.log(`[Generating] [${item.lang}] ${item.text.slice(0, 35)}...`);
      const buf = await synthesize(item.text, item.role, item.lang);
      fs.writeFileSync(targetFile, buf);
      console.log(`Saved ${buf.length} bytes to ${key}`);
      // Slight delay to be polite to rate limits
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`Error on "${item.text}":`, err.message);
    }
  }
  console.log('Finished caching audio items.');
}

run();
