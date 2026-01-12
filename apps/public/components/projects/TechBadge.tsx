interface TechBadgeProps {
  tech: string;
}

export function TechBadge({ tech }: TechBadgeProps) {
  return (
    <span className="neu-extruded px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:neu-extruded-hover transition-all">
      {tech}
    </span>
  );
}
