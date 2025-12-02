import axios from 'axios';

const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

export class HuggingFaceService {
  static instance = null;
  baseURL = 'https://api-inference.huggingface.co/models';

  constructor() {}

  static getInstance() {
    if (!HuggingFaceService.instance) {
      HuggingFaceService.instance = new HuggingFaceService();
    }
    return HuggingFaceService.instance;
  }

  async chatWithModel(model, message, conversationHistory = []) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${model}`,
        {
          inputs: {
            text: message,
            past_user_inputs: conversationHistory.map(chat => chat.user),
            generated_responses: conversationHistory.map(chat => chat.bot)
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.generated_text;
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw error;
    }
  }

  async translateText(text, targetLanguage) {
    const model = this.getTranslationModel(targetLanguage);
    
    try {
      const response = await axios.post(
        `${this.baseURL}/${model}`,
        { inputs: text },
        {
          headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data[0].translation_text;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  getTranslationModel(language) {
    const models = {
      spanish: 'Helsinki-NLP/opus-mt-en-es',
      french: 'Helsinki-NLP/opus-mt-en-fr',
      german: 'Helsinki-NLP/opus-mt-en-de',
      italian: 'Helsinki-NLP/opus-mt-en-it',
      portuguese: 'Helsinki-NLP/opus-mt-en-pt',
      russian: 'Helsinki-NLP/opus-mt-en-ru'
    };
    return models[language] || 'Helsinki-NLP/opus-mt-en-es';
  }
}