'use client';

import { Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import type { ProjectEdit } from '../types';

interface ContentTabProps {
  content: string;
  onContentChange: (content: string) => void;
  saving: boolean;
  debouncedContent: string;
  project: ProjectEdit | null;
}

export function ContentTab({
  content,
  onContentChange,
  saving,
  debouncedContent,
  project,
}: ContentTabProps) {
  return (
    <div className="rounded-[32px] p-6 bg-[#E0E5EC] shadow-[inset_6px_6px_12px_rgba(163,177,198,0.4),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#3D4852]">Rich Content Editor</h3>
        {saving && (
          <span className="text-sm text-[#6B7280] flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        )}
        {!saving && debouncedContent === content && content !== (project?.content || '') && (
          <span className="text-sm text-green-600">Saved</span>
        )}
      </div>
      <RichTextEditor
        content={content}
        onChange={onContentChange}
        placeholder="Write your project details here..."
      />
      <p className="text-xs text-[#6B7280] mt-3">
        💡 Content auto-saves as you type. Use the toolbar for rich formatting.
      </p>
    </div>
  );
}
