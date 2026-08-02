import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconName } from 'src/app/shared/models/icon.model';

/**
 * Small inline-SVG icon set. Avoids pulling in an icon font/library for a
 * handful of glyphs used across the header, footer, contact and
 * achievements sections.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() name!: IconName;
}
