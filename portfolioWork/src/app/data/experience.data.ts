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
      //  // Core Frontend Engineering
      // 'Designed and developed enterprise-grade Angular applications for internal platforms and client-facing systems.',
      // 'Progressed from feature-level contributions to owning complete frontend modules, architecture decisions, and delivery accountability.',
      // 'Built scalable, reusable Angular component libraries and shared UI patterns to standardize design across multiple applications.',
      // 'Implemented clean component architecture with separation of concerns, maintainability, and testability in mind.',

      // // Performance & Optimization
      // 'Led frontend performance optimization initiatives using lazy loading, route-based code splitting, OnPush change detection, and RxJS best practices.',
      // 'Resolved UI performance bottlenecks for data-heavy dashboards and large-scale tables.',
      // 'Improved responsiveness and cross-device compatibility across student dashboards, home screens, and form-heavy workflows.',

      // // Campus Solutions & Student CRM
      // 'Contributed significantly to the Campus Solutions platform, with a strong focus on Student CRM modules.',
      // 'Designed and implemented Student Landing Screens and Admission Management Landing Screens to streamline workflows.',
      // 'Integrated dynamic forms, preview utilities, and admin screen templates to enhance configurability and reuse.',
      // 'Ensured frontend flows aligned with enterprise security, compliance, and role-based access requirements.',

      // // Deployment Tracker & Dashboards
      // 'Designed and developed a high-visibility Deployment Tracker application to monitor application deployments and movements.',
      // 'Built analytics dashboards using charts and tables to present operational and business metrics clearly.',
      // 'Reduced manual operational effort by automating reporting and tracking workflows.',

      // // Timetable Management System
      // 'Designed and developed an interactive timetable management module with conflict detection.',
      // 'Handled institute timings, faculty availability, room availability, holidays, and drag-and-drop scheduling.',
      // 'Implemented advanced calendar features such as selectable periods, drag-to-create events, grouped events, and validation logic.',

      // // Backend Collaboration & Data
      // 'Collaborated closely with backend teams using Node.js and REST APIs for seamless frontend-backend integration.',
      // 'Worked with PostgreSQL and MongoDB-backed services to handle large datasets and transactional workflows.',
      // 'Participated in requirement analysis and API contract discussions with backend and business teams.',

      // // Quality, Testing & Automation
      // 'Introduced and maintained automated UI testing using Playwright to improve regression stability.',
      // 'Created automation test scripts aligned with sprint test cases to support continuous regression testing.',
      // 'Actively contributed to improving overall application quality by identifying UI defects and edge cases early.',

      // // Agile & Cross-Team Collaboration
      // 'Worked in Agile/Scrum environments, participating in sprint planning, daily stand-ups, reviews, and retrospectives.',
      // 'Collaborated with QA, DevOps, and product stakeholders to ensure timely and high-quality releases.',
      // 'Provided detailed technical documentation for frontend modules and shared utilities.',

      // // Mentorship & Ownership
      // 'Guided junior developers on Angular best practices, component design, and debugging techniques.',
      // 'Reviewed code to enforce quality standards, consistency, and long-term maintainability.'
      'Designed and delivered enterprise Angular applications used across internal and client-facing platforms.',
      'Owned end-to-end frontend modules, from requirement understanding and UI architecture to production delivery.',
      'Built reusable Angular component systems and standardized UI patterns across multiple applications.',
      'Led performance optimizations using lazy loading, route-based code splitting, and RxJS best practices.',
      'Developed data-intensive dashboards and business workflows, reducing manual operational effort.',
      'Played a key role in Campus Solutions and Student CRM modules, including admin screens and landing pages.',
      'Engineered interactive systems such as deployment trackers and timetable management with conflict validation.',
      'Collaborated closely with backend (Node.js), QA, and DevOps teams in Agile delivery environments.',
      'Introduced automated UI testing with Playwright to improve regression stability and release confidence.',
      'Mentored junior developers and enforced frontend code quality and architectural standards.'
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
