import type { FeatureManifest } from '../manifest';

export const manifest: FeatureManifest = {
  name: 'ip-spoofing',
  services: ['public'],
  description: 'client-supplied forwarding headers cannot dictate the trusted client IP',
};
