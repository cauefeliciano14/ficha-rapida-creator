

## Plano: Converter para Layout de Pagina Unica (estilo dndcharactermaker-react)

### O que o app de referencia faz

O `dndcharactermaker-react` usa uma **pagina unica scrollavel** onde todas as secoes ficam empilhadas verticalmente e visiveis ao mesmo tempo, sem wizard ou etapas. Cada secao e um componente independente (Raca, Classe, Alinhamento, Background, Stats, Proficiencias, Equipamento, Idiomas, Traits, PDF). Quando o usuario troca uma selecao pai (ex: troca de raca), os dados dependentes sao resetados automaticamente (idiomas limpos, etc).

### Mudancas propostas

#### 1. Nova pagina Index - Layout de pagina unica
Substituir o wizard (`BuilderContent` com `DashboardShell` + stepper) por uma pagina scrollavel com todas as secoes empilhadas em cards colapsaveis, com um sumario fixo no topo ou lateral.

```text
┌──────────────────────────────────────┐
│  Header + Identidade do Personagem   │
├──────────────────────────────────────┤
│  [Classe]        ← secao expandida   │
│  [Origem/Background]                 │
│  [Raca]                              │
│  [Atributos]                         │
│  [Equipamentos]                      │
│  [Escolhas (pericias, idiomas...)]   │
│  [Ficha / Exportar PDF]             │
├──────────────────────────────────────┤
│  Resumo lateral (xl) ou bottom (sm)  │
└──────────────────────────────────────┘
```

#### 2. Auto-reset de dados dependentes no characterStore
Adicionar logica no Zustand store para que ao mudar selecoes-chave, dados dependentes sejam limpos:
- **Trocar classe** → limpar equipamento, pericias de classe, magias, escolhas de classe
- **Trocar raca** → limpar idiomas raciais, bônus raciais
- **Trocar background** → limpar idiomas de background, proficiencias de background, bônus de background

#### 3. Secoes colapsaveis com progresso inline
Cada secao sera um `CollapsibleSection` que mostra um indicador de completude (checkmark verde) e pode ser aberta/fechada independentemente. O usuario pode preencher em qualquer ordem.

#### 4. Barra de progresso global + validacao
Manter a barra de progresso existente, mas calcular com base nas secoes completas (nao etapas do wizard). Mostrar erros de validacao inline em cada secao.

#### 5. Sumario de combate sticky
O card de resumo (CA, PV, Prof.) fica sticky no topo durante o scroll em desktop, e como bottom-sheet em mobile.

### Arquivos a modificar/criar

| Arquivo | Acao |
|---------|------|
| `src/pages/Index.tsx` | Reescrever para pagina unica com secoes |
| `src/components/layout/SinglePageShell.tsx` | Novo shell de layout |
| `src/state/characterStore.ts` | Adicionar auto-reset em setClass, setRace, setBackground |
| `src/state/builderStore.ts` | Simplificar - remover logica de wizard steps |
| `src/components/SidebarSteps.tsx` | Converter para navegacao por ancora (scroll-to-section) |
| `src/components/CollapsibleSection.tsx` | Atualizar para suportar indicador de completude |

### Detalhes tecnicos

- Cada secao usa `id="section-{nome}"` para scroll-to via sidebar
- `IntersectionObserver` destaca a secao ativa na sidebar
- Os step components existentes (`StepClass`, `StepRace`, etc.) sao reutilizados dentro dos collapsiveis
- A logica de auto-reset usa `subscribeWithSelector` do Zustand para reagir a mudancas de `class`, `race`, `background`
- Framer Motion para animacoes de expand/collapse

