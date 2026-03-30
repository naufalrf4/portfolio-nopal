import { useState, useRef, useEffect, type FC, type MouseEvent as ReactMouseEvent } from 'react';
import { NeuButton } from '../shared/NeuButton';
import { ResponsiveModal } from '../shared/ResponsiveModal';
import {
  Award,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  achievements?: Achievement[];
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

const mediaPlaceholder = (
  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_58%),linear-gradient(160deg,rgba(252,253,255,0.98),rgba(244,247,251,0.96))] px-5 text-center text-[#607087]">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(251,252,255,0.98),rgba(241,245,249,0.94))] shadow-[inset_4px_4px_8px_rgba(187,200,214,0.18),inset_-4px_-4px_8px_rgba(255,255,255,0.58)]">
      <ImageIcon className="h-5 w-5 text-[#6B7280]" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-semibold text-[#314155]">Achievement media</p>
      <p className="text-xs leading-relaxed text-[#6B7280]">
        No image uploaded yet for this achievement.
      </p>
    </div>
  </div>
);

const AchievementCard: FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const hasPhotos = achievement.photos && achievement.photos.length > 0;
  const firstPhoto = hasPhotos ? achievement.photos[0] : null;

  return (
    <div className="flex w-[248px] flex-shrink-0 flex-col items-center sm:w-[272px] md:w-[286px]">
      <button onClick={onClick} className="group block w-full cursor-pointer text-left">
        <div className="flex h-full min-h-[272px] flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(251,252,255,0.98),rgba(244,247,251,0.98))] shadow-[10px_10px_22px_rgba(183,194,208,0.16),-10px_-10px_22px_rgba(255,255,255,0.78)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[14px_14px_26px_rgba(183,194,208,0.18),-14px_-14px_26px_rgba(255,255,255,0.82)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-b-[20px] bg-[linear-gradient(145deg,rgba(250,252,255,0.98),rgba(243,247,251,0.94))] shadow-[inset_4px_4px_10px_rgba(188,200,214,0.16),inset_-4px_-4px_10px_rgba(255,255,255,0.62)]">
            {firstPhoto ? (
              <img
                src={firstPhoto}
                alt={achievement.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              mediaPlaceholder
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-4">
            <div>
              <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#314155] transition-colors group-hover:text-[#3D4852] sm:text-base">
                {achievement.name}
              </h3>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-[#7A8797]">
                {achievement.monthYear}
              </p>
            </div>
          </div>
        </div>
      </button>

      <div className="relative z-10 mt-3">
        <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#eef2f7_44%,#cbd5e1_78%,#94a3b8_100%)] shadow-[0_0_0_4px_rgba(248,250,252,0.95),0_8px_18px_rgba(148,163,184,0.18)]">
          <div className="h-2 w-2 rounded-full bg-[#64748B]/70" />
        </div>
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
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={achievement.name}
      titleId={`achievement-modal-title-${achievement.id}`}
      description="Focused details, supporting images, and the certificate link in a softer white achievement view."
      desktopWidthClassName="max-w-[min(920px,calc(100vw-3rem))]"
      contentClassName="bg-[linear-gradient(180deg,rgba(250,252,255,0.98),rgba(244,247,251,0.98))]"
      bodyClassName="px-5 pb-5 md:px-6 md:pb-6"
      footer={
        achievement.externalUrl ? (
          <a
            href={achievement.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <NeuButton
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 rounded-[20px]"
            >
              <ExternalLink className="h-4 w-4" />
              View Certificate
            </NeuButton>
          </a>
        ) : undefined
      }
    >
      <div className="space-y-4 md:space-y-5">
        <div className="space-y-3">
          <div className="relative mx-auto aspect-[16/10] max-w-[680px] overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,rgba(250,252,255,0.98),rgba(244,247,251,0.94))] shadow-[inset_6px_6px_14px_rgba(188,200,214,0.14),inset_-6px_-6px_14px_rgba(255,255,255,0.6)]">
            {hasPhotos ? (
              <img
                src={achievement.photos[currentPhotoIndex]}
                alt={achievement.name}
                className="h-full w-full object-contain p-2 md:p-3"
              />
            ) : (
              mediaPlaceholder
            )}

            {hasMultiplePhotos ? (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/92 backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-[6px_6px_12px_rgba(188,200,214,0.16),-6px_-6px_12px_rgba(255,255,255,0.56)]"
                >
                  <ChevronLeft className="h-4.5 w-4.5 text-[#5B6B7E]" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/92 backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-[6px_6px_12px_rgba(188,200,214,0.16),-6px_-6px_12px_rgba(255,255,255,0.56)]"
                >
                  <ChevronRight className="h-4.5 w-4.5 text-[#5B6B7E]" />
                </button>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/92 px-3 py-1.5 backdrop-blur-sm shadow-[4px_4px_10px_rgba(188,200,214,0.22),-4px_-4px_10px_rgba(255,255,255,0.46)]">
                  {achievement.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={cn(
                        'h-2 rounded-full transition-all duration-200',
                        idx === currentPhotoIndex
                          ? 'w-7 bg-[#94A3B8]'
                          : 'w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                      )}
                    />
                  ))}
                </div>

                <div className="absolute right-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-[#5B6B7E] shadow-[4px_4px_10px_rgba(188,200,214,0.16),-4px_-4px_10px_rgba(255,255,255,0.52)]">
                  {currentPhotoIndex + 1} / {achievement.photos.length}
                </div>
              </>
            ) : null}
          </div>

          {hasMultiplePhotos ? (
            <div className="scrollbar-hide mx-auto flex max-w-[680px] gap-2.5 overflow-x-auto pb-1">
              {achievement.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={cn(
                    'h-14 w-14 flex-shrink-0 overflow-hidden rounded-[16px] transition-all duration-200',
                    idx === currentPhotoIndex
                      ? 'scale-[1.03] ring-2 ring-[#CBD5E1] shadow-[6px_6px_12px_rgba(163,177,198,0.18),-6px_-6px_12px_rgba(255,255,255,0.42)]'
                      : 'opacity-65 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.18),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] hover:opacity-100'
                  )}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="inline-flex items-center gap-2 rounded-[18px] bg-[linear-gradient(145deg,rgba(250,252,255,0.96),rgba(244,247,251,0.94))] px-3.5 py-3 text-sm shadow-[inset_4px_4px_8px_rgba(188,200,214,0.12),inset_-4px_-4px_8px_rgba(255,255,255,0.48)]">
            <MapPin className="h-4 w-4 text-[#64748B]" />
            <span className="text-[#5B6B7E]">{achievement.location}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-[18px] bg-[linear-gradient(145deg,rgba(250,252,255,0.96),rgba(244,247,251,0.94))] px-3.5 py-3 text-sm shadow-[inset_4px_4px_8px_rgba(188,200,214,0.12),inset_-4px_-4px_8px_rgba(255,255,255,0.48)]">
            <Calendar className="h-4 w-4 text-[#64748B]" />
            <span className="text-[#5B6B7E]">{achievement.monthYear}</span>
          </div>
        </div>

        {achievement.description ? (
          <div className="rounded-[22px] bg-[linear-gradient(145deg,rgba(250,252,255,0.92),rgba(244,247,251,0.88))] px-4 py-3.5 shadow-[inset_4px_4px_8px_rgba(188,200,214,0.12),inset_-4px_-4px_8px_rgba(255,255,255,0.48)]">
            <p className="whitespace-pre-line text-sm leading-7 text-[#556476] md:text-[15px]">
              {achievement.description}
            </p>
          </div>
        ) : null}
      </div>
    </ResponsiveModal>
  );
};

export const AchievementsDisplay: FC<AchievementsDisplayProps> = ({ achievements }) => {
  const items = achievements ?? [];
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      event.preventDefault();
      const x = event.pageX - container.offsetLeft;
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
  }, [isDragging, scrollLeft, startX]);

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(event.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="rounded-[30px] bg-[linear-gradient(180deg,rgba(251,252,255,0.98),rgba(244,247,251,0.98))] px-4 py-5 shadow-[14px_14px_30px_rgba(188,200,214,0.14),-14px_-14px_30px_rgba(255,255,255,0.8)] md:px-5 md:py-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgba(252,253,255,0.98),rgba(245,248,251,0.96))] shadow-[6px_6px_12px_rgba(188,200,214,0.14),-6px_-6px_12px_rgba(255,255,255,0.7)]">
            <Award className="h-5 w-5 text-[#64748B]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[#314155] md:text-xl">Achievements</h2>
            <p className="text-xs text-[#6B7280]">
              {items.length} {items.length === 1 ? 'achievement' : 'achievements'}
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            className="scrollbar-hide cursor-grab overflow-x-auto pb-4 scroll-smooth active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex w-max gap-3 pb-2 md:gap-4">
              {items.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-[6px] left-0 right-0 h-[3px] rounded-full bg-[linear-gradient(90deg,rgba(203,213,225,0)_0%,rgba(203,213,225,0.7)_24%,rgba(148,163,184,0.92)_50%,rgba(203,213,225,0.7)_76%,rgba(203,213,225,0)_100%)] shadow-[0_0_14px_rgba(148,163,184,0.14)]" />
        </div>
      </div>

      {selectedAchievement ? (
        <AchievementModal
          achievement={selectedAchievement}
          isOpen={true}
          onClose={() => setSelectedAchievement(null)}
        />
      ) : null}
    </>
  );
};
