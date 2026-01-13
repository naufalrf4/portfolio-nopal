import type { Metadata } from 'next';
import { AIChatPage } from './components';

export const metadata: Metadata = {
  title: 'AI Chatbot',
  description:
    'Chat with an AI assistant to learn more about my projects, experience, and skills. Ask anything about my work!',
  openGraph: {
    title: 'AI Chatbot | NaufalRF',
    description:
      'Chat with an AI assistant to learn more about my projects, experience, and skills.',
    type: 'website',
    url: 'https://naufalrf.tech/ai-chatbot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot | NaufalRF',
    description:
      'Chat with an AI assistant to learn more about my projects, experience, and skills.',
  },
  alternates: {
    canonical: 'https://naufalrf.tech/ai-chatbot',
  },
};

export default function AIChatbotPage() {
  return <AIChatPage />;
}
