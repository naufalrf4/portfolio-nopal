'use client';

import { motion } from 'framer-motion';
import type { ProjectCategory } from '@naufalrf/types';

interface ProjectFilterProps {
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
}

const categories: Array<{ value: ProjectCategory; label: string }> = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
];

export function ProjectFilter({ activeCategory, onCategoryChange }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => {
        const isActive = activeCategory === category.value;
        return (
          <motion.button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`
              relative px-6 py-3 rounded-2xl font-medium transition-all
              ${isActive ? 'neu-inset-deep text-primary' : 'neu-extruded text-foreground hover:neu-extruded-hover'}
            `}
            whileTap={{ scale: 0.98 }}
          >
            {category.label}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary/5 rounded-2xl"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
