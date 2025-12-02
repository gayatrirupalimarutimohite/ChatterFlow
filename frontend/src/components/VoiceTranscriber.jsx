import React, { useState, useEffect } from "react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { TranslationService } from "../../services/text-translation"; // Fixed import path
import { Mic, Square, RotateCcw, Languages, Download, AlertCircle } from "lucide-react";

const VoiceTranscriber = () => {
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [targetLanguage, setTargetLanguage] = useState("es");
  const [translatedTranscript, setTranslatedTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const translationService = TranslationService.getInstance();
  const supportedLanguages = translationService.getSupportedLanguages();

  useEffect(() => {
    if (transcript && !isListening) {
      translateTranscript(transcript);
    }
  }, [transcript, isListening]);

  const translateTranscript = async (text) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      const translation = await translationService.translateText(text, targetLanguage, "auto");
      setTranslatedTranscript(translation);

      setConversationHistory((prev) => [
        ...prev,
        {
          original: text,
          translated: translation,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedTranscript("Translation service unavailable");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleStartListening = () => {
    resetTranscript();
    setTranslatedTranscript("");
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
  };

  const exportConversation = () => {
    const content = conversationHistory
      .map(
        (entry) =>
          `[${entry.timestamp.toLocaleTimeString()}] 
Original: ${entry.original}
Translated: ${entry.translated}
`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-transcript-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Mic className="w-6 h-6 mr-2" />
          Voice Transcription & Translation
        </h2>
        <div className="flex items-center space-x-4">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="flex items-center text-sm text-gray-500">
            <AlertCircle className="w-4 h-4 mr-1" />
            Free
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          className={`flex items-center px-6 py-3 rounded-md text-white font-semibold transition-colors ${
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isListening ? (
            <>
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </button>

        <button
          onClick={resetTranscript}
          className="flex items-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </button>

        {conversationHistory.length > 0 && (
          <button
            onClick={exportConversation}
            className="flex items-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        )}
      </div>

      {/* Current Transcription */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Mic className="w-4 h-4 mr-2" />
            Original Speech
            {isListening && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </h3>
          <div className="h-32 p-4 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto">
            {transcript || (isListening ? "Listening... Speak now..." : "Speech will appear here...")}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Languages className="w-4 h-4 mr-2" />
            Translated Text
            {isTranslating && (
              <span className="ml-2 text-sm text-blue-500">Translating...</span>
            )}
          </h3>
          <div className="h-32 p-4 border border-gray-300 rounded-md bg-blue-50 overflow-y-auto">
            {translatedTranscript || "Translation will appear here..."}
          </div>
        </div>
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Conversation History</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {conversationHistory.map((entry, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Original:</p>
                    <p className="text-gray-800">{entry.original}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Translated:</p>
                    <p className="text-blue-600">{entry.translated}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">How to use:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Click "Start Recording" and speak in any language</li>
          <li>• Your speech will be transcribed automatically</li>
          <li>• Select target language for translation</li>
          <li>• Export your conversation history</li>
          <li>• Works best in Chrome/Edge browsers</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceTranscriber;