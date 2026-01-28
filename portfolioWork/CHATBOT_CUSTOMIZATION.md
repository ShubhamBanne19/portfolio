# Chatbot Customization Examples

This document shows how to customize the chatbot for your specific needs.

## 1. Custom System Prompt

The chatbot automatically generates a system prompt from your portfolio data. To customize it further:

**File:** `src/app/shared/services/chatbot.service.ts`

```typescript
private generateSystemPrompt(): string {
  // Add custom instructions here
  const customInstructions = `
    - When asked about technologies, mention my expertise in Angular performance optimization
    - Always encourage visitors to check my GitHub for code samples
    - If someone asks about availability, direct them to my LinkedIn or email
  `;
  
  return `You are a professional AI assistant for Shubham Sanjay Banne's portfolio website. 
  
  ${customInstructions}
  
  [Rest of the prompt...]
  `;
}
```

## 2. Change Chat Colors

**File:** `src/app/shared/components/chatbot/chatbot.component.scss`

### Dark Blue Theme
```scss
$primary-color: #1e293b;        // Very dark blue
$secondary-color: #0f172a;      // Darker blue
$accent-color: #0ea5e9;         // Sky blue
$accent-hover: #0284c7;         // Darker sky blue
$text-primary: #f1f5f9;
```

### Purple Theme
```scss
$accent-color: #a855f7;         // Purple
$accent-hover: #9333ea;         // Darker purple
$primary-color: #1e1b4b;        // Dark purple
```

### Green Theme (Eco)
```scss
$accent-color: #10b981;         // Emerald
$accent-hover: #059669;         // Darker emerald
$primary-color: #064e3b;        // Dark green
```

## 3. Change Chat Icon

**File:** `src/app/shared/components/chatbot/chatbot.component.html`

Replace the emoji:
```html
<!-- Current: Thought bubble -->
<span class="chat-icon">💬</span>

<!-- Alternative options: -->
<!-- Support icon -->
<span class="chat-icon">🎧</span>

<!-- Robot icon -->
<span class="chat-icon">🤖</span>

<!-- Question mark -->
<span class="chat-icon">❓</span>

<!-- User with speech -->
<span class="chat-icon">💭</span>

<!-- AI icon -->
<span class="chat-icon">✨</span>
```

Or use FontAwesome (already included in your project):

```html
<i class="fas fa-comments" style="font-size: 1.5rem;"></i>
```

## 4. Adjust Chat Behavior

### Response Speed
```typescript
// In chatbot.service.ts
private config: ChatbotConfig = environment.chatbot as ChatbotConfig;

// Make responses faster but less creative
// environment.ts
chatbot: {
  model: 'openai/gpt-3.5-turbo',
  maxTokens: 500,          // Shorter responses
  temperature: 0.5,        // Less creative, more focused
  maxHistoryLength: 5      // Less context history
}
```

### More Conversational
```typescript
chatbot: {
  maxTokens: 1500,         // Longer responses
  temperature: 0.9,        // More creative
  maxHistoryLength: 15     // More context
}
```

## 5. Add Typing Delay

For more human-like feel:

**File:** `src/app/shared/services/chatbot.service.ts`

```typescript
try {
  const response = await this.callAPI(trimmedMessage);
  
  // Add artificial delay to simulate typing
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Remove loading message and add response
  // ...rest of code
}
```

## 6. Custom Welcome Messages Based on Time

**File:** `src/app/shared/services/chatbot.service.ts`

```typescript
private initializeChat(): void {
  const hour = new Date().getHours();
  let greeting = 'Hi! 👋 ';
  
  if (hour < 12) greeting += "Good morning! ";
  else if (hour < 18) greeting += "Good afternoon! ";
  else greeting += "Good evening! ";
  
  greeting += "I'm Shubham's AI assistant. How can I help you today?";
  
  const greetingMsg: ChatMessage = {
    id: this.generateId(),
    role: 'assistant',
    content: greeting,
    timestamp: new Date()
  };
  this.messages$.next([greetingMsg]);
}
```

## 7. Add Quick Reply Buttons

**File:** `src/app/shared/components/chatbot/chatbot.component.html`

Add after messages container:

```html
<!-- Quick Replies -->
<div class="quick-replies" *ngIf="messages.length <= 1">
  <p class="quick-replies-label">Quick Questions:</p>
  <button 
    (click)="sendMessage('Tell me about your skills')"
    class="quick-reply-btn"
  >
    Skills
  </button>
  <button 
    (click)="sendMessage('Show me your projects')"
    class="quick-reply-btn"
  >
    Projects
  </button>
  <button 
    (click)="sendMessage('How to contact you?')"
    class="quick-reply-btn"
  >
    Contact
  </button>
</div>
```

And add CSS:

