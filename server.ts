import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Conversation Tutor
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { message, history = [], dialect = 'iraqi', interfaceLanguage = 'badini' } = req.body;

    const kurdishVariant = interfaceLanguage === 'badini' ? 'Kurdish Badini (بادینی)' : 'Kurdish Sorani (سۆرانی)';
    const dialectName = dialect === 'iraqi' ? 'Iraqi Arabic dialect (اللهجة العراقية المحكية)' : 'Modern Standard Arabic (الفصحى)';

    const systemInstruction = `You are a world-class, friendly, patient, and highly encouraging Arabic tutor for Kurdish speakers at "Kurdish Arabic Academy — ئەکادیمیای فێربوونی عەرەبی".
Target Arabic track: ${dialectName}.
Learner explanation language: ${kurdishVariant}.

Your mission:
1. Speak natural Arabic tailored to the chosen dialect.
2. If the user asks in Kurdish or Arabic, always understand both and respond in friendly Arabic.
3. Transcribe your Arabic speech into Kurdish script phonetics (ڕێنووسی کوردی بۆ دەنگەکان، بۆ نموونە: شلونك -> شلۆنەک، كيف حالك -> کەیفە حالوک).
4. If the user made ANY grammatical, lexical, structural, or dialect mistake in their Arabic input, gently catch it without making them embarrassed. Provide the exact corrected sentence and a clear explanation in ${kurdishVariant}.
5. Give a brief explanation of what you said in ${kurdishVariant}.
6. Provide 1-2 new vocabulary items related to the topic.
7. Ask an engaging follow-up question in Arabic to encourage them to speak more.

Always respond in strictly valid JSON conforming to the requested schema.`;

    const chatContext = history.slice(-6).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Student' : 'Tutor'}: ${h.text}`).join('\n');
    const prompt = `Conversation history:\n${chatContext}\n\nCurrent Student input: "${message}"\n\nGenerate the tutor response.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabicResponse: {
              type: Type.STRING,
              description: 'The Arabic reply spoken by the tutor with clear diacritics where helpful.',
            },
            kurdishPhonetic: {
              type: Type.STRING,
              description: 'Pronunciation written in Kurdish alphabet letters.',
            },
            kurdishExplanation: {
              type: Type.STRING,
              description: 'Clear translation and explanation in the learner Kurdish dialect.',
            },
            hasMistake: {
              type: Type.BOOLEAN,
              description: 'True if the student input contained any mistake.',
            },
            correction: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                corrected: { type: Type.STRING },
                kurdishExplanation: { type: Type.STRING },
                phonetic: { type: Type.STRING },
                mistakeType: { type: Type.STRING },
              },
            },
            newVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  arabic: { type: Type.STRING },
                  kurdish: { type: Type.STRING },
                  phonetic: { type: Type.STRING },
                },
              },
            },
            followUpQuestion: {
              type: Type.STRING,
              description: 'A follow-up question in Arabic for the student.',
            },
          },
          required: ['arabicResponse', 'kurdishPhonetic', 'kurdishExplanation', 'hasMistake'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/tutor/chat:', error);
    res.status(500).json({ success: false, error: error.message || 'AI tutor service error' });
  }
});

// Endpoint: Dedicated Smart Error Correction Center ("چاککردنەوەی هەڵەکانم")
app.post('/api/tutor/correct', async (req, res) => {
  try {
    const { sentence, dialect = 'iraqi', interfaceLanguage = 'badini' } = req.body;
    const kurdishVariant = interfaceLanguage === 'badini' ? 'Kurdish Badini (بادینی)' : 'Kurdish Sorani (سۆرانی)';

    const systemInstruction = `You are the lead Arabic linguistic error correction expert for Kurdish learners at Kurdish Arabic Academy.
Target Arabic Dialect: ${dialect === 'iraqi' ? 'Iraqi Arabic (اللهجة العراقية)' : 'Modern Standard Arabic (الفصحى)'}.
Language of explanation: ${kurdishVariant}.

