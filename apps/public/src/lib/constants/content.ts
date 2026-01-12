export const GREETINGS = {
  en: "Hi, I'm",
  id: 'Halo, saya',
  ms: 'Hai, saya',
  de: 'Hallo, ich bin',
  nl: 'Hallo, ik ben',
  ja: 'こんにちは、私は',
  ko: '안녕하세요, 저는',
  pl: 'Cześć, jestem',
  cs: 'Ahoj, jsem',
  ro: 'Salut, sunt',
  tr: 'Merhaba, ben',
  fa: 'سلام، من',
  hi: 'नमस्ते, मैं',
  sw: 'Habari, mimi ni',
  zh: '你好，我是',
} as const;

export type LanguageCode = keyof typeof GREETINGS;

export const FAQS = [
  {
    id: '1',
    question: 'What services do you offer?',
    answer:
      'I specialize in full-stack web development, including frontend (React, Next.js), backend (Node.js, Python), cloud infrastructure (AWS, GCP), and AI/ML integrations.',
    category: 'general',
  },
  {
    id: '2',
    question: 'Are you available for freelance work?',
    answer:
      'Yes! I am open to freelance projects, consulting, and contract work. Feel free to reach out through the contact form or book a call to discuss your project.',
    category: 'general',
  },
  {
    id: '3',
    question: 'What is your typical project timeline?',
    answer:
      'Timelines vary based on project scope. Small projects typically take 2-4 weeks, medium projects 1-3 months, and larger enterprise solutions 3-6 months or more.',
    category: 'projects',
  },
  {
    id: '4',
    question: 'Do you provide ongoing maintenance and support?',
    answer:
      'Yes, I offer maintenance packages for projects I build. This includes bug fixes, security updates, performance optimization, and feature enhancements.',
    category: 'projects',
  },
  {
    id: '5',
    question: 'What technologies do you work with?',
    answer:
      'My primary stack includes TypeScript, React, Next.js, Node.js, PostgreSQL, and AWS. I also work with Python, Docker, Kubernetes, and various AI/ML tools.',
    category: 'technical',
  },
  {
    id: '6',
    question: 'Can you help with existing projects?',
    answer:
      'Absolutely! I can help with code reviews, performance optimization, refactoring, adding new features, or migrating to modern technologies.',
    category: 'technical',
  },
] as const;

export const SOCIAL_PLATFORMS = {
  github: { label: 'GitHub', color: '#333' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  twitter: { label: 'Twitter', color: '#1DA1F2' },
  instagram: { label: 'Instagram', color: '#E4405F' },
  youtube: { label: 'YouTube', color: '#FF0000' },
  email: { label: 'Email', color: '#EA4335' },
} as const;
