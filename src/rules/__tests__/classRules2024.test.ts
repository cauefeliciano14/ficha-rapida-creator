import { describe, it, expect } from 'vitest';
import { deriveSheet } from '../engine/index';
import type { CharacterChoices } from '../types/CharacterChoices';
import { CLASS_PROFICIENCY_DATA } from '../data/classRules';
import { getMulticlassCasterLevel, MULTICLASS_PROFICIENCIES } from '../data/multiclassRules';
import { getClassBaseProficiencies } from '../calculators/proficiency';
import { deriveUnarmedAttack, ALL_SKILLS } from '../calculators/sheet';
import { getDefaultClassCounters } from '../../data/classResources';
import classDetailsJson from '../../data/classDetails.json';

// Regras de classe conferidas no Livro do Jogador 2024 (PT-BR).

function makeChoices(overrides: Partial<CharacterChoices>): CharacterChoices {
  return {
    classId: null,
    backgroundId: null,
    speciesId: null,
    attributeMethod: 'standard',
    baseAttributes: {
      forca: 10, destreza: 10, constituicao: 10,
      inteligencia: 10, sabedoria: 10, carisma: 10,
    },
    backgroundBonusDistribution: null,
    equipmentChoices: { classOption: 'A', backgroundOption: 'A' },
    spellSelections: { cantrips: [], prepared: [] },
    talentSelections: {},
    languageSelections: [],
    featureChoices: {},
    characterDetails: { name: '', portrait: null },
    ...overrides,
  };
}

function counter(classId: string, level: number, id: string, mods?: Record<string, number>) {
  return getDefaultClassCounters(classId, level, undefined, mods).find(c => c.id === id);
}

