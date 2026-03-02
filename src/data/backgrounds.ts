import type { AbilityKey } from "@/utils/calculations";
import { feats } from "@/data/feats";

export type BackgroundToolGrant = string;

export interface BackgroundEquipmentItem {
  itemId: string;
  qty: number;
  includesChosenTool?: boolean;
}

export interface BackgroundEquipmentOption {
  items: BackgroundEquipmentItem[];
  gold: number;
}

export interface Background {
  id: string;
  name: string;
  description: string;
  abilityOptions: AbilityKey[];
  skillsGranted: string[];
  toolsGranted: BackgroundToolGrant[];
  languages: string[];
  originFeatId: string;
  equipmentOptionA: BackgroundEquipmentOption;
  equipmentOptionB: { gold: 50 };
  abilityBonuses: { mode: "choose" };
  /** Compat legada */
  skills: string[];
  grantedSkills: string[];
  tools: string[];
  originFeat: { id: string; name: string; description: string };
  /** Compat legada para a etapa de equipamento */
  equipmentChoices: { id: "A" | "B"; label: string; items: string[]; gold: number }[];
}

type ItemInput = [string, number] | { itemId: string; qty: number; includesChosenTool?: boolean };

const makeItems = (items: ItemInput[]): BackgroundEquipmentItem[] =>
  items.map((entry) => {
    if (Array.isArray(entry)) {
      const [itemId, qty] = entry;
      return { itemId, qty };
    }
    return entry;
  });

function makeBackground(
  input: Omit<
    Background,
    "abilityBonuses" | "equipmentChoices" | "skills" | "grantedSkills" | "tools" | "originFeat"
  >
): Background {
  const optionAItemsAsText = input.equipmentOptionA.items.flatMap((entry) =>
    Array.from({ length: entry.qty }, () =>
      entry.includesChosenTool ? `${entry.itemId} (o mesmo escolhido na proficiência)` : entry.itemId
    )
  );

  const feat = feats.find((item) => item.id === input.originFeatId);

  return {
    ...input,
    abilityBonuses: { mode: "choose" },
    skills: input.skillsGranted,
    grantedSkills: input.skillsGranted,
    tools: input.toolsGranted,
    originFeat: { id: input.originFeatId, name: feat?.name ?? input.originFeatId, description: feat?.description ?? "" },
    equipmentChoices: [
      { id: "A", label: "Pacote do antecedente", items: optionAItemsAsText, gold: input.equipmentOptionA.gold },
      { id: "B", label: "Riqueza inicial alternativa", items: [], gold: input.equipmentOptionB.gold },
    ],
  };
}

