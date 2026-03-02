# CANONICAL_SPECS — Fonte Operacional do Projeto

Este documento é a referência interna definitiva para regras, nomenclaturas e contagens operacionais do projeto.
Toda implementação deve seguir exclusivamente este arquivo com cobertura integral do **PHB 2024** para os domínios já implementados no produto.

## Fontes de referência

- **Fonte absoluta:** `DnD 5.5 - Livro do Jogador (2024).pdf`
- **Documento operacional:** `D&D 5.5 - Livro do Jogador (2024) 5.1.docx`

---

## 1) Raças (10) — cobertura integral

### Anão
- Tamanho: Médio
- Deslocamento: 9m
- Visão no Escuro
- Resistência a Veneno
- Idiomas: Comum + Anão
- Sem sub-raça obrigatória

### Elfo
- Tamanho: Médio
- Deslocamento: 9m
- Visão no Escuro
- Idiomas: Comum + Élfico
- Escolha obrigatória (`raceChoice.requiredCount = 1`):
  - Alto Elfo
  - Elfo Silvestre
  - Drow

### Pequenino
- Tamanho: Pequeno
- Deslocamento: 7,5m
- Sorte
- Idiomas: Comum + Halfling
- Sem sub-raça obrigatória

### Humano
- Tamanho: Médio
- Deslocamento: 9m
- Versátil
- Idiomas: Comum + 1 idioma à escolha
- Choice Engine: `languages.requiredCount += 1 (source: race:humano)`

### Gnomo
- Tamanho: Pequeno
- Deslocamento: 9m
- Visão no Escuro
- Idiomas: Comum + Gnômico
- Escolha obrigatória (`raceChoice.requiredCount = 1`):
  - Gnomo das Rochas
  - Gnomo do Bosque

### Draconato
- Escolha obrigatória (`raceChoice.requiredCount = 1`):
  - Ancestralidade Dracônica (define resistência + sopro)

### Golias
- Escolha obrigatória (`raceChoice.requiredCount = 1`):
  - Gigante da Colina
  - Gigante da Pedra
  - Gigante da Geada
  - Gigante das Nuvens
  - Gigante de Fogo
  - Gigante da Tempestade

### Orc
- Tamanho: Médio
- Deslocamento: 9m
- Visão no Escuro
- Idiomas: Comum + Orc
- Sem sub-raça obrigatória

### Tiferino
- Tamanho: Médio
- Deslocamento: 9m
- Resistência a Fogo
- Idiomas: Comum + Infernal
- Sem sub-raça obrigatória

### Aasimar
- Tamanho: Médio
- Deslocamento: 9m
- Visão no Escuro
- Mãos Curativas
- Portador da Luz
- Consumo Celestial (com escolha de manifestação)

**Diretriz de cobertura:** as 10 raças devem manter texto descritivo integral, traços completos e subopções/choices obrigatórias quando aplicável.

---

## 2) Origens (Antecedentes) (16) — estrutura final

Lista canônica:
- Acólito
- Andarilho
- Artesão
- Artista
- Charlatão
- Criminoso
- Eremita
- Escriba
- Fazendeiro
- Guarda
- Guia
- Marinheiro
- Mercador
- Nobre
- Sábio
- Soldado

Cada antecedente concede:
- 2 perícias fixas
- 1 Talento de Origem
- Equipamentos iniciais

Alguns antecedentes também concedem:
- 1 idioma à escolha
- 1 ferramenta de artesão à escolha
- 1 instrumento musical à escolha

Choice Engine deve detectar strings como:
- “um idioma à sua escolha”
- “uma ferramenta à sua escolha”
- “um instrumento musical à sua escolha”

**Diretriz de cobertura:** as 16 origens devem seguir a estrutura final (descrição, perícias, talento de origem, ferramentas/idiomas quando houver, equipamento) com escolhas corretas e validadas.

---

## 3) Classes (12) — progressão completa

- Bárbaro
- Bardo
- Bruxo
- Clérigo
- Druida
- Feiticeiro
- Guardião
- Guerreiro
- Ladino
- Mago
- Monge
- Paladino

