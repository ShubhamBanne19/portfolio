export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

export interface ChatbotConfig {
  provider: 'openai' | 'openrouter' | 'gemini' | 'groq';
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  maxHistoryLength: number;
}

export interface ApiRequest {
  model: string;
  messages: {
    role: MessageRole;
    content: string;
  }[];
  max_tokens?: number;
  temperature?: number;
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}
