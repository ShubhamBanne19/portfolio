export interface SocialLink {
  label: string;
  url: string;
  icon?: string; // optional icon name for UI
}

export interface ProfileData {
  id?: string;
  name: string;
  headline: string;
  shortTagline: string;
  summary: string;
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
  shortTagline: 'Building scalable, high-performance enterprise web applications',
  summary:
    'Frontend Developer with 3.10+ years of experience building scalable, high-performance applications using Angular and Node.js. Expertise in modular UI architecture, performance optimization, and RESTful microservice integration. Proven track record of delivering cloud-ready dashboards, reusable component libraries, and mentoring developers in Agile environments.',
  location: 'Pune, India',
  email: 'shubhambanne.work@gmail.com',
  phone: '+91 8999661297',
  avatar: '/assets/avatar.png',
  social: [
    {
      label: 'GitHub',
      url: 'https://github.com/ShubhamBanne19',
      icon: 'github'
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/shubham-banne1802',
      icon: 'linkedin'
    }
  ]
};
