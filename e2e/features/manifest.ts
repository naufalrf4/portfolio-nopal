import type { ServiceName } from '../helpers/services';

export interface FeatureManifest {
  name: string;
  services: readonly ServiceName[];
  description: string;
}
