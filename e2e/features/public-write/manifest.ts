import type { FeatureManifest } from '../manifest';

export const manifest: FeatureManifest = {
  name: 'public-write',
  services: ['admin'],
  description: 'public write endpoints enforce schema bounds and anti-abuse gates',
};
