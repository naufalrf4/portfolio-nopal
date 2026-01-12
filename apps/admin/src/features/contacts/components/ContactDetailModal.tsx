'use client';

import {
  EyeOff,
  Trash2,
  MailOpen,
  Mail,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import type { ContactForm } from '../types/contacts.types';

interface ContactDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: ContactForm | null;
  loading?: boolean;
  onToggleRead: (contact: ContactForm) => void;
  onDelete: (contact: ContactForm) => void;
}

export function ContactDetailModal({
  open,
  onOpenChange,
  contact,
  loading = false,
  onToggleRead,
  onDelete,
}: ContactDetailModalProps) {
  const handleToggleRead = () => {
    if (contact) {
      onToggleRead(contact);
    }
  };

  const handleDelete = () => {
    if (contact) {
      onDelete(contact);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Contact Submission"
      description={contact ? `From ${contact.name}` : undefined}
      size="lg"
      footer={
        contact && (
          <>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handleToggleRead}>
              {contact.read ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mark Unread
                </>
              ) : (
                <>
                  <MailOpen className="h-4 w-4 mr-2" />
                  Mark Read
                </>
              )}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </>
        )
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-[#6B7280]">Loading...</div>
        </div>
      ) : contact ? (
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-2xl bg-[#E0E5EC]"
              style={{
                boxShadow:
                  'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-[#6B7280]" />
                <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Name
                </span>
              </div>
              <p className="text-[#3D4852] font-medium">{contact.name}</p>
            </div>

            <div
              className="p-4 rounded-2xl bg-[#E0E5EC]"
              style={{
                boxShadow:
                  'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-[#6B7280]" />
                <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Email
                </span>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="text-[#3B82F6] hover:underline font-medium"
              >
                {contact.email}
              </a>
            </div>
          </div>

          <div
            className="p-4 rounded-2xl bg-[#E0E5EC]"
            style={{
              boxShadow:
                'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-[#6B7280]" />
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Subject
              </span>
            </div>
            <p className="text-[#3D4852]">
              {contact.subject || <span className="italic text-[#6B7280]">No subject</span>}
            </p>
          </div>

          <div
            className="p-4 rounded-2xl bg-[#E0E5EC]"
            style={{
              boxShadow:
                'inset 3px 3px 6px rgba(163,177,198,0.4), inset -3px -3px 6px rgba(255,255,255,0.4)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-[#6B7280]" />
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Message
              </span>
            </div>
            <p className="text-[#3D4852] whitespace-pre-wrap">{contact.message}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#A3B1C6]/20">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div>
              {!contact.read ? (
                <Badge variant="warning">
                  <Circle className="h-3 w-3 fill-current" />
                  Unread
                </Badge>
              ) : contact.replied ? (
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3" />
                  Replied
                </Badge>
              ) : (
                <Badge variant="default">
                  <CheckCircle2 className="h-3 w-3" />
                  Read
                </Badge>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </ResponsiveModal>
  );
}
