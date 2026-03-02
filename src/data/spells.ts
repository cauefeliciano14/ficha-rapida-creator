export interface SpellData {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: string;
  ritual: boolean;
  concentration: boolean;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  classes: string[];
  classIds?: string[];
  description: string;
  atHigherLevels?: string;
  cantripUpgrade?: string;
  source: { book: string; page: number };
}

const rawSpells: SpellData[] = [
  {
    "id": "acalmar-emocoes",
    "name": "Acalmar Emoções",
    "level": 2,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Clérigo"
    ],
    "description": "Cada Humanoide em uma Esfera de 6 metros de raio centrada em um ponto à sua escolha no alcance da magia deve ser bem-sucedido em uma salvaguarda de Carisma ou é afetado por um dos seguintes efeitos (escolha um para cada criatura):\nA criatura tem Imunidade às condições Amedrontado e Enfeitiçado até que a magia termine. Se a criatura já estiver Amedrontada ou Enfeitiçada, essas condições são suprimidas pela duração da magia.\nA criatura se torna Indiferente às criaturas à sua escolha em relação às quais é Hostil. Essa indiferença encerra se o alvo sofrer dano ou testemunhar os aliados dela sofrendo dano. Quando a magia termina, a atitude da criatura volta ao normal.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "acudir-os-moribundos",
    "name": "Acudir os Moribundos",
    "level": 0,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "4,5 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo",
      "Druida"
    ],
    "description": "Escolha uma criatura no alcance da magia que tenha 0 Pontos de Vida e não esteja morta. A criatura fica Estável.",
    "cantripUpgrade": "Aprimoramento de Truque. O alcance da magia dobra quando você atinge os níveis 5 (9 metros), 11 (18 metros) e 17 (36 metros).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "alarme",
    "name": "Alarme",
    "level": 1,
    "school": "Abjuração",
    "ritual": true,
    "concentration": false,
    "castingTime": "1 minuto ou Ritual",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (um sino e um fio de prata)"
    ],
    "duration": "8 horas",
    "classes": [
      "Guardião",
      "Mago"
    ],
    "description": "Você define um alarme contra intrusão. Escolha uma porta, uma janela ou uma área no alcance da magia que não seja maior do que um Cubo de 6 metros de lados. Até que a magia termine, um alarme o avisa sempre que uma criatura tocar ou entrar na área protegida. Ao conjurar a magia, você pode designar criaturas que não disparam o alarme. Você também escolhe se o alarme é audível ou mental:\nAlarme Mental. Você é alertado por um bipe mental se estiver a menos de 1,5 quilômetro da área protegida. Este bipe o acorda se você estiver dormindo.\nAlarme Sonoro. O alarme produz o som de uma sineta por 10 segundos a até 18 metros da área protegida.\nAliado Extraplanar\n6º Círculo, Invocação (Clérigo)\nTempo de Conjuração: 10 minutos\nAlcance: 18 metros\nComponentes: V, S\nDuração: Instantânea\nVocê implora pela ajuda de uma entidade sobrenatural. Você deve conhecer o ser: um deus, um príncipe demônio ou algum outro ser de poder cósmico. Essa entidade envia um Celestial, um Elemental ou um Ínfero leal a ela para ajudá-lo, fazendo com que a criatura apareça em um espaço desocupado no alcance da magia. Se você souber o nome de uma criatura específica, você pode proferir esse nome quando conjurar a magia para solicitar essa criatura, embora você possa obter uma criatura diferente de qualquer modo (à escolha do Mestre).\nQuando a criatura aparece, ela não é obrigada a comportar-se de uma maneira específica. Você pode pedir que ela realize um serviço em troca de pagamento, mas ela não é obrigada a fazê-lo. A tarefa solicitada pode variar de simples (nos levar voando através do abismo ou nos ajudar a lutar em uma batalha) a complexa (espionar nossos inimigos ou nos proteger durante nossa incursão na masmorra). Você deve ser capaz de se comunicar com a criatura para negociar pelos serviços dela.\nO pagamento pode assumir várias formas. Um Celestial pode exigir uma doação considerável de ouro ou itens mágicos para um templo aliado, enquanto um Ínfero pode exigir um sacrifício vivo ou um presente na forma de um tesouro. Algumas criaturas podem trocar o serviço por uma missão realizada por você.\nUma tarefa que pode ser medida em minutos requer um pagamento no valor de 100 PO por minuto. Uma tarefa medida em horas requer 1.000 PO por hora. Já uma tarefa medida em dias (até 10 dias) requer 10.000 PO por dia. O Mestre pode ajustar esses pagamentos com base nas circunstâncias em que você conjurou a magia. Se a tarefa estiver alinhada com os interesses da criatura, o pagamento pode ser reduzido pela metade ou até mesmo dispensado. Tarefas não perigosas normalmente exigem apenas metade do pagamento sugerido, enquanto tarefas especialmente perigosas podem demandar um pagamento maior. Criaturas raramente aceitam tarefas que parecem suicidas.\nDepois que a criatura conclui a tarefa, ou quando a duração combinada do serviço acaba, a criatura retorna ao seu plano de origem após se reportar a você, se possível. Se você não conseguir chegar a um acordo sobre um preço pelo serviço da criatura, a criatura retorna imediatamente ao seu plano de origem.\nAljava Veloz\n5º Círculo, Transmutação (Guardião)\nTempo de Conjuração: Ação Bônus\nAlcance: Pessoal\nComponentes: V, S, M (uma Aljava no valor de 1 ou mais PO)\nDuração: Concentração, até 1 minuto\nAo conjurar a magia e como uma Ação Bônus até que ela termine, você pode realizar dois ataques com uma arma que dispara Flechas ou Virotes, como um Arco Longo ou uma Besta Leve. A magia gera magicamente a munição necessária para cada ataque. Cada Flecha ou Virote criado pela magia causa dano equivalente ao de munição não mágica do seu tipo e se desintegra imediatamente após atingir ou errar o alvo.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "alterar-se",
    "name": "Alterar-se",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você altera sua forma física. Escolha uma das seguintes opções. Seus efeitos permanecem pela duração da magia, durante a qual você pode executar uma ação Usar Magia para substituir a opção escolhida por uma diferente.\nAdaptação Aquática. Você cria guelras e membranas entre os dedos. Você pode respirar debaixo d'água e recebe um Deslocamento de Natação igual ao seu Deslocamento.\nArmas Naturais. Você cria garras (Cortante), presas (Perfurante), chifres (Perfurante) ou cascos (Contundente). Ao usar seu Ataque Desarmado para causar dano com essa nova forma, ele causa 1d6 pontos de dano do tipo entre parênteses em vez de causar o dano normal para seu Ataque Desarmado, e você usa seu modificador de atributo de conjuração para as jogadas de ataque e dano em vez de usar Força.\nMudar Aparência. Você altera sua aparência. Você decide sua aparência, incluindo altura, peso, traços faciais, som da voz, comprimento e cor do cabelo, entre outras características distintivas. Você pode parecer um membro de outra espécie, embora nenhuma de suas estatísticas mude. Você não pode parecer como uma criatura de um tamanho diferente, e sua forma básica permanece a mesma; se você é bípede, não pode usar essa magia para se tornar quadrúpede, por exemplo. Pela duração da magia, você pode executar uma ação Usar Magia para mudar sua aparência dessa maneira novamente.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "amigos",
    "name": "Amigos",
    "level": 0,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "3 metros",
    "components": [
      "S",
      "M (um pouco de maquiagem)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você emana magicamente um sentimento de amizade em relação a uma criatura à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia. O alvo é bem-sucedido automaticamente se não for um Humanoide, se você estiver lutando contra ele ou se tiver conjurado esta magia nele nas últimas 24 horas.\nA magia encerra se o alvo sofrer dano ou se você realizar uma jogada de ataque, causar dano ou forçar alguém a realizar uma salvaguarda. Quando a magia termina, o alvo sabe que foi Enfeitiçado por você.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "amizade-animal",
    "name": "Amizade Animal",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (um bocado de comida)"
    ],
    "duration": "24 horas",
    "classes": [
      "Bardo",
      "Druida",
      "Guardião"
    ],
    "description": "Escolha como alvo uma Fera à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia. Se você ou um de seus aliados causar dano ao alvo, a magia encerra.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.\nÂncora Planar\n5º Círculo, Abjuração (Bardo, Bruxo, Clérigo, Druida, Mago)\nTempo de Conjuração: 1 hora\nAlcance: 18 metros\nComponentes: V, S, M (uma joia no valor de 1.000 ou mais PO, que a magia consome)\nDuração: 24 horas\nVocê tenta vincular um Celestial, um Elemental, um Feérico ou um Ínfero ao seu serviço. A criatura deve estar no alcance da magia durante todo o período de conjuração. Normalmente, a criatura é primeiro invocada para o centro da versão invertida da magia Círculo Mágico para prendê-la enquanto esta magia é conjurada. Ao concluir a conjuração, o alvo deve ser bem-sucedido em uma salvaguarda de Carisma ou é obrigado a atendê-lo pela duração da magia. Se a criatura foi invocada ou criada por outra magia, a duração daquela magia é estendida para corresponder à duração desta magia.\nUma criatura vinculada deve obedecer aos seus comandos da melhor forma possível. Você pode ordenar que a criatura o acompanhe em uma aventura, proteja um local ou entregue uma mensagem. Se a criatura for Hostil, ela se esforça para distorcer seus comandos para atingir seus próprios objetivos. Se a criatura realizar completamente seus comandos antes que a magia termine, ela viaja até você para relatar esse fato se você estiver no mesmo plano de existência. Se você estiver em um plano diferente, ele retorna ao lugar onde você a vinculou e permanece lá até que a magia termine.\nUsando um Espaço de Magia de Círculo Superior. A duração aumenta com um espaço de magia 6º círculo (10 dias), 7º círculo (30 dias), 8º círculo (180 dias) e 9º círculo (366 dias).\nAnimar Mortos\n3° Círculo, Necromancia (Clérigo, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: 3 metros\nComponentes: V, S, M (uma gota de sangue, um pedaço de carne e uma pitada de pó de osso)\nDuração: Instantânea\nEscolha uma pilha de ossos ou um cadáver de um Humanoide Médio ou Pequeno no alcance da magia. O alvo se torna um Morto-vivo: um Esqueleto se tiver escolhido ossos ou um Zumbi se tiver escolhido um cadáver (veja o apêndice B para os blocos de estatística).\nEm cada um dos seus turnos, você pode executar uma Ação Bônus para comandar mentalmente qualquer criatura que tenha animado com essa magia se a criatura estiver a até 18 metros de você (se você controlar várias criaturas, pode comandar qualquer uma delas ao mesmo tempo, emitindo o mesmo comando para cada uma). Você decide qual ação a criatura realiza e para onde ela se move no próximo turno dela, ou pode emitir um comando geral, como proteger uma câmara ou um corredor. Se você não der nenhum comando, a criatura executa a ação Esquivar e move-se apenas para evitar dano. Uma vez dada uma ordem, a criatura continua a segui-la até que a tarefa seja concluída.\nA criatura fica sob seu controle por 24 horas, após as quais ela deixa de obedecer a qualquer comando que você tenha dado a ela. Para manter o controle da criatura por mais 24 horas, é necessário conjurar essa magia na criatura novamente antes que o período atual de 24 horas termine. Esse uso da magia reafirma seu controle sobre até quatro criaturas que você animou com essa magia em vez de animar uma nova criatura.\nUsando um Espaço de Magia de Círculo Superior. Você anima ou reafirma o controle sobre duas criaturas Mortas-vivas adicionais para cada círculo de espaço de magia acima de 3. Cada uma das criaturas deve vir de um cadáver ou pilha de ossos diferente.\nAnimar Objetos\nUm Braseiro Afetado pela Magia Animar Objetos\n5º Círculo, Transmutação (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nObjetos são animados ao seu comando. Escolha uma série de objetos não mágicos no alcance da magia que não estejam sendo usados ou carregados, não estejam fixados a uma superfície e não sejam Colossais. O número máximo de objetos é igual ao seu modificador de atributo de conjuração. Para este número, um tamanho Médio ou menor conta como um objeto, um alvo Grande conta como dois e um alvo Enorme conta como três.\nCada alvo se anima, faz brotar pernas e se torna um Constructo que usa o bloco de estatísticas do Objeto Animado; esta criatura está sob seu controle até que a magia termine ou até que ela seja reduzida a 0 Pontos de Vida. Cada criatura que você anima com esta magia é uma aliada sua e de seus aliados. Em combate, ele compartilha a contagem de Iniciativa com você e tem o turno dela imediatamente após o seu.\nAté que a magia encerre, você pode executar uma Ação Bônus para comandar mentalmente qualquer criatura que tenha animado com essa magia se a criatura estiver a até 150 metros de você (se você controlar várias criaturas, pode comandar quaisquer delas ao mesmo tempo, emitindo o mesmo comando para cada uma). Se você não der nenhum comando, a criatura executa a ação Esquivar e se move apenas para evitar danos. Quando a criatura é reduzida a 0 Pontos de Vida, ela reverte para sua forma de objeto, e qualquer dano restante é transferido para essa forma.\nUsando um Espaço de Magia de Círculo Superior. O dano de Pancada da criatura aumenta em 1d4 (Médio ou menor), 1d6 (Grande) ou 1d12 (Enorme) para cada círculo de espaço de magia acima de 5.\nObjetos Animados\nConstruto Grande ou Menor, Sem Alinhamento\nCA 15\nPV 10 (Médio ou menor), 20 (Grande), 40 (Enorme)\nDeslocamento 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n16\n+3\n+3\nDes\n10\n+0\n+0\nCon\n10\n+0\n+0\nInt\n3\n-4\n-4\nSab\n3\n-4\n-4\nCar\n1\n-5\n-5\nImunidades Psíquico, Venenoso; Amedrontado, Enfeitiçado, Envenenado, Exaustão, Paralisado\nSentidos Visão às Cegas 9 m, Percepção Passiva 6\nIdiomas Compreende os idiomas que você conhece\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nAções\nPancada. Jogada de Ataque Corpo a Corpo: Bônus igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: Energético igual a 1d4 + 3 (Médio ou menor), 2d6 + 3 + seu modificador de atributo de conjuração (Grande) ou 2d12 + 3 + seu modificador de atributo de conjuração (Enorme).\nAntipatia/Simpatia\n8º Círculo, Encantamento (Bardo, Druida, Mago)\nTempo de Conjuração: 1 hora\nAlcance: 18 metros\nComponentes: V, S, M (uma mistura de vinagre e mel)\nDuração: 10 dias\nAo conjurar a magia, decida se ela cria antipatia ou simpatia, e escolha como alvo uma criatura ou objeto que seja Enorme ou menor. Em seguida, especifique um tipo de criatura, como dragões vermelhos, goblins ou vampiros. Uma criatura do tipo escolhido realiza uma salvaguarda de Sabedoria quando estiver a até 36 metros do alvo. Sua escolha entre antipatia ou simpatia determina o que acontece com uma criatura ao falhar nessa salvaguarda:\nAntipatia: A criatura tem a condição Amedrontado. A criatura Amedrontada deve usar o movimento nos turnos dela para se afastar o máximo possível do alvo, movendo-se pela rota mais segura.\nSimpatia: A criatura tem a condição Enfeitiçado. A criatura Enfeitiçada deve usar o movimento nos turnos dela para chegar o mais próximo possível do alvo, movendo-se pela rota mais segura. Se a criatura estiver a até 1,5 metro do alvo, a criatura não pode se afastar voluntariamente. Se o alvo causar dano à criatura Enfeitiçada, essa criatura deve realizar uma salvaguarda de Sabedoria para encerrar o efeito, conforme descrito abaixo.\nEncerrando o Efeito. Se a criatura Amedrontada ou Enfeitiçada terminar o turno a mais de 36 metros de distância do alvo, a criatura realiza uma salvaguarda de Sabedoria. Em caso de sucesso, a criatura não é mais afetada pelo alvo e fica imune a ele por 1 minuto, após o qual pode ser afetada novamente.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "aprimorar-atributo",
    "name": "Aprimorar Atributo",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (pelo ou uma pena)"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Bardo",
      "Clérigo",
      "Druida",
      "Feiticeiro",
      "Guardião",
      "Mago"
    ],
    "description": "Você toca uma criatura e escolhe Força, Destreza, Inteligência, Sabedoria ou Carisma. Pela duração da magia, o alvo tem Vantagem nos testes de atributo usando o atributo escolhido.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 2. Você pode escolher um atributo diferente para cada alvo.\nAprisionamento\n9º Círculo, Abjuração (Bruxo, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: 9 metros\nComponentes: V, S, M (uma estatueta do alvo no valor de 5.000 ou mais PO)\nDuração: Até ser dissipada\nVocê cria uma restrição mágica para conter uma criatura à sua vista e no alcance da magia. O alvo deve realizar uma salvaguarda de Sabedoria. Em caso de sucesso, o alvo não é afetado e fica imune a esta magia pelas próximas 24 horas. Se falhar, o alvo é aprisionado. Enquanto estiver aprisionado, o alvo não precisa respirar, comer ou beber e não envelhece. Magias de Adivinhação não podem localizar ou perceber o alvo, e ele não pode se teleportar.\nAté que a magia termine, o alvo também é afetado por um dos seguintes efeitos à sua escolha:\nAcorrentar. Correntes firmemente enraizadas ao chão prendem o alvo no lugar. O alvo tem a condição Contido e não pode ser movido de forma alguma.\nContenção Reduzida. O alvo encolhe para 2,5 cm de altura e fica preso dentro de uma pedra preciosa indestrutível ou um objeto semelhante. A luz pode passar pela pedra preciosa (permitindo que o alvo veja o que há fora e outras criaturas de fora possam vê-lo), mas nada mais pode passar por qualquer meio.\nEnterrar. O alvo é enterrado sob a terra em um globo oco de força mágica que é grande o suficiente para contê-lo. Nada pode passar para dentro ou para fora do globo.\nPrisão Cercada. O alvo está preso em um semiplano e está protegido contra teleporte e viagens planares. O semiplano pode ser um labirinto, uma gaiola, uma torre ou algo semelhante à sua escolha.\nTorpor. O alvo está Inconsciente e não pode ser despertado.\nEncerrando a Magia. Ao conjurar a magia, você define uma situação que a encerrará. Essa situação pode ser tão simples ou elaborada quanto você desejar, mas o Mestre deve concordar que existe uma grande probabilidade de isso ocorrer na próxima década. A situação deve ser uma ação observável, como alguém fazendo uma oferenda específica no templo do seu deus, salvando seu verdadeiro amor ou derrotando um monstro específico.\nDissipar Magia só pode encerrar a magia se for conjurada com um espaço de magia de 9º círculo, tendo como alvo a prisão ou o componente usado para criá-la.\nArca Secreta de Leomund\n4º Círculo, Invocação (Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (um baú de 1 m por 60 cm por 60 cm, construído com materiais raros no valor de 5.000 ou mais PO, e uma réplica minúscula do baú fabricada com os mesmos materiais no valor de 50 ou mais PO)\nDuração: Até ser dissipada\nVocê esconde um baú e todo o seu conteúdo no Plano Etéreo. Você deve tocar no baú e na réplica em miniatura que servem como componentes Materiais para a magia. O baú pode armazenar até 340 litros de material não vivo (1 m por 60 cm por 60 cm).\nEnquanto o baú permanecer no Plano Etéreo, você pode executar uma ação Usar Magia e tocar na réplica para recuperar o baú. Ele aparece em um espaço desocupado no chão a até 1,5 metro de você. Você pode enviar o baú de volta ao Plano Etéreo como uma ação Usar Magia para tocar o baú e a réplica.\nApós 60 dias, há uma chance cumulativa de 5% no final de cada dia de que a magia encerre. A magia também se encerra se você conjurá-la novamente ou se a réplica Minúscula for destruída. Se a magia encerrar e o baú maior estiver no Plano Etéreo, o baú permanece lá para você ou outra pessoa encontrar.\nArma Elemental\n3º Círculo, Transmutação (Druida, Guardião, Paladino)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S\nDuração: Concentração, até 1 hora\nUma arma não-mágica que você toca se torna uma arma mágica. Escolha um dos seguintes tipos de dano: Ácido, Elétrico, Gélido, Ígneo ou Trovejante. Pela duração da magia, a arma tem um bônus de +1 para jogadas de ataque e causa 1d4 pontos de dano adicional do tipo escolhido quando atinge.\nUsando um Espaço de Magia de Círculo Superior. Se você usar um espaço de magia de 5º ou 6º círculo, o bônus nas jogadas de ataque aumenta para +2, e o dano adicional aumenta para 2d4. Se você usar um espaço de magia de 7º círculo ou superior, o bônus aumenta para +3 e o dano adicional aumenta para 3d4.\nArma Espiritual",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "arma-magica",
    "name": "Arma Mágica",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 hora",
    "classes": [
      "Feiticeiro",
      "Guardião",
      "Mago",
      "Paladino"
    ],
    "description": "Você toca uma arma não-mágica. Até que a magia encerre, essa arma se torna uma arma mágica com bônus de +1 para jogadas de ataque e dano. A magia encerra se você a conjurar novamente.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O bônus aumenta para +2 com um espaço de magia de 3º–5º círculo. O bônus aumenta para +3 com um espaço de magia de 6º círculo ou superior.\nArmadura Arcana",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "arrombar",
    "name": "Arrombar",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Escolha um objeto à sua vista e no alcance da magia. O objeto pode ser uma porta, uma caixa, um baú, um conjunto de grilhões, um cadeado ou outro objeto que contenha um meio mundano ou mágico que impeça o acesso.\nUm alvo mantido fechado por uma fechadura mundana ou que está preso ou barrado fica destrancado, desemperrado ou desobstruído. Se o objeto tiver várias fechaduras, apenas uma delas é destrancada.\nSe o alvo for mantido fechado por Tranca Arcana, essa magia é suprimida por 10 minutos, durante os quais o alvo pode ser aberto e fechado.\nAo conjurar a magia, um estrondo, audível a até 90 metros de distância, emana do alvo.\nArte Druídica",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "augurio",
    "name": "Augúrio",
    "level": 2,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": false,
    "castingTime": "1 minuto ou Ritual",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (varetas",
      "ossos",
      "cartas ou símbolos semelhantes especialmente marcados no valor de 25 ou mais PO)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo",
      "Druida",
      "Mago"
    ],
    "description": "Você recebe um presságio de uma entidade sobrenatural a respeito dos resultados de um curso de ação que você planeja realizar nos próximos 30 minutos. O Mestre escolhe o presságio da tabela Presságios.\nPresságios\nPresságios\nPara Resultados Que Serão…\nProsperidade\nBons\nInfortúnio\nMaus\nProsperidade e Infortúnio\nBons e ruins\nNada\nNem bons, nem ruins\nA magia não leva em conta circunstâncias, como outras magias, que podem alterar os resultados.\nSe você conjurar a magia mais de uma vez antes de terminar um Descanso Longo, há uma chance cumulativa de 25% para cada conjuração após a primeira de que você não receba resposta.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "aumentar-reduzir",
    "name": "Aumentar/Reduzir",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (uma pitada de ferro em pó)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Pela duração da magia, você amplia ou reduz uma criatura, ou objeto, à sua vista e no alcance da magia (veja o efeito escolhido abaixo). Um objeto à vista não deve ser usado nem transportado. Se o alvo for uma criatura involuntária, ele pode realizar uma salvaguarda de Constituição. Em caso de sucesso, a magia não surte efeito.\nTudo o que uma criatura estiver usando e carregando muda de tamanho com ela. Qualquer item que cair retorna ao tamanho normal de uma só vez. Uma arma ou munição arremessada retorna ao tamanho normal imediatamente após atingir ou errar um alvo.\nAumentar. O tamanho do alvo aumenta em uma categoria — de Médio para Grande, por exemplo. O alvo também tem Vantagem em testes de Força e salvaguardas de Força. Os ataques do alvo com suas armas ampliadas ou Ataques Desarmados causam 1d4 pontos de dano adicionais em caso de acerto.\nReduzir. O tamanho do alvo diminui em uma categoria — de Médio para Pequeno, por exemplo. O alvo também tem Desvantagem em testes de Força e salvaguardas de Força. Os ataques do alvo com suas armas reduzidas ou Ataques Desarmados causam 1d4 pontos de dano a menos em caso de acerto (isso não pode reduzir o dano abaixo de 1).\nAura de Pureza\n4º Círculo, Abjuração (Clérigo, Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Concentração, até 10 minutos\nUma aura irradia de você em uma Emanação de 9 metros pela duração da magia. Enquanto estiver na aura, você e seus aliados têm Resistência a dano Venenoso e Vantagem nas salvaguardas para evitar ou encerrar efeitos que incluem a condição Amedrontado, Atordoado, Cego, Enfeitiçado, Envenenado, Paralisado ou Surdo.\nAura de Vida\n4º Círculo, Abjuração (Clérigo, Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Concentração, até 10 minutos\nUma aura irradia de você em uma Emanação de 9 metros pela duração da magia. Enquanto estiver na aura, você e seus aliados têm Resistência a Dano Necrótico, e seus Pontos de Vida máximos não podem ser reduzidos. Se um aliado com 0 Pontos de Vida começar o turno na aura, esse aliado recupera 1 Ponto de Vida.\nAura de Vitalidade\n3º Círculo, Abjuração (Clérigo, Druida, Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Concentração, até 1 minuto\nUma aura irradia de você em uma Emanação de 9 metros pela duração da magia. Quando você cria a aura e no início de cada um dos seus turnos enquanto ela persiste, você pode restaurar 2d6 Pontos de Vida em uma criatura dentro dela.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "aura-magica-de-nystul",
    "name": "Aura Mágica de Nystul",
    "level": 2,
    "school": "Ilusão",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (um pequeno quadrado de seda)"
    ],
    "duration": "24 horas",
    "classes": [
      "Mago"
    ],
    "description": "Com um toque, você coloca uma ilusão em uma criatura voluntária ou em um objeto que não esteja sendo usado ou carregado. Uma criatura adquire o efeito Máscara descrito abaixo, e um objeto adquire o efeito Falsa Aura descrito abaixo. O efeito permanece pela duração da magia. Se você conjurar a magia na mesma criatura ou objeto todos os dias por 30 dias, a ilusão dura até ser dissipada.\nFalsa Aura (Objeto). Você muda a forma como o alvo aparece para magias e efeitos mágicos que detectam auras mágicas, como Detectar Magia. Você pode realizar um objeto não mágico parecer mágico, realizar um item mágico parecer não mágico ou alterar a aura do objeto para parecer pertencer a uma escola de magia que você escolher.\nMáscara (Criatura). Escolha um tipo de criatura diferente do tipo real do alvo. Magias e outros efeitos mágicos tratam o alvo como se fosse uma criatura do tipo escolhido.\nAura Sagrada\n8º Círculo, Abjuração (Clérigo)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (um relicário no valor de 1.000 ou mais PO)\nDuração: Concentração, até 1 minuto\nPela duração, você emite uma aura em uma Emanação de 9 metros. Enquanto estão dentro da aura, criaturas à sua escolha têm Vantagem em todas as salvaguardas, enquanto as outras têm Desvantagem nas jogadas de ataque contra elas. Além disso, se um Ínfero ou um Morto-Vivo atinge uma criatura afetada em uma jogada de ataque corpo a corpo, o atacante deve ser bem-sucedido em uma salvaguarda de Constituição ou fica Cego até o final do próximo turno dele.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "auxilio",
    "name": "Auxílio",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (uma tira de pano branco)"
    ],
    "duration": "8 horas",
    "classes": [
      "Bardo",
      "Clérigo",
      "Druida",
      "Guardião",
      "Paladino"
    ],
    "description": "Escolha até três criaturas no alcance da magia. Os Pontos de Vida máximos e os Pontos de Vida atuais de cada alvo aumentam em 5 pela duração da magia.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Os Pontos de Vida de cada alvo aumentam em 5 para cada círculo de espaço de magia acima de 2.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1167\" w:name=\"_p7njbmkzwvj7\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1167\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>B",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "badalar-funebre",
    "name": "Badalar Fúnebre",
    "level": 0,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo",
      "Bruxo",
      "Mago"
    ],
    "description": "Você aponta para uma criatura à sua vista e no alcance da magia, então um único toque de um badalar doloroso é audível a até 3 metros do alvo. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou sofre 1d8 pontos de dano Necrótico. Caso o alvo tenha perdido algum de seus Pontos de Vida, em vez de 1d8, ele sofre 1d12 pontos de dano Necrótico.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em um dado quando você atinge os níveis 5 (2d8 ou 2d12), 11 (3d8 ou 3d12) e 17 (4d8 ou 4d12).\nBanimento\n4º Círculo, Abjuração (Bruxo, Clérigo, Feiticeiro, Mago, Paladino)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S, M (um pentagrama)\nDuração: Concentração, até 1 minuto\nUma criatura à sua vista e no alcance da magia deve ser bem-sucedida em uma salvaguarda de Carisma ou é transportada para um semiplano inofensivo pela duração da magia. Enquanto estiver lá, o alvo tem a condição Incapacitado. Quando a magia encerra, o alvo reaparece no espaço que deixou ou no espaço desocupado mais próximo, se o primeiro espaço estiver ocupado.\nSe o alvo for uma Aberração, Celestial, Elemental, Feérico ou Ínfero, o alvo não retorna se a magia durar 1 minuto. Em vez disso, o alvo é transportado para um local aleatório em um plano (à escolha do Mestre) associado ao tipo da criatura.\nUsando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 4.\nBanquete de Heróis\nA magia Banquete dos Heróis prepara os aventureiros para a glória\n6º Círculo, Invocação (Bardo, Clérigo, Druida)\nTempo de Conjuração: 10 minutos\nAlcance: Pessoal\nComponentes: V, S, M (uma tigela incrustada de pedras preciosas no valor de 1.000 ou mais PO, que a magia consome)\nDuração: Instantânea\nVocê conjura um banquete que aparece em uma superfície em um Cubo desocupado de 3 metros de lado próximo a você. O banquete leva 1 hora para ser consumido e desaparece no final dessa duração, e os efeitos benéficos não aparecem até que essa hora passe. Até doze criaturas podem participar do banquete.\nUma criatura que partilha do banquete recebe vários benefícios, que duram 24 horas. A criatura tem Resistência a dano Venenoso e Imunidade às condições Amedrontado e Envenenado. Seus Pontos de Vida máximos também aumentam em 2d10 e recebe o mesmo valor de Pontos de Vida.\nBarreira de Lâminas\n6º Círculo, Evocação (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê cria uma barreira de lâminas rodopiantes formadas de energia mágica. A barreira aparece no alcance da magia e permanece pela duração. Você cria uma barreira reta de até 30 metros de comprimento, 6 metros de altura e 1,5 metro de espessura, ou uma barreira circular de até 18 metros de diâmetro, 6 metros de altura e 1,5 metro de espessura. A barreira oferece Cobertura de Três Quartos e seu espaço é considerado Terreno Difícil.\nQualquer criatura no espaço da barreira realiza uma salvaguarda de Destreza, sofrendo 6d10 pontos de dano Energético se falhar, ou metade desse dano em caso de sucesso. Uma criatura também realiza essa salvaguarda se entrar no espaço da barreira ou terminar seu turno lá. Uma criatura realiza essa salvaguarda apenas uma vez por turno.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "bencao",
    "name": "Bênção",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (um Símbolo Sagrado no valor de 5 ou mais PO)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Clérigo",
      "Paladino"
    ],
    "description": "Você abençoa até três criaturas no alcance da magia. Sempre que um alvo realiza uma jogada de ataque ou uma salvaguarda antes que a magia termine, o alvo adiciona 1d4 à jogada de ataque ou salvaguarda.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "boca-encantada",
    "name": "Boca Encantada",
    "level": 2,
    "school": "Ilusão",
    "ritual": true,
    "concentration": false,
    "castingTime": "1 minuto ou Ritual",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (poeira de jade no valor de 10 ou mais PO",
      "que a magia consome)"
    ],
    "duration": "Até ser dissipada",
    "classes": [
      "Bardo",
      "Mago"
    ],
    "description": "Você implanta uma mensagem em um objeto que esteja no alcance da magia. Essa mensagem é revelada quando uma circunstância de disparo ocorrer. Escolha um objeto à sua vista e que não esteja sendo usado ou carregado por outra criatura. Fale, então, a mensagem, que deve possuir 25 palavras ou menos, embora ela possa ser emitida ao longo de um período de até 10 minutos. Por fim, determine a circunstância de disparo para magia revelar a mensagem.\nQuando tal circunstância ocorrer, uma boca encantada aparece no objeto e recita a mensagem com a sua voz e no mesmo volume que você falou. Se o objeto escolhido tiver uma boca ou algo que se assemelhe (por exemplo, a boca de uma estátua), a boca encantada se sobrepõe para parecer que as palavras saem da boca do próprio objeto. Ao conjurar a magia, você determina se ela se encerra após entregar a mensagem ou se permanece para repetir o conteúdo sempre que a circunstância de disparo ocorrer.\nA circunstância de disparo pode ser tão abrangente ou específica quanto você quiser, mas deve ser baseada em condições visuais ou auditivas que ocorram a até 9 metros do objeto. Por exemplo, você pode instruir a boca a falar sempre que uma criatura se aproxime a até 9 metros do objeto, ou quando um sino de prata soar a até 9 metros de distância do objeto.\nBola de Fogo\nUm elfo Mago demonstra o potencial de resolução de problema da magia Bola de Fogo.\n3º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (uma bola de guano de morcego e enxofre)\nDuração: Instantânea\nUma faixa brilhante emerge de você até um ponto à sua escolha no alcance da magia e, em seguida, desabrocha com um estrondo baixo em uma explosão de fogo. Cada criatura em uma Esfera de 6 metros de raio centrada nesse ponto realiza uma salvaguarda de Destreza, sofrendo 8d6 pontos de dano Ígneo se falhar, ou metade desse dano em caso de sucesso.\nObjetos inflamáveis na área que não estão sendo usados ou carregados entram em combustão.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 3.\nBola de Fogo Adiável\n7º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (uma bola de guano de morcego e enxofre)\nDuração: Concentração, até 1 minuto\nUm feixe de luz amarela dispara de você, depois se condensa em um ponto escolhido no alcance da magia como um grânulo brilhante pela duração da magia. Quando a magia termina, o grânulo explode, e cada criatura em uma Esfera de 6 metros de raio centrada nesse ponto realiza uma salvaguarda de Destreza. Se falhar, uma criatura sofre dano Ígneo igual ao dano total acumulado, ou metade desse dano em caso de sucesso.\nO dano base da magia é 12d6, e o dano aumenta em 1d6 sempre que seu turno termina e a magia não se encerra.\nSe uma criatura tocar o grânulo brilhante antes da magia terminar, ela realiza uma salvaguarda de Destreza. Se falhar, a magia se encerra, fazendo com que o grânulo exploda. Em caso de sucesso, a criatura pode arremessar o grânulo até 12 metros. Se o arremesso atingir o espaço de uma criatura ou colidir com um objeto sólido, a magia se encerra e o grânulo explode.\nQuando o grânulo explode, objetos inflamáveis na explosão que não estão sendo usados ou carregados entram em combustão.\nUsando um Espaço de Magia de Círculo Superior. O dano base aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 7.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "bolha-acida",
    "name": "Bolha Ácida",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria uma bolha ácida em um ponto no alcance da magia, onde ela explode em uma Esfera de 1,5 metro de raio. Cada criatura nessa Esfera deve ser bem-sucedida em uma salvaguarda de Destreza ou sofre 1d6 pontos de dano Ácido.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d6 quando você atinge os níveis 5 (2d6), 11 (3d6) e 17 (4d6).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "bom-fruto",
    "name": "Bom Fruto",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (um ramo de visco)"
    ],
    "duration": "24 horas",
    "classes": [
      "Druida",
      "Guardião"
    ],
    "description": "Dez frutos aparecem em sua mão e são infundidos mágicamente pela duração da magia. Uma criatura pode executar uma Ação Bônus para comer um fruto. Comer um fruto restaura 1 Ponto de Vida e fornece alimento suficiente para sustentar uma criatura por um dia. Frutos não comidos desaparecem quando a magia termina.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "bordao-mistico",
    "name": "Bordão Místico",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (um ramo de visco)"
    ],
    "duration": "1 minuto",
    "classes": [
      "Druida"
    ],
    "description": "Um Cajado ou Clava que você está segurando é imbuído com o poder da natureza. Pela duração da magia, você pode usar seu atributo de conjuração em vez de Força para as jogadas de ataque e dano de ataques corpo a corpo com essa arma, e o dado de dano da arma se torna um d8. Se o ataque causar dano, ele pode ser de dano Energético ou do tipo de dano normal da arma (à sua escolha).\nA magia encerra se você a conjurar novamente ou se soltar a arma.",
    "cantripUpgrade": "Aprimoramento de Truque. O dado de dano muda quando você atinge os níveis 5 (1d10), 11 (1d12) e 17 (2d6).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "bracos-de-hadar",
    "name": "Braços de Hadar",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bruxo"
    ],
    "description": "Clamando por Hadar, você faz com que tentáculos irrompam em você. Cada criatura em uma Emanação de 3 metros originada em você realiza uma salvaguarda de Força. Se falhar, um alvo sofre 2d6 pontos de dano Necrótico e não pode executar Reações até o início do próximo turno dele. Em caso de sucesso, um alvo sofre apenas metade do dano.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 1.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1180\" w:name=\"_ks5mjc336ml9\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1180\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>C\nCaldeirão Borbulhante de Tasha\nA lendária bruxa Tasha usa sua magia, o Caldeirão Borbulhante de Tasha, para produzir uma poção mágica.\n6º Círculo, Invocação (Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 1,5 metro\nComponentes: V, S, M (uma colher de mexer caldeirão dourada no valor de 500 ou mais PO)\nDuração: 10 minutos\nVocê conjura um caldeirão com pés de garra cheio de líquido borbulhante. O caldeirão aparece em um espaço desocupado no chão a até 1,5 metro de você e permanece pela duração da magia. O caldeirão não pode ser movido e desaparece quando a magia termina, junto com o líquido borbulhante dentro dele.\nO líquido no caldeirão copia as propriedades de uma poção Comum ou Incomum à sua escolha (como uma Poção de Cura). Como uma Ação Bônus, você ou um aliado pode alcançar o caldeirão e retirar dele uma poção desse tipo. A poção está contida em um frasco que desaparece quando a poção é consumida. O caldeirão pode produzir um número dessas poções igual ao seu modificador de atributo de conjuração (mínimo 1). Quando a última dessas poções é retirada do caldeirão, o caldeirão desaparece e a magia termina.\nPoções obtidas do caldeirão que não são consumidas desaparecem quando você conjura esta magia novamente.\nCaminhar no Vento\n6º Círculo, Transmutação (Druida)\nTempo de Conjuração: 1 minuto\nAlcance: 9 metros\nComponentes: V, S, M (uma vela)\nDuração: 8 horas\nVocê e até dez criaturas voluntárias à sua escolha no alcance da magia assumem formas gasosas pela duração da magia, aparecendo como fiapos de nuvem. Enquanto estiver nesta forma de nuvem, um alvo tem um Deslocamento de Voo de 90 metros e pode pairar; tem Imunidade à condição Caído; e tem Resistência a dano Contundente, Cortante e Perfurante. As únicas ações que um alvo pode executar nesta forma são a ação Correr ou Usar Magia para começar a reverter à sua forma normal. Reverter leva 1 minuto, durante o qual o alvo tem a condição Atordoado. Até que a magia termine, o alvo pode voltar à forma de nuvem, o que também requer uma ação Usar Magia seguida de uma transformação de 1 minuto.\nSe um alvo estiver em forma de nuvem e voando quando o efeito terminar, ele desce 18 metros por rodada por 1 minuto até pousar, o que faz com segurança. Se não conseguir pousar após 1 minuto, ele cai pela distância restante.\nCaminhar Sobre as Águas\n3º Círculo, Transmutação (Clérigo, Druida, Feiticeiro, Guardião)\nTempo de Conjuração: Ação ou Ritual\nAlcance: 9 metros\nComponentes: V, S, M (um pedaço de cortiça)\nDuração: 1 hora\nEsta magia concede a capacidade de se mover através de qualquer superfície líquida — como ácido, água, areia movediça, lama, lava ou neve — como se fosse um solo sólido inofensivo (criaturas que cruzam a lava derretida ainda podem sofrer dano devido ao calor). Até dez criaturas voluntárias à sua escolha no alcance da magia recebem essa habilidade pela duração da magia.\nUm alvo afetado deve executar uma Ação Bônus para passar da superfície do líquido para dentro dele e vice-versa, mas, se o alvo cair no líquido, ele atravessa a superfície e entra no líquido abaixo.\nCampo Antimagia\n8º Círculo, Abjuração (Clérigo, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (raspas de ferro)\nDuração: Concentração, até 1 hora\nUma aura de antimagia envolve você em uma Emanação de 3 metros. Ninguém pode conjurar magias, executar a ação Usar Magia ou criar outros efeitos mágicos dentro da aura, e esses efeitos não podem ter como alvo ou afetar qualquer coisa dentro dela. As propriedades mágicas dos itens mágicos não funcionam dentro da aura ou em qualquer coisa dentro dela.\nÁreas de efeito criadas por magias ou outros efeitos mágicos não podem se estender para dentro da aura, e ninguém pode se teleportar para dentro ou para fora dela ou usar viagens planares para lá. Os portais se fecham temporariamente enquanto estão na aura.\nMagias em andamento, exceto aquelas conjuradas por um Artefato ou por uma divindade, são suprimidas na área. Enquanto um efeito é suprimido, ele não funciona, mas o tempo que ele gasta suprimido conta para sua duração.\nDissipar Magia não tem efeito sobre a aura, e as auras criadas por diferentes magias de Campo Antimagia não se anulam.\nCão Fiel de Mordenkainen\n4º Círculo, Invocação (Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S, M (um apito de prata)\nDuração: 8 horas\nVocê conjura um cão de guarda fantasmagórico em um espaço desocupado à sua vista e no alcance da magia. O cão permanece pela duração da magia ou até que vocês dois estejam separados por mais de 90 metros.\nNinguém além de você pode ver o cão, e ele é intangível e invulnerável. Quando uma criatura de tamanho Pequeno ou maior se aproxima a 9 metros dele sem antes falar a senha que você especificou ao conjurar essa magia, o cão começa a latir alto. O cão possui Visão Verdadeira com alcance de 9 metros.\nNo início de cada um dos seus turnos, o cão tenta morder um inimigo a até 1,5 metro dele. Esse inimigo deve ser bem-sucedido em uma salvaguarda de Destreza ou sofre 4d8 pontos de dano Energético.\nNos seus turnos subsequentes, você pode executar uma ação Usar Magia para mover o cão até 9 metros.\nCárcere de Energia\n7º Círculo, Evocação (Bardo, Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 30 metros\nComponentes: V, S, M (rubi em pó no valor de 1.500 ou mais PO, que a magia consome)\nDuração: Concentração, até 1 hora\nUma prisão imóvel, invisível e em forma de Cubo composta de força energética surge em torno de uma área à sua escolha no alcance da magia. A prisão pode ser uma jaula ou uma caixa sólida, à sua escolha.\nUma prisão na forma de uma jaula pode ter até 6 metros de lado e é formada com barras de 1,5 centímetro de diâmetro com espaços de 1,5 centímetro entre elas. Uma prisão na forma de caixa pode ter até 3 metros de lado, criando uma barreira sólida que impede que qualquer matéria passe por ela e bloqueia quaisquer magias conjuradas para dentro ou para fora da área.\nAo conjurar a magia, qualquer criatura que esteja completamente na área da jaula fica presa. Criaturas apenas parcialmente dentro da área, ou aquelas grandes demais para caber dentro dela, são empurradas para longe do centro da área até que estejam completamente fora dela.\nUma criatura na jaula não pode deixá-la por meios não mágicos. Se a criatura tentar usar teleporte ou viagem interplanar para sair, ela deve primeiro realizar uma salvaguarda de Carisma. Em caso de sucesso, a criatura pode usar essa magia para sair da jaula. Se falhar, a criatura não sai da jaula e desperdiça a magia ou o efeito. A jaula também se estende para o Plano Etéreo, bloqueando viagens etéreas.\nEsta magia não pode ser dissipada por Dissipar Magia.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "cativar",
    "name": "Cativar",
    "level": 2,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo"
    ],
    "description": "Você tece uma sequência de palavras perturbadoras, fazendo com que criaturas à sua escolha à sua vista e no alcance da magia realizem uma salvaguarda de Sabedoria. Qualquer criatura contra a qual você ou seus companheiros estejam lutando é automaticamente bem-sucedida nesta salvaguarda. Se falhar, um alvo tem uma penalidade de −10 nos testes de Sabedoria (Percepção) e Percepção Passiva até que a magia termine.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "cegueira-surdez",
    "name": "Cegueira/Surdez",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V"
    ],
    "duration": "1 minuto",
    "classes": [
      "Bardo",
      "Clérigo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma criatura à sua vista e no alcance da magia deve ser bem-sucedida em uma salvaguarda de Constituição, ou ela tem a condição Cego ou Surdo (à sua escolha) pela duração da magia. O alvo repete a salvaguarda no final de cada um dos turnos dele, encerrando a magia em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 2.\nCeleridade\n3º Círculo, Transmutação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S, M (uma lasca de raiz de alcaçuz)\nDuração: Concentração, até 1 minuto\nEscolha uma criatura voluntária à sua vista e no alcance da magia. Até que a magia termine, o deslocamento do alvo é dobrado, e ele recebe um bônus de +2 na Classe de Armadura, tem Vantagem em salvaguardas de Destreza e recebe uma ação adicional em cada um de seus turnos. Essa ação pode ser utilizada apenas para executar a ação Atacar (apenas um ataque), Correr, Desengajar, Esconder ou Usar Objeto.\nQuando a magia termina, o alvo fica Incapacitado e tem Deslocamento 0 até o final do próximo turno dele, quando uma onda de letargia passa por ele.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "chama-continua",
    "name": "Chama Contínua",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (rubi em pó no valor de 50 ou mais PO",
      "que a magia consome)"
    ],
    "duration": "Até ser dissipada",
    "classes": [
      "Clérigo",
      "Druida",
      "Mago"
    ],
    "description": "Uma chama brota de um objeto que você toca. O efeito conjura Luz Plena em um raio de 6 metros e Meia-luz por mais 6 metros. Ela se parece uma chama comum, mas não cria calor e não consome combustível. A chama pode ser coberta ou escondida, mas não abafada ou extinta.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "chama-sagrada",
    "name": "Chama Sagrada",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo"
    ],
    "description": "Um brilho semelhante a uma chama desce sobre uma criatura à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Destreza ou sofre 1d8 pontos de dano Radiante. O alvo não recebe nenhum benefício de Cobertura Parcial ou Cobertura de Três Quartos para esta salvaguarda.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d8 quando você atinge os níveis 5 (2d8), 11 (3d8) e 17 (4d8).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "chicote-de-espinhos",
    "name": "Chicote de Espinhos",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (o caule de uma planta espinhosa)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Druida"
    ],
    "description": "Você cria um chicote semelhante a uma videira coberto de espinhos que ataca ao seu comando em direção a uma criatura no alcance da magia. Realize um ataque mágico corpo a corpo contra o alvo. Em caso de acerto, o alvo sofre 1d6 pontos de dano Perfurante e, se for Grande ou menor, você pode puxá-lo até 3 metros mais perto de você.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d6 quando você atinge os níveis 5 (2d6), 11 (3d6) e 17 (4d6).\nChuva de Meteoros\n9º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 1,5 km\nComponentes: V, S\nDuração: Instantânea\nOrbes flamejantes caem do céu em quatro pontos distintos à sua vista e no alcance da magia. Cada criatura em uma Esfera de 12 metros de raio centrada em cada um desses pontos realiza uma salvaguarda de Destreza. Uma criatura sofre 20d6 pontos de dano Ígneo e 20d6 pontos de dano Contundente se falhar, ou metade desse dano em caso de sucesso. Uma criatura na área de mais de uma esfera de fogo é afetada apenas uma vez.\nUm objeto não mágico que não esteja sendo usado ou carregado também sofre o dano se estiver na área da magia, e começa a queimar se for inflamável.\nCírculo da Morte\n6º Círculo, Necromancia (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (o pó de uma pérola negra esmagada no valor de 500 ou mais PO)\nDuração: Instantânea\nUma Esfera de 18 metros de raio de energia negativa parte de um ponto à sua escolha no alcance da magia. Cada criatura nessa área realiza uma salvaguarda de Constituição, sofrendo 8d8 pontos de dano Necrótico se falhar ou metade desse dano em caso de sucesso.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 2d8 para cada círculo de espaço de magia acima de 6.\nCírculo de Poder\n5º Círculo, Abjuração (Clérigo, Mago, Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Concentração, até 10 minutos\nUma aura irradia de você em uma Emanação de 9 metros pela duração da magia. Enquanto estiver na aura, você e seus aliados têm Vantagem em salvaguardas contra magias e outros efeitos mágicos. Quando uma criatura afetada realiza uma salvaguarda contra uma magia ou efeito mágico que permite que sofra apenas metade do dano, ela não sofre dano em caso de sucesso.\nCírculo de Teleporte\n5º Círculo, Invocação (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: 3 metros\nComponentes: V, M (tintas raras no valor de 50 ou mais PO, que a magia consome)\nDuração: 1 rodada\nAo conjurar a magia, você desenha um círculo de 1,5 metro de raio no chão inscrito com símbolos que ligam sua localização a um círculo de teleporte permanente à sua escolha, cuja sequência de símbolos você conhece e que está no mesmo plano de existência que você. Um portal cintilante se abre dentro do círculo que você desenhou e permanece aberto até o final do seu próximo turno. Qualquer criatura que entre no portal aparece instantaneamente a 1,5 metro do círculo de destino ou no espaço desocupado mais próximo, se esse espaço estiver ocupado.\nMuitos dos principais templos, guildas e outros lugares importantes têm círculos de teleporte permanentes. Cada círculo inclui uma sequência de símbolos única — uma sequência de runas dispostas em um determinado padrão.\nAo adquirir a capacidade de conjurar essa magia pela primeira vez, você aprende as sequências de símbolos para dois destinos no Plano Material, escolhidos pelo Mestre. Durante suas aventuras, é possível aprender sequências adicionais. Você pode memorizar um novo símbolo após estudá-lo por 1 minuto.\nVocê pode criar um círculo de teleporte permanente conjurando essa magia no mesmo local todos os dias por 365 dias.\nCírculo Mágico\n3º Círculo, Abjuração (Clérigo, Bruxo, Mago, Paladino)\nTempo de Conjuração: 1 minuto\nAlcance: 3 metros\nComponentes: V, S, M (sal e prata em pó no valor de 100 ou mais PO, que a magia consome)\nDuração: 1 hora\nVocê cria um Cilindro de energia mágica com 3 metros de raio e 6 metros de altura, centrado em um ponto visível e ao alcance no chão. Runas brilhantes surgem onde o Cilindro toca o chão ou outra superfície.\nEscolha um ou mais dos seguintes tipos de criaturas: Celestiais, Elementais, Feéricos, Ínferos ou Mortos-Vivos. O círculo afeta uma criatura do tipo escolhido das seguintes maneiras:\nA criatura não pode entrar voluntariamente no Cilindro por meios não mágicos. Se a criatura tentar usar teleporte ou viagem interplanar para fazer isso, ela deve primeiro ser bem-sucedida em uma salvaguarda de Carisma.\nA criatura tem Desvantagem nas jogadas de ataque contra alvos dentro do Cilindro.\nAlvos dentro do Cilindro não podem ser possuídos ou ter a condição Amedrontado ou Enfeitiçado pela criatura.\nAo conjurar essa magia, você pode fazer com que ela funcione na direção inversa, impedindo que uma criatura do tipo especificado saia do Cilindro e protegendo alvos fora dele.\nUsando um Espaço de Magia de Círculo Superior. A duração aumenta em 1 hora para cada círculo de espaço de magia acima de 3.\nClarividência\n3º Círculo, Adivinhação (Bardo, Clérigo, Feiticeiro, Mago)\nTempo de Conjuração: 10 minutos\nAlcance: 1,5 km\nComponentes: V, S, M (um foco no valor de 100 ou mais PO, seja um chifre adornado com joias e usado para escutar, ou um olho de vidro usado para enxergar)\nDuração: Concentração, até 10 minutos\nVocê cria um sensor Invisível no alcance da magia em um local que lhe seja familiar (um lugar que você já viu ou visitou antes) ou em um local óbvio que não lhe seja familiar (como atrás de uma porta, em uma esquina ou em um bosque). O sensor não pode ser atacado e permanece no lugar pela duração da magia.\nAo conjurar a magia, escolha ver ou ouvir. Você pode usar o sentido escolhido através do sensor como se estivesse em seu espaço. Como uma Ação Bônus, você pode alternar entre ver e ouvir.\nUma criatura que veja o sensor (como uma criatura que se beneficia de Ver o Invisível ou Visão Verdadeira) enxerga uma esfera luminosa do tamanho do seu punho.\nClone\n8º Círculo, Necromancia (Mago)\nTempo de Conjuração: 1 hora\nAlcance: Toque\nComponentes: V, S, M (um diamante no valor de 1.000 ou mais PO, que a magia consome, e um recipiente vedável no valor de 2.000 ou mais PO que seja grande o suficiente para conter a criatura sendo clonada)\nDuração: Instantânea\nVocê toca uma criatura ou pelo menos 2,5 centímetros cúbicos da carne dela. Uma duplicata inerte dessa criatura se forma dentro do recipiente usado na conjuração da magia e termina de crescer após 120 dias; você escolhe se o clone finalizado tem a mesma idade da criatura ou é mais nova. O clone permanece inerte e dura indefinidamente enquanto o recipiente o contém permanecer intacto.\nSe a criatura original morrer após o clone terminar de se formar, a alma da criatura é transferida para o clone se a alma estiver livre e disposta a retornar. O clone é fisicamente idêntico ao original e tem a mesma personalidade, memórias e habilidades, mas nenhum dos equipamentos do original. Os restos originais da criatura, se houver, tornam-se inertes e não podem ser revividos, uma vez que a alma da criatura está em outro lugar.\nColuna de Chamas\n5º Círculo, Evocação (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S, M (uma pitada de enxofre)\nDuração: Instantânea\nUma coluna vertical de fogo brilhante emerge de cima para baixo. Cada criatura em um Cilindro de 3 metros de raio e 12 metros de altura, centrada em um ponto no alcance da magia, realiza uma salvaguarda de Destreza, sofrendo 5d6 pontos de dano Ígneo e 5d6 pontos de dano Radiante se falhar, ou metade desse dano em caso de sucesso.\nUsando um Espaço de Magia de Círculo Superior. O dano Ígneo e o dano Radiante aumentam em 1d6 para cada círculo de espaço de magia acima de 5.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "comando",
    "name": "Comando",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Clérigo",
      "Paladino"
    ],
    "description": "Você profere uma palavra única de comando para uma criatura à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou segue o comando no próximo turno dele. Escolha o comando a partir destas opções:\nAbaixar. O alvo tem a condição Caído e, em seguida, termina o turno.\nAproximar. O alvo se move em sua direção pela rota mais curta e direta, terminando o turno dele se ele se mover a até 1,5 metro de você.\nFugir. O alvo usa o próprio turno se afastando de você pelos meios mais rápidos disponíveis.\nLargar. O alvo solta o que estiver segurando e, em seguida, termina o turno.\nParar. No turno do alvo, ele não se move e não executa nenhuma ação ou Ação Bônus.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher um efeito adicional para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "compreender-idiomas",
    "name": "Compreender Idiomas",
    "level": 1,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (uma pitada de fuligem e sal)"
    ],
    "duration": "1 hora",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Pela duração da magia, você entende o significado literal de qualquer idioma que ouça ou veja escrito. Você também entende qualquer escrita que veja, mas deve estar tocando a superfície na qual as palavras estão escritas. Leva cerca de 1 minuto para ler uma página de texto. Esta magia não decodifica símbolos ou mensagens secretas.\nCompulsão\n4º Círculo, Encantamento (Bardo)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nCada criatura à sua escolha à sua vista e no alcance da magia deve ser bem-sucedida em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado até que a magia termine.\nPela duração da magia, você pode executar uma Ação Bônus para designar uma direção que seja horizontal para você. Cada alvo Enfeitiçado deve usar o máximo possível do movimento dele para se mover nessa direção no turno dele, seguindo o caminho mais seguro. Após se mover desse modo, um alvo repete a salvaguarda, encerrando a magia em caso de sucesso.\nComunhão\n5º Círculo, Adivinhação (Clérigo)\nTempo de Conjuração: 1 minuto ou Ritual\nAlcance: Pessoal\nComponentes: V, S, M (incenso)\nDuração: 1 minuto\nVocê entra em contato com uma divindade ou um representante divino e realiza até três perguntas que podem ser respondidas com sim ou não. Você deve realizar suas perguntas antes que a magia termine. Você recebe uma resposta correta para cada pergunta.\nOs seres divinos não são necessariamente oniscientes, então você pode receber “indeterminado” como resposta se uma pergunta pertencer a informações que estão além do conhecimento da divindade. Em um caso em que uma resposta de uma palavra possa ser enganosa ou contrária aos interesses da divindade, o Mestre pode oferecer uma frase curta como resposta.\nSe você conjurar a magia mais de uma vez antes de terminar um Descanso Longo, há uma chance cumulativa de 25% para cada conjuração após a primeira de que você não receba resposta.\nComunhão com a Natureza\n5º Círculo, Adivinhação (Druida, Guardião)\nTempo de Conjuração: 1 minuto ou Ritual\nAlcance: Pessoal\nComponentes: V, S\nDuração: Instantânea\nVocê comunga com os espíritos da natureza adquirindo conhecimento da área circundante. Ao ar livre, a magia lhe dá conhecimento da área a até 5 quilômetros de você. Em cavernas e outros ambientes subterrâneos naturais, o raio é limitado a 90 metros. A magia não funciona onde a natureza foi substituída por construções, como em castelos e povoados.\nEscolha três dos seguintes fatos; você aprende esses fatos no que se refere à área da magia:\nLocalização de povoados\nLocalização de portais para outros planos de existência\nLocalização de uma criatura de Nível de Desafio 10 ou maior (à escolha do Mestre) que seja Celestial, Elemental, Feérico, Ínfero ou Morto-vivo\nO tipo mais predominante de planta, mineral ou Fera (você escolhe sobre qual aprender)\nLocalização de corpos d'água\nPor exemplo, você pode determinar a localização de um monstro poderoso na área, os locais dos corpos d’água e os locais de quaisquer povoados.\nCone de Frio\nO Mago glacimante Otiluke explode monstros com Cone de Frio.\n5º Círculo, Evocação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (um pequeno cone de cristal ou vidro)\nDuração: Instantânea\nVocê libera uma rajada de ar frio. Cada criatura em um Cone de 18 metros originado em você realiza uma salvaguarda de Constituição, sofrendo 8d8 pontos de dano Gélido se falhar, ou metade desse dano em caso de sucesso. Uma criatura morta por esta magia se torna uma estátua congelada até descongelar.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 5.\nConfusão\n4º Círculo, Encantamento (Bardo, Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (três cascas de nozes)\nDuração: Concentração, até 1 minuto\nCada criatura em uma Esfera de 3 metros de raio centrada em um ponto à sua escolha no alcance da magia deve ser bem-sucedida em uma salvaguarda de Sabedoria, ou esse alvo não pode executar Ações Bônus ou Reações, e deve jogar 1d10 no início de cada um dos turnos dele para determinar o comportamento nesse turno, consultando a tabela abaixo.\n1d10\nComportamento para o Turno\n1\nO alvo não executa uma ação e usa todo o deslocamento para se mover. Jogue 1d4 para a direção: 1, norte; 2, leste; 3, sul; ou 4, oeste.\n2-6\nO alvo não se move ou executa ações.\n7-8\nO alvo não se move e executa a ação Atacar para realizar um ataque corpo a corpo contra uma criatura aleatória ao alcance. Se nenhuma estiver ao alcance, o alvo não executa nenhuma ação.\n9-10\nO alvo escolhe o comportamento dele.\nAo final de cada um dos turnos dele, um alvo afetado repete a salvaguarda, encerrando a magia em caso de sucesso.\nUsando um Espaço de Magia de Círculo Superior. O raio da Esfera aumenta em 1,5 metro para cada círculo de espaço de magia acima de 4.\nConsagrar\n5º Círculo, Abjuração (Clérigo)\nTempo de Conjuração: 24 horas\nAlcance: Toque\nComponentes: V, S, M (incenso no valor de 1.000 ou mais PO, que a magia consome)\nDuração: Até ser dissipada\nVocê toca um ponto e infunde uma área ao seu redor com poder sagrado ou profano. A área pode ter um raio de até 18 metros, e a magia falha se o raio incluir uma área já sob o efeito de Consagrar. A área afetada tem os seguintes efeitos.\nVigília Consagrada. Escolha um tipo de criatura: Aberração, Celestial, Elemental, Feérico, Ínfero ou Morto-Vivo. Criaturas do tipo escolhido não podem entrar voluntariamente na área, e qualquer criatura que esteja possuída por elas, ou tem a condição Amedrontado ou Enfeitiçado por essas criaturas, não será considerada possuída, nem terá as condições Amedrontado ou Enfeitiçado enquanto enquanto estiver na área.\nEfeito Adicional. Você vincula um efeito adicional à área da lista abaixo:\nCoragem. Criaturas de qualquer tipo que você escolher não recebem a condição Amedrontado enquanto estiverem na área.\nDescanso Pacífico. Cadáveres enterrados na área não podem ser transformados em Mortos-vivos.\nEscuridão. Escuridão preenche a área. A luz normal, bem como a luz mágica criada por magias de um círculo inferior a esta magia, não pode iluminar a área.\nIdiomas. Criaturas de qualquer tipo que você escolher podem se comunicar com qualquer outra criatura na área, mesmo que não compartilhem um idioma em comum.\nInterferência Extradimensional. Criaturas de qualquer tipo que você escolher não podem entrar ou sair da área usando teleporte ou viagem interplanar.\nLuz do Dia. Luz Plena preenche a área. Escuridão mágica criada por magias de um círculo inferior a esta magia não pode extinguir a luz.\nMedo. Criaturas de qualquer tipo que você escolher tem a condição Amedrontado enquanto estiverem na área.\nResistência. Criaturas de qualquer tipo que você escolher têm Resistência a um tipo de dano à sua escolha enquanto estiverem na área.\nSilêncio. Nenhum som pode emanar de dentro da área e nenhum som pode adentrá-la.\nVulnerabilidade. Criaturas de qualquer tipo que você escolher têm Vulnerabilidade a um tipo de dano à sua escolha enquanto estiverem na área.\nContágio\n5º Círculo, Necromancia (Clérigo, Druida)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponente: V, S\nDuração: 7 dias\nSeu toque inflige um contágio mágico. O alvo deve ser bem-sucedido em uma salvaguarda de Constituição ou sofre 11d8 pontos de dano necrótico e tem a condição Envenenado. Além disso, escolha um atributo ao conjurar a magia. Enquanto estiver envenenado, o alvo tem Desvantagem em salvaguardas realizadas com o atributo escolhido.\nO alvo deve repetir a salvaguarda no final de cada um dos turnos até obter três sucessos ou fracassos. Se o alvo obtiver três sucessos, a magia encerra para o alvo. Se obter três fracassos, a magia permanece 7 dias sobre ele.\nSempre que o alvo Envenenado receber um efeito que encerre a condição Envenenado, ele deve ser bem-sucedido em uma salvaguarda de Constituição, ou a condição Envenenado não encerra nele.\nContato Extraplanar\n5º Círculo, Adivinhação (Bruxo, Mago)\nTempo de Conjuração: 1 minuto ou Ritual\nAlcance: Pessoal\nComponentes: V\nDuração: 1 minuto\nVocê entra em contato mentalmente com um semideus, com o espírito de um sábio morto há muito tempo ou com alguma outra entidade conhecedora de outro plano. Entrar em contato com essa inteligência sobrenatural pode fragmentar sua mente. Ao conjurar essa magia, realize uma salvaguarda de Inteligência CD 15.\nEm caso de sucesso, você pode realizar até cinco perguntas à entidade. Você deve realizar suas perguntas antes que a magia termine. O Mestre responde a cada pergunta com uma palavra, como “sim”, “não”, “talvez”, “nunca”, “irrelevante” ou “indeterminado” (se a entidade não souber a resposta à pergunta). Se a resposta com uma palavra for enganosa, o Mestre pode, em vez disso, oferecer uma frase curta como resposta.\nSe falhar, você sofre 6d6 pontos de dano Psíquico e tem a condição Incapacitado até completar um Descanso Longo. Uma magia Restauração Maior conjurada em você encerra esse efeito.\nContingência\n6º Círculo, Abjuração (Mago)\nTempo de Conjuração: 10 minutos\nAlcance: Pessoal\nComponentes: V, S, M (uma estatueta de si mesmo incrustada de pedras preciosas no valor de 1.500 ou mais PO)\nDuração: 10 dias\nEscolha uma magia de 5º círculo ou inferior que você possa conjurar, que tenha um tempo de conjuração de uma ação e que possa ter você como alvo. Você conjura essa magia — chamada de magia contingente — como parte da conjuração de Contingência, gastando espaços de magia para ambas, mas a magia contingente não entra em efeito. Em vez disso, ela é ativada quando ocorre um determinado gatilho. Você descreve esse gatilho quando conjura as duas magias. Por exemplo, uma Contingência conjurada com Respirar na Água pode estipular que Respirar na Água é ativada quando você é envolvido por água ou um líquido semelhante.\nA magia contingente ativa-se imediatamente após o gatilho ocorrer pela primeira vez, quer você queira ou não, e então a Contingência termina.\nA magia contingente tem efeito apenas em você, mesmo que normalmente possa ter como alvo outros. Você pode usar apenas uma magia Contingência por vez. Se você conjurar esta magia novamente, o efeito de outra magia Contingência em você encerra. Além disso, a Contingência encerra em você se o componente material da magia não estiver em sua pessoa.\nContramagia\n3º Círculo, Abjuração (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Reação, que você executa quando vê uma criatura a até 18 metros de você conjurando uma magia com componentes Verbais, Somáticos ou Materiais\nAlcance: 18 metros\nComponentes: S\nDuração: Instantânea\nVocê tenta interromper uma criatura no processo de conjurar uma magia. A criatura realiza uma salvaguarda de Constituição. Se falhar, a magia se dissipa sem efeito, e a ação, Ação Bônus ou Reação usada para conjurá-la é desperdiçada. Se a magia do alvo foi conjurada com um espaço de magia, o espaço de magia da criatura não é gasto.\nControlar Água\n4º Círculo, Transmutação (Clérigo, Druida, Mago)\nTempo de Conjuração: Ação\nAlcance: 90 metros\nComponentes: V, S, M (uma mistura de água e poeira)\nDuração: Concentração, até 10 minutos\nAté que a magia termine, você controla qualquer água dentro de uma área escolhida em um Cubo de até 30 metros de lado, usando um dos seguintes efeitos. Como uma ação Usar Magia em seus turnos posteriores, você pode repetir o mesmo efeito ou escolher um diferente.\nDividir Água. Você divide a água na área e cria uma trincheira. A trincheira se estende pela área da magia, e a água separada forma uma parede de cada lado. A trincheira permanece até que a magia termine ou você escolha um efeito diferente. A água então preenche lentamente a trincheira ao longo da próxima rodada até que o nível normal de água seja restaurado.\nInundação. Você faz com que o nível de toda a água parada na área suba em até 6 metros. Se você escolher uma área em um grande corpo d'água, você cria uma onda de 6 metros de altura que viaja de um lado da área para o outro e depois quebra. Quaisquer veículos Enormes ou menores no caminho da onda são carregados com ela para o outro lado. Qualquer veículo Enorme ou menor atingido pela onda tem 25% de chance de emborcar.\nO nível da água permanece elevado até que a magia termine ou você escolha um efeito diferente. Se esse efeito produziu uma onda, a onda se repete no início do seu próximo turno enquanto o efeito de inundação permanecer.\nRedemoinho. Você faz com que um redemoinho se forme no centro da área, que deve ser pelo menos uma área quadrada de 15 metros de lados e 7,5 metros de profundidade. O redemoinho dura até que você escolha um efeito diferente ou a magia termine. O redemoinho tem 1,5 metro de largura na base, até 15 metros de largura no topo e 7,5 metros de altura. Qualquer criatura na água e a até 7,5 metros do redemoinho é puxada a 3 metros em sua direção. Quando uma criatura entra no redemoinho pela primeira vez em um turno ou termina o turno lá, ela realiza uma salvaguarda de Força. Se falhar, a criatura sofre 2d8 pontos de dano Contundente. Em caso de sucesso, a criatura sofre metade do dano. Uma criatura só pode nadar para longe do redemoinho se primeiro usar uma ação para se afastar e for bem-sucedida em um teste de Força (Atletismo) contra a CD para evitar sua magia.\nRedirecionar Fluxo. Você faz com que a água corrente na área se mova na direção que você escolher, mesmo que a água tenha que fluir sobre obstáculos, paredes ou em outras direções improváveis. A água na área se move à medida que você a direciona, mas uma vez que ela se move além da área da magia, ela retoma seu fluxo com base no terreno. A água continua a se mover na direção que você escolheu até que a magia termine ou você escolha um efeito diferente.\nControlar o Clima\nUm Dragão de Latão conjura Controlar o Clima para salvar uma comunidade de uma tempestade destrutiva.\n8º Círculo, Transmutação (Clérigo, Druida, Mago)\nTempo de Conjuração: 10 minutos\nAlcance: Pessoal\nComponentes: V, S, M (um incenso aceso)\nDuração: Concentração, até 8 horas\nVocê assume o controle do clima a até 8 quilômetros de você pela duração da magia. Você deve estar ao ar livre para conjurar esta magia, e ela encerra se você for para áreas internas.\nAo conjurar a magia, você altera a condição climática atual, determinada pelo Mestre. Você pode alterar a precipitação, a temperatura e o vento. Leva 1d4 x 10 minutos para as novas condições do clima entrarem em vigor. Depois que elas se estabelecerem, você pode alterar as condições novamente. Quando a magia termina, o clima volta gradualmente ao normal.\nAo alterar as condições meteorológicas, encontre uma condição atual nas tabelas a seguir e altere o estágio em um, para cima ou para baixo. Ao mudar o vento, você pode alterar a direção dele.\nPrecipitação\nEstágio\nCondição\n1\nLimpo\n2\nNuvens leves\n3\nNublado ou com neblina\n4\nChuva, granizo ou neve\n5\nChuva torrencial, tempestade de granizo ou nevasca\nTemperatura\nEstágio\nCondição\n1\nCalor insuportável\n2\nQuente\n3\nAmeno\n4\nFresco\n5\nFrio\n6\nFrio extremo\nVento\nEstágio\nCondição\n1\nCalmo\n2\nVento moderado\n3\nVento forte\n4\nVendaval\n5\nTempestade\nConvocar Celestial\n5º Círculo, Invocação (Clérigo, Paladino)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um relicário no valor de 500 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca um Espírito Celestial. Ele se manifesta em uma forma angelical em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Celestial. Ao conjurar a magia, escolha Defensor ou Vingador. Sua escolha determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ele obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Celestial\nCelestial Grande, Neutro\nAC 11 + o círculo da magia + 2 (apenas Defensor)\nPV 40 + 10 para cada círculo de magia acima de 5\nDeslocamento 9 m, Voo 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n16\n+3\n+3\nDes\n14\n+2\n+2\nCon\n16\n+3\n+3\nInt\n10\n+0\n+0\nSab\n14\n+2\n+2\nCar\n16\n+3\n+3\nResistências: Radiante\nImunidades: Amedrontado, Enfeitiçado\nSentidos: Visão no Escuro 18 m, Percepção Passiva 12\nIdiomas: Celestial, compreende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques igual à metade do círculo da magia (arredondado para baixo).\nArco Radiante (Apenas Vingador). Jogada de Ataque à Distância: Bônus é igual ao seu modificador de ataque mágico, alcance 180 m. Dano: 2d6 + 2 + o círculo da magia pontos de dano Radiante.\nMaça Radiante (Apenas Defensor). Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d10 + 3 + o círculo da magia pontos de dano Radiante, e o espírito pode escolher a si mesmo ou outra criatura à vista dele a até 3 metros do alvo. A criatura escolhida obtém 1d10 Pontos de Vida Temporários.\nToque Curativo (1/Dia). O espírito toca outra criatura. O alvo recupera Pontos de Vida iguais a 2d8 + o círculo da magia.\nConvocar Elemental\n4º Círculo, Invocação (Druida, Guardião, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (ar, uma pedra, cinzas e água dentro de um frasco incrustado de ouro no valor de 400 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca um Espírito Elemental. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Elemental. Ao conjurar a magia, escolha um elemento: Água, Ar, Fogo ou Terra. A criatura se assemelha a uma forma bípede envolta no elemento escolhido, o que determina certas características no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ela obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Elemental\nElemental Médio, Neutro\nCA 11 + o círculo da magia\nPV 50 + 10 para cada círculo de magia acima de 4\nDeslocamento 12 m; Escavação 12 m (apenas Terra); Natação 12 m (apenas Água); Voo 12 m (pairar; apenas Ar)\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n18\n+4\n+4\nDes\n15\n+2\n+2\nCon\n17\n+3\n+3\nInt\n4\n-3\n-3\nSab\n10\n+0\n+0\nCar\n16\n+3\n+3\nResistências Ácido (apenas Água), Cortante e Perfurante (apenas Terra), Elétrico e Trovejante (apenas Ar)\nImunidades Ígneo (somente Fogo), Venenoso; Envenenado, Exaustão, Paralisado, Petrificado\nSentidos Visão no Escuro 18 m, Percepção Passiva 10\nIdiomas Primordial, compreende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nEstado Amorfo (Apenas Água, Ar e Fogo). O espírito pode se mover por um espaço tão estreito quanto 2,5 centímetros de largura sem contá-lo como Terreno Difícil.\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques de Pancada igual à metade do círculo da magia (arredondado para baixo).\nPancada. Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d10 + 4 + o círculo da magia pontos de dano Contundente (apenas Terra), Elétrico (apenas Ar), Gélido (apenas Água) ou Ígneo (apenas Fogo).\nConvocar Familiar",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "convocar-montaria",
    "name": "Convocar Montaria",
    "level": 2,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Paladino"
    ],
    "description": "Você convoca um ser sobrenatural que aparece como uma montaria leal em um espaço desocupado à sua escolha no alcance da magia. Essa criatura usa o bloco de estatísticas de Montaria Sobrenatural. Se você já tem uma montaria desta magia, a montaria é substituída pela nova.\nA montaria se assemelha a um animal grande e que se pode montar à sua escolha, como um alce, um camelo, um cavalo ou um lobo atroz. Sempre que conjurar a magia, escolha o tipo de criatura da montaria — Celestial, Feérico ou Ínfero — que determina certas características no bloco de estatísticas.\nCombate. A montaria é um aliado seu e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa e funciona como uma montaria controlada enquanto você a monta (conforme definido nas regras sobre combate montado). Se você tem a condição Incapacitado, a montaria age no turno dela imediatamente após o seu, de forma independente, concentrando-se em protegê-lo.\nDesaparecimento da Montaria. A montaria desaparece se é reduzida a 0 Pontos de Vida ou se você morrer. Quando desaparece, deixa para trás qualquer coisa que estivesse vestindo ou carregando. Se você conjurar esta magia novamente, você decide se invoca a montaria que desapareceu ou uma diferente.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nMontaria Sobrenatural\nCelestial Grande, Feérico ou Ínfero (À Sua Escolha), Neutro\nCA 10 + 1 por círculo de magia\nPV 5 + 10 por círculo de magia (a montaria tem um número de Dados de Vida [d10s] igual ao círculo da magia)\nDeslocamento 18 m, Voo 18 m (requer magia de 4º círculo ou superior)\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n18\n+4\n+4\nDes\n12\n+1\n+1\nCon\n14\n+2\n+2\nInt\n6\n-2\n-2\nSab\n12\n+1\n+1\nCar\n8\n-1\n-1\nSentidos Percepção Passiva 11\nIdiomas Telepatia 1,5 km (funciona apenas com você)\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nVínculo Vital. Ao recuperar Pontos de Vida de uma magia 1º círculo ou superior, a montaria recupera o mesmo número de Pontos de Vida se você estiver a até 1,5 metro dela.\nAções\nPancada Sobrenatural. Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d8 mais o círculo da magia de pontos de dano Radiante (Celestial), Psíquico (Feérico) ou Necrótico (Ínfero).\nAções Bônus\nDerrubar Brilho (Apenas Ínfero; Recarrega após um Descanso Longo). Salvaguarda de Sabedoria: CD é igual a CD para evitar sua magia, uma criatura a até 18 metros à vista da montaria. Falha: O alvo tem a condição Amedrontado até o final do seu próximo turno.\nPasso Feérico (Apenas Feérico; Recarrega após um Descanso Longo). A montaria se teleporta, junto com seu cavaleiro, para um espaço desocupado à sua escolha a até 18 metros de distância de onde está.\nToque Curativo (Apenas Celestial; Recarrega após um Descanso Longo). Uma criatura a até 1,5 metro da montaria recupera um número de Pontos de Vida igual a 2d8 mais o círculo da magia.\nConvocar Relâmpagos\n3º Círculo, Invocação (Druida)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nUma nuvem de tempestade aparece em um ponto no alcance da magia à sua vista acima de você. A nuvem tem a forma de um Cilindro com 3 metros de altura e um raio de 18 metros.\nAo conjurar a magia, escolha um ponto à sua vista sob a nuvem. Um relâmpago é disparado da nuvem até aquele ponto. Cada criatura a até 1,5 metro desse ponto realiza uma salvaguarda de Destreza, sofrendo 3d10 pontos de dano Elétrico se falhar ou metade desse dano em caso de sucesso.\nAté que a magia termine, você pode executar uma ação Usar Magia para invocar relâmpagos desse modo novamente, escolhendo o mesmo ponto ou um diferente.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "corda-extradimensional",
    "name": "Corda Extradimensional",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (um pedaço de corda)"
    ],
    "duration": "1 hora",
    "classes": [
      "Mago"
    ],
    "description": "Você toca uma corda. Uma extremidade dela paira para cima até que a corda fique perpendicular ao chão ou alcance um teto. Na extremidade superior da corda, um portal Invisível de 1 metro por 1,5 metro se abre para um espaço extradimensional que permanece até que a magia termine. Esse espaço pode ser alcançado escalando a corda, que pode ser puxada para dentro ou para fora dele.\nO espaço pode conter até oito criaturas Médias ou menores. Ataques, magias e outros efeitos não podem passar para dentro ou para fora do espaço, mas as criaturas dentro dele podem ver através do portal. Qualquer coisa dentro do espaço cai quando a magia termina.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "cordao-de-flechas",
    "name": "Cordão de Flechas",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (uma trança ornamental)"
    ],
    "duration": "8 horas",
    "classes": [
      "Guardião"
    ],
    "description": "Toque até quatro Flechas ou Virotes não mágicas e finque-os no chão em seu espaço. Até que a magia termine, a munição não pode ser retirada fisicamente. Sempre que uma criatura que não seja você entrar em um espaço a até 9 metros da munição pela primeira vez ou terminar o turno dela lá, uma das peças de munição voa para atingi-la. A criatura deve ser bem-sucedida em uma salvaguarda de Destreza ou sofre 2d4 pontos de dano Perfurante. A munição é então destruída. A magia termina quando nenhuma munição permanecer fincada no chão.\nAo conjurar esta magia, você pode designar quaisquer criaturas que escolher, e a magia as ignora.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A quantidade de munição que pode ser afetada aumenta em dois para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "coroa-da-loucura",
    "name": "Coroa da Loucura",
    "level": 2,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma criatura à sua vista e no alcance da magia deve ser bem-sucedida em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia. A criatura é bem-sucedida automaticamente se não for Humanoide.\nUma coroa espectral aparece na cabeça do alvo Enfeitiçado, e ele deve executar uma ação antes de se mover em cada um de seus turnos para realizar um ataque corpo a corpo contra uma criatura diferente dela própria que você escolher mentalmente. O alvo pode agir normalmente no turno dele se você não escolher nenhuma criatura ou se nenhuma criatura estiver ao alcance dele. O alvo repete a salvaguarda no final de cada um dos turnos dele, encerrando a magia em caso de sucesso.\nNos seus turnos subsequentes, você deve executar a ação Usar Magia para manter o controle sobre o alvo, ou a magia encerra.\nCorrente de Relâmpagos\n6º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (três alfinetes de prata)\nDuração: Instantânea\nVocê lança um relâmpago em direção a um alvo à sua vista e no alcance da magia. Três relâmpagos então saltam desse alvo para até três outros alvos à sua escolha, cada um dos quais deve estar a até 9 metros do primeiro alvo. Um alvo pode ser uma criatura ou um objeto, e pode ser alvo de apenas um dos relâmpagos.\nCada alvo realiza uma salvaguarda de Destreza, sofrendo 10d8 pontos de dano Elétrico se falhar, ou metade desse dano em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Um raio adicional salta do primeiro alvo para outro alvo para cada círculo de espaço de magia acima de 6.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "crescer-espinhos",
    "name": "Crescer Espinhos",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "45 metros",
    "components": [
      "V",
      "S",
      "M (sete espinhos)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Druida",
      "Guardião"
    ],
    "description": "Do solo, em uma Esfera de 6 metros de raio centrada em um ponto no alcance da magia, brotam estacas e espinhos duros. A área se torna Terreno Difícil pela duração da magia. Quando uma criatura se move para dentro ou na área da magia, ela sofre 2d4 pontos de dano Perfurante por cada 1,5 metro que percorre.\nA transformação do solo é camuflada para parecer natural. Qualquer criatura que não consiga ver a área quando a magia é conjurada deve executar uma ação Procurar e ser bem-sucedida em um teste de Sabedoria (Percepção ou Sobrevivência) contra a CD para evitar sua magia para reconhecer o terreno como perigoso antes de entrar nele.\nCrescimento de Plantas\n3º Círculo, Transmutação (Bardo, Druida, Guardião)\nTempo de Conjuração: Ação (Crescimento Excessivo) ou 8 horas (Fertilização)\nAlcance: 45 metros\nComponentes: V, S\nDuração: Instantânea\nEsta magia canaliza vitalidade para as plantas. O tempo de conjuração que você usa determina se a magia tem o efeito Crescimento Excessivo ou Fertilização, apresentados a seguir.\nCrescimento Excessivo. Escolha um ponto no alcance da magia. Todas as plantas normais em uma Esfera de 30 metros de raio centrada nesse ponto tornam-se espessas e crescem. Uma criatura que se move por essa área deve gastar 4 metros de deslocamento para cada 1 metro que se move. Você pode anular o efeito em uma ou mais áreas de qualquer tamanho dentro da área da magia.\nFertilização. Todas as plantas em um raio de 800 metros centradas em um ponto no alcance da magia ficam fertilizadas por 365 dias. As plantas produzem o dobro da quantidade normal de alimento quando colhidas. Elas podem se beneficiar de apenas um Crescimento de Plantas por ano.\nCriação\n5º Círculo, Ilusão (Feiticeiro, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: 9 metros\nComponentes: V, S, M (um pincel)\nDuração: Especial\nVocê puxa mechas de material obscuro do Sombral para criar um objeto no alcance da magia. É um objeto de matéria vegetal (tecido, corda, madeira e algo similar) ou matéria mineral (pedra, cristal, metal e algo similar). O objeto não deve ser maior que um Cubo de 1,5 metro de lado, e deve ter a forma e ser de um material que você já viu.\nA duração da magia depende do material do objeto, conforme mostrado na tabela Materiais. Se o objeto for composto por vários materiais, use a duração mais curta. Usar qualquer objeto criado por esta magia como componente Material de outra magia faz com que a outra magia falhe.\nMateriais\nMateriais\nDuração\nMatéria vegetal\n24 horas\nRocha ou cristal\n12 horas\nMetais preciosos\n1 hora\nPedras preciosas\n10 minutos\nAdamantina ou mitral\n1 minuto",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O Cubo aumenta em 1,5 metro de lado para cada círculo de espaço de magia acima de 5.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "criar-chamas",
    "name": "Criar Chamas",
    "level": 0,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "10 minutos",
    "classes": [
      "Druida"
    ],
    "description": "Uma chama bruxuleante surge em sua mão e permanece lá pela duração da magia. Enquanto estiver lá, a chama não emite calor, não queima nada, e emite Luz Plena em um raio de 6 metros e Meia-luz por mais 6 metros. A magia se encerra se você a conjurar novamente.\nAté que a magia termine, você pode executar uma ação Usar Magia para arremessar a chama em uma criatura ou objeto a até 18 metros de você. Realize um ataque mágico à distância. Em caso de acerto, o alvo sofre 1d8 pontos de dano Ígneo.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d8 quando você atinge os níveis 5 (2d8), 11 (3d8) e 17 (4d8).\nCriar Comida e Água\n3º Círculo, Invocação (Clérigo, Paladino)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: Instantânea\nVocê cria 20 quilos de comida e 120 litros de água potável no chão ou em recipientes no alcance da magia — ambos úteis para afastar os perigos da desnutrição e desidratação. A comida não é temperada, mas nutritiva e se parece com um alimento à sua escolha, e a água é limpa. A comida estraga após 24 horas se não for consumida.\nCriar Mortos-Vivos\n6º Círculo, Necromancia (Bruxo, Clérigo, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: 3 metros\nComponentes: V, S, M (uma pedra de ônix preto de 150 ou mais PO para cada cadáver)\nDuração: Instantânea\nVocê pode conjurar esta magia apenas à noite. Escolha até três cadáveres de Humanoides Médios ou Pequenos no alcance da magia. Cada um se torna um Carniçal sob seu controle (veja também o Livro dos Monstros para o bloco de estatísticas).\nComo uma Ação Bônus em cada um dos seus turnos, você pode comandar mentalmente qualquer criatura que tenha animado com essa magia se a criatura estiver a até 36 metros de você (se você controlar várias criaturas, pode comandar qualquer uma delas ao mesmo tempo, emitindo o mesmo comando para elas). Você decide qual ação a criatura executa e para onde ela se move no próximo turno dela, ou pode emitir um comando geral, como proteger um determinado lugar. Se você não der nenhum comando, a criatura executa a ação Esquivar e move-se apenas para evitar dano. Uma vez dada uma ordem, a criatura continua a seguir a ordem até que a tarefa seja concluída.\nA criatura fica sob seu controle por 24 horas, após as quais ela deixa de obedecer a qualquer comando que você tenha dado a ela. Para manter o controle da criatura por mais 24 horas, é necessário conjurar esta magia na criatura antes que o período atual de 24 horas termine. Esse uso da magia reafirma seu controle sobre até três criaturas que você animou com essa magia em vez de animar novas.\nUsando um Espaço de Magia de Círculo Superior. Se você usar um espaço de magia de 7º círculo, você pode animar ou reafirmar o controle sobre quatro Carniçais. Se você usar um espaço de magia de 8º círculo, você pode animar ou reafirmar o controle sobre dois Carneçais ou Inumanos ou cinco Carniçais. Se você usar um espaço de magia de 9º círculo, poderá animar ou reafirmar o controle sobre seis Carniçais, três Carneçais ou Inumanos, ou duas Múmias. Veja também o Livro dos Monstros para esses blocos de estatísticas.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "criar-ou-destruir-agua",
    "name": "Criar ou Destruir Água",
    "level": 1,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (uma mistura de água e areia)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo",
      "Druida"
    ],
    "description": "Você faz uma das seguintes coisas:\nCriar Água. Você cria até 40 litros de água limpa no alcance da magia em um recipiente aberto. Como alternativa, a água cai como chuva em um Cubo de 9 metros de lado no alcance da magia, extinguindo chamas expostas na área.\nDestruir Água. Você destrói até 40 litros de água em um recipiente aberto no alcance da magia. Como alternativa, você dispersa uma névoa em um Cubo de 9 metros de lado no alcance da magia.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você cria ou destrói 40 litros adicionais de água, ou o tamanho do Cubo aumenta em 1,5 metro de lado, para cada círculo de espaço de magia acima de 1.\nCriar Passagem\n5º Círculo, Transmutação (Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S, M (uma pitada de sementes de gergelim)\nDuração: 1 hora\nUma passagem aparece em um ponto à sua vista em uma superfície de madeira, gesso ou pedra (como uma parede, teto ou piso) no alcance e pela duração da magia. Você escolhe as dimensões da abertura: até 1,5 metro de largura, 2,5 metros de altura e 6 metros de profundidade. A passagem não cria instabilidade em uma estrutura ao seu redor.\nQuando a abertura desaparece, qualquer criatura ou objeto ainda na passagem criada pela magia é ejetado com segurança para um espaço desocupado mais próximo da superfície na qual você conjurou a magia.\nCúpula Antivida\n5º Círculo, Abjuração (Druida)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Concentração, até 1 hora\nUma aura estende-se de você em uma Emanação de 3 metros pela duração da magia. A aura impede que criaturas que não sejam Constructos e Mortos-Vivos passem ou alcancem através dela. Uma criatura afetada pode conjurar magias ou realizar ataques com armas à Distância ou com Extensão através da barreira.\nSe você se mover de modo que uma criatura afetada seja forçada a atravessar a barreira, a magia encerra.\nCura Completa\n6º Círculo, Abjuração (Clérigo, Druida)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Instantânea\nEscolha uma criatura à sua vista e no alcance da magia. Uma energia positiva flui pelo alvo, restaurando 70 Pontos de Vida. Esta magia também remove as condições Cego, Envenenado e Surdo do alvo.\nUsando um Espaço de Magia de Círculo Superior. A cura aumenta em 10 para cada círculo de espaço de magia acima de 6.\nCura Completa em Massa\n9º Círculo, Abjuração (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Instantânea\nUma onda de energia curativa flui de você para as criaturas ao seu redor. Você restaura até 700 Pontos de Vida, divididos à sua escolha entre qualquer número de criaturas à sua vista e no alcance da magia. Criaturas curadas por esta magia também têm as condições Cego, Envenenado e Surdo removidas.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "curar-ferimentos",
    "name": "Curar Ferimentos",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Clérigo",
      "Druida",
      "Guardião",
      "Paladino"
    ],
    "description": "Uma criatura que você toca recupera um número de Pontos de Vida igual a 2d8 mais seu modificador de atributo de conjuração.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A cura aumenta em 2d8 para cada círculo de espaço de magia acima de 1.\nCurar Ferimentos em Massa\n5º Círculo, Abjuração (Bardo, Clérigo, Druida)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Instantânea\nUma onda de energia curativa sai de um ponto à sua vista e no alcance da magia. Escolha até seis criaturas em uma Esfera de 9 metros de raio centrada nesse ponto. Cada alvo recupera Pontos de Vida iguais a 5d8 mais o seu modificador de atributo de conjuração.\nUsando um Espaço de Magia de Círculo Superior. A cura aumenta em 1d8 para cada círculo de espaço de magia acima de 5.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1238\" w:name=\"_h4vhg3j2szr0\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1238\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>D",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "danacao",
    "name": "Danação",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "27 metros",
    "components": [
      "V",
      "S",
      "M (o olho petrificado de uma salamandra)"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Bruxo"
    ],
    "description": "Você coloca uma maldição em uma criatura à sua vista e no alcance da magia. Até que a magia termine, você causa 1d6 pontos de dano Necrótico adicional ao alvo sempre que o acertar com uma jogada de ataque. Além disso, escolha um atributo ao conjurar a magia. O alvo tem Desvantagem nos testes de atributo realizados com o atributo escolhido.\nSe o alvo é reduzido a 0 Pontos de Vida antes que esta magia termine, você pode executar uma ação Bônus em um turno posterior para amaldiçoar uma nova criatura.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Sua Concentração pode durar mais com um espaço de magia de 2º círculo (em até 4 horas), 3º–4º círculo (em até 8 horas) ou 5º círculo ou superior (em até 24 horas).\nDança Irresistível de Otto\n6º Círculo, Encantamento (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V\nDuração: Concentração, até 1 minuto\nUma criatura à sua vista e no alcance da magia deve realizar uma salvaguarda de Sabedoria. Em caso de sucesso, o alvo dança comicamente até o final do próximo turno dele, durante o qual ele deve gastar todo o movimento para dançar no mesmo lugar.\nSe falhar, o alvo tem a condição Enfeitiçado pela duração da magia. Enquanto Enfeitiçado, o alvo dança comicamente, deve usar todo o seu movimento para dançar no mesmo lugar e tem Desvantagem em salvaguardas de Destreza e jogadas de ataque, e outras criaturas têm Vantagem em jogadas de ataque contra ele. Em cada um dos turnos do alvo, ele pode executar uma ação para se recompor e repetir a salvaguarda, encerrando a magia em caso de sucesso.\nDe Carne para Pedra\n6º Círculo, Transmutação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S, M (uma pena de cocatriz)\nDuração: Concentração, até 1 minuto\nVocê tenta transformar uma criatura à sua vista e no alcance da magia em pedra. O alvo realiza uma salvaguarda de Constituição. Se falhar, ele tem a condição Contido pela duração da magia. Em uma salvaguarda bem-sucedida, o Deslocamento dele é 0 até o início do seu próximo turno. Constructos são bem-sucedidos automaticamente na salvaguarda.\nUm alvo Contido realiza outra salvaguarda de Constituição no final de cada um dos turnos dele. Em caso de sucesso por três vezes contra esta magia, ela se encerra. Se falhar por três vezes, ele é transformado em pedra e tem a condição Petrificado pela duração da magia. Os sucessos e fracassos não precisam ser consecutivos; acompanhe ambos até que o alvo alcance três de um tipo.\nSe você mantiver sua Concentração nesta magia por toda a duração possível, o alvo tem a condição Petrificado até que a condição seja encerrada por Restauração Maior ou efeito mágico semelhante.\nDedo da Morte\n7º Círculo, Necromancia (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Instantânea\nVocê libera energia negativa através de uma criatura à sua vista e no alcance da magia. O alvo realiza uma salvaguarda de Constituição, sofrendo 7d8 + 30 pontos de dano Necrótico se falhar ou metade desse dano em caso de sucesso.\nUm Humanoide morto por esta magia levanta-se no início do seu próximo turno como um Zumbi (veja o apêndice B) que segue suas ordens verbais.\nDefensor da Fé\nUm pequenino Clérigo conjura o Defensor da Fé para afastar um worg faminto.\n4º Círculo, Invocação (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V\nDuração: 8 horas\nUm defensor espectral Grande aparece e paira pela duração da magia em um espaço desocupado à sua vista e no alcance da magia. O defensor ocupa esse espaço e não pode ser atingido, e aparece em uma forma apropriada para sua divindade ou panteão.\nQualquer inimigo que se mova para um espaço a até 3 metros do defensor pela primeira vez em um turno ou inicie o turno lá realiza uma salvaguarda de Destreza, sofrendo 20 pontos de dano Radiante se falhar, ou metade desse dano em caso de sucesso. O defensor desaparece quando causa um total de 60 pontos de dano.\nDesejo\n9º Círculo, Invocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Instantânea\nDesejo é a magia mais poderosa que um mortal pode conjurar. Ao simplesmente falar em voz alta, você pode alterar a própria realidade.\nO uso básico dessa magia é duplicar qualquer outra magia de 8º círculo ou inferior. Ao usá-la dessa forma, você não precisa atender a nenhum requisito para conjurar essa magia, incluindo Componentes caros. A magia simplesmente surte efeito.\nComo alternativa, você pode criar um dos seguintes efeitos à sua escolha:\nAprendizado Repentino. Você substitui um dos seus talentos por outro talento para o qual seja elegível. Você perde todos os benefícios do talento antigo e obtém os benefícios do novo. Não é possível substituir um talento que seja pré-requisito para qualquer um dos seus outros talentos ou características.\nCriação de Objeto. Você cria um objeto no valor de até 25.000 PO que não seja um item mágico. O objeto pode ter no máximo 90 metros em qualquer dimensão e aparece em um espaço desocupado à sua vista, no chão.\nImunidade à Magia. Você concede a até dez criaturas à sua vista imunidade a uma única magia ou outro efeito mágico por 8 horas.\nRefazer Jogada. Você desfaz um único evento recente, forçando uma nova jogada de qualquer jogada de dado realizada no último turno (incluindo o seu último turno). A realidade se remodela para acomodar o novo resultado. Por exemplo, uma magia Desejo pode desfazer uma falha na salvaguarda de um aliado ou um Acerto Crítico de um inimigo. Você pode forçar refazer a jogada com Vantagem ou Desvantagem, e escolher se usa o novo resultado ou a jogada original.\nReformar a Realidade. Você pode expressar um desejo que não se encaixe nos outros efeitos. Para isso, declare seu desejo ao Mestre da maneira mais clara possível. O Mestre possui total liberdade para decidir o que acontece; quanto maior o desejo, maior a chance de algo dar errado. A magia pode falhar, o efeito desejado pode ser apenas parcialmente alcançado ou você pode enfrentar consequências inesperadas devido à forma como formulou seu desejo. Por exemplo, desejar que um vilão esteja morto pode levá-lo a um futuro em que o vilão já não está vivo, removendo o seu personagem do jogo. Desejar um item mágico Lendário ou um Artefato pode transportá-lo imediatamente ao local do atual proprietário. Se o desejo concedido afetar uma comunidade, região ou o mundo, é provável que você atraia inimigos poderosos. Se o desejo impactar uma divindade, os servos dela podem intervir rapidamente para impedir ou encorajar você a formular o desejo de uma determinada maneira. Se o desejo ameaçar o multiverso, a Cidade de Sigil ou a Senhora da Dor, você terá uma visão dela por um instante; ela balança a cabeça e o desejo falha.\nResistência. Você concede a até dez criaturas à sua vista Resistência a um tipo de dano à sua escolha. Essa Resistência é permanente.\nSaúde Instantânea. Você permite a si mesmo e a até vinte criaturas à sua vista recuperar todos os Pontos de Vida, além de encerrar todos os efeitos sobre elas listados na magia Restauração Maior.\nO estresse de conjurar Desejo para produzir qualquer efeito além de duplicar outra magia enfraquece você. Após suportar esse estresse, sempre que conjurar uma magia até completar um Descanso Longo, você sofre 1d10 pontos de dano Necrótico por círculo da magia. Esse dano não pode ser reduzido ou evitado de nenhuma maneira. Além disso, seu valor de Força se torna 3 por 2d4 dias. Para cada um desses dias em que você descanse e realize apenas atividades leves, o tempo de recuperação diminui em 2 dias. Por fim, há 33% de chance de que você nunca mais consiga conjurar Desejo se sofrer esse estresse.\nDesintegrar\n6º Círculo, Transmutação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S, M (uma pedra-ímã e poeira)\nDuração: Instantânea\nVocê dispara um raio verde em um alvo à sua vista e no alcance da magia. O alvo pode ser uma criatura, um objeto não mágico ou uma criação de energia mágica, como a muralha criada por Muralha de Energia.\nUma criatura alvo desta magia realiza uma salvaguarda de Destreza. Se falhar, o alvo sofre 10d6 + 40 pontos de dano Energético. Se esse dano reduz o alvo a 0 Pontos de Vida, ele e tudo o que não é mágico que está usando e carregando são desintegrados em pó cinza. O alvo só pode ser revivido por uma magia Desejo ou Ressurreição Verdadeira.\nEsta magia desintegra automaticamente um objeto não mágico Grande ou menor, ou uma criação de energia mágica. Se tal alvo for Enorme ou maior, esta magia desintegra uma porção de um Cubo de 3 metros de lado dele.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 3d6 para cada círculo de espaço de magia acima de 6.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "despedacar",
    "name": "Despedaçar",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (uma lasca de mica)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Um barulho alto irrompe de um ponto à sua escolha no alcance da magia. Cada criatura em uma esfera com raio de 3 metros centrada nesse ponto realiza uma salvaguarda de Constituição, sofrendo 3d8 pontos de dano Trovejante se falhar, ou metade desse dano em caso de sucesso. Um Constructo tem Desvantagem na salvaguarda.\nUm objeto não mágico que não esteja sendo usado ou carregado também sofre o dano se estiver na área da magia.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 2.\nDespertar\n5º Círculo, Transmutação (Bardo, Druida)\nTempo de Conjuração: 8 horas\nAlcance: Toque\nComponentes: V, S, M (uma ágata no valor de 1.000 ou mais PO, que a magia consome)\nDuração: Instantânea\nVocê passa o tempo de conjuração traçando caminhos mágicos em uma pedra preciosa e, em seguida, toca o alvo. O alvo deve ser uma criatura do tipo Fera ou Planta com uma Inteligência de 3 ou menos, ou uma planta natural que não seja uma criatura. O alvo obtém um valor de Inteligência de 10 e a capacidade de falar um idioma que você conhece. Se o alvo for uma planta natural, ele se torna uma criatura do tipo Planta e recebe a capacidade de mover seus membros, raízes, videiras, trepadeiras e assim por diante, e obtém sentidos semelhantes aos de um humano. O Mestre escolhe as estatísticas apropriadas para a Planta desperta, como as estatísticas do Arbusto Desperto ou da Árvore Desperta no Livro dos Monstros.\nO alvo desperto tem a condição Enfeitiçado por 30 dias ou até que você ou seus aliados lhe causem dano. Quando essa condição termina, a criatura despertada decide qual atitude tem em relação a você.\nO alvo despertado fica Enfeitiçado por 30 dias ou até que você ou seus aliados lhe causem dano. Quando essa condição termina, a criatura despertada decide como se sente em relação a você.\nDespistar\n5º Círculo, Ilusão (Bardo, Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: S\nDuração: Concentração, até 1 hora\nVocê tem a condição Invisível ao mesmo tempo que uma cópia ilusória sua aparece onde você está. A cópia permanece pela duração da magia, mas a invisibilidade termina imediatamente após você realizar uma jogada de ataque, causar dano ou conjurar uma magia.\nCom uma ação Usar Magia, você pode mover a cópia ilusória até duas vezes o seu Deslocamento e fazer com que ela gesticule, fale e se comporte da forma que você desejar. Ela é intangível e invulnerável.\nVocê pode ver através dos olhos dela e ouvir pelos ouvidos dela, como se estivesse onde ela está.\nDestruição Atordoante\n4º Círculo, Encantamento (Paladino)\nTempo de Conjuração: Ação Bônus, que você realiza imediatamente após atingir uma criatura com uma arma Corpo a Corpo ou um Ataque Desarmado\nAlcance: Pessoal\nComponente: V\nDuração: Instantânea\nO alvo sofre 4d6 pontos de dano Psíquico adicionais do ataque e deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Atordoado até o final do seu próximo turno.\nUsando um Espaço de Magia de Círculo Superior. O dano adicional aumenta em 1d6 para cada círculo de espaço de magia acima de 4.\nDestruição Banidora\n5º Círculo, Invocação (Paladino)\nTempo de Conjuração: Ação Bônus, que você realiza imediatamente após atingir uma criatura com uma arma Corpo a Corpo ou um Ataque Desarmado\nAlcance: Pessoal\nComponente: V\nDuração: Concentração, até 1 minuto\nO alvo atingido pela jogada de ataque sofre um adicional de 5d10 pontos de dano Energético do ataque. Se o ataque reduzir o alvo a 50 Pontos de Vida ou menos, o alvo deve ser bem-sucedido em uma salvaguarda de Carisma ou é transportado para um semiplano inofensivo pela duração da magia. Enquanto estiver lá, o alvo tem a condição Incapacitado. Quando a magia termina, o alvo reaparece no espaço que deixou ou no espaço desocupado mais próximo se esse espaço estiver ocupado.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "destruicao-cauterizante",
    "name": "Destruição Cauterizante",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus, que você realiza imediatamente após acertar um alvo com uma arma Corpo a Corpo ou um Ataque Desarmado",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "1 minuto",
    "classes": [
      "Paladino"
    ],
    "description": "Ao acertar o alvo, o ataque causa 1d6 pontos de dano Ígneo adicional. No início de cada turno do alvo, até que a magia termine, ele sofre 1d6 pontos de dano Ígneo e, então, realiza uma salvaguarda de Constituição. Se falhar, a magia continua; se for bem-sucedido, a magia se encerra.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Todo dano aumenta em 1d6 para cada círculo de espaço de magia acima de 1.\nDestruição Cegante\n3º Círculo, Evocação (Paladino)\nTempo de Conjuração: Ação Bônus, que você realiza imediatamente após atingir uma criatura com uma arma Corpo a Corpo ou um Ataque Desarmado\nAlcance: Pessoal\nComponente: V\nDuração: 1 minuto\nO alvo atingido pelo ataque sofre 3d8 pontos de dano Radiante adicionais e tem a condição Cego até que a magia termine. No final de cada um dos turnos dele, o alvo Cego realiza uma salvaguarda de Constituição, encerrando a magia em caso de sucesso.\nUsando um Espaço de Magia de Círculo Superior. O dano adicional aumenta em 1d8 para cada círculo de espaço de magia acima de 3.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "destruicao-colerica",
    "name": "Destruição Colérica",
    "level": 1,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus, que você realiza imediatamente após atingir uma criatura com uma arma Corpo a Corpo ou um Ataque Desarmado",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "1 minuto",
    "classes": [
      "Paladino"
    ],
    "description": "O alvo sofre 1d6 pontos de dano Necrótico adicionais do ataque e deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Amedrontado até que a magia termine. No final de cada um dos turnos dele, o alvo Amedrontado repete a salvaguarda, encerrando a magia em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 1.\nDestruição Divina",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "destruicao-estrondosa",
    "name": "Destruição Estrondosa",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus, que você realiza imediatamente após acertar um alvo com uma arma Corpo a Corpo ou um Ataque Desarmado",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Paladino"
    ],
    "description": "Seu ataque soa como um trovão audível a até 90 metros de você, e o alvo sofre 2d6 pontos de dano Trovejante adicionais do ataque. Além disso, se o alvo for uma criatura, ele deve ser bem-sucedido em uma salvaguarda de Força ou é empurrado 3 metros para longe de você e tem a condição Caído.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "destruicao-radiante",
    "name": "Destruição Radiante",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus, que você realiza imediatamente após atingir uma criatura com uma arma Corpo a Corpo ou um Ataque Desarmado",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Paladino"
    ],
    "description": "O alvo atingido pelo ataque sofre um adicional de 2d6 pontos de dano Radiante. Até que a magia termine, o alvo emite Luz Plena em um raio de 1,5 metro, e jogadas de ataque contra ele têm Vantagem e ele não pode se beneficiar da condição Invisível.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "detectar-magia",
    "name": "Detectar Magia",
    "level": 1,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": true,
    "castingTime": "Ação ou Ritual",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Bardo",
      "Bruxo",
      "Clérigo",
      "Druida",
      "Feiticeiro",
      "Guardião",
      "Mago",
      "Paladino"
    ],
    "description": "Pela duração da magia, você sente a presença de efeitos mágicos a até 9 metros de você. Se você sentir tais efeitos, pode executar a ação Usar Magia para ver uma aura fraca ao redor de qualquer criatura ou objeto visível na área que contém a magia, e se um efeito foi criado por uma magia, você descobre a escola dessa magia.\nA magia é bloqueada por 30 centímetros de pedra, terra ou madeira, 2,5 centímetros de metal ou uma folha fina de chumbo.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "detectar-o-bem-e-o-mal",
    "name": "Detectar o Bem e o Mal",
    "level": 1,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Clérigo",
      "Paladino"
    ],
    "description": "Pela duração da magia, você sente a localização de qualquer Aberração, Celestial, Elemental, Feérico, Ínfero ou Morto-Vivo a até 9 metros de você. Você também sente se a magia Consagrar está ativa lá e, em caso afirmativo, onde.\nA magia é bloqueada por 30 centímetros de pedra, terra ou madeira, 2,5 centímetros de metal ou uma folha fina de chumbo.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "detectar-pensamentos",
    "name": "Detectar Pensamentos",
    "level": 2,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (1 Peça de Cobre)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você ativa um dos efeitos abaixo. Até que a magia termine, você pode ativar qualquer um dos efeitos como uma ação Usar Magia em seus turnos posteriores.\nSentir Pensamentos. Você sente a presença de pensamentos a até 9 metros de você que pertencem a criaturas que conhecem idiomas ou são telepáticas. Você não lê os pensamentos, mas sabe o que uma criatura presente está pensando.\nA magia é bloqueada por 30 centímetros de pedra, terra ou madeira, 2,5 centímetros de metal ou uma folha fina de chumbo.\nLer Pensamentos. Escolha uma criatura à sua vista a até 9 metros de você ou uma criatura a até 9 metros de você que você tenha detectado com a opção Sentir Pensamentos. Você agora descobre o que mais se destaca no pensamento do alvo. Se o alvo não souber nenhum idioma e não for telepático, você não descobre nada.\nComo uma ação Usar Mágica em seu próximo turno, você pode tentar sondar mais profundamente a mente do alvo. Se você investigar mais profundamente, o alvo realiza uma salvaguarda de Sabedoria. Se falhar, você descobre o raciocínio, as emoções e algo que paira na mente dele (como preocupação, amor ou ódio). Em caso de sucesso, a magia encerra. De qualquer forma, o alvo sabe que você está sondando a mente dele e, até que você desvie sua atenção da mente do alvo, o alvo pode executar uma ação no turno dele para realizar um teste de Inteligência (Arcanismo) contra a CD para evitar sua magia, encerrando a magia em caso de sucesso.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "detectar-veneno-e-doenca",
    "name": "Detectar Veneno e Doença",
    "level": 1,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": true,
    "castingTime": "Ação ou Ritual",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (uma folha de teixo)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Clérigo",
      "Druida",
      "Guardião",
      "Paladino"
    ],
    "description": "Pela duração da magia, você sente a localização de venenos, criaturas venenosas ou peçonhentas e contágios mágicos a até 9 metros de você. Você sente o tipo de veneno, criatura ou contágio em cada caso.\nA magia é bloqueada por 30 centímetros de pedra, terra ou madeira, 2,5 centímetros de metal ou uma folha fina de chumbo.\nDisco Flutuante de Tenser",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "disfarcar-se",
    "name": "Disfarçar-se",
    "level": 1,
    "school": "Ilusão",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 hora",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você faz com que você mesmo — incluindo suas roupas, armaduras, armas e outros pertences — pareça diferente até que a magia termine. Você pode parecer 30 centímetros mais baixo ou mais alto e pode parecer mais pesado ou mais leve. Você deve adotar uma forma que tenha a mesma disposição básica de membros que você. Caso contrário, a extensão da ilusão depende de você.\nAs mudanças causadas por esta magia falham em uma inspeção física. Por exemplo, se você usar esta magia para adicionar um chapéu ao seu traje, objetos passarão através do chapéu, e qualquer um que o tocar não sentirá nada.\nPara descobrir se você está disfarçado, uma criatura deve executar a ação Analisar para inspecionar sua aparência e ser bem-sucedido em um teste de Inteligência (Investigação) contra a CD para evitar sua magia.\nDissipar Magia\n3º Círculo, Abjuração (Bardo, Bruxo, Clérigo, Druida, Feiticeiro, Guardião, Mago, Paladino)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S\nDuração: Instantânea\nEscolha uma criatura, objeto ou efeito mágico no alcance da magia. Qualquer magia ativa de 3º círculo ou inferior no alvo é encerrada. Para cada magia ativa de 4º círculo ou superior no alvo, realize um teste de atributo usando seu atributo de conjuração (CD 10 mais o círculo da magia alvo). Em caso de sucesso, a magia se encerra.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você encerra automaticamente uma magia no alvo se o círculo da magia for igual ou inferior ao círculo do espaço de magia que você usa.\nDissipar o Bem e o Mal\nUm tiferino Clérigo conjura Dissipar o Bem e o Mal para expulsar um espírito maligno de um inocente possuído.\n5º Círculo, Abjuração (Clérigo, Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (prata e ferro em pó)\nDuração: Concentração, até 1 minuto\nPela duração da magia, Celestiais, Elementais, Feéricos, Ínferos e Mortos-Vivos têm Desvantagem em jogadas de ataque contra você. Você pode encerrar a magia mais cedo usando uma das seguintes funções especiais.\nExorcizar. Como uma ação Usar Magia, você tem como alvo uma criatura a sua vista a até 1,5 metro de você e que seja um dos tipos de criatura acima. O alvo deve ser bem-sucedido em uma salvaguarda de Carisma ou é enviado de volta ao seu plano de origem, se ainda não estiver lá. Se não estiverem em seu plano de origem, Feéricos são enviados para Faéria e Mortos-Vivos são enviadas para o Sombral.\nQuebrar Encantamento. Como uma ação Usar Magia, toque uma criatura que esteja possuída ou sob os efeitos de Amedrontado ou Enfeitiçado por uma ou mais das criaturas mencionadas. O alvo deixa de estar possuído, Amedrontado ou Enfeitiçado por elas.\nDominar Fera\n4º Círculo, Encantamento (Druida, Feiticeiro, Guardião)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nUma Fera à sua vista e no alcance da magia deve ser bem-sucedida em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia. O alvo tem Vantagem na salvaguarda se você ou seus aliados estiverem lutando contra ele. Sempre que o alvo sofre dano, ele repete a salvaguarda, encerrando a magia em caso de sucesso.\nVocê tem um vínculo telepático com o alvo Enfeitiçado enquanto vocês dois estão no mesmo plano de existência. No seu turno, você pode usar este vínculo para emitir comandos para o alvo (nenhuma ação é necessária), como “Ataque essa criatura”, “Mova-se para lá” ou “Busque aquele objeto”. O alvo faz o possível para obedecer no turno dele. Se ele concluir um pedido e não receber mais instruções de você, ele age e se move como quiser, concentrando-se em se proteger.\nVocê pode ordenar o alvo a executar uma Reação, mas deve executar sua própria Reação para tanto.\nUsando um Espaço de Magia de Círculo Superior. Sua Concentração pode durar mais com um espaço de magia de 5º círculo (em até 10 minutos), 6º círculo (em até 1 hora) ou 7º círculo ou superior (em até 8 horas).\nDominar Monstro\n8º Círculo, Encantamento (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 1 hora\nUma criatura à sua vista e no alcance da magia deve ser bem-sucedida em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia. O alvo tem Vantagem na salvaguarda se você ou seus aliados estiverem lutando contra ele. Sempre que o alvo sofre dano, ele repete a salvaguarda, encerrando a magia em caso de sucesso.\nVocê tem um vínculo telepático com o alvo Enfeitiçado enquanto vocês dois estão no mesmo plano de existência. No seu turno, você pode usar este vínculo para emitir comandos para o alvo (nenhuma ação é necessária), como “Ataque essa criatura”, “Mova-se para lá” ou “Busque aquele objeto”. O alvo faz o possível para obedecer no turno dele. Se ele concluir um pedido e não receber mais instruções de você, ele age e se move como quiser, concentrando-se em se proteger.\nVocê pode ordenar o alvo a executar uma Reação, mas deve executar sua própria Reação para tanto.\nUsando um Espaço de Magia de Círculo Superior. Sua Concentração pode durar mais com um espaço de magia de 9º círculo (em até 8 horas).\nDominar Pessoa\n5º Círculo, Encantamento (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nUm humanoide à sua vista e no alcance da magia deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia. O alvo tem Vantagem na salvaguarda se você ou seus aliados estiverem lutando contra ele. Sempre que o alvo sofre dano, ele repete a salvaguarda, encerrando a magia em caso de sucesso.\nVocê tem um vínculo telepático com o alvo Enfeitiçado enquanto vocês dois estão no mesmo plano de existência. No seu turno, você pode usar este vínculo para emitir comandos para o alvo (nenhuma ação é necessária), como “Ataque essa criatura”, “Mova-se para lá” ou “Busque aquele objeto”. O alvo faz o possível para obedecer no turno dele. Se ele concluir um pedido e não receber mais instruções de você, ele age e se move como quiser, concentrando-se em se proteger.\nVocê pode ordenar o alvo a executar uma Reação, mas deve executar sua própria Reação para tanto.\nUsando um Espaço de Magia de Círculo Superior. Sua Concentração pode durar mais com um espaço de magia de 6º círculo (até 10 minutos), 7º círculo (até 1 hora) ou 8º círculo ou superior (até 8 horas).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "duelo-compelido",
    "name": "Duelo Compelido",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "9 metros",
    "components": [
      "V"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Paladino"
    ],
    "description": "Você tenta obrigar uma criatura a um duelo. Uma criatura à sua vista e no alcance da magia realiza uma salvaguarda de Sabedoria. Se falhar, o alvo tem Desvantagem nas jogadas de ataque contra criaturas que não sejam você, e não pode se mover voluntariamente para um espaço a mais de 9 metros de você.\nA magia encerra se você realizar uma jogada de ataque contra uma criatura que não seja o alvo, se você conjurar uma magia em um inimigo que não seja o alvo, se um aliado seu causar dano ao alvo ou se você terminar seu turno a mais de 9 metros de distância do alvo.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1268\" w:name=\"_kq0v4wuefl9x\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1268\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>E",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "elementalismo",
    "name": "Elementalismo",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você exerce controle sobre os elementos, criando um dos seguintes efeitos no alcance da magia.\nConvocar Água. Você cria um jato de névoa fria que umedece levemente criaturas e objetos em um Cubo de 1,5 metro de lado. Como alternativa, você cria 1 xícara de água limpa em um recipiente aberto ou em uma superfície, e a água evapora em 1 minuto.\nConvocar Brisa. Você cria uma brisa forte o suficiente para ondular um tecido, mexer poeira, farfalhar folhas e fechar portas e persianas abertas, tudo em um Cubo de 1,5 metro de lado. Portas e persianas que estiverem sendo mantidas abertas por alguém ou alguma força não são afetadas.\nConvocar Fogo. Você cria uma fina nuvem de brasas inofensivas e fumaça colorida e perfumada em um Cubo de 1,5 metro de lados. Você escolhe a cor e o perfume, e as brasas podem acender velas, tochas ou lâmpadas nessa área. O cheiro da fumaça permanece por 1 minuto.\nConvocar Terra. Você cria uma fina camada de poeira ou areia que cobre superfícies em uma área quadrada de 1,5 metro de lado, ou faz com que uma única palavra apareça em sua caligrafia em um pedaço de terra ou areia.\nEsculpir Elemento. Você faz com que terra, areia, fogo, fumaça, névoa ou água que caiba em um Cubo de 30 centímetros de lado assuma uma forma rudimentar (como a de uma criatura) por 1 hora.\nEmaranhar",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "encontrar-armadilhas",
    "name": "Encontrar Armadilhas",
    "level": 2,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo",
      "Druida",
      "Guardião"
    ],
    "description": "Você sente qualquer armadilha à sua vista e no alcance da magia. Uma armadilha, para o propósito desta magia, inclui qualquer objeto ou mecanismo que tenha sido criado para causar dano ou outro perigo. Assim, a magia sentiria a magia Alarme ou Glifo de Proteção ou uma armadilha mecânica, mas não revelaria uma fraqueza natural no chão, um teto instável ou um sumidouro escondido.\nEsta magia revela que uma armadilha está presente, mas não sua localização. Você aprende a natureza geral do perigo representado por uma armadilha que sente.\nEncontrar o Caminho\n6º Círculo, Adivinhação (Bardo, Clérigo, Druida)\nTempo de Conjuração: 1 minuto\nAlcance: Pessoal\nComponentes: V, S, M (um conjunto de ferramentas de adivinhação — como cartas ou runas — no valor de 100 ou mais PO)\nDuração: Concentração, até 1 dia\nVocê sente magicamente a rota física mais direta para um local que você nomeia. Você deve estar familiarizado com o local, e a magia falha se você declarar um destino em outro plano de existência, um destino em movimento (como uma fortaleza móvel) ou um destino inespecífico (como “o covil de um dragão verde”).\nEnquanto durar a magia, desde que você esteja no mesmo plano de existência do destino, você sabe a que distância ele está e em que direção se encontra. Sempre que se depara com uma escolha de caminhos ao longo do trajeto, você sabe qual é o caminho mais direto.\nEnfeitiçar Monstro\n4º Círculo, Encantamento (Bardo, Bruxo, Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: 1 hora\nUma criatura à sua vista e no alcance da magia realiza uma salvaguarda de Sabedoria. Ela tem Vantagem se você ou seus aliados estiverem lutando contra ela. Se falhar, o alvo tem a condição Enfeitiçado até que a magia termine ou até que você ou seus aliados causem dano a ele. A criatura Enfeitiçada é Amigável a você. Quando a magia termina, o alvo sabe que foi Enfeitiçado por você.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 4.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "enfeiticar-pessoa",
    "name": "Enfeitiçar Pessoa",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 hora",
    "classes": [
      "Bardo",
      "Bruxo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Um Humanoide à sua vista e no alcance da magia realiza uma salvaguarda de Sabedoria. Ele tem Vantagem se você ou seus aliados estiverem lutando contra ele. Se falhar, o alvo tem a condição Enfeitiçado até que a magia termine ou até que você ou seus aliados causem dano a ele. A criatura Enfeitiçada é Amigável a você. Quando a magia termina, o alvo sabe que foi Enfeitiçado por você.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "escalada-de-aranha",
    "name": "Escalada de Aranha",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (uma gota de betume e uma aranha)"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Até que a magia termine, uma criatura voluntária que você tocar adquire a capacidade de se mover por superfícies verticais e ao longo de tetos, deixando as mãos livres. O alvo também adquire um Deslocamento de Escalada igual ao Deslocamento dele.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "escrita-ilusoria",
    "name": "Escrita Ilusória",
    "level": 1,
    "school": "Ilusão",
    "ritual": true,
    "concentration": false,
    "castingTime": "1 minuto ou Ritual",
    "range": "Toque",
    "components": [
      "S",
      "M (tinta no valor de 10 ou mais PO",
      "que a magia consome)"
    ],
    "duration": "10 dias",
    "classes": [
      "Bardo",
      "Bruxo",
      "Mago"
    ],
    "description": "Você escreve em pergaminho, papel ou outro material apropriado e o imbuí com uma ilusão que permanece pela duração. Para você e quaisquer criaturas que escolher ao conjurar a magia, a escrita parece normal, como se estivesse escrita por sua mão, e transmite o significado de sua intenção no momento em que o texto foi redigido. Para os demais, as palavras aparecem como se estivessem em um alfabeto desconhecido ou mágico, tornando-se ininteligíveis. Se preferir, a ilusão pode alterar o significado, a caligrafia e o idioma do texto, embora você deva conhecer o idioma.\nSe a magia for dissipada, o texto original e a ilusão desaparecem.\nUma criatura que possui Visão Verdadeira pode ler a mensagem oculta.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "escudo-arcano",
    "name": "Escudo Arcano",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Reação, que você executa quando é atingido por uma jogada de ataque ou é alvo da magia Mísseis Mágicos",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 rodada",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma barreira imperceptível de energia mágica o protege. Até o início do seu próximo turno, você recebe um bônus de +5 na CA, incluindo contra o ataque que ativou a magia, e não sofre dano de Mísseis Mágicos.\nEscudo Ardente\n4º Círculo, Evocação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (um pouco de fósforo ou um vaga-lume)\nDuração: 10 minutos\nChamas finas envolvem seu corpo pela duração da magia, emitindo Luz Plena em um raio de 3 metros e Meia-luz por mais 3 metros.\nAs chamas fornecem um escudo quente ou frio, como você escolher. O escudo quente concede a você Resistência a dano Gélido, e o escudo frio concede a você Resistência a dano Ígneo.\nAlém disso, sempre que uma criatura a até 1,5 metro de você o atinge com uma jogada de ataque corpo a corpo, o escudo irrompe em chamas. O atacante sofre 2d8 pontos de dano Ígneo de um escudo quente ou 2d8 pontos de dano Gélido de um escudo frio.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "escudo-da-fe",
    "name": "Escudo da Fé",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pergaminho de oração)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Clérigo",
      "Paladino"
    ],
    "description": "Um campo cintilante envolve uma criatura à sua escolha no alcance da magia, concedendo um bônus de +2 na CA pela duração da magia.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "escuridao",
    "name": "Escuridão",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "M (pelo de morcego e um pedaço de carvão)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Pela duração da magia, uma Escuridão mágica se espalha a partir de um ponto no alcance da magia e preenche uma Esfera de 4,5 metros de raio. Visão no escuro não pode ver através dela, e luz não mágica não pode iluminá-la.\nComo alternativa, você conjura a magia em um objeto que não esteja sendo usado ou carregado, fazendo com que a Escuridão preencha uma Emanação de 4,5 metros originada desse objeto. Cobrir esse objeto com algo opaco, como uma tigela ou elmo, bloqueia a Escuridão.\nSe qualquer área desta magia se sobrepuser a uma área de Luz Plena ou Meia-luz criada por uma magia de 2º círculo ou inferior, essa outra magia é dissipada.\nEsfera Congelante de Otiluke\n6º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 90 metros\nComponentes: V, S, M (uma esfera de cristal em miniatura)\nDuração: Instantânea\nUm globo gelado se estende de você até um ponto à sua escolha no alcance da magia, onde explode em uma Esfera de 18 metros de raio. Cada criatura nessa área realiza uma salvaguarda de Constituição, sofrendo 10d6 pontos de dano Gélido se falhar ou metade desse dano em caso de sucesso.\nSe o globo atingir um corpo d'água, ele congela a água a uma profundidade de 15 centímetros sobre uma área de 9 metros quadrados. Esse gelo dura 1 minuto. Criaturas que estavam nadando na superfície da água congelada estão presas no gelo e têm a condição Contido. Uma criatura presa pode executar uma ação para realizar um teste de Força (Atletismo) contra a CD para evitar sua magia para se libertar.\nVocê pode escolher não disparar o globo após completar a conjuração da magia. Se você fizer isso, um globo do tamanho de uma bala de funda, gelado ao toque, aparece em sua mão. A qualquer momento, você ou uma criatura a quem você dá o globo pode arremessá-lo (até um alcance de 12 metros) ou arremessá-lo com uma funda (até o alcance normal da funda). Ele se estilhaça com o impacto, com o mesmo efeito que uma conjuração normal da magia. Você também pode baixar o globo sem quebrá-lo. Após 1 minuto, se o globo ainda não se estilhaçou, ele explode.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 6.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "esfera-flamejante",
    "name": "Esfera Flamejante",
    "level": 2,
    "school": "Invocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (uma bola de cera)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria uma esfera de fogo de 1,5 metro de diâmetro em um espaço desocupado no chão no alcance e pela duração da magia. Qualquer criatura que termine o turno a até 1,5 metro da esfera realiza uma salvaguarda de Destreza, sofrendo 2d6 pontos de dano Ígneo se falhar, ou metade desse dano em caso de sucesso.\nComo uma Ação Bônus, você pode mover a esfera até 9 metros, rolando-a pelo chão. Se você mover a esfera para o espaço de uma criatura, essa criatura realiza a salvaguarda contra a esfera, e a esfera para de se mover durante o turno.\nAo mover a esfera, você pode direcioná-la sobre barreiras de até 1,5 metro de altura e saltar sobre poços de até 3 metros de largura. Objetos inflamáveis que não estão sendo usados ou carregados entram em combustão se tocados pela esfera, e ela emite Luz Plena em um raio de 6 metros e Meia-luz por mais 6 metros.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 2.\nEsfera Resiliente de Otiluke\n4º Círculo, Abjuração (Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S, M (uma esfera de vidro)\nDuração: Concentração, até 1 minuto\nUma Esfera cintilante envolve uma criatura ou objeto Grande ou menor no alcance da magia. Uma criatura involuntária deve ser bem-sucedida em uma salvaguarda de Destreza ou é envolta pela duração da magia.\nNada — nem objetos físicos, energia ou outros efeitos de magia — pode atravessar a barreira, para dentro ou para fora, embora uma criatura na Esfera possa respirar lá. A Esfera é imune a todos os tipos de dano, e uma criatura ou objeto dentro dela não pode ser danificado por ataques ou efeitos provenientes de fora, nem uma criatura dentro da Esfera pode causar dano a qualquer coisa fora dela.\nA Esfera não tem peso e é grande o suficiente para conter a criatura ou objeto em seu interior. Uma criatura envolta pode executar uma ação para empurrar-se contra as paredes da Esfera e, assim, rolar a Esfera a até metade do Deslocamento da criatura. Da mesma forma, o globo pode ser pego e movido por outras criaturas.\nUma magia Desintegrar que tenha o globo como alvo o destrói sem prejudicar nada em seu interior.\nEsfera Vitriólica\nUm tiferino Feiticeiro libera a Esfera Vitriólica em nóticos.\n4º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (uma gota de bile)\nDuração: Instantânea\nVocê aponta para um local no alcance da magia, e uma bola de ácido brilhante de 30 centímetros de diâmetro se espalha lá e explode em uma Esfera de 6 metros de raio. Cada criatura nessa área realiza uma salvaguarda de Destreza. Se falhar, uma criatura sofre 10d4 pontos de dano Ácido e outros 5d4 pontos de dano Ácido no final do próximo turno dela. Em caso de sucesso, uma criatura recebe apenas metade do dano inicial.\nUsando um Espaço de Magia de Círculo Superior. O dano inicial aumenta em 2d4 para cada círculo de espaço de magia acima de 4.\nEspada de Mordenkainen\n7º Círculo, Evocação (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (uma espada em miniatura no valor de 250 ou mais PO)\nDuração: Concentração, até 1 minuto\nVocê cria uma espada espectral que fica suspensa no alcance da magia. Ela permanece pela duração da magia.\nQuando a espada aparece, você realiza um ataque mágico corpo a corpo contra um alvo a até 1,5 metro da espada. Em um acerto, o alvo sofre um dano Energético igual a 4d12 mais o seu modificador de atributo de conjuração.\nNos turnos seguintes, você pode executar uma Ação Bônus para mover a espada até 9 metros para um ponto à sua vista e repetir o ataque contra o mesmo alvo ou um diferente.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "espinho-mental",
    "name": "Espinho Mental",
    "level": 2,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "S"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você crava um espinho de energia psíquica na mente de uma criatura à sua vista e no alcance da magia. O alvo realiza uma salvaguarda de Sabedoria, sofrendo 3d8 pontos de dano Psíquico se falhar ou metade desse dano em caso de sucesso. Se falhar na salvaguarda, você também sempre sabe a localização do alvo até que a magia termine, mas apenas enquanto ambos estiverem no mesmo plano de existência. Enquanto você tiver essa informação, o alvo não pode se esconder de você, e se tem a condição Invisível, não obtém nenhum benefício dela contra você.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "espiritos-invocados-por-convocar-familiar-assumem-formas-inspiradas-pelos-magos-que-os-conjuram",
    "name": "Espíritos invocados por Convocar Familiar assumem formas inspiradas pelos magos que os conjuram.",
    "level": 1,
    "school": "Invocação",
    "ritual": true,
    "concentration": false,
    "castingTime": "1 hora ou Ritual",
    "range": "3 metros",
    "components": [
      "V",
      "S",
      "M (incenso queimando no valor de 10 ou mais PO",
      "que a magia consome)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Mago"
    ],
    "description": "Você adquire o serviço de um familiar, um espírito que assume uma forma animal que você escolhe: Aranha, Coruja, Corvo, Doninha, Falcão, Gato, Lagarto, Morcego, Polvo, Rato, Sapo ou outra Fera que tenha um Nível de Desafio 0. Aparecendo em um espaço desocupado no alcance da magia, o familiar tem as estatísticas da forma escolhida (veja o apêndice B), embora seja um Celestial, Feérico ou Ínfero (à sua escolha) em vez de uma Fera. Seu familiar age independentemente de você, mas obedece aos seus comandos.\nConexão Telepática. Enquanto seu familiar estiver a até 30 metros de você, você pode se comunicar telepaticamente com ele. Além disso, como uma Ação Bônus, você pode ver através dos olhos do familiar e ouvir o que ele ouve até o início do seu próximo turno, obtendo os benefícios de quaisquer sentidos especiais que ele tenha.\nPor fim, ao conjurar uma magia com um alcance de toque, seu familiar pode entregar o toque. Seu familiar deve estar a até 30 metros de você, e ele deve executar uma Reação para entregar o toque quando você conjurar a magia.\nCombate. O familiar é um aliado seu e de seus aliados. Ele joga a Iniciativa dele e age no turno dele. Um familiar não pode atacar, mas pode realizar outras ações normalmente.\nDesaparecimento do Familiar. Quando o familiar é reduzido a 0 Pontos de Vida, ele desaparece. Ele reaparece depois que você conjura esta magia novamente. Como uma ação Usar Magia, você pode descartar temporariamente o familiar para uma mini dimensão. Como alternativa, você pode descartá-lo para sempre. Como uma ação Usar Magia enquanto está temporariamente descartado, você pode fazer com que ele reapareça em um espaço desocupado a até 9 metros de você. Sempre que o familiar é reduzido a 0 Pontos de Vida ou desaparece na mini dimensão, ele deixa para trás no espaço que ocupava qualquer coisa que estivesse vestindo ou carregando.\nApenas um Familiar. Você não pode ter mais de um familiar ao mesmo tempo. Ao conjurar esta magia enquanto você tem um familiar, você faz com que ele adote uma nova forma elegível.\nConvocar Feérico\nUm Guardião conjura Invocar Feérico, conjurando um Espírito Feérico enfurecido para enfrentar um Merrow saqueador.\n3º Círculo, Invocação (Bruxo, Druida, Guardião, Mago)\nTempo de Conjuração: ama Ação\nAlcance: 27 metros\nComponentes: V, S, M (uma flor dourada no valor de 300 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca um Espírito Feérico. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Feérico. Ao conjurar a magia, escolha um humor: Alegre, Enfurecido ou Malandro. A criatura se assemelha a uma criatura Feérica à sua escolha definida pelo humor escolhido, o que determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece se reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ela obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Feérico\nFeérico Pequeno, Neutro\nCA 12 + o círculo da magia\nPV 30 + 10 para cada círculo de magia acima de 3\nDeslocamento 9 m, Voo 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n13\n+1\n+1\nDes\n16\n+3\n+3\nCon\n14\n+2\n+2\nInt\n14\n+2\n+2\nSab\n11\n+0\n+0\nCar\n16\n+3\n+3\nImunidades Enfeitiçado\nSentidos Visão no Escuro 18 m, Percepção Passiva 10\nIdiomas Silvestre, compreende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques com Lâmina Feérica igual à metade do círculo da magia (arredondado para baixo).\nLâmina Feérica. Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 3d6 + 3 + o círculo da magia pontos de dano Energético.\nAções Bônus\nPasso Feérico. O espírito se teleporta magicamente até 9 metros para um espaço desocupado à vista dele. Em seguida, ocorre um dos seguintes efeitos, com base no humor escolhido para o espírito:\nAlegre. Salvaguarda de Sabedoria: CD é igual a CD para evitar sua magia, uma criatura à vista do espírito e a até 3 metros dele. Falha: O alvo fica Enfeitiçado por você e pelo espírito por 1 minuto ou até que o alvo sofra qualquer dano.\nEnfurecido. O espírito tem Vantagem na próxima jogada de ataque que realizar antes do final deste turno.\nMalandro. O espírito preenche um Cubo de 3 metros de lado a até 1,5 metro dele com Escuridão mágica, que dura até o final do próximo turno dele.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "esquentar-metal",
    "name": "Esquentar Metal",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pedaço de ferro e uma chama)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Druida"
    ],
    "description": "Escolha um objeto de metal fabricado, como uma arma ou uma armadura de metal pesada ou média, à sua vista e no alcance da magia. Você faz com que o objeto brilhe em brasa. Qualquer criatura em contato físico com o objeto sofre 2d8 pontos de dano ígneo quando você conjura a magia. Enquanto a magia durar, você pode executar uma ação Bônus em cada um dos seus turnos subsequentes para causar esse dano novamente, desde que o objeto esteja no alcance da magia.\nSe uma criatura estiver segurando ou usando o objeto e sofrer dano, ela deve ser bem-sucedida em uma salvaguarda de Constituição ou soltar o objeto, se puder. Se não soltar o objeto, ela tem Desvantagem em jogadas de ataque e testes de atributo até o início do seu próximo turno.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 2.\nEstática Sináptica\n5º Círculo, Encantamento (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S\nDuração: Instantânea\nVocê faz com que a energia psíquica entre em erupção em um ponto no alcance da magia. Cada criatura em uma Esfera de 6 metros de raio centrada nesse ponto realiza uma salvaguarda de Inteligência, sofrendo 8d6 pontos de dano Psíquico se falhar, ou metade desse dano em caso de sucesso.\nSe falhar, um alvo também tem pensamentos confusos por 1 minuto. Durante esse tempo, ele subtrai 1d6 de todas as suas jogadas de ataque e testes de atributo, bem como quaisquer salvaguardas de Constituição para manter a Concentração. A criatura realiza uma salvaguarda de Inteligência no final de cada um dos turnos dela, encerrando o efeito sobre si em caso de sucesso.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "explosao-elemental",
    "name": "Explosão Elemental",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro"
    ],
    "description": "Você dispara energia arcana contra uma criatura ou objeto no alcance da magia. Realize uma jogada de ataque à distância contra o alvo. Em caso de acerto, o alvo sofre 1d8 pontos de dano de um tipo à sua escolha: Ácido, Elétrico, Gélido, Ígneo, Psíquico, Trovejante ou Venenoso.\nSe você tirar um 8 no d8 para esta magia, pode jogar outro d8 e adicionar ao dano. Ao conjurar essa magia, o número máximo de d8 adicionais que você pode somar ao dano da magia é igual ao seu modificador de atributo de conjuração.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d8 quando você atinge os níveis 5 (2d8), 11 (3d8) e 17 (4d8).\nExplosão Solar\n8º Círculo, Evocação (Clérigo, Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (um pedaço de pedra solar)\nDuração: Instantânea\nLuz solar brilhante lampeja em uma Esfera de 18 metros de raio centrada em um ponto à sua escolha no alcance da magia. Cada criatura na Esfera realiza uma salvaguarda de Constituição. Se falhar, uma criatura sofre 12d6 pontos de dano Radiante e tem a condição Cego por 1 minuto. Em caso de sucesso, ela sofre apenas metade do dano.\nUma criatura Cega por esta magia realiza outra salvaguarda de Constituição no final de cada um dos turnos dela, encerrando o efeito em caso de sucesso.\nEsta magia dissipa Escuridão criada por qualquer magia em sua área.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1292\" w:name=\"_6xtzv9t3n94m\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1292\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>F\nFabricar\n4º Círculo, Transmutação (Mago)\nTempo de Conjuração: 10 minutos\nAlcance: 36 metros\nComponentes: V, S\nDuração: Instantânea\nVocê converte matérias-primas em produtos do mesmo material. Por exemplo, você pode fabricar uma ponte de madeira a partir de um grupo de árvores, uma corda a partir de um pedaço de cânhamo ou roupas a partir de linho ou lã.\nEscolha as matérias-primas à sua vista e no alcance da magia. Você pode fabricar um objeto Grande ou menor (que caiba em um Cubo de 3 metros de lado ou oito Cubos de 1,5 metro de lado conectados) com uma quantidade suficiente de material. Contudo, se você estiver trabalhando com metal, pedra ou outra substância mineral, o objeto fabricado não pode ser maior do que Médio (que caiba em um Cubo de 1,5 metro de lado). A qualidade de quaisquer objetos fabricados é baseada na qualidade das matérias-primas.\nCriaturas e itens mágicos não podem ser criados por esta magia. Você também não pode usá-la para criar itens que exijam um alto grau de habilidade — como armas e armaduras — a menos que você tenha proficiência com o tipo de Ferramentas de Artesão usadas para criar tais objetos.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "faca-de-gelo",
    "name": "Faca de Gelo",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "S",
      "M (uma gota de água ou um pedaço de gelo)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria um fragmento de gelo e o arremessa em uma criatura no alcance da magia. Realize um ataque mágico à distância contra o alvo. Se o ataque for bem-sucedido, o alvo sofre 1d10 pontos de dano Perfurante. Independentemente de ter acertado ou não, o fragmento explode. O alvo e cada criatura a até 1,5 metro dele devem ser bem-sucedidos em uma salvaguarda de Destreza ou sofrem 2d6 pontos de dano Gélido.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano Gélido aumenta em 1d6 para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "fagulha-estelar",
    "name": "Fagulha Estelar",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Druida"
    ],
    "description": "Você lança uma faísca de luz em uma criatura ou objeto no alcance da magia. Realize um ataque mágico à distância contra o alvo. Em caso de acerto, o alvo sofre 1d8 pontos de dano Radiante e, até o final do seu próximo turno, emite Meia-luz em um raio de 3 metros e não pode se beneficiar da condição Invisível.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d8 quando você atinge os níveis 5 (2d8), 11 (3d8) e 17 (4d8).\nFalar com Animais",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "favor-divino",
    "name": "Favor Divino",
    "level": 1,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 minuto",
    "classes": [
      "Paladino"
    ],
    "description": "Até que a magia termine, seus ataques com armas causam 1d4 pontos de dano Radiante adicionais em um acerto.\nFlecha Ácida de Melf",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "fogo-das-fadas",
    "name": "Fogo das Fadas",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Druida"
    ],
    "description": "Objetos em um Cubo de 6 metros de lado no alcance da magia são delineados por luz azul, verde ou violeta (à sua escolha). Cada criatura no Cubo também é delineada se falhar em uma salvaguarda de Destreza. Pela duração da magia, objetos e criaturas afetadas emitem Meia-Luz em um raio de 3 metros e não podem se beneficiar da condição Invisível.\nJogadas de ataque contra uma criatura ou objeto afetado têm Vantagem se o atacante puder vê-la.\nFome de Hadar\nUm Aasimar Bruxo expõe inimigos à Fome de Hadar, que tudo consome.\n3º Círculo, Invocação (Bruxo)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (um tentáculo em conserva)\nDuração: Concentração, até 1 minuto\nVocê abre uma porta de entrada para o Reino Distante, uma região infestada de horrores indizíveis. Uma Esfera de Escuridão de 6 metros de raio aparece, centrada em um ponto no alcance e pela duração da magia. A Esfera é considerada Terreno Difícil, e está cheia de sussurros estranhos e sons de sucção que podem ser ouvidos a até 9 metros de distância. Nenhuma luz, seja mágica ou não, pode iluminar a área, e criaturas totalmente dentro da área têm a condição Cego.\nQualquer criatura que comece seu turno na área sofre 2d6 pontos de dano Gélido. Qualquer criatura que termine seu turno na área deve ser bem-sucedida em uma salvaguarda de Destreza ou sofre 2d6 pontos de dano Ácido enquanto tentáculos esbranquiçados de outro mundo se esfregam nela.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano Ácido ou Gélido (à sua escolha) aumenta em 1d6 para cada círculo de espaço de magia acima de 3.\nFonte do Luar\n4º Círculo, Evocação (Bardo, Druida)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nUma luz fria envolve seu corpo pela duração da magia, emitindo Luz Plena em um raio de 6 metros e Meia-luz por mais 6 metros.\nAté que a magia termine, você tem Resistência a dano Radiante e seus ataques corpo a corpo causam 2d6 pontos de dano Radiante adicionais em caso de acerto.\nAlém disso, imediatamente após sofrer dano de uma criatura à sua vista a até 18 metros de si, você pode executar uma Reação para forçar a criatura a realizar uma salvaguarda de Constituição. Se falhar, a criatura tem a condição Cego até o final do seu próximo turno.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "forca-espectral",
    "name": "Força Espectral",
    "level": 2,
    "school": "Ilusão",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pouco de lã)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você tenta criar uma ilusão na mente de uma criatura à sua vista e no alcance da magia. O alvo realiza uma salvaguarda de Inteligência. Se falhar, você cria um objeto, criatura ou outro fenômeno espectral que não seja maior do que um cubo de 3 metros de lado e que seja perceptível apenas para o alvo pela duração da magia. O espectro inclui som, temperatura e outros estímulos.\nO alvo pode executar uma ação Analisar para examinar o espectro com um teste de Inteligência (Investigação) contra a CD para evitar sua magia. Em caso de sucesso, o alvo percebe que o espectro é uma ilusão e a magia se encerra.\nEnquanto afetado pela magia, o alvo trata o espectro como se fosse real e racionaliza quaisquer resultados ilógicos da interação com ele. Por exemplo, um alvo que esteja tentando atravessar uma ponte espectral e sobreviva à queda acredita na existência da ponte e tenta achar alguma explicação para a própria queda.\nUm alvo afetado pode até sofrer dano da ilusão se o espectro representar uma criatura ou risco. Em cada um dos seus turnos, tal espectro pode causar 2d8 pontos de dano Psíquico ao alvo se estiver na área do espectro ou a até 1,5 metro do espectro. O alvo percebe o dano como um tipo apropriado para a ilusão.\nForma Etérea\n7º Círculo, Invocação (Bardo, Bruxo, Clérigo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Até 8 horas\nVocê entra nas regiões de fronteira do Plano Etéreo, onde ele se sobrepõe ao seu plano atual.\nVocê permanece na Fronteira Etérea pela duração da magia. Durante esse período, você pode se mover em qualquer direção. Se você se mover para cima ou para baixo, cada metro de movimento custa um metro adicional. Você pode ver o plano que você deixou, que parece cinza, e você não pode ver nada lá a mais de 18 metros de distância.\nEnquanto estiver no Plano Etéreo, você pode afetar e ser afetado apenas por criaturas, objetos e efeitos nesse plano. Criaturas que não estão no Plano Etéreo não podem perceber ou interagir com você, a menos que uma característica lhes dê a capacidade de fazê-lo.\nQuando a magia termina, você retorna ao plano que deixou no local que corresponde ao seu espaço na Fronteira Etérea. Se você aparecer em um espaço ocupado, você é direcionado para o espaço desocupado mais próximo e sofre dano Energético igual a 10 pontos para cada 1,5 metro que é movido.\nEsta magia se encerra instantaneamente se você a conjurar enquanto estiver no Plano Etéreo ou em um plano que não faz fronteira com ele, como um dos Planos Externos.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher até três criaturas voluntárias (incluindo você) para cada círculo de espaço de magia acima de 7. As criaturas devem estar a até 3 metros de você quando você conjurar a magia.\nForma Gasosa\n3º Círculo, Transmutação (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (um pouco de gaze)\nDuração: Concentração, até 1 hora\nUma criatura voluntária que você toca multimorfa-se, junto com tudo o que está vestindo e carregando, em uma nuvem de neblina durante a duração da magia. A magia se encerra no alvo se ele for reduzido a 0 Pontos de Vida ou se executar uma ação Usar Magia para encerrá-la.\nEnquanto estiver nesta forma, o único método de movimento do alvo é um Deslocamento de Voo de 3 metros, e ele pode pairar. O alvo pode entrar e ocupar o espaço de outra criatura. O alvo tem Resistência a dano Contundente, Cortante e Perfurante; tem Imunidade à condição Caído; e tem Vantagem em salvaguardas de Força, Destreza e Constituição. O alvo pode passar por aberturas estreitas, mas considera líquidos como se fossem superfícies sólidas.\nO alvo não pode falar ou manipular objetos, e qualquer objeto que ele estava carregando ou segurando não pode ser derrubado, usado ou interagido de outra forma. Por fim, o alvo não pode atacar ou conjurar magias.\nUsando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 3.\nFormas Animais\n8º Círculo, Transmutação (Druida)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: 24 horas\nEscolha qualquer número de criaturas voluntárias à vista e no alcance da magia. Cada alvo se multimorfa em uma Fera Grande ou menor à sua escolha e que tenha um Nível de Desafio igual ou inferior a 4. Você pode escolher uma forma diferente para cada alvo. Em turnos posteriores, você pode executar uma ação Usar Magia para transformar os alvos novamente.\nAs estatísticas de jogo de um alvo são substituídas pelas estatísticas da Fera escolhida, mas o alvo mantém seu tipo de criatura, Pontos de Vida, Dados de Pontos de Vida, alinhamento, capacidade de comunicação, e valores de atributo de Inteligência, Sabedoria e Carisma. As ações do alvo são limitadas pela anatomia da forma da Fera e ele não pode conjurar magias. O equipamento do alvo se funde com a nova forma e o alvo não pode usar nenhum desses equipamentos enquanto estiver nesta forma.\nO alvo adquire um número de Pontos de Vida Temporários igual aos Pontos de Vida da forma da Fera. A transformação permanece pela duração da magia para cada alvo, até que o alvo não tenha mais Pontos de Vida Temporários ou até que o alvo saia da forma como uma Ação Bônus.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1309\" w:name=\"_eq1h6kvm72ig\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1309\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>G",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "gargalhada-nefasta-de-tasha",
    "name": "Gargalhada Nefasta de Tasha",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (uma torta e uma pena)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Mago"
    ],
    "description": "Uma criatura à sua escolha à sua vista e no alcance da magia realiza uma salvaguarda de Sabedoria. Se falhar, ela está com as condições Caído e Incapacitado pela duração da magia. Durante esse tempo, ela ri incontrolavelmente se for capaz de rir e não pode encerrar a condição Caído por si só.\nNo final de cada um dos turnos dela e cada vez que sofrer dano, a criatura realiza outra salvaguarda de Sabedoria. O alvo tem Vantagem na salvaguarda se a salvaguarda for acionada por dano. Em caso de sucesso, a magia encerra.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.\nGlifo de Proteção\n3º Círculo, Abjuração (Bardo, Clérigo, Mago)\nTempo de Conjuração: 1 hora\nAlcance: Toque\nComponentes: V, S, M (um diamante em pó no valor de 200 ou mais PO, que a magia consome)\nDuração: Até ser dissipada ou acionada\nVocê inscreve um glifo que mais tarde aciona um efeito mágico. Você o inscreve em uma superfície (como uma mesa ou uma seção de piso no chão) ou dentro de um objeto que pode ser fechado (como um livro ou baú) para ocultar o glifo. O glifo pode cobrir uma área não superior a 3 metros de diâmetro. Se a superfície ou objeto for movido a mais de 3 metros de onde você conjurou esta magia, o glifo é quebrado e a magia encerra sem ser acionada.\nO glifo é quase imperceptível e requer um teste bem-sucedido de Sabedoria (Percepção) contra a CD para evitar sua magia para ser notado.\nQuando inscreve o glifo, você define o gatilho dele e escolhe se ele é uma runa explosiva ou um glifo de magia, conforme explicado abaixo.\nDefina o Gatilho. Você decide o que aciona o glifo quando conjura a magia. Para glifos inscritos em uma superfície, os gatilhos comuns incluem tocar ou pisar no glifo, remover outro objeto que o cubra ou se aproximar a uma certa distância dele. Para glifos inscritos em um objeto, os gatilhos comuns incluem abrir esse objeto ou ver o glifo. Uma vez que um glifo é acionado, esta magia se encerra.\nVocê pode ajustar o gatilho para que apenas criaturas de certos tipos o ativem (por exemplo, o glifo pode ser definido para afetar Aberrações). Você também pode definir condições para criaturas que não acionam o glifo, como aquelas que dizem uma determinada senha.\nRuna Explosiva. Quando acionado, o glifo irrompe com energia mágica em uma Esfera de 6 metros de raio centrada no glifo. Cada criatura na área realiza uma salvaguarda de Destreza. Se falhar, uma criatura sofre 5d8 pontos de dano Ácido, Elétrico, Gélido, Ígneo ou Trovejante (à sua escolha ao criar o glifo), ou metade desse dano em caso de sucesso.\nGlifo de Magia. Você pode armazenar uma magia preparada de 3º círculo ou inferior no glifo, conjurando-a como parte da criação do glifo. A magia deve ter como alvo uma única criatura ou uma área. A magia que está sendo armazenada não tem efeito imediato quando conjurada desse modo.\nQuando o glifo é acionado, a magia armazenada entra em efeito. Se a magia tiver um alvo, ela tem como alvo a criatura que acionou o glifo. Se a magia afetar uma área, a área está centrada nessa criatura. Se a magia invocar criaturas hostis ou criar objetos ou armadilhas prejudiciais, elas aparecem o mais próximo possível do intruso e o atacam. Se a magia exigir Concentração, ela dura até o final da duração total da magia.\nUsando um Espaço de Magia de Círculo Superior. O dano de uma runa explosiva aumenta em 1d8 para cada círculo de espaço de magia acima de 3. Se você criar um glifo de magia, você pode armazenar qualquer magia de até o mesmo círculo que o espaço de magia que você usa para o Glifo de Proteção.\nGlobo de Invulnerabilidade\n6º Círculo, Abjuração (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (uma conta de vidro)\nDuração: Concentração, até 1 minuto\nUma barreira imóvel e cintilante aparece em uma Emanação de 3 metros ao seu redor e permanece pela duração da magia.\nQualquer magia de 5º círculo ou inferior conjurada de fora da barreira não pode afetar nada dentro dela. Tal magia pode ter como alvo criaturas e objetos dentro da barreira, mas a magia não tem efeito sobre eles. Da mesma forma, a área dentro da barreira é excluída das áreas de efeito criadas por tais magias.\nUsando um Espaço de Magia de Círculo Superior. A barreira bloqueia magias de 1º círculo ou superior para cada círculo de espaço de magia acima de 6.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "golpe-certeiro",
    "name": "Golpe Certeiro",
    "level": 0,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "S",
      "M (uma arma com a qual você tem proficiência e que vale 1 ou mais PP)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Guiado pelo lampejo de uma intuição mágica, você realiza um ataque com a arma usada na conjuração da magia. O ataque usa seu atributo de conjuração para as jogadas de ataque e dano em vez de usar Força ou Destreza. Se o ataque causar dano, ele pode ser Radiante ou do tipo de dano normal da arma (à sua escolha).",
    "cantripUpgrade": "Aprimoramento de Truque. Seja o dano Radiante ou o tipo de dano normal da arma, o ataque causa dano Radiante adicional quando você atinge os níveis 5 (1d6), 11 (2d6) e 17 (3d6).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "golpe-constritor",
    "name": "Golpe Constritor",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus, que você realiza imediatamente após atingir uma criatura com uma arma",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Guardião"
    ],
    "description": "Ao acertar o alvo, vinhas agarradoras aparecem nele e ele realiza uma salvaguarda de Força. Uma criatura Grande ou maior tem Vantagem nesta salvaguarda. Se falhar, o alvo está com a condição Contido até que a magia termine. Em caso de sucesso, as videiras murcham e a magia se encerra.\nEnquanto Contido desse modo, o alvo sofre 1d6 pontos de dano Perfurante no início de cada um dos turnos dele. O alvo ou uma criatura ao alcance dele pode executar uma ação para realizar um teste de Força (Atletismo) contra a CD para evitar sua magia. Em caso de sucesso, as videiras desaparecem.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 1.\nGolpe de Arço\n5º Círculo, Invocação (Guardião, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: S, M (uma arma Corpo a Corpo que vale 1 ou mais PP)\nDuração: Instantânea\nVocê brande a arma usada na conjuração e então desaparece para atacar com rapidez. Escolha até cinco criaturas à sua vista e no alcance da magia. Realize um ataque mágico corpo a corpo contra cada alvo. Em caso de acerto, o alvo sofre 6d10 pontos de dano Energético.\nVocê então se teleporta para um espaço desocupado à sua vista a até 1,5 metro de um dos alvos.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "graxa",
    "name": "Graxa",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pouco de banha de porco ou manteiga)"
    ],
    "duration": "1 minuto",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma graxa não inflamável cobre o solo em um quadrado de 3 metros de lados centrado em um ponto no alcance da magia e o transforma em Terreno Difícil pela duração da magia.\nQuando a graxa aparece, cada criatura em pé e na área da magia deve ser bem-sucedida em uma salvaguarda de Destreza ou tem a condição Caído. Uma criatura que entra na área ou termina o turno nela também deve ser bem-sucedida nessa salvaguarda ou fica Caída.\nGuardiões Espirituais\n3º Círculo, Invocação (Clérigo)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (um pergaminho de oração)\nDuração: Concentração, até 10 minutos\nEspíritos protetores voam ao seu redor em uma Emanação de 4,5 metros pela duração da magia. Se você for bom ou neutro, a forma espectral deles parece angelical ou feérica (à sua escolha). Se você é mau, eles parecem ínferos.\nAo conjurar esta magia, você pode escolher criaturas que não serão afetadas. O Deslocamento de quaisquer outras criaturas é reduzido pela metade na Emanação. Sempre que a Emanação entrar no espaço de uma criatura ou uma criatura entrar na Emanação, ou terminar seu turno nela, ela deve realizar uma salvaguarda de Sabedoria. Se falhar, a criatura sofre 3d8 pontos de dano Radiante (se você for bom ou neutro) ou 3d8 pontos de dano Necrótico (se for mau). Em caso de sucesso, a criatura sofre metade do dano. Cada criatura realiza essa salvaguarda apenas uma vez por turno.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 3.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1318\" w:name=\"_4pio103ajpdm\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1318\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>H",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "heroismo",
    "name": "Heroísmo",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Paladino"
    ],
    "description": "Você toca uma criatura voluntária que se torna imbuída de bravura. Até que a magia termine, a criatura é imune à condição Amedrontado e recebe Pontos de Vida Temporários igual ao seu modificador de atributo de conjuração no início de cada um dos turnos dela.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1320\" w:name=\"_bbjj0y95x0qx\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1320\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>I",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "identificar",
    "name": "Identificar",
    "level": 1,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": false,
    "castingTime": "1 minuto ou Ritual",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (uma pérola no valor de 100 ou mais PO)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Mago"
    ],
    "description": "Você toca um objeto durante a conjuração da magia. Se for um item mágico ou algum outro objeto mágico, você descobre suas propriedades e como usá-las, se ele requer Sintonização e quantas cargas possui, se houver. Você também descobre se alguma magia está afetando o item e quais são elas. Se o item foi criado por uma magia, você identifica o nome dessa magia.\nSe em vez disso você tocar uma criatura durante a conjuração, você descobre quais magias a estão afetando, caso estejam.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "ilusao-menor",
    "name": "Ilusão Menor",
    "level": 0,
    "school": "Ilusão",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "S",
      "M (um pouco de lã)"
    ],
    "duration": "1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria um som ou uma imagem de um objeto no alcance da magia que permanece pela duração da magia. Veja as descrições abaixo para os efeitos de cada um. A ilusão encerra se você conjurar essa magia novamente.\nSe uma criatura executar uma ação Analisar para examinar o som ou a imagem, ela pode determinar que é uma ilusão com um teste bem-sucedido de Inteligência (Investigação) contra a CD para evitar sua magia. Se a criatura perceber a ilusão pelo que ela realmente é, a ilusão se torna tênue para essa criatura.\nSom. Se você criar um som, o volume pode variar de um sussurro a um grito. Pode ser sua voz, a voz de outra pessoa, o rugido de um leão, o bater de tambores ou qualquer outro som que você escolher. O som continua ininterrupto pela duração da magia, ou você pode criar sons distintos em diferentes momentos antes que a magia termine.\nImagem. Se você criar a imagem de um objeto — como uma cadeira, pegadas enlameadas ou um pequeno baú — ela não pode ter dimensões superiores a um cubo de 1,5 metro de lados. A imagem não pode gerar som, luz, cheiro ou qualquer outro efeito sensorial. A interação física com a imagem demonstra que se trata de uma ilusão, pois os objetos podem atravessá-la.\nIlusão Programada\nUm conjurador pode usar Ilusão Programada para fazer com que um cão de guarda apareça e peça gentilmente para que intrusos saiam.\n6º Círculo, Ilusão (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (pó de jade no valor de 25 ou mais PO)\nDuração: Até ser dissipada\nVocê cria a ilusão de um objeto, criatura ou outro fenômeno visível no alcance da magia, ativada por um gatilho específico. A ilusão permanece imperceptível até o gatilho ocorrer. Ela não pode ser maior que um Cubo de 9 metros de lado. Ao conjurar a magia, você define o comportamento da ilusão e os sons que ela emite, com duração máxima de 5 minutos.\nQuando o gatilho especificado ocorre, a ilusão aparece e age conforme você a descreveu. Após a conclusão, ela desaparece e permanece inativa por 10 minutos, podendo ser ativada novamente depois desse período.\nO gatilho pode ser tão geral ou detalhado quanto você desejar, mas deve se basear em fenômenos visuais ou audíveis que ocorram a até 9 metros da área. Por exemplo, você pode criar uma ilusão de si mesmo que aparece para alertar aqueles que tentarem abrir uma porta com armadilha.\nInteração física com a imagem revela sua natureza ilusória, já que objetos podem atravessá-la. Uma criatura que executa a ação Analisar para examinar a imagem pode determinar que se trata de uma ilusão com um teste bem-sucedido de Inteligência (Investigação) contra a CD para evitar sua magia. Se uma criatura perceber a ilusão, ela pode ver através da imagem, e qualquer som que a ilusão emita parece vago para essa criatura.\nImagem Maior\n3º Círculo, Ilusão (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (um pouco de lã)\nDuração: Concentração, até 10 minutos\nVocê cria a imagem de um objeto, uma criatura ou algum outro fenômeno visível que não seja maior do que um Cubo de 6 metros. A imagem aparece em um local à sua vista e no alcance da magia e permanece pela duração. A imagem parece real, incluindo sons, cheiros e temperatura apropriados para a coisa representada, mas não pode causar danos ou condições.\nSe você estiver dentro do alcance da imagem, pode usar a ação Usar Magia para movê-la para outro ponto no alcance da magia. Durante essa movimentação, você pode alterar sua aparência para que os movimentos pareçam naturais. Por exemplo, ao mover a imagem de uma criatura, pode fazê-la parecer que está andando. Além disso, você pode fazer com que a imagem emita sons diferentes em momentos distintos, como continuar uma conversa.\nA interação física com a imagem revela que ela é uma ilusão, pois as coisas podem passar por ela. Uma criatura que executa uma ação Analisar para examinar a imagem pode determinar que ela é uma ilusão com um teste bem-sucedido de Inteligência (Investigação) contra a CD para evitar sua magia. Se uma criatura perceber a ilusão pelo que ela é, ela pode ver através da imagem, e suas outras qualidades sensoriais tornam-se fracas para a criatura.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A magia dura até ser dissipada, sem exigir Concentração, se conjurada com um espaço de magia de 4º círculo ou superior.\nImagem Silenciosa",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "imagem-silenciosa-pode-criar-ilusoes-mundanas-e-excentricas",
    "name": "Imagem Silenciosa pode criar ilusões mundanas e excêntricas",
    "level": 1,
    "school": "Ilusão",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pouco de lã)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria a imagem de um objeto, uma criatura ou algum outro fenômeno visível que não seja maior do que um Cubo de 4,5 metros de lado. A imagem aparece em um local pela duração e no alcance da magia. A imagem é puramente visual; não é acompanhada por som, cheiro ou outros efeitos sensoriais.\nComo uma ação Usar Magia, você pode mover a imagem para qualquer ponto no alcance da magia. À medida que a imagem muda de local, você pode alterar a aparência da imagem para que os movimentos dela pareçam naturais para a imagem. Por exemplo, se você criar a imagem de uma criatura e movê-la, pode alterá-la para que pareça estar andando.\nA interação física com a imagem revela que ela é uma ilusão, pois as coisas podem passar por ela. Uma criatura que executa uma ação Analisar para examinar a imagem pode determinar que ela é uma ilusão com um teste bem-sucedido de Inteligência (Investigação) contra a CD para evitar sua magia. Se uma criatura perceber a ilusão pelo que ela é, a criatura pode ver através da imagem.\nIndetectável\n3º Círculo, Abjuração (Bardo, Guardião, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (uma pitada de poeira de diamante no valor de 25 ou mais PO, que a magia consome)\nDuração: 8 horas\nPela duração da magia, você protege um alvo que tocar contra magias de Adivinhação. O alvo pode ser uma criatura voluntária, um local ou um objeto que não exceda 3 metros em qualquer dimensão. O alvo não pode ser afetado por nenhuma magia de Adivinhação nem percebido através de sensores mágicos de vidência.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "infligir-ferimentos",
    "name": "Infligir Ferimentos",
    "level": 1,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo"
    ],
    "description": "Uma criatura que você tocar realiza uma salvaguarda de Constituição, sofrendo 2d10 pontos de dano Necrótico se falhar ou metade desse dano em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d10 para cada círculo de espaço de magia acima de 1.\nInseto Gigante\n4º Círculo, Invocação (Druida)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê invoca uma aranha, centopeia ou vespa gigante (escolhida ao conjurar a magia). Ela se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Inseto Gigante. A forma escolhida determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ele obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nInseto Gigante\nFera Grande, Sem Alinhamento\nCA 11 + o círculo da magia\nPV 30 + 10 para cada círculo de magia acima do 4\nDeslocamento 12 m, Escalada 12 m, Voo 12 m (apenas Vespa)\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n17\n+3\n+3\nDes\n15\n+2\n+2\nCon\n14\n+2\n+4\nInt\n13\n+1\n+1\nSab\n3\n-3\n-3\nCar\n3\n-4\n-4\nSentidos: Visão no Escuro 18 m, Percepção Passiva 12\nIdiomas Compreende os idiomas que você conhece\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nEscalada de Aranha. O inseto pode escalar superfícies difíceis, inclusive ao longo de tetos, sem precisar realizar um teste de atributo.\nAções\nAtaques Múltiplos. O inseto realiza um número de ataques igual à metade do círculo da magia (arredondado para baixo).\nPunição Venenosa. Jogada de Ataque Corpo a Corpo. Bônus é igual ao seu modificador de ataque mágico, alcance 3 m. Dano: 1d6 + 3 mais o círculo da magia em pontos de dano Perfurante mais 1d4 pontos de dano Venenoso.\nRaio de Teia (Apenas Aranha). Jogada de Ataque à Distância. Bônus é igual ao seu modificador de ataque mágico, alcance 18 m. Dano: 1d10 + 3 mais o círculo da magia em pontos de dano Contundente, e o Deslocamento do alvo é reduzido a 0 até o início do próximo turno do inseto.\nAções Bônus\nCuspe Venenoso (Apenas Centopeia). Salvaguarda de Constituição. Sua CD para evitar magia, uma criatura à vista do inseto a até 3 metros. Falha: O alvo tem a condição Envenenado até o início do próximo turno do inseto.\nInverter a Gravidade\n7º Círculo, Transmutação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 30 metros\nComponentes: V, S, M (uma pedra-ímã e raspas de ferro)\nDuração: Concentração, até 1 minuto\nEsta magia inverte a gravidade em um Cilindro de 15 metros de raio e 30 metros de altura, centrado em um ponto ao alcance da magia. Todas as criaturas e objetos na área que não estão fixos ao chão são levados para cima até o topo do Cilindro. Uma criatura pode realizar uma salvaguarda de Destreza para agarrar um objeto fixo que possa alcançar, evitando assim a queda ascendente.\nSe um teto ou objeto ancorado for encontrado nessa subida, criaturas e objetos colidem com ele como em uma queda normal. Se chegarem ao topo do Cilindro sem colidir com nada, pairam lá pela duração da magia. Quando a magia termina, criaturas e objetos afetados caem.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "invisibilidade",
    "name": "Invisibilidade",
    "level": 2,
    "school": "Ilusão",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (um cílio envolto em goma arábica)"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma criatura que você toca tem a condição Invisível até que a magia termine. A magia se encerra antes se o alvo realizar uma jogada de ataque, causar dano ou conjurar uma magia.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 2.\nInvisibilidade Maior\n4º Círculo, Ilusão (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nUma criatura que você toca tem a condição Invisível até que a magia termine.\nInvocação Instantânea de Drawmij\n6º Círculo, Invocação (Mago)\nTempo de Conjuração: 1 minuto ou Ritual\nAlcance: Toque\nComponentes: V, S, M (uma safira no valor de 1.000 ou mais PO)\nDuração: Até ser dissipada\nVocê toca a safira usada na conjuração e um objeto pesando 3 quilos ou menos, cuja dimensão mais longa é de 2 metros ou menos. A magia deixa uma marca invisível nesse objeto e inscreve invisivelmente o nome do objeto na safira. Cada vez que você conjura essa magia, deve usar uma safira diferente.\nDepois disso, você pode executar uma ação Usar Magia para proferir o nome do objeto e esmagar a safira. O objeto aparece instantaneamente em sua mão, independentemente das distâncias físicas ou planares, e a magia termina.\nSe outra criatura estiver segurando ou carregando o objeto, esmagar a safira não a transporta, mas, em vez disso, você descobre quem é essa criatura e onde ela está localizada no momento.\nInvocar Aberração\nEspírito Aberrante (Pseudo-observador)\n4º Círculo, Invocação (Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um tentáculo em conserva e um globo ocular em um frasco incrustado de platina no valor de 400 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca um Espírito Aberrante. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Aberrante. Ao conjurar a magia, escolha entre Devorador de Mentes, Pseudo-observador ou Slaad. A criatura se assemelha a uma Aberração desse tipo, o que determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ela obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Aberrante\nAberração Média, Neutra\nCA 11 + o círculo da magia\nPV 40 + 10 para cada círculo de magia acima de 4\nDeslocamento 9 m; Voo 9 m (pairar; apenas Pseudo-observador)\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n16\n+3\n+3\nDes\n10\n+0\n+0\nCon\n15\n+2\n+2\nInt\n16\n+0\n+0\nSab\n10\n+0\n+0\nCar\n6\n-2\n-2\nImunidades Psíquico\nSentidos Visão no Escuro 18 m, Percepção Passiva 10\nIdiomas Dialeto Obscuro, entende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nAura Sussurrante (Apenas Devorador de Mentes). No início de cada turno do espírito, ele emite energia psiônica se não tem a condição Incapacitado. Salvaguarda de Sabedoria: CD é igual a CD para evitar sua magia, cada criatura (exceto você) a até 1,5 metro do espírito. Falha: 2d6 pontos de dano Psíquico.\nRegeneração (Apenas Slaad). O espírito recupera 5 Pontos de Vida no início do turno dele se tiver pelo menos 1 Ponto de Vida.\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques igual à metade do círculo da magia (arredondado para baixo).\nGarras (Apenas Slaad). Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d10 + 3 + o círculo da magia em pontos de dano Cortante, e o alvo não pode recuperar Pontos de Vida até o início do próximo turno do espírito.\nPancada Psíquica (Apenas Devorador de Mentes). Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d8 + 3 + o círculo da magia em pontos de dano Psíquico.\nRaio Ocular (Somente Pseudo-observador). Jogada de Ataque à Distância: Bônus é igual ao seu modificador de ataque mágico, alcance 45 m. Dano: 1d8 + 3 + o círculo da magia em pontos de dano Psíquico.\nInvocar Animais\n3º Círculo, Invocação (Druida, Guardião)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê conjura espíritos da natureza que aparecem como um grande bando de animais espectrais e intangíveis em um espaço desocupado à sua vista e no alcance da magia. O bando permanece pela duração da magia e você escolhe a forma animal dos espíritos, como lobos, serpentes ou pássaros.\nVocê tem Vantagem em salvaguardas de Força enquanto estiver a até 1,5 metro do bando e, quando se mover no seu turno, também pode mover o bando até 9 metros para um espaço desocupado à sua vista.\nSempre que o bando se mover até 3 metros de uma criatura à sua vista ou quando uma criatura à sua vista entrar ou terminar seu turno a até 3 metros do bando, você pode forçá-la a realizar uma salvaguarda de Destreza. Se falhar, a criatura sofre 3d10 pontos de dano Cortante. Cada criatura só realiza essa salvaguarda uma vez por turno.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d10 para cada círculo de espaço de magia acima de 3.\nInvocar Barragem\n3º Círculo, Invocação (Guardião)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (uma arma Corpo a Corpo ou à Distância que vale pelo menos 1 PP)\nDuração: Instantânea\nVocê brande a arma usada para conjurar a magia e invoca armas espectrais semelhantes (ou munição apropriada para a arma) que são lançadas adiante e depois desaparecem. Cada criatura à sua escolha à sua vista em um Cone de 18 metros realiza uma salvaguarda de Destreza, sofrendo 5d8 pontos de dano Energético se falhar, ou metade desse dano em caso de sucesso.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 3.\nInvocar Celestial\n7º Círculo, Invocação (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê conjura um espírito dos Planos Superiores, que se manifesta como um pilar de luz em um Cilindro de 3 metros de raio e 12 metros de altura centrado em um ponto no alcance da magia. Para cada criatura à sua vista no Cilindro, escolha qual dessas luzes brilha sobre ela:\nLuz Curativa. O alvo recupera Pontos de Vida iguais a 4d12 mais seu modificador de atributo de conjuração.\nLuz Ardente. O alvo realiza uma salvaguarda de Destreza, sofrendo 6d12 pontos de dano Radiante se falhar, ou metade desse dano em caso de sucesso.\nAté que a magia termine, Luz Plena preenche o Cilindro e, quando você se mover no seu turno, também pode mover o Cilindro até 9 metros.\nSempre que o Cilindro se mover para o espaço de uma criatura à sua vista e sempre que uma criatura à sua vista entrar no Cilindro ou terminar seu turno lá, você pode envolvê-lo com uma das luzes. Uma criatura pode ser afetada por esta magia apenas uma vez por turno.\nUsando um Espaço de Magia de Círculo Superior. A cura e o dano aumentam em 1d12 para cada círculo de espaço de magia acima de 7.\nInvocar Constructo\n4º Círculo, Invocação (Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um cofre no valor de 400 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca o espírito de um Construto. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito do Constructo. Ao conjurar a magia, escolha um material: Argila, Metal ou Pedra. A criatura se assemelha a uma estátua animada (você determina a aparência) composto do material escolhido, que determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ela obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito do Constructo\nConstructo Médio, Neutro\nCA13 + o círculo da magia\nPV 40 + 15 para cada círculo de magia acima de 4\nDeslocamento 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n18\n+4\n+4\nDes\n10\n+0\n+0\nCon\n18\n+4\n+4\nInt\n14\n+2\n+2\nSab\n11\n+0\n+0\nCar\n5\n-3\n-3\nResistências Venenoso\nImunidades Amedrontado, Enfeitiçado, Envenenado, Exaustão, Paralisado\nSentidos Visão no Escuro 18 m, Percepção Passiva 10\nIdiomas Compreende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nCorpo Aquecido (Apenas Metal). Uma criatura que atinge o espírito com um ataque corpo a corpo ou que inicia seu turno imobilizando o espírito sofre 1d10 pontos de dano Ígneo.\nLetargia Empedernida (Apenas Pedra). Quando uma criatura começa o turno dela a até 3 metros do espírito, o espírito pode atacá-la com energia mágica se o espírito puder vê-la. Salvaguarda de Sabedoria: CD é igual a CD para evitar sua magia. Falha: Até o início do próximo turno do espírito, o alvo não pode realizar Ataques de Oportunidade e seu Deslocamento é reduzido pela metade.\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques de Pancada igual à metade do círculo da magia (arredondado para baixo).\nPancada. Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d8 + 4 + o círculo da magia pontos de dano Contundente.\nReações\nReação Violenta (Apenas Argila). Gatilho: O espírito sofre dano de uma criatura. Reação: O espírito realiza um ataque de Pancada contra essa criatura, se possível, ou o espírito se move até metade do seu Deslocamento em direção a essa criatura sem provocar Ataques de Oportunidade.\nInvocar Dragão\n5º Círculo, Invocação (Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S, M (um objeto com a imagem de um dragão gravado nele no valor de 500 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca um Espírito Dracônico. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Dracônico. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ele obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Dracônico\nDragão Grande, Neutro\nCA 14 + o círculo da magia\nPV 50 + 10 para cada círculo de magia acima de 5\nDeslocamento 9 m, Natação 9 m; Voo 18 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n19\n+4\n+4\nDes\n14\n+2\n+2\nCon\n17\n+3\n+3\nInt\n10\n+0\n+0\nSab\n14\n+2\n+2\nCar\n14\n+2\n+2\nResistências Ácido, Elétrico, Gélido, Ígneo, Venenoso\nImunidades Amedrontado, Enfeitiçado, Envenenado\nSentidos Visão às Cegas 9 m, Visão no Escuro 18 m, Percepção Passiva 12\nIdiomas Dracônico, compreende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nResistências Compartilhadas. Ao invocar o espírito, escolha uma das resistências dele. Você tem Resistência ao tipo de dano escolhido até que a magia termine.\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques de Dilacerar igual à metade do círculo da magia (arredondado para baixo) e usa o Ataque de Sopro.\nAtaque de Sopro. Salvaguarda de Destreza: CD é igual a CD para evitar sua magia, cada criatura em um Cone de 9 metros. Falha: 2d6 pontos de dano de um tipo ao qual o espírito tem Resistência (à sua escolha quando você conjura a magia). Sucesso: Metade do dano.\nDilacerar. Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 3 m. Dano: 1d6 + 4 + o círculo da magia pontos de dano Perfurante.\nInvocar Elementais Menores\n4º Círculo, Invocação (Druida, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê conjura espíritos dos Planos Elementais que voam ao seu redor em uma Emanação de 4,5 metros pela duração da magia. Até que a magia termine, qualquer ataque que você realizar causa 2d8 pontos de dano adicional quando você atinge uma criatura na Emanação. Este dano é Ácido, Elétrico, Gélido ou Ígneo (à sua escolha quando realizar o ataque).\nAlém disso, o terreno da Emanação é Terreno Difícil para seus inimigos.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 2d8 para cada círculo de espaço de magia acima de 4.\nInvocar Elemental\n5º Círculo, Invocação (Druida, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê conjura um espírito Grande e intangível dos Planos Elementais que aparece em um espaço desocupado no alcance da magia. Escolha o elemento do espírito, que determina o tipo de dano que ele causa: água (Gélido), ar (Elétrico), fogo (Ígneo) ou terra (Trovejante). O espírito permanece pela duração da magia.\nSempre que uma criatura à sua vista entrar no espaço do espírito ou iniciar o turno a até 1,5 metro do espírito, você pode forçá-la a realizar uma salvaguarda de Destreza se o espírito não tiver nenhuma criatura Contida. Se falhar, o alvo sofre 8d8 pontos de dano do tipo do espírito, e tem a condição Contido até que a magia termine. No início de cada um dos turnos do alvo Contido, ele repete a salvaguarda. Se falhar, o alvo sofre 4d8 pontos de dano do tipo do espírito. Em caso de sucesso, o alvo não é Contido pelo espírito.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 2d8 para cada círculo de espaço de magia acima de 5.\nInvocar Feérico\n6º Círculo, Invocação (Druida)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê conjura um espírito Médio de Faéria em um espaço desocupado à sua vista e no alcance da magia. O espírito permanece pela duração da magia e se assemelha a uma criatura Feérica à sua escolha. Quando o espírito aparece, você pode realizar um ataque mágico corpo a corpo contra uma criatura a até 1,5 metro dele. Em caso de acerto, o alvo sofre dano Psíquico igual a 3d12 mais o seu modificador de atributo de conjuração, e o alvo tem a condição Amedrontado até o início do seu próximo turno, com você e o espírito como a fonte do medo.\nComo uma Ação Bônus em seus turnos posteriores, você pode teleportar o espírito para um espaço desocupado à sua vista a até 9 metros do espaço restante e realizar o ataque contra uma criatura a até 1,5 metro dele.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 2d12 para cada círculo de espaço de magia acima de 6.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "invocar-fera",
    "name": "Invocar Fera",
    "level": 2,
    "school": "Invocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "27 metros",
    "components": [
      "V",
      "S",
      "M (uma pluma",
      "tufo de pele e rabo de peixe dentro de uma bolota dourada no valor de 200 ou mais PO)"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Druida",
      "Guardião"
    ],
    "description": "Você invoca um Espírito Bestial. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Bestial. Ao conjurar a magia, escolha um ambiente: Água, Ar ou Terra. A criatura se assemelha a um animal à sua escolha que é nativo do ambiente escolhido, o que determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ele obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Bestial\nFera Pequena, Neutra\nCA 11 + o círculo da magia\nPV 20 (apenas Ar) ou 30 (apenas Água e Terra) + 5 para cada círculo de magia acima de 2\nDeslocamento 9 m; Escalada 9 m (Apenas Terra); Natação 9 m (Apenas água); Voo 18 m (Apenas Ar)\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n18\n+4\n+4\nDes\n11\n+0\n+0\nCon\n16\n+3\n+3\nInt\n4\n-3\n-3\nSab\n14\n+2\n+2\nCar\n5\n-3\n-3\nSentidos: Visão no Escuro 18 m, Percepção Passiva 12\nIdiomas: Compreende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nRespirar na Água (Apenas Água). O espírito só pode respirar debaixo d'água.\nSobrevoo (Apenas Ar). O espírito não provoca Ataques de Oportunidade quando voa para fora do alcance de um inimigo.\nTáticas de Grupo (Apenas Água e Terra). O espírito tem Vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do espírito estiver a até 1,5 metro da criatura e o aliado não tem a condição Incapacitado.\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques de Dilacerar igual à metade do círculo da magia (arredondado para baixo).\nDilacerar. Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d8 + 4 + o círculo da magia em pontos de dano Perfurante.\nInvocar Ínfero\n6º Círculo, Invocação (Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um frasco com sangue no valor de 600 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca um Espírito Ínfero. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Ínfero. Ao conjurar a magia, escolha Demônio, Diabo ou Yugoloth.\nA criatura se assemelha a um Ínfero do tipo escolhido, o que determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ela obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Ínfero\nÍnfero Grande, Neutro\nCA 12 + o círculo da magia\nPV 50 (apenas Demônio) ou 40 (apenas Diabo) ou 60 (apenas Yugoloth) + 15 para cada círculo de magia acima de 6\nDeslocamento 12 m; Escalada 12 m (apenas Demônio); Voo 18 m (apenas Diabo)\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n13\n+1\n+1\nDes\n16\n+3\n+3\nCon\n15\n+2\n+2\nInt\n10\n+0\n+0\nSab\n10\n+0\n+0\nCar\n16\n+3\n+3\nResistências Ígneo\nImunidades Venenoso; Envenenado\nSentidos Visão no Escuro 18 m, Percepção Passiva 10\nIdiomas Abissal, Infernal, Telepatia 18 m\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nEspasmos da Morte (Apenas Demônio). Quando o espírito é reduzido a 0 Pontos de Vida ou a magia terminar, o espírito explode. Salvaguarda de Destreza: CD é igual a CD para evitar sua magia, cada criatura em uma Emanação de 3 metros originada a partir do espírito. Falha: 2d10 mais o círculo da magia em pontos de dano Ígneo. Sucesso: Metade do dano.\nResistência à Magia. O espírito tem Vantagem em salvaguardas contra magias e outros efeitos mágicos.\nVisão Diabólica (Apenas Diabo). Escuridão Mágica não impede a Visão no Escuro do espírito.\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques igual à metade do círculo da magia (arredondado para baixo).\nArremesso de Chamas (Apenas Diabo). Jogada de Ataque à Distância: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m ou alcance 45 m. Dano: 2d6 + 3 + o círculo da magia em pontos de dano Ígneo.\nGarras (Apenas Yugoloth). Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d8 + 3 + o círculo da magia em pontos de dano Cortante. Imediatamente após o ataque acertar ou errar, o espírito pode se teleportar até 9 metros para um espaço desocupado à vista dele.\nMordida (Apenas Demônio). Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d12 + 3 + o círculo da magia em pontos de dano Necrótico.\nInvocar Morto-Vivo\n3º Círculo, Necromancia (Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um crânio dourado no valor de 300 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê invoca um Espírito Morto-Vivo. Ele se manifesta em um espaço desocupado à sua vista e no alcance da magia e usa o bloco de estatísticas do Espírito Morto-vivo. Ao conjurar a magia, escolha a forma da criatura: Esquelético, Fantasmagórico ou Pútrido. O espírito se assemelha a uma criatura Morta-viva com a forma escolhida, o que determina certos detalhes no bloco de estatísticas da criatura. A criatura desaparece ao ser reduzida a 0 Pontos de Vida ou quando a magia termina.\nA criatura é uma aliada sua e de seus aliados. Em combate, ela compartilha sua contagem de Iniciativa, mas o turno dela é imediatamente após o seu. Ele obedece aos seus comandos verbais (nenhuma ação é necessária). Se você não emitir nenhum, ela executa a ação Esquivar e usa o movimento dela para evitar o perigo.\nUsando um Espaço de Magia de Círculo Superior. Use o círculo do espaço de magia para o círculo da magia no bloco de estatísticas.\nEspírito Morto-Vivo\nMorto-vivo Médio, Neutro\nCA 11 + o círculo da magia\nPV 30 (apenas Fantasmagórico e Pútrido) ou 20 (apenas Esquelético) + 10 para cada círculo de magia acima de 3\nDeslocamento 9 m; Voo 12 m (pairar; apenas Fantasmagórico)\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n12\n+1\n+1\nDes\n16\n+3\n+3\nCon\n15\n+2\n+2\nInt\n4\n-3\n-3\nSab\n10\n+0\n+0\nCar\n9\n-1\n-1\nImunidades Necrótico, Venenoso; Amedrontado, Envenenado, Exaustão, Paralisado\nSentidos Visão no Escuro 18 m, Percepção Passiva 10\nIdiomas Compreende os idiomas que você fala\nND Nenhum (XP 0; BP é igual ao seu Bônus de Proficiência)\nTraços\nAura Purulenta (Apenas Pútrido). Salvaguarda de Constituição: CD é igual a CD para evitar sua magia, qualquer criatura (exceto você) que inicie o turno dentro de uma Emanação de 1,5 metro originada a partir do espírito. Falha: A criatura tem a condição Envenenado até o início de seu próximo turno.\nPassagem Incorpórea (Apenas Fantasmagórico). O espírito pode se mover através de outras criaturas e objetos como se fossem Terreno Difícil. Se ele terminar o turno dentro de um objeto, ele é desviado para o espaço desocupado mais próximo e sofre 1d10 pontos de dano Energético por cada 1,5 metro percorrido.\nAções\nAtaques Múltiplos. O espírito realiza um número de ataques igual à metade do círculo da magia (arredondado para baixo).\nGarra Podre (Apenas Pútrido). Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d6 + 3 + o círculo da magia em pontos de dano Cortante. Se o alvo tem a condição Envenenado, ele tem a condição Paralisado até o final do próximo turno dele.\nRaio da Cova (Somente Esquelético). Jogada de Ataque à Distância: Bônus é igual ao seu modificador de ataque mágico, alcance 45 m. Dano: 2d4 + 3 + o círculo da magia em pontos de dano Necrótico.\nToque Mortal (Apenas Fantasmagórico). Jogada de Ataque Corpo a Corpo: Bônus é igual ao seu modificador de ataque mágico, alcance 1,5 m. Dano: 1d8 + 3 + o círculo da magia em pontos de dano Necrótico, e o alvo tem a condição Amedrontado até o final do próximo turno dele.\nInvocar Saraivada\n5º Círculo, Invocação (Guardião)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (uma arma Corpo a Corpo ou à Distância no valor de 1 ou mais PP)\nDuração: Instantânea\nVocê brande a arma usada para conjurar a magia e escolhe um ponto no alcance da magia. Centenas de armas espectrais similares (ou munição apropriada para a arma) caem em uma saraivada e depois desaparecem.\nCada criatura à sua escolha à sua vista em um Cilindro de 12 metros de raio e 6 metros de altura, centrada nesse ponto, realiza uma salvaguarda de Destreza. Uma criatura sofre 8d8 pontos de dano Energético se falhar, ou metade desse dano em caso de sucesso.\nInvocar Seres da Floresta\n4º Círculo, Invocação (Druida, Guardião)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê conjura espíritos da natureza que voam ao seu redor em uma Emanação de 3 metros pela duração da magia. Quando a Emanação invade o espaço de uma criatura à sua vista, ou quando uma criatura à sua vista entra ou termina o turno na Emanação, você pode forçá-la a realizar uma salvaguarda de Sabedoria. Se falhar, a criatura sofre 5d8 pontos de dano Energético ou metade desse dano se tiver sucesso. A criatura realiza essa salvaguarda apenas uma vez por turno.\nAlém disso, você pode executar a ação Desengajar como uma Ação Bônus pela duração da magia.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 4.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1353\" w:name=\"_3addhzvxj3v6\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1353\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>L\nLabirinto\n8º Círculo, Invocação (Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê bane uma criatura à sua vista e no alcance da magia para um semiplano labiríntico. O alvo permanece lá pela duração ou até escapar do labirinto.\nO alvo pode executar uma ação Analisar para tentar escapar. Quando isso acontece, ele realiza um teste de Inteligência (Investigação) CD 20. Em caso de sucesso, ele escapa e a magia se encerra.\nQuando a magia termina, o alvo reaparece no espaço que deixou ou, se esse espaço estiver ocupado, no espaço desocupado mais próximo.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "lamina-flamejante",
    "name": "Lâmina Flamejante",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (uma folha de sumagre)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Druida",
      "Feiticeiro"
    ],
    "description": "Você evoca uma lâmina flamejante em sua mão livre. A lâmina é semelhante em tamanho e forma a uma cimitarra e permanece pela duração da magia. Se você soltar a lâmina, ela desaparece, mas você pode evocá-la novamente como uma Ação Bônus.\nComo uma ação Usar Magia, você pode realizar um ataque mágico corpo a corpo com a lâmina flamejante. Em caso de acerto, o alvo sofre 3d6 pontos de dano Ígneo mais o seu modificador de atributo de conjuração.\nA lâmina flamejante emite Luz Plena em um raio de 3 metros e Meia-luz por mais 3 metros.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 2.\nLendas e Histórias\n5º Círculo, Adivinhação (Bardo, Clérigo, Mago)\nTempo de Conjuração: 10 minutos\nAlcance: Pessoal\nComponentes: V, S, M (incenso no valor de 250 ou mais PO, que a magia consome, e quatro tiras de marfim no valor de 50 ou mais PO cada)\nDuração: Instantânea\nNomeie ou descreva uma pessoa, lugar ou objeto famoso. A magia traz à sua mente um breve resumo do conhecimento significativo sobre essa coisa famosa, conforme descrito pelo Mestre.\nO conhecimento pode incluir detalhes significativos, revelações intrigantes ou até mesmo informações secretas que nunca foram amplamente divulgadas. Quanto mais você já sabe sobre o assunto, mais precisas e detalhadas se tornam as informações que recebe. Essas informações são exatas, mas podem ser expressas em linguagem figurada ou poesia, conforme determinado pelo Mestre. Se a coisa famosa que você escolheu não for realmente famosa, você ouve notas musicais tristes tocadas em um trombone, e a magia falha.\nLentidão\n3º Círculo, Transmutação (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (uma gota de melaço)\nDuração: Concentração, até 1 minuto\nVocê altera a passagem do tempo em torno de até seis criaturas à sua escolha em um Cubo de 12 metros de lado no alcance da magia. Cada alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou é afetado por esta magia pela sua duração.\nO Deslocamento de um alvo afetado é reduzido pela metade, sofre uma penalidade de -2 em salvaguardas de Destreza e na CA e não pode executar Reações. Nos turnos do alvo, ele pode executar uma ação ou uma Ação Bônus, não ambas, e pode realizar apenas um ataque se executar a ação Atacar. Se conjurar uma magia com um componente Somático, há uma chance de 25% da magia falhar como resultado do alvo fazer os gestos da magia muito lentamente.\nUm alvo afetado repete a salvaguarda no final de cada um dos turnos dele, encerrando a magia em caso de sucesso.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "leque-cromatico",
    "name": "Leque Cromático",
    "level": 1,
    "school": "Ilusão",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (uma pitada de areia colorida)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você lança uma série deslumbrante de luzes ofuscantes e coloridas. Cada criatura em um Cone de 4,5 metros originado em você deve ser bem-sucedida em uma salvaguarda de Constituição ou tem a condição Cego até o final do seu próximo turno.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "levitacao",
    "name": "Levitação",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (uma mola de metal)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma criatura ou objeto solto à sua escolha, à sua vista e no alcance da magia sobe verticalmente até 6 metros e permanece suspenso pela duração. A magia pode levitar um objeto que pesa até 200 quilos. Uma criatura involuntária que seja bem-sucedida em uma salvaguarda de Constituição não é afetada.\nO alvo pode se mover apenas empurrando ou puxando um objeto ou superfície fixa ao alcance dele (como uma parede ou um teto), o que permite que ele se mova como se estivesse escalando. No seu turno, você pode mudar a altitude do alvo em até 6 metros em qualquer direção. Se você for o alvo, pode se mover para cima ou para baixo como parte de seu movimento. Caso contrário, você pode executar uma ação Usar Magia para mover o alvo, que deve permanecer no alcance da magia.\nQuando a magia termina, o alvo flutua suavemente até o chão se ainda estiver no alto.\nLigação Telepática de Rary\n5º Círculo, Adivinhação (Bardo, Mago)\nTempo de Conjuração: Ação ou Ritual\nAlcance: 9 metros\nComponentes: V, S, M (dois ovos)\nDuração: 1 hora\nVocê cria uma ligação telepática entre até oito criaturas voluntárias à sua escolha no alcance da magia, vinculando psiquicamente cada criatura a todas as outras pela duração da magia. Criaturas que não podem se comunicar em nenhum idioma não são afetadas por esta magia.\nAté que a magia termine, os alvos podem se comunicar telepaticamente através da ligação, mesmo que não compartilhem um idioma. A comunicação é possível a qualquer distância, embora não possa se estender para outros planos de existência.\nLimpar a Mente\n8º Círculo, Abjuração (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S\nDuração: 24 horas\nAté que a magia termine, uma criatura voluntária que você toca adquire Imunidade a dano Psíquico e à condição Enfeitiçado. O alvo também fica imune a qualquer coisa que possa detectar suas emoções ou alinhamento, ler seus pensamentos, detectar magicamente sua localização, e nenhuma magia — nem mesmo Desejo — pode obter informações sobre o alvo, observá-lo remotamente ou controlar sua mente.\nLínguas\n3º Círculo, Adivinhação (Bardo, Bruxo, Clérigo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, M (um zigurate em miniatura)\nDuração: 1 hora\nEsta magia concede à criatura que você toca a capacidade de entender qualquer idioma falado ou com linguagem de sinais que ela ouça ou veja. Além disso, quando o alvo se comunica falando ou usando sinais, qualquer criatura que conheça pelo menos um idioma pode entendê-lo se essa criatura puder ouvir as palavras ou ver os sinais.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "localizar-animais-ou-plantas",
    "name": "Localizar Animais ou Plantas",
    "level": 2,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (pelo de um cão de caça)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Druida",
      "Guardião"
    ],
    "description": "Descreva ou nomeie uma criatura do tipo Fera, Planta ou planta não mágica. Você descobre a direção e a distância até a criatura ou planta mais próxima desse tipo a até 8 quilômetros, se houver alguma presente.\nLocalizar Criatura\n4º Círculo, Adivinhação (Bardo, Clérigo, Druida, Guardião, Mago, Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (pelo de um cão de caça)\nDuração: Concentração, até 1 hora\nDescreva ou nomeie uma criatura que você conheça bem. Você descobre a direção e a localização da criatura se ela estiver a até 300 metros de distância. Se a criatura estiver se movendo, você sabe em que direção.\nA magia pode localizar uma criatura específica que você conheça ou a criatura mais próxima de um tipo específico (como um humano ou um unicórnio) se você tiver visto tal criatura de perto — a até 9 metros — ao menos uma vez. Se a criatura que você descreveu ou nomeou estiver em uma forma diferente, como sob os efeitos de uma magia De Carne para Pedra ou Polimorfia, esta magia não localiza a criatura.\nEsta magia não pode localizar uma criatura se qualquer espessura de chumbo bloquear um caminho direto entre você e a criatura.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "localizar-objeto",
    "name": "Localizar Objeto",
    "level": 2,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (um galho bifurcado)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Bardo",
      "Clérigo",
      "Druida",
      "Guardião",
      "Mago",
      "Paladino"
    ],
    "description": "Descreva ou nomeie um objeto que você conheça bem. Você descobre a direção e a localização do objeto se ele estiver a até 300 metros de você. Se o objeto estiver se movendo, você sabe em que direção.\nA magia pode localizar um objeto específico que você conheça se você o tiver visto de perto — a até 9 metros — ao menos uma vez. Se preferir, a magia pode localizar o objeto mais próximo de um tipo específico, como um certo tipo de traje, joias, mobília, ferramentas ou armas.\nEsta magia não pode localizar um objeto se qualquer espessura de chumbo bloquear um caminho direto entre você e o objeto.\nLoquacidade\n8º Círculo, Encantamento (Bardo, Bruxo)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: 1 hora\nAté que a magia termine, ao realizar um teste de Carisma, você pode substituir o número que você tirou por um 15. Além disso, não importa o que você diga, a magia que determinaria se você está dizendo a verdade indica que você está sendo verdadeiro.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "lufada-de-vento",
    "name": "Lufada de Vento",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (a semente de um legume)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Druida",
      "Feiticeiro",
      "Guardião",
      "Mago"
    ],
    "description": "Você sopra uma Linha com um vento forte de 18 metros de comprimento e 3 metros de largura em uma direção à sua escolha pela duração da magia. Cada criatura na Linha deve ser bem-sucedida em uma salvaguarda de Força ou é empurrada 4,5 metros para longe de você em uma direção seguindo a Linha. Uma criatura que termine o turno na Linha deve realizar a mesma salvaguarda.\nQualquer criatura na Linha deve gastar 3 metros de movimento para cada 1,5 metro que se move ao se aproximar de você.\nA lufada dispersa gás ou vapor e extingue velas e chamas desprotegidas similares na área. Isso faz com que as chamas protegidas, como as de lanternas, dancem descontroladamente e possuam 50% de chance de serem extinguidas.\nComo uma Ação Bônus em seus turnos posteriores, você pode alterar a direção da Linha soprada por você.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "luz",
    "name": "Luz",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "M (um vaga-lume ou musgo fosforescente)"
    ],
    "duration": "1 hora",
    "classes": [
      "Bardo",
      "Clérigo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você toca em um objeto Grande ou menor que não está sendo usado ou carregado por outra pessoa. Até que a magia termine, o objeto emite Luz Plena em um raio de 6 metros e Meia-luz por mais 6 metros. A luz pode ter a cor que você desejar.\nCobrir o objeto com algo opaco bloqueia a luz. A magia se encerra se você a conjurar novamente.\nLuz do Dia\nUm elfo Clérigo usa a magia Luz do Dia para trazer a luz do amanhecer para uma corte de vampiros.\n3º Círculo, Evocação (Clérigo, Druida, Feiticeiro, Guardião, Paladino)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: 1 hora\nPela duração da magia, a luz do sol se espalha de um ponto no alcance da magia e preenche uma Esfera de 18 metros de raio. A área da luz do sol é Luz Plena e emite Meia-luz por mais 18 metros.\nComo alternativa, você conjura a magia em um objeto que não esteja sendo usado ou carregado, fazendo com que a luz do sol preencha uma Emanação de 18 metros originada desse objeto. Cobrir esse objeto com algo opaco, como uma tigela ou elmo, bloqueia a luz do sol.\nSe qualquer área desta magia se sobrepuser a uma área de Escuridão criada por uma magia de 3º círculo ou inferior, essa outra magia é dissipada.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "luzes-dancantes",
    "name": "Luzes Dançantes",
    "level": 0,
    "school": "Ilusão",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S",
      "M (um pouco de fósforo)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria até quatro luzes do tamanho de tochas no alcance da magia, fazendo com que elas pareçam tochas, lanternas ou esferas brilhantes que pairam pela duração da magia. Como alternativa, você combina as quatro luzes em uma forma Média, brilhante, a qual é vagamente humanoide. Seja qual for a forma que você escolher, cada luz emite Meia-luz em um raio de 3 metros.\nComo uma Ação Bônus, você pode mover as luzes até 18 metros para um espaço no alcance da magia. Uma luz deve estar a até 6 metros de outra luz criada por esta magia, e uma luz desaparece se ultrapassar o alcance da magia.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1371\" w:name=\"_6wvrt1zajtfz\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1371\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>M\nMalogro\n4º Círculo, Necromancia (Bruxo, Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: Instantânea\nUma criatura à sua vista e no alcance da magia realiza uma salvaguarda de Constituição, sofrendo 8d8 pontos de dano Necrótico se falhar ou metade desse dano em caso de sucesso. Uma criatura do tipo Planta falha automaticamente na salvaguarda.\nComo alternativa, escolha como alvo uma planta não mágica que não seja uma criatura, como uma árvore ou um arbusto. Ela não realiza uma salvaguarda; ela simplesmente murcha e morre.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 4.\nMansão Magnífica de Mordenkainen\nO Mago Mordenkainen recebe os hóspedes em sua residência mágica, a Mansão Magnífica de Mordenkainen.\n7º Círculo, Invocação (Bardo, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: 90 metros\nComponentes: V, S, M (uma porta em miniatura no valor de 15 ou mais PO)\nDuração: 24 horas\nVocê conjura uma porta cintilante no alcance da magia que permanece por toda a duração da magia. A porta leva a uma moradia extradimensional e tem 1,5 metro de largura e 3 metros de altura. Você e qualquer criatura que você designe ao conjurar a magia podem entrar na residência extradimensional enquanto a porta permanecer aberta. Você pode abri-la ou fechá-la (nenhuma ação é necessária) se estiver a até 9 metros de distância dela. Quando fechada, a porta é imperceptível.\nAlém da porta, há um magnífico saguão com várias câmaras ao fundo. A atmosfera da moradia é limpa, fresca e aquecida.\nVocê pode criar qualquer projeto que desejar para a moradia, mas ela não pode exceder 50 Cubos contíguos de 3 metros de lado. O local é mobiliado e decorado à sua escolha. Contém comida suficiente para servir um banquete de nove pratos para até 100 pessoas. Mobílias e outros objetos criados por essa magia se dissipam em fumaça se removidos dela.\nUma equipe de 100 servos quase transparentes atende a todos que entrarem. Você determina a aparência desses servos e as vestes deles. Eles são invulneráveis e obedecem aos seus comandos. Cada servo pode realizar tarefas que um humano poderia realizar, mas eles não podem atacar ou realizar qualquer ação que cause dano direto a outra criatura. Assim, os servos podem buscar coisas, limpar, remendar, dobrar roupas, acender fogos, servir comida, servir vinho, entre outras atividades. Os servos não podem deixar a moradia.\nQuando a magia termina, qualquer criatura ou objeto deixado no espaço extradimensional é expulso para os espaços desocupados mais próximos à entrada.\nManto do Cruzado\n3º Círculo, Evocação (Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Concentração, até 1 minuto\nVocê irradia uma aura mágica em uma Emanação de 9 metros. Enquanto estiver na aura, você e seus aliados causam 1d4 pontos de dano Radiante adicionais ao atingir com uma arma ou um Ataque Desarmado.\nMão de Bigby\nO Mago Bigby usa sua magia autoral, Mão de Bigby, para evitar interrupções em sua pesquisa.\n5º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (uma casca de ovo e uma luva)\nDuração: Concentração, até 1 minuto\nVocê cria uma mão Grande de energia mágica cintilante em um espaço desocupado à sua vista e no alcance da magia. A mão permanece pela duração da magia e se move ao seu comando, imitando os movimentos da sua própria mão.\nA mão é um objeto que tem CA 20 e Pontos de Vida iguais aos seus Pontos de Vida máximos. Se a mão é reduzida a 0 Pontos de Vida, a magia encerra. A mão não ocupa um espaço.\nAo conjurar a magia e como uma Ação Bônus em seus turnos posteriores, você pode mover a mão até 18 metros e causar um dos seguintes efeitos:\nMão Esmagadora. A mão tenta imobilizar uma criatura Enorme ou menor a até 1,5 metro dela. O alvo deve ser bem-sucedido em uma salvaguarda de Destreza ou tem a condição Imobilizado, com uma CD para escapar igual à CD para evitar sua magia. Enquanto a mão imobiliza o alvo, você pode executar uma ação Bônus para fazer com que a mão o esmague, causando ao alvo 4d6 pontos de dano Contundente mais seu modificador de atributo de conjuração.\nMão Interposta. A mão concede a você Cobertura Parcial contra ataques e outros efeitos originados do espaço da mão ou que passem por ele. Além disso, o espaço da mão conta como Terreno Difícil para seus inimigos.\nMão Vigorosa. A mão tenta empurrar uma criatura Enorme ou menor a até 1,5 metro dela. O alvo deve ser bem-sucedido em uma salvaguarda de Força, ou a mão empurra o alvo até 1,5 metro mais 1,5 metro multiplicado pelo valor de seu modificador de atributo de conjuração. A mão se move com o alvo, permanecendo a até 1,5 metro dele.\nPunho Cerrado. A mão atinge um alvo a até 1,5 metro dela. Realize um ataque mágico corpo a corpo. Em caso de acerto, o alvo sofre 5d8 pontos de dano Energético.\nUsando um Espaço de Magia de Círculo Superior. O dano do Punho Cerrado aumenta em 2d8 e o dano da Mão Esmagadora aumenta em 2d6 para cada círculo de espaço de magia acima de 5.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "maos-flamejantes",
    "name": "Mãos Flamejantes",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma fina camada de chamas parte de você. Cada criatura em um Cone de 4,5 metros realiza uma salvaguarda de Destreza, sofrendo 3d6 pontos de dano Ígneo se falhar, ou metade desse dano em caso de sucesso.\nObjetos inflamáveis no Cone que não estão sendo usados ou carregados entram em combustão.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "maos-magicas",
    "name": "Mãos Mágicas",
    "level": 0,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Uma mão espectral flutuante aparece em um ponto que você escolher no alcance da magia. A mão permanece pela duração. A mão desaparece se estiver a mais de 9 metros de você ou se você conjurar esta magia novamente.\nAo conjurar a magia, você pode usar a mão para manipular um objeto, abrir uma porta ou um recipiente destrancado, guardar ou recolher itens de recipientes abertos, ou despejar o conteúdo de um frasco.\nComo uma ação Usar Magia em seus próximos turnos, você pode controlar a mão novamente. Como parte dessa ação, você pode mover a mão até 9 metros.\nA mão não pode atacar, ativar itens mágicos ou carregar mais de 5 quilos.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "marca-do-predador",
    "name": "Marca do Predador",
    "level": 1,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "27 metros",
    "components": [
      "V"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Guardião"
    ],
    "description": "Você marca magicamente como sua presa uma criatura à sua vista e no alcance da magia. Até que a magia termine, você causa 1d6 pontos de dano Energético adicionais ao alvo sempre que o acertar com uma jogada de ataque. Você também tem Vantagem em qualquer teste de Sabedoria (Percepção ou Sobrevivência) que realizar para encontrá-lo.\nSe o alvo é reduzido a 0 Pontos de Vida antes que esta magia termine, você pode executar uma ação Bônus para mover a marca para uma nova criatura à sua vista e no alcance da magia.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Sua Concentração pode durar mais com um espaço de magia de 3º–4º círculo (em até 8 horas) ou 5º círculo ou superior (em até 24 horas).\nMau Olhado\n6º Círculo, Necromancia (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nPela duração da magia, seus olhos se tornam um vazio escuro. Uma criatura à sua escolha à sua vista e a até 18 metros de você deve ser bem-sucedida em uma salvaguarda de Sabedoria ou é afetada por um dos seguintes efeitos à sua escolha pela duração da magia.\nEm cada um dos seus turnos até que a magia termine, você pode executar uma ação Usar Magia para atingir outra criatura, mas não pode atingir uma criatura novamente se ela tiver sido bem-sucedida em uma salvaguarda contra a conjuração desta magia.\nAdoecer. O alvo tem a condição Envenenado.\nAdormecer. O alvo tem a condição Inconsciente. Ele acorda se sofrer algum dano ou se outra criatura executar uma ação para sacudi-la.\nApavorar. O alvo tem a condição Amedrontado. Em cada um dos turnos dele, o alvo Amedrontado deve executar a ação Correr e se afastar de você pela rota mais segura e curta disponível. Se o alvo se mover para um espaço a pelo menos 18 metros de distância de você onde não possa vê-lo, esse efeito encerra.\nMedo\n3º Círculo, Ilusão (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (uma pena branca)\nDuração: Concentração, até 1 minuto\nCada criatura em um Cone de 9 metros deve ser bem-sucedida em uma salvaguarda de Sabedoria ou larga o que estiver segurando e tem a condição Amedrontado pela duração da magia.\nUma criatura Amedrontada executa a ação Correr e se afasta de você pela rota mais segura em cada um dos turnos dela, a menos que não haja para onde se mover. Se a criatura encerrar o turno dela em um espaço onde não tenha linha de visão para você, a criatura realiza uma salvaguarda de Sabedoria. Em caso de sucesso, a magia encerra naquela criatura.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "mensageiro-animal",
    "name": "Mensageiro Animal",
    "level": 2,
    "school": "Encantamento",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (um bocado de comida)"
    ],
    "duration": "24 horas",
    "classes": [
      "Bardo",
      "Druida",
      "Guardião"
    ],
    "description": "Uma Besta Minúscula à sua escolha à sua vista e no alcance da magia deve ser bem-sucedida em uma salvaguarda de Carisma, ou ela tenta entregar uma mensagem por você (se o Nível de Desafio do alvo não for 0, ele é automaticamente bem-sucedido). Você especifica um local que visitou e um destinatário que corresponda a uma descrição geral, como \"uma pessoa vestida com o uniforme da guarda da cidade\" ou \"um anão ruivo usando um chapéu pontudo\". Você também comunica uma mensagem de até vinte e cinco palavras. A Fera viaja pela duração da magia em direção ao local especificado, cobrindo cerca de 40 quilômetros a cada 24 horas ou 80 quilômetros se a Fera puder voar.\nQuando a Fera chega, ela entrega sua mensagem à criatura que você descreveu, imitando sua comunicação. Se a Fera não chegar ao seu destino antes que a magia termine, a mensagem é perdida e a Besta retorna para onde você conjurou a magia.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A duração da magia aumenta em 48 horas para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "mensagem",
    "name": "Mensagem",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "S",
      "M (um fio de cobre)"
    ],
    "duration": "1 rodada",
    "classes": [
      "Bardo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você aponta para uma criatura no alcance da magia e sussurra uma mensagem. Somente o alvo ouve a mensagem e pode responder em um sussurro que apenas você consegue ouvir.\nVocê pode conjurar essa magia através de objetos sólidos se estiver familiarizado com o alvo e souber que ele está além da barreira. Silêncio mágico, 30 centímetros de pedra, metal ou madeira, ou uma fina folha de chumbo bloqueiam a magia.\nMesclar-se às Rochas\n3º Círculo, Transmutação (Clérigo, Druida, Guardião)\nTempo de Conjuração: Ação ou Ritual\nAlcance: Toque\nComponentes: V, S\nDuração: 8 horas\nVocê adentra em um objeto ou superfície rochosa grande o suficiente para caber completamente seu corpo, fundindo a si e seu equipamento com a pedra pela duração. Você deve tocar a pedra para fazer isso. Nada da sua presença permanece visível ou detectável por sentidos não mágicos.\nEnquanto estiver fundido com a rocha, você não pode ver o que ocorre fora dela, e quaisquer testes de Sabedoria (Percepção) que você realize para ouvir sons fora dela são realizados com Desvantagem. Você permanece ciente da passagem do tempo e pode conjurar magias em si mesmo enquanto está fundido à pedra. Você pode usar 1,5 metro de movimento para sair da rocha onde entrou, o que encerra a magia. Caso contrário, você não pode se mover.\nDanos físicos menores à rocha não o afetam, mas a destruição parcial ou mudança na forma dela (a ponto de você não caber mais nela) o expulsa e causa 6d6 pontos de dano Energético a você. A destruição completa da rocha (ou a transmutação dela em outra substância) o expulsa e causa 50 pontos de dano Energético.\nSe expulso, você é movido para o espaço desocupado mais próximo de onde entrou e tem a condição Caído.\nMetamorfose\nMagos rivais usam Metamorfose para se transformarem em um Observador e um Beír durante um duelo mágico.\n9º Círculo, Transmutação (Druida, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (uma argola de jade no valor de 1.500 ou mais PO)\nDuração: Concentração, até 1 hora\nVocê se multimorfa em outra criatura pela duração da magia ou até executar uma ação Usar Magia para se multimorfa em uma criatura diferente. A nova forma deve ser de uma criatura com um Nível de Desafio igual ou inferior ao seu nível ou ao seu Nível de Desafio. Você deve ter visto esse tipo de criatura antes, e ela não pode ser um Constructo ou um Morto-vivo.\nAo se multimorfar, você recebe um número de Pontos de Vida Temporários igual aos Pontos de Vida da nova forma. A magia encerra se você perder todos os Pontos de Vida Temporários recebidos pela magia.\nAs suas estatísticas de jogo são substituídas pelo bloco de estatísticas da nova forma, mas você mantém seu tipo de criatura, alinhamento, personalidade, valores de Inteligência, Sabedoria e Carisma, Pontos de Vida, Dados de Vida, proficiências e capacidade de comunicação. Se você possuir a característica Conjuração, também a mantém.\nAo se multimorfar, você decide se seu equipamento cai no chão ou se altera em tamanho e forma para se ajustar à nova forma enquanto você a mantém.\nMiragem Arcana\n7º Círculo, Ilusão (Bardo, Druida, Mago)\nTempo de Conjuração: 10 minutos\nAlcance: À sua vista\nComponentes: V, S\nDuração: 10 dias\nVocê faz com que o terreno em uma área de até 2,5 quilômetros quadrados pareça, soe, cheire e até mesmo seja sentido como algum outro tipo de terreno. Campos abertos ou uma estrada podem ser transformados em um pântano, colina, fenda ou qualquer outro tipo de terreno irregular ou intransitável. Um lago pode ser formado para parecer um prado gramado, um precipício como uma suave encosta ou uma ravina cheia de pedras como uma estrada larga e lisa.\nDa mesma forma, você pode alterar a aparência de estruturas ou adicioná-las onde não há nenhuma presente. A magia não disfarça, oculta ou adiciona criaturas.\nA ilusão inclui elementos audíveis, visuais, táteis e olfativos, podendo transformar terreno desimpedido em Terreno Difícil (ou vice-versa) ou, de outra forma, dificultar o movimento pela área. Qualquer parte do terreno ilusório (como uma pedra ou um galho) que for removida da área da magia desaparece imediatamente.\nCriaturas com Visão Verdadeira podem ver através da ilusão e discernir a verdadeira forma do terreno; no entanto, todos os outros elementos da ilusão permanecem, de modo que, embora a criatura esteja ciente da ilusão, ainda pode interagir fisicamente com ela.\nMissão\n5º Círculo, Encantamento (Bardo, Clérigo, Druida, Paladino, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: 18 metros\nComponentes: V\nDuração: 30 dias\nVocê dá um comando verbal a uma criatura à sua vista no alcance da magia, ordenando que ela realize algum serviço ou não realize uma ação ou um curso de atividade conforme você decidir. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia. O alvo é bem-sucedido automaticamente se não conseguir entender seu comando.\nEnquanto Enfeitiçada, a criatura sofre 5d10 pontos de dano Psíquico se agir de maneira diretamente contrária ao seu comando. Ela não sofre esse dano mais do que uma vez por dia.\nVocê pode dar qualquer comando à sua escolha, exceto uma atividade que resultaria em morte certa. Se você der um comando suicida, a magia se encerra.\nUma magia Desejo, Remover Maldição ou Restauração Maior encerra esta magia.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Se você usar um espaço de magia de 7º ou 8º círculo, a duração é de 365 dias. Se você usar um espaço de magia de 9º círculo, a magia dura até que seja encerrada por uma das magias mencionadas acima.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "misseis-magicos",
    "name": "Mísseis Mágicos",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria três dardos brilhantes feitos de pura energia mágica. Cada dardo acerta uma criatura à sua escolha, à sua vista e no alcance da magia. Um dardo causa 1d4 + 1 pontos de dano Energético ao alvo. Os dardos acertam ao mesmo tempo, e você pode direcioná-los para uma mesma criatura ou várias.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A magia cria um dardo adicional para cada círculo de espaço de magia acima de 1.\nModificar Memória\n5º Círculo, Encantamento (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nVocê tenta remodelar as memórias de outra criatura. Uma criatura à sua vista e no alcance da magia realiza uma salvaguarda de Sabedoria. Se você estiver lutando contra a criatura, ela tem Vantagem na salvaguarda. Se falhar na salvaguarda, o alvo tem a condição Enfeitiçado pela duração da magia. Enquanto estiver Enfeitiçado desse modo, o alvo também tem a condição Incapacitado e fica sem perceber o que acontece ao seu redor, embora possa ouvir você. Se sofrer qualquer dano ou for alvo de outra magia, essa magia se encerra, e nenhuma memória é modificada.\nEnquanto essa magia durar, você pode influenciar a memória do alvo sobre um evento que ele tenha vivenciado nas últimas 24 horas e que tenha durado no máximo 10 minutos. Você pode eliminar permanentemente toda a memória do evento, permitir que o alvo recorde o evento com total clareza, alterar os detalhes da memória do evento ou criar uma memória de outro evento.\nVocê deve falar com o alvo para descrever como as memórias dele serão afetadas, e ele deve conseguir entender seu idioma para as memórias modificadas criarem raízes. A mente do alvo preenche qualquer lacuna dos detalhes da sua descrição. Se a magia encerrar antes que você termine de descrever as memórias modificadas, a memória da criatura não é alterada. Caso contrário, as memórias modificadas se consolidam quando a magia termina.\nUma memória modificada não afeta necessariamente o comportamento de uma criatura, especialmente se a memória contradiz as inclinações naturais, o alinhamento ou as crenças da criatura. Uma memória modificada ilógica, como uma falsa memória de quanto a criatura gostava de nadar em ácido, é descartada como um pesadelo. O Mestre pode considerar uma memória modificada absurda demais para afetar uma criatura.\nUma magia Remover Maldição ou Restauração Maior conjurada sobre o alvo restaura a memória verdadeira da criatura.\nUsando um Espaço de Magia de Círculo Superior. Você pode alterar as memórias do alvo em relação a um evento que ocorreu há até 7 dias (espaço de magia de 6º círculo), 30 dias (espaço de magia de 7º círculo), 365 dias (espaço de magia de 8º círculo) ou em qualquer momento do passado da criatura (espaço de magia de 9º círculo).\nMoldar Rochas\n4º Círculo, Transmutação (Clérigo, Druida, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (argila mole)\nDuração: Instantânea\nVocê toca um objeto de pedra de tamanho Médio ou menor, ou uma seção de pedra com no máximo 1,5 metro em qualquer dimensão e o molda na forma que desejar. Por exemplo, você pode moldar uma rocha grande em uma arma, estátua ou baú, ou criar uma pequena passagem por uma parede com até 1,5 metro de espessura. Também é possível moldar uma porta de pedra ou seu batente para selar a porta. O objeto criado pode ter até duas dobradiças e uma fechadura, mas detalhes mecânicos mais finos não são possíveis.\nMoléstia\n6º Círculo, Necromancia (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Instantânea\nVocê libera magia virulenta em uma criatura à sua vista e no alcance da magia. O alvo deve realizar uma salvaguarda de Constituição. Se falhar, sofre 14d6 de dano Necrótico e seus Pontos de Vida máximos são reduzidos em um valor igual ao dano sofrido. Em caso de sucesso, sofre apenas metade do dano. Esta magia não pode reduzir os Pontos de Vida máximos de um alvo abaixo de 1.\nMontaria Fantasmagórica\n3º Círculo, Ilusão (Mago)\nTempo de Conjuração: 1 minuto ou Ritual\nAlcance: 9 metros\nComponentes: V, S\nDuração: 1 hora\nUma criatura Grande, quase real e semelhante a um cavalo aparece no chão em um espaço desocupado à sua escolha no alcance da magia. Você decide a aparência da criatura e ela é equipada com uma sela, rédea e freio. Qualquer equipamento criado pela magia desaparece em uma nuvem de fumaça se for carregado a mais de 3 metros de distância da montaria.\nPela duração da magia, você ou uma criatura à sua escolha pode usar a montaria. A montaria usa o bloco de estatísticas do Cavalo de Montaria (veja também o apêndice B), exceto que ele tem um Deslocamento de 30 metros e pode viajar 20 quilômetros em uma hora. Quando a magia termina, a montaria desaparece gradualmente, dando ao cavaleiro 1 minuto para desmontar. A magia se encerra se a montaria sofrer algum dano.\nMover Terra\n6º Círculo, Transmutação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (uma pá em miniatura)\nDuração: Concentração, até 2 horas\nEscolha uma área de terreno no alcance da magia, com até 12 metros de lados. Você pode remodelar terra, areia ou argila na área da maneira que desejar pela duração. Você pode aumentar ou diminuir a elevação da área, criar ou preencher uma trincheira, erguer ou aplanar uma parede, ou formar um pilar. A extensão dessas mudanças não pode exceder metade da maior dimensão da área. Por exemplo, se você afetar um quadrado de 12 metros, pode criar um pilar de até 6 metros de altura, aumentar ou diminuir a elevação do quadrado em até 6 metros, cavar uma trincheira de até 6 metros de profundidade, e assim por diante. Essas mudanças demoram 10 minutos para serem concluídas. Como a transformação do terreno ocorre lentamente, criaturas na área geralmente não ficam presas ou feridas pelo movimento do solo.\nAo final de cada 10 minutos que gastar se concentrando na magia, você pode escolher uma nova área de terreno para afetar.\nEssa magia não pode manipular pedra natural ou construção de pedra. Rochas e estruturas se ajustam para acomodar o novo terreno. Se a forma que você moldar o terreno tornar uma estrutura instável, ela pode desmoronar.\nDa mesma forma, essa magia não afeta diretamente o crescimento de plantas. A terra movida carrega qualquer planta junto com ela.\nMovimentação Livre\n4º Círculo, Abjuração (Bardo, Clérigo, Druida, Guardião)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (uma alça de couro)\nDuração: 1 hora\nVocê toca uma criatura voluntária. Pela duração da magia, o movimento do alvo não é afetado por Terreno Difícil, e magias e outros efeitos mágicos não podem reduzir o Deslocamento do alvo nem fazer com que ele tenha as condições Contido ou Paralisado. O alvo também tem um Deslocamento de Natação igual ao Deslocamento de caminhada.\nAlém disso, o alvo pode gastar 1,5 metro de movimento para escapar automaticamente de restrições não mágicas, como grilhões ou uma criatura impondo a condição Imobilizado.\nUsando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 4.\nMuralha de Energia\n5º Círculo, Evocação (Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (um caco de vidro)\nDuração: Concentração, até 10 minutos\nUma muralha de energia invisível surge em um ponto à sua escolha no alcance da magia. A muralha aparece em qualquer direção que você escolher, como uma barreira horizontal, vertical ou inclinação. Pode flutuar livremente ou repousar sobre uma superfície sólida. Você pode moldá-la em um domo hemisférico ou em um globo com um raio de até 3 metros, ou em uma superfície plana composta por dez painéis de 3 metros de lados. Cada painel deve ser contíguo a outro painel. De qualquer forma, a parede tem 6 milímetros de espessura e permanece pela duração da magia. Ao surgir, se a muralha passar por um espaço ocupado por uma criatura, a criatura é empurrada para um dos lados da muralha (à sua escolha).\nNada pode passar fisicamente pela muralha. Ela é imune a todo tipo de dano e não pode ser anulada por Dissipar Magia. Entretanto, a magia Desintegrar a destrói instantaneamente. A muralha também se estende para o Plano Etéreo, e bloqueia viagens etéreas através dela.\nMuralha de Espinhos\n6º Círculo, Invocação (Druida)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (um punhado de espinhos)\nDuração: Concentração, até 10 minutos\nVocê cria uma muralha com um emaranhado de espinhos que parecem agulhas. A muralha aparece em uma superfície sólida, à sua vista e no alcance da magia e permanece pela duração. É possível escolher entre uma muralha de até 18 metros de comprimento, 3 metros de altura e 1,5 metro de espessura ou um círculo que tenha até 6 metros de diâmetro, 6 metros de altura e 1,5 metro de espessura. A muralha bloqueia a linha de visão.\nQuando a muralha aparece, cada criatura na área dela realiza uma salvaguarda de Destreza, sofrendo 7d8 pontos de dano Perfurante se falhar, ou metade desse dano em caso de sucesso.\nUma criatura pode se mover através da parede, embora lenta e dolorosamente. Para cada 1,5 metro que uma criatura atravessa a parede, ela deve gastar 6 metros de movimento. Além disso, a primeira vez que uma criatura entra em um espaço na muralha ou termina o turno dela lá, a criatura realiza uma salvaguarda de Destreza, sofrendo 7d8 pontos de dano Cortante se falhar ou metade desse dano em caso de sucesso. Uma criatura realiza essa salvaguarda apenas uma vez por turno.\nUsando um Espaço de Magia de Círculo Superior. Ambos os tipos de dano aumentam em 1d8 para cada círculo de espaço de magia acima de 6.\nMuralha de Fogo\n4º Círculo, Evocação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (um pedaço de carvão)\nDuração: Concentração, até 1 minuto\nVocê cria uma muralha de fogo em uma superfície sólida no alcance da magia. Você pode construir uma parede de até 18 metros de comprimento, 6 metros de altura e 30 centímetros de espessura, ou uma parede circular de até 6 metros de diâmetro, 6 metros de altura e 30 metros de espessura. A parede é opaca e permanece pela duração da magia\nQuando a muralha aparece, cada criatura na área dela realiza uma salvaguarda de Destreza, sofrendo 5d8 pontos de dano Ígneo se falhar, ou metade desse dano em caso de sucesso.\nUm lado da muralha, escolhido por você quando conjura esta magia, causa 5d8 pontos de dano Ígneo a cada criatura que termina o turno a até de 3 metros desse lado ou dentro da muralha. Uma criatura sofre o mesmo dano quando entra na muralha pela primeira vez em termina o turno nela. O outro lado da parede não causa dano.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 pontos para cada círculo de espaço de magia acima de 4.\nMuralha de Gelo\n6º Círculo, Evocação (Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (um pedaço de quartzo)\nDuração: Concentração, até 10 minutos\nVocê cria uma muralha de gelo em uma superfície sólida no alcance da magia. Você pode moldá-la em uma cúpula hemisférica, em um globo com um raio de até 3 metros ou em uma superfície plana composta por dez painéis de 3 metros de lados. Cada painel deve ser contíguo a outro painel. De qualquer forma, a parede tem 30 centímetros de espessura e permanece pela duração da magia.\nAo surgir, se a muralha ocupar um espaço de uma criatura, a criatura é empurrada para um dos lados e deve realizar uma salvaguarda de Destreza. Se falhar, sofre 10d6 pontos de dano Gélido ou metade desse dano em caso de sucesso.\nA muralha é um objeto que pode ser danificado e, portanto, rompido. Tem CA 12 e 30 Pontos de Vida por painel, e tem Imunidade dano Gélido, Psíquico e Venenoso e Vulnerabilidade a dano Ígneo. Reduzir uma seção de 3 metros da muralha a 0 Pontos de Vida a destrói e deixa para trás uma camada de ar gélido no espaço que a muralha ocupava.\nUma criatura que se move através da camada de ar gélido pela primeira vez em um turno realiza uma salvaguarda de Constituição, sofrendo 5d6 pontos de dano Gélido se falhar, ou metade desse dano em caso de sucesso.\nUsando um Espaço de Magia de Círculo Superior. O dano que a muralha causa quando aparece aumenta em 2d6 e o dano ao passar pela camada de ar gélido aumenta em 1d6 para cada círculo de espaço de magia acima de 6.\nMuralha de Pedra\n5º Círculo, Evocação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (um cubo de granito)\nDuração: Concentração, até 10 minutos\nUma muralha não-mágica, constituída de pedra maciça, surge em um ponto à sua vista e no alcance da magia. Ela tem 15 centímetros de espessura e é composta de 10 painéis de 3 metros de lados. Cada painel deve ser contíguo ao outro. Se preferir, você pode criar painéis de 3 por 6 metros que têm apenas 7,5 centímetros de espessura.\nAo surgir, se a muralha passar por um espaço ocupado por uma criatura, esta última é empurrada para um dos lados da muralha (à sua escolha). Se uma criatura estiver cercada por todos os lados pela muralha (ou pela muralha e outra superfície sólida), essa criatura realiza uma salvaguarda de Destreza. Em caso de sucesso, ela pode usar a Reação dela para mover-se até o máximo do Deslocamento, de modo que não esteja mais cercada pela muralha.\nA muralha pode ter qualquer forma que você desejar, apesar de não poder ocupar o mesmo espaço que uma criatura ou objeto. Ela não precisa ser vertical ou se apoiar inteiramente em uma fundação sólida. Entretanto, necessita se fundir e ser solidamente suportada por rochas já existentes. Assim, é possível usar esta magia para criar uma ponte sobre um abismo ou criar uma rampa. Se for criado algo de amplitude superior a 6 metros de comprimento, é necessário dividir pela metade o tamanho de cada painel, para criar suportes. É possível fazer com que a muralha tenha, de forma bruta, ameias, parapeitos etc.\nA muralha é um objeto de pedra que pode ser danificado e rompido. Cada painel tem CA 15 e 30 Pontos de Vida para cada 2,5 centímetros de espessura e tem Imunidade dano Gélido, Psíquico e Venenoso. Reduzir um painel a 0 Ponto de Vida o destrói e pode fazer com que painéis conectados entrem em colapso, a critério do Mestre.\nSe você mantiver sua Concentração nesta magia por toda a duração, a muralha se torna permanente e não pode ser dissipada. Caso contrário, a muralha desaparece quando a magia termina.\nMuralha de Vento\n3º Círculo, Evocação (Druida, Guardião)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S, M (um leque e uma pena)\nDuração: Concentração, até 1 minuto\nUma muralha de vento forte sobe do chão em um ponto à sua escolha no alcance da magia. Você pode realizar uma parede de até 15 metros de comprimento, 4,5 metros de altura e 30 centímetros de espessura. Você pode moldar a parede da maneira que quiser, desde que ela faça um caminho contínuo ao longo do chão. A muralha permanece pela duração da magia.\nQuando a muralha surge, cada criatura na área dela realiza uma salvaguarda de Força, sofrendo 4d8 pontos de dano Contundente se falhar, ou metade desse dano em caso de sucesso.\nO vento forte mantém névoa, fumaça e outros gases afastados. Criaturas ou objetos Pequenos ou menores não podem atravessar a muralha. Materiais soltos e leves que entrem na muralha são lançados para cima. Flechas, virotes e outros projéteis comuns disparados contra alvos atrás da muralha são desviados para cima e erram automaticamente. Pedras arremessadas por Gigantes ou máquinas de cerco, assim como projéteis semelhantes, não são afetados. Criaturas em forma gasosa não conseguem atravessar a muralha.\nMuralha Prismática\n9º Círculo, Abjuração (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: 10 minutos\nUma superfície cintilante e multicolorida forma uma parede vertical opaca de até 27 metros de comprimento, 9 metros de altura e 2,5 centímetros de espessura centrada em um ponto no alcance da magia. Como alternativa, você molda a parede em um globo de até 9 metros de diâmetro centrado em um ponto no alcance da magia. A parede permanece pela duração. Se você posicionar a parede em um espaço ocupado por uma criatura, a magia encerra instantaneamente sem efeito.\nA parede emite Luz Plena por 30 metros e Meia-luz por mais 30 metros. Você e as criaturas que você escolher ao conjurar a magia podem passar e ficar perto da muralha sem sofrer dano. Se outra criatura que possa ver a parede se mover a até 6 metros dela ou começar o turno nela, a criatura deve ser bem-sucedida em uma salvaguarda de Constituição ou tem a condição Cego por 1 minuto.\nA parede possui sete camadas, cada uma de uma cor diferente. Uma criatura que atravessa ou entra na parede passa uma camada por vez e deve realizar uma salvaguarda de Destreza ou é afetada pelas propriedades da camada, conforme descrito na tabela Camadas Prismáticas.\nA parede tem CA 10 e pode ser destruída uma camada por vez, em ordem do vermelho ao violeta, por meios específicos para cada camada. Se uma camada for destruída, ela desaparece pela duração da magia. Campo Antimagia não tem efeito na parede, e Dissipar Magia pode afetar apenas a camada violeta.\nCamadas Prismáticas\nOrdem\nEfeitos\n1\nVermelho. Se falhar: 12d6 pontos de dano Ígneo. Em caso de sucesso: metade do dano. Efeitos Adicionais: Ataques à distância não mágicos não podem atravessar esta camada, que é destruída se sofrer ao menos 25 pontos de dano Gélido.\n2\nLaranja. Se falhar: 12d6 pontos de dano Ácido. Em caso de sucesso: metade do dano. Efeitos Adicionais: Ataques mágicos à distância não podem passar por esta camada, que é destruída por um vento forte (como o criado por Lufada de Vento).\n3\nAmarelo. Se falhar: 12d6 pontos de dano Elétrico. Em caso de sucesso: metade do dano. Efeitos Adicionais: A camada é destruída se sofrer ao menos 60 pontos de dano Energético.\n4\nVerde. Se falhar: 12d6 pontos de dano Venenoso. Em caso de sucesso: metade do dano. Efeitos Adicionais: Uma magia Criar Passagem ou outra magia de círculo igual ou superior, que possa abrir um portal em uma superfície sólida, destrói esta camada.\n5\nAzul. Se falhar: 12d6 pontos de dano Gélido. Em caso de sucesso: metade do dano. Efeitos Adicionais: A camada é destruída se sofrer ao menos 25 pontos de dano Ígneo.\n6\nAnil. Se falhar: O alvo tem a condição Contido e realiza uma salvaguarda de Constituição no final de cada um dos turnos dele. Se bem-sucedido três vezes, a condição se encerra. Se falhar três vezes, ele tem a condição Petrificado até ser liberado por um efeito como a magia Restauração Maior. Os sucessos e fracassos não precisam ser consecutivos; acompanhe ambos até que o alvo alcance três de um tipo. Efeitos Adicionais: Magias não podem ser conjuradas através desta camada, que é destruída pela Luz Plena conjurada pela magia Luz do Dia.\n7\nVioleta. Se falhar: O alvo tem a condição Cego e realiza uma salvaguarda de Sabedoria no início do seu próximo turno. Em caso de sucesso a condição se encerra. Se falhar, a condição se encerra e a criatura se teleporta para outro plano de existência (à escolha do Mestre). Efeitos Adicionais: Esta camada é destruída por Dissipar Magia.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1402\" w:name=\"_o9vuwek7fqyk\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1402\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>N\nNevasca\n3º Círculo, Invocação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (um guarda-chuva em miniatura)\nDuração: Concentração, até 1 minuto\nAté que a magia termine, granizo cai em um Cilindro de 12 metros de altura e 6 metros de raio centrado em um ponto à sua escolha no alcance da magia. A área está Totalmente Obscurecida e as chamas expostas na área são apagadas.\nO Solo no Cilindro é Terreno Difícil. Quando uma criatura entra no Cilindro pela primeira vez em um turno ou começa o turno dela nele, deve ser bem-sucedida em uma salvaguarda de Destreza ou está Caída e perde a Concentração.\nNévoa Mortal\n5º Círculo, Invocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê cria uma Esfera de 6 metros de raio constituída de uma névoa amarelo esverdeada centrada em um ponto no alcance da magia. A névoa permanece pela duração da magia ou até que um vento forte (como o criado pela magia Lufada de Vento) a disperse, encerrando a magia. A área da névoa é Totalmente Obscurecida.\nCada criatura na Esfera realiza uma salvaguarda de Constituição, sofrendo 5d8 pontos de dano Venenoso se falhar, ou metade desse dano em caso de sucesso. Uma criatura deve realizar essa salvaguarda quando a Esfera se mover para seu espaço e quando entrar na Esfera ou terminar o turno nela. Uma criatura realiza essa salvaguarda apenas uma vez por turno.\nA Esfera se afasta 3 metros de você no início de cada um dos seus turnos.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 5.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "nevoa-obscurecente",
    "name": "Névoa Obscurecente",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Druida",
      "Feiticeiro",
      "Guardião",
      "Mago"
    ],
    "description": "Você cria uma Esfera de névoa de 6 metros de raio centrada em um ponto no alcance da magia. A Esfera é Totalmente Obscurecida. Ela permanece pela duração da magia ou até que um vento forte (como um criado por Lufada de Vento) a disperse.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O raio da névoa aumenta em 6 metros para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "nuvem-de-adagas",
    "name": "Nuvem de Adagas",
    "level": 2,
    "school": "Invocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um caco de vidro)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você conjura adagas rodopiantes em um Cubo de 1,5 metro de lado centrado em um ponto no alcance da magia. Cada criatura nessa área sofre 4d4 pontos de dano Cortante. Uma criatura também sofre esse dano se entrar no Cubo, terminar o turno nele ou se o Cubo se mover para o espaço dela. Uma criatura sofre esse dano apenas uma vez por turno.\nNos seus turnos subsequentes, você pode executar uma ação Usar Magia para teleportar o Cubo até 9 metros.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 2d4 para cada círculo de espaço de magia acima de 2.\nNuvem Fétida\n3º Círculo, Invocação (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um ovo podre)\nDuração: Concentração, até 1 minuto\nVocê cria uma Esfera de 6 metros de raio de gás amarelo nauseante centrada em um ponto no alcance da magia. A nuvem é Totalmente Obscurecida. A nuvem permanece no ar pela duração da magia ou até que um vento forte (como o criado por Lufada de Vento) a disperse.\nCada criatura que começa seu turno na Esfera deve ser bem-sucedida em uma salvaguarda de Constituição ou tem a condição Envenenado até o final do turno atual. Enquanto Envenenada desse modo, a criatura não pode executar uma ação ou uma Ação Bônus.\nNuvem Incendiária\n8º Círculo, Invocação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nUma nuvem rodopiante de brasas e fumaça preenche uma Esfera de 6 metros de raio centrada em um ponto no alcance da magia. A área da nuvem é Totalmente Obscurecida. Ela permanece pela duração ou até que um vento forte (como o criado pela Lufada de Vento) a disperse.\nQuando a nuvem aparece, cada criatura dentro dela realiza uma salvaguarda de Destreza e, se falhar, sofre 10d8 pontos de dano Ígneo, ou metade desse dano em caso de sucesso. Uma criatura também deve realizar essa salvaguarda quando a Esfera se mover para seu espaço e quando terminar seu turno nela. Uma criatura realiza essa salvaguarda apenas uma vez por turno.\nA nuvem se afasta 3 metros de você na direção que você escolher no início de cada um dos seus turnos.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1409\" w:name=\"_b06890agth24\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1409\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>O\nOlho Arcano\n4º Círculo, Adivinhação (Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S, M (um pouco de pele de morcego)\nDuração: Concentração, até 1 hora\nVocê cria um olho invisível e invulnerável no alcance da magia que fica pairando pela duração. Você recebe mentalmente informações visuais do olho, que pode ver em todas as direções. Ele também tem Visão no Escuro com um alcance de 9 metros.\nComo uma Ação Bônus, você pode mover o olho até 9 metros em qualquer direção. Uma barreira sólida bloqueia o movimento do olho, mas o olho pode passar por uma abertura de até 2,5 centímetros de diâmetro.\nOnda Destrutiva\n5º Círculo, Evocação (Paladino)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Instantânea\nUma energia destrutiva ondula a partir de você em uma Emanação de 9 metros. Cada criatura à sua escolha na Emanação realiza uma salvaguarda de Constituição. Se falhar, um alvo sofre 5d6 pontos de dano Trovejante e 5d6 pontos de dano Necrótico ou Radiante (à sua escolha) e tem a condição Caído. Em caso de sucesso, um alvo recebe apenas metade do dano.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "o-ousado-mago-melf-mira-em-um-troll-furioso-com-a-flecha-acida-de-melf",
    "name": "O ousado Mago Melf mira em um troll furioso com a Flecha Ácida de Melf.",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "27 metros",
    "components": [
      "V",
      "S",
      "M (folha de ruibarbo em pó)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Mago"
    ],
    "description": "Uma flecha verde brilhante dispara em direção a um alvo no alcance da magia, explodindo em um borrifo de ácido. Realize um ataque mágico à distância contra o alvo. Em caso de acerto, o alvo sofre 4d4 pontos de dano Ácido e 2d4 pontos de dano Ácido no final do próximo turno dele. Se falhar, a flecha respinga ácido no alvo, causando somente metade do dano inicial.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano (inicial e posterior) aumenta em 1d4 para cada círculo de espaço de magia acima de 2.\nFlecha Relâmpago\n3º Círculo, Transmutação (Guardião)\nTempo de Conjuração: Ação Bônus, que você realiza imediatamente após atingir ou errar um alvo com um ataque à distância usando uma arma\nAlcance: Pessoal\nComponentes: V, S\nDuração: Instantânea\nQuando seu ataque atinge ou erra o alvo, a arma ou munição que você está usando se transforma em um relâmpago. Em vez de sofrer qualquer dano ou outros efeitos do ataque, o alvo sofre 4d8 pontos de dano Elétrico em um acerto ou metade desse dano em um erro. Cada criatura em um raio de 3 metros do alvo deve então realizar uma salvaguarda de Destreza, sofrendo 2d8 pontos de dano Elétrico se falhar ou metade desse dano em caso de sucesso.\nA arma ou munição retorna então à sua forma normal.\nUsando um Espaço de Magia de Círculo Superior. O dano para ambos os efeitos da magia aumenta em 1d8 para cada círculo de espaço de magia acima de 3.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "onda-trovejante",
    "name": "Onda Trovejante",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você libera uma onda de energia estrondosa. Cada criatura em um Cubo de 4,5 metros originado em você realiza uma salvaguarda de Constituição. Se falhar, uma criatura sofre 2d8 pontos de dano Trovejante e é empurrada a 3 metros de distância de você. Em caso de sucesso, uma criatura sofre apenas metade do dano.\nAlém disso, objetos soltos que estão totalmente dentro do Cubo são empurrados 3 metros para longe de você, e um estrondo trovejante é audível a até 90 metros.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "oracao-de-cura",
    "name": "Oração de Cura",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "10 minutos",
    "range": "9 metros",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo",
      "Paladino"
    ],
    "description": "Até cinco criaturas à sua escolha que permanecerem no alcance da magia por toda a conjuração obtêm os benefícios de um Descanso Curto e recuperam 2d8 Pontos de Vida. Uma criatura não pode ser afetada por esta magia novamente até ela completar um Descanso Longo.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A cura aumenta em 1d8 para cada círculo de espaço de magia acima de 2.\nOrbe Cromático",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "orientacao",
    "name": "Orientação",
    "level": 0,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Clérigo",
      "Druida"
    ],
    "description": "Você toca uma criatura voluntária e escolhe uma perícia. Até que a magia termine, a criatura adiciona 1d4 a qualquer teste de atributo usando a perícia escolhida.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1416\" w:name=\"_eudutd4e15xo\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1416\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>P\nPadrão Hipnótico\n3º Círculo, Ilusão (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: S, M (uma pitada de confete)\nDuração: Concentração, até 1 minuto\nVocê cria um padrão distorcido de cores em um cubo de 9 metros de lado no alcance da magia. O padrão aparece por um momento e desaparece. Cada criatura na área, que pode ver o padrão, deve ser bem-sucedida em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração. Enquanto Enfeitiçado, a criatura tem a condição Incapacitado e Deslocamento 0.\nA magia se encerra para uma criatura afetada se ela sofrer algum dano ou se outra pessoa executar uma ação para sacudi-la, removendo-a de seu estupor.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "palavra-curativa",
    "name": "Palavra Curativa",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "18 metros",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Clérigo",
      "Druida"
    ],
    "description": "Uma criatura à sua escolha, à sua vista e no alcance da magia recupera Pontos de Vida iguais a 2d4 mais seu modificador de atributo de conjuração.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A cura aumenta em 2d4 para cada círculo de espaço de magia acima de 1.\nPalavra Curativa em Massa\n3º Círculo, Abjuração (Bardo, Clérigo)\nTempo de Conjuração: Ação Bônus\nAlcance: 18 metros\nComponentes: V\nDuração: Instantânea\nAté seis criaturas à sua escolha, à sua vista e no alcance da magia, recuperam Pontos de Vida iguais a 2d4 mais o seu modificador de atributo de conjuração.\nUsando um Espaço de Magia de Círculo Superior. A cura aumenta em 1d4 para cada círculo de espaço de magia acima de 3.\nPalavra de Poder: Atordoar\n8º Círculo, Encantamento (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponente: V\nDuração: Instantânea\nVocê domina a mente de uma criatura à sua vista e no alcance da magia. Se o alvo tiver 150 Pontos de Vida ou menos, ele tem a condição Atordoado. Caso contrário, o Deslocamento dele é 0 até o início do seu próximo turno.\nO alvo Atordoado realiza uma salvaguarda de Constituição no final de cada um dos turnos dele, encerrando a condição em caso de sucesso.\nPalavra de Poder: Fortificar\n7º Círculo, Encantamento (Bardo, Clérigo)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponente: V\nDuração: Instantânea\nVocê fortalece até seis criaturas à sua vista e no alcance da magia. A magia concede 120 Pontos de Vida Temporários, que você divide entre os alvos da magia.\nPalavra de Poder: Matar\n9º Círculo, Encantamento (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponente: V\nDuração: Instantânea\nVocê obriga uma criatura à sua vista e no alcance da magia a morrer. Se o alvo tiver 100 Pontos de Vida ou menos, ele morre. Caso contrário, sofre 12d12 pontos de dano Psíquico.\nPalavra de Poder: Salvar\n9º Círculo, Encantamento (Bardo, Clérigo)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponente: V\nDuração: Instantânea\nUma onda de energia curativa percorre uma criatura à sua vista e no alcance da magia. O alvo recupera todos os Pontos de Vida. Se a criatura tem a condição Amedrontado, Atordoado, Enfeitiçado, Envenenado ou Paralisado, a condição encerra. Se a criatura tem a condição Caído, ela pode usar sua Reação para se levantar.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "palavra-de-radiancia",
    "name": "Palavra de Radiância",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "M (um símbolo com um raio de sol)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo"
    ],
    "description": "Uma radiância ardente irrompe de você em uma Emanação de 1,5 metro. Cada criatura à sua escolha à sua vista nela deve ser bem-sucedida em uma salvaguarda de Constituição ou sofre 1d6 pontos de dano Radiante.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d6 quando você atinge os níveis 5 (2d6), 11 (3d6) e 17 (4d6).\nPalavra de Regresso\n6º Círculo, Invocação (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 1,5 metro\nComponentes: V\nDuração: Instantânea\nVocê e até cinco criaturas voluntárias a até 1,5 metro de você se teleportam instantaneamente para um santuário previamente designado. Você e quaisquer criaturas que se teleportem com você aparecem no espaço desocupado mais próximo do local designado quando você preparou seu santuário (veja abaixo). Se você conjurar esta magia sem primeiro preparar um santuário, a magia não tem efeito.\nVocê deve designar um local, como um templo, como um santuário, conjurando esta magia lá.\nPalavra Sagrada\n7º Círculo, Evocação (Clérigo)\nTempo de Conjuração: Ação Bônus\nAlcance: 9 metros\nComponentes: V\nDuração: Instantânea\nVocê pronuncia uma palavra imbuída de poder dos Planos Superiores. Cada criatura à sua escolha no alcance da magia realiza uma salvaguarda de Carisma. Se falhar, um alvo com 50 Pontos de Vida ou menos sofre um efeito com base nos Pontos de Vida atuais dele, conforme mostrado na tabela Efeitos de Palavra Sagrada. Independentemente dos Pontos de Vida, um alvo Celestial, Elemental, Feérico ou Ínfero que falhar na salvaguarda é forçado a voltar ao seu plano de origem (se ainda não estiver lá) e não pode retornar ao plano atual por 24 horas por qualquer meio que não seja uma magia Desejo.\nEfeitos de Palavra Sagrada\nPontos de Vida\nEfeito\n0–20\nO alvo morre.\n21–30\nO alvo está com as condições Atordoado, Cego e Surdo por 1 hora.\n31–40\nO alvo está com as condições Cego e Surdo por 10 minutos.\n41–50\nO alvo tem a condição Surdo por 1 minuto.\nParalisar Monstro\n5º Círculo, Encantamento (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um pedaço reto de ferro)\nDuração: Concentração, até 1 minuto\nEscolha uma criatura à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Paralisado pela duração da magia. No final de cada um dos turnos do alvo, ele realiza uma nova salvaguarda, encerrando a magia em caso de sucesso.\nUsando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 5.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "paralisar-pessoa",
    "name": "Paralisar Pessoa",
    "level": 2,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pedaço reto de ferro)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Clérigo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Escolha um Humanoide à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Paralisado pela duração da magia. No final de cada um dos turnos dele, o alvo realiza uma nova salvaguarda, encerrando a magia em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher um Humanoide adicional para cada círculo de espaço de magia acima de 2.\nParar o Tempo\n9º Círculo, Transmutação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V\nDuração: Instantânea\nVocê interrompe brevemente o fluxo do tempo para todos, menos para si. O tempo não passa para outras criaturas, enquanto você faz 1d4 +1 turnos consecutivos, durante os quais você pode usar ações e se mover normalmente.\nEsta magia encerra se uma das ações que você usar durante este período, ou quaisquer efeitos que você criar durante ela, afetar uma criatura que não seja você ou um objeto que esteja sendo usado ou carregado por alguém que não seja você. Além disso, a magia encerra se você se mover para um lugar a mais de 300 metros do local onde a conjurou.\nPasso Arbóreo\n5º Círculo, Invocação (Druida, Guardião)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nVocê adquire a capacidade de entrar em uma árvore e se mover de dentro dela para dentro de outra árvore do mesmo tipo a até 150 metros. Ambas as árvores devem ser vivas e pelo menos do mesmo tamanho que você. Você deve usar 1,5 metro de movimento para entrar em uma árvore. Você sabe instantaneamente a localização de todas as outras árvores do mesmo tipo a até 150 metros e, como parte do movimento usado para entrar na árvore, pode tanto passar por uma dessas árvores quanto sair da árvore em que você está. Você aparece em um local à sua escolha a até 1,5 metro da árvore-destino, usando outro 1,5 metro de movimento. Se você não tiver mais nenhum movimento, aparece a menos de 1,5 metro da árvore em que entrou.\nVocê pode usar essa habilidade de transporte apenas uma vez em cada um dos seus turnos. Você deve terminar cada turno fora de uma árvore.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "passo-nebuloso",
    "name": "Passo Nebuloso",
    "level": 2,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Brevemente cercado por uma névoa prateada, você se teleporta até 9 metros para um espaço desocupado à sua vista.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "passo-sem-rastro",
    "name": "Passo Sem Rastro",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (cinzas de ramo de visco queimado)"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Druida",
      "Guardião"
    ],
    "description": "Você irradia uma aura de ocultação em uma Emanação de 9 metros pela duração da magia. Enquanto estiver na aura, você e cada criatura escolhida têm um bônus de +10 em testes de Destreza (Furtividade) e não deixam rastros.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "passos-largos",
    "name": "Passos Largos",
    "level": 1,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (uma pitada de poeira)"
    ],
    "duration": "1 hora",
    "classes": [
      "Bardo",
      "Druida",
      "Guardião",
      "Mago"
    ],
    "description": "Você toca uma criatura. O Deslocamento do alvo aumenta em 3 metros até que a magia termine.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "pele-casca",
    "name": "Pele-Casca",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (um punhado de casca de árvore)"
    ],
    "duration": "1 hora",
    "classes": [
      "Druida",
      "Guardião"
    ],
    "description": "Você toca uma criatura voluntária. Até que a magia termine, a pele do alvo assume uma aparência de casca de árvore, e o alvo tem uma Classe de Armadura de 17 se sua CA for menor que isso.\nPele-Rocha\n4º Círculo, Transmutação (Druida, Feiticeiro, Guardião, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (poeira de diamante no valor de 100 ou mais PO, que a magia consome)\nDuração: Concentração, até 1 hora\nAté que a magia termine, uma criatura voluntária que você toque tem Resistência a dano Contundente, Cortante e Perfurante.\nPequeno Refúgio de Leomund\n3º Círculo, Evocação (Bardo, Mago)\nTempo de Conjuração: 1 minuto ou Ritual\nAlcance: Pessoal\nComponentes: V, S, M (uma conta de cristal)\nDuração: 8 horas\nUma Emanação de 3 metros surge ao seu redor e permanece estacionária pela duração. A magia falha quando você a conjura se a Emanação não for grande o suficiente para envolver totalmente todas as criaturas em sua área.\nCriaturas e objetos dentro da Emanação quando você conjura a magia podem se mover livremente através dela. Todas as outras criaturas e objetos são impedidos de atravessá-la. Magias de 3º círculo ou inferior não podem ser conjuradas através dela, e os efeitos dessas magias não podem se estender para dentro dela.\nA atmosfera no interior da Emanação é confortável e seca, independentemente do clima externo. Até que a magia termine, você pode determinar se no interior há Meia-luz ou Escuridão (nenhuma ação é necessária). A Emanação é opaca por fora e de qualquer cor que você escolher, mas é transparente por dentro.\nA magia encerra se você sair da Emanação ou se a conjurar novamente.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "perdicao",
    "name": "Perdição",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (uma gota de sangue)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Clérigo"
    ],
    "description": "Até três criaturas à sua escolha à sua vista e no alcance da magia devem realizar uma salvaguarda de Carisma. Sempre que um alvo que falhar nesta salvaguarda realizar uma jogada de ataque ou uma salvaguarda antes da magia terminar, o alvo deve subtrair 1d4 da jogada de ataque ou salvaguarda.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.\nPiscar\n3º Círculo, Transmutação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: 1 minuto\nJogue 1d6 no final de cada um dos seus turnos pela duração da magia. Em um resultado de 4-6, você desaparece do seu plano de existência atual e aparece no Plano Etéreo (a magia termina instantaneamente se você já estiver nesse plano). Enquanto estiver no Plano Etéreo, você pode ver o plano que você deixou, que aparece em tons de cinza, mas você não pode ver nada nele a mais de 18 metros de distância. Você só pode afetar e ser afetado por criaturas que estejam no Plano Etéreo, e criaturas no outro plano não podem percebê-lo, a menos que tenham uma habilidade específica que lhes permita perceber coisas no Plano Etéreo.\nVocê retorna ao outro plano no início do seu próximo turno e quando a magia termina se você estiver no Plano Etéreo. Você retorna a um espaço desocupado à sua escolha à sua vista e a até 3 metros do espaço que deixou. Se nenhum espaço desocupado estiver disponível dentro desse intervalo, você aparece no espaço desocupado mais próximo.\nPolimorfia\n4º Círculo, Transmutação (Bardo, Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S, M (um casulo de lagarta)\nDuração: Concentração, até 1 hora\nVocê tenta transformar uma criatura à sua vista e no alcance da magia em uma Fera. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou se multimorfa em uma Fera pela duração da magia. Essa forma pode ser qualquer Fera com Nível de Desafio igual ou menor que o do alvo (ou igual ao seu nível se não tiver Nível de Desafio). As estatísticas do alvo são substituídas pelas da Fera escolhida, mas o alvo mantém seu alinhamento, personalidade, tipo de criatura, Pontos de Vida e Dados de Pontos de Vida. Veja também o apêndice B para amostras dos blocos de estatísticas das Feras.\nO alvo recebe um número de Pontos de Vida Temporários igual aos Pontos de Vida da forma de Fera. A magia se encerra no alvo se ele não tiver Pontos de Vida Temporários restantes.\nO alvo é limitado às ações que pode realizar pela anatomia de sua nova forma, e não pode falar ou conjurar magias.\nO equipamento do alvo se funde com a nova forma. A criatura não pode usar ou se beneficiar de nenhum desses equipamentos.\nPolimorfia Total\n9º Círculo, Transmutação (Bardo, Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S, M (uma gota de mercúrio, uma porção de goma arábica e um fiapo de fumaça)\nDuração: Concentração, até 1 hora\nEscolha uma criatura ou objeto não mágico à sua vista e no alcance da magia. A criatura se multimorfa para uma criatura diferente, um objeto não mágico, ou o objeto se multimorfa para uma criatura (o objeto não pode estar sendo usado nem carregado). A transformação permanece pela duração da magia ou até que o alvo morra ou seja destruído, mas se você mantiver a Concentração nesta magia pela duração completa, a magia permanece até ser dissipada.\nUma criatura involuntária pode realizar uma salvaguarda de Sabedoria e, se for bem-sucedida, não é afetada por esta magia.\nCriatura em Criatura. Se você transformar uma criatura em outro tipo de criatura, a nova forma pode ser qualquer tipo que você escolher que tenha um Nível de Desafio igual ou menor do que o Nível de Desafio ou nível do alvo. As estatísticas de jogo do alvo são substituídas pelo bloco de estatísticas da nova forma, mas ele mantém seus Pontos de Vida, Dados de Pontos de Vida e alinhamento.\nO alvo recebe um número de Pontos de Vida Temporários igual aos Pontos de Vida da nova forma. A magia se encerra no alvo se ele não tiver Pontos de Vida Temporários restantes.\nO alvo é limitado às ações que pode realizar pela anatomia de sua nova forma, e não pode falar ou conjurar magias.\nO equipamento do alvo se funde com a nova forma. A criatura não pode usar ou se beneficiar de nenhum desses equipamentos.\nObjeto em Criatura. Você pode transformar um objeto em qualquer tipo de criatura, desde que o tamanho da criatura não seja maior que o tamanho do objeto e a criatura tenha um Nível de Desafio de 9 ou menor. A criatura é Amigável a você e seus aliados. Em combate, ela age imediatamente após o seu turno e obedece aos seus comandos.\nSe a magia durar mais de uma hora, você não controla mais a criatura. Ela pode permanecer Amigável a você, dependendo de como você a tratou.\nCriatura em Objeto. Se você transformar uma criatura em um objeto, ela se transforma junto com o que quer que esteja vestindo e carregando nessa forma, desde que o tamanho do objeto não seja maior do que o tamanho da criatura. As estatísticas da criatura se tornam as do objeto, ela não tem memórias do período que passou em forma de objeto e volta ao normal após a magia terminar.\nPorta Dimensional\n4º Círculo, Invocação (Bardo, Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 150 metros\nComponentes: V\nDuração: Instantânea\nVocê se teleporta para um local no alcance da magia. Você chega exatamente ao local desejado. Pode ser um lugar que você pode ver, um que você pode visualizar ou um que você pode descrever indicando distância e direção, como “60 metros para baixo” ou “90 metros para cima em direção ao noroeste em um ângulo de 45 graus”.\nVocê também pode teleportar uma criatura voluntária. A criatura deve estar a até 1,5 metro de você quando você se teleporta, e ela se teleporta para um espaço a até 1,5 metro do seu espaço de destino.\nSe você, a outra criatura ou ambas chegarem a um espaço ocupado por uma criatura, ou completamente preenchido por um ou mais objetos, você e qualquer criatura viajando com você sofre 4d6 pontos de dano Energético, e o teleporte falha.\nPortais Arcanos\n6º Círculo, Invocação (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 150 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê cria portais de teleporte vinculados. Escolha dois espaços grandes e desocupados no chão à sua vista, um espaço no alcance da magia e o outro a até 3 metros de você. Um portal circular se abre em cada um desses espaços e permanece pela duração da magia.\nOs portais são anéis brilhantes bidimensionais cheios de névoa que bloqueiam a visão. Eles pairam a centímetros do chão e são perpendiculares a ele.\nUm portal fica aberto apenas de um lado (à sua escolha). Qualquer coisa que entre no lado aberto de um portal sai do lado aberto do outro portal como se os dois fossem adjacentes um ao outro. Como uma Ação Bônus, você pode alterar a face dos lados abertos.\nPortal\nOtto, o Bardo, conjura Portal para abrir um portal para as Terras Além.\n9º Círculo, Invocação (Bruxo, Clérigo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S, M (um diamante no valor de 5.000 ou mais PO)\nDuração: Concentração, até 1 minuto\nVocê conjura um portal que liga um espaço desocupado à sua vista e no alcance da magia a um local preciso em um plano de existência diferente. O portal é uma abertura circular, que você pode criar com 1,5 a 6 metros de diâmetro. Você pode orientar o portal em qualquer direção que escolher. O portal permanece pela duração da magia e o destino para o qual ele leva é visível através dele.\nO portal tem uma frente e um verso em cada plano onde aparece. Se deslocar pelo portal só é possível movendo-se pela frente. Qualquer coisa que o faça é instantaneamente transportada para o outro plano, aparecendo no espaço desocupado mais próximo do portal.\nDivindades e outros governantes dos planos podem impedir que portais criados por esta magia se abram em sua presença ou em qualquer lugar dentro de seus domínios.\nAo conjurar esta magia, você pode proferir o nome de uma criatura específica (não funciona com um pseudônimo, título ou apelido). Se essa criatura estiver em um plano diferente daquele em que você está, o portal se abre ao lado da criatura nomeada e a transporta para o espaço desocupado mais próximo do seu lado do portal. Você não recebe nenhum poder especial sobre a criatura, e ela é livre para agir conforme o Mestre julgar apropriado. Ela pode ir embora, atacar você ou ajudá-lo.\nPraga de Insetos\n5º Círculo, Invocação (Clérigo, Druida, Feiticeiro)\nTempo de Conjuração: Ação\nAlcance: 90 metros\nComponentes: V, S, M (um gafanhoto)\nDuração: Concentração, até 10 minutos\nUm enxame de gafanhotos preenche uma Esfera de 6 metros de raio centrada em um ponto à sua escolha no alcance da magia. A Esfera permanece pela duração, e sua área é Parcialmente Obscurecida e Terreno Difícil.\nQuando o enxame aparece, cada criatura dentro dele realiza uma salvaguarda de Constituição, sofrendo 4d10 pontos de dano Perfurante se falhar, ou metade desse dano em caso de sucesso. Uma criatura também realiza essa salvaguarda quando entra na área da magia pela primeira vez em um turno ou encerra o turno nela. Uma criatura realiza essa salvaguarda apenas uma vez por turno.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d10 para cada círculo de espaço de magia acima de 5.\nPresença Régia de Yolande\n5º Círculo, Encantamento (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (uma tiara em miniatura)\nDuração: Concentração, até 1 minuto\nVocê se envolve com uma majestade sobrenatural em uma Emanação de 3 metros. Sempre que a Emanação entra no espaço de uma criatura à sua vista, ou quando uma criatura à sua vista entra na Emanação ou termina seu turno nela, você pode forçar essa criatura a realizar uma salvaguarda de Sabedoria. Se falhar, o alvo sofre 4d6 pontos de dano Psíquico e tem a condição Caído, e você pode empurrá-lo até 3 metros para longe de você. Em caso de sucesso, o alvo sofre apenas metade do dano. Uma criatura realiza essa salvaguarda apenas uma vez por turno.\nPresságio\n4º Círculo, Adivinhação (Clérigo, Druida, Mago)\nTempo de Conjuração: Ação ou Ritual\nAlcance: Pessoal\nComponentes: V, S, M (incenso no valor de 25 ou mais PO, que a magia consome)\nDuração: Instantânea\nEsta magia coloca você em contato com um deus ou com os servos de um deus. Você faz uma pergunta sobre um objetivo, evento ou atividade específica que ocorrerá em até 7 dias. O Mestre oferece uma resposta verdadeira, que pode ser uma frase curta ou uma rima enigmática. A magia não leva em conta circunstâncias que podem alterar a resposta, como a conjuração de outras magias.\nSe você conjurar a magia mais de uma vez antes de completar um Descanso Longo, há uma chance cumulativa de 25% para cada conjuração após a primeira de que você não receba resposta.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "prestidigitacao-arcana",
    "name": "Prestidigitação Arcana",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "3 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Até 1 hora",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você cria um efeito mágico no alcance da magia. Escolha o efeito entre as opções abaixo. Se conjurar esta magia várias vezes, você pode ter até três de seus efeitos não instantâneos ativos ao mesmo tempo.\nBrincar com Fogo. Você instantaneamente acende ou apaga uma vela, uma tocha ou uma pequena fogueira.\nCriação Menor. Você cria uma bugiganga não mágica, sem valor monetário e incapaz de causar dano, ou uma imagem ilusória, sendo que ambas devem caber na sua mão.\nEfeito Sensorial. Você cria um efeito sensorial instantâneo e inofensivo, como uma chuva de faíscas, um sopro de vento, notas musicais suaves ou um odor estranho.\nLimpar ou Sujar. Você limpa ou suja instantaneamente um objeto com menos de 30 centímetros cúbicos.\nMarca Mágica. Você faz aparecer uma cor, uma pequena marca ou um símbolo em um objeto ou superfície por 1 hora.\nSensação Ideal. Você esfria, aquece ou dá sabor a um material não vivo com menos de 30 centímetros cúbicos por 1 hora.\nProibição\n6º Círculo, Abjuração (Clérigo)\nTempo de Conjuração: 10 minutos ou Ritual\nAlcance: Toque\nComponentes: V, S, M (rubi em pó no valor de 1.000 ou mais PO)\nDuração: 1 dia\nVocê cria uma proteção contra viagens mágicas que protege até 3.700 metros quadrados de espaço a uma altura de 9 metros acima do chão. Pela duração da magia, as criaturas não podem se teleportar para a área ou usar portais, como aqueles criados pela magia Portal, para entrar na área. A magia bloqueia a área contra viagens planares e, portanto, impede que criaturas acessem a área pelo Plano Astral, Plano Etéreo, Faéria, Sombral ou pela magia Transição Planar.\nAlém disso, a magia causa dano aos tipos de criaturas, entre um ou mais, que você escolhe ao conjurá-la: Aberrações, Celestiais, Elementais, Feéricos, Ínferos e Mortos-Vivos. Quando uma criatura de um dos tipos escolhidos entra pela primeira vez na área da magia ou termina seu turno nela, sofre 5d10 pontos de dano Necrótico ou Radiante (à sua escolha ao conjurar esta magia).\nVocê pode definir uma senha ao conjurar a magia. Uma criatura que profere a senha ao entrar na área não sofre dano da magia.\nA área da magia não pode se sobrepor à área de outra magia Proibição. Se você conjurar Proibição todos os dias por 30 dias no mesmo local, a magia permanece até ser dissipada e os componentes Materiais são consumidos na última conjuração.\nProjeção Astral\n9º Círculo, Necromancia (Clérigo, Bruxo, Mago)\nTempo de Conjuração: 1 hora\nAlcance: 3 metros\nComponentes: V, S, M (para cada um dos alvos da magia, um zircão no valor de 1.000 ou mais PO e uma barra de prata no valor de 100 ou mais PO, que a magia consome)\nDuração: Até ser dissipada\nVocê e até oito criaturas voluntárias no alcance da magia projetam seus corpos astrais no Plano Astral (a magia se encerra instantaneamente se você já estiver nesse plano). O corpo de cada alvo é deixado para trás em um estado de animação suspensa; ele tem a condição Inconsciente, não precisa comer ou respirar e não envelhece.\nA forma astral de um alvo se assemelha ao seu corpo em quase todos os aspectos, replicando suas estatísticas de jogo e pertences. A principal diferença é a adição de um cordão prateado que se arrasta entre as omoplatas da forma astral. O cordão desaparece de vista após 30 centímetros. Se o cordão for cortado — algo que só pode acontecer quando um efeito especificamente declarar isto — tanto o corpo quanto a forma astral do alvo morrem.\nA forma astral de um alvo pode viajar pelo Plano Astral. No momento em que uma forma astral deixa aquele plano, o corpo e os pertences do alvo viajam ao longo do cordão prateado, fazendo com que o alvo reentre em seu corpo no novo plano.\nQualquer dano ou efeito aplicável a uma forma astral não afeta o corpo do alvo e vice-versa. Se o corpo ou a forma astral de um alvo for reduzido a 0 Pontos de Vida, a magia se encerra para esse alvo. A magia se encerra para todos os alvos se você executar uma ação Usar Magia para descartá-la.\nQuando a magia termina para um alvo que não está morto, o alvo reaparece em seu corpo e sai do estado de animação suspensa.\nProjetar Imagem\n7º Círculo, Ilusão (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: 800 quilômetros\nComponentes: V, S, M (uma estatueta de si mesmo no valor de 5 ou mais PO)\nDuração: Concentração, até 1 dia\nVocê cria uma cópia ilusória de si mesmo que dura enquanto a magia estiver ativa. A cópia pode surgir em qualquer lugar que você já tenha visto e que esteja no alcance da magia, ignorando obstáculos. A ilusão se parece e soa como você, mas é intangível. Se a ilusão sofrer qualquer dano, ela desaparece e a magia se encerra.\nVocê pode ver através dos olhos da ilusão e ouvir através dos ouvidos dela, como se você estivesse no espaço dela. Com uma ação Usar Magia, você pode movê-la até 18 metros e fazer com que ela gesticule, fale e se comporte da maneira que desejar. Ela imita seus maneirismos perfeitamente.\nInteração física com a imagem revela sua natureza ilusória, já que objetos podem atravessá-la. Uma criatura que executa a ação Analisar para examinar a imagem pode determinar que se trata de uma ilusão com um teste bem-sucedido de Inteligência (Investigação) contra a CD para evitar sua magia. Se uma criatura perceber a ilusão, ela pode ver através da imagem, e qualquer som que a ilusão emita parece vago para essa criatura.\nProteção Contra a Morte\n4º Círculo, Abjuração (Clérigo, Paladino)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S\nDuração: 8 horas\nVocê toca uma criatura e concede a ela uma medida de proteção contra a morte. Na primeira vez que o alvo é reduzido a 0 Pontos de Vida antes que a magia termine, em vez disso o alvo fica com 1 Ponto de Vida e a magia termina.\nSe a magia ainda estiver ativa quando o alvo for submetido a um efeito que o mate instantaneamente sem causar dano, esse efeito é negado contra o alvo e a magia se encerra.\nProteção Contra Energia\n3º Círculo, Abjuração (Clérigo, Druida, Feiticeiro, Guardião, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S\nDuração: Concentração, até 1 hora\nPela duração da magia, a criatura voluntária que você tocar tem Resistência a um tipo de dano à sua escolha: Ácido, Elétrico, Gélido, Ígneo ou Trovejante.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "protecao-contra-laminas",
    "name": "Proteção Contra Lâminas",
    "level": 0,
    "school": "Abjuração",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Sempre que uma criatura realizar uma jogada de ataque contra você antes que a magia termine, o atacante subtrai 1d4 da jogada de ataque.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "protecao-contra-o-bem-e-o-mal",
    "name": "Proteção Contra o Bem e o Mal",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (um pote de Água Benta no valor de 25 ou mais PO",
      "que a magia consome)"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Clérigo",
      "Bruxo",
      "Druida",
      "Mago",
      "Paladino"
    ],
    "description": "Até que a magia termine, uma criatura voluntária que você tocar está protegida contra criaturas que são Aberrações, Celestiais, Elementais, Feéricos, Ínferos ou Mortos-Vivos. A proteção concede vários benefícios. Criaturas desses tipos têm Desvantagem em jogadas de ataque contra o alvo. O alvo também não pode ser possuído por essas criaturas nem adquirir as condições de Amedrontado ou Enfeitiçado por elas. Se o alvo já estiver possuído, Amedrontado ou Enfeitiçado por uma dessas criaturas, ele tem Vantagem em qualquer nova salvaguarda contra o efeito relevante.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "protecao-contra-veneno",
    "name": "Proteção Contra Veneno",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 hora",
    "classes": [
      "Clérigo",
      "Druida",
      "Guardião",
      "Paladino"
    ],
    "description": "Você toca uma criatura e encerra nela a condição Envenenado. Pela duração da magia, o alvo tem Vantagem nas salvaguardas para evitar ou encerrar a condição Envenenado e tem Resiste a dano Venenoso.\nProteger Fortaleza\n6º Círculo, Abjuração (Bardo, Mago)\nTempo de Conjuração: 1 hora\nAlcance: Toque\nComponentes: V, S, M (um cetro de prata no valor de 10 ou mais PO)\nDuração: 24 horas\nVocê cria uma proteção que protege até 225 metros quadrados de espaço. A área protegida pode ter até 6 metros de altura e você a molda como um quadrado de 15 metros de lado, cem quadrados de 1,5 metro de lado que são contíguos ou vinte e cinco quadrados de 3 metros de lados que são contíguos.\nAo conjurar esta magia, você pode especificar indivíduos que não são afetados pelos efeitos da magia. Você também pode especificar uma senha que, quando proferida em voz alta a até 1,5 metro da área protegida, torne o orador imune aos efeitos da magia.\nA magia cria os efeitos abaixo dentro da área protegida. Dissipar Magia não tem efeito sobre Proteger Fortaleza em si, mas cada um dos seguintes efeitos pode ser dissipado. Se todos os quatro forem dissipados, Proteger Fortaleza se encerra. Se você conjurar a magia todos os dias por 365 dias na mesma área, a magia permanece até que todos os seus efeitos sejam dissipados.\nCorredores. A névoa preenche todos os corredores protegidos, tornando a área Totalmente Obscurecida. Além disso, em cada interseção ou passagem ramificada que oferece uma escolha de direção, há uma chance de 50% de que uma criatura diferente de você acredite que está indo na direção oposta à que escolheu.\nEscadas. Teias preenchem todas as escadas na área protegida de cima para baixo, como na magia Teia. Esses fios voltam a crescer em 10 minutos se forem destruídos enquanto Proteger Fortaleza durar.\nPortas. Todas as portas da área protegida estão magicamente trancadas, como se estivessem seladas pela magia Tranca Arcana. Além disso, você pode cobrir até dez portas com uma ilusão para fazê-las parecer seções simples de parede.\nOutro Efeito Mágico. Coloque um dos seguintes efeitos mágicos dentro da área protegida:\nLuzes Dançantes em quatro corredores, com um padrão simples que as luzes repetem enquanto durar Proteger Fortaleza\nBoca Encantada em dois locais\nNuvem Fétida em dois locais (os vapores retornam dentro de 10 minutos se dispersos enquanto Proteger Fortaleza durar)\nLufada de Vento em um corredor ou sala (o vento sopra continuamente enquanto a magia durar)\nSugestão em um quadrado de 1,5 metro de lados; qualquer criatura que entre nesse quadrado recebe a sugestão mentalmente",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "purificar-alimentos-e-bebidas",
    "name": "Purificar Alimentos e Bebidas",
    "level": 1,
    "school": "Transmutação",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "3 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Clérigo",
      "Druida",
      "Paladino"
    ],
    "description": "Você remove veneno e podridão de alimentos e bebidas não mágicos em uma Esfera de 1,5 metro de raio centrada em um ponto no alcance da magia.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1458\" w:name=\"_x9viym3z0jhb\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1458\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>Q",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "queda-suave",
    "name": "Queda Suave",
    "level": 1,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Reação, que você executa quando você ou uma criatura à sua vista a até 18 metros de você entra em queda",
    "range": "18 metros",
    "components": [
      "V",
      "M (uma pequena pena ou pedaço de penugem)"
    ],
    "duration": "1 minuto",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Escolha até cinco criaturas em queda no alcance da magia. A taxa de queda de cada uma diminui para 18 metros por rodada até que a magia termine. Se uma criatura pousar antes do fim da magia, não sofre dano da queda e a magia se encerra para ela.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1460\" w:name=\"_veyibw908l3z\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1460\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>R",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-ardente",
    "name": "Raio Ardente",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você dispara três raios flamejantes. Você pode dispará-los em um ou vários alvos no alcance da magia. Realize um ataque mágico à distância para cada raio. Em caso de acerto, o alvo sofre 2d6 pontos de dano Ígneo.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você cria um raio adicional para cada círculo de espaço de magia acima de 2.\nRaio de Bruxa",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-de-fogo",
    "name": "Raio de Fogo",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você arremessa uma partícula de fogo em uma criatura ou objeto no alcance da magia. Realize um ataque mágico à distância contra o alvo. Em caso de acerto, o alvo sofre 1d10 pontos de dano Ígneo.\nUm objeto inflamável atingido por esta magia entra em combustão se não estiver sendo usado ou carregado.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d10 quando você atinge os níveis 5 (2d10), 11 (3d10) e 17 (4d10).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-de-gelo",
    "name": "Raio de Gelo",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Um feixe congelante de luz azul-esbranquiçada parte em direção a uma criatura no alcance da magia. Realize um ataque mágico à distância contra o alvo. Se acertar, a criatura sofre 1d8 pontos de dano Gélido e seu Deslocamento é reduzido em 3 metros até o início do seu próximo turno.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d8 quando você atinge os níveis 5 (2d8), 11 (3d8) e 17 (4d8).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-do-enfraquecimento",
    "name": "Raio do Enfraquecimento",
    "level": 2,
    "school": "Necromancia",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bruxo",
      "Mago"
    ],
    "description": "Um feixe de energia enfraquecedora parte de você em direção a uma criatura no alcance da magia. A criatura deve realizar uma salvaguarda de Constituição. Em caso de sucesso, a criatura tem Desvantagem na próxima jogada de ataque que realizar até o início do seu próximo turno.\nSe falhar, a criatura tem Desvantagem em Testes de D20 baseados em Força pela duração da magia. Nesse período, ela também subtrai 1d8 de todas as jogadas de dano que fizer. A criatura repete a salvaguarda no final de cada um dos turnos dela, encerrando a magia sobre si em caso de sucesso.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-guia",
    "name": "Raio Guia",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 rodada",
    "classes": [
      "Clérigo"
    ],
    "description": "Você lança um raio de luz em direção a uma criatura no alcance da magia. Realize um ataque mágico à distância contra o alvo. Em caso de acerto, ele sofre 4d6 pontos de dano Radiante, e a próxima jogada de ataque realizado contra ele antes do final do seu próximo turno tem Vantagem.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-lunar",
    "name": "Raio Lunar",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S",
      "M (uma folha de dama-da-noite)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Druida"
    ],
    "description": "Um feixe prateado de luz pálida brilha em um Cilindro com 1,5 metro de raio e 12 metros de altura, centrado em um ponto no alcance da magia. Até que a magia termine, Meia-luz preenche o Cilindro, e você pode executar uma ação Usar Magia nos turnos subsequentes para mover o Cilindro até 18 metros.\nQuando o Cilindro surge, cada criatura em seu interior deve realizar uma salvaguarda de Constituição. Em caso de falha, a criatura sofre 2d10 pontos de dano Radiante e, se estiver multimorfada (como resultado da magia Polimorfia, por exemplo), reverte-se à sua forma verdadeira e não pode se multimorfar novamente até sair do Cilindro. Em caso de sucesso, a criatura recebe apenas metade do dano. Uma criatura também realiza essa salvaguarda quando a área da magia se move para o espaço dela, quando ela entra na área da magia ou quando encerra o próprio turno nela. A criatura realiza essa salvaguarda apenas uma vez por turno.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d10 para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-mistico",
    "name": "Raio Místico",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bruxo"
    ],
    "description": "Você emite um feixe de energia crepitante. Realize um ataque mágico à distância contra uma criatura ou objeto no alcance da magia. Em caso de acerto, o alvo sofre 1d10 pontos de dano Energético.",
    "cantripUpgrade": "Aprimoramento de Truque. A magia cria dois feixes no nível 5, três feixes no nível 11 e quatro feixes no nível 17. Você pode direcionar os feixes para o mesmo alvo ou para alvos diferentes. Realize uma jogada de ataque separada para cada feixe.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "raio-nauseante",
    "name": "Raio Nauseante",
    "level": 1,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você dispara um raio esverdeado em uma criatura no alcance da magia. Realize um ataque mágico à distância contra o alvo. Em caso de acerto, o alvo sofre 2d8 pontos de dano Venenoso e tem a condição Envenenado até o final do seu próximo turno.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 1.\nRaio Solar\n6º Círculo, Evocação (Clérigo, Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (uma lupa)\nDuração: Concentração, até 1 minuto\nVocê lança um feixe de luz em uma linha de 1,5 metro de largura e 18 metros de comprimento. Cada criatura na Linha realiza uma salvaguarda de Constituição. Se falhar, uma criatura sofre 6d8 pontos de dano Radiante e tem a condição Cego até o início do seu próximo turno. Em caso de sucesso, ela sofre apenas metade do dano.\nAté que a magia termine, você pode executar uma ação Usar Magia para criar uma nova Linha de radiância.\nPela duração da magia, uma fagulha de radiância brilha acima de você. Ela emite Luz Plena em um raio de 9 metros e Meia-luz por mais 9 metros. Essa luz é a luz do sol.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "rajada-de-veneno",
    "name": "Rajada de Veneno",
    "level": 0,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bruxo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você projeta uma névoa tóxica em uma criatura no alcance da magia. Realize um ataque mágico à distância contra o alvo. Em caso de acerto, o alvo sofre 1d12 pontos de dano Venenoso.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d12 quando você atinge os níveis 5 (2d12), 11 (3d12) e 17 (4d12).\nRajada Prismática\nUm anão teve um encontro infeliz com o raio anil da Rajada Prismática.\n7º Círculo, Evocação (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Instantânea\nOito raios luminosos partem de você em um Cone de 18 metros. Cada criatura no Cone realiza uma salvaguarda de Destreza. Para cada alvo, jogue 1d8 para determinar qual raio colorido o afeta, consultando a tabela Raios Prismáticos.\nRaios Prismáticos\n1d8\nRaio\n1\nVermelho. Se falhar: 12d6 pontos de dano Ígneo. Em caso de sucesso: metade do dano.\n2\nLaranja. Se falhar: 12d6 pontos de dano Ácido. Em caso de sucesso: metade do dano.\n3\nAmarelo. Se falhar: 12d6 pontos de dano Elétrico. Em caso de sucesso: metade do dano.\n4\nVerde. Se falhar: 12d6 pontos de dano Venenoso. Em caso de sucesso: metade do dano.\n5\nAzul. Se falhar: 12d6 pontos de dano Gélido. Em caso de sucesso: metade do dano.\n6\nAnil. Se falhar: O alvo tem a condição Contido e realiza uma salvaguarda de Constituição no final de cada um dos turnos dele. Se bem-sucedido três vezes, a condição se encerra. Se falhar três vezes, ele tem a condição Petrificado até ser liberado por um efeito como a magia Restauração Maior. Os sucessos e fracassos não precisam ser consecutivos; acompanhe ambos até que o alvo alcance três de um tipo.\n7\nVioleta. Se falhar: O alvo tem a condição Cego e realiza uma salvaguarda de Sabedoria no início do seu próximo turno. Em uma salvaguarda bem-sucedida, a condição se encerra. Se falhar, a condição se encerra e a criatura se teleporta para outro plano de existência (à escolha do Mestre).\n8\nEspecial. O alvo é atingido por dois raios. Jogue duas vezes, jogando novamente quaisquer 8.\nReceptáculo Arcano\n6º Círculo, Necromancia (Mago)\nTempo de Conjuração: 1 minuto\nAlcance: Pessoal\nComponentes: V, S, M (uma gema, cristal ou relicário no valor de 500 ou mais PO)\nDuração: Até ser dissipada\nSeu corpo entra em um estado catatônico enquanto sua alma se desprende dele e adentra o receptáculo que você utilizou como componente Material da magia. Enquanto sua alma habita o receptáculo, você percebe os arredores como se estivesse no espaço ocupado por ele. Você não pode se mover ou usar Reações. A única ação que pode realizar é projetar sua alma a até 30 metros do receptáculo, seja retornando ao seu corpo vivo (e encerrando a magia) ou tentando possuir um corpo Humanoide.\nVocê pode tentar possuir qualquer criatura Humanoide a até 30 metros do seu alcance e que esteja à sua vista (criaturas protegidas pela magia Círculo Mágico ou Proteção contra o Bem e o Mal não podem ser possuídas). O alvo deve realizar uma salvaguarda de Carisma. Se falhar, a sua alma projeta-se do receptáculo para dentro do corpo do alvo, expulsando a alma dele, que agora fica aprisionada no receptáculo. Em caso de sucesso, o alvo resiste aos seus esforços para possuí-lo, e você não pode tentar novamente por 24 horas.\nUma vez que possua o corpo de uma criatura, você a controla. Seus Pontos de Vida, Dados de Vida, Força, Destreza, Constituição, Deslocamento e sentidos são substituídos pelos da criatura. Por outro lado, você mantém suas estatísticas de jogo.\nEnquanto isso, a alma da criatura possuída pode perceber a partir do receptáculo usando seus próprios sentidos, mas ela não pode se mover e está Incapacitada.\nEnquanto estiver possuindo um corpo, você pode usar uma de suas ações para retornar do corpo do hospedeiro para o receptáculo, desde que este esteja a até 30 metros de distância, devolvendo a alma do hospedeiro ao corpo dela. Se o corpo do hospedeiro morrer enquanto você estiver nele, a criatura morre e você deve realizar uma salvaguarda de Carisma contra a CD do seu próprio atributo de conjuração. Em caso de sucesso, e se o receptáculo estiver a até 30 metros de distância, sua alma retorna a ele. Caso contrário, você morre.\nSe o receptáculo for destruído ou a magia terminar, sua alma retorna imediatamente ao seu corpo. Se o seu corpo estiver a mais de 30 metros de distância ou se ele estiver morto quando sua alma tentar retornar, você morre. Se a alma de outra criatura estiver no receptáculo quando ele for destruído, ela retorna ao corpo dela se este estiver vivo e a até 30 metros de distância. Caso contrário, a criatura morre.\nQuando a magia termina, o receptáculo é destruído.\nReencarnar\n5º Círculo, Necromancia (Druida)\nTempo de Conjuração: 1 hora\nAlcance: Toque\nComponentes: V, S, M (óleos raros no valor de 1.000 ou mais PO, que a magia consome)\nDuração: Instantânea\nVocê toca um Humanoide morto ou parte dele. Se a criatura estiver morta há, no máximo, 10 dias, a magia cria um novo corpo para ela e chama a alma para habitar esse corpo. Jogue 1d10 e consulte a tabela abaixo para determinar a espécie do novo corpo ou o Mestre escolhe outra espécie jogável.\n1d10\nEspécies\n1d10\nEspécies\n1\nAasimar\n6\nGolias\n2\nDraconato\n7\nPequenino\n3\nAnão\n8\nHumano\n4\nElfo\n9\nOrc\n5\nGnomo\n10\nTiferino\nA criatura reencarnada faz quaisquer escolhas que a descrição de sua nova espécie oferece e mantém as memórias de sua vida anterior. Ela conserva as capacidades que possuía em sua forma original, mas perde os traços da espécie anterior e adquire os traços da nova espécie.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "reflexos",
    "name": "Reflexos",
    "level": 2,
    "school": "Ilusão",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "1 minuto",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Três cópias ilusórias suas aparecem em seu espaço. Até que a magia termine, as cópias se movem com você e imitam suas ações, mudando de posição de forma que seja impossível rastrear qual imagem é a verdadeira.\nCada vez que uma criatura atinge você com uma jogada de ataque pela duração da magia, jogue um d6 para cada uma das cópias restantes. Se qualquer um dos d6s resultar em 3 ou mais, uma das cópias é atingida em seu lugar e é destruída. As cópias ignoram todos os outros danos e efeitos. A magia se encerra quando as três cópias são destruídas.\nUma criatura não é afetada por esta magia se tem a condição Cego, ou se possuir Visão às Cegas ou Visão Verdadeira.\nRefugiar\n7º Círculo, Transmutação (Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (poeira de uma pedra preciosa no valor de 5.000 ou mais PO, que a magia consome)\nDuração: Até ser dissipada\nCom um toque, você magicamente oculta um objeto ou uma criatura voluntária. Pela duração da magia, o alvo tem a condição Invisível, não pode ser alvo de magias de Adivinhação, detectado por magia ou observado remotamente por meios mágicos.\nSe o alvo for uma criatura, ela entra em um estado de animação suspensa, tem a condição Inconsciente, não envelhece e não necessita de alimento, água ou ar.\nVocê pode definir uma condição para que a magia encerre previamente. A condição pode ser qualquer coisa à sua escolha, mas deve ocorrer ou ser visível em um raio de 1,5 quilômetro do alvo. Exemplos incluem “após 1.000 anos” ou “quando o tarrasque despertar”. A magia também encerra se o alvo sofrer qualquer dano.\nRegeneração\n7º Círculo, Transmutação (Bardo, Clérigo, Druida)\nTempo de Conjuração: 1 minuto\nAlcance: Toque\nComponentes: V, S, M (uma conta de oração)\nDuração: 1 hora\nUma criatura que você toca recupera 4d8 + 15 Pontos de Vida. Pela duração da magia, o alvo recupera 1 Ponto de Vida no início de cada um dos turnos dele, e quaisquer partes do corpo cortadas voltam a crescer após 2 minutos.\nRelâmpago\n3º Círculo, Evocação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S, M (um pouco de pelo e um cajado de cristal)\nDuração: Instantânea\nUm relâmpago formando uma Linha de 30 metros de comprimento e 1,5 metro de largura dispara a partir de você em uma direção à sua escolha. Cada criatura na Linha realiza uma salvaguarda de Destreza, sofrendo 8d6 pontos de dano Elétrico se falhar ou metade desse dano em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 3.\nRemeter\n3º Círculo, Adivinhação (Bardo, Clérigo, Mago)\nTempo de Conjuração: Ação\nAlcance: Ilimitado\nComponentes: V, S, M (um fio de cobre)\nDuração: Instantânea\nVocê envia uma mensagem curta de 25 palavras ou menos para uma criatura que você já encontrou ou que foi descrita a você por alguém que a tenha conhecido. O alvo ouve a mensagem na mente, reconhece você como remetente se o conhecer e pode responder da mesma forma imediatamente. A magia permite que o alvo compreenda o significado da sua mensagem.\nVocê pode enviar a mensagem através de qualquer distância e até para outros planos de existência, mas se o alvo estiver em um plano diferente do seu, há uma chance de 5% de que a mensagem não chegue. Você sabe se a entrega falha.\nAo receber sua mensagem, a criatura pode bloquear sua capacidade de contactá-la novamente com essa magia por 8 horas. Se você tentar enviar outra mensagem durante esse período, descobre que está bloqueado e a magia falha.\nRemover Maldição\n3º Círculo, Abjuração (Clérigo, Bruxo, Mago, Paladino)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S\nDuração: Instantânea\nAo seu toque, todas as maldições que afetam uma criatura ou objeto se encerram. Se o objeto for um item mágico amaldiçoado, a maldição permanece, mas a magia quebra a Sintonização do dono com o objeto, permitindo que ele seja removido ou descartado.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "reparar",
    "name": "Reparar",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "1 minuto",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (duas pedras-ímã)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Clérigo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Essa magia repara uma única ruptura ou rasgo em um objeto que você tocar, como um elo de corrente quebrado, partes de uma chave partida, uma capa rasgada ou um odre furado. Se a ruptura ou rasgo não ultrapassar 30 centímetros em qualquer dimensão, ela é reparada sem deixar vestígios do dano anterior.\nEssa magia pode reparar fisicamente um item mágico, mas não pode restaurar a magia de tal objeto.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "repouso-tranquilo",
    "name": "Repouso Tranquilo",
    "level": 2,
    "school": "Necromancia",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (2 Peças de Cobre",
      "que a magia consome)"
    ],
    "duration": "10 dias",
    "classes": [
      "Clérigo",
      "Mago",
      "Paladino"
    ],
    "description": "Você toca um cadáver ou outros restos mortais. Pela duração da magia, o alvo é protegido da decomposição e não pode se tornar um Morto-Vivo.\nA magia também estende efetivamente o limite de tempo para ressuscitar o alvo dos mortos, uma vez que os dias passados sob a influência desta magia não contam contra o limite de tempo de magias como Reviver os Mortos.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "repreensao-diabolica",
    "name": "Repreensão Diabólica",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Reação, que você realiza ao receber dano de uma criatura à sua vista e a até 18 metros de você",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bruxo"
    ],
    "description": "A criatura que lhe causou dano é momentaneamente cercada por chamas verdes. Ela realiza uma salvaguarda de Destreza, sofrendo 2d10 pontos de dano Ígneo se falhar, ou metade desse dano em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d10 para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "resistencia",
    "name": "Resistência",
    "level": 0,
    "school": "Abjuração",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Clérigo",
      "Druida"
    ],
    "description": "Você toca uma criatura voluntária e escolhe um tipo de dano: Ácido, Contundente, Cortante, Elétrico, Gélido, Ígneo, Necrótico, Perfurante, Radiante, Trovejante ou Venenoso. Quando a criatura sofre dano do tipo escolhido antes que a magia termine, a criatura reduz o dano total sofrido em 1d4 pontos. Uma criatura pode se beneficiar desta magia apenas uma vez por turno.\nRespirar na Água\nMagias como Caminhar Sobre as Águas e Respirar na Água auxiliam viagens a reinos aquáticos.\n3º Círculo, Transmutação (Druida, Feiticeiro, Guardião, Mago)\nTempo de Conjuração: Ação ou Ritual\nAlcance: 9 metros\nComponentes: V, S, M (um pedaço de junco)\nDuração: 24 horas\nEsta magia concede a até dez criaturas voluntárias à sua escolha no alcance da magia a capacidade de respirar debaixo d'água até que a magia termine. As criaturas afetadas também mantêm seu modo normal de respiração.\nRessurreição\n7º Círculo, Necromancia (Bardo, Clérigo)\nTempo de Conjuração: 1 hora\nAlcance: Toque\nComponentes: V, S, M (um diamante no valor de 1.000 ou mais PO, que a magia consome)\nDuração: Instantânea\nCom um toque, você revive uma criatura morta há no máximo um século, que não faleceu de velhice nem era um Morto-Vivo.\nA criatura retorna à vida com todos os seus Pontos de Vida, e a magia neutraliza quaisquer venenos que a afetavam na hora da morte, fecha feridas letais e restaura partes do corpo ausentes.\nVoltar à vida é um processo difícil. O alvo sofre uma penalidade de -4 em Testes de D20. Sempre que o alvo completar um Descanso Longo, a penalidade é reduzida em 1 até se tornar 0.\nConjurar essa magia para reviver uma criatura morta há 365 dias ou mais sobrecarrega você. Até completar um Descanso Longo, você não pode conjurar magias novamente e tem Desvantagem nos Testes de D20.\nRessurreição Verdadeira\n9º Círculo, Necromancia (Clérigo, Druida)\nTempo de Conjuração: 1 hora\nAlcance: Toque\nComponentes: V, S, M (diamantes no valor de 25.000 ou mais PO, que a magia consome)\nDuração: Instantânea\nVocê toca uma criatura morta há no máximo 200 anos e que morreu por qualquer motivo, exceto velhice. A criatura retorna à vida com todos os seus Pontos de Vida.\nEsta magia fecha todas as feridas, neutraliza qualquer veneno, cura todos os contágios mágicos e elimina quaisquer maldições afetando a criatura quando ela morreu. A magia substitui órgãos e membros danificados ou ausentes. Se a criatura era Morto-Vivo, ela é restaurada à sua forma não Morta-Viva.\nA magia pode criar um novo corpo se o original não existir mais; nesse caso, você deve pronunciar o nome da criatura. A criatura então aparece em um espaço desocupado à sua escolha, a até 3 metros de você.\nRestauração Maior\n5º Círculo, Abjuração (Bardo, Clérigo, Druida, Guardião, Paladino)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (poeira de diamante no valor de 100 ou mais PO, que a magia consome)\nDuração: Instantânea\nVocê toca uma criatura e magicamente remove um dos seguintes efeitos:\n1 nível de Exaustão\nA condição Enfeitiçado ou Petrificado\nUma maldição, incluindo a Sintonização do alvo com um item mágico amaldiçoado\nQualquer redução em um dos valores de atributo do alvo\nQualquer redução nos Pontos de Vida máximos do alvo\nRestauração Menor",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "retirada-acelerada",
    "name": "Retirada Acelerada",
    "level": 1,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você executa a ação Correr e, até que a magia termine, pode executar essa ação novamente como uma Ação Bônus.\nReviver os Mortos\nUm Clérigo humano conjura Reviver os Mortos para trazer um camarada caído de volta à vida.\n5º Círculo, Necromancia (Bardo, Clérigo, Paladino)\nTempo de Conjuração: 1 hora\nAlcance: Toque\nComponentes: V, S, M (um diamante no valor de 500 ou mais PO, que a magia consome)\nDuração: Instantânea\nCom um toque, você revive uma criatura morta, se tiver falecido há no máximo 10 dias e não era um Morto-Vivo quando morreu.\nA criatura retorna à vida com 1 Ponto de Vida. Esta magia também neutraliza quaisquer venenos que afetavam a criatura no momento da morte.\nEsta magia fecha todas as feridas fatais, mas não restaura membros ou partes do corpo faltantes. Se a criatura estiver sem partes do corpo ou órgãos essenciais para sua sobrevivência — como a cabeça, por exemplo — a magia falha automaticamente.\nVoltar à vida é um processo difícil. O alvo sofre uma penalidade de -4 em Testes de D20. Sempre que o alvo completar um Descanso Longo, a penalidade é reduzida em 1 até se tornar 0.\nRevivificar\n3º Círculo, Necromancia (Clérigo, Druida, Guardião, Paladino)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (um diamante no valor de 300 ou mais PO, que a magia consome)\nDuração: Instantânea\nVocê toca uma criatura que morreu no último minuto. Essa criatura revive com 1 Ponto de Vida. Esta magia não pode reviver uma criatura que morreu de velhice, nem restaura partes do corpo ausentes.\nRogar Maldição\n3º Círculo, Necromancia (Bardo, Clérigo, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nVocê toca uma criatura, que deve ser bem-sucedida em uma salvaguarda de Sabedoria ou fica amaldiçoada pela duração da magia. Até que a maldição termine, o alvo sofre um dos seguintes efeitos à sua escolha:\nEscolha um atributo. O alvo tem Desvantagem em testes de atributo e salvaguardas realizadas com esse atributo.\nO alvo tem Desvantagem em jogadas de ataque contra você.\nEm combate, o alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria no início de cada um dos turnos dele ou ele é forçado a executar a ação Esquivar neste turno.\nSe você causar dano ao alvo com uma jogada de ataque ou uma magia, o alvo sofre 1d8 pontos de dano Necrótico adicionais.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Se você conjurar esta magia usando um espaço de magia de 4º círculo, você pode manter a Concentração nela por até 10 minutos. Se você usar um espaço de magia de 5º círculo ou superior, a magia não requer Concentração, e a duração se torna 8 horas (espaço de 5º e 6º círculo) ou 24 horas (espaço de 7º ou 8º círculo). Se você usar um espaço de magia de 9º círculo, a magia permanece até ser dissipada.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1493\" w:name=\"_qe5kyjiez9eb\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1493\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>S",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "salto",
    "name": "Salto",
    "level": 1,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (perna traseira de um gafanhoto)"
    ],
    "duration": "1 minuto",
    "classes": [
      "Druida",
      "Feiticeiro",
      "Guardião",
      "Mago"
    ],
    "description": "Você toca uma criatura voluntária. Uma vez em cada um dos turnos dela até que a magia encerre, essa criatura pode saltar até 9 metros gastando 3 metros de movimento.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "santuario",
    "name": "Santuário",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (o caco de um espelho)"
    ],
    "duration": "1 minuto",
    "classes": [
      "Clérigo"
    ],
    "description": "Você protege uma criatura no alcance da magia. Até que a magia termine, qualquer criatura que tenha como alvo a criatura protegida com uma jogada de ataque ou uma magia que cause dano deve ser bem-sucedida em uma salvaguarda de Sabedoria, ou deve escolher um novo alvo ou perder o ataque ou a magia. Esta magia não protege contra áreas de efeito. A magia se encerra se a criatura protegida realizar uma jogada de ataque, conjurar uma magia ou causar dano.\nSantuário Particular de Mordenkainen\n4º Círculo, Abjuração (Mago)\nTempo de Conjuração: 10 minutos\nAlcance: 36 metros\nComponentes: V, S, M (uma folha fina de chumbo)\nDuração: 24 horas\nVocê torna uma área no alcance da magia magicamente segura. A área é um Cubo que pode ter de 1,5 metro a 30 metros de lado. A magia permanece pela duração.\nAo conjurar a magia, você determina o tipo de proteção que a magia oferece, escolhendo qualquer uma das seguintes propriedades:\nO som não pode atravessar a barreira na borda da área protegida.\nA barreira da área protegida aparece escura e enevoada, impedindo a visão (incluindo Visão no Escuro) através dela.\nSensores criados por magias de Adivinhação não podem aparecer dentro da área protegida nem atravessar a barreira em seu perímetro.\nCriaturas na área não podem ser alvo de magias de Adivinhação.\nNada pode se teleportar para dentro ou fora da área protegida.\nViagens planares são bloqueadas dentro da área protegida.\nConjurar essa magia no mesmo local todos os dias por 365 dias faz com que a magia dure até ser dissipada.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você pode aumentar o tamanho do Cubo em 30 metros para cada círculo de espaço de magia acima de 4.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "saraivada-de-espinhos",
    "name": "Saraivada de Espinhos",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus, que você realiza imediatamente após atingir uma criatura com um ataque com arma à Distância",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Guardião"
    ],
    "description": "Ao atingir uma criatura, essa magia faz surgir uma chuva de espinhos a partir da sua arma à distância ou munição. O alvo e cada criatura em um raio de 1,5 metro devem realizar uma salvaguarda de Destreza, sofrendo 1d10 pontos de dano perfurante se falharem ou metade desse dano em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d10 para cada círculo de espaço de magia acima de 1.\nSemiplano\n8º Círculo, Invocação (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: S\nDuração: 1 hora\nVocê cria uma porta Média de sombras em uma superfície sólida e plana à sua vista e no alcance da magia. Essa porta pode ser aberta e fechada, levando a uma sala vazia de 9 metros em cada dimensão, feita de madeira ou pedra à sua escolha, em semiplano.\nQuando a magia termina, a porta desaparece e os objetos dentro do semiplano permanecem nele. Qualquer criatura dentro dele também permanece nele, a menos que escolha passar pela porta enquanto ela desaparece, saindo com a condição Caído e nos espaços desocupados mais próximos do espaço que a porta ocupava anteriormente.\nAo conjurar esta magia, você pode criar um novo semiplano ou conectar a porta de sombras a um semiplano que você criou em uma conjuração anterior desta magia. Além disso, se souber a natureza e o conteúdo de um semiplano criado por outra criatura com esta magia, você pode conectar a porta de sombras a esse semiplano.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "sentido-feral",
    "name": "Sentido Feral",
    "level": 2,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": true,
    "castingTime": "Ação ou Ritual",
    "range": "Toque",
    "components": [
      "S"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Druida",
      "Guardião"
    ],
    "description": "Você toca uma Fera voluntária. Pela duração da magia, você pode perceber através dos sentidos da Fera, bem como dos seus próprios. Ao perceber através dos sentidos da Fera, você se beneficia de quaisquer sentidos especiais que ela tenha.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "servo-invisivel",
    "name": "Servo Invisível",
    "level": 1,
    "school": "Invocação",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pedaço de barbante e de madeira)"
    ],
    "duration": "1 hora",
    "classes": [
      "Bardo",
      "Bruxo",
      "Mago"
    ],
    "description": "Esta magia cria uma força Invisível, sem mente, disforme e Média que executa tarefas simples ao seu comando até que a magia termine. O servo nasce em um espaço desocupado no chão no alcance da magia. Ele tem CA 10, 1 Ponto de Vida e Força 2, e não pode atacar. Se ele é reduzido a 0 Pontos de Vida, a magia encerra.\nUma vez em cada um de seus turnos como uma Ação Bônus, você pode comandar mentalmente o servo a se mover até 4,5 metros e interagir com um objeto. O servo pode realizar tarefas simples que um humano poderia fazer, como buscar coisas, limpar, consertar, dobrar roupas, acender fogueiras, servir comida e bebidas. Depois de dar o comando, o servo executa a tarefa da melhor forma possível até que conclua a tarefa e, em seguida, aguarda seu próximo comando.\nAo ordenar ao servo que realize uma tarefa que o mova a mais de 18 metros de distância de você, a magia se encerra.\nSexto Sentido\n9º Círculo, Adivinhação (Bardo, Bruxo, Druida, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: Toque\nComponentes: V, S, M (uma pena de beija-flor)\nDuração: 8 horas\nVocê toca uma criatura voluntária e concede a ela a capacidade de ver o futuro imediato. Pela duração da magia, o alvo tem Vantagem em Testes de D20, enquanto outras criaturas têm Desvantagem em jogadas de ataque contra ele. A magia se encerra se você a conjurar novamente.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "silencio",
    "name": "Silêncio",
    "level": 2,
    "school": "Ilusão",
    "ritual": true,
    "concentration": true,
    "castingTime": "Ação ou Ritual",
    "range": "36 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 10 minutos",
    "classes": [
      "Bardo",
      "Clérigo",
      "Guardião"
    ],
    "description": "Pela duração da magia, nenhum som pode ser criado dentro ou passar através de uma esfera com raio de 6 metros centrada em um ponto à sua escolha no alcance da magia. Qualquer criatura ou objeto totalmente dentro da esfera é imune a dano Trovejante, e as criaturas têm a condição Surdo enquanto estiverem totalmente dentro dela. É impossível conjurar uma magia que inclua um componente Verbal neste local.\nSímbolo\n7º Círculo, Abjuração (Bardo, Clérigo, Druida, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: Toque\nComponentes: V, S, M (um diamante em pó no valor de 1.000 ou mais PO, que a magia consome)\nDuração: Até ser dissipada ou acionada\nVocê inscreve um glifo prejudicial em uma superfície (como uma seção do chão ou parede) ou dentro de um objeto que pode ser fechado (como um livro ou baú). O glifo pode cobrir uma área não superior a 3 metros de diâmetro. Se você escolher um objeto, ele deve permanecer no lugar; se for movido a mais de 3 metros de onde você conjurou esta magia, o glifo é quebrado e a magia se encerra sem ser acionada.\nO glifo é quase imperceptível e requer um teste bem-sucedido de Sabedoria (Percepção) contra a CD para evitar sua magia para ser notado.\nQuando inscreve o glifo, você define seu gatilho e escolhe qual efeito o símbolo possui: Atordoamento, Discórdia, Dor, Medo, Morte ou Sono. Cada um é explicado abaixo.\nDefina o Gatilho. Você decide o que aciona o glifo quando conjura a magia. Para glifos inscritos em uma superfície, os gatilhos comuns incluem tocar ou ficar em pé sobre o glifo, remover outro objeto que o cubra, aproximar-se a uma certa distância ou manipular o objeto que o contém. Para glifos inscritos em um objeto, os gatilhos comuns incluem abrir esse objeto ou ver o glifo. Você pode ajustar o gatilho para que apenas criaturas de certos tipos o ativem (por exemplo, o glifo pode ser definido para afetar Aberrações). Você também pode definir condições para criaturas que não acionam o glifo, como aquelas que dizem uma determinada senha.\nUma vez acionado, o glifo brilha, preenchendo uma Esfera de 18 metros de raio com Meia-Luz por 10 minutos, após os quais a magia termina. Cada criatura na Esfera quando o glifo é ativado é alvo de seu efeito, assim como uma criatura que entra na Esfera pela primeira vez em um turno ou termina o turno nela. Uma criatura é atingida apenas uma vez por turno.\nAtordoamento. Cada alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Atordoado por 1 minuto.\nDiscórdia. Cada alvo realiza uma salvaguarda de Sabedoria. Se falhar, um alvo discute com outras criaturas por 1 minuto. Durante esse tempo, é incapaz de se comunicar efetivamente e tem Desvantagem em jogadas de ataque e testes de atributo.\nDor. Cada alvo deve ser bem-sucedido em uma salvaguarda de Constituição ou tem a condição Incapacitado por 1 minuto.\nMedo. Cada alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Amedrontado por 1 minuto. Enquanto Amedrontado, o alvo deve se mover pelo menos 9 metros para longe do glifo em cada um dos turnos dele, se possível.\nMorte. Cada alvo realiza uma salvaguarda de Constituição, sofrendo 10d10 pontos de dano Necrótico se falhar, ou metade desse dano em caso de sucesso.\nSono. Cada alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Inconsciente por 10 minutos. Uma criatura desperta se sofrer dano ou se alguém executar uma ação para sacudi-la.\nSimilaridade\n5º Círculo, Ilusão (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: 8 horas\nVocê dá uma aparência ilusória a cada criatura à sua escolha à sua vista e no alcance da magia. Um alvo involuntário pode realizar uma salvaguarda de Carisma e, se for bem-sucedido, não é afetado por esta magia.\nVocê pode dar a mesma aparência ou aparências diferentes aos alvos. A magia pode alterar a aparência dos corpos e equipamentos dos alvos, fazendo com que cada criatura pareça até 30 centímetros mais alta ou mais baixa e mais pesada ou mais leve. A nova aparência deve manter os aspectos básicos de membros do corpo do alvo, mas o restante da ilusão fica a seu critério. Os efeitos permanecem pela duração da magia.\nAs mudanças causadas por esta magia falham mediante uma inspeção física. Por exemplo, se você usar a magia para adicionar um chapéu ao traje de uma criatura, objetos passam através do chapéu.\nUma criatura que executa a ação Analisar para examinar um alvo pode realizar um teste de Inteligência (Investigação) contra a CD para evitar sua magia. Em caso de sucesso, a criatura percebe que o alvo está disfarçado.\nSimulacro\n7º Círculo, Ilusão (Mago)\nTempo de Conjuração: 12 horas\nAlcance: Toque\nComponentes: V, S, M (rubi em pó no valor de 1.500 ou mais PO, que a magia consome)\nDuração: Até ser dissipada\nVocê cria uma duplicata ilusória de uma Fera ou Humanoide que esteja a até 3 metros de você durante toda a conjuração da magia. Você encerra a conjuração tocando tanto a criatura quanto uma pilha de gelo ou neve do mesmo tamanho da criatura, e a pilha se transforma na duplicata, que é uma criatura. A duplicata utiliza as estatísticas da criatura original no momento da conjuração, exceto que ela é um Constructo, seus Pontos de Vida máximos são reduzidos pela metade e ela não pode conjurar esta magia.\nA duplicata é Amigável a você e às criaturas que você escolher. Ele obedece aos seus comandos e age no seu turno durante o combate e não pode adquirir níveis, nem realizar Descansos Curtos ou Longos.\nSe a duplicata sofrer dano, a única forma de restaurar seus Pontos de Vida é repará-la durante um Descanso Longo, no qual você deve gastar componentes no valor de 100 PO por Ponto de Vida restaurado e deve permanecer a até 1,5 metro de você para ser reparada.\nA duplicata dura até ser reduzida a 0 Pontos de Vida, momento em que ela retorna a ser neve e derrete. Se você conjurar esta magia novamente, qualquer duplicata criada anteriormente por esta magia é destruída instantaneamente.\nSimular Morte\n3º Círculo, Necromancia (Bardo, Clérigo, Druida, Mago)\nTempo de Conjuração: Ação ou Ritual\nAlcance: Toque\nComponentes: V, S, M (uma pitada de terra de cemitério)\nDuração: 1 hora\nVocê toca uma criatura voluntária e a coloca em um estado cataléptico que é indistinguível da morte.\nPela duração da magia, o alvo parece morto em uma inspeção externa e para magias usadas para determinar a situação do alvo. O alvo está com as condições Cego e Incapacitado, e o Deslocamento dele é 0.\nO alvo também tem Resistência a todos os tipos de dano, exceto dano Psíquico, e tem Imunidade à condição Envenenado.\nSinal de Esperança\n3º Círculo, Abjuração (Clérigo)\nTempo de Conjuração: Ação\nAlcance: 9 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nEscolha qualquer número de criaturas no alcance da magia. Pela duração da magia, cada alvo tem Vantagem em salvaguardas de Sabedoria e Salvaguarda contra Morte e recupera o número de Pontos de Vida máximos possíveis de qualquer cura.\nSonho\n5º Círculo, Ilusão (Bardo, Bruxo, Mago)\nTempo de Conjuração: 1 minuto\nAlcance: Especial\nComponentes: V, S, M (um punhado de areia)\nDuração: 8 horas\nVocê tem como alvo uma criatura que você conhece no mesmo plano de existência. Você ou uma criatura voluntária que você toca entra em um estado de transe para agir como um mensageiro dos sonhos. Enquanto estiver em transe, o mensageiro está Incapacitado e tem Deslocamento 0.\nSe o alvo estiver dormindo, o mensageiro aparece nos sonhos do alvo e pode conversar com ele enquanto ele permanecer dormindo, pela duração da magia. O mensageiro também pode moldar o ambiente do sonho, criando paisagens, objetos e outras imagens. O mensageiro pode emergir do transe a qualquer momento, encerrando a magia. O alvo se lembra do sonho perfeitamente ao acordar.\nSe o alvo estiver acordado quando você conjurar a magia, o mensageiro sabe disso e pode encerrar o transe (e a magia) ou esperar que o alvo durma, momento em que o mensageiro entra nos sonhos do alvo.\nVocê pode tornar o mensageiro aterrorizante para o alvo. Se você fizer isso, o mensageiro pode entregar uma mensagem de no máximo dez palavras e, em seguida, o alvo realiza uma salvaguarda de Sabedoria. Se falhar, o alvo não recebe nenhum benefício do descanso e sofre 3d6 pontos de dano Psíquico quando acordar.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "sono",
    "name": "Sono",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (uma pitada de areia ou pétalas de rosa)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Cada criatura à sua escolha em uma Esfera de 1,5 metro de raio centrada em um ponto no alcance da magia deve ser bem-sucedida em uma salvaguarda de Sabedoria ou tem a condição Incapacitado até o final do próximo turno dela, quando deve repetir a salvaguarda. Se o alvo falhar na segunda salvaguarda, ele tem a condição Inconsciente pela duração da magia. A magia encerra em um alvo se ele sofrer dano ou se alguém a até 1,5 metro dele executar uma ação para sacudi-lo, liberando-o do efeito da magia.\nCriaturas que não dormem, como elfos, ou que têm Imunidade à condição Exaustão, são automaticamente bem-sucedidas nas salvaguardas contra esta magia.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "sopro-de-dragao",
    "name": "Sopro de Dragão",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (uma pimenta)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você toca uma criatura voluntária e escolhe Ácido, Elétrico, Gélido, Ígneo ou Venenoso. Até que a magia termine, o alvo pode executar uma ação Usar Magia para exalar um Cone de 4,5 metros. Cada criatura nessa área realiza uma salvaguarda de Destreza, sofrendo 3d6 pontos de dano do tipo escolhido se falhar, ou metade desse dano em caso de sucesso.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "sugestao",
    "name": "Sugestão",
    "level": 2,
    "school": "Encantamento",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "M (uma gota de mel)"
    ],
    "duration": "Concentração, até 8 horas",
    "classes": [
      "Bardo",
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você sugere um curso de ação — descrito em no máximo 25 palavras — para uma criatura à sua vista e no alcance da magia e que possa ouvi-lo e entendê-lo. A sugestão deve parecer razoável e não envolver nada que obviamente cause dano ao alvo ou aos aliados dele. Por exemplo, você poderia dizer: “Pegue a chave do cofre do tesouro do culto e a traga para mim” ou “Pare de lutar, saia desta biblioteca em paz e não volte”.\nO alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia ou até que você ou seus aliados causem dano a ele. O alvo Enfeitiçado executa a sugestão da melhor forma possível. A atividade sugerida pode durar enquanto a magia estiver ativa, mas se puder ser concluída mais rapidamente, a magia se encerra ao finalizá-la.\nSugestão em Massa\n6º Círculo, Encantamento (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, M (a língua de uma cobra)\nDuração: 24 horas\nVocê sugere um curso de ação — descrito em não mais de 25 palavras — para até doze criaturas à sua vista e no alcance da magia que possam ouvi-lo e entendê-lo. A sugestão deve parecer acessível e não envolver nada que obviamente cause dano a qualquer um dos alvos ou seus aliados. Por exemplo, você poderia dizer: “Caminhe até a aldeia por essa estrada e auxilie os aldeões a realizar a colheita até o pôr do sol” ou dizer: “Agora não é hora para violência. Larguem as armas e dancem! Parem em uma hora”.\nCada alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Enfeitiçado pela duração da magia ou até que você ou seus aliados causem dano ao alvo. Cada alvo Enfeitiçado cumpre a sugestão com o melhor de sua capacidade. A atividade sugerida pode continuar por toda a duração da magia, mas se a atividade sugerida puder ser concluída em um tempo mais curto, a magia encerra para um alvo que a complete.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. A duração é maior com um espaço de magia 7º círculo (10 dias), 8º círculo (30 dias) ou 9º círculo (366 dias).\nSuplício\n8º Círculo, Encantamento (Bardo, Bruxo, Druida, Mago)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S, M (um chaveiro sem chaves)\nDuração: Instantânea\nVocê sobrecarrega a mente de uma criatura à sua vista e no alcance da magia. O alvo realiza uma salvaguarda de Inteligência.\nSe falhar, o alvo sofre 10d12 pontos de dano Psíquico e não pode conjurar magias ou executar a ação Usar Magia. Ao final de cada 30 dias, o alvo repete a salvaguarda, encerrando o efeito em caso de sucesso. O efeito também pode ser encerrado pela magia Cura Completa, Desejo ou Restauração Maior.\nEm uma salvaguarda bem-sucedida, o alvo recebe apenas metade do dano.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "sussurros-dissonantes",
    "name": "Sussurros Dissonantes",
    "level": 1,
    "school": "Encantamento",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo"
    ],
    "description": "Uma criatura à sua escolha à sua vista no alcance da magia escuta uma melodia dissonante na mente. O alvo deve realizar uma salvaguarda de Sabedoria. Se falhar, sofre 3d6 pontos de dano Psíquico e deve usar imediatamente a Reação, se disponível, para se mover o mais longe possível de você, usando a rota mais segura. Em caso de sucesso, o alvo sofre apenas metade do dano.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 pontos para cada círculo de espaço de magia acima de 1.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1515\" w:name=\"_q2gqq2fbing\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1515\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>T",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "talho-mental",
    "name": "Talho Mental",
    "level": 0,
    "school": "Encantamento",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V"
    ],
    "duration": "1 rodada",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você tenta fragmentar temporariamente a mente de uma criatura à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Inteligência ou sofre 1d6 pontos de dano Psíquico e subtrai 1d4 da próxima salvaguarda que realizar antes do final do seu próximo turno.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d6 quando você atinge os níveis 5 (2d6), 11 (3d6) e 17 (4d6).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "taumaturgia",
    "name": "Taumaturgia",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V"
    ],
    "duration": "Até 1 minuto",
    "classes": [
      "Clérigo"
    ],
    "description": "Você conjura uma pequena maravilha mágica no alcance da magia, criando um dos efeitos abaixo. Se usar esta magia várias vezes, pode ter até três efeitos de 1 minuto ativos simultaneamente.\nManipular Fogo. Você faz com que as chamas pisquem, iluminem, escureçam ou mudem de cor por 1 minuto.\nMão Invisível. Você faz instantaneamente com que uma porta ou janela destrancada se abra ou se feche.\nOlhos Alterados. Você altera a aparência dos seus olhos por 1 minuto.\nSom Fantasmagórico. Você cria um som instantâneo que se origina em um ponto à sua escolha no alcance da magia, como um estrondo de trovão, o grito de um corvo ou sussurros sinistros.\nVoz Retumbante. Sua voz aumenta até três vezes mais do que o normal por 1 minuto. Pela duração da magia, você tem Vantagem em testes de Carisma (Intimidação).\nTremores. Você causa tremores inofensivos no chão por 1 minuto.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "teia",
    "name": "Teia",
    "level": 2,
    "school": "Invocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um pouco de teia de aranha)"
    ],
    "duration": "Concentração, até 1 hora",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você conjura uma massa de teias pegajosas em um ponto no alcance da magia. As teias enchem um Cubo de 6 metros de lado pela duração da magia, são Terreno Difícil e a área dentro delas é Parcialmente Obscurecida.\nSe as teias não estiverem sustentadas entre duas massas sólidas (como paredes ou árvores) ou em camadas no chão, parede ou teto, a teia colapsa sobre si mesma e a magia se encerra no início do seu próximo turno. As teias em camadas sobre uma superfície plana têm uma profundidade de 1,5 metro.\nA primeira vez que uma criatura entra nas teias em um turno ou começa o turno nelas, deve ser bem-sucedida em uma salvaguarda de Destreza ou tem a condição Contido enquanto está nas teias ou até se libertar.\nUma criatura Contida pelas teias pode executar uma ação para realizar um teste de Força (Atletismo) contra a CD para evitar sua magia. Em caso de sucesso, a criatura não está mais Contida.\nAs teias são inflamáveis. Qualquer Cubo de 1,5 metro de lado com teias expostas ao fogo queima em 1 rodada, causando 2d4 pontos de dano Ígneo a qualquer criatura que inicie seu turno no fogo.\nTelecinese\n5º Círculo, Transmutação (Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 10 minutos\nVocê adquire a capacidade de mover ou manipular criaturas ou objetos através do pensamento. Ao conjurar a magia e como uma ação Usar Magia em seus turnos posteriores antes que a magia termine, você pode exercer sua vontade sobre uma criatura ou objeto à sua vista e no alcance da magia, causando o efeito apropriado abaixo. Você pode afetar o mesmo alvo rodada após rodada ou escolher um novo a qualquer momento. Se você trocar de alvo, o alvo anterior não é mais afetado pela magia.\nCriatura. Você pode tentar mover uma criatura Enorme ou menor. O alvo deve ser bem-sucedido em uma salvaguarda de Força, ou você move o alvo até 9 metros em qualquer direção no alcance da magia. Até o final do seu próximo turno, a criatura tem a condição Contido e, se você a levantar no ar, ela fica suspensa, entra em queda no final do seu próximo turno, a menos que você use essa opção novamente e ela falhe na salvaguarda.\nObjeto. Você pode tentar mover um objeto Enorme ou menor. Se o objeto não estiver sendo usado ou carregado, você o move automaticamente até 9 metros em qualquer direção no alcance da magia.\nSe o objeto estiver sendo usado ou carregado por uma criatura, essa criatura deve ser bem-sucedida em uma salvaguarda de Força, ou você empurra o objeto para longe e o move até 9 metros em qualquer direção no alcance da magia.\nVocê pode exercer um controle preciso sobre objetos com sua pegada telecinética, como manipular uma ferramenta simples, abrir uma porta ou um recipiente, guardar ou retirar um item de um recipiente aberto, ou despejar o conteúdo de um frasco.\nTelepatia\n8º Círculo, Adivinhação (Mago)\nTempo de Conjuração: Ação\nAlcance: Ilimitado\nComponentes: V, S, M (um par de anéis de prata interligados)\nDuração: 24 horas\nVocê cria um elo telepático entre você e uma criatura voluntária com a qual está familiarizado. A criatura pode estar em qualquer lugar no mesmo plano de existência que você. A magia encerra se você ou o alvo não estiverem mais no mesmo plano.\nAté que a magia termine, você e o alvo podem compartilhar instantaneamente palavras, imagens, sons e outras mensagens sensoriais entre si através do elo, e o alvo o reconhece como a criatura com a qual está se comunicando. A magia permite que uma criatura compreenda o significado de suas palavras e quaisquer mensagens sensoriais que você enviar a ela.\nTeleporte\n7º Círculo, Invocação (Bardo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 3 metros\nComponentes: V\nDuração: Instantânea\nEsta magia transporta instantaneamente você e até oito criaturas voluntárias ou um único objeto à sua vista e no alcance da magia, para um destino à sua escolha. Se você escolher um objeto, ele deve ser Grande ou menor e não pode estar sendo segurado ou carregado por uma criatura involuntária.\nO destino que você escolheu deve ser de seu conhecimento e deve estar no mesmo plano de existência que você. Sua familiaridade com o destino determina se você chega lá com sucesso. O Mestre joga 1d100 e consulta a tabela Resultado do Teleporte e as explicações posteriores.\nResultado do Teleporte\nFamiliaridade\nAzar\nÁrea Similar\nFora do Alvo\nNo Alvo\nCírculo permanente\n—\n—\n—\n01–100\nObjeto associado\n—\n—\n—\n01–100\nMuito familiar\n01–05\n06–13\n14–24\n25–100\nVisto casualmente\n01–33\n34–43\n44–53\n54–100\nVisto uma vez\n01–43\n44–53\n54–73\n74–100\nDescrição\n01–43\n44–53\n54–74\n75–100\nDestino falso\n01–50\n51–100\n—\n—\nFamiliaridade. Aqui estão os significados dos termos na coluna Familiaridade da tabela:\n“Círculo permanente” significa um círculo de teleporte permanente cuja sequência de símbolos você conhece.\n“Objeto associado” significa que você possui um objeto retirado do destino desejado nos últimos seis meses, como um livro da biblioteca de um mago.\n“Muito familiar” é um lugar que você visitou com frequência, um lugar que você estudou cuidadosamente ou um lugar à sua vista ao conjurar a magia.\n“Visto casualmente” é um lugar que você já viu mais de uma vez, mas com o qual não está muito familiarizado.\n“Visto uma vez ou descrito” é um lugar que você já viu uma vez, possivelmente usando magia, ou um lugar que você conhece através da descrição de outra pessoa, talvez através de um mapa.\n“Destino falso” é um lugar que não existe. Talvez você tenha tentado visualizar o santuário de um inimigo, mas em vez disso viu uma ilusão, ou está tentando se teleportar para um local que não existe mais.\nAzar. A natureza imprevisível da magia resulta em uma jornada difícil. Cada criatura se teleportando (ou o objeto alvo) sofre 3d10 pontos de dano Energético, e o Mestre joga novamente a tabela para ver onde você parou (mais de um azar pode acontecer, causando dano a cada vez).\nÁrea Similar. Você e seu grupo (ou o objeto de destino) aparecem em uma área diferente que é visual ou tematicamente semelhante à área de destino. Você aparece no lugar semelhante mais próximo. Se você estiver indo para seu laboratório, por exemplo, pode aparecer no laboratório de outra pessoa na mesma cidade.\nFora do Alvo. Você e seu grupo (ou o objeto alvo) aparecem a 2d12 x 1,5 quilômetros da distância do destino em uma direção aleatória. Jogue 1d8 para a direção: 1, leste; 2, sudeste; 3, sul; 4, sudoeste; 5, oeste; 6, noroeste; 7, norte; ou 8, nordeste.\nNo Alvo. Você e seu grupo (ou o objeto alvo) aparecem onde você pretendia.\nTempestade da Vingança\n9º Círculo, Invocação (Druida)\nTempo de Conjuração: Ação\nAlcance: 1,5 km\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nUma nuvem de tempestade agitada se forma, centrada pela duração em um ponto no alcance da magia, se espalhando para um raio de 90 metros. Cada criatura sob a nuvem quando ela aparecer deve ser bem-sucedida em uma salvaguarda de Constituição ou sofre 2d6 pontos de dano Trovejante e tem a condição Surdo pela duração da magia.\nNo início de cada um dos seus turnos posteriores, a tempestade produz efeitos diferentes, conforme detalhado abaixo:\nTurno 2: Chuva ácida cai. Cada criatura e objeto sob a nuvem sofre 4d6 pontos de dano Ácido.\nTurno 3: Você convoca seis relâmpagos da nuvem para atingir seis criaturas ou objetos diferentes abaixo dela. Cada alvo realiza uma salvaguarda de Destreza, sofrendo 10d6 pontos de dano Elétrico se falhar ou metade desse dano em caso de sucesso.\nTurno 4: Chuva de pedras de granizo. Cada criatura sob a nuvem sofre 2d6 pontos de dano Contundente.\nTurnos 5-10: Rajadas de vento e chuva gelada surgem sob a nuvem. Cada criatura na área sofre 1d6 pontos de dano Gélido. Até que a magia termine, a área é Terreno Difícil e está Totalmente Obscurecida, ataques à distância com armas são impossíveis nela e ventos fortes sopram por toda a área.\nTempestade de Fogo\n7º Círculo, Evocação (Clérigo, Druida, Feiticeiro)\nTempo de Conjuração: Ação\nAlcance: 45 metros\nComponentes: V, S\nDuração: Instantânea\nUma tempestade de fogo aparece no alcance da magia. A área da tempestade consiste em até dez cubos de 3 metros, que você organiza como preferir. Cada Cubo deve ser contíguo a pelo menos um outro Cubo. Cada criatura na área realiza uma salvaguarda de Destreza, sofrendo 7d10 pontos de dano Ígneo se falhar, ou metade desse dano em caso de sucesso.\nObjetos inflamáveis na área que não estão sendo usados ou carregados entram em combustão.\nTempestade Glacial\n4º Círculo, Evocação (Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: 90 metros\nComponentes: V, S, M (uma luva)\nDuração: Instantânea\nGranizo cai em um Cilindro de 6 metros de raio e 12 metros de altura, centrado em um ponto no alcance da magia. Cada criatura no Cilindro realiza uma salvaguarda de Destreza. Se falhar, uma criatura sofre 2d10 pontos de dano Contundente e 4d6 pontos de dano Gélido, ou metade desse dano em caso de sucesso.\nPedras de granizo transformam o solo no Cilindro em Terreno Difícil até o final do seu próximo turno.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano Contundente aumenta em 1d10 para cada círculo de espaço de magia acima de 4.\nTempestade Radiante de Jallarzi\nCom sua magia Tempestade Radiante de Jallarzi, a Bruxa Jallarzi faz vrocks se arrependerem de deixar o Abismo.\n5º Círculo, Evocação (Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponente: V, S, M (uma pitada de fósforo)\nDuração: Concentração, até 1 minuto\nVocê desencadeia uma tempestade de luz intermitente e trovões furiosos em um Cilindro de 3 metros de raio e 12 metros de altura centrado em um ponto à sua vista e no alcance da magia. Enquanto estiverem nesta área, criaturas têm as condições Cego e Surdo, e não podem conjurar magias com um componente Verbal.\nQuando a tempestade aparece, cada criatura dentro dela realiza uma salvaguarda de Constituição, sofrendo 2d10 pontos de dano Radiante e 2d10 pontos de dano Trovejante se falhar, ou metade desse dano em caso de sucesso. Uma criatura também realiza essa salvaguarda quando entra na área da magia pela primeira vez em um turno ou termina o turno dela nela. Uma criatura realiza essa salvaguarda apenas uma vez por turno.\nUsando um Espaço de Magia de Círculo Superior. O dano Radiante e Trovejante aumentam em 1d10 para cada círculo de espaço de magia acima de 5.\nTentáculos Negros de Evard\nO Mago Evard invoca sua infame magia, os Tentáculos Negros de Evard, para ensinar uma lição aos bandidos imprudentes.\n4º Círculo, Invocação (Mago)\nTempo de Conjuração: Ação\nAlcance: 27 metros\nComponentes: V, S, M (um tentáculo)\nDuração: Concentração, até 1 minuto\nTentáculos pretos contorcendo-se enchem um quadrado de 6 metros de lados no chão à sua vista e no alcance da magia. Pela duração da magia, esses tentáculos transformam o terreno nessa área em Terreno Difícil.\nCada criatura nessa área realiza uma salvaguarda de Força. Se falhar, ela sofre 3d6 pontos de dano Contundente e tem a condição Contido até que a magia termine. Uma criatura também realiza essa salvaguarda se entrar na área ou terminar o turno nela. Uma criatura realiza essa salvaguarda apenas uma vez por turno.\nUma criatura Contida pode executar uma ação para realizar um teste de Força (Atletismo) contra a CD para evitar sua magia, encerrando a condição em si mesma em caso de sucesso.\nTerremoto\n8º Círculo, Transmutação (Clérigo, Druida, Feiticeiro)\nTempo de Conjuração: Ação\nAlcance: 150 metros\nComponentes: V, S, M (uma rocha rachada)\nDuração: Concentração, até 1 minuto\nEscolha um ponto no chão à sua vista e no alcance da magia. Pela duração da magia, um tremor intenso rasga o chão em um círculo de 30 metros de raio centrado neste ponto. O terreno é Terreno Difícil.\nAo conjurar esta magia e no final de cada um dos seus turnos pela duração da magia, cada criatura no chão na área realiza uma salvaguarda de Destreza. Se falhar, uma criatura tem a condição Caído e a Concentração dela é quebrada.\nVocê também pode causar os efeitos abaixo.\nEstruturas. O tremor causa 50 pontos de dano Contundente em qualquer estrutura em contato com o chão na área quando você conjura a magia e no final de cada um dos seus turnos até que a magia termine. Se uma estrutura é reduzida a 0 Pontos de Vida, ela desaba.\nUma criatura a uma distância de uma estrutura desabando igual à metade da altura da estrutura realiza uma salvaguarda de Destreza. Se falhar, a criatura sofre 12d6 pontos de dano Contundente, tem a condição Caído e é soterrada pelos escombros, exigindo um teste de Força (Atletismo) CD 20 como uma ação para escapar. Em caso de sucesso, a criatura recebe apenas metade do dano.\nFissuras. Um total de 1d6 fissuras se abrem na área da magia ao final do turno que você a conjura. Você escolhe os locais das fissuras, que não podem estar sob estruturas. Cada fissura tem 1d10 × 3 metros de profundidade e 3 metros de largura, e se estende de uma borda da área da magia para outra borda. Uma criatura no mesmo espaço que uma fissura deve ser bem-sucedida em uma salvaguarda de Destreza ou cai na fissura. Uma criatura bem-sucedida se move com a borda da fissura à medida que ela se abre.\nTerreno Alucinatório\n4º Círculo, Ilusão (Bardo, Bruxo, Druida, Mago)\nTempo de Conjuração: 10 minutos\nAlcance: 90 metros\nComponentes: V, S, M (um cogumelo)\nDuração: 24 horas\nVocê cria um terreno natural em um cubo de 45 metros de comprimento que possui a aparência, o som e o cheiro de outro tipo de terreno natural. Assim, campos abertos ou uma estrada podem ser moldados para se assemelhar a um pântano, colina, fenda ou algum outro terreno difícil ou intransitável. Uma lagoa pode ser formada para parecer um prado verdejante, um precipício como uma encosta suave ou um barranco pedregoso como uma estrada larga e plana. Criaturas, estruturas e equipamentos manufaturados dentro da área não são alterados.\nAs características táteis do terreno permanecem inalteradas, portanto, é provável que as criaturas que entram na área percebam a ilusão. Se a diferença não for evidente ao toque, uma criatura que examina a ilusão pode executar a ação Analisar para realizar um teste de Inteligência (Investigação) contra a CD para evitar sua magia, a fim de não acreditar nela. Se uma criatura perceber que o terreno é ilusório, ela vê uma imagem vaga sobreposta ao terreno real.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "toque-chocante",
    "name": "Toque Chocante",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Raios saltam de você em direção a uma criatura que você tenta tocar. Realize uma jogada de ataque mágico corpo a corpo contra o alvo. Em caso de acerto, o alvo sofre 1d8 pontos de dano Elétrico e não pode realizar Ataques de Oportunidade até o início do próximo turno dele.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d8 quando você atinge os níveis 5 (2d8), 11 (3d8) e 17 (4d8).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "toque-necrotico",
    "name": "Toque Necrótico",
    "level": 0,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Canalizando o frio da sepultura, realize um ataque mágico corpo a corpo contra um alvo no alcance da magia. Em caso de acerto, o alvo sofre 1d10 pontos de dano Necrótico e não pode recuperar Pontos de Vida até o final do seu próximo turno.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d10 quando você atinge os níveis 5 (2d10), 11 (3d10) e 17 (4d10).\nToque Vampírico\n3º Círculo, Necromancia (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nO toque da sua mão envolta em sombras pode sugar a força vital dos outros para curar suas feridas. Realize um ataque mágico corpo a corpo contra uma criatura no alcance da magia. Em caso de acerto, o alvo sofre 3d6 pontos de dano Necrótico e você recupera Pontos de Vida iguais à metade da quantidade do dano Necrótico causado.\nAté que a magia termine, você pode realizar o ataque novamente em cada um dos seus turnos como uma ação Usar Magia, atingindo a mesma criatura ou uma diferente.\nUsando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d6 para cada círculo de espaço de magia acima de 3.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "tranca-arcana",
    "name": "Tranca Arcana",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (pó de ouro no valor de 25 ou mais PO",
      "que a magia consome)"
    ],
    "duration": "Até ser dissipada",
    "classes": [
      "Mago"
    ],
    "description": "Você toca uma porta, janela, portão, contêiner ou escotilha fechada e a tranca magicamente pela duração da magia. Esta fechadura não pode ser destrancada por nenhum meio não mágico. Você e quaisquer criaturas que você designar ao conjurar a magia podem abrir e fechar o objeto apesar da tranca. Você também pode definir uma senha que, quando proferida a até 1,5 metro do objeto, o destranca por 1 minuto.\nTransição Planar\n7º Círculo, Invocação (Bruxo, Clérigo, Druida, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (uma haste de metal bifurcada no valor de 250 ou mais PO e sintonizada a um plano de existência)\nDuração: Instantânea\nVocê e até oito criaturas voluntárias que dão as mãos em um círculo são transportadas para um plano de existência diferente. Você pode especificar um destino-alvo em termos gerais, como a Cidade de Latão no Plano Elemental do Fogo ou o palácio de Dispater no segundo nível dos Nove Infernos, e você aparece dentro ou perto desse destino, conforme determinado pelo Mestre.\nComo alternativa, se você souber a sequência de símbolos de um círculo de teleporte em outro plano de existência, esta magia pode levá-lo a esse círculo. Se o círculo de teleporte for pequeno demais para caber todas as criaturas que você transportou, elas aparecem nos espaços desocupados mais próximos ao círculo.\nTransporte via Plantas\nO Transporte via Plantas e Passo Arbóreo transformam as árvores em uma rede de transporte.\n6º Círculo, Invocação (Druida)\nTempo de Conjuração: Ação\nAlcance: 3 metros\nComponentes: V, S\nDuração: 1 minuto\nEsta magia cria um elo mágico entre uma planta inanimada Grande ou maior no alcance da magia e outra planta, a qualquer distância, no mesmo plano de existência. Você deve ter visto ou tocado na planta-alvo pelo menos uma vez antes. Pela duração da magia, qualquer criatura pode entrar na planta-alvo e sair da planta-destino usando 1,5 metro de movimento.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "trovao",
    "name": "Trovão",
    "level": 0,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Bruxo",
      "Druida",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Cada criatura em uma Emanação de 1,5 metro originada em você deve ser bem-sucedida em uma salvaguarda de Constituição ou sofre 1d6 pontos de dano Trovejante. O som estrondoso da magia pode ser ouvido a até 30 metros de distância.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d6 quando você atinge os níveis 5 (2d6), 11 (3d6) e 17 (4d6).\nTsunami\n8º Círculo, Invocação (Druida)\nTempo de Conjuração: 1 minuto\nAlcance: 1,5 km\nComponentes: V, S\nDuração: Concentração, até 6 rodadas\nUma muralha de água surge em um ponto à sua escolha no alcance da magia. Você pode fazer a muralha com até 90 metros de comprimento, 90 metros de altura e 15 metros de espessura. A muralha permanece pela duração da magia.\nQuando a muralha aparece, cada criatura na área realiza uma salvaguarda de Força, sofrendo 6d10 pontos de dano Contundente se falhar, ou metade desse dano em caso de sucesso.\nNo início de cada um dos seus turnos após o aparecimento da muralha, ela se move 15 metros para longe de você, juntamente com quaisquer criaturas que estejam dentro dela. Qualquer criatura de tamanho Enorme ou menor dentro da muralha, ou cujo espaço a muralha adentre ao se mover, deve ser bem-sucedida em uma salvaguarda de Força ou sofre 5d10 pontos de dano Contundente. Uma criatura pode sofrer esse dano apenas uma vez por rodada. No final de cada turno, a altura da muralha é reduzida em 15 metros, e o dano que a muralha causa nas rodadas subsequentes é reduzido em 1d10. Quando a muralha atinge 0 metros de altura, a magia termina.\nUma criatura apanhada pela muralha pode se mover nadando. No entanto, devido à força da onda, a criatura deve ser bem-sucedida em um teste de Força (Atletismo) contra a CD para evitar sua magia para se mover. Se falhar no teste, ela não pode se mover. Uma criatura que sair da muralha cai no chão.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "turvar",
    "name": "Turvar",
    "level": 2,
    "school": "Ilusão",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Seu corpo fica desfocado. Pela duração da magia, qualquer criatura tem Desvantagem em jogadas de ataque contra você. Um atacante é imune a esse efeito se perceber você com Visão às Cegas ou Visão Verdadeira.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1538\" w:name=\"_qlhdkp69vio9\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1538\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>V",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-draconato-druida-usa-emaranhar-para-conter-gnolls-em-frenesi",
    "name": "Um draconato Druida usa Emaranhar para conter gnolls em frenesi.",
    "level": 1,
    "school": "Invocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "27 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Druida",
      "Guardião"
    ],
    "description": "Plantas agarradoras brotam do chão em um quadrado de 6 metros de lado no alcance da magia. Pela duração da magia, essas plantas transformam o terreno em Terreno Difícil. Elas desaparecem quando a magia termina.\nCada criatura (exceto você) na área quando você conjura a magia deve ser bem-sucedida em uma salvaguarda de Força ou tem a condição Contido até que a magia termine. Uma criatura Contida pode executar uma ação para realizar um teste de Força (Atletismo) contra a CD para evitar sua magia. Em caso de sucesso, ela se liberta das plantas agarradoras e não está mais Contida por elas.\nEncarnação Fantasmagórica\n9º Círculo, Ilusão (Bruxo, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nVocê tenta criar terrores ilusórios na mente dos outros. Cada criatura à sua escolha em uma Esfera de 9 metros de raio centrada em um ponto no alcance da magia realiza uma salvaguarda de Sabedoria. Se falhar, um alvo sofre 10d10 pontos de dano Psíquico e tem a condição Amedrontado pela duração da magia. Em caso de sucesso, um alvo recebe apenas metade do dano.\nUm alvo Amedrontado realiza uma salvaguarda de Sabedoria no final de cada um dos turnos dele. Se falhar, sofre 5d10 pontos de dano Psíquico. Em caso de sucesso, a magia se encerra naquele alvo.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-druida-humano-conjura-restauracao-menor-para-aliviar-o-sofrimento-de-um-amigo-que-foi-envenenado-em-batalha",
    "name": "Um Druida humano conjura Restauração Menor para aliviar o sofrimento de um amigo que foi envenenado em batalha.",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Toque",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo",
      "Clérigo",
      "Druida",
      "Guardião",
      "Paladino"
    ],
    "description": "Você toca uma criatura e remove uma condição: Cego, Envenenado, Paralisado ou Surdo.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-druida-humano-usa-falar-com-animais-para-conversar-com-seu-melhor-amigo-urso",
    "name": "Um Druida humano usa Falar com Animais para conversar com seu melhor amigo urso",
    "level": 1,
    "school": "Adivinhação",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "10 minutos",
    "classes": [
      "Bardo",
      "Bruxo",
      "Druida",
      "Guardião"
    ],
    "description": "Pela duração da magia, você pode compreender e se comunicar verbalmente com Feras, e pode usar com elas qualquer uma das opções de perícia da ação Influenciar.\nA maioria das Feras oferece pouca informação sobre assuntos que não estejam diretamente ligados à sobrevivência ou ao companheirismo mas, no mínimo, uma Fera pode fornecer informações sobre áreas vizinhas e monstros, incluindo o que percebeu no último dia.\nFalar com Mortos\n3º Círculo, Necromancia (Bardo, Clérigo, Mago)\nTempo de Conjuração: Ação\nAlcance: 3 metros\nComponentes: V, S, M (um incenso aceso)\nDuração: 10 minutos\nVocê confere uma aparência de vida a um cadáver à sua escolha que esteja no alcance da magia, permitindo que ele responda às perguntas que você fizer. O cadáver precisa ter boca, e a magia falha se a criatura morta era um Morto-Vivo quando pereceu ou se foi o alvo desta magia nos últimos 10 dias.\nAté que a magia termine, você pode fazer até cinco perguntas ao cadáver. O cadáver sabe apenas o que sabia em vida, incluindo os idiomas que conhecia. As respostas geralmente são breves, enigmáticas ou repetitivas, e o cadáver não tem obrigação de oferecer uma resposta verdadeira se você for hostil a ele ou se ele o reconhecer como um inimigo. Esta magia não devolve a alma da criatura ao corpo dela, apenas o espírito animado. Assim, o cadáver não pode aprender novas informações, não compreende nada do que aconteceu desde que morreu e não pode discorrer sobre eventos futuros.\nFalar com Plantas\n3º Círculo, Transmutação (Bardo, Druida, Guardião)\nTempo de Conjuração: Ação\nAlcance: Pessoal\nComponentes: V, S\nDuração: 10 minutos\nVocê imbuí plantas em uma Emanação imóvel de 9 metros com razão e intelecto limitado, permitindo que elas se comuniquem com você e sigam seus comandos simples. Você pode questionar as plantas sobre eventos na área da magia nas últimas 24 horas, obtendo informações sobre criaturas que passaram, clima e outras circunstâncias.\nAlém disso, você pode transformar Terreno Difícil causado pelo crescimento vegetal (como moitas e vegetação densa) em terreno comum pela duração da magia. Como alternativa, você pode transformar terreno comum onde há plantas em Terreno Difícil, também pela duração da magia.\nA magia não permite que as plantas se desloquem, mas elas podem mover seus galhos, cipós e caules para você.\nCaso haja uma criatura do tipo Planta na área, você pode se comunicar com ela como se compartilhassem um idioma em comum.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-gnomo-bardo-conjura-zombaria-perversa-para-aborrecer-um-kobold-com-insultos-magicos",
    "name": "Um gnomo Bardo conjura Zombaria Perversa para aborrecer um kobold com insultos mágicos.",
    "level": 0,
    "school": "Encantamento",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Bardo"
    ],
    "description": "Você libera uma série de insultos carregados com encantamentos sutis em uma criatura que pode ouvir você e que esteja à sua vista e no alcance da magia. O alvo deve ser bem-sucedido em uma salvaguarda de Sabedoria ou sofre 1d6 pontos de dano Psíquico e tem Desvantagem na próxima jogada de ataque que realizar antes do final do próximo turno dele.",
    "cantripUpgrade": "Aprimoramento de Truque. O dano aumenta em 1d6 quando você atinge os níveis 5 (2d6), 11 (3d6) e 17 (4d6).",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-golias-bruxo-convoca-a-armadura-de-agathys-e-os-bracos-de-hadar-para-combater-inimigos-das-profundezas",
    "name": "Um Golias Bruxo convoca a Armadura de Agathys e os Braços de Hadar para combater inimigos das profundezas.",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (um caco de vidro azul)"
    ],
    "duration": "1 hora",
    "classes": [
      "Bruxo"
    ],
    "description": "Um frio mágico protetor envolve você. Você recebe 5 Pontos de Vida Temporários. Se uma criatura acertar você com uma jogada de ataque corpo a corpo antes que a magia termine, a criatura sofre 5 pontos de dano Gélido. A magia encerra se você não tiver Pontos de Vida Temporários.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Os Pontos de Vida Temporários e o dano Gélido aumentam em 5 para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-golias-clerigo-conjura-arma-espiritual-em-batalha-contra-um-tribulo-brutal",
    "name": "Um Golias Clérigo conjura Arma Espiritual em batalha contra um Tríbulo Brutal.",
    "level": 2,
    "school": "Evocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação Bônus",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Clérigo"
    ],
    "description": "Você cria uma energia espectral flutuante que se assemelha a uma arma à sua escolha e permanece pela duração da magia.\nA energia aparece no alcance da magia em um espaço à sua escolha, e você pode realizar imediatamente um ataque mágico corpo a corpo contra uma criatura a até 1,5 metro dela. Em caso de acerto, o alvo sofre 1d8 pontos de dano Energético mais o seu modificador de atributo de conjuração.\nComo uma Ação Bônus em seus turnos posteriores, você pode mover a energia até 6 metros e repetir o ataque contra uma criatura a até 1,5 metro dela.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-humano-feiticeiro-repreende-carnicais-com-a-energia-imprevisivel-do-orbe-cromatico",
    "name": "Um humano Feiticeiro repreende carniçais com a energia imprevisível do Orbe Cromático.",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "27 metros",
    "components": [
      "V",
      "S",
      "M (um diamante no valor de 50 ou mais PO)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você arremessa um orbe de energia em um alvo no alcance da magia. Escolha Ácido, Elétrico, Gélido, Ígneo, Trovejante ou Venenoso para o tipo de orbe que você criar e, em seguida, realize um ataque mágico à distância contra o alvo. Em caso de acerto, o alvo sofre 3d8 pontos de dano do tipo escolhido.\nSe você jogar o mesmo número em dois ou mais dos dados d8, o orbe salta para outro alvo à sua escolha dentro de 9 metros do alvo. Realize uma jogada de ataque contra o novo alvo e realize uma nova jogada de dano. A esfera não pode saltar novamente, a menos que você conjure a magia usando um espaço de magia de 2º círculo ou superior.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 1. O orbe pode saltar um número máximo de vezes igual ao círculo do espaço de magia utilizado, e uma criatura pode ser atingida apenas uma vez por cada conjuração desta magia.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-mago-humano-afasta-o-perigo-com-a-armadura-arcana-e-os-raios-infaliveis-dos-misseis-magicos",
    "name": "Um Mago humano afasta o perigo com a Armadura Arcana e os raios infalíveis dos Mísseis Mágicos.",
    "level": 1,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (um pedaço de couro curtido)"
    ],
    "duration": "8 horas",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você toca uma criatura voluntária que não está usando armadura. Até que a magia termine, a CA base do alvo se torna 13 mais o modificador de Destreza dele. A magia se encerra se o alvo vestir uma armadura.\nArmadura de Agathys",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-mago-vermelho-de-thay-ordena-que-servos-esqueleticos-empilhem-tesouros-no-disco-do-disco-flutuante-de-tenser",
    "name": "Um Mago Vermelho de Thay ordena que servos esqueléticos empilhem tesouros no disco do Disco Flutuante de Tenser.",
    "level": 1,
    "school": "Invocação",
    "ritual": true,
    "concentration": false,
    "castingTime": "Ação ou Ritual",
    "range": "9 metros",
    "components": [
      "V",
      "S",
      "M (uma gota de mercúrio)"
    ],
    "duration": "1 hora",
    "classes": [
      "Mago"
    ],
    "description": "Esta magia cria um disco circular horizontal formado de energia com 1 metro de diâmetro e 2,5 centímetros de altura, que flutua a 1 metro do chão em um espaço desocupado à sua escolha, à sua vista e no alcance da magia. O disco permanece pela duração da magia e pode carregar até 225 quilos. Se mais peso for colocado sobre ele, a magia se encerra e tudo no disco cai no chão.\nO disco fica imóvel enquanto você estiver a até 6 metros dele. Se você se mover a mais de 6 metros de distância dele, o disco segue você, permanecendo a até 6 metros de distância. Ele pode atravessar terrenos irregulares, subir ou descer escadas, declives e afins, mas não pode atravessar uma mudança de elevação de 3 metros ou mais. Por exemplo, o disco não pode se mover através de um fosso de 3 metros de profundidade, nem poderia deixar tal fosso se fosse criado no fundo dele.\nSe você se mover a mais de 30 metros do disco (normalmente porque ele não pode se mover em torno de um obstáculo para segui-lo), a magia encerra.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-pequenino-bruxo-atinge-um-zumbi-com-o-arco-eletrico-do-raio-de-bruxa",
    "name": "Um pequenino Bruxo atinge um zumbi com o arco elétrico do Raio de Bruxa.",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": true,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S",
      "M (um galho atingido por um raio)"
    ],
    "duration": "Concentração, até 1 minuto",
    "classes": [
      "Bruxo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Um feixe de energia crepitante é lançado em direção a uma criatura no alcance da magia, formando um arco sustentado de relâmpago entre você e o alvo. Realize um ataque mágico à distância contra ele. Em caso de acerto, o alvo sofre 2d12 pontos de dano Elétrico.\nEm cada um dos seus turnos posteriores, você pode executar uma ação Bônus para causar 1d12 pontos de dano Elétrico automaticamente ao alvo, mesmo que o primeiro ataque tenha falhado.\nA magia encerra se o alvo estiver fora do alcance da magia ou se tiver Cobertura Total em relação a você.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano inicial aumenta em 1d12 para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "um-sprite-conjura-arte-druidica-para-fazer-as-flores-florescerem",
    "name": "Um sprite conjura Arte Druídica para fazer as flores florescerem.",
    "level": 0,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "9 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Druida"
    ],
    "description": "Sussurrando para os espíritos da natureza, você cria um dos seguintes efeitos no alcance da magia.\nBrincar com Fogo. Você acende ou apaga uma vela, uma tocha ou uma fogueira.\nEfeito Sensorial. Você cria um efeito sensorial inofensivo, como folhas caindo, fadas dançantes espectrais, uma brisa suave, o som de um animal ou o leve odor de gambá. O efeito deve caber em um Cubo de 1,5 metro de lado.\nFlorescimento. Você instantaneamente faz uma flor desabrochar, uma vagem se abrir ou um botão de folha se abrir.\nSensor Climático. Você cria um efeito sensorial minúsculo e inofensivo que prevê qual será o clima no local onde você está pelas próximas 24 horas. O efeito pode se manifestar como uma esfera dourada para céu claro, uma nuvem para chuva, flocos de neve caindo para neve e assim por diante. Esse efeito persiste por 1 rodada.\nAssassino Fantasmagórico\n4º Círculo, Ilusão (Bardo, Mago)\nTempo de Conjuração: Ação\nAlcance: 36 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nVocê entra nos pesadelos de uma criatura à sua vista e no alcance da magia e cria uma ilusão dos medos mais profundos dela, visíveis apenas para essa criatura. O alvo realiza uma salvaguarda de Sabedoria. Se falhar, o alvo sofre 4d10 pontos de dano Psíquico e tem Desvantagem em testes de atributo e jogadas de ataque pela duração da magia. Em caso de sucesso, o alvo sofre metade do dano e a magia encerra.\nPela duração da magia, o alvo realiza uma salvaguarda de Sabedoria no final de cada um dos turnos dele. Se falhar, sofre dano Psíquico novamente. Em caso de sucesso, a magia encerra.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d10 para cada círculo de espaço de magia acima de 4.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "uma-ana-paladina-fortalece-sua-arma-com-destruicao-divina-desencadeando-a-ira-sagrada-em-inferos-mezzoloths",
    "name": "Uma anã Paladina fortalece sua arma com Destruição Divina, desencadeando a ira sagrada em ínferos Mezzoloths.",
    "level": 1,
    "school": "Evocação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus, que você realiza imediatamente após acertar um alvo com uma arma Corpo a Corpo ou um Ataque Desarmado",
    "range": "Pessoal",
    "components": [
      "V"
    ],
    "duration": "Instantânea",
    "classes": [
      "Paladino"
    ],
    "description": "O alvo sofre 2d8 pontos de dano Radiante adicionais do ataque. O dano aumenta em 1d8 se o alvo for um Ínfero ou um Morto-vivo.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O dano aumenta em 1d8 para cada círculo de espaço de magia acima de 1.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "ver-o-invisivel",
    "name": "Ver o Invisível",
    "level": 2,
    "school": "Adivinhação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (uma pitada de talco)"
    ],
    "duration": "1 hora",
    "classes": [
      "Bardo",
      "Feiticeiro",
      "Mago"
    ],
    "description": "Pela duração da magia, você vê criaturas e objetos que têm a condição Invisível como se estivessem visíveis e pode ver o Plano Etéreo. Criaturas e objetos nele tem aparência fantasmagórica..\nVidência\nA magia Vidência ajuda um gnomo Bardo a manter contato com amigos e familiares em todo o mundo.\n5º Círculo, Adivinhação (Bardo, Bruxo, Clérigo, Druida, Mago)\nTempo de Conjuração: 10 minutos\nAlcance: Pessoal\nComponentes: V, S, M (um foco no valor de 1.000 ou mais PO, como uma bola de cristal, espelho ou fonte cheia de água)\nDuração: Concentração, até 10 minutos\nVocê pode ver e ouvir uma criatura que você escolheu e que está no mesmo plano de existência que você. O alvo realiza uma salvaguarda de Sabedoria, que é modificada (veja as tabelas abaixo) por quão bem você conhece o alvo e o tipo de conexão física que você tem com ele. O alvo não sabe contra o que está realizando a salvaguarda, apenas que se sente desconfortável.\nSeu Conhecimento do Alvo É...\nModificador\nDe segunda mão (ouviu falar do alvo)\n5\nDe primeira mão (conhece o alvo)\n0\nAmplo (conhece bem o alvo)\n-5\nVocê Possui Algo do Alvo…\nModificador\nRetrato ou outra imagem\n-2\nRoupa ou outra posse\n-4\nParte do corpo, mecha de cabelo ou pedaço de unha\n-10\nEm caso de sucesso, o alvo não é afetado e você não pode usar esta magia nele novamente por 24 horas.\nSe falhar, a magia cria um sensor Invisível e intangível a até 3 metros do alvo. Você pode ver e ouvir através do sensor como se estivesse lá. O sensor se move com o alvo, permanecendo a 3 metros dele pela duração da magia. Se algo puder ver o sensor, ele aparece como uma esfera luminosa do tamanho do seu punho.\nEm vez de uma criatura, você pode escolher um local que viu. Ao fazer isso, o sensor aparece nesse local e não se move.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "vigor-arcano",
    "name": "Vigor Arcano",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação Bônus",
    "range": "Pessoal",
    "components": [
      "V",
      "S"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você usa sua energia vital para se curar. Jogue um ou dois de seus Dados de Pontos de Vida não gastos e recupera um número de Pontos de Vida igual ao total do teste mais seu modificador de atributo de conjuração. Esses dados são, então, gastos.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O número de Dados de Vida não gastos que você pode jogar aumenta em um para cada círculo de espaço de magia acima de 2.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "vinculo-de-protecao",
    "name": "Vínculo de Proteção",
    "level": 2,
    "school": "Abjuração",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (um par de anéis de platina no valor de 50 ou mais PO cada",
      "que você e o alvo devem usar pela duração da magia)"
    ],
    "duration": "1 hora",
    "classes": [
      "Clérigo",
      "Paladino"
    ],
    "description": "Você toca outra criatura voluntária e cria uma conexão mística entre você e o alvo até que a magia termine. Enquanto o alvo estiver a até 18 metros de você, ele obtém um bônus de +1 na CA e nas salvaguardas e tem Resistência a todos os tipos de dano. Além disso, cada vez que ele sofrer dano, você sofre a mesma quantidade de dano.\nA magia se encerra se você for reduzido a 0 Pontos de Vida, se você e o alvo ficarem a mais de 18 metros de distância ou se for conjurada novamente em qualquer uma das criaturas conectadas.\nVinha Agarradora\n4º Círculo, Invocação (Druida, Guardião)\nTempo de Conjuração: Ação Bônus\nAlcance: 18 metros\nComponentes: V, S\nDuração: Concentração, até 1 minuto\nVocê conjura uma vinha que brota de uma superfície em um espaço desocupado à sua vista e no alcance da magia. A vinha permanece pela duração da magia.\nRealize um ataque mágico corpo a corpo contra uma criatura a até 9 metros da vinha. Em caso de acerto, o alvo sofre 4d8 pontos de dano Contundente e é puxado até 9 metros em direção à vinha; se o alvo for Enorme ou menor, ele tem a condição Imobilizado (CD para escapar é igual à sua CD para evitar sua magia). A vinha pode imobilizar apenas uma criatura de cada vez, e você pode fazer com que a vinha libere uma criatura Imobilizada (nenhuma ação é necessária).\nComo uma Ação Bônus em seus turnos posteriores, você pode repetir o ataque contra uma criatura a até 9 metros da vinha.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. O número de criaturas que a vinha pode imobilizar aumenta em um para cada círculo de espaço de magia acima de 4.\nVisão da Verdade\n6º Círculo, Adivinhação (Bardo, Bruxo, Clérigo, Feiticeiro, Mago)\nTempo de Conjuração: 1 ação\nAlcance: Toque\nComponentes: V, S, M (cogumelo em pó no valor de 25 ou mais PO, que a magia consome)\nDuração: 1 hora\nVocê toca uma criatura voluntária que recebe Visão Verdadeira com um alcance de 36 metros pela duração da magia.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "visao-no-escuro",
    "name": "Visão no Escuro",
    "level": 2,
    "school": "Transmutação",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Toque",
    "components": [
      "V",
      "S",
      "M (uma cenoura seca)"
    ],
    "duration": "8 horas",
    "classes": [
      "Druida",
      "Feiticeiro",
      "Guardião",
      "Mago"
    ],
    "description": "Pela duração da magia, uma criatura voluntária que você tocar tem Visão no Escuro com um alcance de 45 metros.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "vitalidade-vazia",
    "name": "Vitalidade Vazia",
    "level": 1,
    "school": "Necromancia",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "Pessoal",
    "components": [
      "V",
      "S",
      "M (uma gota de álcool)"
    ],
    "duration": "Instantânea",
    "classes": [
      "Feiticeiro",
      "Mago"
    ],
    "description": "Você obtém 2d4 + 4 Pontos de Vida Temporários.",
    "atHigherLevels": "Usando um Espaço de Magia de Círculo Superior. Você obtém 5 Pontos de Vida Temporários adicionais para cada círculo de espaço de magia acima de 1.\nVoo\n3º Círculo, Transmutação (Bruxo, Feiticeiro, Mago)\nTempo de Conjuração: Ação\nAlcance: Toque\nComponentes: V, S, M (uma pena)\nDuração: Concentração, até 10 minutos\nVocê toca uma criatura voluntária. Pela duração da magia, o alvo ganha um Deslocamento de Voo de 18 metros e pode pairar. Quando a magia termina, o alvo entra em queda se ainda estiver no alto, a menos que possa impedir a queda.\nUsando um Espaço de Magia de Círculo Superior. Você pode escolher uma criatura adicional para cada círculo de espaço de magia acima de 3.\n<w:left w:val=\"nil\"/><w:bottom w:val=\"nil\"/><w:right w:val=\"nil\"/><w:between w:val=\"nil\"/></w:pBdr><w:spacing w:after=\"0\"/><w:rPr><w:color w:val=\"000000\"/></w:rPr></w:pPr><w:bookmarkStart w:id=\"1548\" w:name=\"_y6t7xx6gnead\" w:colFirst=\"0\" w:colLast=\"0\"/><w:bookmarkEnd w:id=\"1548\"/><w:r><w:rPr><w:color w:val=\"000000\"/></w:rPr><w:lastRenderedPageBreak/><w:t>Z\nZombaria Perversa",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  },
  {
    "id": "zona-da-verdade",
    "name": "Zona da Verdade",
    "level": 2,
    "school": "Encantamento",
    "ritual": false,
    "concentration": false,
    "castingTime": "Ação",
    "range": "18 metros",
    "components": [
      "V",
      "S"
    ],
    "duration": "10 minutos",
    "classes": [
      "Bardo",
      "Clérigo",
      "Paladino"
    ],
    "description": "Você cria uma zona mágica que protege contra enganação em uma Esfera de 4,5 metros de raio centrada em um ponto no alcance da magia. Até que a magia termine, uma criatura que entra na área da magia pela primeira vez ou começa o turno dela nela realiza uma salvaguarda de Carisma. Se falhar, uma criatura não pode mentir deliberadamente enquanto estiver no raio de efeito. Você sabe se uma criatura é bem-sucedida ou falha nessa salvaguarda.\nUma criatura afetada está ciente da magia e pode evitar responder a perguntas às quais responderia normalmente com uma mentira. Tal criatura pode ser evasiva, mas deve ser verdadeira.\nApêndice A - O Multiverso\nEste apêndice oferece uma visão geral do multiverso, a realidade abrangente que engloba os inúmeros mundos e aventuras de D&D. Esses reinos são explorados em mais detalhes no Livro do Mestre, junto com outros planos como o Reino Distante, o Plano Negativo e o Plano Positivo.\nOs Reinos Materiais\nAs forças filosóficas e elementais da realidade convergem para criar os seguintes planos de existência:\nPlano Material. A maioria das aventuras de D&D ocorre no Plano Material, que contém os mundos de cenários como Dragonlance, Eberron, Forgotten Realms e Greyhawk. Também há espaço para qualquer mundo que seu grupo criar. Leis mágicas e físicas moldam os diversos mundos deste plano.\nFaéria. Este reino vibrante e idealizado transborda de vida e emoção, que são mais intensas nos reinos do Domínios do Deleite.\nSombral. Este reino assombrado pela escuridão contém terras sombrias, ruínas assombradas e os infames Domínios do Pavor.\nPlanos Transitivos\nOs planos transitivos servem como caminhos entre os planos:\nPlano Astral. Esta extensão infinita e prateada liga o Plano Material e os Planos Externos. Civilizações inteiras surgiram nesta vastidão cintilante, enquanto outras navegam pelo cosmos mágico em naus magipropelidas.\nPlano Etéreo. Este reino fantasmagórico conecta o Plano Material e os Planos Internos. A região onde o Plano Etéreo se sobrepõe a outros planos é chamada de Fronteira Etérea, um lugar onde as criaturas podem vislumbrar visões de planos afora.\nOs Planos Internos\nForças elementais e os blocos de construção da realidade se originam desses Planos Internos:\nPlano Elemental da Água. Este oceano sem fundo borbulha com misteriosa vida marinha.\nPlano Elemental da Terra. Este labirinto de cavernas serpenteia por meio de pedras e riquezas minerais incalculáveis.\nPlano Elemental do Ar. Ventos sopram nuvens e ilhas flutuantes através deste céu infinito.\nPlano Elemental do Fogo. Um inferno eterno, este reino arde com a vida em ilhas vulcânicas.\nCaos Elemental. Aqui, nas margens dos Planos Internos, forças elementais se chocam de forma imprevisível.\nPlanos Inter-Elementais. Nessas fronteiras entre os Planos Elementais, as forças elementais se combinam em reinos de cinzas, gelo, lama e magma.\nPlanos Externos\nReinos onde as ideias tomam forma e os espíritos passam suas pós-vidas, os Planos Externos são os lares dos imortais. Os seguintes locais compõem os Planos Externos:\nSigil. Sigil, a Cidade das Portas, é uma metrópole, não um plano central nos Planos Externos. Seus portais conectam-se a todo o multiverso e a enigmática Senhora da Dor assegura a ordem.\nOutros Planos Externos. Esses planos são apresentados na tabela Planos Externos. Alguns são paraísos, alguns são reinos de pesadelo e alguns são mais bizarros. Cada um é dominado por forças que incorporam um ou mais dos alinhamentos descritos no capítulo 2.\nTerras Além. Influências dos outros Planos Externos convergem nas Terras Além, onde portais levam a esses planos. No centro das Terras Além ergue-se o Pináculo, um pilar no topo onde flutua Sigil.\nPlanos Externos\nPlano Externo\nAlinhamento\nAbismo\nCaótico e Mau\nAqueronte\nOrdeiro e Mau, Ordeiro e Neutro\nArbórea\nCaótico e Bom\nArcádia\nOrdeiro e Bom, Ordeiro e Neutro\nBaator\nOrdeiro e Mau\nBitopia\nOrdeiro e Bom, Neutro e Bom\nCárceri\nCaótico e Mau, Neutro e Mau\nElísio\nNeutro e Bom\nGehenna\nOrdeiro e Mau, Neutro e Mau\nHades\nNeutro e Mau\nLimbo\nCaótico e Neutro\nMecânos\nOrdeiro e Neutro\nMonte Celéstia\nOrdeiro e Bom\nNove Infernos\nOrdeiro e Mau\nPandemônio\nCaótico e Mau, Caótico e Neutro\nTerras Além\nNeutro\nTerras Ferais\nCaótico e Bom, Neutro e Bom\nYsgard\nCaótico e Bom, Caótico e Neutro\nApêndice B\nBlocos de Estatísticas de Criaturas\nEste apêndice fornece blocos de estatísticas para criaturas mencionadas em outras partes do livro, particularmente nos capítulos de classe, equipamento e magia. Veja também o glossário de regras para saber como ler um bloco de estatísticas e o Livro dos Monstros para ainda mais criaturas.\nOs seguintes blocos de estatísticas são apresentados em ordem alfabética. Quando o Mestre usa um bloco de estatísticas, ele pode alterar os detalhes no bloco.\nAlce\nFera Grande, Sem Alinhamento\nCA 10\nIniciativa +0 (10)\nPV 11 (2d10)\nDeslocamento 15 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n16\n+3\n+3\nDes\n10\n+0\n+0\nCon\n11\n+0\n+0\nInt\n2\n-4\n-4\nSab\n10\n+0\n+0\nCar\n6\n-2\n-2\nPerícias Percepção +2\nSentidos Visão no Escuro 18 m, Percepção Passiva 12\nIdiomas —\nND 1/4 (XP 50; BP +2)\nAções\nCabeçada Aríete. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 6 (1d6 + 3) Contundente. Se o alce tiver se movido pelo menos 6 metros em linha reta em direção ao alvo imediatamente antes do ataque, o alvo sofre 3 (1d6) pontos de dano Contundente adicionais e, se for Enorme ou menor, tem a condição Caído.\nAranha\nFera Minúscula, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 1 (1d4 - 1)\nDeslocamento 6 m, Escalada 6 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n2\n-4\n-4\nDes\n14\n+2\n+2\nCon\n8\n-1\n-1\nInt\n1\n-5\n-5\nSab\n10\n+0\n+0\nCar\n2\n-4\n-4\nPerícias Furtividade +4\nSentidos Visão no Escuro 9 m, Percepção Passiva 10\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nAndar na Teia. A aranha ignora restrições de movimento causadas por teias e sabe a localização de qualquer outra criatura em contato com a mesma teia.\nEscalada de Aranha. A aranha pode escalar superfícies difíceis, inclusive ao longo de tetos, sem precisar realizar um teste de atributo.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 1 Perfurante mais 2 (1d4) Venenoso.\nAranha Gigante\nFera Grande, Sem Alinhamento\nCA 14\nIniciativa +3 (13)\nPV 26 (4d10 + 4)\nDeslocamento 9 m, Escalada 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n14\n+2\n+2\nDes\n16\n+3\n+3\nCon\n12\n+1\n+1\nInt\n2\n-4\n-4\nSab\n11\n+0\n+0\nCar\n4\n-3\n-3\nPerícias Furtividade +7, Percepção +4\nSentidos Visão no Escuro 18 m, Percepção Passiva 14\nIdiomas —\nND 1 (XP 200; BP +2)\nTraços\nAndar na Teia. A aranha ignora restrições de movimento causadas por teias e sabe a localização de qualquer outra criatura em contato com a mesma teia.\nEscalada de Aranha. A aranha pode escalar superfícies difíceis, inclusive ao longo de tetos, sem precisar realizar um teste de atributo.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 7 (1d8 + 3) Perfurante mais 7 (2d6) Venenoso.\nTeia (Recarga 5–6). Salvaguarda de Destreza: CD 13, uma criatura à vista da aranha a até 18 metros. Falha: O alvo tem a condição Contido até que a teia seja destruída (CA 10; PV 5; Vulnerabilidade a dano Ígneo; Imunidade a dano Psíquico e Venenoso).\nCabra\nFera Média, Sem Alinhamento\nCA 10\nIniciativa +0 (10)\nPV 4 (1d8)\nDeslocamento 12 m, Escalada 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n11\n+0\n+0\nDes\n10\n+0\n+0\nCon\n11\n+0\n+0\nInt\n2\n-4\n-4\nSab\n10\n+0\n+0\nCar\n5\n-3\n-3\nPerícias Percepção +2\nSentidos Visão no Escuro 18 m, Percepção Passiva 12\nIdiomas —\nND 0 (XP 10; BP +2)\nAções\nCabeçada Aríete. Jogada de Ataque Corpo a Corpo: +2 para acertar, alcance 1,5 m. Dano: 1 Contundente, ou a cabra causa 2 (1d4) Contundente se ela tiver se movido pelo menos 6 metros em linha reta na direção do alvo imediatamente antes do ataque.\nCabra Gigante\nFera Grande, Sem Alinhamento\nCA 11\nIniciativa +1 (11)\nPV 19 (3d10 + 3)\nDeslocamento 12 m, Escalada 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n17\n+3\n+3\nDes\n13\n+1\n+1\nCon\n12\n+1\n+1\nInt\n3\n-4\n-4\nSab\n12\n+1\n+1\nCar\n6\n-2\n-2\nPerícias Percepção +3\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 1/2 (XP 100; BP +2)\nAções\nCabeçada Aríete. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 6 (1d6 + 3) Contundente. Se a cabra tiver se movido pelo menos 6 metros em linha reta em direção ao alvo imediatamente antes do ataque, o alvo sofre 5 (2d4) pontos de dano Contundente adicionais e, se for Enorme ou menor, tem a condição Caído.\nCamelo\nFera Grande, Sem Alinhamento\nCA 10\nIniciativa -1 (9)\nPV 17 (2d10 + 6)\nDeslocamento 15 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n15\n+2\n+2\nDes\n8\n-1\n-1\nCon\n17\n+3\n+3\nInt\n2\n-4\n-4\nSab\n11\n+0\n+0\nCar\n5\n-3\n-3\nSentidos Visão no Escuro 18 m, Percepção Passiva 10\nIdiomas —\nND 1/8 (XP 25; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 4 (1d4 + 2) Contundente.\nCaranguejo\nFera Minúscula, Sem Alinhamento\nCA 11\nIniciativa +0 (10)\nPV 3 (1d4 + 1)\nDeslocamento 6 m, Natação 6 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n6\n-2\n-2\nDes\n11\n+0\n+0\nCon\n12\n+1\n+1\nInt\n1\n-5\n-5\nSab\n8\n-1\n-1\nCar\n2\n-4\n-4\nPerícias Furtividade +2\nSentidos Visão às Cegas 9 m, Percepção Passiva 9\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nAnfíbio. O caranguejo pode respirar ar e água.\nAções\nGarra. Jogada de Ataque Corpo a Corpo: +2 para acertar, alcance 1,5 m. Dano: 1 Contundente.\nCaranguejo Gigante\nFera Média, Sem Alinhamento\nCA 15\nIniciativa +1 (11)\nPV 13 (3d8)\nDeslocamento 9 m, Natação 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n13\n+1\n+1\nDes\n13\n+1\n+1\nCon\n11\n+0\n+0\nInt\n1\n-5\n-5\nSab\n9\n-1\n-1\nCar\n3\n-4\n-4\nPerícias Furtividade +3\nSentidos Visão às Cegas 9 m, Percepção Passiva 9\nIdiomas —\nND 1/8 (XP 25; BP +2)\nTraços\nAnfíbio. O caranguejo pode respirar ar e água.\nAções\nGarra. Jogada de Ataque Corpo a Corpo: +3 para acertar, alcance 1,5 m. Dano: 4 (1d6 + 1) Contundente. Se o alvo for Médio ou menor, ele tem a condição Imobilizado (CD 11 para escapar). O caranguejo tem duas garras, cada uma das quais pode agarrar um alvo.\nCavalo de Carga\nFera Grande, Sem Alinhamento\nCA 10\nIniciativa +0 (10)\nPV 15 (2d10 + 4)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n18\n+4\n+4\nDes\n10\n+0\n+0\nCon\n15\n+2\n+2\nInt\n2\n-4\n-4\nSab\n11\n+0\n+0\nCar\n7\n-2\n-2\nSentidos Percepção Passiva 10\nIdiomas —\nND 1/4 (XP 50; BP +2)\nAções\nCascos. Jogada de Ataque Corpo a Corpo: +6 para acertar, alcance 1,5 m. Dano: 6 (1d4 + 4) Contundente.\nCavalo de Guerra\nFera Grande, Sem Alinhamento\nCA 11\nIniciativa +1 (11)\nPV 19 (3d10 + 3)\nDeslocamento 18 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n18\n+4\n+4\nDes\n12\n+1\n+1\nCon\n13\n+1\n+1\nInt\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n7\n-2\n-2\nSentidos Percepção Passiva 11\nIdiomas —\nND 1/2 (XP 100; BP +2)\nAções\nCascos. Jogada de Ataque Corpo a Corpo: +6 para acertar, alcance 1,5 m. Dano: 9 (2d4 + 4) Contundente. Se o cavalo tiver se movido pelo menos 6 metros em linha reta em direção ao alvo imediatamente antes do ataque, o alvo sofre 5 (2d4) pontos de dano Contundente adicionais e, se for Enorme ou menor, tem a condição Caído.\nCavalo de Montaria\nFera Grande, Sem Alinhamento\nCA 11\nIniciativa +1 (11)\nPV 13 (2d10 + 2)\nDeslocamento 18 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n16\n+3\n+3\nDes\n13\n+1\n+1\nCon\n12\n+1\n+1\nInt\n2\n-4\n-4\nSab\n11\n+0\n+0\nCar\n7\n-2\n-2\nSentidos Percepção Passiva 10\nIdiomas —\nND 1/4 (XP 50; BP +2)\nAções\nCascos. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 7 (1d8 + 3) Contundente.\nCavalo Marinho Gigante\nFera Grande, Sem Alinhamento\nCA 14\nIniciativa +1 (11)\nPV 16 (3d10)\nDeslocamento 1,5 m, Natação 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n15\n+2\n+2\nDes\n12\n+1\n+1\nCon\n11\n+0\n+0\nInt\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n5\n-3\n-3\nSentidos Percepção Passiva 11\nIdiomas —\nND 1/2 (XP 100; BP +2)\nTraços\nRespirar na Água. O cavalo-marinho só pode respirar debaixo d'água.\nAções\nCabeçada Aríete. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 9 (2d6 + 2) Contundente ou o cavalo-marinho causa 11 (2d8 + 2) pontos de dano Contundente se ele tiver se movido pelo menos 6 metros em linha reta na direção do alvo imediatamente antes do ataque.\nAções Bônus\nPropulsão. Enquanto estiver debaixo d'água, o cavalo-marinho se move até metade do seu Deslocamento de Natação sem provocar Ataques de Oportunidade.\nCobra Constritora\nFera Grande, Sem Alinhamento\nCA 13\nIniciativa +2 (12)\nPV 13 (2d10 + 2)\nDeslocamento 9 m, Natação 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n15\n+2\n+2\nDes\n14\n+2\n+2\nCon\n12\n+1\n+1\nInt\n1\n-5\n-5\nSab\n10\n+0\n+0\nCar\n3\n-4\n-4\nPerícias Furtividade +4, Percepção +2\nSentidos: Visão às Cegas 3 m, Percepção Passiva 12\nIdiomas —\nND 1/4 (XP 50; BP +2)\nAções\nConstrição. Salvaguarda de Força: CD 12, uma criatura Média ou menor à vista da cobra a até 1,5 metro. Falha: 7 (3d4) pontos de dano Contundente, e o alvo tem a condição Imobilizado (CD 12 para escapar).\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 6 (1d8 + 2) Perfurante.\nCobra Peçonhenta\nFera Minúscula, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 5 (2d4)\nDeslocamento 9 m, Natação 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n2\n-4\n-4\nDes\n15\n+2\n+2\nCon\n11\n+0\n+0\nInt\n1\n-5\n-5\nSab\n10\n+0\n+0\nCar\n3\n-4\n-4\nSentidos Visão às Cegas 3 m, Percepção Passiva 10\nIdiomas —\nND 1/8 (XP 25; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 4 (1d4 + 2) Perfurante mais 3 (1d6) Venenoso.\nCoruja\nFera Minúscula, Sem Alinhamento\nCA 11\nIniciativa +1 (11)\nPV 1 (1d4 - 1)\nDeslocamento 1,5 m, Voo 18 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n3\n-4\n-4\nDes\n13\n+1\n+1\nCon\n8\n-1\n-1\nInt\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n7\n-2\n-2\nPerícias Furtividade +5, Percepção +5\nSentidos Visão no Escuro 36 m, Percepção Passiva 15\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nSobrevoo. A coruja não provoca Ataques de Oportunidade ao voar para fora do alcance de um inimigo.\nAções\nGarras. Jogada de Ataque Corpo a Corpo: +3 para acertar, alcance 1,5 m. Dano: 1 Cortante.\nCorvo\nFera Minúscula, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 2 (1d4)\nDeslocamento 3 m, Voo 15 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n2\n-4\n-4\nDes\n14\n+2\n+2\nCon\n10\n+0\n+0\nInt\n5\n-3\n-3\nSab\n13\n+1\n+1\nCar\n6\n-2\n-2\nPerícias Percepção +3\nSentidos Percepção Passiva 13\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nMímica. O corvo pode imitar sons simples que ouviu, como um sussurro ou piado. Um ouvinte pode discernir que os sons são imitações com um teste bem-sucedido de Sabedoria (Intuição) CD 10.\nAções\nBico. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 1 Perfurante.\nCrocodilo\nFera Grande, Sem Alinhamento\nCA 12\nIniciativa +0 (10)\nPV 13 (2d10 + 2)\nDeslocamento 6 m, Natação 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n15\n+2\n+2\nDes\n10\n+0\n+0\nCon\n13\n+1\n+1\nInt\n2\n-4\n-4\nSab\n10\n+0\n+0\nCar\n5\n-3\n-3\nPerícias Furtividade +2\nSentidos Percepção Passiva 10\nIdiomas —\nND 1/2 (XP 100; BP +2)\nTraços\nPrender a Respiração. O crocodilo pode prender a respiração por 1 hora.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 6 (1d8 + 2) Perfurante. Se o alvo for Médio ou menor, ele tem a condição Imobilizado (CD 12 para escapar). Enquanto estiver Imobilizado, o alvo tem a condição Contido.\nDiabrete\nÍnfero Minúsculo (Diabo), Ordeiro e Mau\nCA 13\nIniciativa +3 (13)\nPV 21 (6d4 + 6)\nDeslocamento 6 m, Voo 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n6\n-2\n-2\nDes\n17\n+3\n+3\nCon\n13\n+1\n+1\nInt\n11\n+0\n+0\nSab\n12\n+1\n+1\nCar\n14\n+2\n+2\nPerícias Enganação +4, Furtividade +5, Intuição +3\nResistências Gélido\nImunidades Ígneo, Venenoso; Envenenado\nSentidos Visão no Escuro 36 m, Percepção Passiva 11\nIdiomas Comum, Infernal\nND 1 (XP 200; BP +2)\nTraços\nResistência à Magia. O diabrete tem Vantagem em salvaguardas contra magias e outros efeitos mágicos.\nVisão Diabólica. Escuridão Mágica não impede a Visão no Escuro do diabrete.\nAções\nAlterar Forma. O diabrete se multimorfa em uma forma que se assemelha a uma aranha (Deslocamento 6 m, Escalada 6 m), um corvo (6 m, Voo 18 m) ou um rato (6 m), ou ele retorna à sua verdadeira forma. Suas estatísticas são as mesmas em cada forma, exceto por seu Deslocamento. Qualquer equipamento que esteja usando ou carregando não é transformado. O diabrete reverte para sua verdadeira forma se morrer.\nFerroada. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 6 (1d6 + 3) Perfurante mais 7 (2d6) Venenoso.\nInvisibilidade. O diabrete conjura Invisibilidade em si, não exigindo componentes de magia e usando Carisma como atributo de conjuração.\nDoninha\nFera Minúscula, Sem Alinhamento\nCA 13\nIniciativa +3 (13)\nPV 1 (1d4 - 1)\nDeslocamento 9 m, Escalada 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n3\n-4\n-4\nDes\n16\n+3\n+3\nCon\n8\n-1\n-1\nInt\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n3\n-4\n-4\nPerícias Acrobacia +5, Furtividade +5, Percepção +3\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 0 (XP 10; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 1 Perfurante.\nDoninha Gigante\nFera Média, Sem Alinhamento\nCA 13\nIniciativa +3 (13)\nPV 9 (2d8)\nDeslocamento 12 m, Escalada 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n11\n+0\n+0\nDes\n17\n+3\n+3\nCon\n10\n+0\n+0\nInt\n4\n-3\n-3\nSab\n12\n+1\n+1\nCar\n5\n-3\n-3\nPerícias Acrobacia +5, Furtividade +5, Percepção +3\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 1/8 (XP 25; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 5 (1d4 + 3) Perfurante.\nElefante\nFera Enorme, Sem Alinhamento\nCA 12\nIniciativa -1 (9)\nPV 76 (8d12 + 24)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n22\n+6\n+6\nDes\n9\n-1\n-1\nCon\n17\n+3\n+3\nInt\n3\n-4\n-4\nSab\n11\n+0\n+0\nCar\n6\n-2\n-2\nSentidos Percepção Passiva 10\nIdiomas —\nND 4 (XP 1.100; BP +2)\nAções\nAtaques Múltiplos. O elefante realiza dois ataques usando Investida.\nInvestida. Jogada de Ataque Corpo a Corpo: +8 para acertar, alcance 1,5 m. Dano: 15 (2d8 + 6) Perfurante. Se o elefante tiver se movido pelo menos 6 metros em linha reta em direção ao alvo imediatamente antes do ataque, o alvo também tem a condição Caído.\nAções Bônus\nPisão. Salvaguarda de Destreza: CD 16, uma criatura a até 1,5 metro que tem a condição Caído. Falha: 17 (2d10 +6) pontos de dano Contundente. Sucesso: Metade do dano.\nEscorpião\nFera Minúscula, Sem Alinhamento\nCA 11\nIniciativa +0 (10)\nPV 1 (1d4 - 1)\nDeslocamento 3 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n2\n-4\n-4\nDes\n11\n+0\n+0\nCon\n8\n-1\n-1\nInt\n1\n-5\n-5\nSab\n8\n-1\n-1\nCar\n2\n-4\n-4\nSentidos Visão às Cegas 3 m, Percepção Passiva 9\nIdiomas —\nND 0 (XP 10; BP +2)\nAções\nFerroada. Jogada de Ataque Corpo a Corpo: +2 para acertar, alcance 1,5 m. Dano: 1 Perfurante mais 3 (1d6) Venenoso.\nEsfinge Maravilhosa\nCelestial Minúsculo, Ordeiro e Bom\nCA 13\nIniciativa +3 (13)\nPV 24 (7d4 + 7)\nDeslocamento 6 m, Voo 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n6\n-2\n-2\nDes\n17\n+3\n+3\nCon\n13\n+1\n+1\nInt\n15\n+2\n+2\nSab\n12\n+1\n+1\nCar\n11\n+0\n+0\nPerícias Arcanismo +4, Furtividade +5, Religião +4\nResistências Necrótico, Psíquico, Radiante\nSentidos Visão no Escuro 18 m, Percepção Passiva 11\nIdiomas Celestial, Comum\nND 1 (XP 200; BP +2)\nTraços\nResistência à Magia. A esfinge tem Vantagem em salvaguardas contra magias e outros efeitos mágicos.\nAções\nDilacerar. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 5 (1d4 + 3) Cortante mais 7 (2d6) Radiante.\nReações\nAmpliar Engenhosidade (2/Dia). Gatilho: A esfinge ou outra criatura a até 9 metros realiza um teste de atributo ou uma salvaguarda. Resposta: A esfinge adiciona 2 ao resultado.\nEsqueleto\nMorto-Vivo Médio, Ordeiro e Mau\nCA 13\nIniciativa +3 (13)\nPV 13 (2d8 + 4)\nDeslocamento 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n10\n+0\n+0\nDes\n16\n+3\n+3\nCon\n15\n+2\n+2\nInt\n6\n-2\n-2\nSab\n8\n-1\n-1\nCar\n5\n-3\n-3\nVulnerabilidades Contundente\nImunidades Venenoso; Envenenado, Exaustão\nEquipamento Arco Curto, Espada Curta\nSentidos Visão no Escuro 18 m, Percepção Passiva 9\nIdiomas Compreende os idiomas que conhecia em vida, mas não consegue falar\nND 1/4 (XP 50; BP +2)\nAções\nArco Curto. Jogada de Ataque à Distância: +5 para acertar, alcance 24/96 m. Dano: 6 (1d6 + 3) Perfurante.\nEspada Curta. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 6 (1d6 + 3) Perfurante.\nGato\nFera Minúscula, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 2 (1d4)\nDeslocamento 12 m, Escalada 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n3\n-4\n-4\nDes\n15\n+2\n+4\nCon\n10\n+0\n+0\nInt\n3\n-4\n-4\nSab\n12\n+1\n+1\nCar\n7\n-2\n-2\nPerícias Furtividade +4, Percepção +3\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nSaltador. A distância de salto do gato é determinada usando a Destreza em vez da Força.\nAções\nArranhar. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 1 Cortante.\nGavião\nFera Minúscula, Sem Alinhamento\nCA 13\nIniciativa +3 (13)\nPV 1 (1d4 - 1)\nDeslocamento 3 m, Voo 18 m\nMod\nSG\nMod\nSG\nMod\nSG\nPara\n5\n-3\n-3\nDes\n16\n+3\n+3\nCon\n8\n-1\n-1\nInt\n2\n-4\n-4\nSab\n14\n+2\n+2\nCar\n6\n-2\n-2\nPerícias Percepção +6\nSentidos Percepção Passiva 16\nIdiomas —\nND 0 (XP 10; BP +2)\nAções\nGarras. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 1 Cortante.\nGorila\nFera Média, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 19 (3d8 + 6)\nDeslocamento 9 m, Escalada 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n16\n+3\n+3\nDes\n14\n+2\n+2\nCon\n14\n+2\n+2\nInt\n6\n-2\n-2\nSab\n12\n+1\n+1\nCar\n7\n-2\n-2\nPerícias Atletismo +5, Percepção +3\nSentidos Percepção Passiva 13\nIdiomas —\nND 1/2 (XP 100; BP +2)\nAções\nAtaques Múltiplos. O gorila realiza dois ataques usando Punho.\nPunho. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 5 (1d4 + 3) Contundente.\nRocha (Recarga 6). Jogada de Ataque à Distância: +5 para acertar, alcance 7,5/15 m. Dano: 10 (2d6 + 3) Contundente.\nJavali\nFera Média, Sem Alinhamento\nCA 11\nIniciativa +0 (10)\nPV 13 (2d8 + 4)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n13\n+1\n+1\nDes\n11\n+0\n+0\nCon\n14\n+2\n+2\nInt\n2\n-4\n-4\nSab\n9\n-1\n-1\nCar\n5\n-3\n-3\nSentidos Percepção Passiva 9\nIdiomas —\nND 1/4 (XP 50; BP +2)\nTraços\nFúria Sangrenta. Enquanto estiver Sangrando, o javali tem Vantagem em jogadas de ataque.\nAções\nInvestida. Jogada de Ataque Corpo a Corpo: +3 para acertar, alcance 1,5 m. Dano: 4 (1d6 + 1) Perfurante. Se o javali tiver se movido pelo menos 6 metros em linha reta em direção ao alvo imediatamente antes do ataque, o alvo sofre 3 (1d6) pontos de dano Perfurante adicionais e, se for Grande ou menor, tem a condição Caído.\nLagarto\nFera Minúscula, Sem Alinhamento\nCA 10\nIniciativa +0 (10)\nPV 2 (1d4)\nDeslocamento 6 m, Escalada 6 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n2\n-4\n-4\nDes\n11\n+0\n+0\nCon\n10\n+0\n+0\nInt\n1\n-5\n-5\nSab\n8\n-1\n-1\nCar\n3\n-4\n-4\nSentidos Visão no Escuro 9 m, Percepção Passiva 9\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nEscalada de Aranha. O lagarto pode escalar superfícies difíceis, inclusive ao longo de tetos, sem precisar realizar um teste de atributo.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +2 para acertar, alcance 1,5 m. Dano: 1 Perfurante.\nLeão\nFera Grande, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 22 (4d10)\nDeslocamento 15 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n17\n+3\n+3\nDes\n15\n+2\n+2\nCon\n11\n+0\n+0\nInt\n3\n-4\n-4\nSab\n12\n+1\n+1\nCar\n8\n-1\n-1\nPerícias Furtividade +4, Percepção +3\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 1 (XP 200; BP +2)\nTraços\nSalto com Impulso. Ao se deslocar pelo menos 3 metros, o leão pode realizar um Salto em Distância de até 7,5 metros.\nTáticas de Grupo. O leão tem Vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do leão está a até 1,5 metro da criatura e o aliado não tem a condição Incapacitado.\nAções\nAtaques Múltiplos. O leão realiza dois ataques usando Dilacerar. Ele pode substituir um desses ataques pelo uso de Rugido.\nDilacerar. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 7 (1d8 + 3) Cortante.\nRugido. Salvaguarda de Sabedoria: CD 11, uma criatura a até 4,5 metros. Falha: O alvo tem a condição Amedrontado até o início do próximo turno do leão.\nLobo\nFera Média, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 11 (2d8 + 2)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n14\n+2\n+2\nDes\n15\n+2\n+2\nCon\n12\n+1\n+1\nInt\n3\n-4\n-4\nSab\n12\n+1\n+1\nCar\n6\n-2\n-2\nPerícias Furtividade +4, Percepção +5\nSentidos Visão no Escuro 18 m, Percepção Passiva 15\nIdiomas —\nND 1/4 (XP 50; BP +2)\nTraços\nTáticas de Grupo. O lobo tem Vantagem em jogadas de ataque contra uma criatura se pelo menos um dos aliados do lobo está a até 1,5 metro da criatura e o aliado não tem a condição Incapacitado.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 5 (1d6 + 2) Perfurante e o alvo tem a condição Caído se for Médio ou menor.\nLobo Atroz\nFera Grande, Sem Alinhamento\nCA 14\nIniciativa +2 (12)\nPV 22 (3d10 + 6)\nDeslocamento 15 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n17\n+3\n+3\nDes\n15\n+2\n+2\nCon\n15\n+2\n+2\nInt\n3\n-4\n-4\nSab\n12\n+1\n+1\nCar\n7\n-2\n-2\nPerícias Furtividade +4, Percepção +5\nSentidos Visão no Escuro 18 m, Percepção Passiva 15\nIdiomas —\nND 1 (XP 200; BP +2)\nTraços\nTáticas de Grupo. O lobo tem Vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do lobo está a até 1,5 metro da criatura e o aliado não tem a condição Incapacitado.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 8 (1d10 + 3) Perfurante, e o alvo tem a condição Caído se for Enorme ou menor.\nMastim\nFera Média, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 5 (1d8 + 1)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n13\n+1\n+1\nDes\n14\n+2\n+2\nCon\n12\n+1\n+1\nInt\n3\n-4\n-4\nSab\n12\n+1\n+1\nCar\n7\n-2\n-2\nPerícias Percepção +5\nSentidos Visão no Escuro 18 m, Percepção Passiva 15\nIdiomas —\nND 1/8 (XP 25; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +3 para acertar, alcance 1,5 m. Dano: 4 (1d6 + 1) Perfurante, e o alvo tem a condição Caído se for Grande ou menor.\nMorcego\nFera Minúscula, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 1 (1d4 - 1)\nDeslocamento 1,5 m, Voo 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n2\n-4\n-4\nDes15\n+2\n+2 Con\n8\n-1\n-1\n<w:tcPr><w:tcW w:w=\"417\" w:type=\"pct\"/></w:tcPr><w:p w14:paraId=\"741D49B0\" w14:textId=\"77777777\" w:rsidR=\"000106B3\" w:rsidRDefault=\"000106B3\"/></w:tc></w:tr><w:tr w:rsidR=\"000106B3\" w14:paraId=\"18315FE4\" w14:textId=\"77777777\" w:rsidTr=\"00BA747E\"><w:trPr><w:jc w:val=\"center\"/></w:trPr><w:tc><w:tcPr><w:tcW w:w=\"417\" w:type=\"pct\"/></w:tcPr><w:p w14:paraId=\"0FC2FC01\" w14:textId=\"77777777\" w:rsidR=\"000106B3\" w:rsidRDefault=\"00000000\"><w:proofErr w:type=\"spellStart\"/><w:r><w:rPr><w:b/></w:rPr><w:t>Int\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n4\n-3\n-3\nSentidos Visão às Cegas 18 m, Percepção Passiva 11\nIdiomas —\nND 0 (XP 10; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 1 Perfurante.\nMula\nFera Média, Sem Alinhamento\nCA 10\nIniciativa +0 (10)\nPV 11 (2d8 + 2)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n14\n+2\n+2\nDes\n10\n+0\n+0\nCon\n13\n+1\n+1\nInt\n2\n-4\n-4\nSab\n10\n+0\n+0\nCar\n5\n-3\n-3\nSentidos Percepção Passiva 10\nIdiomas —\nND 1/8 (XP 25; BP +2)\nTraços\nAnimal de Carga. A mula conta como um tamanho maior para determinar sua capacidade de carga.\nAções\nCascos. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 4 (1d4 + 2) Contundente.\nPantera\nFera Média, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 13 (3d8)\nDeslocamento 15 m, Escalada 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n14\n+2\n+2\nDes\n15\n+2\n+2\nCon\n10\n+0\n+0\nInt\n3\n-4\n-4\nSab\n14\n+2\n+2\nCar\n7\n-2\n-2\nPerícias Furtividade +6, Percepção +4\nSentidos Visão no Escuro 18 m, Percepção Passiva 14\nIdiomas —\nND 1/4 (XP 50; BP +2)\nAções\nAtaques Múltiplos. A pantera realiza um ataque usando Bote e usa Rondar.\nBote. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 4 (1d4 + 2) Cortante, ou a pantera causa 7 (2d4 + 2) pontos de dano Cortante se teve Vantagem na jogada de ataque.\nRondar. A pantera se move até metade do seu Deslocamento sem provocar Ataques de Oportunidade. No final deste movimento, a pantera pode executar a ação Esconder.\nPolvo\nFera Pequena, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 3 (1d6)\nDeslocamento 1,5 m, Natação 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n4\n-3\n-3\nDes\n15\n+2\n+2\nCon\n11\n+0\n+0\nInt\n3\n-4\n-4\nSab\n10\n+0\n+0\nCar\n4\n-3\n-3\nPerícias Furtividade +6, Percepção +2\nSentidos Visão no Escuro 9 m, Percepção Passiva 12\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nCompressão. O polvo pode se mover por um espaço tão estreito quanto 2,5 cm sem gastar movimento adicional para fazê-lo.\nRespirar na Água. O polvo só pode respirar debaixo d'água.\nAções\nTentáculos. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 1 Contundente.\nReações\nNuvem de Tinta (1/Dia). Gatilho: Uma criatura termina o turno a até 1,5 metro do polvo enquanto estiver debaixo d 'água. Resposta: O polvo libera tinta, que preenche um Cubo de 1,5 metro de lado centrado em si, e o polvo se desloca o máximo de seu Deslocamento de Natação. O Cubo fica Totalmente Obscurecido por 1 minuto ou até que uma corrente forte ou efeito semelhante disperse a tinta.\nPônei\nFera Média, Sem Alinhamento\nCA 10\nIniciativa +0 (10)\nPV 11 (2d8 + 2)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n15\n+2\n+2\nDes\n10\n+0\n+0\nCon\n13\n+1\n+1\nInt\n2\n-4\n-4\nSab\n11\n+0\n+0\nCar\n7\n-2\n-2\nSentidos Percepção Passiva 10\nIdiomas —\nND 1/8 (XP 25; BP +2)\nAções\nCascos. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 4 (1d4 + 2) Contundente.\nPseudodragão\nDragão Minúsculo, Neutro e Bom\nCA 14\nIniciativa +2 (12)\nPV 10 (3d4 + 3)\nDeslocamento 4,5 m, Voo 18 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n6\n-2\n-2\nDes\n15\n+2\n+2\nCon\n13\n+1\n+1\nInt\n10\n+0\n+0\nSab\n12\n+1\n+1\nCar\n10\n+0\n+0\nPerícias Furtividade +4, Percepção +5\nSentidos Visão às Cegas 3 m, Visão no Escuro 18 m, Percepção Passiva 15\nIdiomas Compreende Comum e Dracônico, mas não consegue falar\nND 1/4 (XP 50; BP +2)\nTraços\nResistência à Magia. O pseudodragão tem Vantagem em salvaguardas contra magias e outros efeitos mágicos.\nAções\nAtaques Múltiplos. O pseudodragão realiza dois ataques usando Mordida.\nFerroada. Salvaguarda de Constituição: CD 12, uma criatura à vista do pseudodragão a até 1,5 metro. Falha: 5 (2d4) Venenoso, e o alvo tem a condição Envenenado por 1 hora. Falha por 5 ou Mais: O alvo Envenenado também tem a condição Inconsciente até sofrer dano ou outra criatura executar uma ação para sacudi-la.\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 4 (1d4 + 2) Perfurante.\nQuasit\nÍnfero Minúsculo (Demônio), Caótico e Mau\nCA 13\nIniciativa +3 (13)\nPV 25 (10d4)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n5\n-3\n-3\nDes\n17\n+3\n+3\nCon\n10\n+0\n+0\nInt\n7\n-2\n-2\nSab\n10\n+0\n+0\nCar\n10\n+0\n+0\nPerícias Furtividade +5\nResistências Elétrico, Gélido, Ígneo\nImunidades Venenoso; Envenenado\nSentidos Visão no Escuro 36 m, Percepção Passiva 10\nIdiomas Abissal, Comum\nND 1 (XP 200; BP +2)\nTraços\nResistência à Magia. O quasit tem Vantagem em salvaguardas contra magias e outros efeitos mágicos.\nAções\nAlterar Forma. O quasit se multimorfa em uma forma que se assemelha a uma centopeia (12 m., Escalada 12 m.), um morcego (Deslocamento 3 m., Voo 12 m.) ou um sapo (12 m., Natação 12 m.), ou retorna à sua verdadeira forma. Suas estatísticas são as mesmas em cada forma, exceto por seu Deslocamento. Qualquer equipamento que esteja usando ou carregando não é transformado. O quasit reverte para sua verdadeira forma se morrer.\nAssustar (1/Dia). Salvaguarda de Sabedoria: CD 10, uma criatura a até 6 metros. Falha: O alvo tem a condição Amedrontado. No final de cada um dos próprios turnos, o alvo repete a salvaguarda, encerrando o efeito em si em caso de sucesso. Após 1 minuto, ele é automaticamente bem-sucedido.\nDilacerar. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 5 (1d4 + 3) Cortante, e o alvo tem a condição Envenenado até o início do próximo turno do quasit.\nInvisibilidade. O quasit conjura Invisibilidade em si, não exigindo componentes de magia e usando Carisma como atributo de conjuração.\nRã\nFera Minúscula, Sem Alinhamento\nCA 11\nIniciativa +1 (11)\nPV 1 (1d4 - 1)\nDeslocamento 6 m, Natação 6 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n1\n-5\n-5\nDes\n13\n+1\n+1\nCon\n8\n-1\n-1\nInt\n1\n-5\n-5\nSab\n8\n-1\n-1\nCar\n3\n-4\n-4\nPerícias Furtividade +3, Percepção +1\nSentidos Visão no Escuro 9 m, Percepção Passiva 11\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nAnfíbio. A rã pode respirar ar e água.\nSalto Parado. O Salto em Distância da rã é de até 3 metros e o Salto em Altura é de até 1,5 metro com ou sem uma corrida inicial.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +3 para acertar, alcance 1,5 m. Dano: 1 Perfurante.\nRato\nFera Minúscula, Sem Alinhamento\nCA 10\nIniciativa +0 (10)\nPV 1 (1d4 - 1)\nDeslocamento 6 m, Escalada 6 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n2\n-4\n-4\nDes\n11\n+0\n+0\nCon\n9\n-1\n-1\nInt\n2\n-4\n-4\nSab\n10\n+0\n+0\nCar\n4\n-3\n-3\nPerícias Percepção +2\nSentidos Visão no Escuro 9 m, Percepção Passiva 12\nIdiomas —\nND 0 (XP 10; BP +2)\nTraços\nÁgil. O rato não provoca Ataques de Oportunidade ao se mover para fora do alcance de um inimigo.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +2 para acertar, alcance 1,5 m. Dano: 1 Perfurante.\nSlaad Girino\nAberração Minúscula, Caótico e Neutro\nCA 12\nIniciativa +2 (12)\nPV 7 (3d4)\nDeslocamento 9 m, Escavação 3 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n7\n-2\n-2\nDes\n15\n+2\n+2\nCon\n10\n+0\n+0\nInt\n3\n-4\n-4\nSab\n5\n-3\n-3\nCar\n3\n-4\n-4\nPerícias Furtividade +4\nResistências Ácido, Elétrico, Gélido, Ígneo, Trovejante\nSentidos Visão no Escuro 18 m, Percepção Passiva 7\nIdiomas Compreende Slaad, mas não consegue falar\nND 1/8 (XP 25; BP +2)\nTraços\nResistência à Magia. O slaad tem Vantagem em salvaguardas contra magias e outros efeitos mágicos.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 5 (1d6 + 2) Perfurante.\nSprite\nFeérico Minúsculo, Neutro e Bom\nCA 15\nIniciativa +4 (14)\nPV 10 (4d4)\nDeslocamento 3 m, Voo 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n3\n-4\n-4\nDes\n18\n+4\n+4\nCon\n10\n+0\n+0\nInt\n14\n+2\n+2\nSab\n13\n+1\n+1\nCar\n11\n+0\n+0\nPerícias Furtividade +8, Percepção +3\nSentidos Percepção Passiva 13\nIdiomas Comum, Élfico, Silvestre\nND 1/4 (XP 50; BP +2)\nAções\nAgulha-Espada. Jogada de Ataque Corpo a Corpo: +6 para acertar, alcance 1,5 m. Dano: 6 (1d4 + 4) Perfurante.\nArco Encantado. Jogada de Ataque à Distância: +6 para acertar, alcance 12/48 m. Dano: 1 Perfurante e o alvo tem a condição Enfeitiçado até o início do próximo turno do sprite.\nInvisibilidade. O sprite conjura Invisibilidade em si, não exigindo componentes de magia e usando Carisma como atributo de conjuração.\nVer o Coração. Salvaguarda de Carisma: CD 10, uma criatura a até 1,5 metro à vista do sprite. Celestiais, Ínferos e Mortos-Vivos falham automaticamente na salvaguarda. Falha: O sprite conhece as emoções e o alinhamento do alvo.\nTexugo\nFera Minúscula, Sem Alinhamento\nCA 11\nIniciativa +0 (10)\nPV 5 (1d4 + 3)\nDeslocamento 6 m, Escavação 1,5 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n10\n+0\n+0\nDes\n11\n+0\n+0\nCon\n16\n+3\n+3\nInt\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n5\n-3\n-3\nPerícias Percepção +3\nResistências Venenoso\nSentidos: Visão no Escuro 9 m, Percepção Passiva 13\nIdiomas —\nND 0 (XP 10; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +2 para acertar, alcance 1,5 m. Dano: 1 Perfurante.\nTexugo Gigante\nFera Média, Sem Alinhamento\nCA 13\nIniciativa +0 (10)\nPV 15 (2d8 + 6)\nDeslocamento 9 m, Escavação 3 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n13\n+1\n+1\nDes\n10\n+0\n+0\nCon\n17\n+3\n+3\nInt\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n5\n-3\n-3\nPerícias Percepção +3\nResistências Venenoso\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 1/4 (XP 50; BP +2)\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +3 para acertar, alcance 1,5 m. Dano: 6 (2d4 + 1) Perfurante.\nTigre\nFera Grande, Sem Alinhamento\nCA 13\nIniciativa +3 (13)\nPV 22 (3d10 + 6)\nDeslocamento 12 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n17\n+3\n+3\nDes\n16\n+3\n+3\nCon\n14\n+2\n+2\nInt\n3\n-4\n-4\nSab\n12\n+1\n+1\nCar\n8\n-1\n-1\nPerícias Furtividade +7, Percepção +3\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 1 (XP 200; BP +2)\nAções\nAtaques Múltiplos. O tigre realiza um ataque usando Bote e usa Rondar.\nBote. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 6 (1d6 + 3) Cortante. Se o tigre teve Vantagem na jogada de ataque, o alvo sofre 3 (1d6) pontos de dano Cortante adicionais e, se for Enorme ou menor, tem a condição Caído.\nRondar. O tigre se move até metade do próprio Deslocamento sem provocar Ataques de Oportunidade. No final deste movimento, o tigre pode executar a ação Esconder.\nTubarão do Recife\nFera Média, Sem Alinhamento\nCA 12\nIniciativa +2 (12)\nPV 22 (4d8 + 4)\nDeslocamento 1,5 m, Natação 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n14\n+2\n+2\nDes\n15\n+2\n+2\nCon\n13\n+1\n+1\nInt\n1\n-5\n-5\nSab\n10\n+0\n+0\nCar\n4\n-3\n-3\nPerícias Percepção +2\nSentidos Visão às Cegas 9 m, Percepção Passiva 12\nIdiomas —\nND 1/2 (XP 100; BP +2)\nTraços\nRespirar na Água. O tubarão só pode respirar debaixo d'água.\nTáticas de Grupo. O tubarão tem Vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do tubarão está a até 1,5 metro da criatura e o aliado não tem a condição Incapacitado.\nAções\nMordida. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m. Dano: 7 (2d4 + 2) Perfurante.\nUrso Negro\nFera Média, Sem Alinhamento\nCA 11\nIniciativa +1 (11)\nPV 19 (3d8 + 6)\nDeslocamento 9 m, Escalada 9 m, Natação 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n15\n+2\n+2\nDes\n12\n+1\n+1\nCon\n14\n+2\n+2\nInt\n2\n-4\n-4\nSab\n12\n+1\n+1\nCar\n7\n-2\n-2\nPerícias Percepção +5\nSentidos Visão no Escuro 18 m, Percepção Passiva 15\nIdiomas —\nND 1/2 (XP 100; BP +2)\nAções\nAtaques Múltiplos. O urso realiza dois ataques usando Dilacerar.\nDilacerar. Jogada de Ataque Corpo a Corpo: +4 para acertar, alcance 1,5 m Dano: 5 (1d6 + 2) Cortante.\nUrso Pardo\nFera Grande, Sem Alinhamento\nCA 11\nIniciativa +1 (11)\nPV 22 (3d10 + 6)\nDeslocamento 12 m, Escalada 9 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n17\n+3\n+3\nDes\n12\n+1\n+1\nCon\n15\n+2\n+2\nInt\n2\n-4\n-4\nSab\n13\n+1\n+1\nCar\n7\n-2\n-2\nPerícias Percepção +3\nSentidos Visão no Escuro 18 m, Percepção Passiva 13\nIdiomas —\nND 1 (XP 200; BP +2)\nAções\nAtaques Múltiplos. O urso realiza um ataque usando Mordida e um ataque usando Garras.\nGarras. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 5 (1d4 + 3) Cortante, e o alvo tem a condição Caído se for Enorme ou menor.\nMordida. Jogada de Ataque Corpo a Corpo: +5 para acertar, alcance 1,5 m. Dano: 7 (1d8 + 3) Perfurante.\nZumbi\nMorto-vivo Médio, Neutro e Mau\nCA 8\nIniciativa -2 (8)\nPV 15 (2d8 + 6)\nDeslocamento 6 m\nMod\nSG\nMod\nSG\nMod\nSG\nFor\n13\n+1\n+1\nDes\n6\n-2\n-2\nCon\n16\n+3\n+3\nInt\n3\n-4\n-4\nSab\n6\n-2\n+0\nCar\n5\n-3\n-3\nImunidades Venenoso; Envenenado, Exaustão\nSentidos Visão no Escuro 18 m, Percepção Passiva 8\nIdiomas Compreende os idiomas que conhecia em vida, mas não consegue falar\nND 1/4 (XP 50; BP +2)\nTraços\nFortitude de Morto-Vivo. Se o dano reduzir o zumbi a 0 Pontos de Vida, ele deve realizar uma salvaguarda de Constituição CD 5 mais o dano sofrido, a menos que o dano seja Radiante ou de um Acerto Crítico. Em caso de sucesso, o zumbi tem 1 Ponto de Vida.\nAções\nPancada. Jogada de Ataque Corpo a Corpo: +3 para acertar, alcance 1,5 m. Dano: 4 (1d6 + 1) Contundente.\nApêndice C: Glossário de Regras\nConvenções do Glossário\nO glossário utiliza as seguintes convenções:\nMarcadores entre Colchetes. Algumas descrições apresentam um marcador entre colchetes após o nome, como em “Atacar [Ação]”. Um marcador — Ação, Área de Efeito, Atitude, Condição ou Risco — indica que uma regra pertence a uma família de regras. Os marcadores também estão presentes nas descrições do glossário.\n“Você”. As regras do jogo — tanto neste glossário quanto em outros locais — frequentemente mencionam algo que acontece com você no mundo do jogo. Esse “você” refere-se à criatura ou objeto ao qual a regra se aplica naquele momento específico do jogo. Por exemplo, o “você” na condição Caído é uma criatura que atualmente tem a condição.\n“Veja Também”. Algumas descrições do glossário incluem uma seção Veja também que direciona para outras descrições no glossário, para capítulos deste livro, ou ambos.\nSem Termos Obsoletos. O glossário apresenta definições apenas de termos das regras atuais. Se você está em busca de um termo de uma versão anterior das regras da quinta edição, consulte o índice.\nAbreviações. As abreviações apresentadas abaixo estão incluídas neste glossário e em outras seções das regras.\nAbreviação\nDescrição\nBP\nBônus de Proficiência\nC\nConcentração\nCA\nClasse de Armadura\nCar\nCarisma\nCB\nCaótico e Bom\nCD\nClasse de Dificuldade\nCM\nCaótico e Mau\nCN\nCaótico e Neutro\nCon\nConstituição\nDes\nDestreza\nDM\nDungeon Master (ou Mestre ou Narrador)\nFor\nForça\nInt\nInteligência\nM\nComponente Material\nN\nNeutro\nNB\nNeutro e Bom\nND\nNível de Desafio\nNM\nNeutro e Mau\nOB\nOrdeiro e Bom\nOM\nOrdeiro e Mau\nON\nOrdeiro e Neutro\nPC\nPeça(s) de Cobre\nPE\nPeça(s) de Electro\nPL\nPeça(s) de Platina\nPNJ\nPersonagens Não Jogadores\nPO\nPeça(s) de Ouro\nPP\nPeça(s) de Prata\nPV\nPonto(s) de Vida\nR\nRitual\nS\nComponente Somático\nSab\nSabedoria\nV\nComponente Verbal\nXP\nPonto(s) de Experiência\nDefinições de Regras\nAção\nNo seu turno, você pode executar uma ação. Escolha qual ação executar entre as apresentadas abaixo ou entre as ações especiais oferecidas por suas características. Veja também o capítulo 1 (“Ações”). Essas ações estão definidas em outras partes deste glossário:\nAjudar\nAnalisar\nAtacar\nCorrer\nDesengajar\nEsconder-se\nEsquivar\nInfluenciar\nPreparar\nProcurar\nUsar Magia\nUsar Objeto\nAção Bônus\nUma Ação Bônus é uma ação especial que você pode executar no mesmo turno em que executa uma ação. Você não pode executar mais de uma Ação Bônus em um turno, e você só pode ter uma Ação Bônus, a não ser que uma regra disser o contrário explicitamente. Veja também o capítulo 1 (“Ações”).\nAcerto Crítico\nAo tirar 20 na sua jogada de ataque com o d20, você obtém um Acerto Crítico, e o ataque acerta independentemente de quaisquer modificadores ou da CA do alvo. Um Acerto Crítico permite que você jogue dados adicionais para o dano do ataque contra o alvo. Jogue todos os dados de dano do ataque duas vezes e some-os. Em seguida, adicione quaisquer modificadores relevantes. Veja também o capítulo 1 (“Dano e Cura”).\nAjudar [Ação]\nQuando executa a ação Ajudar, você faz uma das seguintes coisas.\nAjudar em um Teste de Atributo. Escolha uma de suas proficiências em perícia ou ferramentas e um aliado que esteja próximo o suficiente para que você possa ajudá-lo física ou verbalmente quando ele realizar um teste de atributo. Esse aliado tem Vantagem no próximo teste de atributo que fizer com a perícia ou ferramenta escolhida. Esse benefício se encerra se o aliado não o utilizar antes do início do seu próximo turno. O Mestre tem a palavra final sobre a possibilidade de ajuda.\nAjudar em uma Jogada de Ataque. Você distrai momentaneamente um inimigo a até 1,5 metro de você, concedendo Vantagem à próxima jogada de ataque de um de seus aliados contra esse inimigo. Este benefício se encerra no início do seu próximo turno.\nAliado\nUma criatura é considerada seu aliado se for um membro do seu grupo de aventura, um amigo, estiver ao seu lado em combate ou for uma criatura que as regras ou o Mestre designou como seu aliado.\nAlinhamento\nO alinhamento de uma criatura descreve de maneira abrangente suas atitudes éticas e ideais. O alinhamento é uma combinação de dois fatores: um identifica a moralidade (bom, mau ou neutro) e o outro descreve as atitudes em relação à ordem (ordeiro, caótico ou neutro). Esses fatores possibilitam nove combinações, como Ordeiro e Bom e Neutro e Mau. Veja também o capítulo 2 (“Criando Seu Personagem”).\nAlvo\nUm alvo é a criatura ou objeto que é atingido por uma jogada de ataque, obrigado a realizar uma salvaguarda devido a um efeito, ou escolhido para receber os efeitos de uma magia ou outro fenômeno.\nAmedrontado [Condição]\nEnquanto tem a condição Amedrontado, você sofre os seguintes efeitos.\nTestes de Atributo e Ataques Afetados. Você tem Desvantagem em testes de atributo e jogadas de ataque enquanto a fonte do medo estiver dentro da linha de visão.\nNão Pode Se Aproximar. Você não pode se aproximar voluntariamente da fonte do medo.\nAmigável [Atitude]\nUma criatura Amigável vê você de forma favorável. Você tem Vantagem em um teste de atributo para influenciar uma criatura Amigável. Veja também “Influenciar”.\nAnalisar [Ação]\nAo executar a ação Analisar, você realiza um teste de Inteligência para examinar sua memória, um livro, uma pista ou outra fonte de conhecimento e recordar uma informação importante sobre o que está investigando.\nA tabela Áreas de Conhecimento sugere quais perícias são aplicáveis a várias áreas de conhecimento.\nÁreas de Conhecimento\nPerícia\nÁreas\nArcanismo\nItens mágicos, magias, planos de existência, símbolos arcanos, tradições mágicas e certas criaturas (Aberrações, Constructos, Elementais, Feéricos e Monstruosidades)\nHistória\nEventos e pessoas históricas, civilizações antigas, guerras e certas criaturas (Gigantes e Humanoides)\nInvestigação\nArmadilhas, códigos, dispositivos e enigmas\nNatureza\nClima, flora, terreno e certas criaturas (Dragões, Feras, Gosmas e Plantas)\nReligião\nCultos, deidades, hierarquias e ritos religiosos, símbolos sagrados e certas criaturas (Celestiais, Ínferos e Mortos-Vivos)\nÁrea de Efeito\nAs descrições de várias magias e outras características especificam que elas possuem uma área de efeito, que geralmente apresenta uma das seis formas. Essas formas são definidas em outras seções deste glossário:\nCilindro\nCone\nCubo\nEmanação\nEsfera\nLinha\nUma área de efeito possui um ponto de origem, um local de onde a energia do efeito irrompe. As regras para cada forma especificam como posicionar esse ponto de origem. Se todas as linhas retas que se estendem do ponto de origem até um local na área de efeito estiverem bloqueadas, esse local não está incluído na área de efeito. Para bloquear uma linha, uma obstrução deve oferecer Cobertura Total. Veja também “Cobertura”.\nSe o criador de uma área de efeito a posicionar em um ponto não visível, e uma obstrução — como uma parede — estiver entre o criador e esse ponto, o ponto de origem passa a existir no lado próximo da obstrução.\nArma\nUma arma é um objeto que está na categoria de arma Marcial ou Simples. Veja também o capítulo 6 (“Armas”).\nArmas Improvisadas\nUma arma improvisada é um objeto empunhado como uma arma improvisada, como vidro quebrado, uma perna de mesa ou uma frigideira. Uma arma Simples ou Marcial também é considerada uma arma improvisada se for utilizada de maneira diferente de sua finalidade; se você usar uma arma de Alcance para realizar um ataque corpo a corpo ou arremessar uma arma corpo a corpo que não tenha a propriedade Arremesso, a arma é considerada uma arma improvisada. Uma arma improvisada segue as regras abaixo.\nProficiência. Não adicione seu Bônus de Proficiência às jogadas de ataque com uma arma improvisada.\nDano. Em caso de acerto, a arma causa 1d4 pontos de dano de um tipo que o Mestre considere apropriado para o objeto. Alcance. Ao arremessar a arma, ela tem um alcance normal de 6 metros e um alcance máximo de 18 metros.\nEquivalente à uma Arma. Se uma arma improvisada se assemelha a uma arma Simples ou Marcial, o Mestre pode determinar que ela funciona como essa arma e aplicar as regras correspondentes. Por exemplo, o Mestre pode considerar uma perna de mesa como uma Clava.\nArredondar para Baixo\nSempre que você dividir ou multiplicar um número no jogo, arredonde para baixo se o resultado tiver uma fração, mesmo que essa fração seja igual ou maior que a metade. Algumas regras geram exceções e indicam que se deve arredondar para cima.\nAsfixia [Risco]\nUma criatura pode prender a respiração por um número de minutos igual a 1 mais seu modificador de Constituição (mínimo de 30 segundos) antes de começar a se asfixiar. Quando uma criatura fica sem ar ou está se engasgando, ela adquire 1 nível de Exaustão ao final de cada um de seus turnos. Quando uma criatura pode respirar novamente, ela remove todos os níveis de Exaustão adquiridos devido à asfixia.\nAtacar [Ação]\nAo executar a ação Atacar, você pode realizar um ataque com uma arma ou um Ataque Desarmado.\nEquipar e Desequipar Armas. Você pode equipar ou desequipar uma arma ao realizar um ataque como parte dessa ação. Isso pode ser feito antes ou depois do ataque. Se você equipar uma arma antes de um ataque, não precisa executar uma ação para embainhar ou pegar a arma. Equipar inclui embainhar a arma. Desequipar uma arma envolve sacá-la de uma bainha ou pegá-la.\nMovendo-se entre Ataques. Se você se mover no seu turno e tiver uma característica, como Ataque Extra, que lhe concede mais de um ataque como parte da ação Atacar, você pode usar parte ou todo esse movimento para se deslocar entre esses ataques.\nAtaque Armado\nUm ataque armado é uma jogada de ataque realizada com uma arma. Veja também “Arma”.\nAtaque Desarmado\nEm vez de utilizar uma arma para efetuar um ataque corpo a corpo, você pode optar por um soco, chute, cabeçada ou um golpe poderoso semelhante. Em termos de jogo, isso é um Ataque Desarmado — um ataque corpo a corpo que envolve usar seu corpo para causar dano, imobilizar ou empurrar um alvo a até 1,5 metro de distância de você.\nSempre que você usar seu Ataque Desarmado, escolha uma das seguintes opções para seu efeito.\nDano. Você realiza uma jogada de ataque contra o alvo. Seu bônus para a jogada é igual ao seu modificador de Força mais seu Bônus de Proficiência. Se acertar, o alvo sofre dano Contundente igual a 1 mais seu modificador de Força.\nEmpurrar. O alvo deve ser bem-sucedido em uma salvaguarda de Destreza ou Força (à sua escolha) contra um CD igual a 8 mais seu modificador de Força e Bônus de Proficiência, ou você o empurra 1,5 metro para longe ou impõe a condição Caído. Este empurrão só é possível se o alvo não for mais de um tamanho maior que você.\nImobilizar. O alvo deve ser bem-sucedido em uma salvaguarda de Força ou Destreza (à sua escolha) ou ele tem a condição Imobilizado. A CD para a salvaguarda e qualquer tentativa de escapar é igual a 8 mais seu modificador de Força e Bônus de Proficiência. Esta imobilização só é possível se o alvo não for mais de um tamanho maior que você e se você tiver uma mão livre para agarrá-lo. Veja também “Imobilizando”.\nAtaque Mágico\nUm ataque mágico é uma jogada de ataque realizada como parte de uma magia ou outro efeito mágico. Veja também o capítulo 7 (“Conjurando Magias”).\nAtaques de Oportunidade\nVocê pode realizar um Ataque de Oportunidade quando uma criatura que você pode ver sai do seu alcance usando a Ação, Ação Bônus, Reação ou um dos deslocamentos dela. Para realizar o Ataque de Oportunidade, use uma Reação para realizar um ataque corpo a corpo com uma arma ou um Ataque Desarmado contra a criatura que provocou o ataque. O ataque acontece imediatamente antes da criatura deixar seu alcance. Veja também o capítulo 1 (“Combate”).\nAtitude\nUm monstro possui uma atitude inicial em relação a um personagem do jogador: Amigável, Hostil ou Indiferente. Veja também “Amigável”, “Hostil”, “Indiferente” e “Influenciar”.\nAtordoado [Condição]\nEnquanto tem a condição Atordoado, você sofre os seguintes efeitos.\nIncapacitado. Você tem a condição Incapacitado.\nSalvaguardas Afetadas. Você falha automaticamente em salvaguardas de Força e Destreza.\nAtaques Afetados. Jogadas de ataque contra você têm Vantagem.\nAventura\nUma aventura consiste em uma sequência de encontros. Uma narrativa se forma ao jogá-los. Veja também “Encontro”.\nBloco de Estatísticas\nUm bloco de estatísticas apresenta as estatísticas de jogo de um monstro. Cada bloco de estatísticas inclui as seguintes informações apresentadas após o nome do monstro.\nTamanho. Um monstro pode ser Minúsculo, Pequeno, Médio, Grande, Enorme ou Colossal. Veja também “Tamanho”.\nTipo de Criatura. Esta descrição indica a família de seres à qual o monstro pertence, juntamente com quaisquer marcadores descritivos. Veja também “Tipo de Criatura”.\nAlinhamento. Um alinhamento é sugerido para o monstro, com o Mestre determinando o alinhamento real. Veja também “Alinhamento”.\nCA, Iniciativa e PV. Essas descrições fornecem a Classe de Armadura, a Iniciativa e os Pontos de Vida do monstro, conforme detalhado no capítulo 1. Em parênteses, após os Pontos de Vida, são apresentados os Dados de Vida do monstro, juntamente com a contribuição de sua Constituição, se houver, para os Pontos de Vida. Após o modificador de Iniciativa, segue-se um valor de Iniciativa. Algumas criaturas criadas por magia não possuem Dados de Vida nem informações sobre Iniciativa.\nDeslocamento. Aqui é fornecido o Deslocamento do monstro, juntamente com qualquer deslocamento especial. Veja também “Deslocamento de Escalada”, “Deslocamento de Escavação”, “Deslocamento de Natação” e “Deslocamento de Voo”.\nValores de Atributo. Uma tabela fornece os valores de atributo do monstro, modificadores e modificadores de salvaguardas, todos detalhados no capítulo 1.\nPerícias. Esta descrição lista as proficiências em perícias do monstro, se houver. Veja também o capítulo 1 (“Proficiência”).\nResistências e Vulnerabilidades. Essas descrições listam as Resistências e Vulnerabilidades do monstro, se houver. Veja também “Resistência” e “Vulnerabilidade”.\nImunidades. Esta seção lista as Imunidades a condições e danos do monstro, se houver. Veja também “Imunidade”.\nEquipamento. Se o monstro possui algum equipamento que pode ser dado ou recuperado, ele é apresentado nesta descrição.\nSentidos. Esta descrição lista os sentidos especiais do monstro, como Percepção Passiva e sua Visão no Escuro. Veja também “Percepção Passiva”.\nIdiomas. Esta descrição lista todos os idiomas que o monstro conhece.\nND. O Nível de Desafio resume a ameaça que um monstro representa, sendo detalhado no Livro dos Monstros. Os Pontos de Experiência que os personagens recebem ao derrotar um monstro, assim como seu Bônus de Proficiência, estão relacionados a esse nível. Algumas criaturas criadas por magia não possuem ND. Veja também “Nível de Desafio” e “Pontos de Experiência”.\nTraços. Os traços do monstro, se existirem, são características que permanecem ativas o tempo todo ou em determinadas situações. Ações. O monstro pode executar essas ações, além das que estão detalhadas neste glossário. Veja também o capítulo 1 (“Ações”).\nAções Bônus. Se o monstro possui opções de Ações Bônus, elas são apresentadas nesta seção.\nReações. Se o monstro pode realizar Reações especiais, elas são listadas nesta seção.\nDescrição de Ataque. A descrição do ataque de um monstro inicia identificando se este é corpo a corpo ou à distância e, em seguida, apresenta o bônus da jogada de ataque, seu alcance ou distância, e o que ocorre em caso de acerto. Um ataque é direcionado a um alvo, a menos que sua descrição indique o contrário.\nDescrição de Efeito de Salvaguarda. Quando um efeito exige uma salvaguarda, a descrição do efeito inicia identificando o tipo de salvaguarda necessária e, em seguida, apresenta a CD da salvaguarda, uma descrição das criaturas que devem realizar a salvaguarda e o que ocorre em caso de falha ou sucesso na salvaguarda.\nDescrição de Dano. Um bloco de estatísticas geralmente apresenta um número fixo e uma expressão de dado para cada ocorrência de dano. Por exemplo, um ataque pode causar 4 (1d4+2) pontos de dano em caso de acerto. O Mestre decide se utiliza o número fixo ou a expressão de dado entre parênteses; não se deve usar ambos.\nCaído [Condição]\nEnquanto tem a condição Caído, você sofre os seguintes efeitos.\nMovimento Restrito. Suas únicas opções de movimento são rastejar ou gastar uma quantidade de movimento equivalente à metade do seu Deslocamento (arredondado para baixo) para se levantar e, assim, encerrar a condição. Se seu Deslocamento for 0, você não consegue se levantar.\nAtaques Afetados. Você tem Desvantagem em jogadas de ataque. Uma jogada de ataque contra você tem Vantagem se o atacante estiver a até 1,5 metro de você. Caso contrário, essa jogada de ataque tem Desvantagem.\nCampanha\nUma campanha é uma série de aventuras. Veja também “Aventura”.\nCapacidade de Carga\nSeu tamanho e valor de Força determinam o peso máximo em quilogramas que você pode carregar, conforme indicado na tabela Capacidade de Carga. A tabela também apresenta o peso máximo que você pode arrastar, empurrar ou levantar.\nAo arrastar, empurrar ou levantar um peso superior ao máximo que você pode carregar, seu deslocamento não pode ser superior a 1,5 metro.\nCapacidade de Carga\nTamanho da Criatura\nCarregar\nArrastar/Empurrar/Levantar\nMinúsculo\nFor x 3,5 kg\nFor x 7 kg\nPequeno\nFor x 7 kg\nFor x 13,5 kg\nMédio\nFor x 7 kg\nFor x 13,5 kg\nGrande\nFor x 13,5 kg\nFor x 27 kg\nEnorme\nFor x 27 kg\nFor x 54,5 kg\nColossal\nFor x 54,5 kg\nFor x 109 kg\nCego [Condição]\nEnquanto tem a condição Cego, você sofre os seguintes efeitos.\nNão Pode Ver. Você não consegue ver e falha automaticamente em qualquer teste de atributo que dependa da visão.\nAtaques Afetados. Jogadas de ataque contra você têm Vantagem, enquanto suas jogadas de ataque têm Desvantagem.\nCilindro [Área de Efeito]\nUm Cilindro é uma área de efeito que se estende em linhas retas a partir de um ponto de origem situado no centro da parte superior ou inferior circular do Cilindro. O efeito que gera um Cilindro determina o raio da base e a altura do Cilindro.\nO ponto de origem de um Cilindro está incluído na área de efeito.\nClasse de Armadura\nA Classe de Armadura (CA) é o número-alvo para uma jogada de ataque. A CA indica a dificuldade de acertar um alvo.\nSua CA base é calculada como 10 mais o seu modificador de Destreza. Se uma regra fornecer outro cálculo base de CA, você pode escolher qual cálculo utilizar; não é permitido usar mais de um. Veja também “Jogada de Ataque”.\nClasse de Dificuldade\nUma Classe de Dificuldade (CD) é o número-alvo para um teste de atributo ou uma salvaguarda. Veja também o capítulo 1 (“Testes de D20”).\nCobertura\nUma Cobertura oferece um grau de proteção a um alvo que está atrás dela. Existem três tipos de cobertura, cada um proporcionando um benefício distinto ao alvo: Cobertura Parcial (+2 de bônus na CA e nas salvaguardas de Destreza), Cobertura de Três Quartos (+5 de bônus na CA e nas salvaguardas de Destreza) e Cobertura Total (não pode ser alvo direto). Se um alvo estiver atrás de mais de um grau de cobertura, ele se beneficia apenas do tipo mais protetor. Veja também o capítulo 1 (“Combate”).\nCombustão [Risco]\nUma criatura ou objeto em combustão sofre 1d4 pontos de dano Ígneo no início de cada um de seus turnos. Como uma ação, você pode apagar o fogo em si mesmo ao se impor a condição Caído e rolar no chão. O fogo também se extingue se for imerso, submerso ou abafado.\nConcentração\nAlgumas magias e outros efeitos exigem que a Concentração permaneça ativa, conforme especificado em suas descrições. Se o criador do efeito perder a Concentração, o efeito termina. Se o efeito tiver uma duração máxima, a descrição do efeito indica quanto tempo o criador pode se concentrar nele: até 1 minuto, 1 hora ou outra duração. O criador pode encerrar a Concentração a qualquer momento (nenhuma ação é necessária). Os seguintes fatores interrompem a Concentração:\nDano. Se você sofrer dano, deve ser bem-sucedido em uma salvaguarda de Constituição para manter a Concentração. A CD é 10 ou metade do dano sofrido (arredondado para baixo), o que for maior, até uma CD máxima de 30.\nIncapacitado ou Morto. Sua Concentração se encerra se tem a condição Incapacitado ou morrer.\nOutro Efeito de Concentração. Você perde a Concentração em um efeito quando começa a conjurar uma magia que exige Concentração ou ativa outro efeito que também requer Concentração.\nCondição\nUma condição é um estado temporário de jogo. A definição de uma condição descreve como ela afeta seu receptor e várias regras estabelecem como encerrar uma condição. Este glossário define essas condições:\nAmedrontado\nAtordoado\nCaído\nCego\nContido\nEnfeitiçado\nEnvenenado\nExaustão\nImobilizado\nIncapacitado\nInconsciente\nInvisível\nParalisado\nPetrificado\nSurdo\nUma condição não se acumula consigo mesma; um receptor tem uma condição ou não. A condição Exaustão é uma exceção a essa regra. Veja também o capítulo 1 (“Condições”).\nCone [Área de Efeito]\nUm Cone é uma área de efeito que se estende em linhas retas a partir de um ponto de origem em uma direção escolhida por seu criador. A largura de um Cone em qualquer ponto ao longo de seu comprimento é igual à distância desse ponto até o ponto de origem. Por exemplo, um Cone tem 4,5 metros de largura em um ponto ao longo de seu comprimento que está a 4,5 metros do ponto de origem. O efeito que define um Cone detalha seu comprimento máximo.\nO ponto de origem de um Cone não está incluído na área de efeito, a menos que seu criador decida o contrário.\nContido [Condição]\nEnquanto tem a condição Contido, você sofre os seguintes efeitos.\nDeslocamento 0. Seu Deslocamento é 0 e não pode aumentar.\nAtaques Afetados. Jogadas de ataque contra você têm Vantagem e suas jogadas de ataque têm Desvantagem.\nSalvaguardas Afetadas. Você tem Desvantagem em salvaguardas de Destreza.\nCorrer [Ação]\nAo executar a Ação Correr, você recebe movimento adicional para o turno atual. O aumento é igual ao seu Deslocamento após aplicar quaisquer modificadores. Com um Deslocamento de 9 metros, por exemplo, você pode se mover até 18 metros no seu turno ao usar Correr. Se seu Deslocamento de 9 metros for reduzido para 4,5 metros, você pode se mover até 9 metros neste turno ao usar Correr.\nSe você possui um deslocamento especial, como Deslocamento de Natação ou Deslocamento de Voo, pode utilizar esse deslocamento em vez do seu Deslocamento ao executar esta ação. Você decide qual deslocamento usar a cada vez que executa essa ação. Veja também “Deslocamento”.\nCriatura\nQualquer ser no jogo, incluindo o personagem do jogador, é uma criatura. Veja também “Tipo de Criatura”.\nCubo [Área de Efeito]\nUm Cubo é uma área de efeito que se estende em linhas retas a partir de um ponto de origem situado em qualquer lado do Cubo. O efeito gerado por um Cubo determina seu tamanho, que corresponde ao comprimento de cada lado.\nO ponto de origem de um Cubo não está incluído na área de efeito, a menos que seu criador decida permitir isso.\nCura\nCura é como você recupera Pontos de Vida. Veja também o capítulo 1 (\"Dano e Cura\").\nDados de Pontos de Vida\nDados de Pontos de Vida, ou Dados de Vida para abreviar, ajudam a determinar os Pontos de Vida máximos de um personagem do jogador, conforme explicado no capítulo 2. A maioria dos monstros também possui Dados de Vida. Uma criatura pode gastar Dados de Vida durante um Descanso Curto para recuperar Pontos de Vida. Veja também “Descanso Curto”.\nDano\nDano representa o efeito que causa a perda de Pontos de Vida a uma criatura ou objeto.\nDescanso Curto\nUm Descanso Curto é um intervalo de 1 hora de tempo de inatividade, durante o qual uma criatura não realiza nada mais extenuante do que comer, ler, fazer vigília ou conversar. Para iniciar um Descanso Curto, você deve ter pelo menos 1 Ponto de Vida.\nBenefícios do Descanso. Ao terminar o descanso, você adquire os seguintes benefícios:\nGaste Dados de Pontos de Vida. Você pode gastar um ou mais de seus Dados de Pontos de Vida para recuperar Pontos de Vida. Para cada Dado de Ponto de Vida que você gastar dessa forma, jogue o dado e adicione seu modificador de Constituição a ele. Você recupera Pontos de Vida iguais ao total (mínimo de 1 Ponto de Vida). Você pode optar por gastar um Dado de Ponto de Vida adicional após cada jogada.\nCaracterística Especial. Algumas características são recuperadas durante um Descanso Curto. Se você possui uma característica desse tipo, ela é recuperada conforme detalhado na descrição.\nInterrupção do Descanso. Um Descanso Curto é interrompido nas seguintes situações:\nJogar Iniciativa\nConjurar uma magia que não seja um truque\nReceber qualquer dano\nUm Descanso Curto interrompido não concede benefícios.\nDescanso Longo\nUm Descanso Longo é um período prolongado de tempo livre — pelo menos 8 horas — disponível para qualquer criatura. Durante um Descanso Longo, você dorme por pelo menos 6 horas e pode realizar no máximo 2 horas de atividade leve, como comer, conversar, ler ou manter vigia.\nDurante o sono, você tem a condição Inconsciente. Após completar um Descanso Longo, você deve esperar pelo menos 16 horas antes de iniciar outro.\nBenefícios do Descanso. Para iniciar um Descanso Longo, você deve ter pelo menos 1 Ponto de Vida. Ao concluir o descanso, você adquire os seguintes benefícios:\nRecuperar Todos os PV. Você recupera todos os Pontos de Vida perdidos e todos os Dados de Vida gastos. Se seus Pontos de Vida máximos foram reduzidos, eles retornam ao normal.\nValores de Atributo Restaurados. Se algum dos seus valores de atributo foi reduzido, ele retorna ao normal.\nExaustão Reduzida. Se você tem a condição Exaustão, seu nível diminui em 1.\nCaracterística Especial. Algumas características são recuperadas durante um Descanso Longo. Se você possui uma característica desse tipo, ela é recuperada conforme detalhado na descrição.\nInterrupção do Descanso. Um Descanso Longo é interrompido pelas seguintes situações:\nJogar Iniciativa\nConjurar uma magia que não seja um truque\nReceber qualquer dano\n1 hora de caminhada ou outro esforço físico.\nSe descansou por pelo menos 1 hora antes da interrupção, você adquire os benefícios de um Descanso Curto. Veja também “Descanso Curto”.\nVocê pode recomeçar um Descanso Longo imediatamente após uma interrupção. Se fizer isso, o descanso exige 1 hora adicional por interrupção para ser concluído.\nDesengajar [Ação]\nSe você executar a ação Desengajar, seu movimento não provoca Ataques de Oportunidade pelo resto do turno atual.\nDesidratação [Risco]\nUma criatura necessita de uma quantidade diária de água com base em seu tamanho, conforme indicado na tabela Necessidade de Água por Dia. Se uma criatura consumir menos do que a quantidade necessária de água em um dia, ela adquire 1 nível de Exaustão ao final do dia. A Exaustão resultante da desidratação não pode ser removida até que a criatura ingira a quantidade total de água necessária por dia. Veja também “Exaustão”.\nNecessidade de Água por Dia\nTamanho\nÁgua\nMinúsculo\n1,25 litros\nPequeno\n4 litros\nMédio\n4 litros\nGrande\n16 litros\nEnorme\n60 litros\nColossal\n240 litros\nDeslocamento\nUma criatura tem um Deslocamento, que é a distância em metros que ela pode percorrer ao se mover em seu turno. Veja também “Escalar”, “Nadar”, “Rastejar”, “Saltar”, “Voar” e o capítulo 1 (“Combate”).\nDeslocamentos Especiais. Algumas criaturas possuem Deslocamentos especiais, como Deslocamento de Escalada, Deslocamento de Escavação, Deslocamento de Natação ou Deslocamento de Voo, cada um definido neste glossário. Se você possui mais de um Deslocamento, escolha qual usar ao se mover; você pode alternar entre os Deslocamentos durante seu movimento. Sempre que alternar, subtraia a distância já percorrida do novo Deslocamento. O resultado determina quanto mais você pode se mover. Se o resultado for 0 ou menor, você não pode usar o novo Deslocamento durante o movimento atual. Por exemplo, se você possui um Deslocamento de 9 e um Deslocamento de Voo 12, você pode voar 3 metros, caminhar 3 metros e saltar no ar para voar mais 6 metros.\nMudanças nos Seus Deslocamentos. Se um efeito aumenta ou diminui seu Deslocamento por um tempo, qualquer Deslocamento especial que você possua aumenta ou diminui na mesma medida durante esse tempo. Por exemplo, se seu Deslocamento for reduzido para 0 e você tiver um Deslocamento de Escalada, seu Deslocamento de Escalada também será reduzido a 0. Da mesma forma, se seu Deslocamento for reduzido à metade e você tiver um Deslocamento de Voo, seu Deslocamento de Voo também será reduzido à metade.\nDeslocamento de Escalada\nUm Deslocamento de Escalada pode ser utilizado em vez do Deslocamento para atravessar uma superfície vertical sem gastar o movimento adicional normalmente associado a escalada. Veja também “Deslocamento” e “Escalar”.\nDeslocamento de Escavação\nUma criatura com Deslocamento de Escavação pode utilizar esse deslocamento para se mover por areia, terra, lama ou gelo. A criatura não consegue escavar através de rocha sólida, a menos que tenha um traço que permita isso. Veja também “Deslocamento”.\nDeslocamento de Natação\nUm Deslocamento de Natação pode ser usado para nadar sem gastar o movimento adicional normalmente associado à natação. Veja também “Deslocamento” e “Natação”.\nDeslocamento de Voo\nUm Deslocamento de Voo pode ser utilizado para se mover pelo ar. Enquanto você tiver um Deslocamento de Voo, pode permanecer no ar até pousar, cair ou morrer. Veja também “Deslocamento” e “Voar”.\nDesnutrição [Risco]\nUma criatura necessita de uma quantidade de comida por dia com base em seu tamanho, conforme mostrado na tabela Necessidade de Comida por Dia. Uma criatura que consome menos da metade da comida necessária para um dia deve ser bem-sucedida em uma salvaguarda de Constituição CD 10 ou adquire 1 nível de Exaustão ao final do dia. Uma criatura que não consome nada por 5 dias adquire automaticamente 1 nível de Exaustão ao final do quinto dia, além de um nível adicional ao final de cada dia subsequente sem comida.\nA Exaustão causada por desnutrição não pode ser removida até que a criatura consuma a quantidade total de comida necessária para um dia. Veja também “Exaustão”.\nNecessidade de Comida por Dia\nTamanho\nComida\nMinúsculo\n125 gramas\nPequeno\n0,5 kg\nMédio\n0,5 kg\nGrande\n2 kg\nEnorme\n8 kg\nColossal\n32 kg\nDesvantagem\nSe você tem Desvantagem em um Teste de D20, jogue dois d20 e utilize o resultado mais baixo. Uma jogada não pode ser afetada por mais de uma Desvantagem, e Vantagem e Desvantagem na mesma jogada se anulam. Veja também o capítulo 1 (“Testes de D20”).\nEfeito Mágico\nUm efeito é mágico se for criado por uma magia, um item mágico ou um fenômeno que uma regra rotula como mágico.\nEfeitos Simultâneos\nSe duas ou mais coisas acontecerem simultaneamente em um turno, a pessoa na mesa de jogo — jogador ou Mestre — cujo turno está em andamento decide a ordem em que essas coisas acontecem. Por exemplo, se dois efeitos ocorrerem no início do turno de um personagem do jogador, o jogador determina qual efeito ocorre primeiro.\nEmanação [Área de Efeito]\nUma Emanação é uma área de efeito que se estende em linhas retas a partir de uma criatura ou de outro objeto em todas as direções. O efeito que gera uma Emanação descreve a distância que ela abrange.\nUma Emanação se move junto com a criatura ou objeto que é sua origem, a menos que seja um efeito instantâneo ou fixo.\nA origem de uma Emanação (criatura ou objeto) não está incluída na área de efeito, a menos que seu criador opte por diferente.\nEncontro\nUm encontro é uma cena em uma aventura que faz parte de pelo menos um dos três pilares do jogo: combate, exploração e interação social. Veja também o capítulo 1 (“Combate”, “Exploração” e “Interação Social”).\nEnfeitiçado [Condição]\nEnquanto tem a condição Enfeitiçado, você sofre os seguintes efeitos:\nNão Pode Atacar Quem o Enfeitiçou. Você não pode atacar quem o enfeitiçou nem o ter como alvo de ataques que utilizem atributos ou efeitos mágicos.\nVantagem Social. Quem o enfeitiçou tem Vantagem em qualquer teste de atributo para interações sociais com você.\nEnvenenado [Condição]\nEnquanto tem a condição Envenenado, você sofre os seguintes efeitos.\nTestes de Atributo e Ataques Afetados. Você tem Desvantagem em jogadas de ataque e testes de atributo.\nEscalar\nEnquanto você escala, cada metro de movimento custa 1 metro adicional (2 metros adicionais em Terreno Difícil). Você ignora esse custo adicional se tiver um Deslocamento de Escalada e o utilizar para escalar.\nA critério do Mestre, escalar uma superfície vertical escorregadia ou com poucos pontos de apoio pode exigir um teste bem-sucedido de Força CD 15 (Atletismo).\nEsconder [Ação]\nCom a ação Esconder, você tenta se ocultar. Para isso, deve ser bem-sucedido em um teste de Destreza CD 15 (Furtividade) enquanto estiver Totalmente Obscurecido, atrás de Cobertura de Três Quartos ou Cobertura Total, e deve estar fora da linha de visão de qualquer inimigo; se você puder ver uma criatura, pode avaliar se ela consegue vê-lo.\nEm caso de sucesso, você tem a condição Invisível. Anote o total do seu teste, que é a CD para uma criatura encontrá-lo com um teste de Sabedoria (Percepção). A condição encerra imediatamente após a ocorrência de qualquer uma das seguintes situações: você emitir um som mais alto que um sussurro, um inimigo encontrá-lo, você realizar uma jogada de ataque ou conjurar uma magia que exija um componente Verbal.\nEscuridão\nUma área de Escuridão está Totalmente Obscurecida. Veja também “Totalmente Obscurecido” e o capítulo 1 (“Exploração”).\nEsfera [Área de Efeito]\nUma Esfera é uma área de efeito que se estende em linhas retas a partir de um ponto de origem em todas as direções. O efeito gerado por uma Esfera define a distância que ela abrange como raio da Esfera.\nO ponto de origem de uma Esfera está incluído na sua área de efeito.\nEspaço Desocupado\nUm espaço está desocupado se não houver criaturas nele e não estiver completamente preenchido por objetos.\nEspaço Ocupado\nUm espaço está ocupado se uma criatura está nele ou se ele está completamente preenchido por objetos.\nEspecialização\nEspecialização é uma característica que aprimora o uso de uma proficiência em perícia. Quando você realiza um teste de atributo relacionado a uma perícia na qual é proficiente e possui a característica Especialização, seu Bônus de Proficiência é dobrado para esse teste, a menos que esse bônus já tenha sido duplicado por outra característica.\nAo adquirir a característica Especialização, você deve aplicá-la a uma perícia na qual já seja proficiente. Não é possível ter a característica Especialização em uma mesma perícia mais de uma vez. Veja também o capítulo 1 (“Proficiência”).\nEsquivar [Ação]\nSe você executar a ação Esquivar, você recebe os seguintes benefícios: até o início do seu próximo turno, qualquer jogada de ataque contra você tem Desvantagem se você puder ver o atacante e você realiza salvaguardas de Destreza com Vantagem.\nVocê perde esses benefícios se tem a condição de Incapacitado ou se seu Deslocamento for igual a 0.\nEstável\nUma criatura está Estável se tem 0 Pontos de Vida, mas não é obrigada a realizar Salvaguarda Contra Morte. Veja também o capítulo 1 (“Dano e Cura”).\nExaustão [Condição]\nEnquanto tem a condição Exaustão, você sofre os seguintes efeitos.\nNíveis de Exaustão. Essa condição é acumulativa. Cada vez que você a adquire, recebe 1 nível de Exaustão. Você morre se seu nível de Exaustão atingir 6.\nTestes de D20 Afetados. Ao realizar um Teste de D20, o resultado é reduzido em 2 vezes o seu nível de Exaustão.\nDeslocamento Reduzido. Seu Deslocamento é reduzido por uma quantidade de metros igual a 1,5 vezes o seu nível de Exaustão.\nRemoção de Níveis de Exaustão. Completar um Descanso Longo remove 1 dos seus níveis de Exaustão. Quando seu nível de Exaustão chega a 0, a condição se encerra.\nFicha de Personagens\nUma ficha de personagem é um registro, seja em papel ou digital, que você utiliza para acompanhar as informações do seu personagem. Veja também o capítulo 2.\nFoco de Conjuração\nUm Foco de Conjuração é um objeto que algumas criaturas podem usar para substituir os componentes materiais de uma magia, desde que esses materiais não sejam consumidos pela magia e não tenham um custo especificado. Algumas classes permitem que seus membros utilizem tipos específicos de Focos de Conjuração. Veja também o capítulo 7 (“Conjurando Magias”).\nHostil [Atitude]\nUma criatura Hostil vê você de forma desfavorável. Você tem Desvantagem em um teste de atributo para influenciar uma criatura Hostil. Veja também “Influenciar”.\nIlusões\nMagias e outros efeitos às vezes criam ilusões mágicas. Tal efeito determina o que a ilusão faz e quais sentidos ou faculdades mentais ela engana.\nSe uma ilusão se manifesta no espaço, ela é insubstancial e sem peso, mas parece ser afetada pelo ambiente como se fosse real, a menos que o efeito que a criou especifique o contrário. Por exemplo, uma ilusão visual de uma criatura projeta sombras e reflexos, e o vento parece influenciar a criatura ilusória. Da mesma forma, uma ilusão audível ressoa em um espaço ecoante.\nImobilizado [Condição]\nEnquanto tem a condição Imobilizado, você sofre os seguintes efeitos.\nDeslocamento 0. Seu Deslocamento é 0 e não pode aumentar.\nAtaques Afetados. Você tem Desvantagem em jogadas de ataque contra qualquer alvo que não seja o imobilizador.\nMóvel. O imobilizador pode arrastá-lo ou carregá-lo consigo, mas cada metro de movimento custa 1 metro adicional, a menos que você seja Minúsculo ou dois ou mais tamanhos menores que ele.\nImobilizando\nUma criatura pode imobilizar outra. Personagens geralmente imobilizam utilizando um Ataque Desarmado. Muitos monstros possuem ataques especiais que permitem imobilizar rapidamente suas presas. Sempre que uma imobilização é iniciada, ela segue estas regras. Veja também “Ataque Desarmado” e “Imobilizado”.\nCondição Imobilizado. Imobilizar com sucesso uma criatura impõe a condição Imobilizado.\nUma Mão ou Membro Livre. Uma criatura deve ter uma mão livre para imobilizar outra criatura. Algumas regras e efeitos de jogo permitem imobilizar usando um tentáculo, uma mandíbula ou outro membro do corpo. Independentemente da parte utilizada pelo imobilizador, ele só pode imobilizar uma criatura por vez com aquele membro e não pode usá-lo para atingir outra criatura a menos que termine a imobilização.\nEscapando de uma Imobilização. Uma criatura Imobilizada pode usar sua ação para realizar um teste de Força (Atletismo) ou Destreza (Acrobacia) contra a CD para escapar do imobilizador, encerrando a condição em si mesma em caso de sucesso. A condição também se encerra se o imobilizador tem a condição Incapacitado ou se a distância entre o alvo Imobilizado e o imobilizador ultrapassar o alcance da imobilização.\nImunidade\nSe você tem Imunidade a um tipo de dano ou a uma condição, isso não o afeta de forma alguma.\nIncapacitado [Condição]\nEnquanto tem a condição Incapacitado, você sofre os seguintes efeitos.\nInativo. Você não pode executar nenhuma ação, Ação Bônus ou Reação.\nSem Concentração. Sua Concentração é interrompida.\nSem Fala. Você não pode falar.\nSurpresa. Se você está Incapacitado quando joga Iniciativa, você tem Desvantagem na jogada.\nInconsciente [Condição]\nEnquanto tem a condição Inconsciente, você sofre os seguintes efeitos.\nInerte. Você tem as condições Caído e Incapacitado e solta qualquer coisa que estiver segurando. Quando esta condição se encerra, você continua Caído.\nDeslocamento 0. Seu Deslocamento é 0 e não pode ser aumentado.\nAtaques Afetados. Jogadas de ataque contra você têm Vantagem.\nSalvaguardas Afetadas. Você falha automaticamente em salvaguardas de Força e Destreza.\nAcertos Críticos Automáticos. Qualquer jogada de ataque que o atinge é um Acerto Crítico se o atacante estiver a até 1,5 metro de você.\nAlheio. Você não está ciente do que está ao seu redor.\nIndiferente [Atitude]\nUma criatura Indiferente não tem o desejo de ajudar ou atrapalhar você. Indiferente é a atitude padrão de um monstro. Veja também “Influenciar”.\nInfluenciar [Ação]\nCom a ação Influenciar, você influencia um monstro a realizar algo. Descreva ou interprete como você está se comunicando com o monstro. Você está tentando enganar, intimidar, divertir ou persuadir de forma gentil? O Mestre, então, determina se o monstro se sente voluntário, involuntário ou hesitante devido à sua interação; essa determinação define se um teste de atributo é necessário, conforme explicado abaixo.\nVoluntário. Se a sua solicitação está alinhada com os desejos do monstro, nenhum teste de atributo é necessário; o monstro atende seu pedido da maneira que preferir.\nInvoluntário. Se a sua solicitação é repulsiva para o monstro ou contrária ao seu alinhamento, nenhum teste de atributo é necessário; ele não a atende.\nHesitante. Se você instigar o monstro a realizar algo que ele está hesitante em fazer, você deve realizar um teste de atributo, que é afetado pela atitude do monstro: Amigável, Hostil ou Indiferente, cada uma definida neste glossário. A tabela Testes de Influência sugere qual teste de atributo fazer com base na sua interação com o monstro. O Mestre escolhe o teste, que tem uma CD padrão igual a 15 ou ao valor de Inteligência do monstro, o que for maior. Em caso de sucesso, o monstro faz o que foi instigado. Se falhar, você deve esperar 24 horas (ou um período determinado pelo Mestre) antes de tentar novamente da mesma maneira.\nTestes de Influência\nTeste de Atributo\nInteração\nCarisma (Atuação)\nEntreter um monstro\nCarisma (Enganação)\nEnganar um monstro que entende você\nCarisma (Intimidação)\nIntimidar um monstro\nCarisma (Persuasão)\nPersuadir um monstro que entende você\nSabedoria (Lidar com Animais)\nConvencer com gentileza uma Fera ou Monstruosidade\nIniciativa\nA Iniciativa determina a ordem dos turnos durante o combate. As regras de combate no capítulo 1 explicam como jogar a Iniciativa.\nÀs vezes, um Mestre pode permitir que os combatentes utilizem seus valores de Iniciativa em vez de jogar Iniciativa. Seu valor de Iniciativa é igual a 10 mais seu modificador de Destreza. Se você tem Vantagem nos testes de Iniciativa, aumente seu valor em 5. Se você tem Desvantagem nesses testes, diminua esse valor em 5. Veja também o capítulo 1 (“Combate”).\nInimigo\nUma criatura é seu inimigo se luta contra você em combate, trabalha ativamente para prejudicá-lo ou é designada como seu inimigo pelas regras ou pelo Mestre.\nInspiração Heroica\nSe você (um personagem do jogador) tiver Inspiração Heroica, pode gastá-la para jogar novamente qualquer dado imediatamente após jogá-lo e deve usar o novo resultado.\nSe você receber Inspiração Heroica, mas já a tiver, ela é perdida, a menos que você a dê para um personagem do jogador que não a tenha.\nInvisível [Condição]\nEnquanto tem a condição Invisível, você sofre os seguintes efeitos.\nSurpresa. Se você está Invisível quando joga Iniciativa, tem Vantagem na jogada.\nOculto. Você não é afetado por nenhum efeito que exija que seu alvo seja visto, a menos que o criador do efeito possa vê-lo de alguma forma. Qualquer equipamento que você estiver vestindo ou carregando também está oculto.\nAtaques Afetados. Jogadas de ataque contra você têm Desvantagem, enquanto suas jogadas de ataque têm Vantagem. Se uma criatura puder vê-lo de alguma forma, você não recebe esse benefício contra ela.\nJogada de Ataque\nUma jogada de ataque é um Teste de D20 que representa a realização de um ataque com uma arma, um Ataque Desarmado ou uma magia. Veja também o capítulo 1 (“Testes de D20”).\nJogada de Dano\nUma jogada de dano é uma jogada de dado, ajustada por quaisquer modificadores aplicáveis, que causa dano a um alvo. Veja também o capítulo 1 (“Dano e Cura”).\nLimiar de Dano\nUma criatura ou objeto que possui um limiar de dano tem Imunidade a todo o dano, exceto quando sofre uma quantidade de dano de um único ataque ou efeito igual ou superior ao seu limiar de dano, caso em que sofre toda essa quantidade de dano. Qualquer dano que não atinja ou exceda o limiar de dano é considerado superficial e não reduz os Pontos de Vida. Por exemplo, se um objeto tem um limiar de dano de 10, ele não perde pontos de vida ao sofrer 9 pontos de dano, pois esse valor não ultrapassa o limiar. Se o mesmo objeto sofrer 11 pontos de dano, ele perde essa quantidade de pontos de vida.\nLinha [Área de Efeito]\nUma Linha é uma área de efeito que se estende a partir de um ponto de origem em uma trajetória reta, ao longo de seu comprimento, e cobre uma área definida por sua largura. O efeito gerado por uma Linha detalha seu comprimento e largura.\nO ponto de origem de uma Linha não está incluído na área de efeito, a menos que seu criador decida o contrário.\nLuz Plena\nLuz Plena é uma iluminação normal. Veja também o capítulo 1 (“Exploração”).\nMagia\nUma magia é um efeito mágico que possui as características descritas no capítulo 7.\nMaldições\nAlguns efeitos do jogo impõem uma maldição a uma criatura ou objeto. O efeito que confere a maldição determina suas consequências. As maldições podem ser removidas pelas magias Remover Maldição e Restauração Maior, ou por outra magia que termine explicitamente maldições.\nMeia-luz\nUma área com Meia-luz é Parcialmente Obscurecida. Veja também “Parcialmente Obscurecido” e o capítulo 1 (“Exploração”).\nMetamorfose\nSe um efeito, como a magia Polimorfia ou a característica Forma Selvagem, permite que você se metamorfoseie, a descrição do efeito detalha o que acontece com você. A menos que essa descrição indique o contrário, quaisquer efeitos contínuos em você — condições, magias, maldições e semelhantes — se transferem de uma forma para outra. Você reverte à sua forma verdadeira se morrer.\nMonstro\nUm monstro é uma criatura controlada pelo Mestre, mesmo que a criatura seja benevolente. Veja também “Criatura” e “PNJ”.\nMorto\nUma criatura morta não possui Pontos de Vida e não pode recuperá-los a menos que seja revivida por magia, como as magias Reviver os Mortos ou Revivificar. Quando uma dessas magias é conjurada, o espírito reconhece quem a está conjurando e pode optar por recusar. O espírito de uma criatura morta deixou o corpo e partiu para os Planos Externos, e reviver a criatura requer trazer o espírito de volta.\nSe a criatura retorna à vida, o efeito de reviver determina os Pontos de Vida atuais da criatura. A menos que indicado de outra forma, a criatura volta à vida com todos os seus Pontos de Vida. Qualquer condição, contágio mágico ou maldição que a afetava no momento da morte, se a duração desses efeitos ainda estiver em andamento, persiste. Se a criatura morreu com níveis de Exaustão, retorna com menos níveis. Se a criatura possuía Sintonização com um ou mais itens mágicos, não estará mais sintonizada com eles.\nNatação\nEnquanto você nada, cada metro de movimento custa 1 metro adicional (2 metros adicionais em Terreno Difícil). Você ignora esse custo adicional se tiver um Deslocamento de Natação e usá-lo para nadar. A critério do Mestre, mover-se a qualquer distância em águas turbulentas pode exigir um teste bem-sucedido de Força CD 15 (Atletismo).\nNível de Desafio\nO Nível de Desafio (ND) resume a ameaça que um monstro representa para um grupo de quatro personagens dos jogadores. Quanto maior o ND do monstro em relação ao nível dos personagens, mais perigoso ele se torna. Se o ND for superior, o monstro provavelmente representa uma ameaça séria. Se o ND for inferior, o monstro tende a representar pouca ameaça. No entanto, as circunstâncias e o número de personagens dos jogadores podem alterar significativamente o quão ameaçador um monstro é no jogo real. O Livro do Mestre oferece orientações ao Mestre sobre como utilizar o ND ao planejar encontros de combate potenciais. Veja também “Bloco de Estatísticas”.\nNocauteando uma Criatura\nAo reduzir uma criatura a 0 Pontos de Vida com um ataque corpo a corpo, você pode, em vez disso, reduzi-la a 1 Ponto de Vida. A criatura então adquire a condição Inconsciente e inicia um Descanso Curto.\nA criatura permanece Inconsciente até recuperar qualquer Ponto de Vida ou até que alguém use uma ação para prestar primeiros socorros a ela, exigindo um teste bem-sucedido de Sabedoria (Medicina) CD 10.\nObjeto\nUm objeto é uma coisa não viva e distinta. Coisas compostas, como edifícios, compreendem mais de um objeto. Veja também “Quebrando Objetos”.\nPairar\nAlgumas criaturas podem pairar, conforme indicado em seus blocos de estatísticas, e algumas magias e outros efeitos concedem a habilidade de pairar. Pairar enquanto voa impede você de cair em certas circunstâncias. Veja também “Voar”.\nParalisado [Condição]\nEnquanto tem a condição Paralisado, você sofre os seguintes efeitos.\nIncapacitado. Você adquire a condição Incapacitado.\nDeslocamento 0. Seu Deslocamento é 0 e não pode aumentar.\nSalvaguardas Afetadas. Você falha automaticamente em salvaguardas de Força e Destreza.\nAtaques Afetados. Jogadas de ataque contra você têm Vantagem.\nAcertos Críticos Automáticos. Qualquer jogada de ataque que o atinge é um Acerto Crítico se o atacante estiver a até 1,5 metro de você.\nParcialmente Obscurecido\nVocê tem Desvantagem em testes de Sabedoria (Percepção) para ver algo em um espaço Parcialmente Obscurecido. Veja também “Meia-luz” e o capítulo 1 (“Exploração”).\nPercepção Passiva\nPercepção Passiva é um valor que reflete a consciência geral de uma criatura sobre seu entorno. O Mestre utiliza esse valor para determinar se uma criatura percebe algo sem precisar realizar conscientemente um teste de Sabedoria (Percepção).\nA Percepção Passiva de uma criatura é igual a 10 mais o bônus do teste de Sabedoria (Percepção) da criatura. Se a criatura tem Vantagem nesses testes, aumente o valor em 5. Se a criatura tem Desvantagem nesses testes, diminua o valor em 5. Por exemplo, um personagem de nível 1 com uma Sabedoria de 15 e proficiência em Percepção tem uma Percepção Passiva de 14 (10 + 2 + 2). Se esse personagem tem Vantagem nos testes de Sabedoria (Percepção), o valor se torna 19.\nPerícia\nUma perícia é uma área de domínio relacionada a um teste de atributo. Se você tem proficiência em uma perícia, pode adicionar seu Bônus de Proficiência ao realizar um teste de atributo associado a essa perícia. Veja também o capítulo 1 (“Proficiência”).\nPersonagem do Jogador\nUm personagem do jogador é um personagem controlado por um jogador. Veja também o capítulo 2.\nPersonagem Não Jogador\nUm personagem não jogador (PNJ) é um monstro que possui um nome próprio e uma personalidade distinta. Veja também “Monstro”.\nPetrificado [Condição]\nEnquanto tem a condição Petrificado, você sofre os seguintes efeitos.\nTransformado em Substância Inanimada. Você é transformado, juntamente com qualquer objeto não mágico que esteja vestindo ou carregando, em uma substância sólida e inanimada (geralmente pedra). Seu peso aumenta em dez vezes e você para de envelhecer.\nIncapacitado. Você adquire a condição Incapacitado.\nDeslocamento 0. Seu Deslocamento é 0 e não pode aumentar.\nAtaques Afetados. Jogadas de ataque contra você têm Vantagem.\nSalvaguardas Afetadas. Você falha automaticamente em salvaguardas de Força e Destreza.\nResistência a Dano. Você tem Resistência a todos os danos.\nImunidade a Veneno. Você tem Imunidade à condição Envenenado.\nPontos de Experiência\nÀ medida que superam desafios e completam aventuras, os personagens recebem Pontos de Experiência (XP), concedidos pelo Mestre. Quando o total de XP de um personagem ultrapassa determinados limiares, o nível do personagem aumenta. O Livro do Mestre oferece orientações sobre a concessão de XP. Veja também o capítulo 2 (“Avanço de Nível”).\nPontos de Vida\nPontos de Vida (PV) são uma medida de quão difícil é matar ou destruir uma criatura ou um objeto. O dano reduz os Pontos de Vida, e a cura os recupera. Você não pode ter mais Pontos de Vida do que o seus Pontos de Vida máximos, e não pode ter menos que 0. Veja também “Quebrando Objetos” e capítulo 1 (“Dano e Cura”).\nPontos de Vida Temporários\nPontos de Vida Temporários são concedidos por certos efeitos e funcionam como uma barreira contra a perda de Pontos de Vida reais. Veja também o capítulo 1 (“Dano e Cura”).\nPor Dia\nSe uma regra estabelece que você pode usar algo um certo número de vezes por dia, isso significa que você deve completar um Descanso Longo para utilizá-lo novamente após ter esgotado os usos.\nPossessão\nAlguns efeitos provocam a possessão de uma criatura por outra criatura ou entidade. Um efeito de possessão determina como a possessão funciona. A possessão pode ser evitada pela magia Proteção contra o Bem e o Mal e encerrada pela magia Dissipar o Bem e o Mal.\nPreparar [Ação]\nVocê executa a ação Preparar para aguardar uma circunstância específica antes de agir. Para isso, você executa essa ação em seu turno, o que lhe permite agir com uma Reação antes do início do seu próximo turno.\nPrimeiro, você determina qual circunstância perceptível acionará sua Reação. Em seguida, você escolhe a ação que realizará em resposta a esse gatilho ou decide se mover até o máximo de seu Deslocamento em resposta a ele. Exemplos incluem “Se o cultista pisar na porta do alçapão, eu puxo a alavanca que a abre” e “Se o zumbi se aproximar de mim, eu me afasto”.\nQuando o gatilho ocorre, você pode executar sua Reação logo após o gatilho ocorrer ou ignorá-lo.\nQuando prepara uma magia, você a conjura normalmente (gastando os recursos necessários para isso), mas retém sua energia, que libera com sua Reação quando o gatilho ocorre. Para ser preparada, uma magia deve ter um tempo de conjuração de uma ação, e manter a magia preparada requer Concentração, que você pode sustentar até o início do seu próximo turno. Se sua Concentração for interrompida, a magia se dissipa sem efeito.\nProcurar [Ação]\nAo executar a ação Procurar, você realiza um teste de Sabedoria para perceber algo que não é evidente. A tabela Procurar indica quais perícias são relevantes ao executar essa ação, dependendo do que você está tentando detectar.\nProcurar\nPerícia\nCoisa a Detectar\nIntuição\nEstado mental de uma criatura\nMedicina\nEnfermidade de uma criatura ou causa da morte\nPercepção\nCriatura ou objeto oculto\nSobrevivência\nComida ou rastros\nProficiência\nSe você tem proficiência em algo, pode adicionar seu Bônus de Proficiência a qualquer Teste de D20 que o envolva. Uma criatura pode ter proficiência com uma arma, uma ferramenta, uma salvaguarda ou uma perícia. Veja também o capítulo 1 (“Proficiência”).\nQuebrando Objetos\nObjetos podem ser danificados por ataques e por certas magias, utilizando as regras a seguir. Se um objeto for extremamente frágil, o Mestre pode permitir que uma criatura o quebre automaticamente ao usar a ação Atacar ou Usar Objeto.\nClasse de Armadura. A tabela Classe de Armadura de Objetos sugere valores de CA para diversas substâncias.\nClasse de Armadura de Objetos\nCA\nSubstância\n11\nCorda, papel, tecido\n13\nCristal, gelo, vidro\n15\nMadeira\n17\nPedra\n19\nAço, ferro\n21\nMitral\n23\nAdamantina\nPontos de Vida. Um objeto é considerado destruído quando seus Pontos de Vida chegam a 0. A tabela Pontos de Vida de Objetos sugere valores para objetos frágeis e resilientes que sejam Grandes ou menores. Para monitorar os Pontos de Vida de um objeto Enorme ou Colossal, divida-o em seções Grandes ou menores e acompanhe os Pontos de Vida de cada seção separadamente. O Mestre decide se a destruição de parte de um objeto resulta em sua destruição total.\nPontos de Vida de Objetos\nTamanho\nFragilidade\nResiliência\nMinúsculo (garrafa, fechadura)\n2 (1d4)\n5 (2d4)\nPequeno (alaúde, baú)\n3 (1d6)\n10 (3d6)\nMédio (barril, lustre)\n4 (1d8)\n18 (4d8)\nGrande (carroça, mesa de jantar)\n5 (1d10)\n27 (5d10)\nObjetos e Tipos de Dano. Objetos possuem Imunidade a dano Psíquico e Venenoso. O Mestre pode determinar que certos tipos de dano são mais ou menos eficazes contra um objeto. Por exemplo, dano Contundente é eficaz para esmagar, mas não para cortar. Objetos de papel ou tecido podem ter Vulnerabilidade a dano Ígneo.\nLimiar de Dano. Objetos Grandes, como paredes de castelos, frequentemente apresentam resiliência extra, representada por um limiar de dano. Veja também “Limiar de Dano”.\nNenhum Valor de Atributo. Um objeto não possui valores de atributo, a menos que uma regra os atribua ao objeto. Sem valores de atributo, um objeto não pode realizar testes de atributo e falha em todas as salvaguardas.\nQueda [Risco]\nUma criatura em queda sofre 1d6 pontos de dano Contundente no final da queda para cada 3 metros que caiu, até um máximo de 20d6. Assim que atinge a superfície, ela permanece Caída, a menos que consiga evitar sofrer o dano da queda.\nUma criatura que cai em água ou em outro líquido pode usar sua Reação para realizar um teste de Força CD 15 (Atletismo) ou Destreza CD 15 (Acrobacia) para atingir primeiro a superfície com a cabeça ou os pés. Em caso de sucesso, qualquer dano resultante da queda é reduzido pela metade.\nRastejar\nAo rastejar, cada metro de movimento custa 1 metro adicional (2 metros adicionais em Terreno Difícil). Veja também \"Deslocamento\".\nReação\nUma Reação é uma ação especial que você executa em resposta a um gatilho descrito na sua descrição. Você pode executar uma Reação durante o turno de outra criatura. Mesmo que você execute uma Ação, uma Ação Bônus ou ambas no seu turno, ainda pode executar uma Reação. No entanto, após utilizar uma Reação, você deve esperar até o início do seu próximo turno para executar outra. O Ataque de Oportunidade é um exemplo de Reação disponível para todas as criaturas. Veja também “Ataques de Oportunidade” e o capítulo 1 (“Ações”) para mais informações.\nResistência\nSe você tem Resistência a um tipo de dano, o dano desse tipo é reduzido pela metade contra você (arredondado para baixo). A Resistência é aplicada apenas uma vez por incidência de dano. Veja também o capítulo 1 (“Dano e Cura”).\nRisco\nUm risco é um perigo do ambiente. Veja também “Asfixia”, “Combustão”, “Desidratação”, “Desnutrição” e “Queda”.\nRitual\nSe você possui uma magia preparada que tem o marcador Ritual, pode conjurar essa magia como um Ritual. A versão Ritual de uma magia leva 10 minutos a mais para ser conjurada do que o normal. Além disso, não gasta um espaço de magia, o que significa que a versão ritual de uma magia não pode ser conjurada em um círculo superior. Veja também o capítulo 7.\nSaltar\nAo saltar, você realiza um Salto em Distância (horizontal) ou um Salto em Altura (vertical). Veja também “Salto em Altura” e “Salto em Distância”.\nSalto em Altura\nAo realizar um Salto em Altura, você salta no ar o equivalente a 1 metro mais 30 centímetros por ponto em seu modificador de Força (mínimo 0), desde que consiga se mover pelo menos 3 metros a pé imediatamente antes do salto. Ao realizar um Salto em Altura parado, você pode saltar apenas metade dessa altura. De qualquer forma, cada metro que você saltar custa um metro de movimento.\nVocê pode estender os braços até a metade de sua altura acima de si mesmo durante o salto. Dessa forma, você pode alcançar uma distância equivalente à altura do salto mais 1,5 vez sua altura.\nSalto em Distância\nAo realizar um Salto em Distância, você salta horizontalmente uma distância equivalente a 30 centímetros para cada ponto do seu atributo Força, desde que consiga se mover pelo menos 3 metros a pé imediatamente antes do salto. Ao realizar um Salto em Distância parado, você só pode saltar metade dessa distância. Em ambos os casos, cada metro que você salta custa 1 metro de movimento.\nSe você descer em Terreno Difícil, deve ser bem-sucedido em um teste de Destreza CD 10 (Acrobacia) ou fica Caído.\nEsta regra de Salto em Distância considera que a altura do salto é irrelevante, como em um salto sobre um riacho ou desfiladeiro. A critério do Mestre, você deve ser bem-sucedido em um teste de Força CD 10 (Atletismo) para superar um obstáculo baixo (não mais alto que um quarto da distância do salto), como uma cerca viva ou um muro baixo. Caso contrário, você colide com o obstáculo.\nSalvaguarda\nUma salvaguarda — também chamada de SG — representa uma tentativa de evitar ou resistir a uma ameaça. Normalmente, você faz uma salvaguarda apenas quando uma regra exige, mas pode optar por falhar na salvaguarda sem jogar. O resultado de uma salvaguarda é detalhado no efeito que a solicitou. Se um alvo for forçado a realizar uma salvaguarda e não possui o valor de atributo correspondente, o alvo falha automaticamente. Veja também o capítulo 1 (“Testes de D20”).\nSalvaguarda Contra Morte\nUm personagem do jogador deve realizar uma Salvaguarda contra Morte se iniciar seu turno com 0 Pontos de Vida. Veja também o capítulo 1 (“Dano e Cura”).\nSangrando\nUma criatura está Sangrando enquanto tiver metade ou menos de seus Pontos de Vida restantes.\nSG\nSG é uma abreviação do termo salvaguarda. Veja também “Salvaguarda”.\nSintonização\nAlguns itens mágicos requerem que uma criatura estabeleça um vínculo — denominado Sintonização — com eles antes que a criatura possa utilizar as propriedades mágicas do item. Uma criatura pode ter Sintonização com no máximo três itens mágicos simultaneamente. Veja também o capítulo 6 (“Itens Mágicos”).\nSismiconsciência\nUma criatura com Sismiconsciência é capaz de localizar criaturas e objetos em movimento dentro de um alcance específico, desde que tanto a criatura com Sismiconsciência quanto qualquer coisa que ela esteja detectando estejam em contato com a mesma superfície (como o chão, uma parede ou um teto) ou o mesmo líquido.\nSismiconsciência não pode detectar criaturas ou objetos no ar, e não conta como uma forma de visão.\nSurdo [Condição]\nEnquanto estiver na condição Surdo, você sofre o seguinte efeito.\nNão Pode Ouvir. Você não pode ouvir e falha automaticamente em qualquer teste de atributo que dependa da audição.\nSurpresa\nSe uma criatura é pega desprevenida no início de um combate, essa criatura está surpresa, concedendo Desvantagem em sua jogada de Iniciativa. Veja também o capítulo 1 (“Combate”).\nTamanho\nUma criatura ou um objeto pertence a uma categoria de tamanho: Minúsculo, Pequeno, Médio, Grande, Enorme ou Colossal. O tamanho de uma criatura determina quanto espaço ela ocupa em combate, enquanto o tamanho de um objeto influencia seus Pontos de Vida. Veja também “Quebrando Objetos” e o capítulo 1 (“Combate”).\nTelepatia\nTelepatia é uma habilidade mágica que permite a uma criatura se comunicar mentalmente com outra dentro de um alcance específico. A menos que uma regra indique o contrário, a criatura contactada não precisa compartilhar um idioma com o telepata para entender essa comunicação, mas deve ser capaz de compreender pelo menos um idioma ou ser telepática para captar a mensagem.\nUm telepata não precisa ver a criatura contatada e pode iniciar ou encerrar o contato telepático a qualquer momento (nenhuma ação é necessária). O contato telepático não pode ser iniciado e é imediatamente interrompido se o telepata ou a outra criatura estiverem com a condição Incapacitado. O contato telepático também é interrompido se a criatura contatada não estiver mais dentro do alcance da telepatia ou se o telepata contatar uma criatura diferente dentro do alcance.\nUma criatura sem telepatia pode receber mensagens telepáticas, mas não consegue iniciar uma conversa telepática. Uma vez que a conversa telepática se inicia, a criatura não telepata pode se comunicar mentalmente com o telepata até que a conexão telepática se encerre.\nTeleporte\nTeleporte é um tipo especial de transporte mágico. Ao se teleportar, você desaparece e reaparece instantaneamente em outro lugar, sem percorrer o espaço intermediário. Esse transporte não consome movimento, a menos que uma regra indique o contrário, e o teleporte nunca provoca Ataques de Oportunidade. Ao se teleportar, todo o equipamento que está vestindo e carregando se teleporta com você. Se você estiver tocando outra criatura ao se teleportar, essa criatura não se teleporta com você, a menos que o efeito de teleporte indique o contrário.\nSe o espaço de destino do seu teleporte estiver ocupado por outra criatura ou bloqueado por um obstáculo sólido, você aparece no espaço desocupado mais próximo à sua escolha.\nA descrição de um efeito de teleporte informa se você deve ver o destino do teleporte.\nTerreno Difícil\nSe um espaço for classificado como Terreno Difícil, cada metro percorrido nesse terreno custa 1 metro adicional. Por exemplo, para mover-se 1,5 metros em um Terreno Difícil, será necessário um total de 3 metros de movimento.Terreno Difícil não é cumulativo; ou o espaço é considerado Terreno Difícil, ou não é.\nUm espaço é considerado Terreno Difícil se contiver qualquer um dos seguintes elementos ou algo semelhante:\nUma criatura que não seja Minúscula ou sua aliada\nMóveis projetados para criaturas do seu tamanho ou maiores\nNeve pesada, gelo, escombros ou vegetação rasteira\nLíquido que esteja entre a altura da canela e da cintura\nAbertura estreita dimensionada para uma criatura de um tamanho menor que o seu\nUma inclinação de 20 graus ou mais\nTeste de Atributo\nUm teste de atributo é um Teste de D20 que representa a utilização de um dos seis atributos — ou uma perícia específica relacionada a um desses atributos — para superar um desafio. Veja também o capítulo 1 (“Proficiência” e “Testes de D20”).\nTipo de Criatura\nCada criatura, incluindo cada personagem do jogador, possui um marcador nas regras que identifica seu tipo. A maioria dos personagens dos jogadores é do tipo Humanoide. Estes são os tipos de criaturas presentes no jogo:\nAberração\nCelestial\nConstructo\nDragão\nElemental\nFeérico\nFera\nGigante\nGosma\nHumanoide\nÍnfero\nMonstruosidade\nMorto-vivo\nPlanta\nOs tipos não têm regras próprias, mas algumas regras no jogo afetam criaturas de certos tipos de maneiras diferentes.\nTeste de D20\nTestes de D20 incluem as três principais jogadas de d20 do jogo: jogadas de ataque, salvaguardas e testes de atributo. Se algo no jogo impacta os Testes de D20, isso afeta todas as três jogadas. O Mestre decide se um Teste de D20 é necessário em uma situação específica. Veja também o capítulo 1 (“Testes de D20”).\nTipos de Dano\nAtaques e outros efeitos prejudiciais causam diferentes tipos de dano. Os tipos de dano não possuem regras próprias, mas outras regras, como Resistência, dependem deles. A tabela Tipos de Dano oferece exemplos para ajudar o Mestre a atribuir um tipo a um novo efeito.\nTipos de Dano\nTipo\nExemplos\nÁcido\nLíquidos corrosivos, enzimas digestivas\nContundente\nObjetos contundentes, constrição, queda\nCortante\nGarras, objetos cortantes\nElétrico\nEletricidade\nEnergético\nEnergia mágica pura\nGélido\nÁgua gelada, explosões de gelo\nÍgneo\nChamas, calor insuportável\nNecrótico\nEnergia que consome a vida\nPerfurante\nPresas, objetos perfurantes\nPsíquico\nEnergia dilacerante para a mente\nRadiante\nEnergia sagrada, radiação abrasadora\nTrovejante\nSom contundente\nVenenoso\nGás tóxico, veneno\nTotalmente Obscurecido\nVocê tem a condição Cego enquanto tenta ver algo em um espaço Totalmente Obscurecido. Veja também “Cego,” “Escuridão,” e o capítulo 1 (“Exploração”).\nTreinamento com Armadura\nO treinamento com armadura permite que você utilize armaduras de uma determinada categoria sem as desvantagens a seguir. Se você usar armadura Leve, Média ou Pesada e não tiver treinamento, você sofre Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, além de não poder conjurar magias. Se você usar um Escudo e não tiver treinamento, não recebe o bônus de CA dele. Veja também “Desvantagem” e o capítulo 6 (“Armadura”).\nTruque\nUm truque é uma magia de círculo 0, que é conjurada sem o uso de um espaço de magia. Veja também o capítulo 7.\nUsar Magia [Ação]\nQuando executa a ação Usar Magia, você conjura uma magia que possui o tempo de conjuração de uma ação ou utiliza uma característica ou item mágico que requer uma ação Usar Magia para ser ativada.\nSe conjurar uma magia com um tempo de conjuração de 1 minuto ou mais, você deve executar a ação Usar Magia em cada turno dessa conjuração e manter a Concentração enquanto o faz. Se sua Concentração for interrompida, a magia falha, mas você não gasta um espaço de magia. Veja também “Concentração”.\nUsar Objeto [Ação]\nVocê interage normalmente com um objeto enquanto realiza outra coisa, como quando saca uma espada como parte da ação Atacar. Quando um objeto exige uma ação para ser utilizado, você executa a ação Usar Objeto.\nValor de Atributo e Modificador\nUma criatura possui seis valores de atributo — Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma — cada um com um modificador correspondente. Adicione o modificador ao realizar um Teste de D20 com o atributo correspondente ou quando uma regra exigir. Veja também o capítulo 1 (“Os Seis Atributos”).\nVantagem\nSe você tiver Vantagem em um Teste de D20, jogue dois d20 e utilize o resultado mais alto. Uma jogada não pode ser afetada por mais de uma Vantagem, e Vantagem e Desvantagem na mesma jogada se anulam. Veja também o capítulo 1 (“Testes de D20”).\nVisão às Cegas\nSe você possui Visão às Cegas, pode enxergar dentro de um alcance específico sem depender da visão física. Dentro desse alcance, você consegue ver qualquer coisa que não esteja atrás de Cobertura Total, mesmo se estiver na condição Cego ou em Escuridão. Além disso, dentro desse alcance, você pode perceber algo que tenha a condição Invisível.\nVisão no Escuro\nSe você possui Visão no Escuro, consegue enxergar na Meia-luz em um alcance específico como se fosse Luz Plena e na Escuridão dentro desse alcance como se fosse Meia-luz. Você percebe cores nessa Escuridão apenas como tons de cinza. Veja também o capítulo 1 (“Exploração”).\nVisão Verdadeira\nSe você possui Visão Verdadeira, sua percepção é ampliada em um alcance determinado. Dentro desse alcance, sua visão penetra através de:\nEscuridão. Você pode ver na Escuridão normal e mágica.\nInvisibilidade. Você vê criaturas e objetos com a condição Invisível.\nIlusões Visuais. Ilusões visuais aparecem transparentes para você, e você é automaticamente bem-sucedido em salvaguardas contra elas.\nTransformações. Você percebe a verdadeira forma de qualquer criatura ou objeto que tenha sido transformado por magia.\nPlano Etéreo. Você vê no Plano Etéreo. Veja também o apêndice A (“Planos Transitivos”).\nVoar\nUma variedade de efeitos permite que uma criatura voe. Enquanto estiver voando, você cai se estiver Caído ou Incapacitado, ou se seu Deslocamento de Voo for reduzido a 0. Você pode permanecer no ar nessas circunstâncias se conseguir pairar. Veja também “Deslocamento de Voo” e “Queda”.\nVulnerabilidade\nSe você possui Vulnerabilidade a um tipo de dano, o dano desse tipo é duplicado contra você. A Vulnerabilidade é aplicada apenas uma vez a cada ocorrência de dano. Veja também o capítulo 1 (“Dano e Cura”).\nCrie Personagens Heroicos\nEsta versão revisada e ampliada do Livro do Jogador é a referência essencial para os jogadores de Dungeons & Dragons da quinta edição. Ele contém regras para criação e evolução de personagens, exploração, combate, equipamentos, magias e muito mais.\nDesenvolva heróis notáveis de D&D a partir de uma ampla seleção de origens, classes e subclasses de personagens. Explore ruínas antigas e masmorras mortais. Enfrente monstros e busque tesouros lendários, ganhando experiência e poder em terras desconhecidas com seus companheiros.",
    "source": {
      "book": "PHB 2024",
      "page": 0
    }
  }
];

function normalizeSpell(spell: SpellData): SpellData {
  const classes = [...new Set(spell.classes)].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const components = [...new Set(spell.components.map((part) => part.trim()).filter(Boolean))];
  return { ...spell, classes, components };
}

export const spells: SpellData[] = rawSpells.map(normalizeSpell).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

export function getSpellSchools(): string[] {
  return [...new Set(spells.map((s) => s.school))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
