export type StationId = 
  | 'welcome' 
  | 'map' 
  | 'station1' 
  | 'station2' 
  | 'station3' 
  | 'station4' 
  | 'station5' 
  | 'station6' 
  | 'celebration';

export interface ActivityItem {
  id: string;
  nameVi: string;
  nameEn: string;
  pronounceEn: string;
  iconName: string;
  color: string;
  bgLight: string;
  descriptionVi: string;
  exampleSentenceVi: string;
  exampleSentenceEn: string;
}

export interface MatchingCard {
  id: string;
  activityId: string;
  textVi: string;
  matched: boolean;
}

export interface ActionSentenceQuestion {
  id: string;
  imagePrompt: string;
  character: string;
  actionVi: string;
  optionsVi: string[];
  correctIndex: number;
  englishSentence: string;
  explanation: string;
}

export interface SentenceBuilderTask {
  id: string;
  targetSentence: string;
  englishSentence: string;
  tokens: string[]; // e.g. ["Bạn Mai", "đạp xe."]
  hint: string;
}

export interface PlaygroundQuizItem {
  id: string;
  characterName: string;
  actionVi: string;
  question: string;
  options: string[];
  correctIndex: number;
  englishQuestion: string;
  englishAnswer: string;
  xPercent: number; // position on playground map (0-100)
  yPercent: number;
}

export interface ReporterPrompt {
  id: string;
  activityId: string;
  labelVi: string;
  labelEn: string;
  sampleSentenceVi: string;
  sampleSentenceEn: string;
  hint: string;
}

export interface StationProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
}

export interface UserProgress {
  unlockedStations: Record<string, boolean>;
  stationStars: Record<string, number>;
  discoveredActivities: string[];
  reporterSentence: string;
  badges: string[];
  lastCompletedStation?: string;
}
