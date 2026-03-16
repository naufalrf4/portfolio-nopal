'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Loader2,
  FileText,
  Image as ImageIcon,
  Link2,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/api';

export type UploadFolder = 'projects' | 'about' | 'achievements' | 'resumes';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  folder?: UploadFolder;
  label?: string;
  helperText?: string;
  maxSize?: number;
  preview?: boolean;
  disabled?: boolean;
  className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ProgressBar({ progress, state }: { progress: number; state: UploadState }) {
  const isError = state === 'error';
  const isSuccess = state === 'success';

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span
          className={cn(
            'font-medium',
            isError && 'text-red-500',
            isSuccess && 'text-emerald-500',
            !isError && !isSuccess && 'text-[#3D4852]'
          )}
        >
          {isError ? 'Upload failed' : isSuccess ? 'Upload complete' : 'Uploading...'}
        </span>
        <span className="text-[#6B7280]">{Math.round(progress)}%</span>
      </div>
      <div
        className={cn(
          'h-2 w-full rounded-full overflow-hidden',
          'bg-[#E0E5EC]',
          '[box-shadow:inset_3px_3px_6px_rgba(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            isError && 'bg-gradient-to-r from-red-500 to-red-400',
            isSuccess && 'bg-gradient-to-r from-emerald-500 to-emerald-400',
            !isError && !isSuccess && 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp,image/svg+xml,application/pdf',
  label,
  folder = 'projects',
  maxSize = MAX_FILE_SIZE,
  preview = true,
  disabled = false,
  helperText,
  className,
}: FileUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setPreviewUrl(value);
    if (value) {
      setUrlInput(value);
    }
  }, [value]);

  const isImage = (filename: string): boolean => {
    return (
      /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(filename) ||
      filename.includes('image/') ||
      (!filename.includes('.pdf') && !isPdf(filename))
    );
  };

  const isPdf = (filename: string): boolean => {
    return /\.pdf$/i.test(filename);
  };

  const simulateProgress = useCallback((onComplete: () => void) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 90) {
        clearInterval(interval);
        setUploadProgress(90);
      } else {
        setUploadProgress(currentProgress);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      onComplete();
    };
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.size > maxSize) {
        toast.error(`File size exceeds maximum limit of ${formatFileSize(maxSize)}`);
        setErrorMessage(`File too large. Maximum size is ${formatFileSize(maxSize)}`);
        setUploadState('error');
        return;
      }

      setLastFile(file);
      setUploadState('uploading');
      setUploadProgress(0);
      setErrorMessage(null);

      abortControllerRef.current = new AbortController();

      const completeProgress = simulateProgress(() => {});

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/v1/admin/upload', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        completeProgress();
        setUploadProgress(100);
        setUploadState('success');

        const uploadedUrl = data.data.url;
        onChange(uploadedUrl);
        setPreviewUrl(uploadedUrl);
        setImageLoadError(false);
        toast.success('File uploaded successfully');

        setTimeout(() => {
          setUploadState('idle');
          setUploadProgress(0);
        }, 1500);
      } catch (error) {
        completeProgress();

        if ((error as Error).name === 'AbortError') {
          setUploadState('idle');
          setUploadProgress(0);
          return;
        }

        const message = getErrorMessage(error, 'Upload failed');
        setErrorMessage(message);
        setUploadState('error');
        setUploadProgress(100);
        toast.error(message);
      }
    },
    [folder, maxSize, onChange, simulateProgress]
  );

  const handleRetry = () => {
    if (lastFile) {
      uploadFile(lastFile);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0]);
      }
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce(
      (acc, type) => {
        acc[type.trim()] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
    maxFiles: 1,
    disabled: disabled || uploadState === 'uploading',
  });

  const handleUrlSubmit = () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(trimmedUrl);
      onChange(trimmedUrl);
      setPreviewUrl(trimmedUrl);
      setImageLoadError(false);
      toast.success('URL set successfully');
    } catch {
      toast.error('Invalid URL format');
    }
  };

  const handleClear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onChange(null);
    setPreviewUrl(null);
    setUrlInput('');
    setUploadState('idle');
    setUploadProgress(0);
    setErrorMessage(null);
    setLastFile(null);
    setImageLoadError(false);
  };

  const handleModeToggle = (checked: boolean) => {
    setMode(checked ? 'url' : 'upload');
  };

  const isUploading = uploadState === 'uploading';
  const hasError = uploadState === 'error';
  const hasValue = !!previewUrl;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {label && <Label className="text-base font-medium text-[#3D4852]">{label}</Label>}

      <div
        className={cn(
          'rounded-[24px] p-4',
          'bg-[#E0E5EC]',
          '[box-shadow:9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]',
          'transition-all duration-300'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200',
                mode === 'upload' ? 'text-[#3B82F6]' : 'text-[#6B7280]'
              )}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload File</span>
            </div>

            <Switch
              checked={mode === 'url'}
              onCheckedChange={handleModeToggle}
              disabled={disabled || isUploading}
              aria-label="Toggle between upload and URL mode"
            />

            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200',
                mode === 'url' ? 'text-[#3B82F6]' : 'text-[#6B7280]'
              )}
            >
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Enter URL</span>
            </div>
          </div>

          {hasValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleClear}
              disabled={disabled}
              className="text-[#6B7280] hover:text-red-500"
              aria-label="Clear file"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {mode === 'upload' ? (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                'relative rounded-[20px] border-2 border-dashed p-6 sm:p-8',
                'transition-all duration-300 ease-out',
                'bg-[#E0E5EC]',
                '[box-shadow:inset_6px_6px_12px_rgba(163,177,198,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]',
                isDragActive &&
                  isDragAccept && [
                    'border-[#3B82F6] bg-[#3B82F6]/5',
                    '[box-shadow:inset_6px_6px_12px_rgba(59,130,246,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]',
                    'scale-[1.01]',
                  ],
                isDragActive &&
                  isDragReject && [
                    'border-red-500 bg-red-50/50',
                    '[box-shadow:inset_6px_6px_12px_rgba(239,68,68,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]',
                  ],
                !isDragActive && !hasError && 'border-[#6B7280]/20 hover:border-[#3B82F6]/40',
                hasError && 'border-red-400/60',
                (disabled || isUploading) && 'opacity-60 cursor-not-allowed',
                !disabled && !isUploading && 'cursor-pointer hover:scale-[1.005]'
              )}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center justify-center gap-3 text-center">
                {isUploading ? (
                  <>
                    <div
                      className={cn(
                        'rounded-full p-4',
                        'bg-[#E0E5EC]',
                        '[box-shadow:6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]'
                      )}
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
                    </div>
                    <div className="w-full max-w-xs">
                      <ProgressBar progress={uploadProgress} state={uploadState} />
                    </div>
                  </>
                ) : hasError ? (
                  <>
                    <div
                      className={cn(
                        'rounded-full p-4',
                        'bg-[#E0E5EC]',
                        '[box-shadow:6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]'
                      )}
                    >
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-red-500 font-medium">Upload failed</p>
                      {errorMessage && <p className="text-[#6B7280] text-sm">{errorMessage}</p>}
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry();
                        }}
                        className="mt-2"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Upload
                      </Button>
                    </div>
                  </>
                ) : uploadState === 'success' ? (
                  <>
                    <div
                      className={cn(
                        'rounded-full p-4',
                        'bg-[#E0E5EC]',
                        '[box-shadow:6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]'
                      )}
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="text-emerald-600 font-medium">Upload complete!</p>
                  </>
                ) : (
                  <>
                    <div
                      className={cn(
                        'rounded-full p-4',
                        'bg-[#E0E5EC]',
                        '[box-shadow:6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]',
                        'transition-all duration-300',
                        isDragActive &&
                          'scale-110 [box-shadow:8px_8px_16px_rgba(163,177,198,0.7),-8px_-8px_16px_rgba(255,255,255,0.6)]'
                      )}
                    >
                      <Upload
                        className={cn(
                          'h-8 w-8 transition-colors duration-200',
                          isDragActive ? 'text-[#3B82F6]' : 'text-[#6B7280]'
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-[#3D4852] font-medium mb-1">
                        {isDragActive
                          ? isDragAccept
                            ? 'Drop file here'
                            : 'File type not accepted'
                          : 'Drag & drop or click to browse'}
                      </p>
                      <p className="text-[#6B7280] text-sm">Max size: {formatFileSize(maxSize)}</p>
                      {accept && (
                        <p className="text-[#6B7280]/70 text-xs mt-1">
                          {accept.includes('image') ? 'Images' : ''}
                          {accept.includes('pdf')
                            ? accept.includes('image')
                              ? ' & PDF'
                              : 'PDF'
                            : ''}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
                disabled={disabled}
                className="flex-1"
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleUrlSubmit}
                disabled={disabled || !urlInput.trim()}
              >
                Set
              </Button>
            </div>
            <p className="text-xs text-[#6B7280]">Enter a direct link to an image or file</p>
          </div>
        )}
      </div>

      {helperText && <p className="text-sm text-[#6B7280] px-1">{helperText}</p>}

      {preview && previewUrl && (
        <div
          className={cn(
            'relative rounded-[20px] overflow-hidden',
            'bg-[#E0E5EC]',
            '[box-shadow:inset_6px_6px_12px_rgba(163,177,198,0.5),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]',
            'p-3'
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              {isImage(previewUrl) && !imageLoadError ? (
                <div className="relative overflow-hidden rounded-[16px] bg-[#E0E5EC]">
                  <div className="relative aspect-video w-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className={cn(
                        'h-full w-full object-contain rounded-[16px]',
                        'transition-opacity duration-300'
                      )}
                      onError={() => setImageLoadError(true)}
                    />
                  </div>
                </div>
              ) : isPdf(previewUrl) ? (
                <div
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-[16px]',
                    'bg-[#E0E5EC]',
                    '[box-shadow:6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.4)]'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-xl p-2.5',
                      'bg-[#E0E5EC]',
                      '[box-shadow:4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.4)]'
                    )}
                  >
                    <FileText className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3D4852]">PDF Document</p>
                    <p className="text-xs text-[#6B7280] truncate" title={previewUrl}>
                      {previewUrl.split('/').pop() || previewUrl}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-[16px]',
                    'bg-[#E0E5EC]',
                    '[box-shadow:6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.4)]'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-xl p-2.5',
                      'bg-[#E0E5EC]',
                      '[box-shadow:4px_4px_8px_rgba(163,177,198,0.5),-4px_-4px_8px_rgba(255,255,255,0.4)]'
                    )}
                  >
                    {imageLoadError ? (
                      <ImageIcon className="h-6 w-6 text-[#6B7280]" />
                    ) : (
                      <Link2 className="h-6 w-6 text-[#3B82F6]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3D4852]">
                      {imageLoadError ? 'Image (preview unavailable)' : 'External URL'}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate" title={previewUrl}>
                      {previewUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleClear}
              disabled={disabled}
              className="shrink-0 text-[#6B7280] hover:text-red-500 hover:bg-red-50/50"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'mt-2 inline-flex items-center gap-1.5 text-xs text-[#3B82F6] hover:underline',
                'transition-colors duration-200'
              )}
            >
              <Link2 className="h-3 w-3" />
              Open in new tab
            </a>
          )}
        </div>
      )}
    </div>
  );
}
