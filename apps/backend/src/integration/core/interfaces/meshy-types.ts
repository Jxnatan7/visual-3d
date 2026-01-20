export type MeshyModelType = "standard" | "lowpoly";
export type MeshyAIModel = "meshy-5" | "latest";
export type MeshyTopology = "quad" | "triangle";
export type MeshySymmetryMode = "off" | "auto" | "on";
export type MeshyPoseMode = "a-pose" | "t-pose" | "";
export type MeshyStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED";

export interface CreateImageTo3DRequest {
  image_url: string;
  model_type?: MeshyModelType;
  ai_model?: MeshyAIModel;
  topology?: MeshyTopology;
  target_polycount?: number;
  symmetry_mode?: MeshySymmetryMode;
  should_remesh?: boolean;
  save_pre_remeshed_model?: boolean;
  should_texture?: boolean;
  enable_pbr?: boolean;
  pose_mode?: MeshyPoseMode;
  texture_prompt?: string;
  texture_image_url?: string;
  moderation?: boolean;
}

export interface MeshyTaskResponse {
  id: string;
  type: string;
  status: MeshyStatus;
  progress: number;
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
    pre_remeshed_glb?: string;
  };
  thumbnail_url?: string;
  task_error?: { message: string };
}
