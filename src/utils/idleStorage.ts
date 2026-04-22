/**
 * Idle-flush localStorage write queue with per-key shallow diffing.
 * - enqueue(key, value) coalesces multiple writes to the same key
 * - flush happens in requestIdleCallback (or microtask fallback)
 * - if the serialized payload equals the last successfully written one, the
 *   write is skipped entirely, avoiding redundant work
 */
type AnyValue = unknown;

const pending = new Map<string, AnyValue>();
const lastWritten = new Map<string, string>();
let scheduled = false;

type IdleCallback = (cb: () => void) => number;
const ric: IdleCallback =
  typeof window !== 'undefined' &&
  (window as unknown as { requestIdleCallback?: IdleCallback }).requestIdleCallback
    ? (window as unknown as { requestIdleCallback: IdleCallback }).requestIdleCallback.bind(window)
    : ((cb: () => void) => (typeof window !== 'undefined'
        ? window.setTimeout(cb, 200)
        : (setTimeout(cb, 200) as unknown as number)));

function flush() {
  scheduled = false;
  if (typeof window === 'undefined') return;
  pending.forEach((value, key) => {
    try {
      const serialized = value === undefined ? '' : JSON.stringify(value);
      if (lastWritten.get(key) === serialized) return; // no-op skip
      if (value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, serialized);
      lastWritten.set(key, serialized);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[idleStorage] write failed for', key, err);
    }
  });
  pending.clear();
}

export function queueWrite(key: string, value: AnyValue): void {
  pending.set(key, value);
  if (scheduled) return;
  scheduled = true;
  ric(flush);
}

export function flushNow(): void {
  if (pending.size > 0) flush();
}

if (typeof window !== 'undefined') {
  // Make sure pending writes hit disk before the user leaves the page
  window.addEventListener('pagehide', flushNow);
  window.addEventListener('beforeunload', flushNow);
}