Analyze the student sentence for:
- Grammatical errors (تذكير وتأنيث، تصريف الأفعال، إعراب، ضمائر)
- Vocabulary mistakes (استخدام كلمة غير دقيقة أو ترجمة حرفية من الكردية)
- Sentence structure & syntax (ترتيب الكلمات)
- Pronunciation / Orthography / Spelling (أخطاء الإملاء وحروف العلة)
- Dialect alignment

Return JSON with detailed Kurdish linguistic explanation, the corrected Arabic sentence, Kurdish phonetic pronunciation, mistake category, and an interactive practice drill.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analyze this sentence written by a Kurdish student: "${sentence}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            originalSentence: { type: Type.STRING },
            correctedSentence: { type: Type.STRING },
            kurdishExplanation: { type: Type.STRING, description: 'Deep, friendly explanation in Kurdish of the root cause and correct rule.' },
            kurdishPhonetic: { type: Type.STRING, description: 'Phonetic transcription of the corrected sentence using Kurdish letters.' },
            mistakeType: {
              type: Type.STRING,
              enum: ['grammar', 'vocabulary', 'structure', 'spelling', 'pronunciation', 'dialect'],
            },
            ruleTitle: { type: Type.STRING },
            practiceDrill: { type: Type.STRING, description: 'A practice sentence or fill-in-the-blank drill to test the learner.' },
          },
          required: ['isCorrect', 'originalSentence', 'correctedSentence', 'kurdishExplanation', 'kurdishPhonetic', 'mistakeType', 'practiceDrill'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/tutor/correct:', error);
    res.status(500).json({ success: false, error: error.message || 'Correction error' });
  }
});

// Endpoint: AI Daily Life Simulator
app.post('/api/tutor/simulate', async (req, res) => {
  try {
    const { scenarioId, scenarioTitle, aiPersona, userRole, userMessage, history = [], dialect = 'iraqi', interfaceLanguage = 'badini' } = req.body;
    const kurdishVariant = interfaceLanguage === 'badini' ? 'Kurdish Badini (بادینی)' : 'Kurdish Sorani (سۆرانی)';

    const systemInstruction = `You are roleplaying as "${aiPersona}" in a realistic Arabic simulation: "${scenarioTitle}".
The student is playing the role of: "${userRole}".
Dialect to use: ${dialect === 'iraqi' ? 'Iraqi Arabic (اللهجة العراقية المحكية)' : 'Modern Standard Arabic (الفصحى)'}.
Evaluation feedback language: ${kurdishVariant}.

Respond in character. Then evaluate how well the student handled the communication situation in Arabic:
- Score from 0 to 100 on their Arabic response appropriateness, naturalness, and vocabulary.
- Give constructive Kurdish feedback.
- Provide Kurdish phonetics for your Arabic line.`;

    const chatContext = history.map((h: any) => `${h.role}: ${h.text}`).join('\n');
    const prompt = `Context:\n${chatContext}\nUser roleplay action/speech: "${userMessage}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyArabic: { type: Type.STRING },
            kurdishPhonetic: { type: Type.STRING },
            kurdishMeaning: { type: Type.STRING },
            score: { type: Type.INTEGER, description: 'Turn score out of 100' },
            kurdishFeedback: { type: Type.STRING, description: 'Praise or advice in Kurdish' },
            suggestedNextResponses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['replyArabic', 'kurdishPhonetic', 'kurdishMeaning', 'score', 'kurdishFeedback'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/tutor/simulate:', error);
    res.status(500).json({ success: false, error: error.message || 'Simulator error' });
  }
});

// Endpoint: Search-Grounded Real-World Arabic Cultural & Idiomatic Knowledge
app.post('/api/culture/search', async (req, res) => {
  try {
    const { query, dialect = 'iraqi', interfaceLanguage = 'badini' } = req.body;
    const kurdishVariant = interfaceLanguage === 'badini' ? 'Kurdish Badini' : 'Kurdish Sorani';

    const prompt = `Search for authentic real-world modern usage, cultural significance, and Iraqi/Arabic idiomatic background for: "${query}".
Explain it clearly for Kurdish speakers in ${kurdishVariant}.
Include:
1. Exact authentic phrase and common variations
2. Where and when it is used in daily life (market, work, hospital, home)
3. Kurdish phonetics and Kurdish meaning
4. Cultural nuance or etiquette tips`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    res.json({
      success: true,
      data: {
        explanation: response.text,
        searchSources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      },
    });
  } catch (error: any) {
    console.error('Error in /api/culture/search:', error);
    res.status(500).json({ success: false, error: error.message || 'Search grounding error' });
  }
});

// Endpoint: Google Workspace Chat Integration
// Proxy route to list spaces or send message with client OAuth Bearer token or Webhook
app.get('/api/chat/spaces', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No authorization token provided' });
    }

    const response = await fetch('https://chat.googleapis.com/v1/spaces', {
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error listing Google Chat spaces:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/chat/send-message', async (req, res) => {
  try {
    const { spaceName, messageText, webhookUrl } = req.body;
    const authHeader = req.headers.authorization;

    if (webhookUrl) {
      // Send via Webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ text: messageText }),
      });
      const data = await response.json();
      return res.json({ success: true, via: 'webhook', data });
    }

    if (!authHeader || !spaceName) {
      return res.status(400).json({ success: false, error: 'Space name and Authorization header or webhookUrl required' });
    }

    // Google Chat REST API: POST https://chat.googleapis.com/v1/{space}/messages
    const targetUrl = `https://chat.googleapis.com/v1/${spaceName}/messages`;
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: messageText,
      }),
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error sending Google Chat message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: High-fidelity authentic Arabic speech generation (TTS)
app.post('/api/tutor/tts', async (req, res) => {
  try {
    const { text, dialect = 'iraqi' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text parameter required' });
    }

    const dialectStyle = dialect === 'iraqi'
      ? 'A native Iraqi Arabic speaker speaking clearly, naturally, and warmly with authentic Baghdadi pronunciation.'
      : 'A clear, elegant Modern Standard Arabic speaker pronouncing each word with proper diacritics and classical articulation.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 300),
              speechMetadata: {
                style: dialectStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ success: false, error: 'Failed to synthesize audio' });
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/tutor/tts:', error);
    res.status(500).json({ success: false, error: error.message || 'TTS generation error' });
  }
});

