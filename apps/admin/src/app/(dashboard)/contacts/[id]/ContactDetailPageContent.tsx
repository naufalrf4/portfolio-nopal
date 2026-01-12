'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import Link from 'next/link';
import { ContactDetailView } from '@/features/contacts/components/ContactDetailView';
import type { ContactForm } from '@/features/contacts/types/contacts.types';

interface ContactDetailPageContentProps {
  contact: ContactForm;
}

export function ContactDetailPageContent({ contact }: ContactDetailPageContentProps) {
  return (
    <PageWrapper>
      <div className="mb-6">
        <Link href="/contacts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <ContactDetailView contact={contact} />
      </div>
    </PageWrapper>
  );
}
