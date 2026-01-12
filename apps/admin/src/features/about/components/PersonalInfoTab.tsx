'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/upload/FileUpload';
import { useAbout } from '../hooks/useAbout';

export function PersonalInfoTab() {
  const { data, saving, updateAbout } = useAbout();

  const [fullName, setFullName] = useState('');
  const [tagline, setTagline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
            <FileUpload
              value={avatarUrl || null}
              onChange={(url) => {
                setAvatarUrl(url ?? '');
                setHasUnsavedChanges(true);
              }}
              label="Avatar"
              folder="about"
              accept="image/jpeg,image/png,image/webp"
              helperText="Upload your profile photo (JPG, PNG, WebP). Recommended: 400x400px"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <FileUpload
              value={resumeUrl || null}
              onChange={(url) => {
                setResumeUrl(url ?? '');
                setHasUnsavedChanges(true);
              }}
              label="Resume/CV"
              folder="resumes"
              accept="application/pdf"
              helperText="Upload your resume in PDF format"
            />
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
    </Card>
  );
}
