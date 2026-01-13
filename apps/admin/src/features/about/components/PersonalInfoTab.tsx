'use client';

import { useState, useEffect } from 'react';
import { Loader2, Eye, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/upload/FileUpload';
import { useAbout } from '../hooks/useAbout';
import { cn } from '@/lib/utils';

export function PersonalInfoTab() {
  const { data, saving, updateAbout } = useAbout();

  const [fullName, setFullName] = useState('');
  const [tagline, setTagline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handlePreview = (url: string, type: 'image' | 'pdf') => {
    setPreviewUrl(url);
    setPreviewType(type);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  useEffect(() => {
    if (data) {
      setFullName(data.fullName || '');
      setTagline(data.tagline || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setLocation(data.location || '');
      setAvatarUrl(data.avatarUrl || '');
      setResumeUrl(data.resumeUrl || '');
      setHasUnsavedChanges(false);
    }
  }, [data]);

  const handleSave = async () => {
    if (!data) return;

    const bioString = data.bio
      ? typeof data.bio === 'string'
        ? data.bio
        : JSON.stringify(data.bio)
      : undefined;

    const success = await updateAbout({
      fullName,
      tagline: tagline || undefined,
      roles: data.roles || [],
      email,
      phone: phone || undefined,
      location: location || undefined,
      avatarUrl: avatarUrl || undefined,
      resumeUrl: resumeUrl || undefined,
      bio: bioString,
      skills: data.skills || [],
      experience: data.experience ?? undefined,
      socialLinks: data.socialLinks ?? undefined,
    });

    if (success) {
      setHasUnsavedChanges(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => {
                setTagline(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Full-Stack Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="San Francisco, CA"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Avatar</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <FileUpload
                  value={avatarUrl || null}
                  onChange={(url) => {
                    setAvatarUrl(url ?? '');
                    setHasUnsavedChanges(true);
                  }}
                  label=""
                  folder="about"
                  accept="image/jpeg,image/png,image/webp"
                  helperText=""
                />
              </div>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(avatarUrl, 'image')}
                  className="shrink-0"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Resume/CV</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <FileUpload
                  value={resumeUrl || null}
                  onChange={(url) => {
                    setResumeUrl(url ?? '');
                    setHasUnsavedChanges(true);
                  }}
                  label=""
                  folder="resumes"
                  accept="application/pdf"
                  helperText=""
                />
              </div>
              {resumeUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(resumeUrl, 'pdf')}
                  className="shrink-0"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 pt-4">
          {hasUnsavedChanges && !saving && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saving}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:bg-gray-300 disabled:text-gray-500"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Personal Info'}
          </Button>
        </div>
      </CardContent>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-[#E0E5EC] rounded-2xl shadow-[12px_12px_24px_rgba(163,177,198,0.7),-12px_-12px_24px_rgba(255,255,255,0.6)] max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#d1d5db]/50">
              <div className="flex items-center gap-2">
                {previewType === 'image' ? (
                  <ImageIcon className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                <span className="font-medium">Preview</span>
              </div>
              <Button variant="ghost" size="sm" onClick={closePreview}>
                Close
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              {previewType === 'image' ? (
                <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg" />
              ) : (
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh] rounded-lg"
                  title="PDF Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
