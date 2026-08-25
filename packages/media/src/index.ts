export interface TimelineClip {
  readonly assetKey: string;
  readonly startSeconds: number;
  readonly durationSeconds: number;
}

export interface RenderSpecification {
  readonly width: 1080;
  readonly height: 1920;
  readonly fps: number;
  readonly clips: readonly TimelineClip[];
  readonly narrationKey?: string;
  readonly subtitleKey?: string;
}
