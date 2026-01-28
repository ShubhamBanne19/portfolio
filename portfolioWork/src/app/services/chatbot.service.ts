import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private backendUrl: string;
  private messageHistory: ChatMessage[] = [];
  private maxHistoryLength = 10;

  constructor(private http: HttpClient) {
    // Determine backend URL based on environment
    this.backendUrl = environment.backendUrl;

    console.log(`🔗 Backend URL: ${this.backendUrl}`);
  }

  /**
   * Send message to Mistral API via backend proxy
   */
  sendMessageToMistral(userMessage: string): Observable<ChatResponse> {
    // Add user message to history
    this.messageHistory.push({
      role: 'user',
      content: userMessage
    });

    // Limit history length
    const recentMessages = this.messageHistory.slice(-this.maxHistoryLength);

    const request: ChatRequest = {
      messages: recentMessages,
      model: 'mistral-small-latest',
      temperature: 0.2
    };

    return this.http.post<ChatResponse>(
      `${this.backendUrl}/api/mistral`,
      request
    ).pipe(
      timeout(35000), // 35 second timeout
      catchError(error => {
        console.error('Mistral API error:', error);
        return throwError(() => ({
          message: 'Failed to get response from Mistral',
          error
        }));
      })
    );
  }

  /**
   * Send message to OpenRouter API via backend proxy
   */
  sendMessageToOpenRouter(userMessage: string): Observable<ChatResponse> {
    // Add user message to history
    this.messageHistory.push({
      role: 'user',
      content: userMessage
    });

    // Limit history length
    const recentMessages = this.messageHistory.slice(-this.maxHistoryLength);

    const request: ChatRequest = {
      messages: recentMessages,
      model: 'openai/gpt-3.5-turbo',
      temperature: 0.7
    };

    return this.http.post<ChatResponse>(
      `${this.backendUrl}/api/openrouter`,
      request
    ).pipe(
      timeout(35000), // 35 second timeout
      catchError(error => {
        console.error('OpenRouter API error:', error);
        return throwError(() => ({
          message: 'Failed to get response from OpenRouter',
          error
        }));
      })
    );
  }

  /**
   * Add message to history
   */
  addMessageToHistory(role: 'user' | 'assistant' | 'system', content: string): void {
    this.messageHistory.push({ role, content });
    
    // Keep history within limit
    if (this.messageHistory.length > this.maxHistoryLength) {
      this.messageHistory = this.messageHistory.slice(-this.maxHistoryLength);
    }
  }

  /**
   * Get message history
   */
  getMessageHistory(): ChatMessage[] {
    return [...this.messageHistory];
  }

  /**
   * Clear message history
   */
  clearHistory(): void {
    this.messageHistory = [];
  }

  /**
   * Check if backend is healthy
   */
  checkBackendHealth(): Observable<any> {
    return this.http.get(`${this.backendUrl}/health`).pipe(
      timeout(5000),
      catchError(error => {
        console.error('Backend health check failed:', error);
        return throwError(() => ({
          message: 'Backend is not responding',
          error
        }));
      })
    );
  }

  /**
   * Get current backend URL (useful for debugging)
   */
  getBackendUrl(): string {
    return this.backendUrl;
  }
}