// ---------------------------------------------------------------------------
// Listas de perícias (Traços Básicos de cada classe)
// ---------------------------------------------------------------------------
describe('Listas de perícias de classe', () => {
  it('Bardo escolhe quaisquer 3 perícias (todas as 18)', () => {
    expect(CLASS_PROFICIENCY_DATA.bardo.skillChoicePool).toHaveLength(ALL_SKILLS.length);
    for (const { label } of ALL_SKILLS) expect(CLASS_PROFICIENCY_DATA.bardo.skillChoicePool).toContain(label);
  });
  it('Druida não tem Atletismo', () => {
    expect(CLASS_PROFICIENCY_DATA.druida.skillChoicePool).not.toContain('Atletismo');
  });
  it('Guardião não tem Prestidigitação', () => {
    expect(CLASS_PROFICIENCY_DATA.guardiao.skillChoicePool).not.toContain('Prestidigitação');
  });
  it('Guerreiro: Lidar com Animais e Persuasão, sem Prestidigitação', () => {
    const pool = CLASS_PROFICIENCY_DATA.guerreiro.skillChoicePool;
    expect(pool).toContain('Lidar com Animais');
    expect(pool).toContain('Persuasão');
    expect(pool).not.toContain('Prestidigitação');
    expect(pool).toHaveLength(9);
  });
  it('Ladino: Intuição sim, Atuação não', () => {
    expect(CLASS_PROFICIENCY_DATA.ladino.skillChoicePool).toContain('Intuição');
    expect(CLASS_PROFICIENCY_DATA.ladino.skillChoicePool).not.toContain('Atuação');
  });
  it('Mago inclui Natureza', () => {
    expect(CLASS_PROFICIENCY_DATA.mago.skillChoicePool).toContain('Natureza');
  });
  it('opções de perícia do classDetails.json batem com o pool do motor', () => {
    const details = classDetailsJson as Record<string, { options: Array<{ id: string; choices: string[] }> }>;
    for (const [classId, data] of Object.entries(CLASS_PROFICIENCY_DATA)) {
      for (const opt of details[classId].options.filter(o => o.id.startsWith(`${classId}-skill-`))) {
        expect([...opt.choices].sort(), `${opt.id}`).toEqual([...data.skillChoicePool].sort());
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Recursos de classe
// ---------------------------------------------------------------------------
describe('Recursos de classe', () => {
  it('Guerreiro: Surto de Ação 1 no nível 2, 2 no 17', () => {
    expect(counter('guerreiro', 1, 'guerreiro-actionsurge')).toBeUndefined();
    expect(counter('guerreiro', 2, 'guerreiro-actionsurge')?.max).toBe(1);
    expect(counter('guerreiro', 16, 'guerreiro-actionsurge')?.max).toBe(1);
    expect(counter('guerreiro', 17, 'guerreiro-actionsurge')?.max).toBe(2);
  });
  it('Guerreiro: Recuperar Fôlego 2/3/4 nos níveis 1/4/10', () => {
    const c = (l: number) => counter('guerreiro', l, 'guerreiro-secondwind');
    expect(c(1)?.name).toBe('Recuperar Fôlego');
    expect(c(3)?.max).toBe(2);
    expect(c(4)?.max).toBe(3);
    expect(c(9)?.max).toBe(3);
    expect(c(10)?.max).toBe(4);
  });
  it('Guerreiro: Indomável 1/2/3 nos níveis 9/13/17', () => {
    expect(counter('guerreiro', 8, 'guerreiro-indomavel')).toBeUndefined();
    expect(counter('guerreiro', 9, 'guerreiro-indomavel')?.max).toBe(1);
    expect(counter('guerreiro', 13, 'guerreiro-indomavel')?.max).toBe(2);
    expect(counter('guerreiro', 17, 'guerreiro-indomavel')?.max).toBe(3);
  });
  it('Clérigo: Canalizar Divindade 2/3/4 nos níveis 2/6/18', () => {
    expect(counter('clerigo', 1, 'clerigo-channel')).toBeUndefined();
    expect(counter('clerigo', 2, 'clerigo-channel')?.max).toBe(2);
    expect(counter('clerigo', 6, 'clerigo-channel')?.max).toBe(3);
    expect(counter('clerigo', 17, 'clerigo-channel')?.max).toBe(3);
    expect(counter('clerigo', 18, 'clerigo-channel')?.max).toBe(4);
  });
  it('Paladino: Canalizar Divindade 2 no nível 3, 3 no 11', () => {
    expect(counter('paladino', 2, 'paladino-channel')).toBeUndefined();
    expect(counter('paladino', 3, 'paladino-channel')?.max).toBe(2);
    expect(counter('paladino', 10, 'paladino-channel')?.max).toBe(2);
    expect(counter('paladino', 11, 'paladino-channel')?.max).toBe(3);
  });
  it('Paladino: Mãos Consagradas = 5 × nível', () => {
    expect(counter('paladino', 1, 'paladino-maos-consagradas')?.max).toBe(5);
    expect(counter('paladino', 7, 'paladino-maos-consagradas')?.max).toBe(35);
  });
  it('Bardo: Inspiração = mod. de Carisma (mín. 1), Descanso Curto só a partir do nível 5', () => {
    expect(counter('bardo', 1, 'bardo-inspiration', { carisma: 3 })?.max).toBe(3);
    expect(counter('bardo', 1, 'bardo-inspiration', { carisma: -1 })?.max).toBe(1);
    expect(counter('bardo', 4, 'bardo-inspiration')?.resetOn).toBe('long');
    expect(counter('bardo', 5, 'bardo-inspiration')?.resetOn).toBe('short');
  });
  it('Druida: Forma Selvagem 2/3/4 nos níveis 2/6/17, sem texto de VD de 2014', () => {
    expect(counter('druida', 1, 'druida-wildshape')).toBeUndefined();
    expect(counter('druida', 2, 'druida-wildshape')?.max).toBe(2);
    expect(counter('druida', 6, 'druida-wildshape')?.max).toBe(3);
    expect(counter('druida', 17, 'druida-wildshape')?.max).toBe(4);
    expect(counter('druida', 2, 'druida-wildshape')?.name).toBe('Forma Selvagem');
  });
  it('Feiticeiro: sem Pontos de Feitiçaria no nível 1', () => {
    expect(counter('feiticeiro', 1, 'feiticeiro-sorcery')).toBeUndefined();
    expect(counter('feiticeiro', 2, 'feiticeiro-sorcery')?.max).toBe(2);
  });
  it('Monge: Pontos de Foco a partir do nível 2', () => {
    expect(counter('monge', 1, 'monge-ki')).toBeUndefined();
    expect(counter('monge', 2, 'monge-ki')?.name).toBe('Pontos de Foco');
    expect(counter('monge', 2, 'monge-ki')?.max).toBe(2);
    expect(counter('monge', 2, 'monge-metabolismo-incomum')?.max).toBe(1);
  });
  it('Guardião: Inimigo Favorito 2/3/4/5/6', () => {
    expect([1, 5, 9, 13, 17].map(l => counter('guardiao', l, 'guardiao-inimigo-favorito')?.max)).toEqual([2, 3, 4, 5, 6]);
  });
  it('Ladino: Ataque Furtivo é referência manual', () => {
    expect(counter('ladino', 5, 'ladino-cunningaction')?.resetOn).toBe('manual');
    expect(counter('ladino', 5, 'ladino-cunningaction')?.max).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Multiclasse
// ---------------------------------------------------------------------------
describe('Multiclasse', () => {
  it('PV cheio só no nível 1 da classe inicial', () => {
    const sheet = deriveSheet(makeChoices({
      classId: 'guerreiro', level: 2,
      baseAttributes: { forca: 13, destreza: 10, constituicao: 14, inteligencia: 10, sabedoria: 10, carisma: 10 },
      classLevels: [
        { classId: 'guerreiro', className: 'Guerreiro', level: 1 },
        { classId: 'mago', className: 'Mago', level: 1 },
      ],
    }));
    // Guerreiro 1: 10 + 2; Mago 1 (não é o nível 1 do personagem): 4 + 2.
    expect(sheet.maxHP).toBe(18);
  });
  it('Guardião e Paladino arredondam metade para cima', () => {
    expect(getMulticlassCasterLevel([
      { classId: 'paladino', className: 'Paladino', level: 3 },
      { classId: 'feiticeiro', className: 'Feiticeiro', level: 1 },
    ])).toBe(3);
  });
  it('Cavaleiro Místico / Trapaceiro Arcano contam 1/3 (para baixo)', () => {
    const levels = [
      { classId: 'guerreiro', className: 'Guerreiro', level: 8 },
      { classId: 'mago', className: 'Mago', level: 2 },
    ];
    expect(getMulticlassCasterLevel(levels)).toBe(2);
    expect(getMulticlassCasterLevel(levels, { guerreiro: 'Cavaleiro Místico' })).toBe(4);
    expect(getMulticlassCasterLevel(
      [{ classId: 'ladino', className: 'Ladino', level: 5 }, { classId: 'mago', className: 'Mago', level: 1 }],
      { ladino: 'Trapaceiro Arcano' },
    )).toBe(2);
  });
  it('proficiências de multiclasse seguem o livro', () => {
    expect(MULTICLASS_PROFICIENCIES.barbaro).toMatchObject({ armor: ['Escudo'], weapons: ['Armas Marciais'] });
    expect(MULTICLASS_PROFICIENCIES.druida.armor).toEqual(['Armadura Leve', 'Escudo']);
    expect(MULTICLASS_PROFICIENCIES.bruxo.armor).toEqual(['Armadura Leve']);
    expect(MULTICLASS_PROFICIENCIES.ladino.tools).toEqual(['Ferramentas de Ladrão']);
    expect(MULTICLASS_PROFICIENCIES.monge).toMatchObject({ armor: [], weapons: [] });
  });
  it('a ficha aplica as proficiências da classe secundária', () => {
    const sheet = deriveSheet(makeChoices({
      classId: 'mago', level: 2,
      classLevels: [
        { classId: 'mago', className: 'Mago', level: 1 },
        { classId: 'guerreiro', className: 'Guerreiro', level: 1 },
      ],
    }));
    expect(sheet.armorProficiencies).toEqual(expect.arrayContaining(['Armadura Leve', 'Armadura Média', 'Escudo']));
    expect(sheet.armorProficiencies).not.toContain('Armadura Pesada');
    expect(sheet.weaponProficiencies).toContain('Armas Marciais');
    expect(sheet.savingThrowProficiencies).not.toContain('Força');
  });
});

// ---------------------------------------------------------------------------
// Especialização
// ---------------------------------------------------------------------------
describe('Especialização por nível', () => {
  const exp = (classId: string, level: number) => deriveSheet(makeChoices({ classId, level })).expertiseCount;
  it('Bardo: 2 no nível 2, 4 no 9', () => {
    expect(exp('bardo', 1)).toBe(0);
    expect(exp('bardo', 2)).toBe(2);
    expect(exp('bardo', 9)).toBe(4);
  });
  it('Ladino: 2 no nível 1, 4 no 6', () => {
    expect(exp('ladino', 1)).toBe(2);
    expect(exp('ladino', 6)).toBe(4);
  });
  it('Guardião: 1 no nível 2 (Explorador Hábil), 3 no 9', () => {
    expect(exp('guardiao', 1)).toBe(0);
    expect(exp('guardiao', 2)).toBe(1);
    expect(exp('guardiao', 9)).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Ferramentas de classe
// ---------------------------------------------------------------------------
describe('Ferramentas de classe', () => {
  it('Druida e Ladino recebem ferramentas fixas', () => {
    expect(getClassBaseProficiencies('druida').tools).toEqual(['Kit de Herbalismo']);
    expect(getClassBaseProficiencies('ladino').tools).toEqual(['Ferramentas de Ladrão']);
  });
  it('Bardo recebe os 3 instrumentos escolhidos e Monge a ferramenta escolhida', () => {
    const sheet = deriveSheet(makeChoices({
      classId: 'bardo',
      featureChoices: { 'bardo-instrumento-1': 'Alaúde', 'bardo-instrumento-2': 'Flauta', 'bardo-instrumento-3': 'Lira' },
    }));
    expect(sheet.toolProficiencies).toEqual(expect.arrayContaining(['Alaúde', 'Flauta', 'Lira']));
    expect(getClassBaseProficiencies('monge', { 'monge-ferramenta': 'Flauta' }).tools).toEqual(['Flauta']);
  });
});

// ---------------------------------------------------------------------------
// Deslocamento e Artes Marciais
// ---------------------------------------------------------------------------
describe('Deslocamento de classe', () => {
  it('Bárbaro nível 5: +3 m sem armadura Pesada', () => {
    expect(deriveSheet(makeChoices({ classId: 'barbaro', level: 4 })).speed).toMatch(/^9 metros/);
    expect(deriveSheet(makeChoices({ classId: 'barbaro', level: 5 })).speed).toMatch(/^12 metros/);
  });
  it('Monge: +3 m no nível 2, +4,5 m no 6, +9 m no 18; nada com armadura/escudo', () => {
    expect(deriveSheet(makeChoices({ classId: 'monge', level: 1 })).speed).toMatch(/^9 metros/);
    expect(deriveSheet(makeChoices({ classId: 'monge', level: 2 })).speed).toMatch(/^12 metros/);
    expect(deriveSheet(makeChoices({ classId: 'monge', level: 6 })).speed).toMatch(/^13,5 metros/);
    expect(deriveSheet(makeChoices({ classId: 'monge', level: 18 })).speed).toMatch(/^18 metros/);
    expect(deriveSheet(makeChoices({ classId: 'monge', level: 2, hasShield: true })).speed).toMatch(/^9 metros/);
  });
});

describe('Artes Marciais do Monge', () => {
  it('usa Destreza quando maior e o dado de Artes Marciais', () => {
    const atk = deriveUnarmedAttack(0, 2, '1', { dexMod: 3, martialArtsDie: '1d6' });
    expect(atk.attackBonus).toBe(5);
    expect(atk.damageBonus).toBe(3);
    expect(atk.damageDice).toBe('1d6');
  });
  it('dado sobe para d8/d10/d12 nos níveis 5/11/17', () => {
    const die = (level: number) => deriveSheet(makeChoices({ classId: 'monge', level }))
      .weaponAttacks.find(a => a.weaponName === 'Ataque Desarmado')?.damageDice;
    expect([1, 4, 5, 10, 11, 16, 17].map(die)).toEqual(['1d6', '1d6', '1d8', '1d8', '1d10', '1d10', '1d12']);
  });
  it('sem Monge, Ataque Desarmado continua com Força e dano 1', () => {
    const atk = deriveUnarmedAttack(2, 2);
    expect(atk.damageDice).toBe('1');
    expect(atk.attackBonus).toBe(4);
  });
});
