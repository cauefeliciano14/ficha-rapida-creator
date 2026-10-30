export const classStartingSpells: Record<string, { cantrips: string[], level1: string[], isCaster: boolean }> = {
  barbaro: { isCaster: false, cantrips: [], level1: [] },
  guerreiro: { isCaster: false, cantrips: [], level1: [] },
  monge: { isCaster: false, cantrips: [], level1: [] },
  ladino: { isCaster: false, cantrips: [], level1: [] },
  
  // Listas recomendadas pelo Livro do Jogador 2024 (seção "Truques" / "Magias Preparadas" de cada classe),
  // limitadas à quantidade do nível 1 (ver classRules.ts).
  bardo: { isCaster: true, cantrips: ["Luzes Dançantes", "Zombaria Perversa"], level1: ["Enfeitiçar Pessoa", "Leque Cromático", "Palavra Curativa", "Sussurros Dissonantes"] },
  bruxo: { isCaster: true, cantrips: ["Prestidigitação Arcana", "Raio Místico"], level1: ["Danação", "Enfeitiçar Pessoa"] },
  clerigo: { isCaster: true, cantrips: ["Chama Sagrada", "Orientação", "Taumaturgia"], level1: ["Bênção", "Curar Ferimentos", "Escudo da Fé", "Raio Guia"] },
  druida: { isCaster: true, cantrips: ["Arte Druídica", "Criar Chamas"], level1: ["Amizade Animal", "Curar Ferimentos", "Fogo das Fadas", "Onda Trovejante"] },
  feiticeiro: { isCaster: true, cantrips: ["Explosão Elemental", "Luz", "Prestidigitação Arcana", "Toque Chocante"], level1: ["Detectar Magia", "Mãos Flamejantes"] },
  guardiao: { isCaster: true, cantrips: [], level1: ["Curar Ferimentos", "Golpe Constritor"] },
  mago: { isCaster: true, cantrips: ["Luz", "Mãos Mágicas", "Raio de Gelo"], level1: ["Armadura Arcana", "Detectar Magia", "Mísseis Mágicos", "Onda Trovejante"] },
  paladino: { isCaster: true, cantrips: [], level1: ["Destruição Cauterizante", "Heroísmo"] }
};
