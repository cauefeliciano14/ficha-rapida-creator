import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BREAKPOINTS } from '../styles/breakpoints';
import { useIsDesktop, useIsMobile, useIsTablet, useIsWide } from './useBreakpoints';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function Probe() {
  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const desktop = useIsDesktop();
  const wide = useIsWide();
  return <output data-testid="ranges">{JSON.stringify({ mobile, tablet, desktop, wide })}</output>;
}

function mockViewport(initialWidth: number) {
  let width = initialWidth;
  const subscriptions: Array<{ query: string; callback: (event: MediaQueryListEvent) => void }> = [];
  function matches(query: string) {
    const max = query.match(/max-width:\s*(\d+)px/);
    const min = query.match(/min-width:\s*(\d+)px/);
    return (!max || width <= Number(max[1])) && (!min || width >= Number(min[1]));
  }
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: matches(query), media: query,
    addEventListener: (_: string, callback: (event: MediaQueryListEvent) => void) => subscriptions.push({ query, callback }),
    removeEventListener: (_: string, callback: (event: MediaQueryListEvent) => void) => {
      const index = subscriptions.findIndex(s => s.callback === callback);
      if (index >= 0) subscriptions.splice(index, 1);
    },
  }));
  return (nextWidth: number) => {
    width = nextWidth;
    act(() => { subscriptions.forEach(s => s.callback({ matches: matches(s.query) } as MediaQueryListEvent)); });
  };
}

describe('shared responsive ranges', () => {
  it('exports the four inclusive CSS maxima', () => {
    expect(BREAKPOINTS).toEqual({ sm: 479, md: 767, lg: 1023, xl: 1279 });
  });

  it.each([
    [479, true, false, false, false],
    [480, true, false, false, false],
    [767, true, false, false, false],
    [768, false, true, false, false],
    [1023, false, true, false, false],
    [1024, false, false, true, false],
    [1279, false, false, true, false],
    [1280, false, false, true, true],
  ])('classifies width %i without boundary overlap', (width, mobile, tablet, desktop, wide) => {
    mockViewport(width as number);
    render(<Probe />);
    expect(JSON.parse(screen.getByTestId('ranges').textContent ?? '{}')).toEqual({ mobile, tablet, desktop, wide });
  });

  it('updates existing hooks when crossing the mobile boundary', () => {
    const resize = mockViewport(767);
    render(<Probe />);
    resize(768);
    expect(JSON.parse(screen.getByTestId('ranges').textContent ?? '{}')).toEqual({ mobile: false, tablet: true, desktop: false, wide: false });
  });
});