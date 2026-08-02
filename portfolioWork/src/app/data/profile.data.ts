import { IconName } from 'src/app/shared/models/icon.model';

export interface SocialLink {
  label: string;
  url: string;
  icon: IconName;
}

export interface ProfileData {
  id?: string;
  name: string;
  headline: string;
  shortTagline: string;
  summary: string;
  aboutParagraph: string;
  location?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  social: SocialLink[];
}

export const PROFILE: ProfileData = {
  id: 'profile-shubham-banne',
  name: 'Shubham Sanjay Banne',
  headline: 'Frontend Developer - Angular & Node.js',
  shortTagline:
    'I build enterprise web apps that scale, ship fast, and hold up in production.',
  summary:
    '4+ years building enterprise-grade applications with Angular and Node.js - from modular UI architecture and performance optimization to RESTful microservice integration. I’ve shipped cloud-ready dashboards, built reusable component libraries adopted across teams, and mentored developers in Agile environments.',
  aboutParagraph:
    'My path here didn’t start with software. I trained as a mechanical engineer, audited maintenance systems on a foundry floor, and led the setup of a new production plant - work that’s really just systems thinking under physical constraints: model the forces, find the failure modes, remove the manual toil. When I moved into frontend engineering, that instinct came with me. It’s why I default to component architecture over one-off code, why performance budgets matter to me as much as pixel-perfect UI, and why I’m drawn to automating anything I do twice.',
  location: 'Pune, India',
  email: 'shubhambanne.work@gmail.com',
  phone: '+91 8999661297',
  avatar: '/assets/avatar.png',
  social: [
    {
      label: 'GitHub',
      url: 'https://github.com/ShubhamBanne19',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/shubham-banne1802',
      icon: 'linkedin',
    },
    {
      label: 'Twitter',
      url: 'https://x.com/BanneShubham',
      icon: 'twitter',
    },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/shubhambanne19?igsh=cHJzNzMzY3pmbWhm',
      icon: 'instagram',
    },
  ],
};
