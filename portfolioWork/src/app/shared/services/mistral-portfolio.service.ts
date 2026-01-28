import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import {
  ChatMessage,
  MistralInferenceRequest,
  MistralInferenceResponse,
  PortfolioContext
} from '../models/portfolio-chat.model';
import { environment } from '../../../environments/environment';
import { PortfolioContextService } from './portfolio-context.service';
import { RelevanceCheckerService } from './relevance-checker.service';

@Injectable({
  providedIn: 'root'
})
export class MistralPortfolioService {
  private messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private isLoading$ = new BehaviorSubject<boolean>(false);
  private lastRequestTime = 0;
  private readonly DEBOUNCE_TIME = 800; // Increased throttle for API calls

  private readonly MODEL_CONFIG = {
    model: environment.mistral?.model || 'mistralai/Mistral-7B-Instruct',
    temperature: 0.2, // Low temperature for factual responses
    top_p: 0.9,
    max_tokens: 300
  };

  constructor(
    private http: HttpClient,
    private portfolioContext: PortfolioContextService,
    private relevanceChecker: RelevanceCheckerService
  ) {
    this.initializeChat();
  }

  private initializeChat(): void {
    const greeting: ChatMessage = {
      id: this.generateId(),
      role: 'assistant',
      content:
        "Hi! 👋 I'm Shubham's Portfolio AI Assistant. I can help you learn about his professional experience, skills, projects, and how to contact him. What would you like to know?",
      timestamp: new Date()
    };
    this.messages$.next([greeting]);
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messages$.asObservable();
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  async sendMessage(userMessage: string): Promise<void> {
    try {
      // Throttle requests to prevent rapid-fire API calls
      const now = Date.now();
      if (now - this.lastRequestTime < this.DEBOUNCE_TIME) {
        return;
      }
      this.lastRequestTime = now;

      const trimmedMessage = userMessage.trim();
      if (!trimmedMessage) return;

      // Add user message immediately
      const userMsg: ChatMessage = {
        id: this.generateId(),
        role: 'user',
        content: trimmedMessage,
        timestamp: new Date()
      };

      const currentMessages = this.messages$.value;
      this.messages$.next([...currentMessages, userMsg]);

      // Show loading indicator
      const loadingMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true
      };
      this.messages$.next([...currentMessages, userMsg, loadingMsg]);
      this.isLoading$.next(true);

      // Wait for portfolio context with increased timeout
      let portfolioContext = this.portfolioContext.getContextValue();
      if (!portfolioContext) {
        // Use longer timeout and show waiting message
        portfolioContext = await this.waitForPortfolioContext(10000); // 10 seconds
      }

      // Remove loading message
      let messagesWithoutLoading = this.messages$.value.filter((m) => !m.isLoading);

      // If still no context, show detailed error
      if (!portfolioContext) {
        const errorMsg: ChatMessage = {
          id: this.generateId(),
          role: 'assistant',
          content:
            '❌ Unable to load portfolio data. This may be a temporary issue. Please try:\n' +
            '1. Refresh the page (Ctrl+F5)\n' +
            '2. Check your browser console for errors\n' +
            '3. Ensure you have a stable internet connection',
          timestamp: new Date(),
          error: 'Portfolio context failed to load after timeout'
        };
        this.messages$.next([...messagesWithoutLoading, errorMsg]);
        this.isLoading$.next(false);
        return;
      }

      // Check domain relevance
      const relevanceResult = this.relevanceChecker.checkRelevance(
        trimmedMessage,
        portfolioContext
      );

      // If query is not relevant, reject it
      if (!relevanceResult.isRelevant) {
        messagesWithoutLoading = this.messages$.value.filter((m) => !m.isLoading);
        const blockedMsg: ChatMessage = {
          id: this.generateId(),
          role: 'assistant',
          content: this.relevanceChecker.getBlockedMessage(),
          timestamp: new Date(),
          isDomainBlocked: true
        };
        this.messages$.next([...messagesWithoutLoading, blockedMsg]);
        this.isLoading$.next(false);
        return;
      }

      // Get response from AI
      try {
        console.log('[Chatbot] Calling Mistral inference with message:', trimmedMessage);
        const response = await this.callMistralInference(
          trimmedMessage,
          currentMessages,
          portfolioContext
        );

        console.log('[Chatbot] Received Mistral response:', response);

        // Remove loading message and add response
        messagesWithoutLoading = this.messages$.value.filter(
          (m) => !m.isLoading
        );
        const assistantMsg: ChatMessage = {
          id: this.generateId(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };

        console.log('[Chatbot] Pushing assistant message to stream:', assistantMsg);
        this.messages$.next([...messagesWithoutLoading, assistantMsg]);
        console.log('[Chatbot] Current messages after update:', this.messages$.value.length);
        this.trimHistory();
      } catch (apiError: any) {
        // Handle API-specific errors
        console.error('[Chatbot] API Error:', apiError);
        messagesWithoutLoading = this.messages$.value.filter(
          (m) => !m.isLoading
        );

        let errorContent = 'Sorry, I encountered an error processing your request.';
        
        if (apiError.message?.includes('401')) {
          errorContent = '⚠️ API authentication failed. Please refresh the page.';
        } else if (apiError.message?.includes('429')) {
          errorContent = '⏱️ Too many requests. Please wait a moment and try again.';
        } else if (apiError.message?.includes('503')) {
          errorContent = '🔧 Service temporarily unavailable. Please try again in a few moments.';
        }

        const errorMsg: ChatMessage = {
          id: this.generateId(),
          role: 'assistant',
          content: errorContent,
          timestamp: new Date(),
          error: apiError.message
        };

        this.messages$.next([...messagesWithoutLoading, errorMsg]);
      }
    } catch (error: any) {
      // Catch any unexpected errors
      console.error('Critical error in sendMessage:', error);
      const errorMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: '❌ An unexpected error occurred. Please refresh the page and try again.',
        timestamp: new Date(),
        error: error.message
      };
      this.messages$.next([...this.messages$.value, errorMsg]);
    } finally {
      console.log('[Chatbot] Setting isLoading to false');
      this.isLoading$.next(false);
    }
  }

