import type { Metadata } from 'next';
import { AIChatPage } from './components';

export const metadata: Metadata = {
  title: 'AI Chatbot - NaufalRF',
  description:
    'An AI powered chatbot built by Naufal Rizqullah Firdaus to represent his portfolio, projects, automation skills, IoT experience, and solution engineering approach in an interactive format.',
  keywords: [
    'AI Chatbot Portfolio',
    'Automation Engineer AI',
    'Naufal Rizqullah Firdaus AI Assistant',
  ],
  openGraph: {
    title: 'NaufalRF AI Chatbot',
    description:
      'Interact with an AI assistant created by Naufal Rizqullah Firdaus to explore software projects, automation workflows, IoT systems, and solution architecture thinking.',
    type: 'website',
    url: 'https://naufalrf.tech/ai-chatbot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaufalRF AI Chatbot',
    description:
      'Interact with an AI assistant created by Naufal Rizqullah Firdaus to explore software projects, automation workflows, IoT systems, and solution architecture thinking.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/ai-chatbot',
  },
};

export default function AIChatbotPage() {
  return <AIChatPage />;
}
