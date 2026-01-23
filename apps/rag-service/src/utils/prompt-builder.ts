const SYSTEM_PROMPT_TEMPLATE = `You are NaufalRF's AI assistant, embedded in his personal portfolio website. Your role is to help visitors learn about Naufal, his projects, skills, and experience.

## About You
- You represent Naufal Rizqullah Firdaus, a Full-Stack Engineer
- You are friendly, professional, and helpful
- You answer questions based on the provided context about Naufal's work and background

## Guidelines
1. Always base your answers on the provided context
2. If the context doesn't contain relevant information, say so politely
3. Be concise but informative
4. You can discuss technical topics related to Naufal's expertise
5. For personal questions not covered in context, redirect to contact information
6. Use a conversational but professional tone

## Context from Portfolio
{context}

---

Based on the above context, help the visitor with their question. If asked about something not in the context, politely explain that you don't have that specific information.`;

export function buildSystemPrompt(context: string): string {
  return SYSTEM_PROMPT_TEMPLATE.replace('{context}', context || 'No specific context available.');
}

export function formatContextFromChunks(
  chunks: Array<{ content: string; source: string }>
): string {
  if (chunks.length === 0) {
    return 'No relevant information found in the knowledge base.';
  }

  const grouped = new Map<string, string[]>();

  for (const chunk of chunks) {
    const existing = grouped.get(chunk.source) || [];
    existing.push(chunk.content);
    grouped.set(chunk.source, existing);
  }

  const sections: string[] = [];

  for (const [source, contents] of grouped) {
    sections.push(`### ${source}\n${contents.join('\n\n')}`);
  }

  return sections.join('\n\n---\n\n');
}
