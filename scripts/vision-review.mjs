#!/usr/bin/env node
// Send image(s) to the vision endpoint for design/QA review.
// Usage: node scripts/vision-review.mjs <imagePath> [prompt]
// Env overrides: VISION_BASE_URL, VISION_API_KEY, VISION_MODEL

import { readFileSync } from 'node:fs';
import { basename, extname } from 'node:path';

const BASE_URL = process.env.VISION_BASE_URL ?? 'https://ai.naufalrf.net/v1';
const API_KEY = process.env.VISION_API_KEY ?? 'sk-5198d13cb7031b54-rm2hof-8a26246a';
const MODEL = process.env.VISION_MODEL ?? 'gemini-3.1-pro';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

const imagePath = process.argv[2];
const prompt =
  process.argv.slice(3).join(' ') ||
  'You are a world-class senior product/visual designer reviewing a personal portfolio website screenshot. ' +
  'Critique it rigorously: layout structure, asymmetry, typography hierarchy, spacing, color/brand usage, ' +
  'uniqueness (does it look like a generic template?), image sizing, responsive concerns, and overall "wow" factor. ' +
  'Then give concrete, prioritized improvements. Be specific and honest.';

if (!imagePath) {
  console.error('Usage: node scripts/vision-review.mjs <imagePath> [prompt]');
  process.exit(1);
}

const ext = extname(imagePath).toLowerCase();
const mime = MIME[ext] ?? 'image/png';
const b64 = readFileSync(imagePath).toString('base64');

const body = {
  model: MODEL,
  stream: false,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
      ],
    },
  ],
};

const res = await fetch(`${BASE_URL}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  const text = await res.text();
  console.error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  process.exit(1);
}

const raw = await res.text();
let out = '';
try {
  const json = JSON.parse(raw);
  out = json?.choices?.[0]?.message?.content ?? '';
} catch {
  for (const line of raw.split('\n')) {
    if (!line.startsWith('data:')) continue;
    const payload = line.slice(5).trim();
    if (payload === '[DONE]') continue;
    try { out += JSON.parse(payload)?.choices?.[0]?.delta?.content ?? ''; } catch {}
  }
}
console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 2));
