import { useState, useCallback } from 'react';
import { HuggingFaceService } from '../services/huggingFaceAPI';

export const useAIChat = (model) => {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    setIsLoading(true);
    setError(null);

    try {
      const huggingFaceService = HuggingFaceService.getInstance();
      const response = await huggingFaceService.chatWithModel(model, message, conversation);
      
      const newConversation = [
        ...conversation,
        { user: message, bot: response }
      ];
      
      setConversation(newConversation);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [model, conversation]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    setError(null);
  }, []);

  return {
    conversation,
    isLoading,
    error,
    sendMessage,
    clearConversation
  };
};