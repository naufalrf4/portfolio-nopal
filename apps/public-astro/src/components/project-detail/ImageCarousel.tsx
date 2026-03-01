import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ProjectImage } from '../../types';

interface ImageCarouselProps {
  images: ProjectImage[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
        <span className="text-7xl text-white font-bold opacity-80">{title.charAt(0)}</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0].url}
        alt={images[0].alt || title}
        className="w-full h-full object-cover"
        loading="eager"
      />
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full group">
      <img
        src={images[currentIndex].url}
        alt={images[currentIndex].alt || title}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading={currentIndex === 0 ? 'eager' : 'lazy'}
      />

      <button
        onClick={goToPrevious}
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 z-10',
          'bg-[#E0E5EC] rounded-full p-3',
          'shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]',
          'hover:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]',
          'transition-all duration-200',
          'opacity-0 group-hover:opacity-100'
        )}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-[#3B82F6]" />
      </button>

      <button
        onClick={goToNext}
        className={cn(
          'absolute right-4 top-1/2 -translate-y-1/2 z-10',
          'bg-[#E0E5EC] rounded-full p-3',
          'shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]',
          'hover:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]',
          'transition-all duration-200',
          'opacity-0 group-hover:opacity-100'
        )}
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-[#3B82F6]" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-200',
              index === currentIndex ? 'bg-[#3B82F6] w-8' : 'bg-white/50 hover:bg-white/75'
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {images[currentIndex].caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
          <p className="text-white text-sm font-medium text-center">
            {images[currentIndex].caption}
          </p>
        </div>
      )}
    </div>
  );
}
