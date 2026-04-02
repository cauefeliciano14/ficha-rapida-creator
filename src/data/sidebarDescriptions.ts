/**
 * Descrições para o painel lateral (sidebar) da ficha de personagem,
 * seguindo o padrão do D&D Beyond.
 */

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  'Acrobacia':
    'Acrobacia (Destreza) cobre sua tentativa de se manter de pé em uma situação complicada, como quando você está tentando correr sobre uma superfície de gelo, se equilibrar em uma corda bamba ou ficar de pé no convés de um navio durante uma tempestade.',
  'Arcanismo':
    'Arcanismo (Inteligência) mede sua habilidade de lembrar conhecimentos sobre magias, itens mágicos, símbolos arcanos, tradições mágicas, os planos de existência e os habitantes desses planos.',
  'Atletismo':
    'Atletismo (Força) cobre situações difíceis que você encontra ao escalar, saltar ou nadar. Exemplos incluem escalar paredes escorregadias, saltar longas distâncias ou nadar contra correntezas fortes.',
  'Atuação':
    'Atuação (Carisma) determina o quão bem você consegue encantar uma audiência com música, dança, atuação, contação de histórias ou alguma outra forma de entretenimento.',
  'Enganação':
    'Enganação (Carisma) permite que você convença de forma convincente alguém de algo que não é verdade, ou use um disfarce de forma convincente. Inclui enganar, blefar e dar informações ambíguas.',
  'Furtividade':
    'Furtividade (Destreza) permite que você tente se esconder de inimigos, se esgueirar por guardas, escapar sem ser notado ou se aproximar de alguém sem ser visto ou ouvido.',
  'História':
    'História (Inteligência) mede sua habilidade de lembrar conhecimentos sobre eventos históricos, pessoas lendárias, reinos antigos, disputas passadas, guerras recentes e civilizações perdidas.',
  'Intimidação':
    'Intimidação (Carisma) permite que você influencie alguém através de ameaças explícitas, ações hostis e violência física. Exemplos incluem tentar extrair informações de um prisioneiro ou convencer bandidos a recuar.',
  'Intuição':
    'Intuição (Sabedoria) determina se você pode identificar as verdadeiras intenções de uma criatura, como ao procurar uma mentira ou prever o próximo movimento de alguém. Envolve ler a linguagem corporal e hábitos de fala.',
  'Investigação':
    'Investigação (Inteligência) permite que você procure pistas e faça deduções baseadas nelas. Você pode deduzir a localização de um objeto escondido, discernir de uma ferida que tipo de arma a causou, ou determinar o ponto mais fraco em um túnel.',
  'Lidar com Animais':
    'Lidar com Animais (Sabedoria) determina se você consegue acalmar um animal domesticado, impedir que uma montaria se assuste ou intuir as intenções de um animal. Também é usado para controlar sua montaria em manobras arriscadas.',
  'Medicina':
    'Medicina (Sabedoria) permite que você tente estabilizar um companheiro moribundo ou diagnosticar uma doença. Também pode ser usada para determinar a causa da morte de uma criatura.',
  'Natureza':
    'Natureza (Inteligência) mede sua habilidade de lembrar conhecimentos sobre terreno, plantas e animais, o clima e ciclos naturais.',
  'Percepção':
    'Percepção (Sabedoria) permite que você detecte a presença de algo. Ela mede sua consciência geral do seu entorno e a acuidade dos seus sentidos. Um teste de Percepção pode ser usado para ouvir uma conversa atrás de uma porta ou avistar algo escondido.',
  'Persuasão':
    'Persuasão (Carisma) permite que você influencie alguém ou um grupo de pessoas com tato, graça social ou boa índole. Normalmente, a persuasão é usada ao agir de boa fé, para promover a boa vontade ou fazer pedidos.',
  'Prestidigitação':
    'Prestidigitação (Destreza) cobre tentativas de truques de mão ou artimanha manual, como plantar algo em alguém, esconder um objeto em sua pessoa ou realizar pequenos truques de mão.',
  'Religião':
    'Religião (Inteligência) mede sua habilidade de lembrar conhecimentos sobre divindades, ritos e orações, hierarquias religiosas, símbolos sagrados e as práticas de cultos secretos.',
  'Sobrevivência':
    'Sobrevivência (Sabedoria) permite que você siga rastros, busque alimento, encontre uma trilha, identifique sinais de criaturas próximas, preveja o tempo ou evite perigos naturais.',
};

export const SAVING_THROW_DESCRIPTION =
  'Um teste de resistência — também chamado de save — representa uma tentativa de resistir a uma magia, uma armadilha, um veneno, uma doença ou uma ameaça similar. Você normalmente não decide fazer um teste de resistência; é forçado a fazê-lo porque seu personagem ou monstro está em risco.\n\nPara fazer um teste de resistência, role um d20 e adicione o modificador de habilidade apropriado. Por exemplo, você usa seu modificador de Destreza para um teste de resistência de Destreza.\n\nUm teste de resistência pode ser modificado por um bônus situacional ou penalidade e pode ser afetado por vantagem e desvantagem, conforme determinado pelo Mestre.\n\nCada classe concede proficiência em pelo menos dois testes de resistência. Assim como com proficiências em perícias, proficiência em um teste de resistência permite que um personagem adicione seu bônus de proficiência a testes de resistência feitos usando aquele atributo.';

