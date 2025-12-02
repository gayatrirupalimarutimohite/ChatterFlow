import React, { useState } from "react";
import { TranslationService } from "../../services/text-translation"; // Fixed import path
import { useLanguageStore } from "../../stores/useLanguageStore";
import { Languages, RefreshCw, Copy, Volume2, AlertCircle } from "lucide-react";

const TranslateText = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationInfo, setTranslationInfo] = useState("");
  
  const translationService = TranslationService.getInstance();
  const supportedLanguages = translationService.getSupportedLanguages();

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setTranslationInfo("");
    
    try {
      const translation = await translationService.translateText(text, targetLang, sourceLang);
      setTranslatedText(translation);
      setTranslationInfo("Powered by MyMemory Translation API");
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText("Translation service temporarily unavailable. Please try again later.");
      setTranslationInfo("Translation service error");
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang === "auto" ? "en" : sourceLang);
    setText(translatedText);
    setTranslatedText(text);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in your browser");
    }
  };

  const getLanguageCodeForSpeech = (langCode) => {
    const speechMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ar': 'ar-SA',
      'hi': 'hi-IN'
    };
    return speechMap[langCode] || 'en-US';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Languages className="w-6 h-6 mr-2" />
          Text Translator
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          Free Translation Service
        </div>
      </div>

      {/* Language Selection */}
      <div className="flex items-center justify-between mb-4 space-x-4">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto">Auto-detect</option>
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button
          onClick={swapLanguages}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Swap languages"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Text Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Source Text */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {text && (
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={() => speakText(text, getLanguageCodeForSpeech(sourceLang === "auto" ? "en" : sourceLang))}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(text)}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Translated Text */}
        <div className="relative">
          <textarea
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="w-full h-40 p-3 border border-gray-300 rounded-md bg-gray-50 resize-none"
          />
          {translatedText && (
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={() => speakText(translatedText, getLanguageCodeForSpeech(targetLang))}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(translatedText)}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Translate Button */}
      <div className="space-y-3">
        <button
          onClick={handleTranslate}
          disabled={!text.trim() || isTranslating}
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isTranslating ? "Translating..." : "Translate Text"}
        </button>
        
        {translationInfo && (
          <div className="text-center text-sm text-gray-500">
            {translationInfo}
          </div>
        )}
      </div>

      {/* Usage Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Translation Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Free service with rate limits (be patient between translations)</li>
          <li>• Supports 20+ languages including Spanish, French, German, etc.</li>
          <li>• For better accuracy, keep sentences short and clear</li>
          <li>• Text-to-speech available for most languages</li>
        </ul>
      </div>
    </div>
  );
};

export default TranslateText;