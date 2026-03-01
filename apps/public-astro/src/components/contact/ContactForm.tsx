import React, { useState } from 'react';
import { NeuInput } from '../shared/NeuInput';
import { NeuTextarea } from '../shared/NeuTextarea';
import { NeuButton } from '../shared/NeuButton';
import { Send, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Phase 2: Form submission disabled
  const isLoading = false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 2: Form submission disabled
    return;
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

      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-xl">
        <AlertCircle size={20} />
        <span>
          Contact form is temporarily disabled during migration. Please reach out via social media.
        </span>
      </div>

      <NeuButton
        type="submit"
        variant="accent"
        size="lg"
        isLoading={isLoading}
        disabled={true}
        className="w-full"
      >
        <Send size={18} className="mr-2" />
        Send Message
      </NeuButton>
    </form>
  );
}
