import { useCallback, useEffect, useState } from 'react';

export type AbilityViewMode = 'horizontal' | 'stacked';

const STORAGE_KEY = 'sheet:abilityViewMode';

function readInitial(): AbilityViewMode {
  if (typeof window === 'undefined') return 'horizontal';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'horizontal' || raw === 'stacked') return raw;
  } catch {
    /* localStorage indisponível (SSR, modo privado) */
  }
  return 'horizontal';
}

/**
 * Persiste o modo de visualização (horizontal/empilhado) dos cards de
 * atributos da Etapa 6 entre recarregamentos via localStorage.
 */
export function useAbilityViewMode(): [AbilityViewMode, (m: AbilityViewMode) => void, () => void] {
  const [mode, setModeState] = useState<AbilityViewMode>(readInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const setMode = useCallback((m: AbilityViewMode) => setModeState(m), []);
  const toggle = useCallback(
    () => setModeState(prev => (prev === 'horizontal' ? 'stacked' : 'horizontal')),
    []
  );

  return [mode, setMode, toggle];
}

export const ABILITY_VIEW_MODE_STORAGE_KEY = STORAGE_KEY;