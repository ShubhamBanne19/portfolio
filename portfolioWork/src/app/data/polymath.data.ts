/**
 * Data for the "Beyond the Code" interactive skills constellation.
 * Ported (content verbatim) from the original PolymathBrain.jsx prototype.
 */

export type DomainKey =
  | 'systems'
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'ai'
  | 'law'
  | 'art';

export interface DomainInfo {
  label: string;
  color: string;
}

export const DOMAINS: Record<DomainKey, DomainInfo> = {
  systems: { label: 'Mechanical & Systems', color: '#f59e0b' },
  frontend: { label: 'Frontend Engineering', color: '#3b82f6' },
  backend: { label: 'Backend & Data', color: '#10b981' },
  devops: { label: 'DevOps & Methodology', color: '#eab308' },
  ai: { label: 'AI & Prompting', color: '#06b6d4' },
  law: { label: 'Law & IP', color: '#a855f7' },
  art: { label: 'Art & Creative Coding', color: '#ec4899' },
};

export interface PolymathNode {
  id: string;
  label: string;
  domain: DomainKey;
  size: number;
  note: string;
}

export const POLYMATH_NODES: PolymathNode[] = [
  // Mechanical & Systems
  {
    id: 'mecheng',
    label: 'Mechanical Engineering',
    domain: 'systems',
    size: 3,
    note: 'B.Tech foundation. The habit of modeling forces, tolerances and failure modes carries into how you reason about software systems.',
  },
  {
    id: 'systems',
    label: 'Systems Thinking',
    domain: 'systems',
    size: 3,
    note: 'Auditing foundry maintenance systems trained you to see wholes, not parts - the same lens behind clean frontend architecture.',
  },
  {
    id: 'automation',
    label: 'Process Automation',
    domain: 'systems',
    size: 2,
    note: 'Automated foundry workflows and cut costs 20%. The instinct to remove manual toil is the seed of your CI/CD work.',
  },
  {
    id: 'foundry',
    label: 'Foundry / Plant Setup',
    domain: 'systems',
    size: 2,
    note: 'Led a new plant setup - greenfield systems design under real physical constraints.',
  },

  // Frontend
  {
    id: 'angular',
    label: 'Angular',
    domain: 'frontend',
    size: 4,
    note: 'Your center of gravity: years building multi-tier enterprise apps. Angular PWAs, Material, component architecture.',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    domain: 'frontend',
    size: 3,
    note: 'Types as contracts - a mechanical-engineering tolerance mindset applied to code.',
  },
  {
    id: 'rxjs',
    label: 'RxJS / Reactive Streams',
    domain: 'frontend',
    size: 3,
    note: 'Reactive dataflow is control-systems thinking in the browser: signals, feedback and backpressure.',
  },
  {
    id: 'css',
    label: 'HTML5 / CSS3 / SCSS',
    domain: 'frontend',
    size: 2,
    note: 'Accessible, responsive UIs at enterprise scale - craft plus validation discipline.',
  },
  {
    id: 'architecture',
    label: 'Frontend Architecture',
    domain: 'frontend',
    size: 3,
    note: 'Component libraries, state management, +30% UI reusability. Decomposition is a systems skill.',
  },

  // Backend & Data
  {
    id: 'node',
    label: 'Node.js / Express',
    domain: 'backend',
    size: 3,
    note: 'Full-stack backbone across Student CRM, Tractor-Dealer and tracker platforms.',
  },
  {
    id: 'sql',
    label: 'PostgreSQL (SQL)',
    domain: 'backend',
    size: 2,
    note: 'Relational modeling - structured, constraint-driven data, close to engineering rigor.',
  },
  {
    id: 'mongo',
    label: 'MongoDB',
    domain: 'backend',
    size: 2,
    note: 'Document store for flexible, evolving schemas in fast-moving projects.',
  },
  {
    id: 'apis',
    label: 'REST APIs / JWT Auth',
    domain: 'backend',
    size: 2,
    note: 'Secure, scalable end-to-end data flow - the plumbing between your tiers.',
  },

  // DevOps & Methodology
  {
    id: 'cicd',
    label: 'CI/CD (GitHub Actions)',
    domain: 'devops',
    size: 3,
    note: 'Pipelines are automated assembly lines - foundry process thinking, digitized.',
  },
  {
    id: 'git',
    label: 'Git / Bitbucket / Jenkins',
    domain: 'devops',
    size: 2,
    note: 'Version control and build tooling that keeps enterprise releases reliable.',
  },
  {
    id: 'agile',
    label: 'Agile / Scrum',
    domain: 'devops',
    size: 2,
    note: 'Iterative delivery - feedback loops that mirror reactive programming and control systems.',
  },
  {
    id: 'quality',
    label: 'Testing & Code Review',
    domain: 'devops',
    size: 2,
    note: 'Quality gates and debugging - the QA instinct of a maintenance auditor.',
  },

  // AI
  {
    id: 'claude',
    label: 'Claude API',
    domain: 'ai',
    size: 3,
    note: 'Integrating Anthropic Claude into products - AI as a first-class UX layer.',
  },
  {
    id: 'prompt',
    label: 'Prompt Engineering',
    domain: 'ai',
    size: 2,
    note: 'Designing instructions for a model is spec-writing - precise language as an interface.',
  },
  {
    id: 'aiux',
    label: 'AI-augmented UX',
    domain: 'ai',
    size: 2,
    note: 'Blending model outputs into interfaces so they feel native, not bolted on.',
  },

  // Law & IP
  {
    id: 'iplaw',
    label: 'Intellectual Property Law',
    domain: 'law',
    size: 3,
    note: 'PG Diploma, MNLU Mumbai. A rare lens: you can reason about ownership, licensing and originality of code and AI output.',
  },
  {
    id: 'licensing',
    label: 'Licensing & Ownership',
    domain: 'law',
    size: 2,
    note: 'Directly relevant to open-source usage and who owns AI-generated work.',
  },

  // Art & Creative Coding
  {
    id: 'rangoli',
    label: 'Rangoli Art',
    domain: 'art',
    size: 3,
    note: 'Traditional geometric art - cultural heritage encoded as symmetry and pattern.',
  },
  {
    id: 'p5',
    label: 'p5.js / Creative Coding',
    domain: 'art',
    size: 2,
    note: 'Canvas rendering for RangoliGamification - code as an artistic medium.',
  },
  {
    id: 'biomech',
    label: 'Biomechanics Scoring',
    domain: 'art',
    size: 2,
    note: 'Real-time motion scoring via Web Workers - mechanical engineering applied to an art form.',
  },
  {
    id: 'creative',
    label: 'Creative Catalyst',
    domain: 'art',
    size: 2,
    note: "Management award for innovative solutions - the polymath's signature move.",
  },
];

