# ARCHITECTURE

## Stack técnico
- **Build e tooling:** Vite 5, TypeScript 5, ESLint 9, PostCSS e Autoprefixer.
- **Front-end:** React 18 + React DOM 18.
- **Roteamento:** React Router DOM 6.
- **Estilização:** Tailwind CSS + tailwindcss-animate.
- **UI base:** shadcn/ui com componentes Radix UI.
- **Gerenciamento de estado:** Zustand.
- **Validação e formulários:** Zod, React Hook Form e @hookform/resolvers.
- **Testes:** Vitest + jsdom (sem Testing Library no `package.json` atual).

## Dependências

### Produção (principais)
- react, react-dom
- react-router-dom
- zustand
- zod
- react-hook-form, @hookform/resolvers
- @tanstack/react-query
- @radix-ui/* (componentes de acessibilidade/base para UI)
- lucide-react
- sonner
- recharts
- date-fns

### Desenvolvimento (principais)
- eslint, @eslint/js, typescript-eslint
- vitest, jsdom
- @types/node, @types/react, @types/react-dom
- eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals

### Observação importante sobre classificação atual
- No `package.json` deste projeto, várias ferramentas de build/runtime de front-end estão em `dependencies` (ex.: `vite`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `@vitejs/plugin-react-swc`, `@tailwindcss/typography`).
- Esta seção descreve o estado **como está hoje**, sem reclassificar automaticamente para `devDependencies`.


## Fonte de verdade e governança de atualização
- **Fonte de verdade:** `package.json` (scripts, `dependencies`, `devDependencies`).
- **Última revisão desta documentação:** 2026-03-02.

### Checklist rápido (quando mudar scripts/deps)
- [ ] Atualizar `docs/ARCHITECTURE.md` (stack, testes e dependências impactadas).
- [ ] Validar se todos os scripts citados existem em `package.json`.
- [ ] Validar se as dependências citadas nos docs existem em `dependencies`/`devDependencies`.
- [ ] Se aplicável, ajustar exemplos/comandos de execução e CI.

## Padrões de arquitetura
- **Organização por domínio/função em `src/`:**
  - `components/` (UI e passos de fluxo)
  - `pages/` (páginas de rota)
  - `state/` (stores e seletores)
  - `rules/engine/` (lógica de cálculo e regras de personagem)
  - `utils/` (utilitários puros)
  - `data/` (catálogos e dados estáticos)
  - `test/` (testes automatizados)
- **Separação de responsabilidades:** cálculo de regras centralizado em `rules/engine`, camada de UI em `components/pages`, e estado em `state`.
- **Arquitetura orientada a funções puras para regras:** módulos de cálculo isolados (ex.: `calc*.ts`) e função agregadora (`recalcAll.ts`).
- **Cobertura de lógica por testes unitários:** suíte dedicada para engine e validações em `src/test`.

## Regras que devem ser seguidas
1. **Não alterar comportamento funcional sem alinhamento explícito.**
2. **Manter separação de camadas existente** (`rules/engine`, `state`, `components`, `data`, `utils`).
3. **Toda lógica nova deve ser testável e coberta por testes automáticos** (Vitest).
4. **Evitar acoplamento da UI com regra de negócio:** regras devem permanecer em módulos de engine/utils.
5. **Usar TypeScript com tipagem explícita quando necessário** para reduzir ambiguidades.
6. **Atualizações de dependências devem ser refletidas no `package.json` e lockfile correspondente.**
