import { StudentProfile, SavedVocabularyItem, MistakeRecord, VocabularyItem } from '../types/academy';

const PROFILE_KEY = 'kurdish_arabic_student_profile';
const SAVED_WORDS_KEY = 'kurdish_arabic_saved_words';
const MISTAKES_KEY = 'kurdish_arabic_mistakes';

export const DEFAULT_PROFILE: StudentProfile = {
  id: 'student_1',
  name: 'فێرخوازی کوردستان',
  level: 'A1',
  selectedDialect: 'iraqi',
  interfaceLanguage: 'badini',
  dailyGoalMinutes: 15,
  xp: 350,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  speakingMinutes: 28,
  completedLessonIds: [],
  skills: {
    vocabulary: 68,
    grammar: 54,
    speaking: 62,
    listening: 75,
  },
  googleChatSpace: '',
  dailyNotificationEnabled: true,
};

export class StorageService {
  public static getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (!data) {
        this.saveProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
      }
      const profile: StudentProfile = JSON.parse(data);
      // Auto-update streak logic
      const today = new Date().toISOString().split('T')[0];
      if (profile.lastActiveDate !== today) {
        const last = new Date(profile.lastActiveDate);
        const curr = new Date(today);
        const diffDays = Math.floor((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          profile.streakDays += 1;
        } else if (diffDays > 1) {
          profile.streakDays = 1;
        }
        profile.lastActiveDate = today;
        this.saveProfile(profile);
      }
      return profile;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  public static saveProfile(profile: StudentProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  public static addXP(amount: number): StudentProfile {
    const profile = this.getProfile();
    profile.xp += amount;
    this.saveProfile(profile);
    return profile;
  }

  public static addSpeakingMinutes(minutes: number): StudentProfile {
    const profile = this.getProfile();
    profile.speakingMinutes += minutes;
    profile.skills.speaking = Math.min(100, profile.skills.speaking + 1);
    this.saveProfile(profile);
    return profile;
  }

  public static getSavedWords(): SavedVocabularyItem[] {
    try {
      const data = localStorage.getItem(SAVED_WORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveWord(word: VocabularyItem, userNotes?: string): SavedVocabularyItem[] {
    const existing = this.getSavedWords();
    const foundIndex = existing.findIndex(w => w.id === word.id || w.arabic === word.arabic);
    if (foundIndex >= 0) {
      existing[foundIndex].userNotes = userNotes || existing[foundIndex].userNotes;
      existing[foundIndex].timesReviewed += 1;
    } else {
      const newSaved: SavedVocabularyItem = {
        ...word,
        savedAt: Date.now(),
        srsBox: 1,
        nextReviewDate: Date.now() + 24 * 60 * 60 * 1000, // 1 day interval
        timesReviewed: 0,
        userNotes: userNotes || '',
        isFavorite: false,
      };
      existing.unshift(newSaved);
    }
    localStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(existing));
    return existing;
  }

  public static toggleWordFavorite(id: string): SavedVocabularyItem[] {
    const words = this.getSavedWords();
    const updated = words.map(w => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w);
    localStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(updated));
    return updated;
  }

  public static deleteSavedWord(id: string): SavedVocabularyItem[] {
    const words = this.getSavedWords();
    const filtered = words.filter(w => w.id !== id);
    localStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(filtered));
    return filtered;
  }

  public static advanceSRS(id: string, remembered: boolean): SavedVocabularyItem[] {
    const words = this.getSavedWords();
    const updated = words.map(w => {
      if (w.id !== id) return w;
      let newBox = remembered ? Math.min(5, w.srsBox + 1) : 1;
      const daysMultiplier = [1, 2, 4, 7, 14][newBox - 1];
      return {
        ...w,
        srsBox: newBox,
        timesReviewed: w.timesReviewed + 1,
        nextReviewDate: Date.now() + daysMultiplier * 24 * 60 * 60 * 1000,
      };
    });
    localStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(updated));
    return updated;
  }

  public static getMistakes(): MistakeRecord[] {
    try {
      const data = localStorage.getItem(MISTAKES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static recordMistake(mistake: Omit<MistakeRecord, 'id' | 'timestamp' | 'repetitionCount' | 'isResolved'>): MistakeRecord[] {
    const existing = this.getMistakes();
    const foundIndex = existing.findIndex(m => m.originalText.trim().toLowerCase() === mistake.originalText.trim().toLowerCase());
    if (foundIndex >= 0) {
      existing[foundIndex].repetitionCount += 1;
      existing[foundIndex].isResolved = false;
    } else {
      const record: MistakeRecord = {
        ...mistake,
        id: `mistake_${Date.now()}`,
        timestamp: Date.now(),
        repetitionCount: 1,
        isResolved: false,
      };
      existing.unshift(record);
    }
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(existing));
    return existing;
  }

  public static resolveMistake(id: string): MistakeRecord[] {
    const mistakes = this.getMistakes();
    const updated = mistakes.map(m => m.id === id ? { ...m, isResolved: true } : m);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(updated));
    return updated;
  }
}
