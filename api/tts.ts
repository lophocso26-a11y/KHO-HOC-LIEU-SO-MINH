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

  const raw = Buffer.from(base64, 'base64');
  if (raw.toString('ascii', 0, 4) === 'RIFF') return raw;
  // Gemini TTS commonly returns raw signed 16-bit mono PCM at 24 kHz.
  const sampleRate = 24000;
  const wav = Buffer.alloc(44 + raw.length);
  wav.write('RIFF',0); wav.writeUInt32LE(36+raw.length,4); wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22);
  wav.writeUInt32LE(sampleRate,24); wav.writeUInt32LE(sampleRate*2,28);
  wav.writeUInt16LE(2,32); wav.writeUInt16LE(16,34);
  wav.write('data',36); wav.writeUInt32LE(raw.length,40); raw.copy(wav,44);
  return wav;
}


export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({available: !!ai, hasApiKey: !!apiKey, provider:'gemini-tts', cacheCount: fs.existsSync(CACHE_DIR) ? fs.readdirSync(CACHE_DIR).length : 0});
  }
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const {text, voiceRole='teacher', lang='vi'} = req.body || {};
  if (typeof text !== 'string' || !text.trim() || text.length > 1000) return res.status(400).json({error:'Invalid text (maximum 1000 characters)'});
  if (!['teacher','lan','nam'].includes(voiceRole) || !['vi','en'].includes(lang)) return res.status(400).json({error:'Invalid voice or language'});
  const cleanText=text.trim();
  const fileName=getCacheKey(cleanText,voiceRole,lang);
  if (fs.existsSync(path.join(CACHE_DIR,fileName))) return res.status(200).json({audioUrl:`/audio_cache/${fileName}`,cached:true});
  if (!ai) return res.status(503).json({error:'GEMINI_API_KEY has not been configured in Vercel',needConfig:true});
  try {
    const audio=await generateSpeechAudio(cleanText,voiceRole,lang);
    // Serverless filesystem is read-only. Return the audio directly rather than writing to disk.
    // Browser can play the data URI; repeat requests are memoized by the existing frontend engine.
    return res.status(200).json({audioUrl:`data:audio/wav;base64,${audio.toString('base64')}`,cached:false});
  } catch(err:any) {
    console.error('[TTS]',err);
    return res.status(502).json({error:'Unable to generate audio at this time'});
  }
}
