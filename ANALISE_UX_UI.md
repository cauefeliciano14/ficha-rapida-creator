# ANÁLISE UX/UI — Modo Novato vs. Modo Veterano

## 1) Resumo executivo
Esta análise consolida a estratégia de UX/UI para dois perfis de uso no builder: **Novato** (mais contextualização e orientação) e **Veterano** (maior densidade de informação e fluxo acelerado).

A decisão central é manter uma preferência única de auxílio contextual, `beginnerHelp`, com comportamento previsível:

- **Inicia em `true`** (usuário começa no modo com mais ajuda).
- **É persistida** no estado da aplicação (não se perde ao recarregar).
- **Afeta diretamente a exibição de ajuda contextual** em `InfoTooltip/InlineHint`, além de impactar a comunicação e a legibilidade em `Header`, `SummaryPanel` e `StepClass`.

Com isso, o produto oferece onboarding sólido para quem está começando sem bloquear eficiência para quem já domina o fluxo.

---

## 2) Modo Novato / Modo Veterano

### Modo Novato (`beginnerHelp = true`)
Objetivo: reduzir ambiguidade, facilitar descoberta de funcionalidades e diminuir erros de preenchimento.

Características de UX/UI:
- Mais microcopys de orientação.
- Dicas inline em pontos de decisão.
- Tooltips explicativos com contexto imediato.
- Priorização de clareza sobre densidade.

### Modo Veterano (`beginnerHelp = false`)
Objetivo: maximizar velocidade operacional e reduzir ruído visual para usuários recorrentes.

Características de UX/UI:
- Menor carga textual auxiliar.
- Interface mais limpa para escaneamento rápido.
- Menos interrupção cognitiva por dicas contextuais.
- Maior foco em ações primárias.

---

## 3) Análise antes/depois

### 3.1 Densidade de informação
- **Antes:** tendência a uma camada única de auxílio, sem adaptação explícita por perfil.
- **Depois:** densidade adaptável por preferência (`beginnerHelp`), com maior texto contextual para novatos e redução para veteranos.

### 3.2 Hierarquia visual
- **Antes:** elementos de ajuda e conteúdo funcional competiam em alguns trechos.
- **Depois:** o modo novato preserva hierarquia com apoio contextual; o modo veterano reduz blocos auxiliares e reforça foco em seleção/execução.

### 3.3 Orientação no fluxo
- **Antes:** orientação dependia mais de leitura exploratória do usuário.
- **Depois:** o modo novato adiciona sinalização explícita (tooltips/hints), enquanto o veterano mantém o caminho enxuto.

### 3.4 Flexibilidade
- **Antes:** pouca personalização de profundidade de ajuda percebida.
- **Depois:** a preferência permite alternância de comportamento da interface sem quebrar o fluxo principal.

### 3.5 Escaneabilidade
- **Antes:** informação auxiliar podia aumentar ruído para usuários experientes.
- **Depois:** veteranos escaneiam com mais rapidez; novatos recebem pistas suficientes para evitar retrabalho.

---

## 4) Registro explícito de comportamento de `beginnerHelp`

Fica registrado de forma objetiva:

1. `beginnerHelp` **inicia em `true`** por padrão.
2. `beginnerHelp` **é persistido** no estado da aplicação.
3. `beginnerHelp` **afeta**:
   - `InfoTooltip/InlineHint` (exibição de ajuda contextual),
   - `Header` (tom/comunicação de suporte ao usuário),
   - `SummaryPanel` (suporte de leitura/entendimento de estado),
   - `StepClass` (orientação em decisões iniciais críticas do fluxo).

---

## 5) Arquivos criados/alterados

### Criado
- `ANALISE_UX_UI.md`

### Alterado
- Nenhum arquivo de código foi alterado nesta entrega.

---

## 6) Testes realizados

Como esta entrega é documental, foram executadas validações básicas de integridade da alteração:

1. Verificação de presença do arquivo criado.
2. Verificação de status do versionamento para garantir alteração controlada.
3. Verificação textual de referências no código para `beginnerHelp` e componentes relacionados.

