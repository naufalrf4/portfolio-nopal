import { NEUMORPHIC_STYLES } from '../constants/blogs.constants';

interface NeumorphicToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function NeumorphicToggle({ checked, onChange, disabled }: NeumorphicToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className="relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50"
      style={{
        backgroundColor: NEUMORPHIC_STYLES.background,
        boxShadow: NEUMORPHIC_STYLES.shadows.inset,
      }}
    >
      <span
        className="absolute top-1 w-6 h-6 rounded-full transition-all duration-300"
        style={{
          left: checked ? '28px' : '4px',
          background: checked
            ? `linear-gradient(135deg, ${NEUMORPHIC_STYLES.success}, ${NEUMORPHIC_STYLES.accent})`
            : NEUMORPHIC_STYLES.background,
          boxShadow: checked ? '2px 2px 4px rgba(0,0,0,0.2)' : NEUMORPHIC_STYLES.shadows.small,
        }}
      />
    </button>
  );
}
