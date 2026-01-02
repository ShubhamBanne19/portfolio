import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
     selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent{
    @Input() navItems: { label: string; href: string }[] = [];
  trackByHref(_: number, item: { href: string }) {
    return item.href;
  }
}