import { Component, OnInit } from '@angular/core';
import { CONTACT_DATA, ContactPageData } from 'src/app/data/contact.data';
import { SeoService } from 'src/app/core/services/seo.service';

/**
 * CONTACT COMPONENT
 * 
 * Features:
 * - Contact information and CTAs
 * - Google Form integration for inquiries
 * - Job referral opportunities
 * - SEO optimization
 * - Accessible form links
 */
@Component({
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  readonly contactData: ContactPageData = CONTACT_DATA;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update(
      'Contact Me - Shubham Banne',
      'Get in touch with Shubham Banne. Share feedback, ideas, opportunities, or job referrals.'
    );
  }

  /**
   * Track by function for buttons
   */
  trackByButton = (_: number, btn: { label: string }) => btn.label;

  /**
   * Track by function for sections
   */
  trackBySection = (_: number, section: { id: string }) => section.id;
}
