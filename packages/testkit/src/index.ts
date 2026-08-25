import type {
  Capability,
  CapabilityRequest,
  CostEstimate,
  EligibilityResult,
  ProviderAdapter,
  ProviderExecutionStatus,
  ProviderHealth,
  ProviderResult,
  ProviderSubmission,
  ProviderUsage,
  QuotaSnapshot,
} from '@vgp/contracts';

export class FakeProviderAdapter implements ProviderAdapter {
  readonly providerId: string;
  private readonly capabilities: readonly Capability[];
  private readonly costUsd: number;

  constructor(options: {
    providerId?: string;
    capabilities: readonly Capability[];
    costUsd?: number;
  }) {
    this.providerId = options.providerId ?? 'fake-provider';
    this.capabilities = options.capabilities;
    this.costUsd = options.costUsd ?? 0;
  }

  async describeCapabilities(): Promise<readonly Capability[]> {
    return this.capabilities;
  }

  async estimateCost(_request: CapabilityRequest): Promise<CostEstimate> {
    return { currency: 'USD', amount: this.costUsd, estimationBasis: 'fake' };
  }

  async checkEligibility(
    _request: CapabilityRequest,
  ): Promise<EligibilityResult> {
    return { eligible: true, reasonCodes: [] };
  }

  async checkQuota(_request: CapabilityRequest): Promise<QuotaSnapshot> {
    return {
      available: true,
      remainingUnits: 100,
      unit: 'fake-unit',
      observedAt: new Date(0).toISOString(),
    };
  }

  async submit(
    _request: CapabilityRequest,
    idempotencyKey: string,
  ): Promise<ProviderSubmission> {
    return { executionId: `fake:${idempotencyKey}`, status: 'ACCEPTED' };
  }

  async getStatus(_executionId: string): Promise<ProviderExecutionStatus> {
    return 'SUCCEEDED';
  }

  async getResult(executionId: string): Promise<ProviderResult> {
    return { executionId, status: 'SUCCEEDED', output: { fake: true } };
  }

  async getUsage(executionId: string): Promise<ProviderUsage> {
    return {
      executionId,
      unitsConsumed: 1,
      billingUnit: 'fake-unit',
      reportedCostUsd: this.costUsd,
    };
  }

  async health(): Promise<ProviderHealth> {
    return { state: 'AVAILABLE', checkedAt: new Date(0).toISOString() };
  }
}
