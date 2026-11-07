import React, { useState } from 'react';
import { InterfaceLanguage, StudentProfile } from '../types/academy';
import { translations } from '../data/translations';
import { StorageService } from '../services/storageService';
import { getAccessToken, googleSignIn } from '../services/firebaseAuth';
import {
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  FileText,
  Database,
  Lock
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleDriveSyncViewProps {
  interfaceLanguage: InterfaceLanguage;
  profile: StudentProfile;
  user: User | null;
  onNavigate: (view: string) => void;
}

export const GoogleDriveSyncView: React.FC<GoogleDriveSyncViewProps> = ({
  interfaceLanguage,
  profile,
  user,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const savedWords = StorageService.getSavedWords();
  const mistakes = StorageService.getMistakes();

  const handleStartSync = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSync = async () => {
    setShowConfirmModal(false);
    setIsSyncing(true);
    setErrorMessage(null);

    try {
      let token = await getAccessToken();
      if (!token) {
        // Prompt sign in if not signed in
        const res = await googleSignIn();
        token = res?.accessToken || null;
      }

      if (!token) {
        setErrorMessage('تکایە سەرەتا لە ڕێگەی هەژماری Google بچۆ ژوورەوە بۆ ئەوەی ڕێگە بە پاراستنی داتا لە Google Drive بدەیت.');
        setIsSyncing(false);
        return;
      }

      const fullDataPayload = {
        exportedAt: new Date().toISOString(),
        studentProfile: profile,
        savedWordsCount: savedWords.length,
        savedWords,
        mistakesCount: mistakes.length,
        mistakes,
        academyVersion: '2.0.0',
      };

      const res = await fetch('/api/drive/sync-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dataPayload: fullDataPayload,
          folderName: 'Kurdish Arabic Academy Backups (ئەکادیمیای فێربوونی عەرەبی)',
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        setLastSyncResult(resData);
        StorageService.addXP(30);
      } else {
        setErrorMessage(resData.error || 'نەتوانرا داتاکان لە Google Drive پاشەکەوت بکرێن.');
      }
    } catch (err: any) {
      setErrorMessage(`هەڵەی پەیوەندی بە Google Drive: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <HardDrive className="w-4 h-4" />
            <span>پاشەکەوتکردن لە Google Drive</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            هاوکاتکردنی هەموو داتاکان لەگەڵ Google Drive
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            دەفتەری وشەکان، دەنگەکان، مێژووی هەڵەکان و پێشکەوتنت ڕاستەوخۆ دەچنە ناو درایڤی کەسیی خۆت.
          </p>
        </div>

        {user ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>هەژمار بەستراوەتەوە</span>
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

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Details Box */}
      {lastSyncResult && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              هەموو داتاکانت بە سەرکەوتوویی لە Google Drive پاشەکەوت کران!
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          <p className="text-slate-300">
            فۆڵدەری <strong>"Kurdish Arabic Academy Backups"</strong> لە ناو Google Drive دروستکرا یان نوێکرایەوە و پەڕگەکانی تێدا دانرا:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {lastSyncResult.backupFile?.webViewLink && (
              <a
                href={lastSyncResult.backupFile.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400 text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs">{lastSyncResult.backupFile.name}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            {lastSyncResult.notebookFile?.webViewLink && (
              <a
                href={lastSyncResult.notebookFile.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400 text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span className="font-mono text-xs">{lastSyncResult.notebookFile.name}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Overview Cards of What Will Be Synced */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">وشە پاشەکەوتکراوەکان</span>
          <span className="text-xl font-black text-amber-400 font-mono tabular-nums">
            {savedWords.length} وشە و دەستەواژە
          </span>
          <p className="text-[11px] text-slate-500">لەگەڵ دەنگ، مانا و ڕێنووسی کوردی</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">مێژووی هەڵەکان</span>
          <span className="text-xl font-black text-rose-400 font-mono tabular-nums">
            {mistakes.length} هەڵەی تۆمارکراو
          </span>
          <p className="text-[11px] text-slate-500">بە شیکردنەوەی تەواوی کوردی</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block font-medium">زنجیرە و خاڵەکان</span>
          <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
            {profile.streakDays} ڕۆژ · {profile.xp} XP
          </span>
          <p className="text-[11px] text-slate-500">ئاستی ئێستا: {profile.level}</p>
        </div>
      </div>

      {/* Sync Trigger Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <HardDrive className="w-7 h-7" />
        </div>

        <div className="max-w-md mx-auto space-y-1">
          <h2 className="text-lg font-bold text-white">پاشەکەوتکردنی دەستبەجێ لە Google Drive</h2>
          <p className="text-xs text-slate-400">
            کلیک لێرە بکە تا تەواوی داتای فێربوونت بنێردرێتە ناو Google Drive و هەمیشە پارێزراو بێت.
          </p>
        </div>

        <button
          onClick={handleStartSync}
          disabled={isSyncing}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-500/20 hover:from-emerald-300 hover:to-emerald-500 transition-all disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <HardDrive className="w-4 h-4" />}
          <span>{isSyncing ? 'داتاکان دەچنە ناو Drive...' : 'ئێستا هەموو داتاکان بنێرە بۆ Google Drive'}</span>
        </button>
      </div>

      {/* Mandatory User Confirmation Modal for Workspace Google Drive */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>پشتڕاستکردنەوەی پاشەکەوتکردن لە Google Drive</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              ئایا دڵنیایت دەتەوێت داتای Kurdish Arabic Academy (کۆی {savedWords.length} وشەی پاشەکەوتکراو، {mistakes.length} هەڵە و ئاستی خوێندنت) لە فۆڵدەری Google Drive ی خۆتدا پاشەکەوت بکەیت؟
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>پارێزراو بەپێی ڕێساکانی مۆڵەتی Google Workspace</span>
              </div>
              <p>داتاکەت تەنها لەناو فۆڵدەری ئەکادیمیای خۆت لە Drive پاشەکەوت دەکرێت.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                پەشیمانبوونەوە
              </button>
              <button
                onClick={handleConfirmSync}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
              >
                پشتڕاستکردنەوە و ناردن بۆ Drive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