export interface PolymathLink {
  s: string;
  t: string;
  insight?: string;
}

export const POLYMATH_LINKS: PolymathLink[] = [
  // within Systems
  { s: 'mecheng', t: 'systems' },
  { s: 'systems', t: 'automation' },
  { s: 'automation', t: 'foundry' },
  { s: 'mecheng', t: 'foundry' },
  // within Frontend
  { s: 'angular', t: 'typescript' },
  { s: 'angular', t: 'rxjs' },
  { s: 'angular', t: 'css' },
  { s: 'angular', t: 'architecture' },
  { s: 'typescript', t: 'architecture' },
  // within Backend
  { s: 'node', t: 'sql' },
  { s: 'node', t: 'mongo' },
  { s: 'node', t: 'apis' },
  // within DevOps
  { s: 'cicd', t: 'git' },
  { s: 'cicd', t: 'agile' },
  { s: 'agile', t: 'quality' },
  { s: 'git', t: 'quality' },
  // within AI
  { s: 'claude', t: 'prompt' },
  { s: 'claude', t: 'aiux' },
  // within Law
  { s: 'iplaw', t: 'licensing' },
  // within Art
  { s: 'rangoli', t: 'p5' },
  { s: 'rangoli', t: 'biomech' },
  { s: 'p5', t: 'creative' },

  // ---- Cross-domain polymath connections ----
  {
    s: 'systems',
    t: 'architecture',
    insight:
      "Systems Thinking ⇄ Frontend Architecture: auditing a foundry's maintenance system and decomposing a UI into reusable components are the same discipline - reducing a complex whole into reliable, well-bounded parts.",
  },
  {
    s: 'automation',
    t: 'cicd',
    insight:
      'Process Automation ⇄ CI/CD: the instinct that automated foundry workflows and cut costs 20% is exactly what drives a good deployment pipeline - remove manual toil, make the assembly line self-running.',
  },
  {
    s: 'mecheng',
    t: 'biomech',
    insight:
      "Mechanical Engineering ⇄ Biomechanics Scoring: RangoliGamification's real-time motion scoring is mechanical motion analysis (forces, angles, timing) applied to a traditional art form.",
  },
  {
    s: 'rxjs',
    t: 'systems',
    insight:
      'RxJS ⇄ Systems Thinking: reactive streams are control systems in the browser - signals, feedback loops and backpressure, the same dynamics you model in physical plant.',
  },
  {
    s: 'iplaw',
    t: 'claude',
    insight:
      'IP Law ⇄ Claude API: a rare combination - you can build with generative AI while reasoning clearly about who owns the output and how licensing applies.',
  },
  {
    s: 'licensing',
    t: 'git',
    insight:
      'Licensing ⇄ Git/Open Source: your IP training turns everyday dependency and license choices into deliberate, defensible decisions instead of guesswork.',
  },
  {
    s: 'prompt',
    t: 'quality',
    insight:
      'Prompt Engineering ⇄ Testing & Code Review: writing a prompt is writing a spec - the same precision and edge-case thinking you apply in code review.',
  },
  {
    s: 'rangoli',
    t: 'iplaw',
    insight:
      'Rangoli ⇄ IP Law: traditional cultural art meets questions of originality and ownership - you sit exactly where heritage and intellectual property intersect.',
  },
  {
    s: 'biomech',
    t: 'rxjs',
    insight:
      'Biomechanics ⇄ RxJS: real-time gesture scoring is a reactive stream of sensor events - Web Workers feeding an observable pipeline.',
  },
  {
    s: 'p5',
    t: 'creative',
    insight:
      'Creative Coding ⇄ Creative Catalyst: your award for innovation is what happens when an engineer treats code as an artistic medium.',
  },
  {
    s: 'typescript',
    t: 'iplaw',
    insight:
      'TypeScript ⇄ IP Law: both are about precise contracts - types constrain code the way clauses constrain rights. You think in guarantees.',
  },
  {
    s: 'claude',
    t: 'aiux',
    insight:
      "Claude API ⇄ AI-augmented UX: you don't just call a model, you weave it into the interface so it feels native to the product.",
  },
  {
    s: 'architecture',
    t: 'node',
    insight:
      'Frontend Architecture ⇄ Node.js: full-stack fluency means one coherent design spanning both tiers of your enterprise apps.',
  },
];
