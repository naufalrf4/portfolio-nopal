import { NEUMORPHIC_STYLES } from '../constants/blogs.constants';
import { WarningIcon } from './Icons';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-[32px] p-8 text-center"
        style={{
          backgroundColor: NEUMORPHIC_STYLES.background,
          boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
        }}
      >
        <div
          className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            boxShadow: NEUMORPHIC_STYLES.shadows.small,
          }}
        >
          <span className="text-white">
            <WarningIcon />
          </span>
        </div>
        <h3
          className="font-display text-xl font-bold mb-2"
          style={{ color: NEUMORPHIC_STYLES.foreground }}
        >
          Delete Blog Link
        </h3>
        <p className="mb-6" style={{ color: NEUMORPHIC_STYLES.muted }}>
          Are you sure you want to delete <strong>&quot;{title}&quot;</strong>? This action cannot
          be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: NEUMORPHIC_STYLES.background,
              boxShadow: NEUMORPHIC_STYLES.shadows.small,
              color: NEUMORPHIC_STYLES.foreground,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              boxShadow: NEUMORPHIC_STYLES.shadows.small,
              color: 'white',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
