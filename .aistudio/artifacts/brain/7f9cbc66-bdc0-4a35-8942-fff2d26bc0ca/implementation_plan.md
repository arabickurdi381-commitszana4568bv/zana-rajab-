# Kurdish Arabic Academy — ئەکادیمیای فێربوونی عەرەبی

An intelligent, full-stack Arabic learning platform tailored specifically for Kurdish speakers (Badini & Sorani), featuring 24/7 real-time voice and text AI tutoring, dual-track Modern Standard Arabic (الفصحى) and Iraqi dialect (اللهجة العراقية), automated Kurdish-phonetic mistake correction, interactive daily life simulation, personal vocabulary notebook with spaced repetition, and Google Chat daily study alerts.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core user decisions were confirmed in Phase 1 clarification:
> - **Dual-Track Curriculum**: Learners choose between **Iraqi Arabic (اللهجة العراقية)** (everyday conversational fluency in market, work, taxi, hospitality) and **Modern Standard Arabic (الفصحى)** (academic, formal, news, literature) during onboarding or toggle freely anytime.
> - **Google Chat Study Digests**: Integrated via Google Workspace Chat to deliver customizable daily study notifications, daily word/idiom cards with Kurdish translations, and progress summary digests.
> - **Real-Time Interactive AI Voice Tutor**: Combining microphone speech recognition with real-time Kurdish phonetics, Arabic speech synthesis, audio playback controls, and automated conversational feedback.

---

## 1. Overview & Core Concept

### What It Does
Kurdish Arabic Academy bridges the linguistic and cultural learning journey for Kurdish speakers mastering Arabic. It provides an immersive 14-section ecosystem:
- **Intelligent Daily Learning System**: 10 new vocabulary words, 5 everyday expressions, 1 dialogue, 1 grammar spotlight, 1 listening drill, 1 speaking challenge, and 1 adaptive quiz refreshed daily.
- **AI Conversation Tutor ("دەستپێکردنی گفتوگۆ")**: A patient 24/7 Arabic teacher powered by `gemini-3.8-flash` that understands Kurdish questions, speaks natural Arabic, transcribes phonetics in Kurdish script (ڕێنووسی کوردی), and guides learners.
- **Smart Mistake Correction Center ("چاککردنەوەی هەڵەکانم")**: Pinpoints grammar, vocabulary, sentence structure, pronunciation, and dialect mismatch with detailed Kurdish root-cause analysis and retry drills.
- **Real-Life Situation Simulator**: 10+ interactive roleplay scenarios (Ordering Food, Taxi, Hospital & Pharmacy, Construction & Civil Engineering Sites, Airport & Hotel, Government Offices).
- **Personal Vocabulary Notebook & Spaced Repetition**: Flashcards, bookmarks, audio playback, example sentences, and automated Leitner review scheduling.
- **Comprehensive 26-Category Library**: Over 26 life, technical, medical, and professional domains (including civil engineering, site discussions, and Iraqi street phrases).
- **Gamified Progress & Weakness Analytics**: XP points, daily streaks, badges, radar skill charts, and weakness-focused adaptive lesson recommendations.
- **Multilingual Support**: Kurdish Badini (default primary), Kurdish Sorani, Arabic, and English with seamless RTL/LTR layout transitions.

---

## 2. User Experience & Visual Design

### Aesthetic Direction & Identity
- **Visual Tone**: Prestigious, elegant, and focused academic portal inspired by classic Middle Eastern design with modern minimalist ergonomics.
- **Color Palette (60-30-10 Rule)**:
  - **Dominant Neutral Canvas (60%)**: Deep Midnight Navy (`#0B1120`) in dark mode, crisp clean alabaster (`#F8FAFC` / `#FFFFFF`) in light mode.
  - **Structural Surfaces (30%)**: Refined charcoal slate (`#131D31` / `#1E293B`) with subtle hairline dividers (`border-slate-800` / `border-slate-200`).
  - **Accent Budget (10%)**: Majestic Kurdish-Arabic Gold (`#D4AF37` / `#F59E0B`) for primary action buttons, active navigation markers, streak flames, and mastery highlights; vibrant Emerald (`#10B981`) for correct answers and audio active states.
- **Typography & Font Pairing**:
  - Arabic and Kurdish: High-legibility `Noto Sans Arabic` and `Vazirmatn` for fluid Arabic script, diacritics (تَشْكِيل), and Kurdish vowels (ێ, ۆ, ڕ, ڵ, وو, ڤ).
  - Latin Display & UI: `Plus Jakarta Sans` for clean, professional typographic hierarchy; `IBM Plex Mono` / `tabular-nums` for timers, XP stats, and audio waveforms.
- **Zero-Pill Metadata & Clean Layout**:
  - Tags and categories are displayed as clean unboxed text with typographic separators (`·`, `/`).
  - Interactive tab filters and dialect toggles use segmented button containers.
  - Cards feature single-elevation depth with soft borders, generous inner padding, and zero nested border boxes.
