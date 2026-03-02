Aqui está a proposta detalhada para a reestruturação de UI/UX, focando em um design system orgânico e uma arquitetura de informação aprimorada. Este documento servirá como guia para as próximas fases de implementação.

# Proposta de Reestruturação de UI/UX: Criador de Ficha de Personagem D&D

## 1. Princípios de Design Fundamentais

Para atender à demanda por uma interface mais **orgânica, organizada e com um fluxo step-by-step aprimorado**, os seguintes princípios guiarão a reestruturação:

*   **Clareza e Hierarquia Visual:** As informações mais importantes devem ser imediatamente perceptíveis. Utilizaremos tamanho, peso, cor e contraste para estabelecer uma hierarquia clara, guiando o olhar do usuário de forma intuitiva.
*   **Consistência e Previsibilidade:** Manteremos padrões visuais e de interação em todo o aplicativo. Elementos semelhantes devem se comportar de maneira semelhante, reduzindo a carga cognitiva do usuário e tornando a navegação mais previsível.
*   **Imersão Temática Funcional:** Aprofundaremos o tema dark medieval não apenas na estética, mas na funcionalidade. Elementos visuais e interações devem evocar a atmosfera de D&D, mas sempre servindo a um propósito claro de usabilidade, evitando excessos que possam distrair.
*   **Feedback Intuitivo e Imediato:** Cada ação do usuário deve gerar uma resposta clara e compreensível. Isso inclui estados de hover, seleção, carregamento e validação, que serão visualmente distintos e informativos.
*   **Organização Orgânica e Agrupamento Lógico:** As informações serão agrupadas de forma natural e coesa, eliminando a sensação de estarem "jogadas". Utilizaremos cards, seções e espaçamento para criar blocos de conteúdo que se relacionam logicamente.
*   **Navegação Guiada e Fluxo Contínuo:** O processo step-by-step será uma jornada clara e envolvente. Validações robustas, indicadores de progresso detalhados e transições suaves garantirão que o usuário se sinta sempre no controle e ciente de seu avanço.

## 2. Arquitetura de Informação por Componente Principal

### 2.1. Header (`Header.tsx`)

O `Header` continuará sendo a barra de navegação global, mas com foco em informações de status e acesso rápido:

*   **Nome do Personagem e Nível:** Sempre visíveis, com um ícone de estrela dourada para o nome e o nível em numerais romanos.
*   **Status de Salvamento:** Mais proeminente, com feedback visual claro (ícone de check verde e timestamp) para tranquilizar o usuário.
*   **Acesso Rápido:** Botões para configurações ou outras funcionalidades globais, se houver, serão discretos e temáticos.

### 2.2. Sidebar de Etapas (`SidebarSteps.tsx`)

A `SidebarSteps` será o principal painel de progresso e navegação, fornecendo uma visão clara da jornada:

*   **Barra de Progresso Visual:** Mais detalhada, com um gradiente que representa o avanço e um contador "X de Y etapas" sempre visível.
*   **Indicadores de Estado por Etapa:**
    *   **Ativa:** Destaque visual forte (borda, fundo, texto em dourado/vermelho) e um ícone animado (ex: pulso suave).
    *   **Concluída:** Ícone de check verde e texto em tom de sucesso, com um resumo conciso da escolha feita (ex: "Guerreiro Nível 1", "Elfo da Floresta").
    *   **Com Pendências:** Ícone de alerta e tooltip detalhando as pendências, incentivando a correção.
    *   **Próxima Disponível:** Ícone de chama dourada, convidando o usuário a prosseguir.
*   **Resumo Conciso:** Abaixo do nome da etapa, um resumo da escolha feita (ex: "Classe: Guerreiro", "Raça: Elfo da Floresta"), para que o usuário não precise clicar para ver o que já escolheu.

### 2.3. IdentityHeader (`IdentityHeader.tsx`)

Este componente será integrado de forma mais fluida ao layout principal, talvez como uma seção fixa acima do conteúdo da etapa, exibindo informações cruciais do personagem de forma compacta e sempre visível:

*   **Informações Essenciais:** Nome, Raça, Classe e Nível, apresentados de forma elegante e temática.
*   **Feedback Visual:** Ícones e cores que representam o estado de cada informação (ex: ícone de estrela para nome, ícone de espada para classe).

### 2.4. SummaryPanel (`SummaryPanel.tsx`)

O `SummaryPanel` será transformado em uma ficha de personagem dinâmica e interativa, onde o usuário pode ver o impacto de suas escolhas em tempo real:

*   **Organização por Seções:** Atributos, Perícias, Equipamentos, Magias, etc., cada um em sua própria seção clara e expansível.
*   **Cards de Atributos:** Redesenhados com um visual mais robusto, talvez com um fundo de pergaminho ou metal, e efeitos de hover que destacam o valor e o modificador.
*   **Feedback em Tempo Real:** Ao fazer uma escolha em uma etapa, o `SummaryPanel` deve atualizar-se com uma animação sutil, mostrando o impacto daquela escolha (ex: bônus de atributo, novas perícias).
*   **Tabs Temáticas:** As tabs para Stats, Ações, Magias, Inventário terão ícones mais elaborados e um indicador de seleção dourado.

