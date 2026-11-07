import React, { useState, useEffect } from 'react';
import { MistakeRecord, InterfaceLanguage, ArabicDialect } from '../types/academy';
import { translations } from '../data/translations';
import { StorageService } from '../services/storageService';
import { SpeechService } from '../services/speechService';
import {
  AlertTriangle,
  CheckCircle2,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  PieChart,
  Filter
} from 'lucide-react';

interface MistakeCorrectionViewProps {
  interfaceLanguage: InterfaceLanguage;
  activeDialect: ArabicDialect;
  onNavigate: (view: string) => void;
}

export const MistakeCorrectionView: React.FC<MistakeCorrectionViewProps> = ({
  interfaceLanguage,
  activeDialect,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const isRTL = interfaceLanguage !== 'english';

  const [inputSentence, setInputSentence] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any | null>(null);
  const [mistakeList, setMistakeList] = useState<MistakeRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  useEffect(() => {
    // Load recorded mistakes from storage
    const loaded = StorageService.getMistakes();
    if (loaded.length === 0) {
      // Seed initial common student mistakes for immediate value
      const sampleMistakes: Omit<MistakeRecord, 'id' | 'timestamp' | 'repetitionCount' | 'isResolved'>[] = [
        {
          originalText: 'أني يروح للماركت',
          correctedText: 'آنِي أَرُوحْ لِلْمَارْكِتْ (عێراقی) / أَنَا أَذْهَبُ إِلَى السُّوقِ (فصحى)',
          kurdishExplanation: 'لە عەرەبیدا کاتێک بکەر جێناوی کەسی یەکەم بێت (من / أني)، کارەکە پێویستە بە پیتی (ألف) دەستپێبکات (أروح / أذهب)، نەک بە (يـ) چونکە "يروح" بۆ کەسی سێیەمی نێرینەیە (ئەو دەچێت).',
          kurdishPhonetic: 'ئانی ئەڕووحل مارکێت',
          mistakeType: 'grammar',
          dialect: 'iraqi',
          practiceDrill: 'ڕستەی "من دەچمە ماڵەوە" بە عەرەبی عێراقی بنووسە.',
        },
        {
          originalText: 'شلونك خيتي أحمد؟',
          correctedText: 'شْلُونَكْ خُويَا أَحْمَدْ؟',
          kurdishExplanation: 'وشەی "خيتي" واتە خوشکەکەم، بۆ پیاو پێویستە بوترێت "خويا" یان "أخوي" لە عەرەبی عێراقیدا.',
          kurdishPhonetic: 'شلۆنەک خوویا ئەحمەد؟',
          mistakeType: 'vocabulary',
          dialect: 'iraqi',
          practiceDrill: 'سڵاو لە هاوڕێیەکت بکە بە ناوی عەلی.',
        },
      ];
      sampleMistakes.forEach(m => StorageService.recordMistake(m));
      setMistakeList(StorageService.getMistakes());
    } else {
      setMistakeList(loaded);
    }
  }, []);

  const handleAnalyzeSentence = async () => {
    if (!inputSentence.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const response = await fetch('/api/tutor/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: inputSentence.trim(),
          dialect: activeDialect,
          interfaceLanguage,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        setCurrentAnalysis(d);

        // Record in storage
        const updated = StorageService.recordMistake({
          originalText: d.originalSentence || inputSentence,
          correctedText: d.correctedSentence,
          kurdishExplanation: d.kurdishExplanation,
          kurdishPhonetic: d.kurdishPhonetic,
          mistakeType: d.mistakeType || 'grammar',
          dialect: activeDialect,
          practiceDrill: d.practiceDrill || '',
        });
        setMistakeList(updated);
        StorageService.addXP(20);
      }
    } catch (error) {
      console.error('Error analyzing sentence:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingAudioId(id);
    SpeechService.speakArabic(text, activeDialect as 'iraqi' | 'fusha', () => {
      setPlayingAudioId(null);
    });
  };

  const handleResolveMistake = (id: string) => {
    const updated = StorageService.resolveMistake(id);
    setMistakeList(updated);
  };

  const filteredMistakes = mistakeList.filter(m => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unresolved') return !m.isResolved;
    return m.mistakeType === selectedFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>سیستەمی پێشکەوتووی پشکنین و شیکردنەوە</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {t.smartCorrectionTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            هەر ڕستەیەکی عەرەبی بنووسە یان لێرە دایبنێ، ژیری دەستکرد هەڵەی ڕێزمانی، وشە، ڕێنووس و شێوەزارت بۆ ڕاست دەکاتەوە بە ڕوونکردنەوەی تەواوی کوردی.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">کۆی هەڵەکان</span>
            <span className="text-lg font-black text-rose-400 font-mono tabular-nums">{mistakeList.length}</span>
          </div>
        </div>
      </div>

      {/* Input Box for Instant AI Correction */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <label className="text-xs font-bold text-slate-300 block">
          ڕستەی عەرەبی خۆت بنووسە بۆ پشکنین:
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAnalyzeSentence();
            }}
            placeholder="نموونە: أني يروح للسوق، شلونك خيتي علي، أريد أكل في مطعم..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 font-arabic"
          />

          <button
            onClick={handleAnalyzeSentence}
            disabled={!inputSentence.trim() || isAnalyzing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
          >
            {isAnalyzing ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>پشکنین بە ژیری دەستکرد</span>
          </button>
        </div>

        {/* Live Analysis Result Card */}
        {currentAnalysis && (
          <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ئەنجامی شیکردنەوەی زمانەوانی
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded">
                جۆری هەڵە: {currentAnalysis.mistakeType}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-300 block font-bold mb-1">
                  {t.originalSentence}
                </span>
                <p className="text-base font-bold font-arabic text-rose-200">
                  {currentAnalysis.originalSentence}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-emerald-300 block font-bold mb-1">
                    {t.correctSentence}
                  </span>
                  <p className="text-base font-bold font-arabic text-emerald-100">
                    {currentAnalysis.correctedSentence}
                  </p>
                  <p className="text-xs text-amber-300 font-mono mt-1">
                    خوێندنەوە: {currentAnalysis.kurdishPhonetic}
                  </p>
                </div>
                <button
                  onClick={() => handlePlayAudio('curr_correct', currentAnalysis.correctedSentence)}
                  className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 shrink-0"
                  title="گوێگرتن لە دەنگ"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs leading-relaxed space-y-2">
              <span className="text-amber-400 font-bold block">{t.kurdishExplanation}</span>
              <p className="text-slate-200">{currentAnalysis.kurdishExplanation}</p>
            </div>

            {currentAnalysis.practiceDrill && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="text-amber-400 font-bold block mb-1">ڕاهێنانی پێشنیارکراو بۆ تۆ:</span>
                <p className="text-slate-200">{currentAnalysis.practiceDrill}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mistake History & Weakness Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" />
              <span>{t.mistakeHistory}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              چاودێریکردنی ئەوەی ئایا هەمان هەڵە دووبارە دەکەیتەوە یان فێربوویت
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              هەموو
            </button>
            <button
              onClick={() => setSelectedFilter('grammar')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'grammar' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              ڕێزمان
            </button>
            <button
              onClick={() => setSelectedFilter('vocabulary')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'vocabulary' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              وشە
            </button>
            <button
              onClick={() => setSelectedFilter('unresolved')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'unresolved' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              پێویستی بە پێداچوونەوەیە
            </button>
          </div>
        </div>

        {filteredMistakes.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            هیچ هەڵەیەک لەم بەشەدا تۆمار نەکراوە.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-xl border transition-all ${
                  record.isResolved
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                      {record.mistakeType}
                    </span>
                    {record.repetitionCount > 1 && (
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                        {record.repetitionCount} جار دووبارە کراوەتەوە
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayAudio(record.id, record.correctedText)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs"
                      title="گوێگرتن لە دەنگ"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleResolveMistake(record.id)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors ${
                        record.isResolved
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {record.isResolved ? 'فێربووم ✓' : 'وەک فێربوو دیاری بکە'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block">ڕستەی هەڵە:</span>
                    <p className="font-arabic font-bold text-rose-300">{record.originalText}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">ڕستەی دروستکراو:</span>
                    <p className="font-arabic font-bold text-emerald-300">{record.correctedText}</p>
                    <span className="text-[10px] text-amber-300/80 font-mono block">
                      {record.kurdishPhonetic}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {record.kurdishExplanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
