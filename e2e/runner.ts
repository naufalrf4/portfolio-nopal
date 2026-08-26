import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers/env';
import { waitForHealthy } from './helpers/http';
import { SERVICES, available, type ServiceName } from './helpers/services';
import type { FeatureManifest } from './features/manifest';

const FEATURES_DIR = join(import.meta.dir, 'features');

interface Feature {
  manifest: FeatureManifest;
  specPath: string;
}

async function discoverFeatures(filter: readonly string[]): Promise<Feature[]> {
  const features: Feature[] = [];
  for (const entry of readdirSync(FEATURES_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (filter.length > 0 && !filter.includes(entry.name)) continue;
    const specPath = join(FEATURES_DIR, entry.name, `${entry.name}.spec.ts`);
    const manifestPath = join(FEATURES_DIR, entry.name, 'manifest.ts');
    const module = (await import(manifestPath)) as { manifest?: FeatureManifest };
    if (!module.manifest) {
      console.error(`skip ${entry.name}: manifest.ts does not export a manifest`);
      continue;
    }
    features.push({ manifest: module.manifest, specPath });
  }
  return features.sort((a, b) => a.manifest.name.localeCompare(b.manifest.name));
}

interface Started {
  name: ServiceName;
  stop: () => void;
}

async function startService(name: ServiceName): Promise<Started | null> {
  const def = SERVICES[name];
  const child = Bun.spawn([...def.command], {
    cwd: join(ROOT, def.cwd),
    stdout: 'ignore',
    stderr: 'ignore',
    stdin: 'ignore',
  });

  const stop = () => {
    child.kill('SIGTERM');
  };

  if (!(await waitForHealthy(def.healthUrl))) {
    stop();
    return null;
  }
  return { name, stop };
}

async function runSpecs(paths: readonly string[]): Promise<number> {
  const child = Bun.spawn(['bun', 'test', ...paths], {
    cwd: ROOT,
    stdout: 'inherit',
    stderr: 'inherit',
    env: { ...process.env, E2E_RUNNER: '1' },
  });
  return await child.exited;
}

async function main(): Promise<number> {
  const filter = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
  const features = await discoverFeatures(filter);
  if (features.length === 0) {
    console.error('no e2e features matched');
    return 1;
  }

  const required = new Set<ServiceName>();
  for (const feature of features) {
    for (const service of feature.manifest.services) required.add(service);
  }

  const started: Started[] = [];
  const unavailable: ServiceName[] = [];

  for (const service of required) {
    if (await available(service)) {
      console.log(`service ${service}: already running, reusing`);
      continue;
    }
    if (service === 'webhook') {
      console.log('service webhook: not managed by the runner, related specs will skip');
      unavailable.push(service);
      continue;
    }
    console.log(`service ${service}: starting`);
    const handle = await startService(service);
    if (!handle) {
      console.error(`service ${service}: failed to become healthy`);
      unavailable.push(service);
      continue;
    }
    started.push(handle);
  }

  if (unavailable.length > 0) {
    console.log(`unavailable services: ${unavailable.join(', ')} (specs will skip)`);
  }

  console.log(`running features: ${features.map((feature) => feature.manifest.name).join(', ')}`);
  const exitCode = await runSpecs(features.map((feature) => feature.specPath));

  for (const handle of started) {
    console.log(`service ${handle.name}: stopping`);
    handle.stop();
  }

  return exitCode;
}

process.exit(await main());
