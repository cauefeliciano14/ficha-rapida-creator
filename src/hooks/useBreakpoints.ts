import { MEDIA_QUERIES } from '../styles/breakpoints';
import { useMediaQuery } from './useMediaQuery';

export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA_QUERIES.mobile);
}

export function useIsTablet(): boolean {
  return useMediaQuery(MEDIA_QUERIES.tablet);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(MEDIA_QUERIES.desktop);
}

export function useIsWide(): boolean {
  return useMediaQuery(MEDIA_QUERIES.wide);
}