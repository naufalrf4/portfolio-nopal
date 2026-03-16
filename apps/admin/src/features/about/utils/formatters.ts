import type { ExperienceItem, ExperienceType } from '../types/about.types';

export function parseMonthDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [year, month] = dateStr.split('-').map(Number);
  if (!year || !month) return null;
  return new Date(year, month - 1, 1);
}

export function formatMonthDate(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getTitleLabel(type: string): string {
  if (type === 'Education') return 'Degree';
  if (type === 'Certification') return 'Certification';
  return 'Position';
}

export function getOrganizationLabel(type: string): string {
  if (type === 'Education') return 'Institution';
  if (type === 'Certification') return 'Issuer';
  return 'Company/Organization';
}

export function filterExperienceByType(
  experiences: ExperienceItem[],
  type: ExperienceType
): ExperienceItem[] {
  return experiences.filter((item) => item.type === type);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
