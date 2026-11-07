import { InterfaceLanguage } from '../types/academy';

export interface TranslationStrings {
  brandTitle: string;
  brandSubtitle: string;
  navLessons: string;
  navTutor: string;
  navSimulator: string;
  navVocabulary: string;
  navMistakes: string;
  navSaved: string;
  navGrammar: string;
  navSpeaking: string;
  navListening: string;
  navAnalytics: string;
  navGoogleChat: string;
  navGoogleDrive: string;
  startToday: string;
  heroHeadline: string;
  heroSubheadline: string;
  chooseDialect: string;
  iraqiDialect: string;
  fushaDialect: string;
  iraqiDesc: string;
  fushaDesc: string;
  dailyGoal: string;
  dailyStreak: string;
  totalWordsLearned: string;
  lessonsCompleted: string;
  speakingMinutes: string;
  weakestSkills: string;
  recommendedLesson: string;
  startLearningToday: string;
  startConversation: string;
  smartCorrectionTitle: string;
  originalSentence: string;
  correctSentence: string;
  kurdishExplanation: string;
  correctPronunciation: string;
  mistakeHistory: string;
  practiceAgain: string;
  saveWord: string;
  savedWordsTitle: string;
  flashcards: string;
  spacedRepetition: string;
  searchPlaceholder: string;
  filterAll: string;
  levelBeginner: string;
  levelIntermediate: string;
  levelAdvanced: string;
  listenAudio: string;
  speakNow: string;
  listening: string;
  analyzingWithAI: string;
  send: string;
  typeYourMessage: string;
  categoriesTitle: string;
  realLifeSimulators: string;
  xpPoints: string;
  congratulations: string;
  nextExercise: string;
  checkAnswer: string;
  correct: string;
  tryAgain: string;
  signInWithGoogle: string;
  signOut: string;
  connectedToGoogleChat: string;
  sendDailyAlert: string;
}

