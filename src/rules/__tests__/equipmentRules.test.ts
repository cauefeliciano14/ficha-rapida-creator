import { describe, it, expect } from 'vitest';
import { ARMOR_TABLE, getArmorById, getArmorByName, getArmorSpeedPenalty } from '../data/armorRules';
import { getWeaponByName } from '../data/weaponRules';
import { calculateAC, buildWeaponAttack, getArmorPenalties, applySpeedPenalty } from '../calculators/combat';
import { hasArmorInInventory, sanitizeEquipmentState } from '../utils/equipment';
import { classEquipment, backgroundEquipment, kitContents, itemSubChoices } from '../../data/equipmentData';
import { ITEM_COST_MAP } from '../../data/itemCostMap';
import armorJson from '../../data/armor.json';
import equipmentJson from '../../data/equipment.json';

// Livro do Jogador 2024, cap. 6, tabela Armaduras.
describe('ARMOR_TABLE segue o livro', () => {
  const expected: Array<[string, string, number, number | null, number | null, boolean]> = [
    ['Acolchoada', 'light', 11, null, null, true],
    ['Couro', 'light', 11, null, null, false],
    ['Couro Batido', 'light', 12, null, null, false],
    ['Gibão de Peles', 'medium', 12, 2, null, false],
    ['Cota de Malha Parcial', 'medium', 13, 2, null, false],
    ['Loriga de Escamas', 'medium', 14, 2, null, true],
    ['Couraça Peitoral', 'medium', 14, 2, null, false],
    ['Placas Parcial', 'medium', 15, 2, null, true],
    ['Cota de Anéis', 'heavy', 14, 0, null, true],
    ['Cota de Malha', 'heavy', 16, 0, 13, true],
    ['Armadura de Talas', 'heavy', 17, 0, 15, true],
    ['Placas', 'heavy', 18, 0, 15, true],
    ['Escudo', 'shield', 2, null, null, false],
  ];

  it.each(expected)('%s', (name, type, baseAC, maxDex, str, stealth) => {
    const a = getArmorByName(name);
    expect(a).not.toBeNull();
    expect(a).toMatchObject({ type, baseAC, maxDexBonus: maxDex, strengthRequirement: str, stealthDisadvantage: stealth });
  });

  it('todo nome de armor.json resolve na tabela', () => {
    const json = armorJson as unknown as Record<string, Array<{ name: string }>>;
    const names = ['lightArmor', 'mediumArmor', 'heavyArmor', 'shield'].flatMap((k) => json[k].map((i) => i.name));
    expect(names).toHaveLength(ARMOR_TABLE.length);
    for (const n of names) expect(getArmorByName(n)?.name).toBe(n);
  });
});

describe('nomes e IDs antigos continuam resolvendo', () => {
  it.each([
    ['Armadura de Couro', 'Couro'],
    ['Armadura Acolchoada', 'Acolchoada'],
    ['Armadura de Couro Batido', 'Couro Batido'],
    ['Armadura de Peles', 'Gibão de Peles'],
    ['Peitoral', 'Couraça Peitoral'],
    ['Meia Armadura', 'Placas Parcial'],
    ['Armadura de Argolas', 'Cota de Anéis'],
    ['Cota de Placas', 'Cota de Malha'],
    ['Armadura de Placas', 'Placas'],
    ['Cota de Malha', 'Cota de Malha'],
  ])('%s → %s', (old, canonical) => {
    expect(getArmorByName(old)?.name).toBe(canonical);
    expect(ITEM_COST_MAP.get(old)).toBe(ITEM_COST_MAP.get(canonical));
  });

  it('ID antigo cota_de_placas resolve para Cota de Malha', () => {
    expect(getArmorById('cota_de_placas')?.name).toBe('Cota de Malha');
  });

  it('inventário com "Cota de Placas" + ID antigo continua equipado e é normalizado', () => {
    const inventory = [{ name: 'Cota de Placas', quantity: 1 }];
    expect(hasArmorInInventory(inventory, 'cota_de_placas')).toBe(true);
    const sanitized = sanitizeEquipmentState({ inventory, equippedArmorId: 'cota_de_placas', hasShieldEquipped: false });
    expect(sanitized.equippedArmorId).toBe('cota_de_malha');
  });
});

describe('calculateAC — armadura e Defesa sem Armadura', () => {
  it('armadura pesada sem treinamento mantém a CA', () => {
    expect(calculateAC({ dexModifier: 1, equippedArmorId: 'cota_de_malha', armorProficiencies: [] })).toBe(16);
  });

  it('bárbaro com armadura usa a armadura, não a Defesa sem Armadura', () => {
    expect(calculateAC({ dexModifier: 2, conModifier: 3, classId: 'barbaro', equippedArmorId: 'peles', armorProficiencies: ['Armadura Média'] })).toBe(14);
  });

  it('bárbaro sem armadura mantém o benefício com Escudo', () => {
    expect(calculateAC({ dexModifier: 2, conModifier: 3, classId: 'barbaro', hasShield: true, armorProficiencies: ['Escudo'] })).toBe(17);
  });

  it('monge com Escudo perde a Defesa sem Armadura', () => {
    expect(calculateAC({ dexModifier: 3, wisModifier: 2, classId: 'monge', hasShield: true, armorProficiencies: [] })).toBe(13);
  });
});