- **Top Bar Contract**:
  - Zone 1: Clean Brand Wordmark (`ئەکادیمیای فێربوونی عەرەبی · Kurdish Arabic Academy`).
  - Zone 2: 4–5 core navigation links (`وانەکان / Lessons`, `مامۆستای ژیری / AI Tutor`, `سیمولەیتەر / Simulator`, `پەرتووکی وشەکان / Vocabulary`, `هەڵەکانم / Corrections`).
  - Zone 3: Single primary action (`ئەمڕۆ دەستپێبکە / Start Today` or dialect quick toggle) plus language selector (`بادینی / سۆرانی / عربي / EN`).

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Alternatives Considered |
|---|---|---|
| **Dialect Engine** | Dual-track architecture (Iraqi Arabic & Fusha) with toggleable Kurdish letter phonetics. | Iraqi Arabic is essential for daily work, trade, and Kurdistan-Baghdad interactions; Fusha is vital for formal media, law, and reading. Hardcoding one dialect would alienate learners. |
| **Kurdish Script Transcription** | Written Kurdish phonetic spelling alongside Arabic text (e.g., *شلونك* → *شلۆنک*, *صباح الخير* → *سەباحول خەیر*). | Enables Kurdish speakers without prior Arabic reading skills to pronounce authentic Arabic sounds immediately. |
| **Voice Tutor & Pronunciation** | Web Speech API for low-latency browser synthesis and recognition, backed by server-side Gemini audio analysis and Kurdish phonetic feedback. | Provides instant zero-lag conversational practice in the browser while maintaining high accuracy and natural speech. |
| **Full-Stack Persistence** | Local and server-backed storage engine with structured JSON profiles, tracking XP, completed lessons, mistake history, and saved notebooks. | Ensures zero barrier to entry, instant onboarding, offline capability, and persistence across sessions without complex setup locks. |
| **Search Grounding Integration** | Server-side Gemini 3.8 Flash with `googleSearch` grounding enabled for real-world Arabic idioms, regional dialect variants, and cultural context. | Fulfills the explicit search grounding requirement and ensures current, authentic language usage. |

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER (React 19)                       │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand · Clean Nav Links · Language & Dialect Switch)  │
├────────────────────────────────────────────────────────────────────────┤
│  [View Router / Multi-Page Academy Navigation]                         │
│  ├── 1. Landing Page & Hero Showcase                                  │
│  ├── 2. Student Dashboard (Streak, Goal, Radar Chart, Next Lesson)    │
│  ├── 3. Daily Learning System (10 Words, 5 Phrases, Dialogue, Quiz)   │
│  ├── 4. 26-Category Vocabulary & Phrase Library (Filters, Search)     │
│  ├── 5. AI Conversation Tutor (Audio Input, Kurdish Explanations)      │
│  ├── 6. Speaking Practice & Pronunciation Grader                       │
│  ├── 7. Grammar Academy (Step-by-step Kurdish lessons)                │
│  ├── 8. Listening Practice Arena (Audio playback + questions)         │
│  ├── 9. Real-Life Daily Life Simulator (10 roleplays)                 │
│  ├── 10. Mistake Correction Center ("چاککردنەوەی هەڵەکانم")           │
│  ├── 11. Personal Vocabulary Notebook (Spaced Repetition Flashcards)  │
│  ├── 12. Progress Analytics & Weakness Breakdown                       │
│  ├── 13. Gamification Hub (XP, Badges, Daily Missions)                │
│  └── 14. Google Chat Integration & Settings Panel                     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / Fetch API
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER (server.ts)                        │
├────────────────────────────────────────────────────────────────────────┤
│  /api/tutor/chat         → Gemini 3.8 Flash (Tutor Conversation)       │
│  /api/tutor/correct      → Gemini 3.8 Flash (Deep Mistake Analysis)    │
│  /api/tutor/simulate     → Gemini 3.8 Flash (Roleplay Evaluation)      │
│  /api/culture/search     → Gemini 3.8 Flash (Search Grounding Enabled) │
│  /api/chat/notify        → Google Workspace Chat Webhook / API Dispatch│
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models
- **Student Profile**: Level (A1–C2), active dialect (Iraqi / Fusha), preferred UI language (`badini`, `sorani`, `arabic`, `english`), XP, streak count, completed lesson IDs.
- **Daily Lesson**: Date, 10 vocabulary items, 5 expressions, dialogue transcript, grammar rule, listening exercise audio script, speaking challenge, 5-question interactive quiz.
- **Mistake Record**: Original student input, corrected Arabic sentence, Kurdish grammatical breakdown, Kurdish phonetics, mistake category (`grammar`, `vocabulary`, `pronunciation`, `dialect`), repetition count, mastered status.
- **Saved Word / Phrase**: Arabic script, Kurdish translation (Badini/Sorani), Kurdish phonetics, audio clip, context note, domain category, SRS review interval (Leitner boxes 1–5), last reviewed date.
- **Simulator Scenario**: Scenario ID, title (e.g. Taxi in Baghdad, Hospital in Erbil, Construction Site in Mosul), AI character role, learner objective, scoring rubric, turn history.

---

## 5. Execution Steps

1. **Server Setup**: Implement Express server endpoints (`server.ts`) connecting `@google/genai` with `gemini-3.8-flash` for conversation tutoring, mistake analysis, search-grounded phrase queries, and Google Chat alerts.
2. **Comprehensive Curriculum & Domain Data**: Build the rich 26-category database of Kurdish-Arabic vocabulary, realistic dialogues, Iraqi dialect expressions, civil engineering terminology, and grammar rules.
3. **Audio & Voice Service**: Implement Web Speech synthesis and recognition with Kurdish phonetic guidance and audio playback controls.
4. **Interactive Views Implementation**: Build the 14 core views with RTL/LTR dynamic styling, gold/navy design tokens, zero-pill metadata, and reactive handlers.
5. **Google Chat Integration**: Add the daily alert dispatcher for Google Workspace Chat study updates, daily word cards, and progress notifications.
6. **Verification & Testing**: Verify complete end-to-end functionality, responsive design, audio pronunciation, and build compilation.
