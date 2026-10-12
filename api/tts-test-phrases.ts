import { GoogleGenAI } from '@google/genai';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const CACHE_DIR = path.join(process.cwd(), 'public', 'audio_cache');
function getCacheKey(text: string, voiceRole: string, lang: string): string {
  const hash = crypto.createHash('sha256').update(`${text.trim()}_${voiceRole}_${lang}`).digest('hex').slice(0, 24);
  return `tts_${hash}.wav`;
}
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


export default function handler(req:any,res:any){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const testPhrases=TEST_PHRASES.map(({id,role,text,label})=>{
    const fileName=getCacheKey(text,role,'vi');
    return {id,role,text,label,fileName,audioUrl:`/audio_cache/${fileName}`,isCached:fs.existsSync(path.join(CACHE_DIR,fileName))};
  });
  return res.status(200).json({testPhrases});
}