export const backgrounds: Background[] = [
  makeBackground({
    id: "acolito",
    name: "Acólito",
    description:
      "Você se dedicou ao serviço em um templo, localizado em uma aldeia ou em um bosque sagrado, onde realizava ritos em homenagem a um deus ou panteão. Sob a orientação de um sacerdote, você estudou religião e, graças à sua devoção, aprendeu a canalizar um pouco do poder divino para o seu local de culto e para as pessoas que ali oravam.",
    abilityOptions: ["int", "wis", "cha"],
    skillsGranted: ["Intuição", "Religião"],
    toolsGranted: ["Suprimentos de Calígrafo"],
    languages: [],
    originFeatId: "iniciado-magia-clerigo",
    equipmentOptionA: {
      items: makeItems([
        ["Suprimentos de Calígrafo", 1],
        ["Livro (orações)", 1],
        ["Símbolo Sagrado", 1],
        ["Pergaminho (10 folhas)", 1],
        ["Túnica", 1],
      ]),
      gold: 8,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "andarilho",
    name: "Andarilho",
    description:
      "Você cresceu nas ruas cercado por rejeitados igualmente malfadados, alguns deles amigos e outros rivais. Você dormia onde podia e fazia bicos por comida. Às vezes, quando a fome se tornava insuportável, você recorria ao furto. Ainda assim, você nunca perdeu seu orgulho e nunca abandonou a esperança. O destino ainda não terminou com você.",
    abilityOptions: ["dex", "wis", "cha"],
    skillsGranted: ["Furtividade", "Intuição"],
    toolsGranted: ["Ferramentas de Ladrão"],
    languages: [],
    originFeatId: "sortudo",
    equipmentOptionA: {
      items: makeItems([
        ["Adaga", 2],
        ["Ferramentas de Ladrão", 1],
        ["Kit de Jogos (qualquer um)", 1],
        ["Algibeira", 2],
        ["Roupas de Viagem", 1],
        ["Saco de Dormir", 1],
      ]),
      gold: 16,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "artesao",
    name: "Artesão",
    description:
      "Você começou a limpar o chão e esfregar balcões na oficina de um artesão por alguns trocados por dia assim que ficou forte o suficiente para carregar um balde. Ao se tornar aprendiz, aprendeu a fabricar artesanatos básicos e a lidar com clientes exigentes, desenvolvendo também um olhar aguçado para detalhes.",
    abilityOptions: ["str", "dex", "int"],
    skillsGranted: ["Investigação", "Persuasão"],
    toolsGranted: ["Escolha um tipo de Ferramentas de Artesão (veja o capítulo 6)"],
    languages: [],
    originFeatId: "artifista",
    equipmentOptionA: {
      items: makeItems([
        { itemId: "Ferramentas de Artesão", qty: 1, includesChosenTool: true },
        ["Algibeira", 2],
        ["Roupas de Viagem", 1],
      ]),
      gold: 32,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "artista",
    name: "Artista",
    description:
      "Você passou a juventude em feiras e festivais itinerantes, fazendo bicos para músicos e acrobatas em troca de aulas. Aprendeu a andar na corda bamba, tocar alaúde de um jeito distinto e recitar poesia com dicção impecável. Até hoje, prospera com aplausos e anseia pelo palco.",
    abilityOptions: ["str", "dex", "cha"],
    skillsGranted: ["Acrobacia", "Atuação"],
    toolsGranted: ["Escolha um tipo de Instrumento Musical (veja o capítulo 6)"],
    languages: [],
    originFeatId: "musico",
    equipmentOptionA: {
      items: makeItems([
        { itemId: "Instrumento Musical", qty: 1, includesChosenTool: true },
        ["Espelho", 1],
        ["Fantasia", 2],
        ["Perfume", 1],
        ["Roupas de Viagem", 1],
      ]),
      gold: 11,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "charlatao",
    name: "Charlatão",
    description:
      "Assim que você atingiu a idade para pedir uma cerveja, escolheu seu banquinho favorito em cada taverna a quinze quilômetros de onde nasceu. Ao percorrer o circuito de bares e botequins, aprendeu a lidar com os infelizes em busca de mentiras reconfortantes — talvez uma poção falsa ou registros de ancestralidade forjados.",
    abilityOptions: ["dex", "con", "cha"],
    skillsGranted: ["Enganação", "Prestidigitação"],
    toolsGranted: ["Kit de Falsificação"],
    languages: [],
    originFeatId: "habilidoso",
    equipmentOptionA: {
      items: makeItems([
        ["Kit de Falsificação", 1],
        ["Fantasia", 1],
        ["Roupas Finas", 1],
      ]),
      gold: 15,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "criminoso",
    name: "Criminoso",
    description:
      "Você sobrevivia em becos escuros, furtando pessoas ou assaltando lojas. Talvez fizesse parte de uma pequena gangue de criminosos que se protegiam mutuamente, ou fosse um lobo solitário, enfrentando a guilda dos ladrões locais e os criminosos mais temíveis.",
    abilityOptions: ["dex", "con", "int"],
    skillsGranted: ["Furtividade", "Prestidigitação"],
    toolsGranted: ["Ferramentas de Ladrão"],
    languages: [],
    originFeatId: "alerta",
    equipmentOptionA: {
      items: makeItems([
        ["Adaga", 2],
        ["Ferramentas de Ladrão", 1],
        ["Algibeira", 2],
        ["Pé de Cabra", 1],
        ["Roupas de Viagem", 1],
      ]),
      gold: 16,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "eremita",
    name: "Eremita",
    description:
      "Você passou seus primeiros anos isolado em uma cabana ou mosteiro localizado bem além dos arredores do povoado mais próximo. Naqueles dias, seus únicos companheiros eram as criaturas da floresta e aqueles que ocasionalmente faziam uma visita para trazer suprimentos e notícias do mundo externo. A solidão permitia que você passasse muitas horas ponderando os mistérios da criação.",
    abilityOptions: ["con", "wis", "cha"],
    skillsGranted: ["Medicina", "Religião"],
    toolsGranted: ["Kit de Herbalismo"],
    languages: [],
    originFeatId: "curandeiro",
    equipmentOptionA: {
      items: makeItems([
        ["Cajado", 1],
        ["Kit de Herbalismo", 1],
        ["Lâmpada", 1],
        ["Livro (filosofia)", 1],
        ["Óleo (3 frascos)", 1],
        ["Roupas de Viagem", 1],
        ["Saco de Dormir", 1],
      ]),
      gold: 16,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "escriba",
    name: "Escriba",
    description:
      "Você passou anos de formação em um scriptorium, um mosteiro dedicado à preservação do conhecimento ou uma agência governamental, onde aprendeu a escrever com uma mão firme e produzir textos finamente escritos. Talvez você tenha escrito documentos governamentais ou copiado tomos de literatura. Você pode ter alguma habilidade como escritor de poesia, narrativa ou pesquisa acadêmica. Acima de tudo, você tem uma atenção cuidadosa aos detalhes, o que lhe ajuda a evitar a introdução de erros aos documentos que você copia e cria.",
    abilityOptions: ["dex", "int", "wis"],
    skillsGranted: ["Investigação", "Percepção"],
    toolsGranted: ["Suprimentos de Calígrafo"],
    languages: [],
    originFeatId: "habilidoso",
    equipmentOptionA: {
      items: makeItems([
        ["Suprimentos de Calígrafo", 1],
        ["Lâmpada", 1],
        ["Óleo (3 frascos)", 1],
        ["Pergaminho (12 folhas)", 1],
        ["Roupas Finas", 1],
      ]),
      gold: 23,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "fazendeiro",
    name: "Fazendeiro",
    description:
      "Você cresceu perto da terra. Os anos cuidando de animais e cultivando a terra o recompensaram com paciência e boa saúde. Você tem um grande apreço pela generosidade da natureza, juntamente com um respeito saudável pela ira dela.",
    abilityOptions: ["str", "con", "wis"],
    skillsGranted: ["Lidar com Animais", "Natureza"],
    toolsGranted: ["Ferramentas de Carpinteiro"],
    languages: [],
    originFeatId: "vigoroso",
    equipmentOptionA: {
      items: makeItems([
        ["Foice", 1],
        ["Ferramentas de Carpinteiro", 1],
        ["Kit de Curandeiro", 1],
        ["Balde de Ferro", 1],
        ["Pá", 1],
      ]),
      gold: 30,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "guarda",
    name: "Guarda",
    description:
      "Seus pés doem quando você se lembra das incontáveis horas que passou em seu posto na torre. Você foi treinado para manter um olho atento para o que ocorria do lado fora da muralha, observando saqueadores vasculhando a floresta próxima, e seu outro olho voltado para dentro da muralha, procurando por assaltantes e encrenqueiros.",
    abilityOptions: ["str", "int", "wis"],
    skillsGranted: ["Atletismo", "Percepção"],
    toolsGranted: ["Escolha um tipo de Kit de Jogos (veja o capítulo 6)"],
    languages: [],
    originFeatId: "alerta",
    equipmentOptionA: {
      items: makeItems([
        ["Lança", 1],
        ["Besta Leve", 1],
        ["Virote", 20],
        { itemId: "Kit de Jogo", qty: 1, includesChosenTool: true },
        ["Aljava", 1],
        ["Grilhões", 1],
        ["Lanterna Coberta", 1],
        ["Roupas de Viagem", 1],
      ]),
      gold: 12,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "guia",
    name: "Guia",
    description:
      "Você cresceu ao ar livre, longe de terras povoadas. Sua casa ficava em qualquer lugar que você escolhesse para estender seu saco de dormir. Há maravilhas na natureza — monstros estranhos, florestas e riachos intocados, ruínas imensas de grandes salões outrora pisados por gigantes — e você aprendeu a se defender enquanto as explorava. De tempos em tempos, você guiava sacerdotes da natureza amigáveis que o instruíam nos fundamentos de canalizar a magia da natureza.",
    abilityOptions: ["dex", "con", "wis"],
    skillsGranted: ["Furtividade", "Sobrevivência"],
    toolsGranted: ["Ferramentas de Cartógrafo"],
    languages: [],
    originFeatId: "iniciado-magia-druida",
    equipmentOptionA: {
      items: makeItems([
        ["Arco Curto", 1],
        ["Flecha", 20],
        ["Ferramentas de Cartógrafo", 1],
        ["Aljava", 1],
        ["Roupas de Viagem", 1],
        ["Saco de Dormir", 1],
        ["Tenda", 1],
      ]),
      gold: 3,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "marinheiro",
    name: "Marinheiro",
    description:
      "Você viveu como um marinheiro, com o vento nas costas e os conveses balançando sob seus pés. Você já se sentou em bancos de bar em mais portos de escala do que consegue se lembrar, enfrentou grandes tempestades e trocou histórias com pessoas que vivem sob as ondas.",
    abilityOptions: ["str", "dex", "wis"],
    skillsGranted: ["Acrobacia", "Percepção"],
    toolsGranted: ["Ferramentas de Navegador"],
    languages: [],
    originFeatId: "valentao-taverna",
    equipmentOptionA: {
      items: makeItems([
        ["Adaga", 1],
        ["Ferramentas de Navegador", 1],
        ["Corda", 1],
        ["Roupas de Viagem", 1],
      ]),
      gold: 20,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "mercador",
    name: "Mercador",
    description:
      "Você foi aprendiz de um comerciante, mestre de caravanas ou lojista, aprendendo os fundamentos do comércio. Com ele, viajou bastante e ganhou a vida comprando e vendendo as matérias-primas que os artesãos precisam para praticar seu ofício, ou trabalhos acabados de tais artesãos. Você pode ter transportado mercadorias de um lugar para outro (por navio, carroça ou caravana) ou comprado de comerciantes viajantes e vendido em sua própria loja.",
    abilityOptions: ["con", "int", "cha"],
    skillsGranted: ["Lidar com Animais", "Persuasão"],
    toolsGranted: ["Ferramentas de Navegador"],
    languages: [],
    originFeatId: "sortudo",
    equipmentOptionA: {
      items: makeItems([
        ["Ferramentas de Navegador", 1],
        ["Algibeira", 2],
        ["Roupas de Viagem", 1],
      ]),
      gold: 22,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "nobre",
    name: "Nobre",
    description:
      "Você foi criado em um castelo, cercado por riqueza, poder e privilégio. Sua família de aristocratas menores garantiu que você recebesse uma educação de primeira categoria, com conteúdos que você apreciava e outros dos quais se ressentia. Seu tempo no castelo, especialmente as muitas horas que passou observando sua família na corte, também lhe ensinou muito sobre liderança.",
    abilityOptions: ["str", "int", "cha"],
    skillsGranted: ["História", "Persuasão"],
    toolsGranted: ["Escolha um tipo de Kit de Jogos (veja o capítulo 6)"],
    languages: [],
    originFeatId: "habilidoso",
    equipmentOptionA: {
      items: makeItems([
        { itemId: "Kit de Jogo", qty: 1, includesChosenTool: true },
        ["Perfume", 1],
        ["Roupas Finas", 1],
      ]),
      gold: 29,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "sabio",
    name: "Sábio",
    description:
      "Você passou seus anos de formação viajando entre mansões e mosteiros, realizando vários bicos e serviços em troca de acesso às bibliotecas desses locais. Suas noites se resumiram a estudar livros e pergaminhos, aprendendo a sabedoria do multiverso — até mesmo os rudimentos da magia — e, agora, sua mente anseia por mais.",
    abilityOptions: ["con", "int", "wis"],
    skillsGranted: ["Arcanismo", "História"],
    toolsGranted: ["Suprimentos de Calígrafo"],
    languages: [],
    originFeatId: "iniciado-magia-mago",
    equipmentOptionA: {
      items: makeItems([
        ["Cajado", 1],
        ["Suprimentos de Calígrafo", 1],
        ["Livro (história)", 1],
        ["Pergaminho (8 folhas)", 1],
        ["Túnica", 1],
      ]),
      gold: 8,
    },
    equipmentOptionB: { gold: 50 },
  }),
  makeBackground({
    id: "soldado",
    name: "Soldado",
    description:
      "Você começou a treinar para a guerra assim que atingiu a idade adulta e tem poucas lembranças preciosas da vida antes de pegar em armas. A batalha está em seu sangue. Às vezes, você se pega realizando reflexivamente os exercícios básicos de luta que aprendeu primeiro. Por fim, você coloca esse treinamento em prática no campo de batalha, protegendo o reino por meio da guerra.",
    abilityOptions: ["str", "dex", "con"],
    skillsGranted: ["Atletismo", "Intimidação"],
    toolsGranted: ["Escolha um tipo de Kit de Jogos (veja o capítulo 6)"],
    languages: [],
    originFeatId: "atacante-selvagem",
    equipmentOptionA: {
      items: makeItems([
        ["Lança", 1],
        ["Arco Curto", 1],
        ["Flecha", 20],
        ["Kit de Curandeiro", 1],
        { itemId: "Kit de Jogo", qty: 1, includesChosenTool: true },
        ["Aljava", 1],
        ["Roupas de Viagem", 1],
      ]),
      gold: 14,
    },
    equipmentOptionB: { gold: 50 },
  }),
].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

export const backgroundsById: Record<string, Background> = Object.fromEntries(backgrounds.map((b) => [b.id, b]));
