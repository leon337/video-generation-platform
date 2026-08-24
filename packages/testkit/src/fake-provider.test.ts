import { describe, expect, it } from 'vitest';
import { FakeProviderAdapter } from './index.js';

describe('FakeProviderAdapter', () => {
  it('exposes only configured capabilities and deterministic fake execution', async () => {
    const adapter = new FakeProviderAdapter({
      capabilities: ['TEXT_TO_VIDEO'],
      costUsd: 0,
    });
    expect(await adapter.describeCapabilities()).toEqual(['TEXT_TO_VIDEO']);
    const submission = await adapter.submit(
      {
        requestId: 'request-1',
        missionId: 'mission-1',
        capability: 'TEXT_TO_VIDEO',
        environment: 'dev',
        commercialUse: false,
        region: 'BR',
        economicBoundary: {
          authorizedCostUsd: 0,
          preferFree: true,
          allowByok: true,
          allowLocal: true,
        },
        payload: {},
      },
      'idem-1',
    );
    expect(submission.executionId).toBe('fake:idem-1');
  });
});
