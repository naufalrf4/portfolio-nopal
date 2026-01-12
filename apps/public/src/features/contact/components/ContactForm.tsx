'use client';

import React, { useState, useRef } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { NeuInput, NeuTextarea, NeuButton } from '@/src/features/shared/components';
import { api } from '@/src/lib/api';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    setTurnstileError(true);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus('error');
      setErrorMessage('Please complete the verification');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await api.contact.submit({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        turnstileToken: turnstileToken || '',
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeuInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
        <NeuInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
        />
      </div>

      <NeuInput
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="What's this about?"
        required
      />

      <NeuTextarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your message..."
        rows={5}
        required
      />

      {TURNSTILE_SITE_KEY && (
        <div className="flex justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={handleTurnstileSuccess}
            onError={handleTurnstileError}
            onExpire={handleTurnstileExpire}
            options={{
              theme: 'light',
            }}
          />
        </div>
      )}

      {turnstileError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
          <AlertCircle size={20} />
          <span>Verification failed. Please try again.</span>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl">
          <CheckCircle size={20} />
          <span>Message sent successfully! I&apos;ll get back to you soon.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <NeuButton type="submit" variant="accent" size="lg" isLoading={isLoading} className="w-full">
        <Send size={18} className="mr-2" />
        Send Message
      </NeuButton>
    </form>
  );
}
