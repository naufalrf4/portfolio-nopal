export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NaufalRF Portfolio',
  url: 'https://naufalrf.tech',
  description:
    'The personal portfolio of Naufal Rizqullah Firdaus featuring full stack development, automation engineering, IoT integration, and real world digital solutions designed for scalability and usability.',
  author: {
    '@type': 'Person',
    name: 'Naufal Rizqullah Firdaus',
    alternateName: 'NaufalRF',
  },
};

export const personStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Naufal Rizqullah Firdaus',
  alternateName: 'NaufalRF',
  url: 'https://naufalrf.tech',
  jobTitle: [
    'Software Engineer',
    'Full Stack Developer',
    'Automation Engineer',
    'IoT Integration Engineer',
    'Solution Engineer',
    'Solution Architect (Junior Level)',
  ],
  description:
    'Software engineer focused on full stack development, automation, IoT integration, and solution oriented engineering.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Depok',
    addressRegion: 'West Java',
    addressCountry: 'ID',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Open to opportunities',
  },
  sameAs: [
    'https://github.com/naufalrf',
    'https://linkedin.com/in/naufalrf',
  ],
};
