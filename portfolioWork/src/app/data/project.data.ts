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
    short: 'Enterprise student management system with role-based access and live analytics.',
    role: 'Frontend Engineer',
    company: 'Infosys',
    tags: ['Angular', 'Node.js', 'PostgreSQL', 'RBAC', 'Dashboards'],
    contributions: [
      'Developed end-to-end student management workflows.',
      'Implemented role-based access control and live analytics dashboards.'
    ]
  },
  {
    id: 'deployment-tracker',
    title: 'Deployment Tracker',
    short: 'Employee deployment tracking system with secure data flow and analytics.',
    role: 'Frontend Engineer',
    company: 'Infosys',
    tags: ['Angular', 'Charts', 'Enterprise UI'],
    contributions: [
      'Built chart-driven dashboards for employee tracking.',
      'Ensured secure data flow and optimized UI performance.'
    ]
  },
  {
    id: 'timetable-system',
    title: 'Timetable Management System',
    short: 'Smart scheduling system with drag-and-drop and conflict resolution.',
    tags: ['Angular', 'Drag & Drop', 'Validation'],
    contributions: [
      'Implemented smart scheduling with real-time conflict detection.',
      'Enabled drag-and-drop timetable management.'
    ]
  },
  {
    id: 'tractor-dealer',
    title: 'Tractor Dealer Platform',
    short: 'Full-stack platform for second-hand tractor sales and document workflows.',
    tags: ['Angular', 'Node.js', 'MongoDB'],
    repo: 'https://github.com/RavirajPawar/tractor-dealer',
    contributions: [
      'Built full-stack application improving sales productivity by 25%.',
      'Created dynamic forms and document management workflows.'
    ]
  },
  {
    id: 'water-do-analyser',
    title: 'Water DO Analyser',
    short: 'IoT dashboard for monitoring water quality parameters in real time.',
    tags: ['Angular', 'Node.js', 'Arduino', 'MongoDB', 'IoT'],
    repo: 'https://github.com/ShubhamBanne19/waterParameters',
    contributions: [
      'Integrated Arduino sensors to capture water quality data.',
      'Designed real-time dashboards with charts and tables.'
    ]
  }
];
