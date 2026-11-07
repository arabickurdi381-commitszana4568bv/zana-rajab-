import React from 'react';
import { InterfaceLanguage, ArabicDialect } from '../types/academy';
import { translations } from '../data/translations';
import { CATEGORIES_LIST } from '../data/curriculumData';
import { Bot, Sparkles, CheckCircle2, MessageSquare, Volume2, Shield, ArrowLeft, ArrowRight, BrainCircuit, BookMarked } from 'lucide-react';

interface LandingPageProps {
  interfaceLanguage: InterfaceLanguage;
  activeDialect: ArabicDialect;
  onSelectDialect: (dialect: 'iraqi' | 'fusha') => void;
  onStartLearning: () => void;
  onOpenTutor: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  interfaceLanguage,
  activeDialect,
  onSelectDialect,
  onStartLearning,
  onOpenTutor,
}) => {
  const t = translations[interfaceLanguage];
  const isRTL = interfaceLanguage !== 'english';

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left/Right Text Content (respects RTL/LTR) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>فێربوونی عەرەبی بە کوردی بۆ هەموو ئاستەکان</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                {t.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {t.heroSubheadline}
              </p>

              {/* Dialect Selection Cards */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {t.chooseDialect}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    onClick={() => onSelectDialect('iraqi')}
                    className={`p-4 rounded-xl text-right border transition-all text-sm relative flex flex-col justify-between ${
                      activeDialect === 'iraqi'
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-extrabold text-base text-amber-400">{t.iraqiDialect}</span>
                      {activeDialect === 'iraqi' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{t.iraqiDesc}</p>
                    <span className="text-[10px] text-amber-300/80 mt-2 font-mono">شلونك · شكو ماکو · عاشت إيدك</span>
                  </button>

                  <button
                    onClick={() => onSelectDialect('fusha')}
                    className={`p-4 rounded-xl text-right border transition-all text-sm relative flex flex-col justify-between ${
                      activeDialect === 'fusha'
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-extrabold text-base text-amber-400">{t.fushaDialect}</span>
                      {activeDialect === 'fusha' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{t.fushaDesc}</p>
                    <span className="text-[10px] text-amber-300/80 mt-2 font-mono">كيف حالك · صباح الخير · أهلاً بك</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={onStartLearning}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center gap-2"
                >
                  <span>{t.startLearningToday}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={onOpenTutor}
                  className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>{t.startConversation}</span>
                </button>
              </div>

              {/* Fast Features List */}
              <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>بێژەکردن بە پیتی کوردی</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>مامۆستای دەنگی ٢٤ کاتژمێر</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>چاککردنەوەی هەڵەکان بە ژیری دەستکرد</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_academy_learning_1794061714788.jpg"
                  alt="Kurdish Arabic Academy Learning Library"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/30 to-transparent"></div>
                
                {/* Overlay live learning pill */}
                <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#0B1120]/90 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">نموونەی وانەی ئەمڕۆ</p>
                      <p className="text-sm font-bold text-white">شلونك عيني، شكو ماكو؟</p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-medium">شلۆنەک عەینی</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 26 Real-Life Arabic Categories Preview */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.categoriesTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            فێربوونی زیاتر لە ٢٦ بەشی بەسوودی ژیانی ڕۆژانە، بازاڕ، پیشە، ئەندازیاری، پزیشکی و گەشتکردن
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES_LIST.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 text-center transition-all cursor-pointer group"
              onClick={onStartLearning}
            >
              <div className="w-8 h-8 mx-auto rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BookMarked className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate">
                {cat.nameKurdish}
              </h3>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{cat.nameArabic}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-14 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">مامۆستای دەنگی ٢٤ کاتژمێری</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                بە دەنگ و دەق قسە لەگەڵ زیرەکی دەستکرد بکە، ڕاستەوخۆ دەنگت دەبیستێت، بە زمانی کوردی لێت تێدەگات و بە عەرەبی وەڵامت دەداتەوە.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">چاککردنەوەی زیرەکی هەڵەکان</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                هەموو هەڵەیەکی ڕێزمانی، وشە، ڕێنووس و بێژەکردن دەستنیشان دەکات و هۆکارەکەی بە ڕوونکردنەوەی کوردی ڕوون دەکاتەوە.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">سیمولەیتەری ڕۆژانە و گووگڵ چات</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تەکسی لە بەغدا، پڕۆژەی بیناسازی لە هەولێر، چێشتخانە و دەرمانخانە تاقی بکەرەوە و ئاگاداری ڕۆژانە لە Google Chat وەربگرە.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
