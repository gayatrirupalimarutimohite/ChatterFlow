import React, { useState } from "react";
import { languageResources, languageChatbots } from "../../data/languageResources";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { BookOpen, Bot, ExternalLink, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";

const ResourceLibrary = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("beginner");
  const navigate = useNavigate();

  const resources = languageResources[currentLanguage]?.[level] || [];
  const chatbots = languageChatbots[currentLanguage] || [];

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatbotClick = (bot) => {
    navigate('/ai-chat');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Language Resources</h2>
        <div className="flex items-center space-x-4">
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
          
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Chatbots Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          AI Chatbots for Practice
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chatbots.map((bot, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleChatbotClick(bot)}
            >
              <div className="flex items-center mb-2">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                <h4 className="font-semibold text-gray-800">{bot.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{bot.description}</p>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Start Chat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Learning Resources ({filteredResources.length} found)
        </h3>
        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No resources found for "{searchTerm}"</p>
            <p className="text-sm">Try changing your search or level</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{resource.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    resource.type === 'interactive' ? 'bg-blue-100 text-blue-800' :
                    resource.type === 'comprehensive' ? 'bg-green-100 text-green-800' :
                    resource.type === 'grammar' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {resource.type}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Visit Resource <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                  {resource.free && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Free
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceLibrary;