import React, { useState, useRef, useEffect } from "react";
import { useAIChat } from "../../hooks/useAIChat";
import { Send, Bot, User, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const AIChatBot = ({ model = "microsoft/DialoGPT-medium", botName = "Language Tutor" }) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const { conversation, isLoading, error, sendMessage, clearConversation } = useAIChat(model);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    try {
      await sendMessage(inputMessage);
      setInputMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-2 p-1 hover:bg-blue-600 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Bot className="w-5 h-5 mr-2" />
          <div>
            <h3 className="font-semibold">{botName}</h3>
            <p className="text-blue-100 text-xs">AI Language Practice</p>
          </div>
        </div>
        <button
          onClick={clearConversation}
          className="p-1 hover:bg-blue-600 rounded transition-colors"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Start a conversation!</h3>
            <p className="text-sm">Practice your language skills with AI</p>
            <div className="mt-4 text-xs text-gray-400">
              <p>Try asking:</p>
              <p>"How do I say hello in Spanish?"</p>
              <p>"Can we practice French conversation?"</p>
            </div>
          </div>
        )}
        
        {conversation.map((chat, index) => (
          <div key={index} className="space-y-2">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs md:max-w-md">
                <div className="flex items-center mb-1">
                  <User className="w-3 h-3 mr-1" />
                  <span className="text-xs font-semibold">You</span>
                </div>
                {chat.user}
              </div>
            </div>

            {/* Bot Message */}
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-xs md:max-w-md">
                <div className="flex items-center mb-1">
                  <Bot className="w-3 h-3 mr-1" />
                  <span className="text-xs font-semibold">{botName}</span>
                </div>
                {chat.bot}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-1">Please check your Hugging Face API key</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Powered by Hugging Face AI • Free language practice
        </div>
      </form>
    </div>
  );
};

export default AIChatBot;