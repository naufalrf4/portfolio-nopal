'use client';

import { useState, useRef } from 'react';
import { FileText, Upload, X, File, AlertCircle, Loader2 } from 'lucide-react';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type InputMode = 'manual' | 'upload';

export function KnowledgeModal({ isOpen, onClose, onSuccess }: KnowledgeModalProps) {
  const [activeTab, setActiveTab] = useState<InputMode>('manual');
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
        onClose();
        onSuccess();
        setFilename('');
        setContent('');
        setFile(null);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#E0E5EC] rounded-2xl shadow-[12px_12px_24px_rgba(163,177,198,0.5),-12px_-12px_24px_rgba(255,255,255,0.5)] animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#d1d5db]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#3D4852]">Add Document</h2>
              <p className="text-sm text-[#6B7280]">Add a new document to the knowledge base</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#D4D9E2]/50 transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="flex border-b border-[#d1d5db]/30">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'manual'
                ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            Manual Input
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            Upload File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'manual' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-[#3D4852] mb-2">Filename</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="e.g., my-document"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] text-[#3D4852] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D4852] mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your document content here..."
                  rows={10}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] text-[#3D4852] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 resize-none"
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
                  className="border-2 border-dashed border-[#d1d5db] rounded-xl p-8 text-center hover:border-[#3B82F6] transition-colors cursor-pointer"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] text-[#3D4852] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-[#d1d5db]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#3D4852] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] rounded-xl hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
