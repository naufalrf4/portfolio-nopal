import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { submitContactForm } from '@/lib/api';
import { getBrowserTimezone } from '@/lib/submission-context';
import { NeuButton } from '../shared/NeuButton';
import { NeuInput } from '../shared/NeuInput';
import { NeuTextarea } from '../shared/NeuTextarea';
import { TurnstileWidget } from '../shared/TurnstileWidget';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const hasTurnstile = useMemo(
    () => (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '').length > 0,
    []
  );
  const shouldShowTurnstile = useMemo(
    () =>
      Boolean(
        formData.name.trim() ||
        formData.email.trim() ||
        formData.subject.trim() ||
        formData.message.trim()
      ),
    [formData.email, formData.message, formData.name, formData.subject]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Please share your name.';
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Please share your email address.';
    } else if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) {
      nextErrors.subject = 'Please add a short subject.';
    }
    if (!formData.message.trim()) {
      nextErrors.message = 'Please add a message.';
    } else if (formData.message.trim().length < 20) {
      nextErrors.message = 'Please add a little more detail so I can respond well.';
    }

    if (hasTurnstile && !turnstileToken) {
      setSubmitError('Complete the CAPTCHA verification before sending your message.');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && (!hasTurnstile || Boolean(turnstileToken));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        turnstileToken: turnstileToken || undefined,
        timezone: getBrowserTimezone(),
      });

      setFormData(INITIAL_FORM);
      setErrors({});
      setSubmitSuccess('Message sent successfully. I will get back to you soon.');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send your message.');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <NeuInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          error={errors.name}
          disabled={isLoading}
          required
        />
        <NeuInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          error={errors.email}
          disabled={isLoading}
          required
        />
      </div>

      <NeuInput
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Project, collaboration, or role"
        error={errors.subject}
        disabled={isLoading}
        required
      />

      <NeuTextarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell me a bit about your project, timeline, or what kind of help you need."
        rows={6}
        error={errors.message}
        disabled={isLoading}
        required
      />

      {(!hasTurnstile || shouldShowTurnstile) && (
        <TurnstileWidget
          resetKey={turnstileResetKey}
          onTokenChange={setTurnstileToken}
          onErrorChange={setTurnstileError}
        />
      )}

      {turnstileError ? (
        <div className="flex items-center gap-2 rounded-[20px] border border-red-200 bg-red-50/80 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={16} />
          <span>{turnstileError}</span>
        </div>
      ) : null}

      {submitError ? (
        <div className="flex items-center gap-2 rounded-[20px] border border-red-200 bg-red-50/80 p-3 text-sm text-red-600 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={16} />
          <span>{submitError}</span>
        </div>
      ) : null}

      {submitSuccess ? (
        <div className="flex items-center gap-2 rounded-[20px] border border-emerald-200 bg-emerald-50/80 p-3 text-sm text-emerald-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} />
          <span>{submitSuccess}</span>
        </div>
      ) : null}

      <NeuButton
        type="submit"
        data-analytics-button
        data-entity-type="contact_submit"
        data-entity-id="contact-form"
        data-entity-label="Send contact message"
        variant="accent"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading || (hasTurnstile && !turnstileToken)}
        className="w-full"
      >
        <Send size={18} className="mr-2" />
        Send Message
      </NeuButton>
    </form>
  );
}
