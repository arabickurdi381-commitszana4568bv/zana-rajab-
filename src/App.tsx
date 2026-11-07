import React, { useState, useEffect } from 'react';
import { InterfaceLanguage, ArabicDialect, StudentProfile } from './types/academy';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { DailyLessonView } from './components/DailyLessonView';
import { AITutorView } from './components/AITutorView';
import { MistakeCorrectionView } from './components/MistakeCorrectionView';
import { RealLifeSimulatorView } from './components/RealLifeSimulatorView';
import { VocabularyLibraryView } from './components/VocabularyLibraryView';
import { SavedWordsView } from './components/SavedWordsView';
import { GoogleChatSettingsView } from './components/GoogleChatSettingsView';
import { GoogleDriveSyncView } from './components/GoogleDriveSyncView';
import { INITIAL_DAILY_LESSON } from './data/curriculumData';
import { StorageService } from './services/storageService';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { User } from 'firebase/auth';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [profile, setProfile] = useState<StudentProfile>(() => StorageService.getProfile());
  const [user, setUser] = useState<User | null>(null);

  // Sync profile settings with state
  const interfaceLanguage = profile.interfaceLanguage || 'badini';
  const activeDialect = profile.selectedDialect || 'iraqi';

  useEffect(() => {
    // Dynamic RTL/LTR adjustment
    const dir = interfaceLanguage === 'english' ? 'ltr' : 'rtl';
    document.documentElement.dir = dir;
    document.documentElement.lang = interfaceLanguage === 'english' ? 'en' : interfaceLanguage === 'arabic' ? 'ar' : 'ku';
  }, [interfaceLanguage]);

  useEffect(() => {
    // Initialize Firebase Auth listener
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLanguageChange = (lang: InterfaceLanguage) => {
    const updated = { ...profile, interfaceLanguage: lang };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleDialectChange = (dialect: 'iraqi' | 'fusha') => {
    const updated = { ...profile, selectedDialect: dialect };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleLessonComplete = (xpEarned: number) => {
    const updated = StorageService.addXP(xpEarned);
    if (!updated.completedLessonIds.includes(INITIAL_DAILY_LESSON.id)) {
      updated.completedLessonIds.push(INITIAL_DAILY_LESSON.id);
      StorageService.saveProfile(updated);
    }
    setProfile({ ...updated });
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        interfaceLanguage={interfaceLanguage}
        onLanguageChange={handleLanguageChange}
        activeDialect={activeDialect}
        onDialectChange={handleDialectChange}
        profile={profile}
        user={user}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            interfaceLanguage={interfaceLanguage}
            activeDialect={activeDialect}
            onSelectDialect={handleDialectChange}
            onStartLearning={() => setCurrentView('dashboard')}
            onOpenTutor={() => setCurrentView('tutor')}
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            profile={profile}
            interfaceLanguage={interfaceLanguage}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'daily_lesson' && (
          <DailyLessonView
            lesson={INITIAL_DAILY_LESSON}
            interfaceLanguage={interfaceLanguage}
            onLessonComplete={handleLessonComplete}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'tutor' && (
          <AITutorView
            interfaceLanguage={interfaceLanguage}
            activeDialect={activeDialect}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'mistakes' && (
          <MistakeCorrectionView
            interfaceLanguage={interfaceLanguage}
            activeDialect={activeDialect}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'simulator' && (
          <RealLifeSimulatorView
            interfaceLanguage={interfaceLanguage}
            activeDialect={activeDialect}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'vocabulary' && (
          <VocabularyLibraryView
            interfaceLanguage={interfaceLanguage}
            activeDialect={activeDialect}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'saved' && (
          <SavedWordsView
            interfaceLanguage={interfaceLanguage}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'google_chat' && (
          <GoogleChatSettingsView
            interfaceLanguage={interfaceLanguage}
            profile={profile}
            user={user}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'google_drive' && (
          <GoogleDriveSyncView
            interfaceLanguage={interfaceLanguage}
            profile={profile}
            user={user}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">ئەکادیمیای فێربوونی عەرەبی</span>
            <span>·</span>
            <span>Kurdish Arabic Academy</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>بادینی (Badini)</span>
            <span>·</span>
            <span>سۆرانی (Sorani)</span>
            <span>·</span>
            <span>عەرەبی عێراقی و فوسحا</span>
          </div>

          <p className="text-[11px] text-slate-600">
            © 2026 Kurdish Arabic AI Learning Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
