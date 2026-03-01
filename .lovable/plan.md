# Relatório Completo — D&D 2024 Character Builder (PT-BR)

---

## 1. Erros, Falhas e Inconsistências

### 1.1 Erros de Build (Críticos — App não compila)

**A) `backgrounds.ts` — Função `mk` com tipos inexistentes (linhas 66-91)**
A função `mk` referencia tipos `ToolGrant` e `OriginFeat` que nunca foram definidos no arquivo. Além disso, usa propriedades (`abilityScores`, `grantedTool`, `equipment`) que não existem na interface `Background`. Essa função **nunca é chamada** — é código morto que gera erros de compilação. **Solução:** Remover a função `mk` inteira (linhas 66-91).

**B) `backgrounds.ts` — `makeBackground` exige campos legados no input**
O tipo `Omit<Background, "abilityBonuses" | "equipmentChoices">` ainda exige `skills`, `grantedSkills`, `tools` e `originFeat` — campos que o `makeBackground` já computa automaticamente. **Solução:** Alterar a assinatura para `Omit<Background, "abilityBonuses" | "equipmentChoices" | "skills" | "grantedSkills" | "tools" | "originFeat">`.

**C) `data/index.ts` — Exporta `OriginFeat` de `backgrounds` (inexistente)**
Linha 9 exporta `type OriginFeat` que não existe em `backgrounds.ts`. **Solução:** Remover `type OriginFeat` da re-exportação.

**D) `data/index.ts` — Exporta `toolsByName` de `tools` (inexistente)**
Linha 13 exporta `toolsByName` mas `tools.ts` só exporta `toolsById`. **Solução:** Substituir `toolsByName` por `toolsById`.

**E) `test/fixtures.ts` — Campos obrigatórios ausentes**
`makeCharacter` não inclui `raceLineage`, `backgroundToolChoice`, `origin`, `backgroundEquipmentItems`, `backgroundGold`, `selectedCantrips`, `selectedSpells` que são required em `CharacterState`. **Solução:** Adicionar os campos faltantes com valores padrão no `makeCharacter`.

**F) `StepBackground.tsx` — Acessa `bg.grantedTool` (inexistente)**
Linha 70 faz `bg.grantedTool.mode` mas `Background` não tem `grantedTool`. **Solução:** Remover essa lógica e usar `bg.toolsGranted` com `startsWith("choose_")` para determinar se é fixo ou escolha.

### 1.2 Erros de Runtime

**G) `StepBackground` — `Cannot read properties of undefined (reading 'mode')**`
Consequência direta do item F acima. Ao selecionar um background, o código tenta ler `bg.grantedTool.mode` que é `undefined`.

### 1.3 Inconsistências de Dados e Lógica

**H) Interface `Background` mistura campos canônicos com legados**
A interface tem campos duplicados: `skillsGranted` vs `skills`, `toolsGranted` vs `tools`, `originFeatId` vs `originFeat`. Os campos legados (`skills`, `grantedSkills`, `tools`, `originFeat`) são gerados pelo `makeBackground` mas poluem a interface.

**I) `validation.ts` — `spellAbility` aponta para step `equipment` (linha 284-285)**
Quando o atributo de conjuração não está definido, a validação direciona o usuário para a etapa "equipment" (5) em vez de "choices" (6), onde magias são configuradas.

**J) `StepChoices` — `charSnapshot` usa `getState()` fora de hook**
Linha 123: `useCharacterStore.getState()` é chamado no corpo do componente, criando um snapshot estático que não atualiza com mudanças do store. Deveria usar um selector.

**K) `StepChoices` — `useEffect` de validação com deps inconsistentes**
Linhas 382-386: O `useEffect` inclui `requirements` (objeto inteiro) que muda a cada render, mas também `requirements.needsStep` separadamente, gerando execuções desnecessárias.

**L) `SummaryPanel` — `isSpellcaster` pode ser `true` para não-conjuradores**
Linha 72: `cls?.spellcasting !== null` retorna `true` quando `cls` é `undefined` (nenhuma classe selecionada). Deveria ser `cls?.spellcasting != null`.

---

## 2. Sugestões de Adições e Correções

### 2.1 Correções Prioritárias

1. **Remover função `mk` morta** em `backgrounds.ts` — resolve 3+ erros de build de uma vez
2. **Corrigir assinatura de `makeBackground**` — elimina todos os erros TS2739 nos 16 backgrounds
3. **Corrigir exports em `data/index.ts**` — remover `OriginFeat`, trocar `toolsByName` por `toolsById`
4. **Corrigir `StepBackground` linha 70** — substituir `bg.grantedTool.mode` por verificação via `toolsGranted`
5. **Adicionar campos faltantes em `test/fixtures.ts**`

### 2.2 Adições Sugeridas

