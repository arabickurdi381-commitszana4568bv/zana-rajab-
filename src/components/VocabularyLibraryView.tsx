import React, { useState } from 'react';
import { VocabularyItem, InterfaceLanguage, ArabicDialect } from '../types/academy';
import { INITIAL_VOCABULARY, CATEGORIES_LIST } from '../data/curriculumData';
import { translations } from '../data/translations';
import { SpeechService } from '../services/speechService';
import { StorageService } from '../services/storageService';
import {
  Search,
  Volume2,
  Bookmark,
  Sparkles,
  Filter,
  Globe,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface VocabularyLibraryViewProps {
  interfaceLanguage: InterfaceLanguage;
  activeDialect: ArabicDialect;
  onNavigate: (view: string) => void;
}

export const VocabularyLibraryView: React.FC<VocabularyLibraryViewProps> = ({
  interfaceLanguage,
  activeDialect,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDialectFilter, setSelectedDialectFilter] = useState<'all' | 'iraqi' | 'fusha'>('all');
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Search grounding state
  const [groundingQuery, setGroundingQuery] = useState('');
  const [groundingResult, setGroundingResult] = useState<any | null>(null);
  const [isSearchingGrounding, setIsSearchingGrounding] = useState(false);

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingId(id);
    SpeechService.speakArabic(text, activeDialect as 'iraqi' | 'fusha', () => {
      setPlayingId(null);
    });
  };

  const handleSave = (item: VocabularyItem) => {
    StorageService.saveWord(item);
    setSavedIds(prev => ({ ...prev, [item.id]: true }));
    StorageService.addXP(10);
  };

  const handleSearchGrounding = async () => {
    if (!groundingQuery.trim() || isSearchingGrounding) return;
    setIsSearchingGrounding(true);
    setGroundingResult(null);

    try {
      const response = await fetch('/api/culture/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: groundingQuery,
          dialect: activeDialect,
          interfaceLanguage,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setGroundingResult(resData.data);
      }
    } catch (err) {
      console.error('Grounding search error:', err);
    } finally {
      setIsSearchingGrounding(false);
    }
  };

  const filteredWords = INITIAL_VOCABULARY.filter(w => {
    // Category match
    if (selectedCategory !== 'all' && w.category !== selectedCategory) {
      return false;
    }
    // Dialect match
    if (selectedDialectFilter !== 'all' && w.dialect !== 'both' && w.dialect !== selectedDialectFilter) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inAr = w.arabic.toLowerCase().includes(q);
      const inBadini = w.kurdishBadini.toLowerCase().includes(q);
      const inSorani = w.kurdishSorani.toLowerCase().includes(q);
      const inPhonetic = w.kurdishPhonetic.toLowerCase().includes(q);
      const inEng = w.english.toLowerCase().includes(q);
      return inAr || inBadini || inSorani || inPhonetic || inEng;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>پەرتووکخانەی گشتگیری عەرەبی</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            فەرهەنگی ٢٦ بەشی ڕۆژانە بە کوردی
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            هەموو وشەیەک بە ڕێنووسی کوردی بۆ دەنگەکان، نموونەی بەکارهێنان و دەنگی بێژەکردن.
          </p>
        </div>

        <button
          onClick={() => onNavigate('saved')}
          className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors shrink-0"
        >
          {t.savedWordsTitle} (فلاش کارت)
        </button>
      </div>

      {/* Search Grounding Bar for Real-World Idioms */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-900/50 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
          <Globe className="w-4 h-4 text-sky-400" />
          <span>گەڕانی بەستراو بە گووگڵ (Google Search Grounding) بۆ زاراوە و کولتوور</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={groundingQuery}
            onChange={(e) => setGroundingQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchGrounding();
            }}
            placeholder="نموونە: واتای فدوه، پەندی عەرەبی عێراقی، زاراوەی ئەندازیاری لە بەغدا..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-400 font-arabic"
          />
          <button
            onClick={handleSearchGrounding}
            disabled={!groundingQuery.trim() || isSearchingGrounding}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSearchingGrounding ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>گەڕانی کولتووری</span>
          </button>
        </div>

        {groundingResult && (
          <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed space-y-2">
            <span className="font-bold text-amber-400 block">شیکردنەوەی کولتووری و ڕاستەقینەی زاراوەکە:</span>
            <div className="text-slate-200 whitespace-pre-line">{groundingResult.explanation}</div>
          </div>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Text Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Dialect Filter Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold shrink-0">
            <button
              onClick={() => setSelectedDialectFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedDialectFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              هەموو شێوەزارەکان
            </button>
            <button
              onClick={() => setSelectedDialectFilter('iraqi')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedDialectFilter === 'iraqi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              عەرەبی عێراقی
            </button>
            <button
              onClick={() => setSelectedDialectFilter('fusha')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedDialectFilter === 'fusha' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              فوسحا
            </button>
          </div>
        </div>

        {/* 26 Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            هەموو بەشەکان ({INITIAL_VOCABULARY.length})
          </button>

          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.nameKurdish}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {item.dialect === 'iraqi' ? 'عەرەبی عێراقی' : item.dialect === 'fusha' ? 'عەرەبی فوسحا' : 'هاوبەش'}
                  </span>
                  <h3 className="text-xl font-bold font-arabic text-white mt-0.5">
                    {item.arabicTashkeel || item.arabic}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePlayAudio(item.id, item.arabic)}
                    className={`p-2 rounded-lg transition-colors ${
                      playingId === item.id
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                    }`}
                    title={t.listenAudio}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSave(item)}
                    className={`p-2 rounded-lg transition-colors ${
                      savedIds[item.id]
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                    title={t.saveWord}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Kurdish Translation & Phonetics */}
              <div className="space-y-1.5 mt-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">واتا:</span>
                  <span className="font-bold text-slate-100">
                    {interfaceLanguage === 'badini' ? item.kurdishBadini : item.kurdishSorani}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400/90 font-medium">خوێندنەوە:</span>
                  <span className="font-bold text-amber-300 font-mono">{item.kurdishPhonetic}</span>
                </div>
              </div>

              {/* Example Sentence */}
              <div className="mt-3 text-xs space-y-1 border-t border-slate-800 pt-2.5">
                <p className="text-slate-300 font-arabic text-sm">{item.exampleArabic}</p>
                <p className="text-slate-400">{item.exampleKurdish}</p>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-slate-500 border-t border-slate-800/40">
              {item.usageContext}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
