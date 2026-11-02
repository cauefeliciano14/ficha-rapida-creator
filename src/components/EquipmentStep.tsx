import { missingSpellPicks, missingSpellText } from '../rules/utils/spellPending';
import React, { useState, useEffect } from 'react';
import { isCaster as engineIsCaster } from '../rules/calculators/spells';
import { getMaxSpellCircle } from '../rules/utils/spellSelection';
import type { DerivedSheet } from '../rules/types/DerivedSheet';
import type { Character, Selection, CatalogItemBase } from '../types/character';
import { getEquipmentForClass, getEquipmentForBackground } from '../data/equipmentData';
import { getArmorByName } from '../rules/data/armorRules';
import { sanitizeEquipmentState, toggleItemEquipped, getEquipKind, isInventoryItemEquipped, expandEquippableUnits } from '../rules/utils/equipment';
import { Accordion } from './equipment/Accordion';
import { TabBar } from './equipment/TabBar';
import { StartingEquipment } from './equipment/StartingEquipment';
import { InventorySection } from './equipment/InventorySection';
import { ItemCatalog } from './equipment/ItemCatalog';
import { CurrencySection } from './equipment/CurrencySection';
import { PreparedSpells } from './equipment/PreparedSpells';
import { SpellCatalog } from './equipment/SpellCatalog';
import { SkeletonLoader } from './ui/SkeletonLoader';

interface EquipmentStepProps {
  character: Character;
  selectedBackground: Selection | null;
  updateEquipment: (updater: (prev: Character['equipment']) => Character['equipment']) => void;
  updateSpells: (updater: (prev: Character['spells']) => Character['spells']) => void;
  derivedSheet: DerivedSheet;
  /** Armas equipadas (mesmo estado da caixinha "Ativo" da ficha). */
  equippedWeaponNames?: string[];
  /** Liga/desliga UMA arma do inventário (não todas com o mesmo nome). */
  onToggleWeapon?: (item: { id: string; name: string }, currentlyEquipped: boolean) => void;
}

