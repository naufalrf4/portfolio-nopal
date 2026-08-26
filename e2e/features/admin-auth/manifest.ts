import type { FeatureManifest } from '../manifest';

export const manifest: FeatureManifest = {
  name: 'admin-auth',
  services: ['admin'],
  description: 'admin tier stays gated; unauthenticated requests never reach the handler',
};
