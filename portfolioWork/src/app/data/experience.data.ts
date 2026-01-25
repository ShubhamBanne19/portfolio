export interface ExperienceItem {
  id?: string;
  company: string;
  role: string;
  startDate: string; // ISO or YYYY-MM
  endDate?: string | null; // null means present
  location?: string;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  logo?: string;
}

// export const EXPERIENCE: ExperienceItem[] = [
//   {
//     id: 'exp-frontend-sme',
//     company: 'Acme Labs',
//     role: 'Senior Frontend Engineer',
//     startDate: '2022-06',
//     endDate: null,
//     location: 'Remote / Bangalore',
//     description: 'Leading frontend efforts on a design-system-driven product platform.',
//     responsibilities: [
//       'Architect component library and enforce accessibility standards (WCAG AA).',
//       'Mentor engineers on TypeScript, testing, and performance budgets.',
//       'Collaborate with designers to convert Figma into reusable components.'
//     ],
//     technologies: ['Angular', 'TypeScript', 'RxJS', 'Sass', 'Jest', 'Cypress'],
//     logo: '/assets/logos/acme.svg'
//   },
//   {
//     id: 'exp-ui-engineer',
//     company: 'Beta Product Co.',
//     role: 'Frontend Engineer',
//     startDate: '2019-09',
//     endDate: '2022-05',
//     location: 'Bangalore, India',
//     description: 'Implemented responsive, data-driven UI and optimized load performance.',
//     responsibilities: [
//       'Built feature pages and case studies using component-first patterns.',
//       'Improved Core Web Vitals and reduced bundle sizes by 40%.'
//     ],
//     technologies: ['React', 'TypeScript', 'Webpack', 'GraphQL']
//   }
// ];
export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-infosys-analyst',
    company: 'Infosys Ltd.',
    role: 'Technology Analyst (Frontend Developer)',
    startDate: '2022-04',
    endDate: null,
    location: 'Pune, India',
    description:
      'Frontend developer working on enterprise-scale Angular applications integrated with Node.js microservices and PostgreSQL.',
    responsibilities: [
      'Designed and developed enterprise-grade Angular applications for internal platforms and client-facing systems.',
      'Owned complete frontend modules including architecture decisions, feature delivery, and production accountability.',
      'Built scalable and reusable Angular component libraries with standardized UI patterns across multiple applications.',
      'Implemented clean, maintainable component architecture following separation of concerns and testability principles.',
      'Led frontend performance optimization using lazy loading, route-based code splitting, OnPush change detection, and RxJS best practices.',
      'Improved UI responsiveness and resolved performance bottlenecks in data-heavy dashboards, tables, and form-driven workflows.',
      'Played a key role in Campus Solutions and Student CRM modules, including student landing screens, admin templates, and admission workflows.',
      'Developed high-visibility systems such as deployment trackers, analytics dashboards, and timetable management with conflict validation.',
      'Collaborated closely with backend (Node.js, REST APIs, PostgreSQL/MongoDB), QA, DevOps, and business teams in Agile/Scrum environments.',
      'Introduced Playwright-based UI automation, strengthened regression testing, mentored junior developers, and enforced frontend quality standards.',
      'Designed dynamic form builders and preview utilities enabling configurable, metadata-driven UI generation.',
      'Improved cross-browser compatibility and screen resolution consistency across desktop, tablet, and mobile devices.',
      'Participated in requirement gathering, technical feasibility analysis, and frontend estimation for new modules.',
      'Delivered comprehensive technical documentation covering reusable components, shared services, and frontend workflows.'
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'RxJS',
      'NgRx',
      'Node.js',
      'PostgreSQL',
      'SCSS',
      'Angular Material'
    ],
    logo: '/assets/logos/infosys.svg'
  }
];
