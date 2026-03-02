# Inventory Report (dados, steps e estado global)

## 1) Arquivos de dados canônicos

### Núcleo do builder
- `src/data/classes.ts` — classes, subclasses, progressão, proficiências, spellcasting e escolhas por classe.
- `src/data/races.ts` — raças, sub-raças, bônus de atributo, idiomas e escolhas raciais.
- `src/data/backgrounds.ts` — antecedentes (origens), perícias, ferramentas, idiomas, talentos e equipamentos iniciais.
- `src/data/spells.ts` — catálogo de magias e metadados para filtros/seleção.
- `src/data/items.ts` — catálogo de itens/equipamentos, inventário e estruturas de ataque/equipado.

### Dados de suporte (aplicáveis ao fluxo atual)
- `src/data/tools.ts` — ferramentas e placeholders de escolha (`choose_*`) + opções de desdobramento (`toolChoiceOptions`).
- `src/data/instruments.ts` — lista de instrumentos usada em escolhas de classe (ex.: Bardo).
- `src/data/skills.ts` — referência de perícias (nome/atributo), usada para rendering/validação de escolha.
- `src/data/languagesCommon.ts` — idiomas comuns com IDs canônicos usados no pipeline de `choiceSelections`.
- `src/data/languages.ts` — base mais ampla de idiomas (comuns/exóticos), atualmente complementar.

### Índice central
- `src/data/index.ts` reexporta os datasets canônicos e os índices derivados (ponto único recomendado para consumo transversal).

---

## 2) Mapeamento dos Steps (`src/components/steps/*`) e consumo de dados

> Mapeamento de rota de step no app:
> `class -> StepClass`, `origin -> StepBackground`, `race -> StepRace`, `abilities -> StepAbilityMethod`, `equipment -> StepEquipment`, `choices -> StepChoices`, `sheet -> StepSheet`.

### `StepClass.tsx` (Step: `class`)
Consome:
- `classes` (fonte primária da etapa)
- `instruments` (escolhas de instrumento da classe, especialmente bardo)
- `getChoicesRequirements` (normalização de pendências)

Estado impactado (principal):
- `class`, `subclass`, `classFeatureChoices`, `classEquipmentChoice`, `proficiencies`, `features`, `spells`.

### `StepBackground.tsx` (Step: `origin`)
Consome:
- `backgrounds` (fonte primária)
- `feats` (talento de origem)
- `toolsById` + `toolChoiceOptions` (`tools.ts`)
- `skillsByName` (`skills.ts`)
- `commonLanguages` (`languagesCommon.ts`)
- `getChoicesRequirements`

Estado impactado (principal):
- `background`, `origin.*`, `backgroundToolChoice`, `backgroundAbilityChoices`, `backgroundEquipmentChoice`, `backgroundEquipmentItems`, `features`, `proficiencies`.

### `StepRace.tsx` (Step: `race`)
Consome:
- `races` (fonte primária)
- `getChoicesRequirements` + chave canônica de escolha racial

Estado impactado (principal):
- `race`, `subrace`, `raceLineage`, `raceChoices`, `raceAbilityChoices`, `racialBonuses`, `speed`, `features`, `proficiencies`.

### `StepAbilityMethod.tsx` (Step: `abilities`)
Consome:
- `classes` (efeitos/feature sync em mudanças relevantes)
- `backgrounds` (efeitos/feature sync)

Estado impactado (principal):
- `abilityGeneration`, `abilityScores`, confirmações e recálculo derivado.

### `StepEquipment.tsx` (Step: `equipment`)
Consome:
- `items`, `itemsById` (`items.ts`)
- `classes`, `backgrounds`
- `getChoicesRequirements`
- utilitários de equipamento (`calcArmorClass`, `buildAttacks`, `isArmorProficient`)

Estado impactado (principal):
- `equipment`, `inventory`, `equipped`, `attacks`, `armorClass`, `gold`, escolhas de equipamento de classe/origem.

### `StepChoices.tsx` (Step: `choices`)
Consome:
- `classes`, `backgrounds`, `races`, `spells`
- `getChoicesRequirements` (bucketização geral)
- `spellsByClass` utils (filtros de magia por classe)

Estado impactado (principal):
- `choiceSelections.*` (skills/languages/tools/instruments/cantrips/spells/raceChoice/classFeats)
- espelho em `classSkillChoices`, `selectedCantrips`, `selectedSpells`, `spells`.

### `StepSheet.tsx` (Step: `sheet`)
Consome:
- Não consome dataset canônico diretamente.
- Atua como gate de completude via `validateCharacterCompleteness` e renderiza `StepReview`.

### `StepReview.tsx` (dentro do Step `sheet`)
Consome:
- `races`, `classes`, `backgrounds`, `spells`, `itemsById`, `featsById`
- Usado para revisão final/export/import e auditoria visual da ficha.

### `StepSkills.tsx` (componente de apoio, fora do pipeline principal atual)
Consome:
- `classes`, `backgrounds`, `races`
- Rendering consolidado de perícias/proficiências/fontes.

---

## 3) Mapeamento de estado global

Arquivos-base:
- `src/state/characterStore.ts` (estado de personagem + ações)
- `src/state/builderStore.ts` (estado de navegação/etapas + requisitos)
- `src/state/types.ts` (tipos de seleção/estado compartilhado)

