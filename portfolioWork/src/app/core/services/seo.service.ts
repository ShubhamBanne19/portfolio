import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private meta: Meta, private title: Title) {}

  update(title: string, description: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
  }
  setSeo(payload: { title: string; description?: string; 'og:image'?: string }) {
    if (payload.title) {
      this.title.setTitle(payload.title);
      this.meta.updateTag({ property: 'og:title', content: payload.title });
    }
    if (payload.description) {
      this.meta.updateTag({ name: 'description', content: payload.description });
      this.meta.updateTag({ property: 'og:description', content: payload.description });
    }
    if (payload['og:image']) {
      this.meta.updateTag({ property: 'og:image', content: payload['og:image'] });
    }
  }
}
