import React from 'react';
import { InterfaceLanguage, ArabicDialect, StudentProfile } from '../types/academy';
import { translations } from '../data/translations';
import { BookOpen, Bot, Sparkles, Bookmark, AlertTriangle, ShieldCheck, Flame, Compass, HardDrive } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  interfaceLanguage: InterfaceLanguage;
  onLanguageChange: (lang: InterfaceLanguage) => void;
  activeDialect: ArabicDialect;
  onDialectChange: (dialect: 'iraqi' | 'fusha') => void;
  profile: StudentProfile;
  user: User | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  interfaceLanguage,
  onLanguageChange,
  activeDialect,
  onDialectChange,
  profile,
  user,
  onGoogleSignIn,
  onSignOut,
}) => {
  const t = translations[interfaceLanguage];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
              ع
            </div>
            <div className="flex flex-col text-right">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-white whitespace-nowrap">
                {t.brandTitle}
              </span>
              <span className="text-[10px] text-amber-400 font-medium whitespace-nowrap hidden sm:inline">
                {activeDialect === 'iraqi' ? 'شێوەزاری عێراقی' : 'عەرەبی فوسحا'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 ${
              currentView === 'dashboard' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            {t.navLessons}
          </button>

          <button
            onClick={() => onNavigate('tutor')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'tutor' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>{t.navTutor}</span>
          </button>

          <button
            onClick={() => onNavigate('simulator')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'simulator' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{t.navSimulator}</span>
          </button>

          <button
            onClick={() => onNavigate('vocabulary')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'vocabulary' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>{t.navVocabulary}</span>
          </button>

          <button
            onClick={() => onNavigate('mistakes')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'mistakes' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{t.navMistakes}</span>
          </button>

          <button
            onClick={() => onNavigate('saved')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'saved' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>{t.navSaved}</span>
          </button>

          <button
            onClick={() => onNavigate('google_chat')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 ${
              currentView === 'google_chat' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            {t.navGoogleChat}
          </button>

          <button
            onClick={() => onNavigate('google_drive')}
            className={`transition-colors whitespace-nowrap hover:text-white pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'google_drive' ? 'border-amber-400 text-amber-300' : 'border-transparent'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>{t.navGoogleDrive}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster + Dialect & Language Selectors */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dialect Switcher Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => onDialectChange('iraqi')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                activeDialect === 'iraqi'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عێراقی
            </button>
            <button
              onClick={() => onDialectChange('fusha')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                activeDialect === 'fusha'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              فوسحى
            </button>
          </div>

          {/* Interface Language Dropdown */}
          <select
            value={interfaceLanguage}
            onChange={(e) => onLanguageChange(e.target.value as InterfaceLanguage)}
            className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
          >
            <option value="badini">بادینی (Badini)</option>
            <option value="sorani">سۆرانی (Sorani)</option>
            <option value="arabic">العربية (Arabic)</option>
            <option value="english">English</option>
          </select>

          {/* Streak Indicator */}
          <div className="hidden sm:flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded-lg text-xs font-bold tabular-nums">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{profile.streakDays}</span>
          </div>

          {/* User Sign In / Profile */}
          {user ? (
            <button
              onClick={onSignOut}
              title="دەرچوون / Sign Out"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
            >
              <div className="w-4 h-4 rounded-full bg-amber-500/80 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                {user.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
              <span className="hidden md:inline truncate max-w-[80px]">
                {user.displayName?.split(' ')[0] || 'User'}
              </span>
            </button>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Google</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('daily_lesson')}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/10 whitespace-nowrap"
          >
            {t.startToday}
          </button>
        </div>
      </div>
    </header>
  );
};
