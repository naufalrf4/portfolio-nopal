import type { FeatureManifest } from '../manifest';

export const manifest: FeatureManifest = {
  name: 'rag-chat',
  services: ['rag'],
  description: 'rag service enforces ingest auth, chat input bounds and agentic guardrails',
};
