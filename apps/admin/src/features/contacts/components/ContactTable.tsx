'use client';

import { Eye, EyeOff, Trash2, MailOpen, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ContactForm } from '../types/contacts.types';

interface ContactTableProps {
  contacts: ContactForm[];
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  onView: (id: string) => void;
  onToggleRead: (contact: ContactForm) => void;
  onDelete: (contact: ContactForm) => void;
}

export function ContactTable({
  contacts,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onView,
  onToggleRead,
  onDelete,
}: ContactTableProps) {
  const isAllSelected = selectedIds.size === contacts.length && contacts.length > 0;

  return (
    <div
      className="rounded-[32px] overflow-hidden bg-[#E0E5EC]"
      style={{
        boxShadow:
          '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#A3B1C6]/20">
              <th className="px-6 py-4 text-left">
                <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#3D4852]">Date</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-[#3D4852]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <TooltipProvider key={contact.id}>
                <tr
                  className={cn(
                    'border-b border-[#A3B1C6]/10 last:border-0 cursor-pointer transition-colors',
                    !contact.read && 'bg-[#3B82F6]/5'
                  )}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button, input')) return;
                    onView(contact.id);
                  }}
                >
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedIds.has(contact.id)}
                      onCheckedChange={() => onSelectOne(contact.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={cn('font-medium text-[#3D4852]', !contact.read && 'font-semibold')}
                    >
                      {contact.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{contact.email}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#3D4852] line-clamp-1">
                      {contact.subject || <span className="italic text-[#6B7280]">No subject</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">
                    {new Date(contact.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(contact.id);
                            }}
                            className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6] transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>View</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleRead(contact);
                            }}
                            className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#38B2AC] transition-colors"
                          >
                            {contact.read ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <MailOpen className="h-4 w-4" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {contact.read ? 'Mark as unread' : 'Mark as read'}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(contact);
                            }}
                            className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              </TooltipProvider>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
