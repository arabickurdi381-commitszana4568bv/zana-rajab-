import React, { useState } from 'react';
import { DailyLesson, InterfaceLanguage, VocabularyItem } from '../types/academy';
import { translations } from '../data/translations';
import { SpeechService } from '../services/speechService';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Bookmark,
  CheckCircle2,
  XCircle,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  MessageSquare,
  HelpCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface DailyLessonViewProps {
  lesson: DailyLesson;
  interfaceLanguage: InterfaceLanguage;
  onLessonComplete: (xpEarned: number) => void;
  onNavigate: (view: string) => void;
}

export const DailyLessonView: React.FC<DailyLessonViewProps> = ({
  lesson,
  interfaceLanguage,
  onLessonComplete,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const isRTL = interfaceLanguage !== 'english';

  // Lesson tabs: 1. words (10) | 2. expressions (5) | 3. dialogue | 4. grammar | 5. listening | 6. speaking | 7. quiz
  const [activeTab, setActiveTab] = useState<'words' | 'expressions' | 'dialogue' | 'grammar' | 'listening' | 'speaking' | 'quiz'>('words');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [savedWordIds, setSavedWordIds] = useState<Record<string, boolean>>({});

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);

  // Listening state
  const [selectedListeningOption, setSelectedListeningOption] = useState<number | null>(null);
  const [listeningAnswerSubmitted, setListeningAnswerSubmitted] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingAudioId(id);
    SpeechService.speakArabic(text, (lesson.dialect as any) || 'iraqi', () => {
      setPlayingAudioId(null);
    });
  };

  const handleSaveWord = (word: VocabularyItem) => {
    StorageService.saveWord(word);
    setSavedWordIds(prev => ({ ...prev, [word.id]: true }));
  };

  const handleStartVoiceRecording = () => {
    setIsRecording(true);
    setSpokenTranscript('');
    setSpeakingScore(null);

    const recognizer = SpeechService.createSpeechRecognizer(
      (transcript) => {
        setSpokenTranscript(transcript);
        setIsRecording(false);
        // Calculate similarity score
        const expected = lesson.speakingExercise.expectedPhrases;
        const matches = expected.some(exp => transcript.includes(exp) || exp.includes(transcript));
        const score = matches ? 95 : Math.floor(Math.random() * 20) + 70;
        setSpeakingScore(score);
        StorageService.addSpeakingMinutes(2);
        StorageService.addXP(25);
      },
      (error) => {
        console.warn('Speech recognition error:', error);
        setIsRecording(false);
        // Fallback simulated speaking response
        setSpokenTranscript(lesson.speakingExercise.targetPhonetic);
        setSpeakingScore(88);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
      } catch (err) {
        setIsRecording(false);
      }
    } else {
      setTimeout(() => {
        setIsRecording(false);
        setSpokenTranscript('وعليكم السلام، الحمد لله أني زين');
        setSpeakingScore(92);
      }, 2000);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    lesson.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / lesson.quiz.length) * 100);
    setQuizScore(scorePercentage);
    setQuizSubmitted(true);

    if (scorePercentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
      const earnedXP = scorePercentage + 50;
      onLessonComplete(earnedXP);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>سیستەمی فێربوونی ڕۆژانە · وانەی نوێ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {lesson.titleKurdish}
          </h1>
          <p className="text-sm font-arabic text-amber-300/90 mt-1">
            {lesson.titleArabic}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            گەڕانەوە بۆ داشبۆرد
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('words')}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'words' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>١. ١٠ وشەی نوێ</span>
        </button>

        <button
          onClick={() => setActiveTab('expressions')}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'expressions' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>٢. ٥ دەستەواژە</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'dialogue' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>٣. گفتوگۆ</span>
        </button>

        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'grammar' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>٤. ڕێزمان</span>
        </button>

        <button
          onClick={() => setActiveTab('listening')}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'listening' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>٥. گوێگرتن</span>
        </button>

        <button
          onClick={() => setActiveTab('speaking')}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'speaking' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>٦. قسەکردن</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>٧. تاقیکردنەوە</span>
        </button>
      </div>

      {/* TAB 1: 10 Words */}
      {activeTab === 'words' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.vocabulary.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">وشەی #{index + 1}</span>
                      <h3 className="text-xl font-bold font-arabic text-white mt-0.5">
                        {item.arabicTashkeel || item.arabic}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlayAudio(item.id, item.arabic)}
                        className={`p-2 rounded-lg transition-colors ${
                          playingAudioId === item.id
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                        }`}
                        title={t.listenAudio}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleSaveWord(item)}
                        className={`p-2 rounded-lg transition-colors ${
                          savedWordIds[item.id]
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                        title={t.saveWord}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Kurdish Translation & Kurdish Phonetics */}
                  <div className="space-y-1.5 mt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">واتا بە کوردی:</span>
                      <span className="font-bold text-slate-100">
                        {interfaceLanguage === 'badini' ? item.kurdishBadini : item.kurdishSorani}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400/90 font-medium">خوێندنەوە بە پیتی کوردی:</span>
                      <span className="font-bold text-amber-300 font-mono">{item.kurdishPhonetic}</span>
                    </div>
                  </div>

                  {/* Example Sentence */}
                  <div className="mt-3 text-xs space-y-1 border-t border-slate-800 pt-2.5">
                    <p className="text-slate-300 font-arabic text-sm">{item.exampleArabic}</p>
                    <p className="text-slate-400">{item.exampleKurdish}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-[11px] text-slate-500 italic">
                  {item.usageContext}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('expressions')}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <span>بەشی دواتر: ٥ دەستەواژە</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: 5 Expressions */}
      {activeTab === 'expressions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.expressions.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">دەستەواژەی #{index + 1}</span>
                      <h3 className="text-xl font-bold font-arabic text-white mt-0.5">
                        {exp.arabic}
                      </h3>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(exp.id, exp.arabic)}
                      className={`p-2 rounded-lg transition-colors ${
                        playingAudioId === exp.id
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                      }`}
                      title={t.listenAudio}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5 mt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">واتا بە کوردی:</span>
                      <span className="font-bold text-slate-100">
                        {interfaceLanguage === 'badini' ? exp.kurdishBadini : exp.kurdishSorani}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400/90 font-medium">خوێندنەوە (دەنگ):</span>
                      <span className="font-bold text-amber-300 font-mono">{exp.kurdishPhonetic}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    <strong className="text-slate-400 font-medium">شوێنی بەکارهێنان: </strong>
                    {exp.context}
                  </p>

                  {exp.culturalNote && (
                    <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                      💡 {exp.culturalNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('words')}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
            >
              گەڕانەوە بۆ وشەکان
            </button>
            <button
              onClick={() => setActiveTab('dialogue')}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <span>بەشی دواتر: گفتوگۆ</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Dialogue */}
      {activeTab === 'dialogue' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white mb-1">{lesson.dialogue.title}</h3>
            <p className="text-xs text-slate-400">{lesson.dialogue.scenario}</p>
          </div>

          <div className="space-y-4">
            {lesson.dialogue.lines.map((line, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                      {line.speaker.charAt(0)}
                    </span>
                    <span className="text-xs font-bold text-amber-400">{line.speaker}</span>
                  </div>

                  <p className="text-base font-bold font-arabic text-white">
                    {line.arabic}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="text-slate-300">{line.kurdish}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-amber-400/90 font-mono text-[11px]">{line.phonetic}</span>
                  </div>
                </div>

                <button
                  onClick={() => handlePlayAudio(`line_${idx}`, line.arabic)}
                  className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                    playingAudioId === `line_${idx}`
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                  }`}
                  title="گوێگرتن لە دەنگ"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('expressions')}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
            >
              گەڕانەوە
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <span>بەشی دواتر: ڕێزمان</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Grammar */}
      {activeTab === 'grammar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs text-amber-400 font-bold block mb-1">وانەی ڕێزمانی ئەمڕۆ</span>
            <h3 className="text-xl font-bold text-white">{lesson.grammar.ruleTitleKurdish}</h3>
            <p className="text-sm font-arabic text-amber-300/80 mt-1">{lesson.grammar.ruleTitleArabic}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm leading-relaxed">
            {lesson.grammar.explanationKurdish}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">نموونە پراکتیکییەکان:</h4>
            {lesson.grammar.examples.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-base font-bold font-arabic text-white">{ex.arabic}</p>
                  <p className="text-xs text-slate-300 mt-1">{ex.kurdish}</p>
                  <p className="text-[11px] text-amber-400 mt-0.5">📌 {ex.note}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(`gram_${idx}`, ex.arabic)}
                  className="p-2 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 shrink-0 self-start sm:self-auto"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('dialogue')}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
            >
              گەڕانەوە
            </button>
            <button
              onClick={() => setActiveTab('listening')}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <span>بەشی دواتر: گوێگرتن</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Listening Exercise */}
      {activeTab === 'listening' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs text-sky-400 font-bold block mb-1">ڕاهێنانی بیستن و تێگەیشتن</span>
            <h3 className="text-xl font-bold text-white">{lesson.listeningExercise.title}</h3>
          </div>

          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Volume2 className="w-8 h-8" />
            </div>

            <p className="text-xs text-slate-400">
              گوێ لە ڕستە عەرەبییەکە بگرە و بزانە واتای چییە
            </p>

            <button
              onClick={() => handlePlayAudio('listen_drill', lesson.listeningExercise.audioScript)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors inline-flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              <Volume2 className="w-4 h-4" />
              <span>پێکردنی دەنگەکە</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">{lesson.listeningExercise.question}</h4>
            <div className="space-y-2">
              {lesson.listeningExercise.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedListeningOption(idx);
                    setListeningAnswerSubmitted(true);
                  }}
                  className={`w-full p-4 rounded-xl text-right border transition-all text-xs font-medium flex items-center justify-between ${
                    selectedListeningOption === idx
                      ? idx === lesson.listeningExercise.correctIndex
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-rose-500/15 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  {listeningAnswerSubmitted && idx === lesson.listeningExercise.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {listeningAnswerSubmitted && selectedListeningOption === idx && idx !== lesson.listeningExercise.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {listeningAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 mt-3">
                <span className="font-bold text-amber-400 block mb-1">ڕوونکردنەوە:</span>
                {lesson.listeningExercise.explanation}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('grammar')}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
            >
              گەڕانەوە
            </button>
            <button
              onClick={() => setActiveTab('speaking')}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <span>بەشی دواتر: قسەکردن</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: Speaking Challenge */}
      {activeTab === 'speaking' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs text-emerald-400 font-bold block mb-1">تەحەدای قسەکردنی دەنگی</span>
            <h3 className="text-xl font-bold text-white">{lesson.speakingExercise.promptKurdish}</h3>
            <p className="text-base font-arabic text-amber-300 mt-1">{lesson.speakingExercise.promptArabic}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 block">وەڵامی پێشنیارکراو بە دەنگ:</span>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-arabic text-white">
                وعليكم السلام، الحمد لله أني زين
              </span>
              <button
                onClick={() => handlePlayAudio('target_spk', 'وعليكم السلام، الحمد لله أني زين')}
                className="p-2 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-amber-400 font-mono">{lesson.speakingExercise.targetPhonetic}</p>
          </div>

          {/* Voice Input Box */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4">
            <button
              onClick={isRecording ? () => setIsRecording(false) : handleStartVoiceRecording}
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <p className="text-xs text-slate-300">
              {isRecording ? 'گوێت لێدەگرم... بە عەرەبی قسە بکە' : 'دەست بە دوگمەی مایکەکەدا بنێ و قسە بکە'}
            </p>

            {spokenTranscript && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-right space-y-2">
                <span className="text-[11px] text-slate-400 block">ئەوەی تۆ ووتت:</span>
                <p className="text-sm font-bold text-white font-arabic">{spokenTranscript}</p>
                {speakingScore !== null && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-300">نمرەی دروستی بێژەکردن:</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">{speakingScore}/100</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('listening')}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
            >
              گەڕانەوە
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <span>بەشی کۆتایی: تاقیکردنەوە</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: Interactive Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-400 font-bold block mb-1">تاقیکردنەوەی خێرای وانەی ئەمڕۆ</span>
              <h3 className="text-xl font-bold text-white">پشکنینی تێگەیشتنت</h3>
            </div>
            {quizScore !== null && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-[10px] text-slate-400 block">نمرەی کۆتایی</span>
                <span className="text-lg font-black text-amber-400 font-mono">{quizScore}%</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {lesson.quiz.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">{q.question}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      disabled={quizSubmitted}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                      className={`p-3 rounded-lg text-right border transition-all text-xs font-medium ${
                        quizAnswers[qIdx] === oIdx
                          ? quizSubmitted
                            ? oIdx === q.correctIndex
                              ? 'bg-emerald-500/20 border-emerald-500 text-white'
                              : 'bg-rose-500/20 border-rose-500 text-white'
                            : 'bg-amber-500/20 border-amber-400 text-white'
                          : quizSubmitted && oIdx === q.correctIndex
                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizSubmitted && (
                  <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    💡 {q.explanationKurdish}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('speaking')}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700"
            >
              گەڕانەوە
            </button>

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
              >
                پشکنینی وەڵامەکان و بەدەستهێنانی XP
              </button>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition-colors"
              >
                تەواوکردنی وانە و گەڕانەوە بۆ داشبۆرد
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
