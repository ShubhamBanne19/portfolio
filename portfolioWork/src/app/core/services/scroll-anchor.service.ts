import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const MAX_WAIT_ATTEMPTS = 40; // ~2s of retries at 50ms each

/**
 * Scrolls to an in-page section by id, navigating home first if needed.
 * Deliberately not routed through Angular Router fragments/anchorScrolling:
 * the app uses `useHash: true`, under which the URL hash is already
 * consumed by routing, so fragment-based anchor scrolling isn't reliable.
 */
@Injectable({ providedIn: 'root' })
export class ScrollAnchorService {
  constructor(private router: Router) {}

  goToSection(targetId: string): void {
    const currentPath = this.router.url.split(/[?#]/)[0] || '/';
    if (currentPath === '/') {
      this.waitAndScroll(targetId);
    } else {
      this.router.navigateByUrl('/').then(() => this.waitAndScroll(targetId));
    }
  }

  private waitAndScroll(targetId: string, attempt = 0): void {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (attempt >= MAX_WAIT_ATTEMPTS) return;
    setTimeout(() => this.waitAndScroll(targetId, attempt + 1), 50);
  }
}