### 2.5. Conteúdo das Etapas (Ex: `StepClass.tsx`, `StepRace.tsx`, `StepBackground.tsx`, `StepAbilityMethod.tsx`)

Cada etapa será reestruturada para ser uma experiência de preenchimento de formulário mais guiada e visualmente rica:

*   **Título e Descrição da Etapa:** Claros e concisos, explicando o objetivo da etapa.
*   **Agrupamento de Informações:** Utilizar cards ou painéis para agrupar opções relacionadas. Por exemplo, em `StepRace`, ter um card para "Escolha de Raça" e outro para "Bônus de Atributo Racial".
*   **Cards de Seleção Aprimorados:**
    *   **Feedback Visual:** Efeitos de hover e seleção mais sofisticados (ex: bordas que brilham, fundo que se preenche com um gradiente suave, ícones de check animados).
    *   **Informações Essenciais:** Cada card deve exibir as informações mais relevantes de forma compacta (ex: para raças, tamanho, deslocamento; para classes, dado de vida, habilidades primárias).
    *   **Detalhes Expansíveis:** Informações mais extensas (descrições longas, características) podem ser acessadas via um botão "Detalhes" ou um tooltip, evitando poluir a interface principal.
*   **Validação Integrada:** Mensagens de erro e pendências devem ser exibidas de forma clara e próxima ao campo ou opção que precisa de atenção, com sugestões de correção.
*   **Drag-and-Drop (StepAbilityMethod):** Melhorar a visualização dos "chips" de valores e dos "slots" de atributos, com animações de arrastar e soltar mais fluidas e feedback visual de onde o item pode ser solto.

## 3. Design System - Expansão e Refinamento

### 3.1. Cores

Refinar a paleta existente para incluir tons mais ricos e profundos, com um foco maior em contrastes sutis e brilhos:

*   **Dourado (`--gold`):** Mais presente como cor de destaque para elementos interativos, ícones de sucesso e bordas de seleção.
*   **Bronze/Cobre:** Introduzir tons terrosos para elementos secundários, como fundos de cards ou divisores.
*   **Cinzas Escuros e Pretos:** Aprofundar os tons de fundo para criar uma tela mais dramática e destacar os elementos dourados e vermelhos.
*   **Acentos:** Manter o vermelho (`--primary`) para ações principais e o verde (`--success`) para feedback positivo, mas com saturação e brilho ajustados para o tema.

### 3.2. Tipografia

*   **`Cinzel`:** Mantida para títulos, cabeçalhos de seção e elementos de destaque, reforçando o tema épico.
*   **`Inter` (ou similar):** Para o corpo do texto, garantindo legibilidade e clareza em todos os tamanhos de tela. Ajustar peso e espaçamento para otimizar a leitura.

### 3.3. Componentes UI

*   **Cards de Seleção:** Padronizar um estilo de card com bordas que reagem ao hover e à seleção, utilizando sombras e glows sutis. O ícone de check será mais integrado ao design do card.
*   **Botões:** Diferenciar claramente botões primários (ações de avanço), secundários (ações de voltar/cancelar) e terciários (detalhes/informações), com estilos visuais distintos e feedback de hover.
*   **Inputs e Formulários:** Campos de entrada com bordas mais definidas, estados de foco claros e mensagens de validação integradas de forma não intrusiva.
*   **Tooltips e Popovers:** Estilo mais refinado, com fundos escuros e texto claro, usados consistentemente para fornecer informações adicionais sem sobrecarregar a interface.

### 3.4. Animações e Microinterações

*   **Transições de Etapa:** Animações suaves de `fade-in` e `slide-in` para o conteúdo das etapas, tornando a navegação mais fluida.
*   **Feedback de Seleção:** Animações de `pulse` ou `border-glow` para cards selecionados, confirmando a escolha do usuário.
*   **Carregamento:** Indicadores de carregamento mais temáticos (ex: ícone de ampulheta girando, ou um `Loader2` com cor dourada).
*   **Hover States:** Efeitos de elevação, brilho ou mudança de cor para elementos interativos, tornando a interface mais responsiva e "viva".

### 3.5. Layout Responsivo

*   **Priorização de Conteúdo:** Em telas menores, o `SummaryPanel` e a `SidebarSteps` serão acessíveis via `Sheet` (como já implementado), mas com os estilos visuais aprimorados.
*   **Adaptação de Cards:** Cards de seleção e outros elementos se adaptarão para ocupar o espaço disponível, mantendo a legibilidade e a interatividade.
*   **Navegação Mobile:** A barra de progresso e os botões de navegação mobile serão mais intuitivos e fáceis de usar com o polegar.

## 4. Próximos Passos

Com esta arquitetura de informação e design system definidos, as próximas fases se concentrarão na implementação dessas melhorias, começando pela reestruturação do layout principal e navegação, seguida pela refatoração detalhada de cada etapa do criador de personagem.

---