describe('penalidades da armadura', () => {
  it('Força abaixo do exigido: deslocamento −3 m', () => {
    expect(getArmorSpeedPenalty(getArmorByName('Placas'), 14)).toBe(3);
    expect(getArmorSpeedPenalty(getArmorByName('Placas'), 15)).toBe(0);
    expect(getArmorSpeedPenalty(getArmorByName('Cota de Anéis'), 8)).toBe(0);
  });

  it('getArmorPenalties reúne deslocamento, Furtividade e falta de treinamento', () => {
    expect(getArmorPenalties({ equippedArmorId: 'cota_de_malha', strengthScore: 12, armorProficiencies: ['Armadura Pesada'] }))
      .toEqual({ speedPenalty: 3, stealthDisadvantage: true, untrainedArmor: false });
    expect(getArmorPenalties({ equippedArmorId: 'couro', strengthScore: 8, armorProficiencies: [] }))
      .toEqual({ speedPenalty: 0, stealthDisadvantage: false, untrainedArmor: true });
    expect(getArmorPenalties({ equippedArmorId: null, strengthScore: 8 }))
      .toEqual({ speedPenalty: 0, stealthDisadvantage: false, untrainedArmor: false });
  });

  it('applySpeedPenalty reduz o texto de deslocamento', () => {
    expect(applySpeedPenalty('9 metros', 3)).toBe('6 metros');
    expect(applySpeedPenalty('10,5 metros', 3)).toBe('7,5 metros');
    expect(applySpeedPenalty('9 metros', 0)).toBe('9 metros');
  });
});

describe('armas', () => {
  it('Versátil expõe o dado de duas mãos', () => {
    const atk = buildWeaponAttack('Espada Longa', 3, 0, 2, ['Armas Marciais']);
    expect(atk!.damageDice).toBe('1d8');
    expect(atk!.versatileDice).toBe('1d10');
    expect(buildWeaponAttack('Adaga', 0, 3, 2, [])!.versatileDice).toBeUndefined();
  });

  it('Zarabatana: dano fixo 1 Perfurante e alcance 7,5/30', () => {
    const w = getWeaponByName('Zarabatana')!;
    expect(w.damageDice).toBe('1');
    expect(w.damageType).toBe('Perfurante');
    expect(w.range).toBe('7,5/30 m');
    const atk = buildWeaponAttack('Zarabatana', 0, 2, 2, ['Armas Marciais']);
    expect(atk!.properties).toContain('Munição (Alcance 7,5/30; Agulha)');
  });

  it('Dardo (Acuidade, à distância) usa o maior entre For e Des', () => {
    const atk = buildWeaponAttack('Dardo', 4, 1, 2, ['Armas Simples']);
    expect(atk!.attackBonus).toBe(6);
    expect(atk!.damageBonus).toBe(4);
  });
});

describe('equipamento inicial e kits', () => {
  const knownItems = new Set<string>([
    ...ITEM_COST_MAP.keys(),
    ...Object.keys(itemSubChoices),
    ...Object.keys(kitContents),
  ]);

  it('itens de armadura dos pacotes resolvem e têm custo', () => {
    for (const pkg of [...Object.values(classEquipment), ...Object.values(backgroundEquipment)]) {
      for (const item of pkg.optionA.items) {
        const armor = getArmorByName(item);
        if (armor) expect(ITEM_COST_MAP.has(item)).toBe(true);
      }
    }
    expect(getArmorByName('Armadura de Couro')?.name).toBe('Couro');
    expect(getArmorByName('Couro Batido')?.name).toBe('Couro Batido');
  });

  it('pacotes de classe não usam itens inexistentes conhecidos', () => {
    const all = Object.values(classEquipment).flatMap((p) => p.optionA.items);
    expect(all).not.toContain('Girote');
    expect(all).not.toContain('Kit de Ladrão');
    for (const kit of all.filter((i) => i.startsWith('Kit de '))) expect(knownItems.has(kit)).toBe(true);
  });

  it('Guerreiro, Ladino, Mago, Monge e Paladino seguem o livro', () => {
    expect(classEquipment.guerreiro.optionA.gold).toBe(4);
    expect(classEquipment.guerreiro.optionA.items.filter((i) => i === 'Azagaia')).toHaveLength(8);
    expect(classEquipment.guerreiro.optionB.gold).toBe(155);
    expect(classEquipment.ladino.optionA.items).toContain('Kit de Assaltante');
    expect(classEquipment.ladino.optionA.gold).toBe(8);
    expect(classEquipment.ladino.optionB.gold).toBe(100);
    expect(classEquipment.mago.optionA.items).toEqual(['Adaga', 'Adaga', 'Cajado', 'Kit de Erudito', 'Livro de Magias', 'Túnica']);
    expect(classEquipment.mago.optionA.gold).toBe(5);
    expect(classEquipment.mago.optionB.gold).toBe(55);
    expect(classEquipment.monge.optionA.items.filter((i) => i === 'Adaga')).toHaveLength(5);
    expect(classEquipment.monge.optionA.gold).toBe(11);
    expect(itemSubChoices['Ferramentas de Artesão ou Instrumento Musical']).toContain('Flauta');
    expect(classEquipment.paladino.optionA.items.filter((i) => i === 'Azagaia')).toHaveLength(6);
    expect(classEquipment.paladino.optionA.gold).toBe(9);
  });

  it('focos seguem as tabelas do livro', () => {
    expect(itemSubChoices['Foco Arcano']).toEqual(['Cajado', 'Cetro', 'Cristal', 'Orbe', 'Varinha']);
    expect(itemSubChoices['Foco Druídico']).not.toContain('Totem');
  });

  it('Saca custa 1 PP', () => {
    const saca = (equipmentJson as { adventuringGear: Array<{ name: string; cost: string }> }).adventuringGear.find((i) => i.name === 'Saca');
    expect(saca?.cost).toBe('1 PP');
  });
});
