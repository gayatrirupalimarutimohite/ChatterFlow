import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

export class GoogleTranslateService {
  static instance = null;

  constructor() {}

  static getInstance() {
    if (!GoogleTranslateService.instance) {
      GoogleTranslateService.instance = new GoogleTranslateService();
    }
    return GoogleTranslateService.instance;
  }

  async translateText(text, targetLanguage, sourceLanguage) {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        }
      );

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Google Translate API error:', error);
      throw error;
    }
  }

  async detectLanguage(text) {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text
        }
      );

      return response.data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      throw error;
    }
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' }
    ];
  }
}