export const translations: Record<InterfaceLanguage, TranslationStrings> = {
  badini: {
    brandTitle: 'ئەکادیمییا عەرەبی',
    brandSubtitle: 'فێربوونا زیرەک یا زمانی عەرەبی ب کوردییا بادینی',
    navLessons: 'وانە',
    navTutor: 'مامۆستایێ ژیر',
    navSimulator: 'سیمولەیتەر',
    navVocabulary: 'فەرهەنگ',
    navMistakes: 'چاککرنا شاشیێن من',
    navSaved: 'پەیڤێن پاشکەوتکری',
    navGrammar: 'رێزمان',
    navSpeaking: 'ئاخفتن',
    navListening: 'گوهداریکرن',
    navAnalytics: 'پێشکەفتن',
    navGoogleChat: 'گووگڵ چات',
    navGoogleDrive: 'گووگڵ درایڤ',
    startToday: 'ئەڤرۆ دەستپێبکە',
    heroHeadline: 'عەرەبی ب ئاسانی و ڕەوانی فێرببە',
    heroSubheadline: 'پلاتفۆڕمەکێ زیرەک ب زمانی کوردیێ بادینی، دگەل مامۆستایێ دەنگی یێ ٢٤ دەمژمێری و شێوەزارێ عێراقی و فوسحا.',
    chooseDialect: 'شێوەزارێ خۆ هەلبژێرە',
    iraqiDialect: 'عەرەبییا عێراقی (جلفي)',
    fushaDialect: 'عەرەبییا فوسحا (ستاندارد)',
    iraqiDesc: 'بۆ ژیانا روژانە، بازاڕ، کار و هەڤپەیڤینێن عێراقێ',
    fushaDesc: 'بۆ خاندن، نڤیسین، زانکۆ، تەلەفزیۆن و میدیا',
    dailyGoal: 'ئارمانجا روژانە',
    dailyStreak: 'بەردەوامییا روژانە',
    totalWordsLearned: 'پەیڤێن فێربووی',
    lessonsCompleted: 'وانەیێن بدووماهیک هاتی',
    speakingMinutes: 'خولەکێن ئاخفتنێ',
    weakestSkills: 'خالێن لاواز',
    recommendedLesson: 'وانەیا پێشنیارکری یا بهێت',
    startLearningToday: 'ئەڤرۆ فێربوونێ دەستپێبکە',
    startConversation: 'دەستپێکرنا دانوستاندنێ',
    smartCorrectionTitle: 'چاککرنا شاشیێن من',
    originalSentence: 'ڕستەیا تە یا دەستپێکێ:',
    correctSentence: 'ڕستەیا دروست یا عەرەبی:',
    kurdishExplanation: 'شروڤەکرن ب کوردی:',
    correctPronunciation: 'بێژتنا دروست ب پیتێن کوردی:',
    mistakeHistory: 'مێژوویا شاشیان',
    practiceAgain: 'پراکتیک بکە ڤە',
    saveWord: 'پەیڤێ پاشکەوت بکە',
    savedWordsTitle: 'پەرتووکا پەیڤێن من',
    flashcards: 'کارتیێن بیراهاتنێ',
    spacedRepetition: 'دووبارەکرنا دوورخستی (SRS)',
    searchPlaceholder: 'ل پەیڤ یان رستەکی بگەڕە...',
    filterAll: 'هەمی',
    levelBeginner: 'دەستپێکەر (A1-A2)',
    levelIntermediate: 'ناڤین (B1-B2)',
    levelAdvanced: 'پێشکەفتی (C1)',
    listenAudio: 'گوهداریا دەنگی بکە',
    speakNow: 'نوکە باخڤە',
    listening: 'ل هیڤیا دەنگێ تەمە...',
    analyzingWithAI: 'مامۆستا شیكاریێ دکەت...',
    send: 'هنارتن',
    typeYourMessage: 'بەرسڤ یان پرسیارا خۆ ب عەرەبی یان کوردی بنڤیسە...',
    categoriesTitle: 'پەرتووکخانەیا بابەتا',
    realLifeSimulators: 'سیمولەیتەرێ ژیانا راستەقینە',
    xpPoints: 'خالێن XP',
    congratulations: 'پیرۆزە! تە ئارمانج ب دەستڤە ئینا',
    nextExercise: 'راهێنانا دی',
    checkAnswer: 'پشکنینا بەرسڤێ',
    correct: 'دروستە!',
    tryAgain: 'جارەکا دی تاقی بکە',
    signInWithGoogle: 'چوونەژوور ب ڕێکا Google',
    signOut: 'دەرکەفتن',
    connectedToGoogleChat: 'پەیوەندی ب Google Chat هاتییە کرن',
    sendDailyAlert: 'هنارتنا نامەیا ئاگەهداریێ بۆ Google Chat',
  },
  sorani: {
    brandTitle: 'ئەکادیمیای عەرەبی',
    brandSubtitle: 'فێربوونی زیرەکی زمانی عەرەبی بە کوردیی سۆرانی',
    navLessons: 'وانەکان',
    navTutor: 'مامۆستای ژیر',
    navSimulator: 'سیمولەیتەر',
    navVocabulary: 'فەرهەنگ',
    navMistakes: 'چاککردنەوەی هەڵەکانم',
    navSaved: 'وشە پاشەکەوتکراوەکان',
    navGrammar: 'ڕێزمان',
    navSpeaking: 'قسەکردن',
    navListening: 'گوێگرتن',
    navAnalytics: 'پێشکەوتن',
    navGoogleChat: 'گووگڵ چات',
    navGoogleDrive: 'گووگڵ درایڤ',
    startToday: 'ئەمڕۆ دەستپێبکە',
    heroHeadline: 'عەرەبی بە ئاسانی و ڕەوانی فێرببە',
    heroSubheadline: 'پلاتفۆرمێکی پێشکەوتوو بە زمانی کوردیی سۆرانی، لەگەڵ مامۆستای دەنگی ٢٤ کاتژمێری بۆ شێوەزاری عێراقی و فوسحا.',
    chooseDialect: 'شێوەزاری خۆت هەڵبژێرە',
    iraqiDialect: 'عەرەبیی عێراقی (جلفي)',
    fushaDialect: 'عەرەبیی فوسحا (ستاندارد)',
    iraqiDesc: 'بۆ ژیانی ڕۆژانە، بازاڕ، کار و مامەڵەی عێراق',
    fushaDesc: 'بۆ خوێندن، نووسین، زانکۆ و ڕاگەیاندنی فەرمی',
    dailyGoal: 'ئامانجی ڕۆژانە',
    dailyStreak: 'بەردەوامیی ڕۆژانە',
    totalWordsLearned: 'وشەی فێربووم',
    lessonsCompleted: 'وانەی تەواوکراو',
    speakingMinutes: 'خولەکی قسەکردن',
    weakestSkills: 'خاڵە لاوازەکان',
    recommendedLesson: 'وانەی پێشنیارکراوی داهاتوو',
    startLearningToday: 'ئەمڕۆ فێربوون دەستپێبکە',
    startConversation: 'دەستپێکردنی گفتوگۆ',
    smartCorrectionTitle: 'چاککردنەوەی هەڵەکانم',
    originalSentence: 'ڕستەی سەرەتاییت:',
    correctSentence: 'ڕستەی دروستی عەرەبی:',
    kurdishExplanation: 'ڕوونکردنەوە بە کوردی:',
    correctPronunciation: 'بێژەکردنی دروست بە پیتی کوردی:',
    mistakeHistory: 'مێژووی هەڵەکانم',
    practiceAgain: 'دووبارە ڕاهێنان بکە',
    saveWord: 'وشەکە پاشەکەوت بکە',
    savedWordsTitle: 'دەفتەری وشەکانم',
    flashcards: 'فلاش کارت',
    spacedRepetition: 'دووبارەکردنەوەی مەودادار (SRS)',
    searchPlaceholder: 'بۆ وشە یان ڕستەیەک بگەڕێ...',
    filterAll: 'هەموو',
    levelBeginner: 'سەرەتایی (A1-A2)',
    levelIntermediate: 'ناوەند (B1-B2)',
    levelAdvanced: 'پێشکەوتوو (C1)',
    listenAudio: 'گوێ لە دەنگەکە بگرە',
    speakNow: 'ئێستا قسە بکە',
    listening: 'گوێ دەگرم...',
    analyzingWithAI: 'مامۆستای ژیر شی دەکاتەوە...',
    send: 'ناردن',
    typeYourMessage: 'وەڵام یان پرسیارەکەت بە عەرەبی یان کوردی بنووسە...',
    categoriesTitle: 'کتێبخانەی بابەتەکان',
    realLifeSimulators: 'سیمولەیتەری ژیانی ڕاستەقینە',
    xpPoints: 'خاڵەکانی XP',
    congratulations: 'پیرۆزە! ئامانجەکەت پێکاوە',
    nextExercise: 'ڕاهێنانی دواتر',
    checkAnswer: 'پشکنینی وەڵام',
    correct: 'ڕاستە!',
    tryAgain: 'دووبارە تاقی بکەرەوە',
    signInWithGoogle: 'چوونەژوورەوە لەگەڵ Google',
    signOut: 'دەرچوون',
    connectedToGoogleChat: 'پەیوەستکراوە بە Google Chat',
    sendDailyAlert: 'ناردنی ئاگاداری ڕۆژانە بۆ Google Chat',
  },
  arabic: {
    brandTitle: 'أكاديمية اللغة العربية للكرد',
    brandSubtitle: 'منصة ذكية لتعليم اللغة العربية للناطقين بالكردية',
    navLessons: 'الدروس',
    navTutor: 'المعلم الذكي',
    navSimulator: 'المحاكي',
    navVocabulary: 'المفردات',
    navMistakes: 'تصحيح أخطائي',
    navSaved: 'الكلمات المحفوظة',
    navGrammar: 'القواعد',
    navSpeaking: 'المحادثة',
    navListening: 'الاستماع',
    navAnalytics: 'التقدم',
    navGoogleChat: 'جوجل شات',
    navGoogleDrive: 'جوجل درايف',
    startToday: 'ابدأ اليوم',
    heroHeadline: 'تعلم العربية بطلاقة وسهولة',
    heroSubheadline: 'منصة تعليمية ذكية مخصصة للمتحدثين بالكردية مع معلم ذكاء اصطناعي صوتي متاح طوال اليوم، يدعم الفصحى واللهجة العراقية.',
    chooseDialect: 'اختر المسار اللغوي',
    iraqiDialect: 'اللهجة العراقية',
    fushaDialect: 'اللغة العربية الفصحى',
    iraqiDesc: 'للحياة اليومية، الأسواق، العمل والتعاملات الحية',
    fushaDesc: 'للدراسة والعمل الأكاديمي، الإعلام والكتابة',
    dailyGoal: 'الهدف اليومي',
    dailyStreak: 'سلسلة الأيام',
    totalWordsLearned: 'الكلمات المتقنة',
    lessonsCompleted: 'الدروس المنجزة',
    speakingMinutes: 'دقائق المحادثة',
    weakestSkills: 'نقاط الضعف',
    recommendedLesson: 'الدرس الموصى به',
    startLearningToday: 'ابدأ التعلم اليوم',
    startConversation: 'بدء المحادثة',
    smartCorrectionTitle: 'تصحيح أخطائي',
    originalSentence: 'جملتك الأصلية:',
    correctSentence: 'الجملة الصحيحة:',
    kurdishExplanation: 'الشرح بالكردية:',
    correctPronunciation: 'النطق بالأحرف الكردية:',
    mistakeHistory: 'سجل الأخطاء',
    practiceAgain: 'تدرب مرة أخرى',
    saveWord: 'حفظ الكلمة',
    savedWordsTitle: 'دفتر الكلمات',
    flashcards: 'البطاقات التعليمية',
    spacedRepetition: 'التكرار المتباعد (SRS)',
    searchPlaceholder: 'ابحث عن كلمة أو عبارة...',
    filterAll: 'الكل',
    levelBeginner: 'مبتدئ (A1-A2)',
    levelIntermediate: 'متوسط (B1-B2)',
    levelAdvanced: 'متقدم (C1)',
    listenAudio: 'استمع إلى النطق',
    speakNow: 'تحدث الآن',
    listening: 'جاري الاستماع...',
    analyzingWithAI: 'المعلم يحلل الإجابة...',
    send: 'إرسال',
    typeYourMessage: 'اكتب إجابتك أو سؤالك بالعربية أو الكردية...',
    categoriesTitle: 'مكتبة المواضيع الحياتية',
    realLifeSimulators: 'محاكي المواقف اليومية',
    xpPoints: 'نقاط الخبرة XP',
    congratulations: 'تهانينا! حققت الهدف اليومي',
    nextExercise: 'التمرين التالي',
    checkAnswer: 'تحقق من الإجابة',
    correct: 'صحيح!',
    tryAgain: 'حاول مجدداً',
    signInWithGoogle: 'تسجيل الدخول باستخدام Google',
    signOut: 'تسجيل الخروج',
    connectedToGoogleChat: 'متصل بـ Google Chat',
    sendDailyAlert: 'إرسال ملخص يومي إلى Google Chat',
  },
  english: {
    brandTitle: 'Kurdish Arabic Academy',
    brandSubtitle: 'AI Arabic Learning Academy for Kurdish Speakers',
    navLessons: 'Lessons',
    navTutor: 'AI Tutor',
    navSimulator: 'Simulator',
    navVocabulary: 'Vocabulary',
    navMistakes: 'My Mistakes',
    navSaved: 'Notebook',
    navGrammar: 'Grammar',
    navSpeaking: 'Speaking',
    navListening: 'Listening',
    navAnalytics: 'Analytics',
    navGoogleChat: 'Google Chat',
    navGoogleDrive: 'Google Drive',
    startToday: 'Start Today',
    heroHeadline: 'Master Arabic with Kurdish Instruction',
    heroSubheadline: 'The premier AI-powered Arabic learning academy for Kurdish speakers. 24/7 voice conversation tutor, Iraqi dialect & Fusha tracks, and Kurdish phonetics.',
    chooseDialect: 'Choose Your Dialect Track',
    iraqiDialect: 'Iraqi Arabic Dialect',
    fushaDialect: 'Modern Standard Arabic (Fusha)',
    iraqiDesc: 'Everyday conversations, markets, jobs, and Iraqi lifestyle',
    fushaDesc: 'Academic, literature, official media, and formal writing',
    dailyGoal: 'Daily Goal',
    dailyStreak: 'Daily Streak',
    totalWordsLearned: 'Words Learned',
    lessonsCompleted: 'Lessons Done',
    speakingMinutes: 'Speaking Mins',
    weakestSkills: 'Focus Areas',
    recommendedLesson: 'Recommended Next Lesson',
    startLearningToday: 'Start Learning Today',
    startConversation: 'Start Conversation',
    smartCorrectionTitle: 'Mistake Correction Center',
    originalSentence: 'Your Original Sentence:',
    correctSentence: 'Correct Arabic Sentence:',
    kurdishExplanation: 'Kurdish Explanation:',
    correctPronunciation: 'Kurdish Phonetic Script:',
    mistakeHistory: 'Mistake History',
    practiceAgain: 'Practice Again',
    saveWord: 'Save to Notebook',
    savedWordsTitle: 'Vocabulary Notebook',
    flashcards: 'Flashcards',
    spacedRepetition: 'Spaced Repetition (SRS)',
    searchPlaceholder: 'Search words, expressions or grammar...',
    filterAll: 'All',
    levelBeginner: 'Beginner (A1-A2)',
    levelIntermediate: 'Intermediate (B1-B2)',
    levelAdvanced: 'Advanced (C1)',
    listenAudio: 'Listen Pronunciation',
    speakNow: 'Speak Now',
    listening: 'Listening to your voice...',
    analyzingWithAI: 'AI Tutor is analyzing...',
    send: 'Send',
    typeYourMessage: 'Type your message in Arabic or Kurdish...',
    categoriesTitle: 'Real-Life Learning Categories',
    realLifeSimulators: 'Daily Life Simulators',
    xpPoints: 'XP Points',
    congratulations: 'Congratulations! Goal Reached',
    nextExercise: 'Next Exercise',
    checkAnswer: 'Check Answer',
    correct: 'Correct!',
    tryAgain: 'Try Again',
    signInWithGoogle: 'Sign in with Google',
    signOut: 'Sign Out',
    connectedToGoogleChat: 'Connected to Google Chat',
    sendDailyAlert: 'Send Daily Alert to Google Chat',
  },
};
