'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/upload';

export function FileUploadExample() {
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [resume, setResume] = useState<string | null>(null);

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">FileUpload Component Examples</h2>
        <p className="text-[var(--text-secondary)] mb-8">
          Upload files to R2/S3 or enter direct URLs. Both options are available in each upload
          field.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <FileUpload
            value={projectImage}
            onChange={setProjectImage}
            label="Project Image"
            folder="projects"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            helperText="Upload an image or enter a direct URL (max 10MB)"
          />
          {projectImage && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              ✓ Image URL set: {projectImage}
            </div>
          )}
        </div>

        <div>
          <FileUpload
            value={resume}
            onChange={setResume}
            label="Resume (PDF)"
            folder="resumes"
            accept="application/pdf"
            helperText="Upload your resume in PDF format or enter a URL"
          />
          {resume && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              ✓ Resume URL set: {resume}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
