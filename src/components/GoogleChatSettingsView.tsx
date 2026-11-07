import React, { useState, useEffect } from 'react';
import { InterfaceLanguage, StudentProfile } from '../types/academy';
import { translations } from '../data/translations';
import { getAccessToken, googleSignIn } from '../services/firebaseAuth';
import { StorageService } from '../services/storageService';
import {
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bell,
  ExternalLink
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleChatSettingsViewProps {
  interfaceLanguage: InterfaceLanguage;
  profile: StudentProfile;
  user: User | null;
  onNavigate: (view: string) => void;
}

export const GoogleChatSettingsView: React.FC<GoogleChatSettingsViewProps> = ({
  interfaceLanguage,
  profile,
  user,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const [spaces, setSpaces] = useState<any[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Confirmation modal state (Workspace skill requirement for sending messages)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingMessagePayload, setPendingMessagePayload] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadSpaces();
    }
  }, [user]);

  const loadSpaces = async () => {
    setIsLoadingSpaces(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setIsLoadingSpaces(false);
        return;
      }

      const res = await fetch('/api/chat/spaces', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data?.spaces) {
        setSpaces(data.data.spaces);
        if (data.data.spaces.length > 0) {
          setSelectedSpace(data.data.spaces[0].name);
        }
      }
    } catch (err) {
      console.warn('Could not list Google Chat spaces:', err);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const promptSendMessage = (type: 'word' | 'progress' | 'alert') => {
    let msg = '';
    if (type === 'word') {
      msg = `🌟 [ئەکادیمیای فێربوونی عەرەبی · وشەی ڕۆژ]\n\nالعربية: شلونك حبيبي شكو ماكو؟\nواتای کوردی: چۆنیت ئازیزم، چی هەیە چی نییە؟\nدەنگ (بێژەکردن): شلۆنەک حەبیبی، شکوو ماکوو؟\nشێوەزار: عەرەبی عێراقی (Iraqi Arabic)\n\nوانەی ئەمڕۆ تەواو بکە لە Kurdish Arabic Academy!`;
    } else if (type === 'progress') {
      msg = `📊 [ڕاپۆرتی پێشکەوتنی فێرخواز: ${profile.name}]\n\n🔥 زنجیرەی ڕۆژانە (Streak): ${profile.streakDays} ڕۆژ\n⭐ خاڵەکانی XP: ${profile.xp} خاڵ\n🗣️ قسەکردنی تۆمارکراو: ${profile.speakingMinutes} خولەک\n🎯 ئاستی عەرەبی: ${profile.level}\n\nپیرۆزە! بەردەوام بە لەسەر ئەم گڕوتینە.`;
    } else {
      msg = `⏰ [ئاگاداری ڕۆژانە - کاتی وانەی عەرەبی هاتووە!]\n\nسڵاو ${profile.name}! وانەی نوێی ئەمڕۆ لە ئەکادیمیا ئامادەیە (١٠ وشە، ٥ دەستەواژە و گفتوگۆی نوێ). بە تەنها ١٥ خولەک مەشق بکە.`;
    }

    setPendingMessagePayload(msg);
    setShowConfirmModal(true);
  };

  const confirmAndSendMessage = async () => {
    setShowConfirmModal(false);
    setIsSending(true);
    setStatusMessage(null);

    try {
      const token = await getAccessToken();
      const res = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          spaceName: selectedSpace,
          webhookUrl: webhookUrl.trim() || undefined,
          messageText: pendingMessagePayload,
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        setStatusMessage({
          type: 'success',
          text: 'پەیامەکە بە سەرکەوتوویی بۆ Google Chat نێردرا!',
        });
        StorageService.addXP(20);
      } else {
        // Handle enterprise requirement message if personal Gmail
        if (resData.error?.includes('404') || resData.error?.includes('not found') || resData.error?.includes('Workspace')) {
          setStatusMessage({
            type: 'error',
            text: 'تێبینی: ناردن لە ڕێگەی هەژماری Google پێویستی بە هەژماری فەرمیی Google Workspace یان لقی Webhook ی تایبەت بە ژوورەکە هەیە.',
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: `هەڵە ڕوویدا: ${resData.error || 'نەتوانرا پەیام بنێردرێت'}`,
          });
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `هەڵەی پەیوەندی: ${err.message}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>خزمەتگوزارییەکانی گووگڵ (Google Workspace)</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            بەستنەوە بە Google Chat
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            ناردنی کارتەکانی وشەی ڕۆژ، ئاگاداری وانەکان و کورتەی پێشکەوتن بۆ ژوور و گرووپەکانت لە Google Chat.
          </p>
        </div>

        {user ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>پەیوەستکراوە</span>
          </div>
        ) : (
          <button
            onClick={() => googleSignIn()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            {t.signInWithGoogle}
          </button>
        )}
      </div>

      {/* Status Feedback */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span>هەڵبژاردنی کەناڵ و بەستەر</span>
        </h2>

        {/* Space Selector or Webhook Input */}
        <div className="space-y-4">
          {spaces.length > 0 ? (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                ژووری Google Chat هەڵبژێرە:
              </label>
              <select
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {spaces.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.displayName || s.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                بەستەری Incoming Webhook ی ژووری Google Chat (یان بەکارهێنانی ئۆتۆماتیکی لە ڕێگەی هەژمارەکەت):
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://chat.googleapis.com/v1/spaces/.../messages?key=...&token=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                دەتوانیت لە ڕێکخستنی ژوورەکەت لە Google Chat بچیتە بەشی "Apps & Integrations" و "Webhook" زیاد بکەیت.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons to send test cards */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 block">
            تاقیکردنەوەی ناردنی پەیامی ڕاستەوخۆ بۆ Google Chat:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => promptSendMessage('word')}
              disabled={isSending}
              className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-right transition-colors"
            >
              <span className="text-xs font-bold text-amber-400 block mb-1">
                وشەی ڕۆژ (Word of the Day)
              </span>
              <p className="text-[11px] text-slate-400">
                هاوبەشکردنی کارتی وشەی عێراقی لەگەڵ مانا و بێژەکردنی دەنگ.
              </p>
            </button>

            <button
              onClick={() => promptSendMessage('progress')}
              disabled={isSending}
              className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-right transition-colors"
            >
              <span className="text-xs font-bold text-sky-400 block mb-1">
                کورتەی پێشکەوتن (Progress)
              </span>
              <p className="text-[11px] text-slate-400">
                ناردنی ڕاپۆرتی زنجیرە (Streak) و خاڵەکانی XP بۆ ژوورەکە.
              </p>
            </button>

            <button
              onClick={() => promptSendMessage('alert')}
              disabled={isSending}
              className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-right transition-colors"
            >
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                ئاگاداری وانەی ئەمڕۆ (Daily Alert)
              </span>
              <p className="text-[11px] text-slate-400">
                بیرخستنەوەی فێربوون و وانەی ڕۆژانەی پلاتفۆرمەکە.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Workspace Integration Skill requirement */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>پشتڕاستکردنەوەی ناردنی پەیام بۆ Google Chat</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              ئایا دڵنیایت دەتەوێت ئەم پەیامە لە ڕێگەی هەژمارەکەتەوە بۆ ژووری Google Chat بنێریت؟
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
              {pendingMessagePayload}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                پەشیمانبوونەوە
              </button>
              <button
                onClick={confirmAndSendMessage}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                ناردنی پەیام
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
