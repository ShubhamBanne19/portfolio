import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MistralPortfolioService } from '../../services/mistral-portfolio.service';
import { ChatMessage } from '../../models/portfolio-chat.model';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  isMinimized = false;
  scrolledToBottom = false;

  private destroy$ = new Subject<void>();

  constructor(
    private chatbotService: MistralPortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // PRODUCTION FIX: Subscribe to messages with explicit change detection
    this.chatbotService.getMessages()
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => 
          JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(messages => {
        // Update component state
        this.messages = messages;
        
        // Trigger change detection explicitly (required for OnPush strategy)
        this.cdr.markForCheck();
        
        // Scroll after Angular renders the changes
        // Using two-phase: immediately and after render
        setTimeout(() => {
          this.scrollToBottom();
          this.cdr.markForCheck();
        }, 0);
      });

    // Subscribe to loading state with change detection
    this.chatbotService.getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
        this.cdr.markForCheck();
      });
  }

  ngAfterViewChecked(): void {
    if (!this.scrolledToBottom) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isMinimized = false;
      // Ensure view update after toggle
      this.cdr.markForCheck();
      setTimeout(() => {
        this.scrollToBottom();
        this.cdr.markForCheck();
      }, 50);
    }
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
    this.cdr.markForCheck();
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
    this.cdr.markForCheck();
  }

  async sendMessage(): Promise<void> {
    if (this.userInput.trim() && !this.isLoading) {
      const message = this.userInput;
      this.userInput = '';
      
      // Trigger change detection for input clear
      this.cdr.markForCheck();
      
      // Send message (it will update messages$ observable)
      await this.chatbotService.sendMessage(message);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearHistory(): void {
    this.chatbotService.clearHistory();
    // Messages will be cleared via observable subscription
    // No need for manual change detection (already handled in subscription)
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
        this.scrolledToBottom = true;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  getMessageTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
