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

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
});

function getCacheKey(text, voiceRole, lang) {
  const hash = crypto
    .createHash('sha256')
    .update(`${text.trim()}_${voiceRole}_${lang}`)
    .digest('hex')
    .slice(0, 24);
  return `tts_${hash}.wav`;
}

const FIVE_PHRASES = [
  'Xin chào các em yêu quý! Chào mừng các em đến với Ngày hội thể thao và vui chơi!',
  'Các em hãy quan sát thật kỹ bức tranh và chọn câu nêu hoạt động phù hợp nhé!',
  'Chính xác! Cô khen em!',
  'Chưa đúng rồi, em hãy thử lại nhé!',
  'Các em hãy sắp xếp các từ ngữ để tạo thành một câu nêu hoạt động hoàn chỉnh.',
];

async function generateWithRetry(text, role = 'teacher', lang = 'vi') {
  const key = getCacheKey(text, role, lang);
  const targetFile = path.join(CACHE_DIR, key);
  if (fs.existsSync(targetFile)) {
    console.log(`[ALREADY CACHED] "${text.slice(0, 30)}..." -> ${key}`);
    return;
  }

  let attempts = 0;
  while (attempts < 5) {
    attempts++;
    try {
      console.log(`[GENERATING attempt ${attempts}] "${text.slice(0, 30)}..."`);
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: 'A warm, gentle, patient, and joyful Vietnamese female elementary school teacher speaking naturally and clearly to 2nd grade students, pronouncing every Vietnamese tone mark distinctly with friendly pedagogical pauses.',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        fs.writeFileSync(targetFile, Buffer.from(base64, 'base64'));
        console.log(`[SUCCESS] Saved ${key} (${base64.length} chars base64)`);
        return;
      }
    } catch (err) {
      console.log(`Rate limit or error on attempt ${attempts}: ${err.message}. Waiting 22s...`);
      await new Promise((r) => setTimeout(r, 22000));
    }
  }
}

async function main() {
  console.log('Ensuring all 5 mandatory phrases are generated and saved...');
  for (const p of FIVE_PHRASES) {
    await generateWithRetry(p);
    // wait 21s between calls to strictly respect 3 RPM limit
    await new Promise((r) => setTimeout(r, 21000));
  }
  console.log('All 5 phrases verified on disk!');
}

main().catch(console.error);
