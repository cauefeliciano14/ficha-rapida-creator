/**
 * Memoized per-class card metadata. Computed once per classId, then served
 * from a Map. Eliminates repeated traversal of classDetails / classRules on
 * every render of the class list.
 */
import classDetailsData from './classDetails.json';
import { getClassHPData } from '../rules/data/classRules';

interface ClassDetails {
  basicTraits: Record<string, string>;
  features?: Array<unknown>;
  options?: Array<unknown>;
}

export interface ClassCardMeta {
  primaryAttribute: string | null;
  hitDie: string | null;
}

const cache = new Map<string, ClassCardMeta>();

function getTraitValue(traits: Record<string, string>, labels: string[]) {
  const entry = Object.entries(traits).find(([key]) => labels.includes(key));
  return entry?.[1] ?? null;
}

export function getClassCardMeta(classId: string): ClassCardMeta {
  const cached = cache.get(classId);
  if (cached) return cached;
  const details = (classDetailsData as Record<string, ClassDetails>)[classId];
  const traits = details?.basicTraits ?? {};
  const meta: ClassCardMeta = {
    primaryAttribute: getTraitValue(traits, ['Atributo Primário']),
    hitDie: getClassHPData(classId)?.hitDieLabel ?? getTraitValue(traits, ['Dado de Ponto de Vida']),
  };
  cache.set(classId, meta);
  return meta;
}

export function getClassDetailsCached(classId: string): ClassDetails | null {
  return (classDetailsData as Record<string, ClassDetails>)[classId] ?? null;
}

/**
 * Prefetch class hero art + icon for known class ids. Called on idle so the
 * first hover/selection has zero network latency.
 */
export function prefetchClassImages(classIds: string[]): void {
  if (typeof document === 'undefined') return;
  for (const id of classIds) {
    for (const src of [`/imgs/icone_classe/${id}.png`, `/imgs/${id}.png`]) {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = src;
    }
  }
}
