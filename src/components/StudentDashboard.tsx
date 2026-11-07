import React from 'react';
import { StudentProfile, InterfaceLanguage } from '../types/academy';
import { translations } from '../data/translations';
import { Flame, Trophy, Clock, BookOpen, Mic, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Play, Sparkles, Compass, HardDrive } from 'lucide-react';

interface StudentDashboardProps {
  profile: StudentProfile;
  interfaceLanguage: InterfaceLanguage;
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  interfaceLanguage,
  onNavigate,
}) => {
  const t = translations[interfaceLanguage];
  const isRTL = interfaceLanguage !== 'english';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome & Master Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#131D31] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>پلاتفۆرمی پێشکەوتووی خوێندنی عەرەبی</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300 font-mono">ئاستی {profile.level}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              بەخێربێیت، {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              بەردەوامیی وانەکان کلیلی سەرکەوتنە لە فێربوونی شێوەزاری عێراقی و عەرەبی فوسحا.
            </p>
          </div>

          {/* Master Start Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('daily_lesson')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{t.startLearningToday}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onNavigate('tutor')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.startConversation}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{t.dailyStreak}</span>
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {profile.streakDays} ڕۆژ
            </span>
          </div>
        </div>

        {/* XP Points */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{t.xpPoints}</span>
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {profile.xp} XP
            </span>
          </div>
        </div>

        {/* Speaking Practice Minutes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{t.speakingMinutes}</span>
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {profile.speakingMinutes} خولەک
            </span>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{t.dailyGoal}</span>
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {profile.dailyGoalMinutes} خولەک
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Recommended Lesson & Skill Radar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Next Lesson Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {t.recommendedLesson}
              </span>
              <span className="text-xs text-slate-400 font-mono">ئاستی A1 · ١٥ خولەک</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              وانەی ئەمڕۆ: سڵاوکردنی بنەڕەتی و گفتوگۆی ڕۆژانەی عێراقی
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              پێکهاتووە لە ١٠ وشەی نوێ، ٥ دەستەواژەی عێراقی (شلونك، شكو ماكو، عاشت إيدك)، گفتوگۆی دەنگی، ڕێزمانی جێناوەکان و تاقیکردنەوەی خێرا.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-center">
            <div className="bg-slate-800/50 p-2.5 rounded-lg">
              <span className="block text-base font-black text-white tabular-nums">10</span>
              <span className="text-[10px] text-slate-400">وشەی نوێ</span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-lg">
              <span className="block text-base font-black text-amber-400 tabular-nums">5</span>
              <span className="text-[10px] text-slate-400">دەستەواژە</span>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-lg">
              <span className="block text-base font-black text-emerald-400 tabular-nums">1</span>
              <span className="text-[10px] text-slate-400">تاقیکردنەوە</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('daily_lesson')}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>دەستپێکردنی وانەکە</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Skill Analytics & Weakest Skills */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div>
            <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>ئاست و تواناکانی تۆ</span>
              <span className="text-xs text-amber-400 font-mono font-normal">پێشکەوتن</span>
            </h2>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">وشە و زاراوەکان (Vocabulary)</span>
                  <span className="font-mono text-amber-400 tabular-nums">{profile.skills.vocabulary}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${profile.skills.vocabulary}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">ڕێزمانی عەرەبی (Grammar)</span>
                  <span className="font-mono text-rose-400 tabular-nums">{profile.skills.grammar}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-1000"
                    style={{ width: `${profile.skills.grammar}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">قسەکردن و بێژەکردن (Speaking)</span>
                  <span className="font-mono text-emerald-400 tabular-nums">{profile.skills.speaking}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${profile.skills.speaking}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">گوێگرتن و تێگەیشتن (Listening)</span>
                  <span className="font-mono text-sky-400 tabular-nums">{profile.skills.listening}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-1000"
                    style={{ width: `${profile.skills.listening}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Weakness Analysis Alert */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-rose-300 block mb-0.5">{t.weakestSkills}: ڕێزمان (Grammar)</span>
              <span className="text-slate-300">
                پێشنیار دەکەین سەردانی بەشی "چاککردنەوەی هەڵەکانم" یان ڕێزمان بکەیت بۆ ڕاهێنانی جێناوەکان.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('tutor')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-right transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white group-hover:text-amber-300">
            مامۆستای ژیر (AI Tutor)
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">گفتوگۆی دەنگی و تێگەیشتن بە کوردی</p>
        </button>

        <button
          onClick={() => onNavigate('simulator')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-right transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white group-hover:text-emerald-300">
            سیمولەیتەری ڕۆژانە
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">بازاڕ، تەکسی، پڕۆژەی بیناسازی، کلینیک</p>
        </button>

        <button
          onClick={() => onNavigate('mistakes')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-right transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white group-hover:text-rose-300">
            چاککردنەوەی هەڵەکانم
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">شی کردنەوەی هەڵەی ڕێزمانی و بێژەکردن</p>
        </button>

        <button
          onClick={() => onNavigate('saved')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-right transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white group-hover:text-sky-300">
            دەفتەری وشەکانم (SRS)
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">فلاش کارت و دووبارەکردنەوەی مەودادار</p>
        </button>

        <button
          onClick={() => onNavigate('google_drive')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-right transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white group-hover:text-emerald-300">
            پاشەکەوت لە Google Drive
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">پاراستنی هەموو داتاکان لە ناو درایڤ</p>
        </button>
      </div>

    </div>
  );
};