  private async callMistralInference(
    userMessage: string,
    previousMessages: ChatMessage[],
    portfolioContext: PortfolioContext
  ): Promise<string> {
    // Build conversation history (last 5 messages only)
    const recentMessages = previousMessages
      .filter((m) => !m.isLoading && !m.isDomainBlocked && !m.error)
      .slice(-5)
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    // Generate system prompt with portfolio context
    const systemPrompt = this.portfolioContext.generateSystemPrompt();

    // Build chat messages for Mistral API (chat/completions format)
    const messages = this.buildChatMessages(
      systemPrompt,
      recentMessages,
      userMessage
    );

    const request: MistralInferenceRequest = {
      model: this.MODEL_CONFIG.model,
      messages: messages,
      temperature: this.MODEL_CONFIG.temperature,
      top_p: this.MODEL_CONFIG.top_p,
      max_tokens: this.MODEL_CONFIG.max_tokens,
      stream: false
    };

    try {
      // Call the inference API
      const response = await this.callInferenceAPI(request);
      return this.extractResponse(response);
    } catch (error: any) {
      throw new Error(
        `Inference API error: ${error.message || 'Unknown error'}`
      );
    }
  }

  private buildPrompt(
    systemPrompt: string,
    previousMessages: any[],
    userMessage: string,
    portfolioContext: PortfolioContext
  ): string {
    let prompt = systemPrompt + '\n\n';

    // Add conversation history
    if (previousMessages.length > 0) {
      prompt += 'CONVERSATION HISTORY:\n';
      for (const msg of previousMessages) {
        prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
      }
      prompt += '\n';
    }

    // Add current user message
    prompt += `USER: ${userMessage}\n`;
    prompt += 'ASSISTANT:';

    return prompt;
  }

  private buildChatMessages(
    systemPrompt: string,
    previousMessages: any[],
    userMessage: string
  ): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = [];

    // Add system prompt
    messages.push({
      role: 'system',
      content: systemPrompt
    });

    // Add conversation history
    for (const msg of previousMessages) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  private callInferenceAPI(
    request: MistralInferenceRequest
  ): Promise<MistralInferenceResponse> {
    const mistralConfig = environment.mistral as any;
    const apiUrl = mistralConfig?.apiUrl || 'https://api.mistral.ai/v1/chat/completions';
    
    console.log('[API] Calling endpoint:', apiUrl);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mistralConfig?.apiKey || ''}`
    });

    // Build request body based on endpoint type
    const requestBody = mistralConfig?.apiType === 'mistral-official' 
      ? {
          model: request.model,
          messages: request.messages || [],
          temperature: request.temperature,
          top_p: request.top_p,
          max_tokens: request.max_tokens
        }
      : {
          model: request.model,
          prompt: request.prompt || '',
          temperature: request.temperature,
          top_p: request.top_p,
          max_tokens: request.max_tokens,
          stream: false
        };

    console.log('[API] Request body:', requestBody);

    return new Promise((resolve, reject) => {
      this.http.post<any>(apiUrl, requestBody, { headers }).subscribe({
        next: (response) => {
          console.log('[API] Response received:', response);
          // Handle both chat/completions and completions endpoints
          if (response.choices && response.choices[0]) {
            resolve(response as MistralInferenceResponse);
          } else {
            reject(new Error('Invalid inference response format'));
          }
        },
        error: (error) => {
          const errorMessage =
            error.error?.error?.message || 
            error.error?.message ||
            error.message || 
            'API request failed';
          reject(new Error(errorMessage));
        }
      });
    });
  }

  private extractResponse(response: MistralInferenceResponse): string {
    if (response.choices && response.choices[0]) {
      // Handle both formats:
      // 1. chat/completions: response.choices[0].message.content
      // 2. completions: response.choices[0].text
      const text = response.choices[0].message?.content || response.choices[0].text || '';
      return text.trim();
    }
    throw new Error('No valid response from model');
  }

  /**
   * Wait for portfolio context to load (with timeout)
   * Resolves when data is available or timeout is reached
   */
  private waitForPortfolioContext(timeoutMs: number): Promise<PortfolioContext | null> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = 100; // Check every 100ms

      const checkContext = () => {
        const context = this.portfolioContext.getContextValue();
        if (context) {
          resolve(context);
          return;
        }

        if (Date.now() - startTime >= timeoutMs) {
          resolve(null); // Timeout reached
          return;
        }

        // Check again after interval
        setTimeout(checkContext, checkInterval);
      };

      checkContext();
    });
  }

  private trimHistory(): void {
    const messages = this.messages$.value;
    if (messages.length > 20) {
      // Keep last 20 messages to avoid excessive context
      const trimmed = messages.slice(-20);
      this.messages$.next(trimmed);
    }
  }

  clearHistory(): void {
    this.initializeChat();
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
