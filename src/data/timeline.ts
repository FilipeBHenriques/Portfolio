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
    id: 'work-1',
    type: 'work',
    year: '2025',
    period: 'Jan 2025 – Present',
    title: 'Software Engineer',
    institution: 'Acme Corp',
    description: 'Building distributed backend services in Go and TypeScript. Owning the data pipeline architecture and reliability.',
    tags: ['Go', 'TypeScript', 'Kubernetes', 'PostgreSQL'],
    icon: 'briefcase',
  },
  {
    id: 'work-2',
    type: 'work',
    year: '2023',
    period: 'Jun 2023 – Dec 2024',
    title: 'Junior Software Engineer',
    institution: 'Startup XYZ',
    description: 'Full-stack development on a React + Node.js SaaS product. Shipped three major features from design to production.',
    tags: ['React', 'Node.js', 'TypeScript', 'AWS'],
    icon: 'briefcase',
  },
  {
    id: 'edu-1',
    type: 'education',
    year: '2021',
    period: 'Sep 2021 – Jun 2025',
    title: 'BSc Computer Science',
    institution: 'University of Lisbon',
    description: 'Focused on systems programming, algorithms, and distributed computing. Final project: a distributed key-value store in Go.',
    tags: ['C', 'Python', 'Algorithms', 'Networks'],
    icon: 'graduation',
  },
  {
    id: 'edu-2',
    type: 'education',
    year: '2018',
    period: '2018 – 2021',
    title: 'Secondary School — Science & Technology',
    institution: 'Escola Secundária de Lisboa',
    description: 'Specialisation in mathematics and physics. First contact with programming through Pascal and Python.',
    tags: ['Python', 'Mathematics', 'Physics'],
    icon: 'graduation',
  },
]
