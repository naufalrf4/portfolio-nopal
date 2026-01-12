'use client';

import { ImageUploader } from '@/components/upload/ImageUploader';
import { DraggableImageGrid } from '@/components/images/DraggableImageGrid';
import type { ProjectImage } from '../types';

interface ImageTabProps {
  projectId: string;
  images: ProjectImage[];
  onImageUpload: (url: string, key: string) => Promise<void>;
  onUpdate: () => void;
}

export function ImageTab({ projectId, images, onImageUpload, onUpdate }: ImageTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] p-6 bg-[#E0E5EC] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.4),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]">
        <h3 className="text-lg font-semibold text-[#3D4852] mb-4">Upload Images</h3>
        <ImageUploader folder="projects" onUpload={onImageUpload} multiple accept="image/*" />
        <p className="text-xs text-[#6B7280] mt-3">
          💡 First image will be used as thumbnail. Drag images to reorder.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#3D4852] mb-4">
          Project Images {images.length > 0 && `(${images.length})`}
        </h3>
        <DraggableImageGrid images={images} projectId={projectId} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
