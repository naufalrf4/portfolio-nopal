'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { NeuCard, NeuButton } from '@/src/features/shared/components';
import { ResponsiveModal } from '@/src/components/ui/responsive-modal';
import type { Achievement } from '@/src/lib/api/types';
import { Award, Calendar, ExternalLink, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface AchievementsDisplayProps {
  achievements: Achievement[];
}

interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

interface AchievementModalProps {
  achievement: Achievement;
  isOpen: boolean;
  onClose: () => void;
}

function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  const hasPhotos = achievement.photos && achievement.photos.length > 0;
  const firstPhoto = hasPhotos ? achievement.photos[0] : null;

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px] flex flex-col items-center">
      {/* Card - Only first photo, name, year */}
      <button onClick={onClick} className="w-full text-left group cursor-pointer">
        <NeuCard className="overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1 group-hover:neu-extruded-hover">
          {/* First Photo Only */}
          {firstPhoto && (
            <div className="relative w-full aspect-video bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
              <Image
                src={firstPhoto}
                alt={achievement.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="320px"
              />
            </div>
          )}

          {/* Content - Only Name and Year */}
          <div className="p-4 text-center">
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {achievement.name}
            </h3>
            <p className="text-sm text-muted-foreground">{achievement.monthYear}</p>
          </div>
        </NeuCard>
      </button>

      {/* Timeline Dot - Below card, on the line */}
      <div className="relative mt-4 z-10">
        <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/40 ring-4 ring-background" />
      </div>
    </div>
  );
}

function AchievementModal({ achievement, isOpen, onClose }: AchievementModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const hasPhotos = achievement.photos && achievement.photos.length > 0;
  const hasMultiplePhotos = hasPhotos && achievement.photos.length > 1;

  useEffect(() => {
    if (isOpen) {
      setCurrentPhotoIndex(0);
    }
  }, [isOpen]);

  const nextPhoto = () => {
    if (hasPhotos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % achievement.photos.length);
    }
  };

  const prevPhoto = () => {
    if (hasPhotos) {
      setCurrentPhotoIndex(
        (prev) => (prev - 1 + achievement.photos.length) % achievement.photos.length
      );
    }
  };

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={onClose}
      title={achievement.name}
      size="lg"
      footer={
        achievement.externalUrl ? (
          <a
            href={achievement.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <NeuButton variant="primary" size="md" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              View Certificate
            </NeuButton>
          </a>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Photo Carousel - Only in Modal */}
        {hasPhotos && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden neu-inset bg-background/50">
              <Image
                src={achievement.photos[currentPhotoIndex]}
                alt={achievement.name}
                fill
                className="object-contain"
                sizes="800px"
              />

              {hasMultiplePhotos && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl neu-extruded hover:neu-extruded-hover flex items-center justify-center bg-background/90 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl neu-extruded hover:neu-extruded-hover flex items-center justify-center bg-background/90 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Progress dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                    {achievement.photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentPhotoIndex
                            ? 'bg-primary w-8'
                            : 'bg-muted-foreground/40 w-2 hover:bg-muted-foreground/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Counter */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg neu-extruded text-sm font-medium bg-background/90 backdrop-blur-sm">
                    {currentPhotoIndex + 1} / {achievement.photos.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultiplePhotos && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {achievement.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                      idx === currentPhotoIndex
                        ? 'neu-extruded ring-2 ring-primary scale-105'
                        : 'neu-inset opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl neu-inset text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{achievement.location}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl neu-inset text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{achievement.monthYear}</span>
          </div>
        </div>

        {/* Description */}
        {achievement.description && (
          <div className="neu-inset rounded-xl p-4">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {achievement.description}
            </p>
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
}

export function AchievementsDisplay({ achievements }: AchievementsDisplayProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <>
      <NeuCard className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl neu-extruded flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Achievements & Certifications
            </h2>
            <p className="text-xs text-muted-foreground">
              {achievements.length} {achievements.length === 1 ? 'achievement' : 'achievements'}
            </p>
          </div>
        </div>

        {/* Cards Container with Timeline */}
        <div className="relative">
          {/* Horizontal Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            className="overflow-x-auto cursor-grab active:cursor-grabbing scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-3 pb-2">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              ))}
            </div>
          </div>

          {/* Timeline Line - Positioned at bottom where dots are */}
          <div className="absolute bottom-[6px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </div>
      </NeuCard>

      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          isOpen={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </>
  );
}
