import { describe, expect, it } from 'vitest';
import { parseVideoSpec, resolveTemplate } from './spec.js';

const valid = {
  id: '06',
  title: 'Agente GPT + Firecrawl com roteamento automático',
  template: 'flow',
  voice: 'pf_dora',
  resolution: 'draft',
  scenes: [
    {
      title: 'Hook',
      narration: 'GPT e Firecrawl precisam de um roteador.',
    },
  ],
};

describe('parseVideoSpec', () => {
  it('accepts a valid flow spec', () => {
    expect(parseVideoSpec(valid)).toMatchObject({ id: '06', template: 'flow' });
  });

  it('rejects an empty scene list', () => {
    expect(() => parseVideoSpec({ ...valid, scenes: [] })).toThrow('scenes');
  });

  it('rejects an unsupported template', () => {
    expect(() => parseVideoSpec({ ...valid, template: 'cinematic' })).toThrow('template');
  });

  it('rejects a scene without narration', () => {
    expect(() => parseVideoSpec({ ...valid, scenes: [{ title: 'Broken' }] })).toThrow('narration');
  });
});

describe('resolveTemplate', () => {
  it.each(['flow', 'explainer', 'compare'] as const)('routes %s', (template) => {
    expect(resolveTemplate(template)).toBe(template);
  });
});
