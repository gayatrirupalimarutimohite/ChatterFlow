import axios from 'axios';

export class TranslationService {
  static instance = null;

  constructor() {}

  static getInstance() {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    try {
      // MyMemory Translation API (free)
      const response = await axios.get(
        `https://api.mymemory.translated.net/get`,
        {
          params: {
            q: text,
            langpair: `${sourceLanguage === 'auto' ? 'auto' : sourceLanguage}|${targetLanguage}`,
            de: 'streamify-app@example.com'
          }
        }
      );

      if (response.data.responseStatus === 200) {
        return response.data.responseData.translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation API error:', error);
      return this.getFallbackTranslation(text, targetLanguage);
    }
  }

  getFallbackTranslation(text, targetLanguage) {
    const fallbackTranslations = {
      'es': `[Traducción] ${text}`,
      'fr': `[Traduction] ${text}`,
      'de': `[Übersetzung] ${text}`,
      'it': `[Traduzione] ${text}`,
      'pt': `[Tradução] ${text}`,
      'ru': `[Перевод] ${text}`,
      'ja': `[翻訳] ${text}`,
      'ko': `[번역] ${text}`,
      'zh': `[翻译] ${text}`,
      'ar': `[ترجمة] ${text}`,
      'hi': `[अनुवाद] ${text}`
    };
    
    return fallbackTranslations[targetLanguage] || `[Translation] ${text}`;
  }

  async detectLanguage(text) {
    if (/[а-яА-Я]/.test(text)) return 'ru';
    if (/[一-龠]/.test(text)) return 'zh';
    if (/[あ-ん]/.test(text)) return 'ja';
    if (/[가-힣]/.test(text)) return 'ko';
    if (/[α-ωΑ-Ω]/.test(text)) return 'el';
    if (/[أ-ي]/.test(text)) return 'ar';
    return 'en';
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
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'tr', name: 'Turkish' },
      { code: 'nl', name: 'Dutch' },
      { code: 'pl', name: 'Polish' },
      { code: 'sv', name: 'Swedish' },
      { code: 'da', name: 'Danish' },
      { code: 'fi', name: 'Finnish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'el', name: 'Greek' }
    ];
  }

  getLanguageName(code) {
    const lang = this.getSupportedLanguages().find(l => l.code === code);
    return lang ? lang.name : code;
  }
}