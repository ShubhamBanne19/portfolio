export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  name: string;
  level: SkillLevel;
  keywords?: string[]; // further search-friendly tags
}

export interface SkillGroup {
  id?: string;
  category: string;
  skills: Skill[];
}

export const SKILLS: SkillGroup[] = [
  {
    id: 'frontend',
    category: 'Frontend',
    skills: [
      { name: 'Angular', level: 'expert' },
      { name: 'TypeScript', level: 'expert' },
      { name: 'RxJS', level: 'advanced' },
      { name: 'NgRx', level: 'advanced' },
      { name: 'SCSS / Sass', level: 'advanced' },
      { name: 'Angular Material', level: 'advanced' },
      { name: 'Responsive Design', level: 'advanced' }
    ]
  },
  {
    id: 'backend',
    category: 'Backend',
    skills: [
      { name: 'Node.js', level: 'advanced' },
      { name: 'Express.js', level: 'advanced' },
      { name: 'REST APIs', level: 'advanced' },
      { name: 'JWT Authentication', level: 'intermediate' }
    ]
  },
  {
    id: 'database',
    category: 'Databases',
    skills: [
      { name: 'PostgreSQL', level: 'intermediate' },
      { name: 'MongoDB', level: 'intermediate' }
    ]
  },
  {
    id: 'tools',
    category: 'Testing & Tools',
    skills: [
      { name: 'Playwright', level: 'advanced' },
      { name: 'Git', level: 'advanced' },
      { name: 'Postman', level: 'advanced' },
      { name: 'VS Code', level: 'expert' }
    ]
  }
];
