import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { ChatMessage, ChatbotConfig, ApiRequest, OpenRouterResponse, OpenAIResponse } from '../models/chatbot.model';
import { environment } from '../../../environments/environment';
import { PROFILE, SKILLS, PROJECTS, EXPERIENCE } from '../../data';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private config: ChatbotConfig = environment.chatbot as ChatbotConfig;
  private messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private isLoading$ = new BehaviorSubject<boolean>(false);
  private lastRequestTime = 0;
  private readonly DEBOUNCE_TIME = 500; // Basic throttling

  private systemPrompt = this.generateSystemPrompt();

  constructor(private http: HttpClient) {
    this.initializeChat();
  }

  private generateSystemPrompt(): string {
    const skills = SKILLS.flatMap(group => 
      group.skills.map(s => `${s.name} (${s.level})`)
    ).join(', ');

    const projects = PROJECTS.map(p => `${p.title}: ${p.short}`).join('\n');

    const experience = EXPERIENCE.map(exp => 
      `${exp.role} at ${exp.company} (${exp.startDate}): ${exp.description}`
    ).join('\n');

    return `You are a professional AI assistant for Shubham Sanjay Banne's portfolio website. 

**Profile:**
- Name: ${PROFILE.name}
- Headline: ${PROFILE.headline}
- Email: ${PROFILE.email}
- Phone: ${PROFILE.phone}
- Location: ${PROFILE.location}
- Summary: ${PROFILE.summary}

**Skills:** ${skills}

**Experience:**
${experience}

**Notable Projects:**
${projects}

**Guidelines:**
1. Be professional, friendly, and concise
2. Answer questions about the portfolio, projects, skills, and experience
3. Direct technical questions to GitHub (${PROFILE.social.find(s => s.label === 'GitHub')?.url})
4. Provide contact information when asked how to reach out
5. If asked about hiring or opportunities, direct to email or LinkedIn
6. Keep responses under 150 words for chat
7. Be authentic and represent Shubham professionally
8. If you don't know something specific, admit it and suggest contacting directly`;
  }

  private initializeChat(): void {
    const greeting: ChatMessage = {
      id: this.generateId(),
      role: 'assistant',
      content: `Hi! 👋 I'm Shubham's AI assistant. I can help you learn about his skills, projects, and experience. What would you like to know?`,
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
    // Basic throttling
    const now = Date.now();
    if (now - this.lastRequestTime < this.DEBOUNCE_TIME) {
      return;
    }
    this.lastRequestTime = now;

    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: this.generateId(),
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    };

    const currentMessages = this.messages$.value;
    this.messages$.next([...currentMessages, userMsg]);

    // Add loading indicator
    const loadingMsg: ChatMessage = {
      id: this.generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };
    this.messages$.next([...currentMessages, userMsg, loadingMsg]);
    this.isLoading$.next(true);

    try {
      const response = await this.callAPI(trimmedMessage);
      
      // Remove loading message and add response
      const messagesWithoutLoading = this.messages$.value.filter(m => !m.isLoading);
      const assistantMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      this.messages$.next([...messagesWithoutLoading, assistantMsg]);
      this.trimHistory();
    } catch (error: any) {
      // Remove loading message and add error
      const messagesWithoutLoading = this.messages$.value.filter(m => !m.isLoading);
      const errorMsg: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Unable to process your request'}. Please try again.`,
        timestamp: new Date(),
        error: error.message
      };
      
      this.messages$.next([...messagesWithoutLoading, errorMsg]);
    } finally {
      this.isLoading$.next(false);
    }
  }

  private async callAPI(userMessage: string): Promise<string> {
    const messages = this.messages$.value
      .filter(m => !m.isLoading)
      .slice(-this.config.maxHistoryLength)
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    // Prepare API request
    const requestBody: ApiRequest = {
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: this.systemPrompt
        },
        ...messages
      ],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens
    };

    let url: string;
    let headers: HttpHeaders;

    switch (this.config.provider) {
      case 'openrouter':
        url = 'https://openrouter.ai/api/v1/chat/completions';
        headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Shubham Banne Portfolio'
        });
        break;

      case 'openai':
        url = 'https://api.openai.com/v1/chat/completions';
        headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        });
        break;

      case 'gemini':
        // Gemini requires different request format
        return await this.callGeminiAPI(userMessage);

      case 'groq':
        url = 'https://api.groq.com/openai/v1/chat/completions';
        headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        });
        break;

      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }

    return new Promise((resolve, reject) => {
      this.http.post<OpenRouterResponse | OpenAIResponse>(url, requestBody, { headers })
        .pipe(
          catchError(error => {
            const errorMessage = error.error?.error?.message || error.message || 'API request failed';
            reject(new Error(errorMessage));
            return throwError(() => new Error(errorMessage));
          })
        )
        .subscribe({
          next: (response) => {
            if (response.choices && response.choices[0]?.message?.content) {
              resolve(response.choices[0].message.content.trim());
            } else {
              reject(new Error('Invalid API response format'));
            }
          },
          error: (error) => reject(error)
        });
    });
  }

  private async callGeminiAPI(userMessage: string): Promise<string> {
    const apiKey = this.config.apiKey;
    const model = this.config.model || 'gemini-pro';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const messages = this.messages$.value
      .filter(m => !m.isLoading)
      .slice(-this.config.maxHistoryLength)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: this.systemPrompt }]
        },
        ...messages
      ],
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens
      }
    };

    return new Promise((resolve, reject) => {
      this.http.post<any>(url, requestBody)
        .pipe(
          catchError(error => {
            const errorMessage = error.error?.error?.message || 'Gemini API failed';
            reject(new Error(errorMessage));
            return throwError(() => new Error(errorMessage));
          })
        )
        .subscribe({
          next: (response) => {
            if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
              resolve(response.candidates[0].content.parts[0].text.trim());
            } else {
              reject(new Error('Invalid Gemini response'));
            }
          },
          error: (error) => reject(error)
        });
    });
  }

  private trimHistory(): void {
    const messages = this.messages$.value;
    if (messages.length > this.config.maxHistoryLength * 2) {
      // Keep system message context by preserving some history
      const trimmed = messages.slice(-this.config.maxHistoryLength * 2);
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
