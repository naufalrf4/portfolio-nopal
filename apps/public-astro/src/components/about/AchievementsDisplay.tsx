import { useState, useRef, useEffect, type FC } from 'react';
import { NeuCard } from '../shared/NeuCard';
import { NeuButton } from '../shared/NeuButton';
import { Award, Calendar, ExternalLink, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';
import React from 'react';

export interface Achievement {
  id: string;
  name: string;
  location: string;
  monthYear: string;
  photos: string[];
  description: string;
  externalUrl: string | null;
  order: number;
  createdAt: string;
}

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

const AchievementCard: FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const hasPhotos = achievement.photos && achievement.photos.length > 0;
  const firstPhoto = hasPhotos ? achievement.photos[0] : null;

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px] flex flex-col items-center">
      <button onClick={onClick} className="w-full text-left group cursor-pointer block">
        <NeuCard className="overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1 group-hover:neu-extruded-hover">
          {firstPhoto && (
            <div className="relative w-full aspect-video bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
              <img
                src={firstPhoto}
                alt={achievement.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}

          <div className="p-4 text-center">
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {achievement.name}
            </h3>
            <p className="text-sm text-muted-foreground">{achievement.monthYear}</p>
          </div>
        </NeuCard>
      </button>

      <div className="relative mt-4 z-10">
        <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/40 ring-4 ring-background" />
      </div>
    </div>
  );
};

const SimpleModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl neu-card bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted/20">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6">{children}</div>
        {footer && <div className="mt-4 pt-4 border-t border-border">{footer}</div>}
      </div>
    </div>
  );
};

const AchievementModal: FC<AchievementModalProps> = ({ achievement, isOpen, onClose }) => {
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
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={achievement.name}
      footer={
        achievement.externalUrl ? (
          <a
            href={achievement.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <NeuButton variant="primary" size="md" className="w-full gap-2 justify-center">
              <ExternalLink className="w-4 h-4" />
              View Certificate
            </NeuButton>
          </a>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {hasPhotos && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden neu-inset bg-background/50">
              <img
                src={achievement.photos[currentPhotoIndex]}
                alt={achievement.name}
                className="w-full h-full object-contain"
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

                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg neu-extruded text-sm font-medium bg-background/90 backdrop-blur-sm">
                    {currentPhotoIndex + 1} / {achievement.photos.length}
                  </div>
                </>
              )}
            </div>

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
                    <img
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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

        {achievement.description && (
          <div className="neu-inset rounded-xl p-4">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {achievement.description}
            </p>
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

export const AchievementsDisplay: FC<AchievementsDisplayProps> = ({ achievements }) => {
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

        <div className="relative">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            className="overflow-x-auto cursor-grab active:cursor-grabbing scroll-smooth scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-3 pb-2 w-max">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-[6px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </div>
      </NeuCard>

      <AchievementModal
        achievement={selectedAchievement!}
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </>
  );
};
