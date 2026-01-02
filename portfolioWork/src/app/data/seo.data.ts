export interface OpenGraph {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export interface SEOData {
  siteName: string;
  defaultTitle: string;
  titleTemplate?: string; // e.g. '%s — Shubh'
  description: string;
  author?: string;
  keywords?: string[];
  openGraph?: OpenGraph;
}

export const SEO: SEOData = {
  siteName: 'Shubham Banne — Frontend Developer',
  defaultTitle: 'Shubham Banne — Frontend Developer',
  titleTemplate: '%s — Shubham Banne',
  description:
    'Frontend Developer with 3.7+ years of experience in Angular and Node.js, building scalable enterprise applications.',
  author: 'Shubham Sanjay Banne',
  keywords: [
    'Angular Developer',
    'Frontend Developer',
    'Node.js',
    'Enterprise UI',
    'TypeScript',
    'RxJS'
  ],
  openGraph: {
    title: 'Shubham Banne — Frontend Developer',
    description: 'Portfolio and case studies of enterprise Angular applications.',
    image: '/assets/og-image.png'
  }
};
