export type Capability =
  | 'TEXT_REASONING'
  | 'SCRIPT_GENERATION'
  | 'STORYBOARD_GENERATION'
  | 'VISION_ANALYSIS'
  | 'IMAGE_GENERATION'
  | 'TEXT_TO_VIDEO'
  | 'IMAGE_TO_VIDEO'
  | 'VIDEO_TO_VIDEO'
  | 'TEXT_TO_SPEECH'
  | 'MUSIC_GENERATION'
  | 'STOCK_MEDIA'
  | 'VIDEO_COMPOSITION';

export type ExecutionEnvironment = 'lab' | 'dev' | 'staging' | 'production';

export interface EconomicBoundary {
  readonly authorizedCostUsd: number;
  readonly preferFree: boolean;
  readonly allowByok: boolean;
  readonly allowLocal: boolean;
}

export interface CapabilityRequest {
  readonly requestId: string;
  readonly missionId: string;
  readonly capability: Capability;
  readonly environment: ExecutionEnvironment;
  readonly commercialUse: boolean;
  readonly region: string;
  readonly economicBoundary: EconomicBoundary;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface CostEstimate {
  readonly currency: 'USD';
  readonly amount: number;
  readonly estimationBasis: string;
}

export interface EligibilityResult {
  readonly eligible: boolean;
  readonly reasonCodes: readonly string[];
}

export interface QuotaSnapshot {
  readonly available: boolean;
  readonly remainingUnits: number | null;
  readonly unit: string | null;
  readonly observedAt: string;
}

export type ProviderExecutionStatus =
  | 'ACCEPTED'
  | 'QUEUED'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELED'
  | 'UNKNOWN'
  | 'EXPIRED';

export interface ProviderSubmission {
  readonly executionId: string;
  readonly status: ProviderExecutionStatus;
}

export interface ProviderResult {
  readonly executionId: string;
  readonly status: ProviderExecutionStatus;
  readonly output: Readonly<Record<string, unknown>> | null;
}

export interface ProviderUsage {
  readonly executionId: string;
  readonly unitsConsumed: number | null;
  readonly billingUnit: string | null;
  readonly reportedCostUsd: number | null;
}

export interface ProviderHealth {
  readonly state:
    | 'AVAILABLE'
    | 'DEGRADED'
    | 'RATE_LIMITED'
    | 'DISABLED'
    | 'UNKNOWN';
  readonly checkedAt: string;
}

export interface ProviderAdapter {
  readonly providerId: string;
  describeCapabilities(): Promise<readonly Capability[]>;
  estimateCost(request: CapabilityRequest): Promise<CostEstimate>;
  checkEligibility(request: CapabilityRequest): Promise<EligibilityResult>;
  checkQuota(request: CapabilityRequest): Promise<QuotaSnapshot>;
  submit(
    request: CapabilityRequest,
    idempotencyKey: string,
  ): Promise<ProviderSubmission>;
  getStatus(executionId: string): Promise<ProviderExecutionStatus>;
  getResult(executionId: string): Promise<ProviderResult>;
  cancel?(executionId: string): Promise<void>;
  verifyCallback?(payload: unknown): Promise<boolean>;
  getUsage(executionId: string): Promise<ProviderUsage>;
  health(): Promise<ProviderHealth>;
}

export interface StoredObject {
  readonly key: string;
  readonly contentType: string;
  readonly sizeBytes: number;
  readonly checksum: string;
}

export interface ObjectStorage {
  put(
    key: string,
    data: Uint8Array,
    contentType: string,
  ): Promise<StoredObject>;
  createSignedReadUrl(key: string, ttlSeconds: number): Promise<string>;
  delete(key: string): Promise<void>;
}