**Diretriz de cobertura:** as 12 classes devem manter progressão completa de características em todos os níveis previstos pelo PHB 2024 (1–20), incluindo `coreTraits`, `featuresByLevel`, escolhas obrigatórias e regras de conjuração por classe.

---

## 4) Perícias por classe (nível 1)

- Bárbaro: escolha 2
- Bardo: escolha 3
- Bruxo: escolha 2
- Clérigo: escolha 2
- Druida: escolha 2
- Feiticeiro: escolha 2
- Guardião: escolha 3
- Guerreiro: escolha 2
- Ladino: escolha 4
- Mago: escolha 2
- Monge: escolha 2
- Paladino: escolha 2

Choice Engine:
- `skills.requiredCount += classSkillCount`

---

## 5) Conjuração

### Classes conjuradoras no nível 1
- Bardo
- Bruxo
- Clérigo
- Druida
- Feiticeiro
- Mago

### Classes que iniciam conjuração no nível 2
- Paladino
- Guardião

### Truques no nível 1
- Bardo: 2
- Bruxo: 2
- Clérigo: 3
- Druida: 2
- Feiticeiro: 4
- Mago: 3

### Magias conhecidas / preparadas
- Mago: 6 no grimório
- Feiticeiro: 2 conhecidas
- Bardo: 4 conhecidas
- Bruxo: 2 conhecidas
- Clérigo/Druida: preparadas = modificador + nível
- Paladino: começa no nível 2
- Guardião: começa no nível 2

Choice Engine:
- `cantrips.requiredCount = conforme classe`
- `spells.requiredCount = conforme classe e nível`

---

## 6) Talentos (capítulo 5)

### Talentos de Origem
- Cada antecedente concede 1 talento de origem obrigatório.

### Estilo de Luta
- **Guerreiro:**
  - Nível 1: escolher 1 talento da categoria `fighting_style`
- **Guardião:**
  - Nível 2: escolher 1 talento `fighting_style`
  - OU opção alternativa `Combatente Druídico`

Choice Engine:
- `feats.requiredCount += 1 (source: class)`

---

## 7) Bardo — instrumentos

- Bardo deve escolher 3 instrumentos musicais.

Choice Engine:
- `instruments.requiredCount += 3 (source: class:bardo)`

---

## 8) Equipamento inicial

- Cada classe deve possuir:
  - Opção A
  - Opção B
  - OU alternativa em ouro
- Antecedentes concedem equipamentos fixos.
- Nenhuma escolha de equipamento ocorre antes da etapa **Equipamentos**.
- Se algum equipamento estiver ausente, a auditoria DEV deve gerar `ERROR`.

---

## 9) Idiomas à escolha

Detectados em:
- Humano
- Alguns antecedentes
- Possíveis talentos

Choice Engine:
- `languages.requiredCount += X`

---

## 10) Ferramentas / instrumentos à escolha

Detectados em:
- Bardo
- Artesão
- Artista
- Outros antecedentes

Choice Engine:
- `tools.requiredCount += X`
- `instruments.requiredCount += X`

---

## 11) Regras de UX

As escolhas abaixo devem ocorrer na etapa **Escolhas**:
- Perícias
- Truques
- Magias
- Idiomas
- Ferramentas
- Instrumentos
- Talentos obrigatórios

Se houver pendência:
- Etapa **Escolhas** fica bloqueada.

Ficha:
- Somente revisão final.
- Nunca exige escolhas obrigatórias.

---

## 12) Validações automáticas e relatórios

- Tudo deve funcionar por ID, nunca por `name`.
- As validações automatizadas devem permanecer alinhadas aos scripts oficiais de auditoria e cobertura:
  - `scripts/validate_classes_against_docx.mjs` → `docs/classes_audit.md`
  - `scripts/validate_races_against_docx.mjs` e `scripts/validate_races_2024.ts` → `docs/races_audit.md`
  - `scripts/validate_backgrounds_against_docx.mjs` → `docs/backgrounds_audit.md` (inclui origens)
  - `scripts/validate_canon.ts` → `docs/spells_audit.md`
  - `scripts/check_extraction_coverage.mjs` → `docs/extraction_coverage.md`
- Divergências entre dados, auditorias e cobertura devem gerar erro explícito de validação.
