/**
 * Render diagnostics — opt-in via `?diag=renders` or localStorage `dnd_diag_renders=1`.
 * Logs render counts and which props/state changed between renders for instrumented
 * components, helping identify cascade re-renders without shipping any cost in prod
 * (the hook short-circuits when the flag is off).
 */
import { useEffect, useRef } from 'react';

let cachedEnabled: boolean | null = null;
export function isDiagnosticsEnabled(): boolean {
  if (cachedEnabled !== null) return cachedEnabled;
  if (typeof window === 'undefined') return false;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('diag') === 'renders') {
      localStorage.setItem('dnd_diag_renders', '1');
    }
    cachedEnabled = localStorage.getItem('dnd_diag_renders') === '1';
  } catch {
    cachedEnabled = false;
  }
  return cachedEnabled;
}

export function useWhyDidYouRender(label: string, watched: Record<string, unknown>): void {
  const enabled = isDiagnosticsEnabled();
  const renderCount = useRef(0);
  const prev = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    renderCount.current += 1;
    const previous = prev.current;
    if (!previous) {
      // eslint-disable-next-line no-console
      console.log(`%c[diag:${label}] mount`, 'color:#22c55e;font-weight:bold');
    } else {
      const changed: string[] = [];
      for (const key of Object.keys(watched)) {
        if (!Object.is(previous[key], watched[key])) changed.push(key);
      }
      if (changed.length === 0) {
        // eslint-disable-next-line no-console
        console.log(
          `%c[diag:${label}] render #${renderCount.current} — NO prop change (parent re-rendered?)`,
          'color:#f59e0b'
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(
          `%c[diag:${label}] render #${renderCount.current} — changed:`,
          'color:#38bdf8',
          changed
        );
      }
    }
    prev.current = { ...watched };
  });
}
