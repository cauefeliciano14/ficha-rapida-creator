import { useState } from 'react';
import type { DerivedSheet } from '../../rules/types/DerivedSheet';
import type { CharacterPlayState } from '../../types/playState';
import type { BackgroundBonusDistribution } from '../../rules/types/CharacterChoices';
import { SheetHeader } from './SheetHeader';
import { AbilityScoreCards } from './AbilityScoreCards';
import { SavingThrowsCard } from './SavingThrowsCard';
import { SensesCard } from './SensesCard';
import { ProficienciesCard } from './ProficienciesCard';
import { SkillsCard } from './SkillsCard';
import { ConditionsCard } from './ConditionsCard';
import { DefensesCard } from './DefensesCard';
import { DeathSavesCard } from './DeathSavesCard';
import { SheetTabs } from './SheetTabs';
import { DiceRollToast } from './DiceRollToast';
import { useDiceRoller } from './useDiceRoller';
import styles from './CharacterSheetPage.module.css';

interface Feature { level: number; name: string; description: string }
interface Trait { title: string; description: string }
interface InventoryItem { name: string; quantity?: number; notes?: string; cost?: string; weight?: string }

interface CharacterSheetPageProps {
  characterName: string;
  portrait: string | null;
  speciesName: string;
  className: string;
  characterLevel: number;
  derivedSheet: DerivedSheet;
  playState: CharacterPlayState;
  onUpdatePlayState: (updater: (prev: CharacterPlayState) => CharacterPlayState) => void;
  classFeatures: Feature[];
  speciesTraits: Trait[];
  inventory: InventoryItem[];
  learnedCantrips: string[];
  preparedSpells: string[];
  backgroundName?: string;
  backgroundDescription?: string;
  backgroundSkills?: string[];
  backgroundTool?: string;
  backgroundEquipment?: string;
  equippedArmorId?: string | null;
  hasShieldEquipped?: boolean;
  onEquipArmor?: (armorId: string | null) => void;
  onEquipShield?: (equipped: boolean) => void;
  baseAttributes: Record<string, number>;
  bonusDistribution: BackgroundBonusDistribution | null;
}

function signedMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function CharacterSheetPage({
  characterName,
  portrait,
  speciesName,
  className,
  characterLevel,
  derivedSheet,
  playState,
  onUpdatePlayState,
  classFeatures,
  speciesTraits,
  inventory,
  learnedCantrips,
  preparedSpells,
  backgroundName,
  backgroundDescription,
  backgroundSkills,
  backgroundTool,
  backgroundEquipment,
  equippedArmorId,
  hasShieldEquipped,
  onEquipArmor,
  onEquipShield,
  baseAttributes,
  bonusDistribution,
}: CharacterSheetPageProps) {
  const { rolls, roll: diceRoll, dismiss: dismissRoll } = useDiceRoller();
  const [shortRestOpen, setShortRestOpen] = useState(false);
  const [hdCount, setHdCount] = useState('1');
  const [hpInput, setHpInput] = useState('');
  const [tempInput, setTempInput] = useState('');

  const effectiveMaxHP = playState.maxHpOverride ?? derivedSheet.maxHP;
  const hitDieSize = parseInt((derivedSheet.hitDie ?? 'd8').replace('d', ''), 10) || 8;
  const conMod = derivedSheet.modifiers?.constituicao ?? 0;

  const handleLongRest = () => {
    onUpdatePlayState(prev => ({
      ...prev,
      currentHp: effectiveMaxHP,
      tempHp: 0,
      spentSpellSlots: {},
      activeConditions: [],
      deathSaves: { successes: 0, failures: 0 },
    }));
  };

  const handleShortRest = () => {
    const count = Math.max(1, parseInt(hdCount, 10) || 1);
    const rolled = Array.from({ length: count }, () => Math.floor(Math.random() * hitDieSize) + 1);
    const total = rolled.reduce((sum, r) => sum + r + conMod, 0);
    onUpdatePlayState(prev => ({
      ...prev,
      currentHp: Math.min(prev.currentHp + Math.max(1, total), effectiveMaxHP),
    }));
    setShortRestOpen(false);
    setHdCount('1');
  };

  const handleHeal = () => {
    const amount = parseInt(hpInput, 10);
    if (!isNaN(amount) && amount > 0) {
      onUpdatePlayState(prev => ({
        ...prev,
        currentHp: Math.min(prev.currentHp + amount, effectiveMaxHP),
      }));
      setHpInput('');
    }
  };

  const handleDamage = () => {
    const amount = parseInt(hpInput, 10);
    if (!isNaN(amount) && amount > 0) {
      onUpdatePlayState(prev => {
        const tempAbsorbed = Math.min(prev.tempHp, amount);
        const remaining = amount - tempAbsorbed;
        return {
          ...prev,
          tempHp: prev.tempHp - tempAbsorbed,
          currentHp: Math.max(0, prev.currentHp - remaining),
        };
      });
      setHpInput('');
    }
  };

  const handleSetTemp = () => {
    const amount = parseInt(tempInput, 10);
    if (!isNaN(amount) && amount >= 0) {
      onUpdatePlayState(prev => ({ ...prev, tempHp: amount }));
      setTempInput('');
    }
  };

  const handleAddCondition = (condition: string) => {
    onUpdatePlayState((prev) => ({
      ...prev,
      activeConditions: prev.activeConditions.includes(condition)
        ? prev.activeConditions
        : [...prev.activeConditions, condition],
    }));
  };

  const handleRemoveCondition = (condition: string) => {
    onUpdatePlayState((prev) => ({
      ...prev,
      activeConditions: prev.activeConditions.filter((c) => c !== condition),
    }));
  };

  const handleAddDefense = (defense: string) => {
    onUpdatePlayState((prev) => ({
      ...prev,
      activeDefenses: prev.activeDefenses.includes(defense)
        ? prev.activeDefenses
        : [...prev.activeDefenses, defense],
    }));
  };

  const handleRemoveDefense = (defense: string) => {
    onUpdatePlayState((prev) => ({
      ...prev,
      activeDefenses: prev.activeDefenses.filter((d) => d !== defense),
    }));
  };

  const hpPercent = effectiveMaxHP > 0 ? (playState.currentHp / effectiveMaxHP) * 100 : 0;
  const hpColor = hpPercent > 50 ? '#4ade80' : hpPercent > 25 ? '#fbbf24' : '#f87171';

  const statCard = (label: string, value: string, isShield: boolean = false) => (
    <div className={`${styles.statCard} ${isShield ? styles.statCardShield : ''}`}>
      <div className={styles.statCardValue}>{value}</div>
      <div className={styles.statCardLabel}>{label}</div>
    </div>
  );

  return (
    <div className={styles.page}>
      <DiceRollToast rolls={rolls} characterName={characterName} onDismiss={dismissRoll} />
      
      <div className={styles.container}>

        {/* === ROW 1: Header + Rest Buttons === */}
        <div className={styles.headerRow}>
          <SheetHeader
            name={characterName}
            portrait={portrait}
            speciesName={speciesName}
            className={className}
            level={characterLevel}
          />
          <div className={styles.restButtons}>
            <button
              className={`${styles.restBtn} ${shortRestOpen ? styles.restBtnActive : ''}`}
              onClick={() => setShortRestOpen(prev => !prev)}
            >
              DESCANSO CURTO
            </button>
            <button className={styles.restBtn} onClick={handleLongRest}>
              DESCANSO LONGO
            </button>
          </div>
        </div>

        {/* Short Rest Panel */}
        {shortRestOpen && (
          <div className={styles.redBox} style={{ padding: '12px 16px' }}>
            <div className={styles.sectionHeader}>DESCANSO CURTO</div>
            <div className={styles.shortRestPanel}>
              <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>Dado(s):</span>
              <input type="number" min="1" value={hdCount} onChange={e => setHdCount(e.target.value)}
                className={styles.hpInput} style={{ width: '60px' }} />
              <button onClick={handleShortRest}
                style={{ background: '#991b1b', border: 'none', borderRadius: '4px', color: 'white', padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }}>
                Recuperar PV
              </button>
            </div>
          </div>
        )}

        {/* === ROW 2: Attributes + PB/Speed + Inspiration + HP === */}
        <div className={styles.combatRow}>
          <div className={styles.abilityGroup}>
            <AbilityScoreCards
              finalAttributes={derivedSheet.finalAttributes}
              modifiers={derivedSheet.modifiers}
              baseAttributes={baseAttributes}
              bonusDistribution={bonusDistribution}
              onRoll={diceRoll}
            />
          </div>

          <div className={styles.miniStatsGroup}>
            {statCard('PROFICIÊNCIA', signedMod(derivedSheet.proficiencyBonus))}
            {statCard('DESLOC.', derivedSheet.speed.replace('metros', 'mts').replace('metro', 'mt'))}
          </div>

          <div className={`${styles.redBox} ${styles.inspBox}`} style={{ width: '52px', padding: '16px 8px' }}>
            <div className={styles.sectionHeader} style={{ fontSize: '0.55rem', padding: '4px 6px' }}>INSP.<br/>HEROICA</div>
            <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid #7f1d1d' }} />
          </div>

          <div className={styles.hpSection}>
            <div className={styles.redBox} style={{ padding: '12px 14px' }}>
              <div className={styles.sectionHeader}>PONTOS DE VIDA</div>

              <div className={styles.hpLabels}>
                <span className={styles.hpLabelText}>ATUAL</span>
                <span className={styles.hpLabelText}>MÁXIMO</span>
                <span className={styles.hpLabelText}>TEMP</span>
              </div>

              <div className={styles.hpValues}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: hpColor }}>{playState.currentHp}</span>
                <span style={{ color: '#475569', fontSize: '1.2rem', fontWeight: 900 }}>/</span>
                <span style={{ fontSize: '1.3rem', color: '#cbd5e1', fontWeight: 800 }}>{effectiveMaxHP}</span>
                <span style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: 800 }}>{playState.tempHp > 0 ? playState.tempHp : '--'}</span>
              </div>

              <div className={styles.hpBar}>
                <div className={styles.hpBarFill} style={{ width: `${Math.min(hpPercent, 100)}%`, background: hpColor }} />
              </div>

              <div className={styles.hpActions}>
                <input type="number" min="0" value={hpInput} onChange={e => setHpInput(e.target.value)} placeholder="HP" className={styles.hpInput} />
                <button onClick={handleHeal} className={`${styles.hpActionBtn} ${styles.healBtn}`}>CURAR</button>
                <button onClick={handleDamage} className={`${styles.hpActionBtn} ${styles.damageBtn}`}>DANO</button>
                <div className={styles.divider} />
                <input type="number" min="0" value={tempInput} onChange={e => setTempInput(e.target.value)} placeholder="Temp" className={styles.hpInput} />
                <button onClick={handleSetTemp} className={`${styles.hpActionBtn} ${styles.tempBtn}`}>TEMP</button>
              </div>
            </div>

            {playState.currentHp === 0 && (
              <div className={styles.deathSavesSection}>
                <div className={styles.deathSavesLabel}>TESTES CONTRA A MORTE</div>
                <DeathSavesCard deathSaves={playState.deathSaves} onUpdatePlayState={onUpdatePlayState} />
              </div>
            )}
          </div>
        </div>

        {/* === ROW 3: Initiative + AC + Defenses + Conditions === */}
        <div className={styles.statusRow}>
          <div className={styles.combatStats}>
            {statCard('INICIATIVA', signedMod(derivedSheet.initiative))}
            {statCard('CLASSE\nARMADURA', String(derivedSheet.armorClass), true)}
          </div>

          <div className={styles.panelsGroup}>
            <div className={styles.redBox} style={{ flex: 1, padding: '16px 12px' }}>
              <div className={styles.sectionHeader}>DEFESAS</div>
              <DefensesCard
                derivedDefenses={derivedSheet.derivedDefenses}
                activeDefenses={playState.activeDefenses}
                onAdd={handleAddDefense}
                onRemove={handleRemoveDefense}
              />
            </div>
            <div className={styles.redBox} style={{ flex: 1, padding: '16px 12px' }}>
              <div className={styles.sectionHeader}>CONDIÇÕES</div>
              <ConditionsCard
                activeConditions={playState.activeConditions}
                onAdd={handleAddCondition}
                onRemove={handleRemoveCondition}
              />
            </div>
          </div>
        </div>

        {/* === ROW 4: Bottom Grid === */}
        <div className={styles.bottomGrid}>
          <div className={styles.colLeft}>
            <div className={styles.redBox}>
              <div className={styles.sectionHeader}>TESTES DE RESISTÊNCIA ⚙</div>
              <SavingThrowsCard
                derivedSavingThrows={derivedSheet.derivedSavingThrows}
                modifiers={derivedSheet.modifiers}
                proficiencyBonus={derivedSheet.proficiencyBonus}
                onRoll={diceRoll}
              />
            </div>
            <div className={styles.redBox}>
              <div className={styles.sectionHeader}>SENTIDOS ⚙</div>
              <SensesCard
                passivePerception={derivedSheet.passivePerception}
                passiveInvestigation={derivedSheet.passiveInvestigation}
                passiveInsight={derivedSheet.passiveInsight}
                specialSenses={derivedSheet.specialSenses}
              />
            </div>
            <div className={styles.redBox}>
              <div className={styles.sectionHeader}>PROFICIÊNCIAS E TREINAMENTO ⚙</div>
              <ProficienciesCard
                skillProficiencies={derivedSheet.skillProficiencies}
                armorProficiencies={derivedSheet.armorProficiencies}
                weaponProficiencies={derivedSheet.weaponProficiencies}
                toolProficiencies={derivedSheet.toolProficiencies}
                languages={derivedSheet.languages}
              />
            </div>
          </div>

          <div className={`${styles.redBox} ${styles.colMiddle}`}>
            <div className={styles.sectionHeader}>PERÍCIAS ⚙</div>
            <SkillsCard
              skills={derivedSheet.skills}
              modifiers={derivedSheet.modifiers}
              proficiencyBonus={derivedSheet.proficiencyBonus}
              onRoll={diceRoll}
            />
          </div>

          <div className={`${styles.redBox} ${styles.colRight}`} style={{ padding: '20px 12px' }}>
            <SheetTabs
              derivedSheet={derivedSheet}
              playState={playState}
              onUpdatePlayState={onUpdatePlayState}
              classFeatures={classFeatures}
              speciesTraits={speciesTraits}
              inventory={inventory}
              learnedCantrips={learnedCantrips}
              preparedSpells={preparedSpells}
              characterLevel={characterLevel}
              backgroundName={backgroundName}
              backgroundDescription={backgroundDescription}
              backgroundSkills={backgroundSkills}
              backgroundTool={backgroundTool}
              backgroundEquipment={backgroundEquipment}
              equippedArmorId={equippedArmorId}
              hasShieldEquipped={hasShieldEquipped}
              onEquipArmor={onEquipArmor}
              onEquipShield={onEquipShield}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
