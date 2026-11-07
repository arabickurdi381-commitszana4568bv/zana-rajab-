import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, InterfaceLanguage, ArabicDialect, VocabularyItem } from '../types/academy';
import { translations } from '../data/translations';
import { SpeechService } from '../services/speechService';
import { StorageService } from '../services/storageService';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  RotateCcw,
  PlusCircle,
  X,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

interface AITutorViewProps {
  interfaceLanguage: InterfaceLanguage;
  activeDialect: ArabicDialect;
  onNavigate: (view: string) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  interfaceLanguage,
  activeDialect,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      timestamp: Date.now(),
      text: activeDialect === 'iraqi'
        ? 'السلام عليكم عيني! أني أستاذك الذكي لتعليم العربي. شلونك اليوم وشلون صحتك؟ تحب نسولف عن شنو؟'
        : 'السلامُ عليكم ورحمةُ اللهِ! أنا مُعلِّمُكَ الذكي لتعليمِ اللغةِ العربية. كيفَ حالُكَ اليوم؟ عن أي موضوعٍ تودُّ أن نتحدَّث؟',
      kurdishExplanation: activeDialect === 'iraqi'
        ? 'سڵاو چاوەکەم! من مامۆستای زیرەکی تۆم بۆ فێربوونی عەرەبی. ئەمڕۆ چۆنیت و تەندروستیت چۆنە؟ حەز دەکەیت باسی چی بکەین؟'
        : 'سڵاوت لێبێت! من مامۆستای زیرەکی تۆم بۆ فێربوونی زمانی عەرەبی. ئەمڕۆ چۆنیت؟ حەز دەکەیت دەربارەی چ بابەتێک بدوێین؟',
      phoneticKurdish: activeDialect === 'iraqi'
        ? 'ئەسسەلامو عەلەیکوم عەینی! ئانی ئوستازەک ئەززەکی ل تەعلیم ئەلعەرەبی. شلۆنەک ئەلیۆم وە شلۆن سەححەتەک؟'
        : 'ئەسسەلامو عەلەیکوم وە ڕەحمەتوللا! ئەنا موعەللیمکەز زەکی ل تەعلیمیل لوغەتول عەرەبییە.',
      newVocabulary: [
        {
          arabic: activeDialect === 'iraqi' ? 'نسولف' : 'نتحدث',
          kurdish: 'قسە بکەین / گەنگەشە بکەین',
          phonetic: activeDialect === 'iraqi' ? 'نسۆلف' : 'نەتەحەدەس',
        },
      ],
      followUpQuestion: activeDialect === 'iraqi' ? 'إنت من يا مدينة بكردستان؟' : 'من أيِّ مدينةٍ أنت؟',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI Word Generator State
  const [showWordGenerator, setShowWordGenerator] = useState(false);
  const [generatorTopic, setGeneratorTopic] = useState('');
  const [isGeneratingWords, setIsGeneratingWords] = useState(false);
  const [generatedWords, setGeneratedWords] = useState<any[]>([]);
  const [savedGenWordIds, setSavedGenWordIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      timestamp: Date.now(),
      text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          dialect: activeDialect,
          interfaceLanguage,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;

        // If mistake found, record it into storage
        if (d.hasMistake && d.correction) {
          StorageService.recordMistake({
            originalText: d.correction.original || text,
            correctedText: d.correction.corrected || '',
            kurdishExplanation: d.correction.kurdishExplanation || '',
            kurdishPhonetic: d.correction.phonetic || '',
            mistakeType: (d.correction.mistakeType as any) || 'grammar',
            dialect: activeDialect,
            practiceDrill: d.followUpQuestion || '',
          });
        }

        const tutorMessage: ChatMessage = {
          id: `tutor_${Date.now()}`,
          sender: 'tutor',
          timestamp: Date.now(),
          text: d.arabicResponse,
          kurdishExplanation: d.kurdishExplanation,
          phoneticKurdish: d.kurdishPhonetic,
          correction: d.hasMistake ? d.correction : undefined,
          newVocabulary: d.newVocabulary,
          followUpQuestion: d.followUpQuestion,
        };

        setMessages(prev => [...prev, tutorMessage]);
        StorageService.addXP(15);

        // Native Gemini TTS audio playback
        SpeechService.speakArabic(d.arabicResponse, activeDialect as 'iraqi' | 'fusha');
      }
    } catch (error) {
      console.error('Tutor API error:', error);
      const fallback: ChatMessage = {
        id: `tutor_fb_${Date.now()}`,
        sender: 'tutor',
        timestamp: Date.now(),
        text: 'عاشت إيدك! كلامك مفهوم وممتاز. تفضل واسألني أي شي تريده بالعربي أو الكردي.',
        kurdishExplanation: 'دەستت خۆش! قسەکەت تێگەیشتراو و نایاب بوو. فەرموو هەر پرسیارێکت هەیە بە عەرەبی یان کوردی لێم بپرسە.',
        phoneticKurdish: 'عاشەت یدەک! کەلامەک مەفهووم وە مومتاز.',
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    const recognizer = SpeechService.createSpeechRecognizer(
      (transcript) => {
        setIsRecording(false);
        setInputVal(transcript);
        handleSendMessage(transcript);
        StorageService.addSpeakingMinutes(1);
      },
      (err) => {
        console.warn('Speech rec error:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch {
        setIsRecording(false);
      }
    } else {
      setTimeout(() => {
        setIsRecording(false);
        setInputVal('شلون الصحة أستاذ؟');
      }, 1500);
    }
  };

  const handlePlaySpeech = (id: string, text: string) => {
    setPlayingMessageId(id);
    SpeechService.speakArabic(text, activeDialect as 'iraqi' | 'fusha', () => {
      setPlayingMessageId(null);
    });
  };

  // AI New Word Generator Handler
  const handleGenerateWords = async (specificTopic?: string) => {
    const topicToUse = specificTopic || generatorTopic || messages.slice(-3).map(m => m.text).join(' ');
    setIsGeneratingWords(true);
    try {
      const res = await fetch('/api/tutor/generate-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          dialect: activeDialect,
          interfaceLanguage,
          count: 5,
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        setGeneratedWords(resData.data);
        StorageService.addXP(20);
      }
    } catch (err) {
      console.error('Word generator error:', err);
    } finally {
      setIsGeneratingWords(false);
    }
  };

  const handleSaveGeneratedWord = (item: any) => {
    const voc: VocabularyItem = {
      id: item.id || `gen_${Date.now()}`,
      arabic: item.arabic,
      arabicTashkeel: item.arabicTashkeel || item.arabic,
      kurdishBadini: item.kurdishBadini,
      kurdishSorani: item.kurdishSorani,
      kurdishPhonetic: item.kurdishPhonetic,
      english: item.english || '',
      dialect: item.dialect || activeDialect,
      category: 'ai_generated',
      difficulty: 'A2',
      exampleArabic: item.exampleArabic || '',
      exampleKurdish: item.exampleKurdish || '',
      usageContext: item.usageContext || 'دروستکراو بە ژیری دەستکرد',
    };
    StorageService.saveWord(voc);
    setSavedGenWordIds(prev => ({ ...prev, [item.id]: true }));
    StorageService.addXP(10);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-5rem)] flex flex-col space-y-4">
      
      {/* Top Tutor Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                مامۆستای ژیری دەنگی (AI Arabic Tutor)
              </h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                دەنگی ڕاستەقینە · Gemini TTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {activeDialect === 'iraqi' ? 'شێوەزاری عەرەبی عێراقی' : 'عەرەبی فوسحا'} · وەڵامدانەوە و شیکردنەوە بە کوردی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI New Word Generator Action Button */}
          <button
            onClick={() => {
              setShowWordGenerator(true);
              if (generatedWords.length === 0) {
                handleGenerateWords();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>دروستکردنی وشەی نوێ</span>
          </button>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs"
            title="دەستپێکردنەوەی گفتوگۆ"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2.5 shadow-md ${
                  isTutor
                    ? 'bg-slate-900 border border-slate-800 text-slate-100'
                    : 'bg-amber-500 text-slate-950 font-medium'
                }`}
              >
                {/* Arabic Text & Audio Play Button */}
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-base sm:text-lg font-arabic font-bold leading-relaxed ${isTutor ? 'text-white' : 'text-slate-950'}`}>
                    {msg.text}
                  </p>

                  {isTutor && (
                    <button
                      onClick={() => handlePlaySpeech(msg.id, msg.text)}
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        playingMessageId === msg.id
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                      }`}
                      title="گوێگرتن لە دەنگی ڕاستەقینەی Gemini"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Kurdish Phonetic Pronunciation for Tutor */}
                {isTutor && msg.phoneticKurdish && (
                  <div className="text-xs text-amber-300 font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block mb-0.5">خوێندنەوە (ڕێنووسی کوردی بۆ دەنگ):</span>
                    {msg.phoneticKurdish}
                  </div>
                )}

                {/* Kurdish Explanation for Tutor */}
                {isTutor && msg.kurdishExplanation && (
                  <div className="text-xs text-slate-300 border-t border-slate-800/80 pt-2 leading-relaxed">
                    <span className="text-slate-400 block text-[10px] font-semibold mb-0.5">مانا بە کوردی:</span>
                    {msg.kurdishExplanation}
                  </div>
                )}

                {/* Gentle Error Correction Block */}
                {isTutor && msg.correction && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>چاککردنەوەی هەڵە:</span>
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-400">ڕستەی ڕاست: </span>
                      <strong className="text-white font-arabic">{msg.correction.corrected}</strong>
                    </div>
                    <p className="text-slate-300">{msg.correction.kurdishExplanation}</p>
                    <span className="text-[11px] text-amber-400 font-mono block">
                      خوێندنەوە: {msg.correction.phonetic}
                    </span>
                  </div>
                )}

                {/* New Vocabulary Spotlight */}
                {isTutor && msg.newVocabulary && msg.newVocabulary.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-800/80 text-xs space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block">وشەی نوێی ئەم گفتوگۆیە:</span>
                    {msg.newVocabulary.map((voc, vIdx) => (
                      <div key={vIdx} className="flex items-center justify-between bg-slate-950/40 px-2 py-1 rounded">
                        <span className="font-bold text-white font-arabic">{voc.arabic}</span>
                        <span className="text-slate-400">{voc.kurdish}</span>
                        <span className="text-amber-300 text-[10px] font-mono">{voc.phonetic}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up question suggestion */}
                {isTutor && msg.followUpQuestion && (
                  <div className="pt-2 text-xs text-slate-400">
                    <span className="text-amber-400 font-bold block mb-0.5">پرسیاری دواتر:</span>
                    <button
                      onClick={() => handleSendMessage(msg.followUpQuestion!)}
                      className="text-right text-slate-200 hover:text-amber-300 underline font-arabic"
                    >
                      "{msg.followUpQuestion}"
                    </button>
                  </div>
                )}
              </div>

              {!isTutor && (
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-1 font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{t.analyzingWithAI}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs shrink-0">
        <span className="text-slate-500 text-[11px] whitespace-nowrap">پێشنیارەکان:</span>
        <button
          onClick={() => handleSendMessage('شلونك عمي شكو ماكو؟')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg whitespace-nowrap transition-colors"
        >
          شلونك عمي شكو ماكو؟
        </button>
        <button
          onClick={() => handleSendMessage('أريد أطلب أكل بالمطعم شگول؟')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg whitespace-nowrap transition-colors"
        >
          لە چێشتخانە خواردن داوا دەکەم
        </button>
        <button
          onClick={() => handleSendMessage('چۆن بە عەرەبی بڵێم زۆر سوپاس بۆ هاوکاریت؟')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg whitespace-nowrap transition-colors"
        >
          پرسیارکردن بە کوردی
        </button>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-2 shadow-lg shrink-0">
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-3 rounded-xl transition-all ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
          }`}
          title={isRecording ? 'وەستاندنی دەنگ' : 'دەستپێکردنی قسەکردن بە دەنگ'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={t.typeYourMessage}
          className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none px-2"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim() || isLoading}
          className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* AI WORD GENERATOR MODAL / PANEL */}
      {showWordGenerator && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    دروستکردنی وشەی نوێ بە ژیری دەستکرد (AI Vocabulary Generator)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    وشەی نوێ بۆ هەر بابەتێک دروست بکە و ڕاستەوخۆ پاشەکەوتی بکە بۆ دەفتەرەکەت
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWordGenerator(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Topic Presets */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">یان بابەتێک هەڵبژێرە:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {['خواردن و چێشتخانە', 'تەکسی و هاتوچۆ', 'بازاڕ و مامەڵە', 'ئەندازیاری شارستانی', 'نەخۆشخانە و دەرمان', 'سەفەر و فڕۆکەخانە'].map((top) => (
                  <button
                    key={top}
                    onClick={() => {
                      setGeneratorTopic(top);
                      handleGenerateWords(top);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={generatorTopic}
                onChange={(e) => setGeneratorTopic(e.target.value)}
                placeholder="یان هەر بابەتێک دەتەوێت بنووسە (بۆ نموونە: وەرزش، پڕۆگرامین، ئۆتۆمبێل...)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                onClick={() => handleGenerateWords()}
                disabled={isGeneratingWords}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isGeneratingWords ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>دروستکردن</span>
              </button>
            </div>

            {/* Results Grid */}
            <div className="space-y-3 pt-2">
              {isGeneratingWords ? (
                <div className="text-center py-8 text-amber-400 text-xs flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>ژیری دەستکرد سەرقاڵی دروستکردنی وشە و دەستەواژەی نوێیە بە دەنگ و ڕێنووسی کوردی...</span>
                </div>
              ) : generatedWords.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedWords.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-amber-500/40 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-lg font-bold font-arabic text-white">
                            {item.arabicTashkeel || item.arabic}
                          </h4>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => SpeechService.speakArabic(item.arabic, activeDialect as 'iraqi' | 'fusha')}
                              className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"
                              title="گوێگرتن لە دەنگ"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSaveGeneratedWord(item)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                savedGenWordIds[item.id]
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                              title="پاشەکەوتکردن لە دەفتەر"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800/80 space-y-0.5">
                          <p className="text-slate-200">
                            <strong className="text-slate-400">واتا: </strong>
                            {interfaceLanguage === 'badini' ? item.kurdishBadini : item.kurdishSorani}
                          </p>
                          <p className="text-amber-300 font-mono text-[11px]">
                            خوێندنەوە: {item.kurdishPhonetic}
                          </p>
                        </div>

                        {item.exampleArabic && (
                          <p className="text-[11px] text-slate-400 font-arabic pt-1">
                            {item.exampleArabic} - {item.exampleKurdish}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setInputVal(prev => (prev ? `${prev} ${item.arabic}` : item.arabic));
                          setShowWordGenerator(false);
                        }}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                      >
                        بەکارهێنان لە ناو گفتوگۆ
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
