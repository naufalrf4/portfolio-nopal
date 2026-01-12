export const personStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'NaufalRF',
  url: 'https://naufalrf.tech',
  jobTitle: 'Full-Stack Engineer',
  description: 'Full-Stack Engineer specializing in scalable web applications',
  sameAs: [
    'https://github.com/naufalrf',
    'https://linkedin.com/in/naufalrf',
    'https://twitter.com/naufalrf',
  ],
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Web Development',
    'Full-Stack Development',
  ],
};

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NaufalRF Portfolio',
  url: 'https://naufalrf.tech',
  description:
    'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications',
  author: {
    '@type': 'Person',
    name: 'NaufalRF',
  },
};
