'use client';

import { useState, useRef } from 'react';
import { FileText, Upload, File, AlertCircle, Loader2 } from 'lucide-react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type InputMode = 'manual' | 'upload';

const neumorphicInset =
  'shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]';

export function KnowledgeModal({ isOpen, onClose, onSuccess }: KnowledgeModalProps) {
  const [activeTab, setActiveTab] = useState<InputMode>('manual');
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFilename('');
    setContent('');
    setFile(null);
    setError('');
    setActiveTab('manual');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'manual') {
      if (!filename.trim() || !content.trim()) {
        setError('Filename and content are required');
        return;
      }
    } else {
      if (!file) {
        setError('Please select a file');
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      if (activeTab === 'manual') {
        formData.append('filename', filename.trim());
        formData.append('content', content.trim());
      } else if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/v1/admin/knowledge', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        handleClose();
        onSuccess();
      } else {
        setError(data.error?.message || 'Failed to create document');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!filename) {
        setFilename(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!filename) {
        setFilename(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const footer = (
    <>
      <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        type="submit"
        form="knowledge-form"
        disabled={isLoading}
        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Create Document
      </Button>
    </>
  );

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Add Document"
      description="Add a new document to the knowledge base"
      footer={footer}
      size="lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#3B82F6]" />
        </div>
      </div>

      <div className="flex rounded-xl overflow-hidden mb-4 bg-[#E0E5EC] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.4)]">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-all duration-200',
            activeTab === 'manual'
              ? 'bg-[#3B82F6] text-white shadow-[2px_2px_4px_rgba(59,130,246,0.3)]'
              : 'text-[#6B7280] hover:text-[#3D4852]'
          )}
        >
          Manual Input
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-all duration-200',
            activeTab === 'upload'
              ? 'bg-[#3B82F6] text-white shadow-[2px_2px_4px_rgba(59,130,246,0.3)]'
              : 'text-[#6B7280] hover:text-[#3D4852]'
          )}
        >
          Upload File
        </button>
      </div>

      <form id="knowledge-form" onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'manual' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-[#3D4852] mb-2">
                Filename <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="e.g., my-document"
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl bg-[#E0E5EC] text-[#3D4852] placeholder-[#6B7280]',
                  'focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20',
                  neumorphicInset
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3D4852] mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your document content here..."
                rows={8}
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl bg-[#E0E5EC] text-[#3D4852] placeholder-[#6B7280]',
                  'focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 resize-none',
                  neumorphicInset
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-[#3D4852] mb-2">Upload File</label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  'border-2 border-dashed border-[#A3B1C6]/40 rounded-xl p-6 text-center',
                  'hover:border-[#3B82F6] transition-colors cursor-pointer',
                  'bg-[#E0E5EC]/50'
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".txt,.md,.json,.csv,.xml,.html,.css,.js,.ts,.py,.java,.c,.cpp,.h,.hpp,.rst,.tex"
                  className="hidden"
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <File className="w-8 h-8 text-[#3B82F6]" />
                    <div className="text-left">
                      <p className="font-medium text-[#3D4852]">{file.name}</p>
                      <p className="text-sm text-[#6B7280]">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-[#6B7280]" />
                    <p className="text-[#3D4852] font-medium">
                      Drop a file here or click to upload
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      Supports txt, md, json, csv, xml, html, css, js, ts, py, java, c, cpp, and
                      more
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3D4852] mb-2">
                Filename (optional, auto-filled from file)
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Auto-filled from file"
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl bg-[#E0E5EC] text-[#3D4852] placeholder-[#6B7280]',
                  'focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20',
                  neumorphicInset
                )}
              />
            </div>
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </ResponsiveModal>
  );
}
