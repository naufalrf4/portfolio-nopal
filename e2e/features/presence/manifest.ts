import type { FeatureManifest } from '../manifest';

export const manifest: FeatureManifest = {
  name: 'presence',
  services: ['presence'],
  description: 'presence websocket enforces origin, frame size and minimal health output',
};
