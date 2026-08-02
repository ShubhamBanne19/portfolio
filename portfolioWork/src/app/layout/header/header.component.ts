import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { ScrollAnchorService } from 'src/app/core/services/scroll-anchor.service';

export interface NavAnchor {
  label: string;
  targetId: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly anchors: NavAnchor[] = [
    { label: 'Experience', targetId: 'experience' },
    { label: 'Projects', targetId: 'projects' },
    { label: 'Skills', targetId: 'skills' },
    { label: 'Beyond the Code', targetId: 'beyond-the-code' },
    { label: 'Achievements', targetId: 'achievements' }
  ];

  menuOpen = false;
  scrolled = false;

  constructor(private scrollAnchor: ScrollAnchorService) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 8;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  trackByTargetId(_: number, item: NavAnchor): string {
    return item.targetId;
  }

  scrollToSection(targetId: string, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    this.scrollAnchor.goToSection(targetId);
  }
}
