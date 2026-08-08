import { LlmProvider } from "./llm-provider";
import { resolveLlmConfig } from "./llm-config-service";

let currentProvider: LlmProvider | null = null;
let providerResolvedAt = 0;

/** Return the current LlmProvider, refreshing config from Admin periodically. */
export async function getLlmProvider(): Promise<LlmProvider> {
  const now = Date.now();
  // Re-resolve every 30s to pick up Admin config changes without restart
  if (currentProvider !== null && now - providerResolvedAt < 30_000) {
    return currentProvider;
  }
  const config = await resolveLlmConfig();
  currentProvider = new LlmProvider(config);
  providerResolvedAt = now;
  return currentProvider;
}

/** For testing: inject a pre-built LlmProvider. */
export function setLlmProvider(provider: LlmProvider): void {
  currentProvider = provider;
  providerResolvedAt = Date.now();
}
