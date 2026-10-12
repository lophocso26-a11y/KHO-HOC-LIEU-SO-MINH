import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '..', 'public', 'audio_cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const apiKey = process.env.GEMINI_API_KEY || '';
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

function getCacheKey(text: string, voiceRole: string, lang: string): string {
  const hash = crypto
    .createHash('sha256')
    .update(`${text.trim()}_${voiceRole}_${lang}`)
    .digest('hex')
    .slice(0, 24);
  return `tts_${hash}.wav`;
}

const PHRASES_TO_CACHE = [
  // 6 activities Vietnamese
  { text: 'Chạy', role: 'teacher', lang: 'vi' },
  { text: 'Bơi', role: 'teacher', lang: 'vi' },
  { text: 'Đá bóng', role: 'teacher', lang: 'vi' },
  { text: 'Nhảy dây', role: 'teacher', lang: 'vi' },
  { text: 'Đi xe đạp', role: 'teacher', lang: 'vi' },
  { text: 'Đánh cầu lông', role: 'teacher', lang: 'vi' },

  // 6 activities English
  { text: 'Run', role: 'teacher', lang: 'en' },
  { text: 'Swim', role: 'teacher', lang: 'en' },
  { text: 'Play football', role: 'teacher', lang: 'en' },
  { text: 'Jump rope', role: 'teacher', lang: 'en' },
  { text: 'Ride a bike', role: 'teacher', lang: 'en' },
  { text: 'Play badminton', role: 'teacher', lang: 'en' },

  // Greetings
  { text: 'Xin chào các bạn! Hãy cùng chúng mình khám phá những hoạt động thể thao và vui chơi thú vị nhé!', role: 'teacher', lang: 'vi' },
  { text: 'Welcome to Fun Sports Day!', role: 'teacher', lang: 'en' },
  { text: 'Xin chào các bạn! Mình là Nam. Chào mừng các bạn đến với Ngày hội Thể thao và Vui chơi!', role: 'nam', lang: 'vi' },
  { text: 'Chào các bạn, mình là Lan! Chúng mình hãy cùng nhau khám phá và học thật nhiều điều bổ ích nhé!', role: 'lan', lang: 'vi' },

  // Station Instructions
  { text: 'Em hãy kéo hoặc chạm thẻ từ vào đúng hình ảnh hoạt động thể thao nhé!', role: 'teacher', lang: 'vi' },
  { text: 'Câu nêu hoạt động là câu dùng để kể, tả về hoạt động của người hoặc vật.', role: 'teacher', lang: 'vi' },
  { text: 'Chúc mừng các nhà vô địch 2A7! Các em đã hoàn thành xuất sắc 6 trạm học tập môn Tiếng Việt lớp 2 của cô giáo Nguyễn Thị Tuyết!', role: 'teacher', lang: 'vi' },

  // Example Sentences
  { text: 'Các bạn học sinh chạy tiếp sức thật hào hứng.', role: 'teacher', lang: 'vi' },
  { text: 'Students run with excitement.', role: 'teacher', lang: 'en' },
  { text: 'Bé Nam bơi lội dưới làn nước xanh mát.', role: 'teacher', lang: 'vi' },
  { text: 'Nam swims in the blue pool.', role: 'teacher', lang: 'en' },
  { text: 'Đội bóng nhí đá bóng trên sân cỏ.', role: 'teacher', lang: 'vi' },
  { text: 'The kids play football on the field.', role: 'teacher', lang: 'en' },
  { text: 'Bạn Lan nhảy dây rất khéo léo.', role: 'teacher', lang: 'vi' },
  { text: 'Lan jumps rope skillfully.', role: 'teacher', lang: 'en' },
  { text: 'Bạn Mai đi xe đạp quanh sân trường.', role: 'teacher', lang: 'vi' },
  { text: 'Mai rides a bike around the school.', role: 'teacher', lang: 'en' },
  { text: 'Hai bạn nhỏ đánh cầu lông vui vẻ.', role: 'teacher', lang: 'vi' },
  { text: 'Two friends play badminton happily.', role: 'teacher', lang: 'en' },
];

async function generate(text: string, voiceRole: string, lang: string) {
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

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) throw new Error('No audio returned');
  return Buffer.from(base64, 'base64');
}

async function main() {
  console.log(`Starting audio cache pre-generation for ${PHRASES_TO_CACHE.length} phrases...`);
  for (const item of PHRASES_TO_CACHE) {
    const fileName = getCacheKey(item.text, item.role, item.lang);
    const filePath = path.join(CACHE_DIR, fileName);
    if (fs.existsSync(filePath)) {
      console.log(`[Cached] "${item.text}" (${item.lang}) -> ${fileName}`);
      continue;
    }
    try {
      console.log(`Generating: "${item.text}" (${item.lang})...`);
      const buf = await generate(item.text, item.role, item.lang);
      fs.writeFileSync(filePath, buf);
      console.log(`  -> Saved ${fileName} (${buf.length} bytes)`);
      // brief pause to avoid burst rate limits
      await new Promise((r) => setTimeout(r, 600));
    } catch (err: any) {
      console.warn(`  -> Failed for "${item.text}":`, err?.message);
    }
  }
  console.log('Finished pre-generating audio cache!');
}

main().catch(console.error);
