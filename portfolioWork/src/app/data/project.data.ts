export interface ProjectMedia {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ProjectItem {
  id: string; // stable identifier used for routing/case studies
  title: string;
  short: string;
  role?: string;
  timeline?: string;
  company?: string;
  hero?: ProjectMedia;
  gallery?: ProjectMedia[];
  tags?: string[]; // feature/tech tags
  repo?: string;
  live?: string;
  caseStudy?: string; // path or slug to case-study route
  contributions?: string[]; // bullet contributions for case study list
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'student-crm',
    title: 'StudentCRM',
    short:
      'Enterprise student management system with role-based access and live analytics.',
    role: 'Frontend Engineer',
    company: 'Infosys',
    tags: ['Angular', 'Node.js', 'PostgreSQL', 'RBAC', 'Dashboards'],
    caseStudy: '/project/student-crm',
    contributions: [
      'Developed end-to-end student management workflows, including student landing screens, admin templates, and admission workflows used across Campus Solutions.',
      'Implemented role-based access control so admins, faculty, and students each see a scoped, permission-aware view of the same platform.',
      'Built live analytics dashboards for admissions and enrollment data, replacing manual reporting with real-time views.',
      'Optimized data-heavy tables and forms with lazy loading and OnPush change detection to keep the UI responsive at enterprise scale.',
    ],
  },
  {
    id: 'deployment-tracker',
    title: 'Deployment Tracker',
    short:
      'Employee deployment tracking system with secure data flow and analytics.',
    role: 'Frontend Engineer',
    company: 'Infosys',
    tags: ['Angular', 'Charts', 'Enterprise UI'],
    contributions: [
      'Built chart-driven dashboards for employee tracking.',
      'Ensured secure data flow and optimized UI performance.',
    ],
  },
  {
    id: 'timetable-system',
    title: 'Timetable Management System',
    short:
      'Smart scheduling system with drag-and-drop and conflict resolution.',
    tags: ['Angular', 'Drag & Drop', 'Validation'],
    contributions: [
      'Implemented smart scheduling with real-time conflict detection.',
      'Enabled drag-and-drop timetable management.',
    ],
  },
  {
    id: 'tractor-dealer',
    title: 'Tractor Dealer Platform',
    short:
      'Full-stack platform for second-hand tractor sales and document workflows.',
    tags: ['Angular', 'Node.js', 'MongoDB'],
    repo: 'https://github.com/RavirajPawar/tractor-dealer',
    caseStudy: '/project/tractor-dealer',
    contributions: [
      'Built a full-stack platform end-to-end for listing, browsing, and negotiating second-hand tractor sales.',
      'Designed dynamic, schema-driven forms and document management workflows for sale paperwork and verification.',
      'Improved sales productivity by 25% by replacing manual, paper-based coordination with a structured digital workflow.',
    ],
  },
  {
    id: 'water-do-analyser',
    title: 'Water DO Analyser',
    short:
      'IoT dashboard for monitoring water quality parameters in real time.',
    tags: ['Angular', 'Node.js', 'Arduino', 'MongoDB', 'IoT'],
    repo: 'https://github.com/ShubhamBanne19/waterParameters',
    contributions: [
      'Integrated Arduino sensors to capture water quality data.',
      'Designed real-time dashboards with charts and tables.',
    ],
  },
  {
    id: 'ai-emulator',
    title: 'AI Emulator Platform',
    short:
      'AI-powered productivity emulator for task automation, feedback analysis, and performance insights.',
    role: 'Full Stack Engineer',
    company: 'Infosys',
    tags: [
      'Angular',
      'Node.js',
      'AI Integration',
      'REST APIs',
      'Dashboards',
      'Automation',
    ],
    caseStudy: '/project/ai-emulator',
    contributions: [
      'Developed AI-driven dashboards for productivity tracking and workflow automation.',
      'Integrated intelligent feedback analysis and performance insights using REST services backed by an AI model.',
      'Optimized real-time UI updates using RxJS and efficient state handling so dashboards stayed responsive under frequent data pushes.',
      'Built scalable backend APIs in Node.js to support the automation pipelines driving the emulator.',
    ],
  },
  {
    id: 'rangoli-gamification',
    title: 'RangoliGamification',
    short:
      'Gamified Rangoli art practice with real-time biomechanics scoring, rendered on canvas.',
    tags: ['p5.js', 'Web Workers', 'Canvas', 'Creative Coding'],
    contributions: [
      'Built a p5.js canvas renderer that turns traditional Rangoli geometry into an interactive, gamified drawing experience.',
      'Implemented real-time biomechanics-based motion scoring, offloaded to Web Workers so scoring never blocks the drawing surface.',
      'Treated a piece of cultural heritage - symmetry and pattern in Rangoli art - as a medium for creative coding.',
    ],
  },
];
