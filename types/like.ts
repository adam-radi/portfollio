export type LikeEntityType = "PROJECT" | "SKILL" | "ARTICLE" | "REVIEW";

export const LIKE_ENTITY_TYPES: LikeEntityType[] = ["PROJECT", "SKILL", "ARTICLE", "REVIEW"];

export interface LikeState {
  count: number;
  liked: boolean;
}

/** Map of entity id → like count, used to hydrate list/card UIs server-side. */
export type LikeCounts = Record<string, number>;

export interface LikeToggleResult {
  ok: boolean;
  liked?: boolean;
  count?: number;
  error?: string;
}

export interface LikeTopEntry {
  id: string;
  title: string;
  count: number;
}

export interface LikeStats {
  total: number;
  byType: Record<LikeEntityType, number>;
  topProject: LikeTopEntry | null;
  topArticle: LikeTopEntry | null;
}
