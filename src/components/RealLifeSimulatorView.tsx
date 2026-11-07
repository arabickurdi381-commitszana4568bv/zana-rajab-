import React, { useState } from 'react';
import { SimulatorScenario, InterfaceLanguage, ArabicDialect } from '../types/academy';
import { INITIAL_SIMULATORS } from '../data/curriculumData';
import { translations } from '../data/translations';
import { SpeechService } from '../services/speechService';
import { StorageService } from '../services/storageService';
import {
  Compass,
  Volume2,
  Mic,
  MicOff,
  Send,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface RealLifeSimulatorViewProps {
  interfaceLanguage: InterfaceLanguage;
  activeDialect: ArabicDialect;
  onNavigate: (view: string) => void;
}

export const RealLifeSimulatorView: React.FC<RealLifeSimulatorViewProps> = ({
  interfaceLanguage,
  activeDialect,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const isRTL = interfaceLanguage !== 'english';

  const [selectedScenario, setSelectedScenario] = useState<SimulatorScenario>(INITIAL_SIMULATORS[0]);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'ai' | 'user'; text: string; phonetic?: string; score?: number; kurdishFeedback?: string }>>([
    {
      role: 'ai',
      text: INITIAL_SIMULATORS[0].initialAIMessage,
      phonetic: INITIAL_SIMULATORS[0].initialPhonetic,
    },
  ]);

  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [turnCount, setTurnCount] = useState<number>(0);

  const handleSelectScenario = (sc: SimulatorScenario) => {
    setSelectedScenario(sc);
    setChatHistory([
      {
        role: 'ai',
        text: sc.initialAIMessage,
        phonetic: sc.initialPhonetic,
      },
    ]);
    setUserSpeechInput('');
    setTotalScore(0);
    setTurnCount(0);
  };

  const handleSendTurn = async (textToSend?: string) => {
    const text = (textToSend || userSpeechInput).trim();
    if (!text || isEvaluating) return;

    const newHistory = [...chatHistory, { role: 'user' as const, text }];
    setChatHistory(newHistory);
    setUserSpeechInput('');
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/tutor/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          scenarioTitle: selectedScenario.titleKurdish,
          aiPersona: selectedScenario.aiPersona,
          userRole: selectedScenario.userRole,
          userMessage: text,
          history: newHistory,
          dialect: selectedScenario.dialect,
          interfaceLanguage,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        const newScore = Math.round((totalScore * turnCount + d.score) / (turnCount + 1));
        setTotalScore(newScore);
        setTurnCount(prev => prev + 1);

        setChatHistory(prev => [
          ...prev,
          {
            role: 'ai',
            text: d.replyArabic,
            phonetic: d.kurdishPhonetic,
            score: d.score,
            kurdishFeedback: d.kurdishFeedback,
          },
        ]);

        StorageService.addXP(d.score > 80 ? 30 : 15);
        StorageService.addSpeakingMinutes(2);
        SpeechService.speakArabic(d.replyArabic, (selectedScenario.dialect === 'fusha' ? 'fusha' : 'iraqi'));
      }
    } catch (error) {
      console.error('Simulator error:', error);
      // Fallback response
      setChatHistory(prev => [
        ...prev,
        {
          role: 'ai',
          text: 'تمام، كلامك واضح ومناسب للموقف. كمل كلامك وياي.',
          phonetic: 'تەمام، کەلامەک وازح وە موناسیب لێل مەوقیف.',
          score: 85,
          kurdishFeedback: 'دەستت خۆش، دەربڕینەکەت گونجاو بوو بۆ ئەم دۆخە.',
        },
      ]);
    } finally {
      setIsEvaluating(false);
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
        setUserSpeechInput(transcript);
        handleSendTurn(transcript);
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
        setUserSpeechInput('هلو عمي شگد سعره هذا فدوه؟');
      }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>سیمولەیتەری زیرەکی ڕۆژانە (Daily Life Simulator)</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            مەشقکردن لە دۆخی ڕاستەقینەی عێراق و ژیان
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            لێرەدا وەک بازاڕی بەغدا، پڕۆژەی بیناسازی، نەخۆشخانە، هۆتێل و تەکسی قسە بکە و نمرە بەدەستبهێنە.
          </p>
        </div>

        {turnCount > 0 && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
            <span className="text-[10px] text-slate-400 block">نمرەی دۆخەکە</span>
            <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">{totalScore}/100</span>
          </div>
        )}
      </div>

      {/* Scenario Picker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {INITIAL_SIMULATORS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => handleSelectScenario(sc)}
            className={`rounded-2xl overflow-hidden border text-right transition-all flex flex-col group ${
              selectedScenario.id === sc.id
                ? 'border-amber-400 bg-slate-900 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400'
                : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
            }`}
          >
            <div className="h-32 w-full overflow-hidden relative">
              <img
                src={sc.image}
                alt={sc.titleKurdish}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold">
                {sc.location}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{sc.titleKurdish}</h3>
                <p className="text-xs text-amber-400/90 font-arabic mt-0.5">{sc.titleArabic}</p>
              </div>

              <div className="pt-3 text-[11px] text-slate-400 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                <span>ڕۆڵی تۆ: {sc.userRole}</span>
                <span className="font-mono text-amber-400">{sc.difficulty}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Roleplay Arena */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Arena Top Info Banner */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">{selectedScenario.titleKurdish}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{selectedScenario.aiPersona}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{selectedScenario.situationDescription}</p>
          </div>

          <button
            onClick={() => handleSelectScenario(selectedScenario)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>دەستپێکردنەوە</span>
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto">
          {chatHistory.map((item, index) => {
            const isAI = item.role === 'ai';
            return (
              <div
                key={index}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1.5`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-md space-y-2 ${
                    isAI
                      ? 'bg-slate-950 border border-slate-800 text-white'
                      : 'bg-amber-500 text-slate-950 font-bold'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-base font-arabic font-bold ${isAI ? 'text-white' : 'text-slate-950'}`}>
                      {item.text}
                    </p>
                    {isAI && (
                      <button
                        onClick={() => SpeechService.speakArabic(item.text, (selectedScenario.dialect === 'fusha' ? 'fusha' : 'iraqi'))}
                        className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 shrink-0"
                        title="گوێگرتن لە دەنگ"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isAI && item.phonetic && (
                    <p className="text-xs text-amber-300 font-mono bg-slate-900 p-2 rounded-lg border border-slate-800">
                      خوێندنەوە: {item.phonetic}
                    </p>
                  )}

                  {isAI && item.score !== undefined && (
                    <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-300">{item.kurdishFeedback}</span>
                      <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                        +{item.score}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isEvaluating && (
            <div className="flex items-center gap-2 text-xs text-amber-400 p-3 bg-slate-950 rounded-xl w-fit">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>کەسایەتییەکە گوێی لێگرتی و هەڵسەنگاندنت بۆ دەکات...</span>
            </div>
          )}
        </div>

        {/* Suggested Response Buttons */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">وەڵامی پێشنیارکراو:</span>
          {selectedScenario.suggestedResponses.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendTurn(sug)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 whitespace-nowrap font-arabic text-xs"
            >
              "{sug}"
            </button>
          ))}
        </div>

        {/* User Interaction Controls */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={handleVoiceToggle}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
            title="قسەکردن بە دەنگ"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={userSpeechInput}
            onChange={(e) => setUserSpeechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendTurn();
            }}
            placeholder="وەڵامەکەت بە عەرەبی بنووسە یان بە مایک قسە بکە..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 font-arabic"
          />

          <button
            onClick={() => handleSendTurn()}
            disabled={!userSpeechInput.trim() || isEvaluating}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
