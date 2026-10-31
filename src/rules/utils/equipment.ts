import { getArmorById, getArmorByName, type ArmorEntry } from '../data/armorRules';
import { getWeaponByName, type WeaponEntry } from '../data/weaponRules';
import type { ValidationInventoryItem } from '../types/CharacterChoices';

export function getArmorTrainingLabel(armor: ArmorEntry): string {
  switch (armor.type) {
    case 'light':
      return 'Armadura Leve';
    case 'medium':
      return 'Armadura Média';
    case 'heavy':
      return 'Armadura Pesada';
    case 'shield':
      return 'Escudo';
  }
}

export function hasArmorTraining(armor: ArmorEntry | null | undefined, armorProficiencies: string[] = []): boolean {
  if (!armor) return false;
  return armorProficiencies.includes(getArmorTrainingLabel(armor));
}

export function resolveEquippedArmor(equippedArmorId?: string): ArmorEntry | null {
  if (!equippedArmorId) return null;
  return getArmorById(equippedArmorId) ?? getArmorByName(equippedArmorId);
}

export function hasArmorInInventory(inventory: ValidationInventoryItem[], equippedArmorId?: string): boolean {
  // Compara pelo ID canônico: fichas antigas podem guardar um ID alias (ex.: 'cota_de_placas').
  const equipped = resolveEquippedArmor(equippedArmorId);
  if (!equipped) return false;
  return inventory.some((item) => {
    const armor = getArmorByName(item.name);
    return Boolean(armor && armor.type !== 'shield' && armor.id === equipped.id);
  });
}

export function hasShieldInInventory(inventory: ValidationInventoryItem[]): boolean {
  return inventory.some((item) => getArmorByName(item.name)?.type === 'shield');
}

export function sanitizeEquipmentState<T extends {
  inventory: Array<{ name: string; quantity?: number }>;
  equippedArmorId: string | null;
  hasShieldEquipped: boolean;
}>(equipment: T): T {
  const normalizedInventory = equipment.inventory.filter((item) => (item.quantity ?? 1) > 0);
  const nextEquippedArmorId = equipment.equippedArmorId && hasArmorInInventory(normalizedInventory, equipment.equippedArmorId)
    ? (resolveEquippedArmor(equipment.equippedArmorId)?.id ?? equipment.equippedArmorId)
    : null;
  const nextHasShieldEquipped = equipment.hasShieldEquipped && hasShieldInInventory(normalizedInventory);
  const inventoryUnchanged = normalizedInventory.length === equipment.inventory.length
    && normalizedInventory.every((item, index) => item === equipment.inventory[index]);

  if (
    inventoryUnchanged
    && nextEquippedArmorId === equipment.equippedArmorId
    && nextHasShieldEquipped === equipment.hasShieldEquipped
  ) {
    return equipment;
  }

  return {
    ...equipment,
    inventory: normalizedInventory,
    equippedArmorId: nextEquippedArmorId,
    hasShieldEquipped: nextHasShieldEquipped,
  };
}

function getWeaponTrainingLabels(weapon: WeaponEntry): string[] {
  const labels = [weapon.name];
  if (weapon.category === 'simpleMelee' || weapon.category === 'simpleRanged') {
    labels.push('Armas Simples');
  }
  if (weapon.category === 'martialMelee' || weapon.category === 'martialRanged') {
    labels.push('Armas Marciais');
    // Ladino e Monge (2024) treinam só parte das marciais, pela propriedade da arma.
    const isLight = /\bleve\b/i.test(weapon.properties);
    if (weapon.isFinesse || isLight) labels.push('Armas Marciais com Acuidade ou Leve');
    if (isLight) labels.push('Armas Marciais com Leve');
  }
  return labels;
}

export function hasWeaponProficiency(weaponName: string, weaponProficiencies: string[] = []): boolean {
  const weapon = getWeaponByName(weaponName);
  if (!weapon) return false;
  return getWeaponTrainingLabels(weapon).some((label) => weaponProficiencies.includes(label));
}

export type EquipKind = 'armor' | 'shield' | 'weapon' | null;

/** Diz se o item precisa ser equipado para funcionar (armadura, escudo ou arma). */
export function getEquipKind(itemName: string): EquipKind {
  const armor = getArmorByName(itemName);
  if (armor) return armor.type === 'shield' ? 'shield' : 'armor';
  return getWeaponByName(itemName) ? 'weapon' : null;
}

/**
 * Alterna o estado "equipado" de um item do inventário.
 * Armadura: só uma por vez (equipar outra substitui). Escudo: hasShieldEquipped.
 * Arma: flag opcional `equipped` no próprio item.
 */
