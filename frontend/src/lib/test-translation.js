import { TranslationService } from './translationAPI';

// Test the service
const testService = async () => {
  const service = TranslationService.getInstance();
  console.log('TranslationService:', service);
  
  try {
    const result = await service.translateText('Hello', 'es');
    console.log('Test translation:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testService();