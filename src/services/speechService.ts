export class SpeechService {
  private static isSpeaking = false;
  private static audioCache: Map<string, string> = new Map();
  private static currentAudio: HTMLAudioElement | null = null;

  /**
   * High-fidelity Arabic pronunciation using Gemini TTS with browser synthesis fallback.
   */
  public static async speakArabic(
    text: string,
    dialect: 'iraqi' | 'fusha' = 'iraqi',
    onEnd?: () => void
  ): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // Stop any existing playback
    this.stopSpeaking();
    this.isSpeaking = true;

    // 1. Check local in-memory audio cache
    const cacheKey = `${dialect}_${cleanText}`;
    if (this.audioCache.has(cacheKey)) {
      const base64 = this.audioCache.get(cacheKey)!;
      this.playBase64Wav(base64, onEnd);
      return;
    }

    // 2. Fetch authentic Gemini 3.8 Flash TTS
    try {
      const res = await fetch('/api/tutor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, dialect }),
      });

      const data = await res.json();
      if (data.success && data.audioBase64) {
        this.audioCache.set(cacheKey, data.audioBase64);
        this.playBase64Wav(data.audioBase64, onEnd);
        return;
      }
    } catch (err) {
      console.warn('Gemini TTS fetch failed, falling back to Web Speech synthesis:', err);
    }

    // 3. Fallback: Browser Web Speech API
    this.fallbackBrowserSpeech(cleanText, onEnd);
  }

  private static playBase64Wav(base64Audio: string, onEnd?: () => void) {
    try {
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        this.isSpeaking = false;
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this.isSpeaking = false;
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.play().catch((err) => {
        console.warn('Audio play prevented:', err);
        this.isSpeaking = false;
        if (onEnd) onEnd();
      });
    } catch (err) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  private static fallbackBrowserSpeech(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-IQ';
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice =
      voices.find(v => v.lang.startsWith('ar-IQ')) ||
      voices.find(v => v.lang.startsWith('ar')) ||
      voices.find(v => v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('maged') || v.name.toLowerCase().includes('laila') || v.name.toLowerCase().includes('tarik'));

    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    this.isSpeaking = false;
  }

  public static createSpeechRecognizer(
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ar-IQ';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  }
}