export const PROFICIENCY_BONUS_DESCRIPTION =
  'Personagens possuem um bônus de proficiência determinado pelo nível, conforme detalhado no capítulo 1. Monstros também possuem este bônus, que está incorporado em seus blocos de estatísticas. O bônus é usado nas regras de testes de habilidade, testes de resistência e jogadas de ataque.\n\nSeu bônus de proficiência não pode ser adicionado a uma única jogada de dado ou outro número mais de uma vez. Por exemplo, se duas regras diferentes dizem que você pode adicionar seu bônus de proficiência a um teste de resistência de Sabedoria, você adiciona o bônus apenas uma vez quando faz o teste.\n\nOcasionalmente, seu bônus de proficiência pode ser multiplicado ou dividido (dobrado ou reduzido pela metade, por exemplo) antes de aplicá-lo. Por exemplo, o recurso Expertise do ladino dobra o bônus de proficiência para certos testes de habilidade. Se uma circunstância sugere que seu bônus de proficiência se aplica mais de uma vez à mesma rolagem, você ainda o adiciona apenas uma vez e o multiplica ou divide apenas uma vez.';

export const SPEED_DESCRIPTION =
  'Deslocamento determina a distância que você pode percorrer ao se mover durante o combate ou viagem. Seu deslocamento base é determinado pela sua espécie. Algumas magias e habilidades podem aumentar ou reduzir temporariamente seu deslocamento.';

export const INITIATIVE_DESCRIPTION =
  'Iniciativa determina a ordem dos turnos durante o combate. Quando o combate começa, cada participante faz um teste de Destreza para determinar seu lugar na ordem de iniciativa. O Mestre faz uma rolagem para cada grupo de criaturas idênticas, de modo que cada membro do grupo age ao mesmo tempo.';

export const AC_DESCRIPTION =
  'Sua Classe de Armadura (CA) representa quão bem seu personagem evita ser ferido em batalha. Sua CA inclui a armadura que você está usando, seu escudo (se tiver) e seu modificador de Destreza. Sem armadura ou escudo, a CA base do seu personagem é 10 + seu modificador de Destreza.';

export const SENSES_DESCRIPTION =
  'Uma verificação passiva é um tipo especial de teste de habilidade que não envolve nenhuma rolagem de dados. Tal verificação pode representar o resultado médio de uma tarefa feita repetidamente, como procurar por portas secretas vez após vez, ou pode ser usada quando o Mestre quer verificar secretamente se os personagens percebem algo.\n\nPara fazer uma verificação passiva, use esta fórmula: 10 + todos os bônus e penalidades que normalmente se aplicariam ao teste.\n\n**Visão no Escuro**\nUma criatura com visão no escuro pode ver na escuridão dentro de um alcance específico. A criatura pode ver em luz fraca dentro desse alcance como se fosse luz intensa, e na escuridão como se fosse luz fraca. Você não pode discernir cores na escuridão, apenas tons de cinza.\n\n**Sentido Cego**\nUma criatura com sentido cego pode perceber seus arredores sem depender da visão, dentro de um raio específico.\n\n**Tremorsense**\nUma criatura com tremorsense pode detectar e localizar a origem de vibrações dentro de um raio específico.';

export const ABILITY_SCORE_DESCRIPTIONS: Record<string, string> = {
  forca: 'Força mede o poder físico bruto de um personagem. Testes de Força cobrem atividades que dependem de força muscular bruta, como escalar, nadar ou quebrar objetos. O modificador de Força é adicionado às jogadas de ataque e de dano quando você usa armas de corpo-a-corpo e armas arremessadas.',
  destreza: 'Destreza mede a agilidade, reflexos e equilíbrio de um personagem. Testes de Destreza cobrem atividades que dependem de agilidade, como equilíbrio, furtividade e ataques à distância. O modificador de Destreza é adicionado à Classe de Armadura e à Iniciativa.',
  constituicao: 'Constituição mede a saúde, stamina e força vital de um personagem. O modificador de Constituição é adicionado aos Pontos de Vida a cada nível. Testes de Constituição geralmente ocorrem quando você tenta sobrepujar uma força física, como segurar sua respiração, resistir a venenos ou suportar efeitos que prejudicam a saúde.',
  inteligencia: 'Inteligência mede a acuidade mental, a precisão de memória e a capacidade de raciocínio de um personagem. Testes de Inteligência cobrem situações em que você tenta lembrar algo, raciocinar ou usar a lógica. O modificador de Inteligência é usado para magias de Mago.',
  sabedoria: 'Sabedoria reflete o quanto um personagem está sintonizado com o mundo ao seu redor e representa a percepção e intuição. Testes de Sabedoria refletem um esforço de leitura do mundo físico e social. O modificador de Sabedoria é usado para magias de Clérigo e Druida.',
  carisma: 'Carisma mede a capacidade de um personagem de interagir efetivamente com os outros. Inclui fatores como confiança e eloquência, e também pode representar um poder atraente ou intimidante. O modificador de Carisma é usado para magias de Bardo, Bruxo e Feiticeiro.',
};

export const HP_DESCRIPTION =
  'Pontos de Vida representam sua resiliência em combate e em outras situações perigosas. Quando seu total de PV chega a 0, você fica inconsciente.\n\n**PV Temporários** são pontos de vida extras que atuam como um escudo, absorvendo dano primeiro. Eles não se acumulam com seus PV atuais; quando você recebe PV temporários e já tem alguns, você decide manter os novos ou os antigos.\n\n**Curar**: Durante uma longa descanso, você recupera todos os seus PV. Magias de cura e outros recursos também podem restaurar PV durante uma aventura.';
