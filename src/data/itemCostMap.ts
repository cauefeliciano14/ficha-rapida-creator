import equipmentJson from './equipment.json';
import weaponsData from './weapons.json';
import armorJson from './armor.json';
import { ARMOR_NAME_ALIASES, getArmorById } from '../rules/data/armorRules';

export const ITEM_COST_MAP = new Map<string, string>();
{
  const gearItems = (equipmentJson as any).adventuringGear ?? [];
  for (const item of gearItems) {
    if (item.name && item.cost) ITEM_COST_MAP.set(item.name, item.cost);
  }
  for (const category of ['simpleMelee', 'simpleRanged', 'martialMelee', 'martialRanged'] as const) {
    for (const item of (weaponsData as any)[category] ?? []) {
      if (item.name && item.cost) ITEM_COST_MAP.set(item.name, item.cost);
    }
  }
  for (const category of ['lightArmor', 'mediumArmor', 'heavyArmor', 'shield'] as const) {
    for (const item of (armorJson as any)[category] ?? []) {
      if (item.name && item.cost) ITEM_COST_MAP.set(item.name, item.cost);
    }
  }
  // Nomes antigos de armadura (fichas salvas e kits que usam "Armadura de Couro") → custo da armadura do livro.
  for (const [alias, id] of Object.entries(ARMOR_NAME_ALIASES)) {
    const armorName = getArmorById(id)?.name;
    const cost = armorName ? ITEM_COST_MAP.get(armorName) : undefined;
    if (cost && !ITEM_COST_MAP.has(alias)) ITEM_COST_MAP.set(alias, cost);
  }
  // "Kit de Explorador" (equipamento inicial do Druida) = Kit de Aventureiro; ver kitContents.
  const explorerKitCost = ITEM_COST_MAP.get('Kit de Aventureiro');
  if (explorerKitCost) ITEM_COST_MAP.set('Kit de Explorador', explorerKitCost);
}
