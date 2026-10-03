"use client";

import { getLikeStatesAction } from "@/actions/likes";
import type { LikeEntityType, LikeState } from "@/types/like";

const BATCH_WINDOW_MS = 40;

type Batch = {
  ids: string[];
  resolvers: Array<(state: LikeState | null) => void>;
};

const pendingBatches = new Map<LikeEntityType, Batch>();
const pendingTimers = new Map<LikeEntityType, ReturnType<typeof setTimeout>>();
const knownState = new Map<string, LikeState>();

function stateKey(entityType: LikeEntityType, entityId: string): string {
  return `${entityType}:${entityId}`;
}

function flush(entityType: LikeEntityType) {
  const batch = pendingBatches.get(entityType);
  const timer = pendingTimers.get(entityType);
  if (timer) clearTimeout(timer);
  pendingTimers.delete(entityType);
  if (!batch) return;
  pendingBatches.delete(entityType);

  const settle = (states: Record<string, LikeState> | null) => {
    batch.ids.forEach((id, index) => {
      const state = states?.[id] ?? null;
      if (state) knownState.set(stateKey(entityType, id), state);
      batch.resolvers[index]?.(state);
    });
  };

  getLikeStatesAction(entityType, batch.ids)
    .then(settle)
    .catch(() => settle(null));
}

/**
 * Returns the like state (count + visitor flag) for an entity.
 *
 * Requests made during the same tick are merged into a single server action
 * call per entity type, so a list of N buttons costs one round trip and two
 * grouped queries — no N+1.
 */
export function getLikeState(
  entityType: LikeEntityType,
  entityId: string
): Promise<LikeState | null> {
  const cached = knownState.get(stateKey(entityType, entityId));
  if (cached) return Promise.resolve(cached);

  let batch = pendingBatches.get(entityType);
  if (!batch) {
    batch = { ids: [], resolvers: [] };
    pendingBatches.set(entityType, batch);
  }
  const current = batch;

  const index = current.ids.length;
  current.ids.push(entityId);

  const promise = new Promise<LikeState | null>((resolve) => {
    current.resolvers[index] = resolve;
  });

  if (!pendingTimers.has(entityType)) {
    pendingTimers.set(
      entityType,
      setTimeout(() => flush(entityType), BATCH_WINDOW_MS)
    );
  }

  return promise;
}

/** Keeps the local cache in sync after a successful toggle. */
export function setLikeState(
  entityType: LikeEntityType,
  entityId: string,
  state: LikeState
): void {
  knownState.set(stateKey(entityType, entityId), state);
}
