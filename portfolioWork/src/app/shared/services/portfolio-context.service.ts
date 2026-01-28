import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { PortfolioContext } from '../models/portfolio-chat.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioContextService {
  private portfolioContext$ = new BehaviorSubject<PortfolioContext | null>(null);
  private loading$ = new BehaviorSubject<boolean>(true);
  private loadError$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadPortfolioData();
  }

  /**
   * Load portfolio data with multiple fallback paths
   * Handles different environments: dev, prod, and GitHub Pages
   */
  private loadPortfolioData(): void {
    // Generate all possible asset paths (ordered by priority)
    const assetPaths = this.getAssetPaths();
    
    this.loadWithFallbacks(assetPaths, 0);
  }

  /**
   * Generate asset paths for different environments
   * Dev: /assets/portfolio-data.json
   * Prod (base-href=/portfolio/): /portfolio/assets/portfolio-data.json
   * GitHub Pages: /portfolio/assets/portfolio-data.json
   */
  private getAssetPaths(): string[] {
    const currentPath = window.location.pathname;
    const isGitHubPages = currentPath.includes('/portfolio/');
    const baseHref = isGitHubPages ? '/portfolio/' : '/';

    return [
      `${baseHref}assets/portfolio-data.json`, // Primary path
      '/assets/portfolio-data.json', // Fallback for dev
      './assets/portfolio-data.json', // Relative path
      'assets/portfolio-data.json' // Another relative variant
    ];
  }

  /**
   * Recursively try loading from multiple paths with exponential backoff
   */
  private loadWithFallbacks(paths: string[], index: number, attempt: number = 0): void {
    if (index >= paths.length) {
      const errorMsg = 'Failed to load portfolio data from all available paths';
      console.error(errorMsg);
      this.loadError$.next(errorMsg);
      this.loading$.next(false);
      return;
    }

    const currentPath = paths[index];
    const maxRetries = 3;

    if (attempt < maxRetries) {
      this.http
        .get<PortfolioContext>(currentPath)
        .pipe(
          retry(1), // Retry once on failure
          catchError((error) => {
            console.warn(`Attempt ${attempt + 1}/${maxRetries}: Failed to load from ${currentPath}`, error);
            
            // Exponential backoff before next attempt
            const delayMs = Math.pow(2, attempt) * 100;
            setTimeout(() => {
              if (attempt + 1 < maxRetries) {
                this.loadWithFallbacks(paths, index, attempt + 1);
              } else {
                // Move to next path
                this.loadWithFallbacks(paths, index + 1, 0);
              }
            }, delayMs);
            
            return of(null);
          })
        )
        .subscribe({
          next: (data) => {
            if (data) {
              console.log(`Successfully loaded portfolio data from: ${currentPath}`);
              this.portfolioContext$.next(data);
              this.loading$.next(false);
              this.loadError$.next(null);
            } else {
              // Try next path
              this.loadWithFallbacks(paths, index + 1, 0);
            }
          }
        });
    } else {
      // Max retries reached, move to next path
      this.loadWithFallbacks(paths, index + 1, 0);
    }
  }

  /**
   * Get the current portfolio context
   */
  getContext(): Observable<PortfolioContext | null> {
    return this.portfolioContext$.asObservable();
  }

  /**
   * Get context value synchronously (for immediate use)
   */
  getContextValue(): PortfolioContext | null {
    return this.portfolioContext$.value;
  }

  /**
   * Check if portfolio data is loaded
   */
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  /**
   * Get any load errors
   */
  getLoadError(): Observable<string | null> {
    return this.loadError$.asObservable();
  }

  /**
   * Check if data is currently available (for quick synchronous checks)
   */
  isDataAvailable(): boolean {
    return this.portfolioContext$.value !== null;
  }

  /**
   * Generate system prompt with portfolio context
   * PRODUCTION-GRADE: Instructive prompt that helps LLM provide accurate, helpful responses
   */
  generateSystemPrompt(): string {
    const context = this.portfolioContext$.value;
    if (!context) {
      return this.getDefaultSystemPrompt();
    }

    const skillsList = this.formatSkills(context.skills);
    const projectsList = this.formatProjects(context.projects);
    const experienceList = this.formatExperience(context.experience);

    return `You are a professional AI assistant representing ${context.profile.name}'s portfolio and professional background.

YOUR ROLE:
- Answer questions about the portfolio owner's professional profile, skills, experience, and projects
- Provide accurate, helpful information based on the portfolio data provided
- Be conversational, professional, and friendly
- Help visitors understand the portfolio owner's expertise and background

IMPORTANT GUIDELINES:
1. Base all responses on the portfolio information provided below
2. Never make up or fabricate information about projects, skills, or experience
3. If asked about something not in the portfolio, say "I don't have that information in the portfolio"
4. Keep responses clear and concise (max 300 words)
5. Be helpful and encouraging - this is a portfolio, so be positive about accomplishments
6. For off-topic questions (unrelated to the portfolio), politely redirect: "I'm specifically here to help with questions about [name]'s professional profile"

PORTFOLIO OWNER INFORMATION:
Name: ${context.profile.name}
Headline: ${context.profile.headline}
Location: ${context.profile.location}
Email: ${context.profile.email}
Phone: ${context.profile.phone}
GitHub: ${context.profile.github}
LinkedIn: ${context.profile.linkedin}
Availability: ${context.profile.availability}
Summary: ${context.profile.summary || 'Professional developer with strong technical skills'}

TECHNICAL SKILLS:
${skillsList}

PROFESSIONAL EXPERIENCE:
${experienceList}

PROJECTS & PORTFOLIO:
${projectsList}

EDUCATION:
${this.formatEducation(context.education)}

KEY ACHIEVEMENTS:
${context.achievements.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}

COMMUNICATION STYLE:
- Be enthusiastic about the portfolio owner's accomplishments
- Explain technical concepts in an accessible way
- Connect related skills and projects when answering
- Provide specific examples from the portfolio when relevant
- Be a helpful guide for potential employers, clients, or collaborators`;
  }

  private getDefaultSystemPrompt(): string {
    return `You are a professional AI assistant representing a developer's portfolio.

YOUR ROLE:
- Answer questions about the portfolio owner's professional background
- Provide helpful information about skills, experience, and projects
- Be friendly and professional

GUIDELINES:
1. Respond based on available portfolio information
2. Be honest if information is not available
3. Keep responses focused on professional topics
4. Redirect off-topic questions politely`;
  }

  private formatSkills(skills: any): string {
    if (!skills) return 'No skills data available';

    const lines: string[] = [];
    for (const [category, categorySkills] of Object.entries(skills)) {
      if (Array.isArray(categorySkills)) {
        lines.push(`${this.capitalize(category)}: ${categorySkills.join(', ')}`);
      }
    }
    return lines.join('\n');
  }

  private formatExperience(experience: any[]): string {
    if (!experience || experience.length === 0) {
      return 'No experience data available';
    }

    return experience
      .map(
        (exp: any) =>
          `${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
Description: ${exp.description}
Key Responsibilities: ${exp.responsibilities?.slice(0, 3).join('; ') || 'N/A'}
Technologies: ${exp.technologies?.join(', ') || 'N/A'}`
      )
      .join('\n\n');
  }

  private formatProjects(projects: any[]): string {
    if (!projects || projects.length === 0) {
      return 'No projects data available';
    }

    return projects
      .slice(0, 5)
      .map(
        (proj: any) =>
          `${proj.title} - ${proj.description}
Technologies: ${proj.technologies?.join(', ') || 'N/A'}
Highlights: ${proj.highlights?.slice(0, 2).join('; ') || 'N/A'}`
      )
      .join('\n\n');
  }

  private formatEducation(education: any[]): string {
    if (!education || education.length === 0) {
      return 'No education data available';
    }

    return education
      .map(
        (edu: any) =>
          `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.year})
GPA: ${edu.gpa || 'N/A'}`
      )
      .join('\n');
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Format portfolio context for LLM injection
   */
  getContextForPrompt(): string {
    const context = this.portfolioContext$.value;
    if (!context) return 'Portfolio context not loaded';

    return JSON.stringify(context, null, 2);
  }
}
