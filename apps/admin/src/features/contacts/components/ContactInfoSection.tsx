import { Mail, Calendar, Hash } from 'lucide-react';

interface ContactInfoSectionProps {
  email: string;
  createdAt: string;
  ipHash: string;
}

export function ContactInfoSection({ email, createdAt, ipHash }: ContactInfoSectionProps) {
  const formattedDate = new Date(createdAt).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Mail className="h-4 w-4" />
            <span className="font-medium">Email</span>
          </div>
          <a href={`mailto:${email}`} className="text-[#3B82F6] hover:underline block">
            {email}
          </a>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Received</span>
          </div>
          <p className="text-[#3D4852]">{formattedDate}</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Hash className="h-4 w-4" />
          <span className="font-medium">IP Hash</span>
        </div>
        <p className="text-[#6B7280] text-sm font-mono">{ipHash}</p>
      </div>
    </div>
  );
}
