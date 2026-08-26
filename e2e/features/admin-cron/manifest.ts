import type { FeatureManifest } from '../manifest';

export const manifest: FeatureManifest = {
  name: 'admin-cron',
  services: ['admin'],
  description: 'cleanup-chatlogs cron stays fail-closed without a valid bearer secret',
};
