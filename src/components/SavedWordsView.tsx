import React, { useState, useEffect } from 'react';
import { SavedVocabularyItem, InterfaceLanguage } from '../types/academy';
import { StorageService } from '../services/storageService';
import { SpeechService } from '../services/speechService';
import { translations } from '../data/translations';
import {
  Bookmark,
  Volume2,
  Trash2,
  Star,
  Search,
  RotateCw,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface SavedWordsViewProps {
  interfaceLanguage: InterfaceLanguage;
  onNavigate: (view: string) => void;
}

export const SavedWordsView: React.FC<SavedWordsViewProps> = ({
  interfaceLanguage,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const [savedWords, setSavedWords] = useState<SavedVocabularyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [mode, setMode] = useState<'notebook' | 'flashcards'>('notebook');

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setSavedWords(StorageService.getSavedWords());
  }, []);

  const handleDelete = (id: string) => {
    const updated = StorageService.deleteSavedWord(id);
    setSavedWords(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = StorageService.toggleWordFavorite(id);
    setSavedWords(updated);
  };

  const handleSRSReview = (id: string, remembered: boolean) => {
    const updated = StorageService.advanceSRS(id, remembered);
    setSavedWords(updated);
    setIsFlipped(false);
    if (cardIndex < filteredWords.length - 1) {
      setCardIndex(prev => prev + 1);
    } else {
      setCardIndex(0);
    }
    StorageService.addXP(remembered ? 15 : 5);
  };

  const filteredWords = savedWords.filter(w => {
    if (onlyFavorites && !w.isFavorite) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.arabic.toLowerCase().includes(q) ||
        w.kurdishBadini.toLowerCase().includes(q) ||
        w.kurdishSorani.toLowerCase().includes(q) ||
        w.kurdishPhonetic.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCard = filteredWords[cardIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Bookmark className="w-4 h-4" />
            <span>دەفتەری وشەکان و دووبارەکردنەوەی مەودادار (SRS)</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {t.savedWordsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            هەموو ئەو وشە و دەستەواژانەی پاشەکەوتت کردوون، لەگەڵ سیستەمی Leitner بۆ لەبیرنەچوونەوە.
          </p>
        </div>

        {/* View Mode Toggle: Notebook vs Flashcards */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setMode('notebook')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              mode === 'notebook' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            پێڕستی وشەکان ({savedWords.length})
          </button>
          <button
            onClick={() => {
              setMode('flashcards');
              setCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              mode === 'flashcards' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.flashcards}
          </button>
        </div>
      </div>

      {/* FLASHCARDS 3D FLIP MODE */}
      {mode === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6 py-6">
          {filteredWords.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl p-8">
              هیچ وشەیەک پاشەکەوت نەکراوە بۆ فلاش کارت. سەرەتا لە بەشی فەرهەنگ یان وانەکان وشە پاشەکەوت بکە.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>کارتی {cardIndex + 1} لە {filteredWords.length}</span>
                <span className="font-mono text-amber-400">سندووقی SRS: پلەی {activeCard?.srsBox || 1}</span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-80 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl relative transition-transform duration-300 hover:scale-[1.01]"
              >
                {!isFlipped ? (
                  // Front: Arabic Word
                  <div className="space-y-4">
                    <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                      عەرەبی (کلیک بکە بۆ مانا و خوێندنەوە)
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic text-white">
                      {activeCard?.arabicTashkeel || activeCard?.arabic}
                    </h2>
                    <span className="text-xs text-slate-500 block">
                      کلیک لێرە بکە بۆ سوڕانەوە ↻
                    </span>
                  </div>
                ) : (
                  // Back: Kurdish Meaning & Phonetics
                  <div className="space-y-3 animate-fade-in">
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      مانای کوردی و بێژەکردن
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {interfaceLanguage === 'badini' ? activeCard?.kurdishBadini : activeCard?.kurdishSorani}
                    </h3>
                    <p className="text-sm font-mono text-amber-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      خوێندنەوە: {activeCard?.kurdishPhonetic}
                    </p>
                    {activeCard?.exampleArabic && (
                      <p className="text-xs text-slate-300 font-arabic pt-2 border-t border-slate-800">
                        {activeCard.exampleArabic}
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    SpeechService.speakArabic(activeCard?.arabic || '', (activeCard?.dialect === 'fusha' ? 'fusha' : 'iraqi'));
                  }}
                  className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400"
                  title="گوێگرتن لە دەنگ"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* SRS Answer Controls */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSRSReview(activeCard.id, false)}
                  className="py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors"
                >
                  لەبیرم نەبوو (دووبارەکردنەوەی زوو)
                </button>
                <button
                  onClick={() => handleSRSReview(activeCard.id, true)}
                  className="py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors"
                >
                  لەبیرمە (بردنە پێشەوەی سندووق) ✓
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* NOTEBOOK LIST MODE */}
      {mode === 'notebook' && (
        <div className="space-y-4">
          {/* Search & Favorites Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="گەڕان لەناو وشە پاشەکەوتکراوەکانت..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-10 pl-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                onlyFavorites ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 border border-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>دڵخوازەکان</span>
            </button>
          </div>

          {filteredWords.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl p-8">
              هیچ وشەیەک نەدۆزرایەوە لە دەفتەرەکەتدا.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredWords.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold font-arabic text-white">
                        {item.arabicTashkeel || item.arabic}
                      </h3>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleFavorite(item.id)}
                          className={`p-1.5 rounded transition-colors ${
                            item.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={() => SpeechService.speakArabic(item.arabic, (item.dialect === 'fusha' ? 'fusha' : 'iraqi'))}
                          className="p-1.5 rounded text-amber-400 hover:text-amber-300"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mb-2">
                      <p className="text-slate-200">
                        <strong className="text-slate-400">واتا: </strong>
                        {interfaceLanguage === 'badini' ? item.kurdishBadini : item.kurdishSorani}
                      </p>
                      <p className="text-amber-300 font-mono text-[11px]">
                        خوێندنەوە: {item.kurdishPhonetic}
                      </p>
                    </div>

                    {item.exampleArabic && (
                      <p className="text-xs text-slate-400 font-arabic italic">
                        {item.exampleArabic}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span>پێداچوونەوە: {item.timesReviewed} جار</span>
                    <span className="font-mono text-amber-400">سندووقی #{item.srsBox}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
