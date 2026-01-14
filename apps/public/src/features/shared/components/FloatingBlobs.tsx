'use client';

import { useEffect, useState } from 'react';

interface Blob {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function FloatingBlobs() {
  const [blobs, setBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    const generateBlobs = () => {
      const blobCount = 6;
      const newBlobs: Blob[] = [];

      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          size: Math.random() * 300 + 200,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 20 + 25,
          delay: Math.random() * -20,
          opacity: Math.random() * 0.15 + 0.05,
        });
      }

      setBlobs(newBlobs);
    };

    generateBlobs();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[#E0E5EC]" />

      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full blur-3xl animate-blob"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            opacity: blob.opacity,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)`,
            animationDuration: `${blob.duration}s`,
            animationDelay: `${blob.delay}s`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      <div
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl animate-blob-slow"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl animate-blob-slow-reverse"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-blob-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
