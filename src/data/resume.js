/**
 * Single source of truth for the resume.
 *
 * Every bullet and project carries `tags` drawn from `TAGS` below — the filter
 * chips, the skill chips and the "where I used this" counts are all derived
 * from them, so adding a tag here is the only edit needed to wire it up.
 */

export const TAGS = {
  cloud: { label: 'Cloud & AWS', color: 'amber' },
  frontend: { label: 'Frontend', color: 'cyan' },
  backend: { label: 'Backend', color: 'violet' },
  mobile: { label: 'Mobile', color: 'rose' },
  devops: { label: 'DevOps', color: 'emerald' },
  leadership: { label: 'Leadership', color: 'blue' },
  infra: { label: 'Infrastructure', color: 'slate' },
}

// LinkedIn is the only contact channel exposed publicly — no email, phone or
// home location anywhere on the site.
export const profile = {
  name: 'Danny McPeak Jr.',
  title: 'Lead Full Stack Developer',
  linkedin: 'linkedin.com/in/dannymcpeakjr',
  linkedinUrl: 'https://linkedin.com/in/dannymcpeakjr',
  summary:
    'Innovative and passionate Full Stack Developer with a strong foundation in modern web technologies and cloud infrastructure. Demonstrated expertise in developing scalable applications, integrating complex systems, and delivering user-centric solutions.',
}

const CAREER_START = 2013

/** Headline numbers, ordered by magnitude, each pulled from a bullet below. */
export const stats = [
  {
    value: new Date().getFullYear() - CAREER_START,
    suffix: '+',
    label: 'Years in tech',
  },
  { value: 1000000, suffix: 's', label: 'Social posts automated' },
  { value: 20000, suffix: '+', label: 'Agent records piped daily' },
  { value: 10000, suffix: '+', label: 'SaaS members added' },
  { value: 2000, suffix: '+', label: 'Devices under automated patching' },
  { value: 200, suffix: '+', label: 'Retail stores served by VDI pool' },
]