export function toggleItemEquipped<T extends {
  inventory: Array<{ id: string; name: string; equipped?: boolean }>;
  equippedArmorId: string | null;
  hasShieldEquipped: boolean;
}>(equipment: T, itemId: string): T {
  const item = equipment.inventory.find((entry) => entry.id === itemId);
  if (!item) return equipment;
  const kind = getEquipKind(item.name);
  if (kind === 'armor') {
    const armorId = getArmorByName(item.name)!.id;
    return { ...equipment, equippedArmorId: equipment.equippedArmorId === armorId ? null : armorId };
  }
  if (kind === 'shield') {
    return { ...equipment, hasShieldEquipped: !equipment.hasShieldEquipped };
  }
  if (kind === 'weapon') {
    return {
      ...equipment,
      inventory: equipment.inventory.map((entry) => (entry.id === itemId ? { ...entry, equipped: !entry.equipped } : entry)),
    };
  }
  return equipment;
}

/**
 * Equipar vale para UM item do inventário, não para todos com o mesmo nome.
 * `equippedKeys` guarda o id de cada item; fichas antigas guardavam o nome —
 * nesse caso só o primeiro item com aquele nome conta como equipado.
 */
export function isInventoryItemEquipped(
  equippedKeys: readonly string[],
  item: { id?: string; name: string; equipped?: boolean },
  index: number,
  items: ReadonlyArray<{ name: string }>,
): boolean {
  if (item.equipped) return true;
  if (item.id && equippedKeys.includes(item.id)) return true;
  if (!equippedKeys.includes(item.name)) return false;
  return items.findIndex(other => other.name === item.name) === index;
}

/** Liga/desliga o item (pelo id); também limpa o nome antigo, se houver. */
export function toggleEquippedKey(
  equippedKeys: readonly string[],
  item: { id?: string; name: string },
  currentlyEquipped: boolean,
): string[] {
  const key = item.id ?? item.name;
  if (currentlyEquipped) return equippedKeys.filter(k => k !== key && k !== item.name);
  return [...equippedKeys, key];
}

/**
 * Itens que acabam ao usar (poções, munição, rações, frascos…). Ganham o botão
 * "Usar" na ficha, que gasta 1. Armas de arremesso não entram: elas não se
 * destroem, só saem da mão.
 */
const CONSUMABLE_RE = /(^|[^\p{L}])(po[cç](ã|õ)o|po[cç]ões|flechas?|virotes?|balas?|agulhas?|muni[cç][aã]o|ra[cç](ã|õ)es|ra[cç][aã]o|óleo|ácido|fogo de alquimista|antitoxina|pergaminho|água benta|veneno|tochas?|velas?)(?![\p{L}])/iu;

export function isConsumable(name: string): boolean {
  return CONSUMABLE_RE.test(name);
}

/**
 * Na ficha, cada arma, armadura e escudo aparece um por linha (3 Machadinhas =
 * 3 linhas), para dar para equipar só uma. Itens com quantidade > 1 viram
 * unidades com id `<id>#<n>`; o resto (flechas, rações…) fica como está.
 */
export function expandEquippableUnits<T extends { id?: string; name: string; quantity?: number }>(items: readonly T[]): T[] {
  const out: T[] = [];
  for (const item of items) {
    const qty = item.quantity ?? 1;
    if (getEquipKind(item.name) === null || qty <= 1) {
      out.push(item);
      continue;
    }
    for (let n = 0; n < qty; n++) {
      out.push({ ...item, id: item.id ? `${item.id}#${n}` : undefined, quantity: 1 });
    }
  }
  return out;
}

/** Quantas mãos o item ocupa quando equipado (Livro do Jogador 2024, cap. 6). */
export function handsNeeded(name: string): number {
  const kind = getEquipKind(name);
  if (kind === 'shield') return 1;
  if (kind !== 'weapon') return 0;
  const weapon = getWeaponByName(name);
  return weapon && /Duas Mãos/i.test(weapon.properties) ? 2 : 1;
}

/**
 * Se der para equipar `target`, devolve null; senão, o motivo (em português).
 * Regras: uma armadura e um Escudo por vez; armas e Escudo dividem duas mãos;
 * arma de Duas Mãos ocupa as duas.
 */
export function equipBlockReason(params: {
  units: ReadonlyArray<{ id?: string; name: string; equipped?: boolean }>;
  equippedKeys: readonly string[];
  shieldEquipped: boolean;
  target: { id?: string; name: string };
}): string | null {
  const { units, equippedKeys, shieldEquipped, target } = params;
  const kind = getEquipKind(target.name);
  if (kind === 'armor' || kind === null) return null; // trocar de armadura substitui a atual
  const need = handsNeeded(target.name);
  const holding: string[] = [];
  let used = 0;
  units.forEach((unit, index) => {
    if (getEquipKind(unit.name) !== 'weapon') return;
    if (unit === target || (unit.id && unit.id === target.id)) return;
    if (isInventoryItemEquipped(equippedKeys, unit, index, units)) {
      used += handsNeeded(unit.name);
      holding.push(unit.name);
    }
  });
  if (shieldEquipped && kind === 'weapon') {
    used += 1;
    holding.push('Escudo');
  }
  if (kind === 'shield' && shieldEquipped) return 'Só dá para empunhar um Escudo por vez.';
  if (used + need <= 2) return null;
  const what = need === 2 ? `${target.name} usa as duas mãos` : 'suas duas mãos já estão ocupadas';
  return `Não dá para equipar: ${what} (${holding.join(', ')}). Desequipe algo antes.`;
}
