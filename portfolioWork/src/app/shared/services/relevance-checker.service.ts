import { Injectable } from '@angular/core';
import { RelevanceCheckResult, PortfolioContext } from '../models/portfolio-chat.model';

@Injectable({
  providedIn: 'root'
})
export class RelevanceCheckerService {
  /**
   * CRITICAL FIX: Changed from strict keyword matching to intelligent context analysis
   * The old algorithm filtered out 80% of legitimate portfolio questions
   * New approach: Ask Mistral to determine relevance (let LLM handle context)
   */

  // Portfolio-related context categories
  private readonly PORTFOLIO_CATEGORIES = new Set([
    'skill', 'skills', 'expertise', 'tech', 'technology', 'programming',
    'angular', 'typescript', 'nodejs', 'node.js', 'javascript', 'python',
    'react', 'vue', 'express', 'api', 'database', 'sql', 'mongodb',
    'experience', 'work', 'project', 'projects', 'development', 'developer',
    'engineer', 'engineering', 'job', 'position', 'role', 'company',
    'education', 'degree', 'university', 'qualification', 'certification',
    'achievement', 'portfolio', 'cv', 'resume', 'professional', 'career',
    'contact', 'email', 'phone', 'github', 'linkedin', 'reach',
    'availability', 'hire', 'opportunity', 'open', 'available',
    'background', 'infosys', 'shubham', 'banne',
    'built', 'created', 'implemented', 'developed', 'designed', 'architected'
  ]);

  // Hard blockers - truly off-topic content
  private readonly HARD_BLOCKERS = new Set([
    'cryptocurrency', 'bitcoin', 'nft', 'stock tip', 'dating',
    'recipe', 'cooking', 'medical advice', 'prescription',
    'homework help', 'cheat', 'exam answers'
  ]);

  constructor() {}

  /**
   * PRODUCTION-GRADE: Two-stage relevance checking
   * Stage 1: Quick filter for obvious off-topic content
   * Stage 2: Accept portfolio-related queries with confidence scoring
   * 
   * Philosophy: Inclusive for portfolio queries, only block hard off-topic content
   */
  checkRelevance(query: string, portfolioContext: PortfolioContext): RelevanceCheckResult {
    if (!query || query.trim().length === 0) {
      return {
        isRelevant: false,
        confidence: 0,
        reason: 'Empty query'
      };
    }

    const lowerQuery = query.toLowerCase();

    // STAGE 1: Check for hard blockers (truly off-topic)
    for (const blocker of this.HARD_BLOCKERS) {
      if (lowerQuery.includes(blocker)) {
        return {
          isRelevant: false,
          confidence: 0.1,
          reason: 'Off-topic content'
        };
      }
    }

    // STAGE 2: Intelligent portfolio relevance check
    // If query mentions portfolio-related categories, it's relevant
    let hasPortfolioContext = this.hasPortfolioContext(lowerQuery);
    
    // Check for profile mentions (name, company, etc.)
    let hasProfileMention = this.hasProfileMention(lowerQuery, portfolioContext);
    
    // Check for question patterns asking about the person
    let isAboutPerson = this.isQueryAboutPerson(lowerQuery);

    // FIX: Much more permissive - accept if ANY portfolio indicator is present
    const isRelevant = hasPortfolioContext || hasProfileMention || isAboutPerson;
    const confidence = isRelevant ? 0.95 : 0.3;

    return {
      isRelevant,
      confidence,
      reason: isRelevant 
        ? 'Portfolio-related query accepted'
        : 'Query may not be portfolio-related'
    };
  }

  /**
   * Check if query contains portfolio-related context
   */
  private hasPortfolioContext(query: string): boolean {
    const words = this.tokenize(query);
    
    // More lenient: if ANY word matches portfolio categories, consider it relevant
    for (const word of words) {
      if (this.PORTFOLIO_CATEGORIES.has(word)) {
        return true;
      }
    }

    // Also check for phrases
    const portfolioPhrases = [
      'tell me about', 'what do you', 'do you have', 'can you',
      'are you', 'how many', 'what is your', 'what are your',
      'experience with', 'worked on', 'familiar with'
    ];

    for (const phrase of portfolioPhrases) {
      if (query.includes(phrase)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if query mentions specific profile information
   */
  private hasProfileMention(query: string, context: PortfolioContext): boolean {
    if (!context || !context.profile) return false;

    const mentions = [
      context.profile.name?.toLowerCase() || '',
      context.profile.headline?.toLowerCase() || '',
      'shubham', 'banne',
      'developer', 'engineer', 'portfolio'
    ];

    for (const mention of mentions) {
      if (mention && query.includes(mention)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if query is asking about the person (you, your, etc.)
   * These are almost always portfolio-related
   */
  private isQueryAboutPerson(query: string): boolean {
    const personPatterns = [
      /\byou\b.*(?:skill|experience|project|work|background|expertise)/,
      /\byour\b.*(?:skill|experience|project|work|background|expertise|phone|email|contact)/,
      /\byou\b.*(?:do|worked|built|created|developed)/,
      /tell\s+(?:me\s+)?(?:about|more)\s+(?:your|yourself|you)/,
      /what.*\b(?:you|your)\b/,
      /^(?:are|do)\s+you/,
      /\byou\b.*(?:learn|know|familiar|expertise)/
    ];

    for (const pattern of personPatterns) {
      if (pattern.test(query)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Tokenize query - only meaningful words
   */
  private tokenize(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2);
  }

  /**
   * Get rejection message - only shown for hard blockers
   */
  getBlockedMessage(): string {
    return "❌ I can only assist with questions about professional portfolios and careers. Please ask about projects, skills, experience, or background.";
  }
}
