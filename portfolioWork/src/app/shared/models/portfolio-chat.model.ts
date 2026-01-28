export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
  isDomainBlocked?: boolean;
}

export interface RelevanceCheckResult {
  isRelevant: boolean;
  confidence: number;
  reason?: string;
}

export interface PortfolioContext {
  profile: any;
  skills: any;
  experience: any;
  projects: any;
  education: any;
  achievements: string[];
  certifications: any[];
  keywords: {
    portfolio_related: string[];
  };
}

export interface MistralInferenceRequest {
  model: string;
  prompt?: string;  // For completions endpoint
  messages?: Array<{ role: string; content: string }>;  // For chat/completions endpoint
  temperature: number;
  top_p: number;
  max_tokens: number;
  stream: boolean;
}

export interface MistralInferenceResponse {
  choices: Array<{
    text?: string;  // For completions endpoint
    message?: { content: string };  // For chat/completions endpoint
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