export const EquipmentStep: React.FC<EquipmentStepProps> = ({ character, selectedBackground, updateEquipment, updateSpells, derivedSheet, equippedWeaponNames, onToggleWeapon }) => {
  const classId = character.characterClass?.id || '';
  const bgId = selectedBackground?.id || '';
  const isCaster = engineIsCaster(classId);

  const [activeTab, setActiveTab] = useState('equipment');
  const [openAccordions, setOpenAccordions] = useState({
    starting: true, inventory: false, catalog: false, currency: false,
    prepared: false, spellCatalog: true,
  });

  const toggle = (key: keyof typeof openAccordions) => {
    setOpenAccordions(prev => {
      const newValue = !prev[key];
      const next = { ...prev, [key]: newValue };

      if (key === 'prepared' && newValue) {
        next.spellCatalog = false;
      } else if (key === 'spellCatalog' && newValue) {
        next.prepared = false;
      }

      return next;
    });
  };

  const equipmentState = character.equipment;
  const spellsState = character.spells;


  // Load class spells
  const [classSpells, setClassSpells] = useState<any[]>([]);
  const [spellsLoading, setSpellsLoading] = useState(false);
  useEffect(() => {
    if (isCaster && classId) {
      setSpellsLoading(true);
      import(`../data/spells/${classId}_spells.json`)
        .then(mod => { setClassSpells(mod.default || mod); setSpellsLoading(false); })
        .catch(() => { setClassSpells([]); setSpellsLoading(false); });
    } else {
      setClassSpells([]);
      setSpellsLoading(false);
    }
  }, [classId, isCaster]);

  // No automatic spell preselection: the player picks cantrips and prepared
  // spells. Explicit shortcuts (quick build / templates / random) fill them.

  // --- Equipment handlers ---
  // Tira os itens e o ouro do pacote inicial e volta a mostrar a escolha (A/B).
  // Serve quando a classe ou a origem mudou depois de pegar o equipamento.
  const handleResetStartingEquipment = () => {
    updateEquipment(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => !i.isStartingGear),
      currency: { ...prev.currency, gp: Math.max(0, prev.currency.gp - (prev.startingGold ?? 0)) },
      classOption: null,
      backgroundOption: null,
      startingEquipmentAdded: false,
      startingGold: 0,
    }));
  };

  const handleCommitStartingEquipment = (classOption: 'A' | 'B' | null, bgOption: 'A' | 'B' | null, subChoices: Record<string, string>) => {
    const classEq = getEquipmentForClass(classId);
    const bgEq = getEquipmentForBackground(bgId);

    updateEquipment(prev => {
      const draft = { ...prev, inventory: [...prev.inventory], currency: { ...prev.currency } };

      // Add class equipment
      if (classOption === 'A') {
        draft.currency.gp += classEq.optionA.gold;
        classEq.optionA.items.forEach((itemName: string) => {
          // Resolve sub-choices
          const choiceKey = `class-${itemName}`;
          const resolvedName = subChoices[choiceKey] || itemName;
          draft.inventory.push({
            id: crypto.randomUUID(),
            name: resolvedName,
            quantity: 1,
            isStartingGear: true,
            source: 'class',
          });
        });
      } else if (classOption === 'B') {
        draft.currency.gp += classEq.optionB.gold;
      }

      // Add background equipment
      if (bgOption === 'A') {
        draft.currency.gp += bgEq.optionA.gold;
        bgEq.optionA.items.forEach((itemName: string) => {
          const choiceKey = `bg-${itemName}`;
          const resolvedName = subChoices[choiceKey] || itemName;
          draft.inventory.push({
            id: crypto.randomUUID(),
            name: resolvedName,
            quantity: 1,
            isStartingGear: true,
            source: 'bg',
          });
        });
      } else if (bgOption === 'B') {
        draft.currency.gp += bgEq.optionB.gold;
      }

      draft.classOption = classOption;
      draft.backgroundOption = bgOption;
      draft.startingEquipmentAdded = true;
      // Guarda o ouro dado pelos pacotes, para poder refazer sem duplicar.
      draft.startingGold = (classOption === 'A' ? classEq.optionA.gold : classOption === 'B' ? classEq.optionB.gold : 0)
        + (bgOption === 'A' ? bgEq.optionA.gold : bgOption === 'B' ? bgEq.optionB.gold : 0);

      // Auto-equip: if the starting package contains exactly one armor, equip it.
      // If it contains a shield, equip that too.
      const armors: { id: string; name: string }[] = [];
      let hasShield = false;
      for (const item of draft.inventory) {
        const armor = getArmorByName(item.name);
        if (armor) {
          if (armor.type === 'shield') {
            hasShield = true;
          } else {
            armors.push({ id: armor.id, name: item.name });
          }
        }
      }
      if (armors.length === 1) {
        draft.equippedArmorId = armors[0].id;
      }
      draft.hasShieldEquipped = hasShield;

      return sanitizeEquipmentState({ ...draft, inventory: draft.inventory });
    });

    // Collapse starting, expand inventory
    setOpenAccordions(prev => ({ ...prev, starting: false, inventory: true }));
  };

  const handleAddItem = (item: CatalogItemBase) => {
    updateEquipment(prev => ({
      ...prev,
      inventory: [...prev.inventory, {
        id: crypto.randomUUID(),
        name: item.name,
        quantity: 1,
        itemBase: item,
      }],
    }));
  };

  const handleRemoveItem = (id: string) => {
    updateEquipment(prev => {
      const removedItem = prev.inventory.find(i => i.id === id);
      const nextInventory = prev.inventory.filter(i => i.id !== id);
      const nextEquipment = sanitizeEquipmentState({ ...prev, inventory: nextInventory });
      const removedArmor = removedItem ? getArmorByName(removedItem.name) : null;

      if (removedArmor?.type === 'shield' && prev.hasShieldEquipped) {
        nextEquipment.hasShieldEquipped = false;
      }

      if (removedArmor && removedArmor.type !== 'shield' && removedArmor.id === prev.equippedArmorId) {
        nextEquipment.equippedArmorId = null;
      }

      return nextEquipment;
    });
  };

  const handleChangeQuantity = (id: string, delta: number) => {
    updateEquipment(prev => {
      const targetItem = prev.inventory.find(i => i.id === id);
      const nextInventory = prev.inventory
        .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter(i => i.quantity > 0);

      const nextEquipment = sanitizeEquipmentState({ ...prev, inventory: nextInventory });
      const removedArmor = targetItem && targetItem.quantity + delta <= 0 ? getArmorByName(targetItem.name) : null;

      if (removedArmor?.type === 'shield' && prev.hasShieldEquipped) {
        nextEquipment.hasShieldEquipped = false;
      }

      if (removedArmor && removedArmor.type !== 'shield' && removedArmor.id === prev.equippedArmorId) {
        nextEquipment.equippedArmorId = null;
      }

      return nextEquipment;
    });
  };

  const handleCurrencyChange = (coin: string, delta: number) => {
    updateEquipment(prev => ({
      ...prev,
      currency: { ...prev.currency, [coin]: Math.max(0, (prev.currency as Record<string, number>)[coin] + delta) },
    }));
  };

  const handleCurrencySet = (coin: string, value: number) => {
    updateEquipment(prev => ({
      ...prev,
      currency: { ...prev.currency, [coin]: value },
    }));
  };

  // --- Spell handlers ---
  const handleLearnCantrip = (name: string) => {
    updateSpells(prev => ({
      ...prev,
      learnedCantrips: [...prev.learnedCantrips, name],
    }));
  };

  const handleRemoveCantrip = (name: string) => {
    updateSpells(prev => ({
      ...prev,
      learnedCantrips: prev.learnedCantrips.filter(c => c !== name),
    }));
  };

  const handlePrepareSpell = (name: string) => {
    updateSpells(prev => ({
      ...prev,
      preparedSpells: [...prev.preparedSpells, name],
    }));
  };

  const handleRemoveSpell = (name: string) => {
    updateSpells(prev => ({
      ...prev,
      preparedSpells: prev.preparedSpells.filter(s => s !== name),
    }));
  };

  // --- Tabs ---
  const missingSpells = missingSpellPicks({
    cantripsKnown: derivedSheet?.cantripsKnown,
    preparedSpellCount: derivedSheet?.preparedSpellCount,
    learnedCantrips: spellsState.learnedCantrips,
    preparedSpells: spellsState.preparedSpells,
  });
  const tabs = isCaster
    ? [
      { id: 'equipment', label: 'Equipamentos' },
      { id: 'spells', label: 'Magias', badge: missingSpells.total, badgeTitle: `Falta escolher ${missingSpellText(missingSpells)}` },
    ]
    : [{ id: 'equipment', label: 'Equipamentos' }];

  const inventoryCount = equipmentState.inventory.length;
  const spellCount = spellsState.learnedCantrips.length + spellsState.preparedSpells.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'equipment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Accordion
            title="Equipamento Inicial"
            isOpen={openAccordions.starting}
            onToggle={() => toggle('starting')}
            incomplete={!equipmentState.startingEquipmentAdded}
            maxContentHeight={420}
          >
            <StartingEquipment
              classId={classId}
              className={character.characterClass?.name || ''}
              bgId={bgId}
              bgName={selectedBackground?.name || ''}
              currentClassOption={equipmentState.classOption}
              currentBgOption={equipmentState.backgroundOption}
              startingEquipmentAdded={equipmentState.startingEquipmentAdded}
              onCommit={handleCommitStartingEquipment}
              onReset={handleResetStartingEquipment}
            />
          </Accordion>

          <Accordion
            title="Inventário"
            badge={inventoryCount > 0 ? (
              <span style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                {inventoryCount}
              </span>
            ) : undefined}
            isOpen={openAccordions.inventory}
            onToggle={() => toggle('inventory')}
          >
            <InventorySection
              inventory={equipmentState.inventory}
              onRemoveItem={handleRemoveItem}
              onChangeQuantity={handleChangeQuantity}
              equippedArmorId={equipmentState.equippedArmorId}
              hasShieldEquipped={equipmentState.hasShieldEquipped}
              onEquipArmor={(armorId) => updateEquipment((prev: any) => ({ ...prev, equippedArmorId: armorId }))}
              onEquipShield={(equipped) => updateEquipment((prev: any) => ({ ...prev, hasShieldEquipped: equipped }))}
              equippedWeaponNames={equippedWeaponNames}
              onToggleEquip={(id) => {
                const units = expandEquippableUnits(equipmentState.inventory);
                const unit = units.find((u: any) => u.id === id);
                if (unit && onToggleWeapon && getEquipKind(unit.name) === 'weapon') {
                  const index = units.indexOf(unit);
                  onToggleWeapon(unit, isInventoryItemEquipped(equippedWeaponNames ?? [], unit, index, units));
                  return;
                }
                updateEquipment((prev: any) => toggleItemEquipped(prev, id));
              }}
            />
          </Accordion>

          <Accordion
            title="Adicionar Itens"
            isOpen={openAccordions.catalog}
            onToggle={() => toggle('catalog')}
          >
            <ItemCatalog onAddItem={handleAddItem} />
          </Accordion>

          <Accordion
            title="Moeda"
            isOpen={openAccordions.currency}
            onToggle={() => toggle('currency')}
          >
            <CurrencySection
              currency={equipmentState.currency}
              onCurrencyChange={handleCurrencyChange}
              onCurrencySet={handleCurrencySet}
            />
          </Accordion>
        </div>
      )}

      {activeTab === 'spells' && isCaster && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Accordion
            title="Magias Preparadas"
            badge={spellCount > 0 ? (
              <span style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                {spellCount}
              </span>
            ) : undefined}
            isOpen={openAccordions.prepared}
            onToggle={() => toggle('prepared')}
          >
            <PreparedSpells
              learnedCantrips={spellsState.learnedCantrips}
              preparedSpells={spellsState.preparedSpells}
              allSpells={classSpells}
              onRemoveCantrip={handleRemoveCantrip}
              onRemoveSpell={handleRemoveSpell}
            />
          </Accordion>

          <Accordion
            title="Lista de Magias"
            isOpen={openAccordions.spellCatalog}
            onToggle={() => toggle('spellCatalog')}
          >
            {spellsLoading ? (
              <SkeletonLoader rows={5} variant="catalog" />
            ) : (
              <SpellCatalog
                classId={classId}
                learnedCantrips={spellsState.learnedCantrips}
                preparedSpells={spellsState.preparedSpells}
                onLearnCantrip={handleLearnCantrip}
                onPrepareSpell={handlePrepareSpell}
                onRemoveCantrip={handleRemoveCantrip}
                onRemoveSpell={handleRemoveSpell}
                allSpells={classSpells}
                maxCantrips={derivedSheet.cantripsKnown ?? 0}
                maxPrepared={derivedSheet.preparedSpellCount ?? 0}
                maxSpellLevel={Math.max(1, getMaxSpellCircle(classId, derivedSheet.level ?? 1))}
              />
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
};
