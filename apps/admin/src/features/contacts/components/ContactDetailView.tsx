import { CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContactForm } from '../types/contacts.types';
import { ContactInfoSection } from './ContactInfoSection';
import { ContactActions } from '@/app/(dashboard)/contacts/[id]/ContactActions';

interface ContactDetailViewProps {
  contact: ContactForm;
}

export function ContactDetailView({ contact }: ContactDetailViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{contact.subject || 'Contact Form Submission'}</CardTitle>
            <CardDescription>From {contact.name}</CardDescription>
          </div>
          <CardAction>
            <div className="flex items-center gap-2">
              {contact.replied ? (
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3" />
                  Replied
                </Badge>
              ) : contact.read ? (
                <Badge variant="default">Read</Badge>
              ) : (
                <Badge variant="warning">Unread</Badge>
              )}
            </div>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ContactInfoSection
            email={contact.email}
            createdAt={contact.createdAt}
            ipHash={contact.ipHash}
          />

          <div className="pt-4 border-t border-[#A3B1C6]/20">
            <h3 className="text-sm font-semibold text-[#3D4852] mb-3">Message</h3>
            <div
              className="p-4 rounded-2xl bg-[#E0E5EC] text-[#3D4852] whitespace-pre-wrap"
              style={{
                boxShadow:
                  'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
              }}
            >
              {contact.message}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <ContactActions contactId={contact.id} replied={contact.replied} />
      </CardFooter>
    </Card>
  );
}
