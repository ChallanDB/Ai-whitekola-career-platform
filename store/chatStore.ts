import { create } from 'zustand';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  setIsLoading: (value: boolean) => void;
  sendMessageToAI: (message: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) => 
    set((state) => ({ 
      messages: [
        ...state.messages, 
        { 
          ...message, 
          id: Date.now().toString(), 
          timestamp: Date.now() 
        }
      ] 
    })),
  clearChat: () => set({ messages: [] }),
  setIsLoading: (value) => set({ isLoading: value }),
  sendMessageToAI: async (message) => {
    const { addMessage, setIsLoading } = get();
    
    // Add user message to chat
    addMessage({
      role: 'user',
      content: message,
    });
    
    setIsLoading(true);
    
    try {
      // Prepare messages for AI API
      const { messages } = get();
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add system message for context
      const systemMessage = {
        role: 'system' as 'system',
        content: 'You are a helpful career assistant specializing in the Cameroon job market. Provide advice on job searching, CV writing, interview preparation, and career development specifically for professionals in Cameroon. Include specific information about industries, companies, and job opportunities in Cameroon when relevant.'
      };
      
      // Call AI API
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [systemMessage, ...formattedMessages]
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      addMessage({
        role: 'assistant',
        content: data.completion,
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }
}));