export const skills = [
  {
    group: 'Languages & Frameworks',
    items: [
      { name: 'JavaScript', tag: 'frontend' },
      { name: 'Vue.js', tag: 'frontend' },
      { name: 'HTML', tag: 'frontend' },
      { name: 'CSS', tag: 'frontend' },
      { name: 'GoLang', tag: 'backend' },
      { name: 'Ionic', tag: 'mobile' },
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: [
      { name: 'AWS S3', tag: 'cloud' },
      { name: 'AWS Lambda', tag: 'cloud' },
      { name: 'AWS ECS', tag: 'cloud' },
      { name: 'AWS RDS', tag: 'cloud' },
      { name: 'AWS Kinesis', tag: 'cloud' },
      { name: 'AWS DynamoDB', tag: 'cloud' },
      { name: 'Docker', tag: 'devops' },
      { name: 'CI/CD pipelines', tag: 'devops' },
    ],
  },
  {
    group: 'Data',
    items: [
      { name: 'MySQL', tag: 'backend' },
      { name: 'NoSQL', tag: 'backend' },
    ],
  },
  {
    group: 'Mobile & Tools',
    items: [
      { name: 'Native Android', tag: 'mobile' },
      { name: 'Native iOS', tag: 'mobile' },
      { name: 'Capacitor', tag: 'mobile' },
      { name: 'Git', tag: 'devops' },
    ],
  },
]

export const experience = [
  {
    id: 'capital-one',
    company: 'Capital One',
    location: 'Richmond, VA',
    site: 'capitalone.com',
    url: 'https://capitalone.com',
    start: '2025-08',
    end: null,
    current: true,
    roles: [{ title: 'Lead Full Stack Developer', period: 'August 2025 – Present' }],
    highlights: [
      {
        text: 'Implemented and managed cloud-based solutions using AWS services including S3, Lambda, Kinesis and DynamoDB.',
        tags: ['cloud'],
      },
      {
        text: 'Designed an AWS Step Function to send HR location data for 20,000+ agents from internal database tables to an external Workforce Management API.',
        tags: ['cloud', 'backend'],
        metric: '20,000+ agents',
      },
      {
        text: 'Built the integration between Discover phone agents and Capital One agent systems.',
        tags: ['backend'],
      },
      {
        text: 'Maintained vendor relationships with a workforce management suite, including updates to the SSO connection and supporting data pipelines.',
        tags: ['leadership', 'backend', 'infra'],
      },
    ],
    projects: [
      {
        name: 'Voyant — schedule planning & bidding',
        detail:
          'Added features to the agent schedule planning and bidding application in the Voyant suite.',
        tags: ['frontend', 'backend'],
      },
      {
        name: 'Voyant — agent leveling',
        detail:
          'Built out an agent leveling application, replacing a manual spreadsheet process.',
        tags: ['frontend', 'backend'],
      },
    ],
  },
  {
    id: 'kcm',
    company: 'Keeping Current Matters',
    location: 'Richmond, VA',
    site: 'keepingcurrentmatters.com',
    url: 'https://keepingcurrentmatters.com',
    start: '2019-09',
    end: '2025-08',
    current: false,
    roles: [
      { title: 'Sr. Full Stack Developer', period: 'July 2022 – August 2025' },
      { title: 'Full Stack Developer', period: 'September 2019 – July 2022' },
    ],
    highlights: [
      {
        text: 'Developed and maintained full-stack applications supporting real estate professionals.',
        tags: ['frontend', 'backend'],
      },
      {
        text: 'Helped manage the technical side of membership growth from 18,000 to 32,000 at peak.',
        tags: ['leadership', 'backend'],
        metric: '18,000 → 32,000 members',
      },
      {
        text: 'Implemented cloud-based solutions using AWS services like S3 and Lambda.',
        tags: ['cloud'],
      },
      {
        text: 'Used Docker for containerization, keeping development and deployment environments consistent.',
        tags: ['devops'],
      },
      {
        text: 'Collaborated with cross-functional teams to deliver high-quality, user-friendly platforms.',
        tags: ['leadership'],
      },
      { text: 'Managed direct reports.', tags: ['leadership'] },
      {
        text: 'Participated in all phases of product development, from planning to release.',
        tags: ['leadership'],
      },
      {
        text: 'Assisted developers in finding efficient, scalable solutions.',
        tags: ['leadership'],
      },
    ],
    projects: [
      {
        name: 'WordPress → Vue + Go replatform',
        detail:
          'Moved the flagship platform off WordPress/PHP onto a Vue.js front end backed by a GoLang service layer.',
        tags: ['frontend', 'backend'],
      },
      {
        name: 'Video transcription & dynamic captions',
        detail:
          'Transcription pipeline for member-recorded video, plus a front-end timeline and caption editor.',
        tags: ['frontend', 'cloud'],
      },
      {
        name: 'Cross-platform Ionic app',
        detail:
          'Shipped to Android and iOS, including a custom Capacitor plugin for recording video with overlays on both platforms.',
        tags: ['mobile', 'frontend'],
      },
      {
        name: 'Internal customer management tools',
        detail: 'Tooling for the team to manage customers and accounts directly.',
        tags: ['frontend', 'backend'],
      },
      {
        name: 'Social autoposting application',
        detail:
          'Scheduled and published social content on behalf of members, automating millions of posts.',
        tags: ['frontend', 'backend'],
      },
      {
        name: 'Custom email builder',
        detail: 'Email composition tool that pulls live content from the platform.',
        tags: ['frontend'],
      },
    ],
  },
  {
    id: 'southern-states',
    company: 'Southern States Cooperative',
    location: 'Richmond, VA',
    site: null,
    url: null,
    start: '2013-08',
    end: '2019-09',
    current: false,
    roles: [
      {
        title: 'Infrastructure Support Specialist',
        period: 'September 2016 – September 2019',
      },
      { title: 'IS Operator', period: 'August 2013 – September 2016' },
    ],
    highlights: [
      {
        text: 'Installed, configured, tested, maintained and troubleshot end-user software.',
        tags: ['infra'],
      },
      {
        text: 'Helped develop long-term strategy for future hardware and technology needs.',
        tags: ['infra', 'leadership'],
      },
      {
        text: 'Researched hardware and software to justify purchasing recommendations.',
        tags: ['infra'],
      },
      {
        text: 'Maintained documentation and procedures for supported components.',
        tags: ['infra'],
      },
      {
        text: 'Applied Windows updates to workstations and servers across multiple platforms with SCCM.',
        tags: ['infra', 'devops'],
      },
      {
        text: 'Built and managed department images containing up-to-date programs and patches.',
        tags: ['infra'],
      },
    ],
    projects: [
      {
        name: 'Monthly server patching program',
        detail:
          'Planned, launched and maintained monthly Windows server patching for 100+ servers using Languard.',
        tags: ['infra', 'devops'],
      },
      {
        name: 'Automated fleet patching',
        detail:
          'Built automatic monthly patching for 2,000+ laptops, desktops and mobile tablets using SCCM.',
        tags: ['infra', 'devops'],
      },
      {
        name: 'VMware instant-clone VDI pool',
        detail:
          'Built, deployed and maintained an instant-clone pool stacked with AppVolumes and VMware UEM, distributed to 200+ stores and able to run over a T1 connection.',
        tags: ['infra'],
      },
    ],
  },
]

export const education = [
  {
    school: 'Virginia Commonwealth University',
    location: 'Richmond, VA',
    credential: "Bachelor's degree, Computer Science",
    period: '2017 – 2022',
  },
  {
    school: 'J. Sargeant Reynolds Community College',
    location: 'Richmond, VA',
    credential: 'Associate of Science, Computer Science',
    period: '2014 – 2016',
  },
]

export const certifications = [
  {
    name: 'AWS Certified Solutions Architect – Associate',
    code: 'SAA-C03',
    date: 'April 2026',
    featured: true,
  },
  { name: 'ITIL Foundation Certification', date: 'June 2017' },
]

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]