6. **Dark/Light mode toggle** — o CSS só define tema dark; adicionar variáveis light e toggle no Header
7. **Exportar para PDF** — além de JSON e texto, gerar PDF com layout de ficha oficial
8. **Undo/Redo** — usar `zustand/middleware` temporal para desfazer escolhas
9. **Validação visual no sidebar** — indicar com ícones de erro etapas com problemas de build (não só pendências)
10. **Responsividade da etapa de Magias** — o max-height fixo de 400px (linha 597 StepChoices) pode cortar conteúdo em telas pequenas

---

## 3. Melhorias de UI/UX

### 3.1 Navegação e Fluxo

- **Barra de progresso global** — adicionar barra de progresso no topo mostrando % de etapas completas
- **Botão "Voltar"** — não há botão "Voltar" visível ao lado do "Próximo" no `StepHeader`; só o sidebar permite navegar para trás
- **Confirmação ao trocar de raça/classe** — ao mudar uma escolha fundamental, avisar que seleções dependentes serão perdidas

### 3.2 Feedback ao Usuário

- **Toast de salvo** — o `lastSavedAt` é mostrado no Header mas sem destaque visual; adicionar indicador de "salvando..." transitório
- **Contador de pendências no Header** — mostrar badge com total de pendências no cabeçalho
- **Tooltip em opções desabilitadas** — explicar POR QUE uma opção está desabilitada (ex: "Limite de truques atingido")

### 3.3 Acessibilidade

- **Labels em inputs** — vários inputs usam apenas `placeholder` sem `<label>` associado (ex: busca em StepBackground)
- **Ordem de foco** — o `tabIndex={-1}` no container de step ativo pode confundir leitores de tela
- **Contraste** — textos `text-muted-foreground` sobre `bg-secondary` podem ter contraste insuficiente no tema dark

---

## 4. Melhorias Visuais

### 4.1 Layout Geral

- **Sidebar colapsável em desktop** — permitir esconder o sidebar para dar mais espaço ao conteúdo
- **Summary panel responsiva** — no mobile, o painel de resumo é um Sheet lateral; poderia ser um bottom sheet com swipe-up para melhor ergonomia
- **Animações de transição entre steps** — adicionar `framer-motion` para slide/fade ao trocar de etapa

### 4.2 Cards e Componentes

- **Cards de seleção (raça/classe/background)** — adicionar ícone/ilustração representativo para cada opção para facilitar reconhecimento visual
- **Separadores visuais entre seções** — usar dividers ou spacing mais generoso no StepChoices que é muito denso
- **Badges de status** — usar cores mais distintas: verde sólido para completo, amarelo para parcial, cinza para não-iniciado (atualmente tudo é outline/default)
- **Spell cards** — os cards de magia são muito compactos; adicionar cor de borda baseada na escola de magia e ícone por escola

### 4.3 Tema e Paleta

- **Paleta monocromática** — o tema usa vermelho (`--primary: 0 72% 51%`) como cor primária e accent; considerar uma segunda cor complementar (dourado/âmbar) para diferenciar CTAs de elementos decorativos
- **Hover states** — muitos botões de seleção usam `hover:bg-secondary` que é quase imperceptível no tema dark; usar hover mais contrastante
- **Typography** — adicionar uma fonte display/serif para títulos (h1, h2) para criar hierarquia visual mais forte; o body sans-serif está correto

### 4.4 Ficha Final (StepReview)

- **Layout de ficha oficial** — reorganizar a revisão final em formato mais próximo da ficha de D&D oficial (2 colunas, com seção de identidade proeminente)
- **Print stylesheet** — a rota `/print` existe mas o CSS `print:p-2` é mínimo; criar stylesheet dedicado para impressão com layout otimizado

---

## Resumo de Prioridades

```text
┌─ CRÍTICO (app não funciona) ────────────────────────┐
│ 1. Remover função mk morta          → backgrounds.ts │
│ 2. Corrigir makeBackground type     → backgrounds.ts │
│ 3. Corrigir exports                 → data/index.ts  │
│ 4. Corrigir bg.grantedTool          → StepBg.tsx     │
│ 5. Corrigir fixtures                → fixtures.ts    │
├─ ALTO (bugs de runtime) ────────────────────────────┤
│ 6. isSpellcaster check              → SummaryPanel   │
│ 7. spellAbility stepId errado       → validation.ts  │
│ 8. charSnapshot estático            → StepChoices    │
├─ MÉDIO (UX/DX) ─────────────────────────────────────┤
│ 9. Barra de progresso global                         │
│ 10. Botão Voltar visível                             │
│ 11. Tooltips em opções desabilitadas                 │
├─ BAIXO (visual polish) ─────────────────────────────┤
│ 12. Ícones nas cards de seleção                      │
│ 13. Transições entre etapas                          │
│ 14. Cor complementar na paleta                       │
│ 15. Layout de ficha oficial na revisão               │
└──────────────────────────────────────────────────────┘
```