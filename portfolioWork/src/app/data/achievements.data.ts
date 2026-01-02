export interface Achievement {
  id?: string;
  title: string;
  issuer?: string;
  date?: string; // YYYY or YYYY-MM
  link?: string;
  description?: string;
  type?: 'certification' | 'award' | 'publication' | 'other';
}

// 
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'cert-hackerrank-js',
    title: 'HackerRank JavaScript Certification',
    issuer: 'HackerRank',
    link: 'https://www.hackerrank.com/certificates/5e009d0d0e7f',
    type: 'certification'
  },
  {
    id: 'cert-infosys-angular',
    title: 'Infosys Certified Angular Associate',
    issuer: 'Infosys',
    type: 'certification'
  },
  {
    id: 'cert-infosys-python',
    title: 'Infosys Certified Python Associate',
    issuer: 'Infosys',
    type: 'certification'
  },
  {
    id: 'award-creative-catalyst',
    title: 'Creative Catalyst Recognition',
    issuer: 'Infosys',
    description:
      'Recognized by management for driving innovative ideas and creative solutions that enhanced project outcomes and team collaboration.',
    type: 'award'
  },
  {
    id: 'award-exceptional-contribution',
    title: 'Exceptional Contribution Award',
    issuer: 'Infosys',
    type: 'award'
  }
];