// Endpoint: AI New Word & Expression Generator on demand or in chat
app.post('/api/tutor/generate-words', async (req, res) => {
  try {
    const { topic = '', context = '', dialect = 'iraqi', interfaceLanguage = 'badini', count = 5 } = req.body;
    const kurdishVariant = interfaceLanguage === 'badini' ? 'Kurdish Badini (بادینی)' : 'Kurdish Sorani (سۆرانی)';
    const dialectName = dialect === 'iraqi' ? 'Iraqi Arabic (اللهجة العراقية المحكية)' : 'Modern Standard Arabic (الفصحى)';

    const systemInstruction = `You are the master vocabulary architect at Kurdish Arabic Academy.
Target Arabic Dialect: ${dialectName}.
Explanation language for Kurdish learners: ${kurdishVariant}.

Generate ${count} extremely useful, authentic Arabic words or everyday expressions tailored to the learner's topic or chat context: "${topic || context || 'Daily practical life'}".
For every item, supply:
- arabic: Arabic writing with proper tashkeel
- kurdishBadini: Badini Kurdish translation
- kurdishSorani: Sorani Kurdish translation
- kurdishPhonetic: Authentic pronunciation written in Kurdish alphabet (ڕێنووسی کوردی بۆ دەنگەکان)
- english: English translation
- exampleArabic: A realistic example sentence
- exampleKurdish: Kurdish translation of the example
- usageContext: When and where to use it
- dialect: '${dialect}'`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate ${count} new practical Arabic words/expressions for topic: "${topic || context}".`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              arabic: { type: Type.STRING },
              arabicTashkeel: { type: Type.STRING },
              kurdishBadini: { type: Type.STRING },
              kurdishSorani: { type: Type.STRING },
              kurdishPhonetic: { type: Type.STRING },
              english: { type: Type.STRING },
              exampleArabic: { type: Type.STRING },
              exampleKurdish: { type: Type.STRING },
              usageContext: { type: Type.STRING },
              dialect: { type: Type.STRING, enum: ['iraqi', 'fusha', 'both'] },
            },
            required: ['arabic', 'kurdishBadini', 'kurdishSorani', 'kurdishPhonetic', 'exampleArabic', 'exampleKurdish'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    const items = parsed.map((item: any, idx: number) => ({
      ...item,
      id: item.id || `gen_voc_${Date.now()}_${idx}`,
      category: 'generated',
      difficulty: 'A2',
    }));

    res.json({ success: true, data: items });
  } catch (error: any) {
    console.error('Error in /api/tutor/generate-words:', error);
    res.status(500).json({ success: false, error: error.message || 'Word generation error' });
  }
});

// Endpoint: Google Drive Sync & Backup
app.post('/api/drive/sync-backup', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No Google authorization token provided. Please sign in with Google.' });
    }

    const { dataPayload, folderName = 'Kurdish Arabic Academy Backups' } = req.body;
    if (!dataPayload) {
      return res.status(400).json({ success: false, error: 'No data payload to sync' });
    }

    // 1. Search if folder already exists in Drive
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(folderName)}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      { headers: { Authorization: authHeader } }
    );
    const searchData = await searchRes.json();
    let folderId = searchData.files?.[0]?.id;

    // If folder doesn't exist, create it
    if (!folderId) {
      const folderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        }),
      });
      const folderData = await folderRes.json();
      folderId = folderData.id;
    }

    // 2. Prepare JSON file content
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `Kurdish_Arabic_Academy_Backup_${timestamp}.json`;
    const jsonContent = JSON.stringify(dataPayload, null, 2);

    // Upload via multipart to Google Drive
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      parents: folderId ? [folderId] : [],
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      jsonContent +
      closeDelimiter;

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    const uploadData = await uploadRes.json();

    // 3. Also upload a formatted HTML Study Notebook
    const notebookName = `Kurdish_Arabic_Study_Notebook_${timestamp}.html`;
    const savedWordsList = (dataPayload.savedWords || []).map((w: any) => `
      <div style="border-bottom: 1px solid #e2e8f0; padding: 12px 0;">
        <h3 style="color: #0b1120; font-size: 20px; margin: 0;">${w.arabicTashkeel || w.arabic}</h3>
        <p style="color: #475569; margin: 4px 0;"><strong>خوێندنەوە (دەنگ):</strong> ${w.kurdishPhonetic}</p>
        <p style="color: #0f172a; margin: 4px 0;"><strong>واتا:</strong> ${w.kurdishBadini || w.kurdishSorani}</p>
        ${w.exampleArabic ? `<p style="color: #334155; font-style: italic;">${w.exampleArabic} - ${w.exampleKurdish || ''}</p>` : ''}
      </div>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="ku">
<head>
  <meta charset="utf-8">
  <title>دەفتەری پەیڤێن عەرەبی · Kurdish Arabic Academy</title>
  <style>body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1e293b; }</style>
</head>
<body>
  <h1 style="color: #d97706;">ئەکادیمیای فێربوونی عەرەبی · دەفتەری وشەکان</h1>
  <p>بەرواری پاشەکەوتکردن: ${new Date().toLocaleDateString()}</p>
  <p>کۆی وشە پاشەکەوتکراوەکان: ${dataPayload.savedWords?.length || 0}</p>
  <hr/>
  ${savedWordsList}
</body>
</html>`;

    const notebookMetadata = {
      name: notebookName,
      mimeType: 'text/html',
      parents: folderId ? [folderId] : [],
    };

    const notebookBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(notebookMetadata) +
      delimiter +
      'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
      htmlContent +
      closeDelimiter;

    const nbUploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: notebookBody,
      }
    );
    const nbUploadData = await nbUploadRes.json();

    res.json({
      success: true,
      folderId,
      backupFile: uploadData,
      notebookFile: nbUploadData,
      message: 'All academy data successfully synced to Google Drive!',
    });
  } catch (error: any) {
    console.error('Error syncing to Google Drive:', error);
    res.status(500).json({ success: false, error: error.message || 'Google Drive sync failed' });
  }
});

// Static / Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
