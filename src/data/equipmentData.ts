export interface EquipmentPackage {
  optionA: {
    items: string[];
    gold: number;
    description: string;
  };
  optionB: {
    gold: number;
    description: string;
  };
}

export const classEquipment: Record<string, EquipmentPackage> = {
  barbaro: { 
    optionA: { items: ["Machadinha", "Machadinha", "Machadinha", "Machadinha", "Machado Grande", "Kit de Aventureiro"], gold: 15, description: "4 Machadinhas, Machado Grande, Kit de Aventureiro e 15 PO" }, 
    optionB: { gold: 75, description: "75 PO" }
  },
  bardo: { 
    optionA: { items: ["Armadura de Couro", "Adaga", "Adaga", "Instrumento Musical", "Kit de Artista"], gold: 19, description: "Armadura de Couro, 2 Adagas, Instrumento Musical, Kit de Artista e 19 PO" }, 
    optionB: { gold: 90, description: "90 PO" }
  },
  bruxo: { 
    optionA: { items: ["Armadura de Couro", "Foice", "Adaga", "Adaga", "Foco Arcano", "Livro", "Kit de Erudito"], gold: 15, description: "Armadura de Couro, Foice, 2 Adagas, Foco Arcano (orbe), Livro (conhecimento oculto), Kit de Erudito e 15 PO" }, 
    optionB: { gold: 100, description: "100 PO" }
  },
  clerigo: { 
    optionA: { items: ["Cota de Malha Parcial", "Escudo", "Maça", "Símbolo Sagrado", "Kit de Sacerdote"], gold: 7, description: "Cota de Malha Parcial, Escudo, Maça, Símbolo Sagrado, Kit de Sacerdote e 7 PO" }, 
    optionB: { gold: 110, description: "110 PO" }
  },
  druida: { 
    optionA: { items: ["Armadura de Couro", "Escudo", "Foice", "Foco Druídico", "Kit de Explorador", "Kit de Herbalismo"], gold: 9, description: "Armadura de Couro, Escudo, Foice, Foco Druídico (Cajado), Kit de Explorador, Kit de Herbalismo, 9 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  feiticeiro: { 
    optionA: { items: ["Lança", "Adaga", "Adaga", "Foco Arcano", "Kit de Explorador de Masmorras"], gold: 28, description: "Lança, 2 Adagas, Foco Arcano (cristal), Kit de Explorador de Masmorras e 28 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  guardiao: { 
    optionA: { items: ["Couro Batido", "Cimitarra", "Espada Curta", "Arco Longo", "Aljava", "Flecha", "Foco Druídico", "Kit de Aventureiro"], gold: 7, description: "Armadura de Couro Batido, Cimitarra, Espada Curta, Arco Longo, 20 Flechas, Aljava, Foco Druídico (ramo de visco), Kit de Aventureiro e 7 PO" }, 
    optionB: { gold: 150, description: "150 PO" }
  },
  guerreiro: { 
    // Livro: (A) / (B) Couro Batido, Cimitarra, Espada Curta, Arco Longo, 20 Flechas, Aljava, KEM e 11 PO / (C) 155 PO.
    // O modelo de pacote só tem A (itens) e B (só ouro): a opção B aqui é a (C) do livro.
    optionA: { items: ["Cota de Malha", "Espada Grande", "Mangual", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Kit de Explorador de Masmorras"], gold: 4, description: "Cota de Malha, Espada Grande, Mangual, 8 Azagaias, Kit de Explorador de Masmorras e 4 PO" }, 
    optionB: { gold: 155, description: "155 PO" }
  },
  ladino: { 
    optionA: { items: ["Armadura de Couro", "Adaga", "Adaga", "Espada Curta", "Arco Curto", "Aljava", "Flecha", "Ferramentas de Ladrão", "Kit de Assaltante"], gold: 8, description: "Armadura de Couro, 2 Adagas, Espada Curta, Arco Curto, 20 Flechas, Aljava, Ferramentas de Ladrão, Kit de Assaltante e 8 PO" }, 
    optionB: { gold: 100, description: "100 PO" }
  },
  mago: { 
    optionA: { items: ["Adaga", "Adaga", "Cajado", "Kit de Erudito", "Livro de Magias", "Túnica"], gold: 5, description: "2 Adagas, Foco Arcano (Cajado), Kit de Erudito, Livro de Magias, Túnica e 5 PO" }, 
    optionB: { gold: 55, description: "55 PO" }
  },
  monge: { 
    optionA: { items: ["Lança", "Adaga", "Adaga", "Adaga", "Adaga", "Adaga", "Ferramentas de Artesão ou Instrumento Musical", "Kit de Aventureiro"], gold: 11, description: "Lança, 5 Adagas, Ferramentas de Artesão ou Instrumento Musical (o escolhido para a proficiência), Kit de Aventureiro e 11 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  paladino: { 
    optionA: { items: ["Cota de Malha", "Escudo", "Espada Longa", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Azagaia", "Símbolo Sagrado", "Kit de Sacerdote"], gold: 9, description: "Cota de Malha, Escudo, Espada Longa, 6 Azagaias, Símbolo Sagrado, Kit de Sacerdote e 9 PO" }, 
    optionB: { gold: 150, description: "150 PO" }
  }
};

export const backgroundEquipment: Record<string, EquipmentPackage> = {
  acolito: { 
    optionA: { items: ["Suprimentos de Calígrafo", "Livro", "Símbolo Sagrado", "Pergaminho", "Túnica"], gold: 8, description: "Suprimentos de Calígrafo, Livro (orações), Símbolo Sagrado, Pergaminho (10 folhas), Túnica, 8 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  andarilho: { 
    optionA: { items: ["Adaga", "Adaga", "Ferramentas de Ladrão", "Kit de Jogos", "Algibeira", "Algibeira", "Roupas de Viagem", "Saco de Dormir"], gold: 16, description: "2 Adagas, Ferramentas de Ladrão, Kit de Jogos (qualquer um), 2 Algibeiras, Roupas de Viagem, Saco de Dormir, 16 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  artesao: { 
    optionA: { items: ["Ferramentas de Artesão", "Algibeira", "Algibeira", "Roupas de Viagem"], gold: 32, description: "Ferramentas de Artesão, 2 Algibeiras, Roupas de Viagem, 32 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  artista: { 
    optionA: { items: ["Instrumento Musical", "Espelho", "Fantasia", "Fantasia", "Perfume", "Roupas de Viagem"], gold: 11, description: "Instrumento Musical, Espelho, 2 Fantasias, Perfume, Roupas de Viagem, 11 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  charlatao: { 
    optionA: { items: ["Kit de Falsificação", "Fantasia", "Roupas Finas"], gold: 15, description: "Kit de Falsificação, Fantasia, Roupas Finas, 15 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  criminoso: { 
    optionA: { items: ["Adaga", "Adaga", "Ferramentas de Ladrão", "Algibeira", "Algibeira", "Pé de Cabra", "Roupas de Viagem"], gold: 16, description: "2 Adagas, Ferramentas de Ladrão, 2 Algibeiras, Pé de Cabra, Roupas de Viagem, 16 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  eremita: { 
    optionA: { items: ["Cajado", "Kit de Herbalismo", "Lâmpada", "Livro", "Óleo", "Roupas de Viagem", "Saco de Dormir"], gold: 16, description: "Cajado, Kit de Herbalismo, Lâmpada, Livro (filosofia), Óleo (3 frascos), Roupas de Viagem, Saco de Dormir, 16 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  escriba: { 
    optionA: { items: ["Suprimentos de Calígrafo", "Lâmpada", "Óleo", "Pergaminho", "Roupas Finas"], gold: 23, description: "Suprimentos de Calígrafo, Lâmpada, Óleo (3 frascos), Pergaminho (12 folhas), Roupas Finas, 23 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  fazendeiro: { 
    optionA: { items: ["Foice", "Ferramentas de Carpinteiro", "Kit de Curandeiro", "Balde de Ferro", "Pá"], gold: 30, description: "Foice, Ferramentas de Carpinteiro, Kit de Curandeiro, Balde de Ferro, Pá, 30 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  guarda: { 
    optionA: { items: ["Lança", "Besta Leve", "Virote", "Kit de Jogo", "Aljava", "Grilhões", "Lanterna Coberta", "Roupas de Viagem"], gold: 12, description: "Lança, Besta Leve, 20 Virotes, Kit de Jogo, Aljava, Grilhões, Lanterna Coberta, Roupas de Viagem, 12 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  guia: { 
    optionA: { items: ["Arco Curto", "Flecha", "Ferramentas de Cartógrafo", "Aljava", "Roupas de Viagem", "Saco de Dormir", "Tenda"], gold: 3, description: "Arco Curto, 20 Flechas, Ferramentas de Cartógrafo, Aljava, Roupas de Viagem, Saco de Dormir, Tenda, 3 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  marinheiro: { 
    optionA: { items: ["Adaga", "Ferramentas de Navegador", "Corda", "Roupas de Viagem"], gold: 20, description: "Adaga, Ferramentas de Navegador, Corda, Roupas de Viagem, 20 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  mercador: { 
    optionA: { items: ["Ferramentas de Navegador", "Algibeira", "Algibeira", "Roupas de Viagem"], gold: 22, description: "Ferramentas de Navegador, 2 Algibeiras, Roupas de Viagem, 22 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  nobre: { 
    optionA: { items: ["Kit de Jogos", "Perfume", "Roupas Finas"], gold: 29, description: "Kit de Jogos, Perfume, Roupas Finas, 29 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  sabio: { 
    optionA: { items: ["Cajado", "Suprimentos de Calígrafo", "Livro", "Pergaminho", "Túnica"], gold: 8, description: "Cajado, Suprimentos de Calígrafo, Livro (história), Pergaminho (8 folhas), Túnica, 8 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  },
  soldado: { 
    optionA: { items: ["Lança", "Arco Curto", "Flecha", "Kit de Curandeiro", "Kit de Jogo", "Aljava", "Roupas de Viagem"], gold: 14, description: "Lança, Arco Curto, 20 Flechas, Kit de Curandeiro, Kit de Jogo, Aljava, Roupas de Viagem, 14 PO" }, 
    optionB: { gold: 50, description: "50 PO" }
  }
};

export const getEquipmentForClass = (classId: string) => {
  const normalizedId = classId.toLowerCase();
  return classEquipment[normalizedId] || {
    optionA: { items: [], gold: 0, description: "" },
    optionB: { gold: 0, description: "" }
  };
};

export const getEquipmentForBackground = (bgId: string) => {
  const normalizedId = bgId.toLowerCase();
  return backgroundEquipment[normalizedId] || {
    optionA: { items: [], gold: 0, description: "" },
    optionB: { gold: 0, description: "" }
  };
};

// Conteúdo dos kits conforme o Livro do Jogador 2024 (cap. 6, Equipamento de Aventura).
export const kitContents: Record<string, string> = {
  "Kit de Artista": "Caixa para Fogo, Cantil, Espelho, 3 Fantasias, Lanterna Foca-facho, Mochila, 8 potes de Óleo, 9 dias de Rações, Saco de Dormir e Sino",
  "Kit de Assaltante": "Caixa para Fogo, Cantil, Corda, Esferas de Metal, Lanterna Coberta, Mochila, 7 potes de Óleo, Pé de Cabra, 5 dias de Rações, Sino e 10 Velas",
  "Kit de Aventureiro": "Caixa para Fogo, Cantil, Corda, Mochila, 2 potes de Óleo, 10 dias de Rações, Saco de Dormir e 10 Tochas",
  "Kit de Diplomata": "Baú, Caixa para Fogo, 5 Canetas Tinteiro, 2 Estojos de Mapa ou Pergaminho, Lâmpada, 4 potes de Óleo, Perfume, 5 folhas de Papel, 5 folhas de Pergaminho, Roupas Finas e Tinta",
  "Kit de Erudito": "Caixa para Fogo, Caneta Tinteiro, Lâmpada, Livro, Mochila, 10 potes de Óleo, 10 folhas de Pergaminho e Tinta",
  "Kit de Escalada": "Arnês, luvas, pítons e ponteiras de bota (ancora você: não cai mais de 7,5 m do ponto de ancoragem)",
  "Kit de Explorador de Masmorras": "Caixa para Fogo, Cantil, Corda, Estrepes, Mochila, 2 potes de Óleo, Pé de Cabra, 10 dias de Rações e 10 Tochas",
  // O equipamento inicial do Druida diz "Kit de Explorador", que não existe na lista de kits
  // do livro. Tratamos como o Kit de Aventureiro: é o kit de 10 PO que fecha a conta do
  // pacote A do Druida com a opção B (50 PO); o de Masmorras (12 PO) passaria disso.
  "Kit de Explorador": "Caixa para Fogo, Cantil, Corda, Mochila, 2 potes de Óleo, 10 dias de Rações, Saco de Dormir e 10 Tochas",
  "Kit de Sacerdote": "Água Benta, Caixa para Fogo, Cobertor, Lâmpada, Mochila, 7 dias de Rações e Túnica",
  "Kit de Curandeiro": "Dez usos: como ação Usar Objeto, estabiliza uma criatura Inconsciente com 0 PV sem teste de Sabedoria (Medicina)",
  "Kit de Herbalismo": "Bolsa com Tesoura, Almofariz e Pilão, Frascos e Ervas para preparar remédios e antídotos",
  "Kit de Falsificação": "Tintas, Papéis, Pergaminhos, Canetas, Selos e Lacre para criar documentos falsos",
  "Kit de Disfarce": "Cosméticos, Tintura de Cabelo, Roupas Pequenas e Adereços para alterar aparência",
  "Kit de Jogos": "Conjunto de peças para um jogo específico",
};

export const itemSubChoices: Record<string, string[]> = {
  "Kit de Jogos": ["Baralho", "Conjunto do Jogo dos Três Dragões", "Dados", "Xadrez-do-Dragão"],
  "Kit de Jogo": ["Baralho", "Conjunto do Jogo dos Três Dragões", "Dados", "Xadrez-do-Dragão"],
  "Instrumento Musical": ["Alaúde", "Flauta", "Flauta de Pan", "Gaita de Foles", "Lira", "Oboé", "Tambor", "Trombeta", "Violino", "Xilofone"],
  "Ferramentas de Artesão": [
    "Ferramentas de Carpinteiro", "Ferramentas de Cartógrafo", "Ferramentas de Coureiro",
    "Ferramentas de Entalhador", "Ferramentas de Ferreiro", "Ferramentas de Funileiro",
    "Ferramentas de Joalheiro", "Ferramentas de Oleiro", "Ferramentas de Pedreiro",
    "Ferramentas de Sapateiro", "Ferramentas de Tecelão", "Ferramentas de Vidreiro",
    "Suprimentos de Alquimista", "Suprimentos de Calígrafo", "Suprimentos de Cervejeiro",
    "Suprimentos de Pintor", "Utensílios de Cozinheiro"
  ],
  // Formas da tabela Focos Arcanos / Focos Druídicos do livro.
  "Foco Arcano": ["Cajado", "Cetro", "Cristal", "Orbe", "Varinha"],
  "Foco Druídico": ["Cajado", "Ramo de Visco", "Varinha de Teixo"],
  "Símbolo Sagrado": ["Amuleto", "Emblema", "Relicário"],
};

// Monge: "Ferramentas de Artesão ou Instrumento Musical escolhido para a proficiência com ferramenta".
itemSubChoices["Ferramentas de Artesão ou Instrumento Musical"] = [
  ...itemSubChoices["Ferramentas de Artesão"],
  ...itemSubChoices["Instrumento Musical"],
];
