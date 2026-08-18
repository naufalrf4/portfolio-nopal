'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

interface LlmConfigData {
  id?: string;
  mainProvider: string;
  mainBaseUrl: string;
  mainApiKey: string;
  mainModel: string;
  fallbackProvider: string | null;
  fallbackBaseUrl: string;
  fallbackApiKey: string;
  fallbackModel: string;
  embeddingProvider: string;
  embeddingBaseUrl: string;
  embeddingApiKey: string;
  embeddingModel: string;
  embeddingDimension: number;
}

type Slot = 'main' | 'fallback' | 'embedding';

interface SlotState {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  modelOptions: string[];
  loadingModels: boolean;
  existingApiKey: string;
}

function maskApiKey(key: string) {
  if (!key || key.length <= 4) return '••••';
  return '••••' + key.slice(-4);
}

const PROVIDER_OPTIONS = [
  { value: 'openai-compatible', label: '0penAI-compatible' },
  { value: 'gemini', label: 'Gem1ni' },
];

export default function AISettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [main, setMain] = useState<SlotState>({ provider: 'gemini', baseUrl: '', apiKey: '', model: 'gemini-2.5-flash', modelOptions: [], loadingModels: false, existingApiKey: '' });
  const [fallback, setFallback] = useState<SlotState>({ provider: 'gemini', baseUrl: '', apiKey: '', model: '', modelOptions: [], loadingModels: false, existingApiKey: '' });
  const [fallbackEnabled, setFallbackEnabled] = useState(false);
  const [embedding, setEmbedding] = useState<SlotState>({ provider: 'gemini', baseUrl: '', apiKey: '', model: 'gemini-embedding-001', modelOptions: [], loadingModels: false, existingApiKey: '' });
  const [embeddingDim, setEmbeddingDim] = useState(768);

  // Load existing config
  useEffect(() => {
    fetch('/api/v1/admin/llm-config')
      .then(r => r.json())
      .then(data => {
        const d = data.data as LlmConfigData | null;
        if (!d) return;
        setMain(prev => ({ ...prev, provider: d.mainProvider, baseUrl: d.mainBaseUrl, apiKey: d.mainApiKey, model: d.mainModel, existingApiKey: d.mainApiKey }));
        if (d.fallbackProvider) {
          setFallbackEnabled(true);
          setFallback(prev => ({ ...prev, provider: d.fallbackProvider!, baseUrl: d.fallbackBaseUrl, apiKey: d.fallbackApiKey, model: d.fallbackModel, existingApiKey: d.fallbackApiKey }));
        }
        setEmbedding(prev => ({ ...prev, provider: d.embeddingProvider, baseUrl: d.embeddingBaseUrl, apiKey: d.embeddingApiKey, model: d.embeddingModel, existingApiKey: d.embeddingApiKey }));
        setEmbeddingDim(d.embeddingDimension ?? 768);
      })
      .catch(() => {});
  }, []);

  const fetchModels = useCallback(async (slot: Slot) => {
    const state = slot === 'main' ? main : slot === 'fallback' ? fallback : embedding;
    const setter = slot === 'main' ? setMain : slot === 'fallback' ? setFallback : setEmbedding;

    const keyToUse = state.apiKey || state.existingApiKey;
    if (!state.baseUrl && state.provider === 'openai-compatible') return;
    if (!keyToUse) return;

    if (state.provider === 'gemini') {
      setter(prev => ({
        ...prev,
        modelOptions: [
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-2.5-flash-lite',
          'gemini-1.5-flash',
          'gemini-1.5-pro',
          'gemini-embedding-001',
        ],
        loadingModels: false,
      }));
      return;
    }

    setter(prev => ({ ...prev, loadingModels: true }));
    try {
      const res = await fetch('/api/v1/admin/llm-config/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: state.provider, baseUrl: state.baseUrl, apiKey: keyToUse }),
      });
      const data = (await res.json()) as Record<string, unknown>;
      const models = (data.data as { models?: string[] } | null)?.models ?? [];
      setter(prev => ({ ...prev, modelOptions: models, loadingModels: false }));
    } catch {
      setter(prev => ({ ...prev, modelOptions: [], loadingModels: false }));
    }
  }, [main, fallback, embedding]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const payload = {
        mainProvider: main.provider,
        mainBaseUrl: main.baseUrl,
        mainApiKey: main.apiKey || main.existingApiKey,
        mainModel: main.model,
        fallbackProvider: fallbackEnabled ? fallback.provider : null,
        fallbackBaseUrl: fallbackEnabled ? fallback.baseUrl : '',
        fallbackApiKey: fallbackEnabled ? (fallback.apiKey || fallback.existingApiKey) : '',
        fallbackModel: fallbackEnabled ? fallback.model : '',
        embeddingProvider: embedding.provider,
        embeddingBaseUrl: embedding.baseUrl,
        embeddingApiKey: embedding.apiKey || embedding.existingApiKey,
        embeddingModel: embedding.model,
        embeddingDimension: embeddingDim,
      };

      const res = await fetch('/api/v1/admin/llm-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = (await res.json()) as Record<string, unknown>;
        throw new Error(String((err.error as Record<string, unknown>)?.message ?? 'Save failed'));
      }

      setSaved(true);
      // Update existingApiKey markers
      setMain(prev => ({ ...prev, existingApiKey: prev.apiKey || prev.existingApiKey, apiKey: '' }));
      setFallback(prev => ({ ...prev, existingApiKey: prev.apiKey || prev.existingApiKey, apiKey: '' }));
      setEmbedding(prev => ({ ...prev, existingApiKey: prev.apiKey || prev.existingApiKey, apiKey: '' }));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const slotSection = (
    slot: Slot,
    label: string,
    state: SlotState,
    setter: React.Dispatch<React.SetStateAction<SlotState>>,
    extra?: React.ReactNode,
  ) => (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{label}</h3>

      <div className="space-y-4">
        {/* Provider */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Provider</label>
          <select
            value={state.provider}
            onChange={e => { setter(prev => ({ ...prev, provider: e.target.value })); }}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
          >
            {PROVIDER_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Base URL (only for openai-compatible) */}
        {state.provider === 'openai-compatible' && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Base URL</label>
            <input
              type="url"
              placeholder="https://api.openai.com"
              value={state.baseUrl}
              onChange={e => setter(prev => ({ ...prev, baseUrl: e.target.value }))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            />
          </div>
        )}

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            API Key
            {state.existingApiKey && <span className="ml-2 text-xs text-[var(--teal)]">(saved: {maskApiKey(state.existingApiKey)})</span>}
          </label>
          <input
            type="password"
            placeholder={state.existingApiKey ? 'Enter new key to change' : 'Enter API key'}
            value={state.apiKey}
            onChange={e => setter(prev => ({ ...prev, apiKey: e.target.value }))}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Model</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              {state.modelOptions.length > 0 ? (
                <select
                  value={state.model}
                  onChange={e => setter(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2.5 text-[var(--text-primary)] appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                >
                  {state.modelOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Model name"
                  value={state.model}
                  onChange={e => setter(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
                />
              )}
              {state.modelOptions.length > 0 && (
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]" />
              )}
            </div>
            <button
              onClick={() => fetchModels(slot)}
              disabled={state.loadingModels}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--teal)]/40 bg-[var(--teal-soft)] px-4 py-2.5 text-sm font-medium text-[var(--teal)] transition-all hover:bg-[var(--teal)]/10 disabled:opacity-50"
            >
              {state.loadingModels ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
              Fetch
            </button>
          </div>
        </div>
        {extra}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">AI Settings</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Configure LLM providers for the RAG chatbot</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--teal)]/90 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Config
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--success)]/40 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
          <CheckCircle size={16} />
          Config saved. RAG service picks up changes within 30 seconds.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--error)]/40 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]">
          <XCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slotSection('main', 'Main LLM', main, setMain)}
        {slotSection('embedding', 'Embedding', embedding, setEmbedding,
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Embedding Dimension</label>
            <input
              type="number"
              value={embeddingDim}
              onChange={e => setEmbeddingDim(Number(e.target.value) || 768)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
            />
          </div>
        )}
      </div>

      {/* Fallback slot */}
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={fallbackEnabled}
            onChange={e => setFallbackEnabled(e.target.checked)}
            className="h-5 w-5 rounded border-[var(--line)] bg-[var(--bg-card)] accent-[var(--teal)]"
          />
          <span className="text-sm font-medium text-[var(--text-primary)]">Enable Fallback LLM</span>
        </label>
        {fallbackEnabled && slotSection('fallback', 'Fallback LLM', fallback, setFallback)}
      </div>
    </div>
  );
}
