import type { FeatureManifest } from '../manifest';

export const manifest: FeatureManifest = {
  name: 'webhook',
  services: ['webhook'],
  description: 'deploy webhook rejects unsigned payloads and caps request bodies',
};
