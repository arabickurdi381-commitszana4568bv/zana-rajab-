export type InterfaceLanguage = 'badini' | 'sorani' | 'arabic' | 'english';
export type ArabicDialect = 'iraqi' | 'fusha' | 'both';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface VocabularyItem {
  id: string;
  arabic: string;
  arabicTashkeel: string;
  kurdishBadini: string;
  kurdishSorani: string;
  kurdishPhonetic: string; // Pronunciation written in Kurdish letters
  english: string;
  dialect: 'iraqi' | 'fusha' | 'both';
  category: string;
  difficulty: CEFRLevel;
  exampleArabic: string;
  exampleKurdish: string;
  usageContext: string;
  audioText?: string;
}

export interface ExpressionItem {
  id: string;
  arabic: string;
  kurdishBadini: string;
  kurdishSorani: string;
  kurdishPhonetic: string;
  english: string;
  dialect: 'iraqi' | 'fusha' | 'both';
  category: string;
  context: string;
  culturalNote?: string;
}

export interface DialogueLine {
  speaker: string;
  arabic: string;
  kurdish: string;
  phonetic: string;
}

export interface DailyLesson {
  id: string;
  date: string;
  titleArabic: string;
  titleKurdish: string;
  level: CEFRLevel;
  dialect: ArabicDialect;
  vocabulary: VocabularyItem[];
  expressions: ExpressionItem[];
  dialogue: {
    title: string;
    scenario: string;
    lines: DialogueLine[];
  };
  grammar: {
    ruleTitleArabic: string;
    ruleTitleKurdish: string;
    explanationKurdish: string;
    examples: { arabic: string; kurdish: string; note: string }[];
  };
  listeningExercise: {
    title: string;
    audioScript: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  speakingExercise: {
    promptArabic: string;
    promptKurdish: string;
    targetPhonetic: string;
    expectedPhrases: string[];
    tips: string;
  };
  quiz: {
    question: string;
    questionKurdish: string;
    options: string[];
    correctIndex: number;
    explanationKurdish: string;
  }[];
}

export interface MistakeRecord {
  id: string;
  timestamp: number;
  originalText: string;
  correctedText: string;
  kurdishExplanation: string;
  kurdishPhonetic: string;
  mistakeType: 'grammar' | 'vocabulary' | 'structure' | 'spelling' | 'pronunciation' | 'dialect';
  dialect: ArabicDialect;
  repetitionCount: number;
  isResolved: boolean;
  practiceDrill: string;
}

export interface SavedVocabularyItem extends VocabularyItem {
  savedAt: number;
  srsBox: number; // 1 to 5 (Leitner system)
  nextReviewDate: number;
  timesReviewed: number;
  userNotes?: string;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  timestamp: number;
  text: string;
  audioAvailable?: boolean;
  correction?: {
    original: string;
    corrected: string;
    kurdishExplanation: string;
    phonetic: string;
    mistakeType: string;
  };
  kurdishExplanation?: string;
  phoneticKurdish?: string;
  newVocabulary?: { arabic: string; kurdish: string; phonetic: string }[];
  followUpQuestion?: string;
}

export interface SimulatorScenario {
  id: string;
  titleKurdish: string;
  titleArabic: string;
  titleEnglish: string;
  category: string;
  dialect: 'iraqi' | 'fusha' | 'both';
  location: string;
  difficulty: CEFRLevel;
  image: string;
  aiPersona: string;
  userRole: string;
  situationDescription: string;
  initialAIMessage: string;
  initialPhonetic: string;
  suggestedResponses: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email?: string;
  level: CEFRLevel;
  selectedDialect: 'iraqi' | 'fusha';
  interfaceLanguage: InterfaceLanguage;
  dailyGoalMinutes: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  speakingMinutes: number;
  completedLessonIds: string[];
  skills: {
    vocabulary: number; // 0-100
    grammar: number;
    speaking: number;
    listening: number;
  };
  googleChatSpace?: string;
  dailyNotificationEnabled: boolean;
}
