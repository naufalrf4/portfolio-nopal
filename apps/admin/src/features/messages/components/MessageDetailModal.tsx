'use client';

import { useState } from 'react';
import { Mail, MailOpen, Trash2, Instagram, Download, Shield, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils/date';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { AnonymousMessage } from '../types/messages.types';
import { downloadMessageImage, shareToInstagramStory } from '../utils';

interface MessageDetailModalProps {
  message: AnonymousMessage | null;
  onClose: () => void;
  onToggleRead: (id: string, read: boolean) => void;
  onDelete: (id: string) => void;
}

export function MessageDetailModal({
  message,
  onClose,
  onToggleRead,
  onDelete,
}: MessageDetailModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleRead = () => {
    if (message) {
      onToggleRead(message.id, message.read);
    }
  };

  const handleDelete = () => {
    if (message) {
      onClose();
      onDelete(message.id);
    }
  };

  const handleDownload = async () => {
    if (!message) return;

    setIsGenerating(true);
    const toastId = toast.loading('Generating image...');

    try {
      await downloadMessageImage(message, (progress) => {
        if (progress === 100) {
          toast.success('Image downloaded successfully!', { id: toastId });
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to download: ${errorMessage}`, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!message) return;

    setIsGenerating(true);
    const toastId = toast.loading('Generating image...');

    try {
      await shareToInstagramStory(message, (progress) => {
        if (progress === 100) {
          toast.success('Opening share dialog...', { id: toastId });
        }
      });
    } catch (error) {
      toast.dismiss(toastId);
      if (error instanceof Error && error.message.includes('Web Share API not supported')) {
        toast.info('Share not supported. Downloading instead...');
        await handleDownload();
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to share: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ResponsiveModal
      open={!!message}
      onOpenChange={(open) => !open && onClose()}
      title="Anonymous Message"
      description={message ? `Received ${formatDateTime(message.createdAt)}` : undefined}
      size="lg"
      footer={
        message && (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={isGenerating}
                className="flex-1 sm:flex-auto"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 sm:mr-2 text-[#3B82F6]" />
                ) : (
                  <Instagram className="h-4 w-4 sm:mr-2 text-[#3B82F6]" />
                )}
                <span className="hidden sm:inline">Instagram</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 sm:flex-auto"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 sm:mr-2 text-[#3B82F6]" />
                ) : (
                  <Download className="h-4 w-4 sm:mr-2 text-[#3B82F6]" />
                )}
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
            <div className="flex gap-2 flex-1 justify-end">
              <Button variant="outline" onClick={handleToggleRead} className="flex-1 sm:flex-auto">
                {message.read ? (
                  <>
                    <Mail className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Mark Unread</span>
                  </>
                ) : (
                  <>
                    <MailOpen className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Mark Read</span>
                  </>
                )}
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="flex-1 sm:flex-auto">
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        )
      }
    >
      {message && (
        <div className="space-y-4">
          <div className="neu-inset rounded-2xl p-4 sm:p-6 bg-[#E0E5EC]">
            <p className="text-base sm:text-lg text-[#3D4852] whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#6B7280]" />
              <h5 className="text-xs sm:text-sm font-semibold text-[#3D4852]">
                Security Information
              </h5>
            </div>
            <div className="neu-inset rounded-xl p-3 sm:p-4 bg-[#E0E5EC]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-xs sm:text-sm text-[#6B7280]">IP Hash:</span>
                  <code className="text-xs font-mono bg-[#d4dce6] px-2 py-1 rounded text-[#3D4852] break-all">
                    ...{message.ipHash.substring(message.ipHash.length - 12)}
                  </code>
                </div>
                <Separator className="bg-[#d4dce6]" />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-[#6B7280]">Status:</span>
                  <Badge variant={message.read ? 'outline' : 'default'} className="text-xs">
                    {message.read ? 'Read' : 'Unread'}
                  </Badge>
                </div>
                <Separator className="bg-[#d4dce6]" />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm text-[#6B7280]">Received:</span>
                  <span className="text-xs sm:text-sm text-[#3D4852] font-medium">
                    {formatDateTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {message.country && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#6B7280]" />
                <h5 className="text-xs sm:text-sm font-semibold text-[#3D4852]">Location</h5>
              </div>
              <div className="neu-extruded rounded-xl p-3 sm:p-4 bg-[#E0E5EC]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center neu-inset bg-[#E0E5EC]">
                    {message.countryCode && (
                      <span className="text-2xl">
                        {message.countryCode === 'US'
                          ? '🇺🇸'
                          : message.countryCode === 'GB'
                            ? '🇬🇧'
                            : message.countryCode === 'ID'
                              ? '🇮🇩'
                              : message.countryCode === 'AU'
                                ? '🇦🇺'
                                : message.countryCode === 'CA'
                                  ? '🇨🇦'
                                  : message.countryCode === 'DE'
                                    ? '🇩🇪'
                                    : message.countryCode === 'FR'
                                      ? '🇫🇷'
                                      : message.countryCode === 'JP'
                                        ? '🇯🇵'
                                        : message.countryCode === 'KR'
                                          ? '🇰🇷'
                                          : message.countryCode === 'CN'
                                            ? '🇨🇳'
                                            : message.countryCode === 'BR'
                                              ? '🇧🇷'
                                              : message.countryCode === 'IN'
                                                ? '🇮🇳'
                                                : message.countryCode === 'MY'
                                                  ? '🇲🇾'
                                                  : message.countryCode === 'SG'
                                                    ? '🇸🇬'
                                                    : message.countryCode === 'NL'
                                                      ? '🇳🇱'
                                                      : message.countryCode === 'ES'
                                                        ? '🇪🇸'
                                                        : message.countryCode === 'IT'
                                                          ? '🇮🇹'
                                                          : message.countryCode === 'RU'
                                                            ? '🇷🇺'
                                                            : message.countryCode === 'MX'
                                                              ? '🇲🇽'
                                                              : message.countryCode === 'ZA'
                                                                ? '🇿🇦'
                                                                : message.countryCode === 'PH'
                                                                  ? '🇵🇭'
                                                                  : message.countryCode === 'VN'
                                                                    ? '🇻🇳'
                                                                    : message.countryCode === 'TH'
                                                                      ? '🇹🇭'
                                                                      : message.countryCode === 'NZ'
                                                                        ? '🇳🇿'
                                                                        : '🌍'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-[#3D4852]">
                        {message.country}
                      </span>
                      {message.city && (
                        <span className="text-sm text-[#6B7280]">
                          {message.city}
                          {message.region && `, ${message.region}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-[#6B7280]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ResponsiveModal>
  );
}
