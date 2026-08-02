import { Component, OnInit } from '@angular/core';
import { CONTACT_DATA, ContactPageData, PROFILE } from 'src/app/data';
import { SeoService } from 'src/app/core/services/seo.service';
import { trackBySocial } from 'src/app/shared/utils/track-by';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  readonly contactData: ContactPageData = CONTACT_DATA;
  readonly profile = PROFILE;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setSeo({
      title: 'Contact Me - Shubham Banne',
      description:
        'Get in touch with Shubham Banne. Share feedback, ideas, opportunities, or job referrals.',
    });
  }

  trackByButton = (_: number, btn: { label: string }) => btn.label;
  trackBySection = (_: number, section: { id: string }) => section.id;
  readonly trackBySocial = trackBySocial;

  telHref(phone?: string): string {
    return 'tel:' + (phone ?? '').replace(/[^\d+]/g, '');
  }
}
