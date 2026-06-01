export interface TimelineEvent {
  id: string
  type: 'education' | 'work'
  year: string
  period: string
  title: string
  institution: string
  description: string
  tags: string[]
  icon: 'graduation' | 'briefcase'
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'work-yelhow',
    type: 'work',
    year: '2024',
    period: 'Dec 2024 – Present',
    title: 'AI Engineer',
    institution: 'Yelhow',
    description: 'Building React Native applications for factory management and scheduling. Developing AI-powered solutions for workforce skill management, personnel allocation, and adaptive scheduling.',
    tags: ['React Native', 'TypeScript', 'AI', 'AWS'],
    icon: 'briefcase',
  },
  {
    id: 'work-outsystems',
    type: 'work',
    year: '2023',
    period: 'Aug 2023 – Oct 2024',
    title: 'AI Researcher Intern',
    institution: 'OutSystems',
    description: 'Researched ML techniques for data analysis and process optimization. Built an LLM-powered SQL query optimization tool as the master\'s thesis — analyzed query patterns and automated enhancements, achieving faster execution and lower resource usage.',
    tags: ['Python', 'LLMs', 'SQL', 'Machine Learning'],
    icon: 'briefcase',
  },
  {
    id: 'edu-masters',
    type: 'education',
    year: '2022',
    period: 'Aug 2022 – Oct 2024',
    title: 'MSc Computer Science — AI Minor',
    institution: 'Instituto Superior Técnico',
    description: 'Masters in Computer Science with an AI minor. Thesis on LLM-based SQL query optimization, developed during internship at OutSystems.',
    tags: ['Machine Learning', 'LLMs', 'Algorithms', 'AI'],
    icon: 'graduation',
  },
  {
    id: 'edu-bachelor',
    type: 'education',
    year: '2019',
    period: 'Aug 2019 – Jul 2022',
    title: 'BSc Computer Science',
    institution: 'Instituto Superior Técnico',
    description: 'Bachelor in Computer Science. Covered systems programming, algorithms, networks, AI, and software engineering fundamentals.',
    tags: ['C', 'Python', 'Java', 'Algorithms', 'Networks'],
    icon: 'graduation',
  },
  {
    id: 'work-hovione',
    type: 'work',
    year: '2019',
    period: 'Jun 2019 – Jul 2019',
    title: 'Automation Intern',
    institution: 'Hovione',
    description: 'Supported maintenance of automated industrial systems through routine checks and troubleshooting. Collaborated with the automation team to ensure system reliability and operational efficiency.',
    tags: ['Automation', 'Systems'],
    icon: 'briefcase',
  },
  {
    id: 'edu-english',
    type: 'education',
    year: '2018',
    period: 'Jul 2018 – Aug 2018',
    title: 'Intensive English Program',
    institution: 'Education First',
    description: 'Overseas intensive English language program in Bournemouth, United Kingdom.',
    tags: ['English', 'Communication'],
    icon: 'graduation',
  },
]