### 3.1 Raça / subescolha / linhagem
- Campos: `race`, `subrace`, `raceLineage`, `raceChoices`, `raceAbilityChoices`, `racialBonuses`.
- Ações principais: `selectRace`, `selectRaceLineage`, `patchCharacter`.
- Normalização cruzada:
  - `sanitizeChoiceSelections` espelha `raceChoice -> raceLineage` e limpa/normaliza buckets.

### 3.2 Classe
- Campos: `class`, `subclass`, `classFeatureChoices`, `hitDie`, `savingThrows`, `proficiencies`, `features`.
- Também influencia `spells`, `classEquipmentChoice`, `classSkillChoices` e progressões derivadas.

### 3.3 Origem (antecedente)
- Campos: `background`, `backgroundToolChoice`, `backgroundAbilityChoices`,
  `backgroundEquipmentChoice`, `backgroundEquipmentItems`, `backgroundGold`, `origin`.
- `origin` agrega: `background`, `skillsGranted`, `toolGranted`, `originFeat`, `startingEquipment`.

### 3.4 Atributos
- Campos-base: `abilityGeneration`, `abilityScores`.
- Bônus acumulados: `racialBonuses`, `backgroundBonuses`, `asiBonuses`, `featAbilityBonuses`.
- Derivados: `abilityMods` (e efeitos derivados por `recalcAll`).

### 3.5 Perícias (concedidas vs escolhidas)
- Concedidas/fixas entram por raça, classe, origem e features em `skills`.
- Escolhidas pelo usuário ficam em:
  - `classSkillChoices` (espelho operacional)
  - `choiceSelections.classSkills` (fonte canônica de seleção atual)
- `sanitizeChoiceSelections` reconcilia buckets e garante consistência entre campos.

### 3.6 Ferramentas
- Proficiências finais em `proficiencies.tools`.
- Seleções do usuário em `choiceSelections.tools` (incluindo placeholders resolvidos por UI).

### 3.7 Idiomas escolhíveis
- Seleções em `choiceSelections.languages` (IDs).
- Em `sanitizeChoiceSelections`, IDs são convertidos para nomes via `commonLanguages` e mesclados em `proficiencies.languages` (com `Comum` assegurado e idiomas fixos preservados).

### 3.8 Magias escolhidas
- Seleções explícitas:
  - `choiceSelections.cantrips`
  - `choiceSelections.spells`
- Espelhos operacionais:
  - `selectedCantrips`, `selectedSpells`
  - `spells.cantrips`, `spells.prepared`
- Ações: `toggleCantrip`, `toggleSpell` (ambas passam por saneamento + recálculo).

### 3.9 Equipamentos
- Estado de alto nível: `equipment` (lista simplificada), `inventory` (entradas completas), `equipped` (slots), `attacks`, `gold`.
- Escolhas relacionadas ao fluxo: `classEquipmentChoice`, `backgroundEquipmentChoice`, `backgroundEquipmentItems`, `backgroundGold`.

### 3.10 Estado do fluxo de UI (builder)
- `builderStore` guarda `currentStep`, `completedSteps`, `requiredMissing`, `choicesRequirements`.
- `updateChoicesRequirements` usa `getChoicesRequirements(characterStore)` para manter pendências e obrigatoriedades por step.

---

## 4) Pontos frágeis de UI para entrada de novos dados

1. **Dependência de IDs hardcoded por classe/race em condicionais de render**
   - Ex.: blocos específicos para `bardo`, `clerigo`, `druida` e lógica especial de linhagem élfica.
   - Risco: inclusão de novos casos exige alteração de código (não apenas dados).

2. **Condições opcionais profundas (`?.`) em várias etapas**
   - Ex.: acesso a `subrace?.languages`, `cls?.spellcasting`, `bg?.tools` etc.
   - Risco: novos formatos parcialmente preenchidos podem “sumir” na UI sem erro explícito.

3. **Acoplamento entre `choiceSelections` e campos espelho legados/operacionais**
   - `sanitizeChoiceSelections` atualiza múltiplos campos derivados (`classSkillChoices`, `raceLineage`, `selectedCantrips`, `selectedSpells`, `spells.*`, `proficiencies.languages`).
   - Risco: patch parcial em campo espelho pode ser sobrescrito no próximo saneamento.

4. **Memo/effect sensíveis a dependências de objeto inteiro**
   - Ex.: hooks com dependência em `char` completo (ou muitos campos) para recalcular requisitos.
   - Risco: rerender/recompute excessivo e comportamento difícil de prever ao ampliar datasets.

5. **Mapeamento de idioma por `commonLanguages` apenas**
   - `choiceSelections.languages` é resolvido por lookup em `commonLanguages`.
   - Risco: idioma novo presente em outro dataset (ex.: `languages.ts`) pode não aparecer em `proficiencies.languages` se não existir no mapa comum.

6. **Placeholders de ferramenta (`choose_*`) exigem resolução de UI**
   - Estrutura depende de `toolChoiceOptions`; sem opção correspondente, a escolha fica incompleta/ambígua.

7. **Validação de completude depende de regra central + flags de step**
   - `StepSheet` e outros steps marcam completo/incompleto por validações e `requiredMissing`.
   - Risco: novo campo obrigatório de dados sem integrar em `getChoicesRequirements`/`validateCharacterCompleteness` gera falso positivo de conclusão.

