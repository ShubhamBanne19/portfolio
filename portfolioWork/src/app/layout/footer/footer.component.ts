import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PROFILE } from 'src/app/data';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { trackBySocial } from 'src/app/shared/utils/track-by';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly profile = PROFILE;

  readonly trackBySocial = trackBySocial;

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