```scss
.quick-replies {
  padding: $spacing-md;
  border-bottom: 1px solid $border-color;
  
  .quick-replies-label {
    font-size: 0.85rem;
    color: $text-secondary;
    margin: 0 0 $spacing-sm 0;
  }
  
  .quick-reply-btn {
    display: inline-block;
    margin-right: $spacing-sm;
    margin-bottom: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: rgba(59, 130, 246, 0.2);
    color: $accent-color;
    border: 1px solid $accent-color;
    border-radius: $radius-md;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all $transition-fast;
    
    &:hover {
      background: $accent-color;
      color: white;
    }
  }
}
```

## 8. Add Message Reactions

**File:** `src/app/shared/components/chatbot/chatbot.component.html`

```html
<div class="message-actions" *ngIf="msg.role === 'assistant'">
  <button class="reaction-btn" title="Like this message" (click)="likeMessage(msg.id)">👍</button>
  <button class="reaction-btn" title="Dislike this message" (click)="dislikeMessage(msg.id)">👎</button>
</div>
```

## 9. Add Copy-to-Clipboard for Code

If you want to show code snippets:

```html
<div class="message-content" [innerHTML]="msg.content"></div>
<button (click)="copyToClipboard(msg.content)" class="copy-btn">
  Copy
</button>
```

## 10. Persist Chat History

Save to localStorage:

**File:** `src/app/shared/services/chatbot.service.ts`

```typescript
private loadChatHistory(): void {
  const saved = localStorage.getItem('chatbot_history');
  if (saved) {
    this.messages$.next(JSON.parse(saved));
  } else {
    this.initializeChat();
  }
}

private saveChatHistory(): void {
  const messages = this.messages$.value;
  localStorage.setItem('chatbot_history', JSON.stringify(messages));
}

async sendMessage(userMessage: string): Promise<void> {
  // ... existing code ...
  this.saveChatHistory();
}
```

## 11. Language Support

To support multiple languages:

```typescript
private systemPrompt = this.generateSystemPrompt();

constructor(private chatbotService: ChatbotService, private translateService: TranslateService) {
  this.loadLanguage();
}

private loadLanguage(): void {
  const lang = this.translateService.currentLanguage;
  if (lang === 'es') {
    this.systemPrompt = this.generateSystemPromptES();
  } else if (lang === 'fr') {
    this.systemPrompt = this.generateSystemPromptFR();
  }
}
```

## 12. Analytics Integration

Track user interactions:

```typescript
async sendMessage(userMessage: string): Promise<void> {
  // Send to Google Analytics
  gtag('event', 'chatbot_message', {
    message_length: userMessage.length,
    timestamp: new Date()
  });
  
  // ... rest of code ...
}
```

## 13. A/B Testing Different Prompts

```typescript
private selectSystemPrompt(): string {
  const variant = Math.random() > 0.5 ? 'A' : 'B';
  
  if (variant === 'A') {
    return this.generateSystemPromptA(); // Formal
  } else {
    return this.generateSystemPromptB(); // Casual
  }
}
```

## 14. Disable Chat on Mobile

```html
<div class="chatbot-container" [hidden]="isMobile">
  <!-- Chat content -->
</div>

<script>
  isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
</script>
```

## 15. Schedule Chat Availability

```typescript
private isChatAvailable(): boolean {
  const hour = new Date().getHours();
  return hour >= 9 && hour <= 22; // Open 9 AM - 10 PM
}

toggleChat(): void {
  if (!this.isChatAvailable()) {
    alert('Chat is available 9 AM - 10 PM');
    return;
  }
  this.isOpen = !this.isOpen;
}
```

## Testing Customizations

1. **Local Testing:**
   ```bash
   ng serve
   ```

2. **Production Build Testing:**
   ```bash
   ng build --configuration production
   npx http-server dist/portfolioWork -p 8080
   ```

3. **Browser DevTools:**
   - F12 to open DevTools
   - Console tab for JavaScript errors
   - Network tab to verify API calls
   - Storage tab to check localStorage

## Common Pitfalls

❌ **Don't:** Hardcode API key in production code
✅ **Do:** Use `environment.prod.ts` and keep it in `.gitignore`

❌ **Don't:** Add heavy external libraries
✅ **Do:** Use CSS-only animations with transform + opacity

❌ **Don't:** Keep entire conversation history
✅ **Do:** Trim history to last 10-20 messages

❌ **Don't:** Make blocking API calls
✅ **Do:** Use async/await with proper error handling

## Performance Tips

1. **Lazy load chatbot component:**
   ```typescript
   imports: [ChatbotComponent] // Already lazy if using standalone
   ```

2. **Use OnPush change detection:**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

3. **Virtual scroll for large chat histories:**
   Use `cdkVirtualScroll` for chats with 100+ messages

4. **Debounce rapidly sent messages:**
   Already implemented with 500ms throttle

## Need Help?

Refer to:
- `CHATBOT_SETUP.md` - Complete setup guide
- `chatbot.component.ts` - Component logic
- `chatbot.service.ts` - API integration
- `environment.ts` - Configuration

Happy customizing! 🚀
