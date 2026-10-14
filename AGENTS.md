# Technical conventions

- Keep responsive query constants in `src/styles/breakpoints.ts` and consume named hooks from `src/hooks/useBreakpoints.ts`; shared boundaries prevent CSS/JavaScript drift.
- Use only complementary responsive boundaries (CSS maxima 479/767/1023/1279 and minima 480/768/1024/1280); narrower rules take precedence when legacy media blocks are consolidated.
- Keep `vh` fallbacks immediately before `dvh` height declarations; older browsers retain usable overlays.