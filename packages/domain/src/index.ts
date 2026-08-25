export type ProjectId = string & { readonly __brand: 'ProjectId' };
export type SceneId = string & { readonly __brand: 'SceneId' };

export type ProjectStatus =
  'DRAFT' | 'READY' | 'GENERATING' | 'FAILED' | 'COMPLETED';

export interface Project {
  readonly id: ProjectId;
  readonly ownerId: string;
  readonly title: string;
  readonly targetAspectRatio: '9:16';
  readonly targetDurationSeconds: 15 | 30 | 45 | 60;
  readonly status: ProjectStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Scene {
  readonly id: SceneId;
  readonly projectId: ProjectId;
  readonly order: number;
  readonly narration: string;
  readonly visualIntent: string;
  readonly durationSeconds: number;
}
