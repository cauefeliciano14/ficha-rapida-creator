import { useCallback, useEffect, useRef, useState } from 'react';
import type { DerivedSheet, DerivedSkill, DerivedSavingThrow, WeaponAttack } from '../../rules/types/DerivedSheet';
import type { CharacterPlayState } from '../../types/playState';
import type { DiceRollResult, AdvantageMode } from '../../utils/diceRoller';
import type { CharacterAppearance, PersonalityTraits, CharacterIdentityUpdate } from '../../types/character';
import { rollD20Check, rollDamage } from '../../utils/diceRoller';

import { signedMod } from '../../utils/format';
import { ATTR_ABBR } from '../../utils/attributeConstants';
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
import { SheetSidebar } from './SheetSidebar';
import { AbilityDetailPanel, AttackDetailPanel } from './DiceResultPanel';
import { ExhaustionTracker } from './ExhaustionTracker';
import { CollapsibleSection } from './CollapsibleSection';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAbilityViewMode } from '../../hooks/useAbilityViewMode';
import { RestModal, type RestRestoredResource } from './RestModal';
import { ClassResourcesCard } from './ClassResourcesCard';
import { LevelUpModal } from './LevelUpModal';
import { LevelUnlockHistoryModal } from './LevelUnlockHistoryModal';
import { AddClassModal } from './AddClassModal';
import {
  SKILL_DESCRIPTIONS,
  SAVING_THROW_DESCRIPTION,
  PROFICIENCY_BONUS_DESCRIPTION,
  SPEED_DESCRIPTION,
  INITIATIVE_DESCRIPTION,
  AC_DESCRIPTION,
  SENSES_DESCRIPTION,
  HP_DESCRIPTION,
  ABILITY_SCORE_DESCRIPTIONS,
} from '../../data/sidebarDescriptions';
import type { ClassLevel } from '../../types/multiclass';
import styles from './CharacterSheetPage.module.css';

/* ── Sidebar state ── */
type SidebarState =
  | { type: 'skill'; skill: DerivedSkill; result: DiceRollResult }
  | { type: 'save'; save: DerivedSavingThrow; result: DiceRollResult }
  | { type: 'ability'; key: string; label: string; score: number; modifier: number }
  | { type: 'attack'; attack: WeaponAttack; hitResult: DiceRollResult; damageResult: DiceRollResult }
  | { type: 'proficiency' }
  | { type: 'speed' }
  | { type: 'initiative' }
  | { type: 'ac' }
  | { type: 'senses' }
  | { type: 'hp' }
  | { type: 'history' }
  | null;

/* ── Types ── */
interface Feature { level: number; name: string; description: string }
interface Trait { title: string; description: string }
interface InventoryItem { name: string; quantity?: number; notes?: string; cost?: string }

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
  onUpdatePreparedSpells?: (spells: string[]) => void;
  backgroundName?: string;
  backgroundDescription?: string;
  backgroundSkills?: string[];
  backgroundTool?: string;
  backgroundEquipment?: string;
  equippedArmorId?: string | null;
  hasShieldEquipped?: boolean;
  onEquipArmor?: (armorId: string | null) => void;
  onEquipShield?: (equipped: boolean) => void;
  alignment?: string | null;
  currency?: { cp: number; sp: number; ep: number; gp: number; pp: number };
  onUpdateCurrency?: (currency: { cp: number; sp: number; ep: number; gp: number; pp: number }) => void;
  backstory?: string;
  appearance?: CharacterAppearance;
  personalityTraits?: PersonalityTraits;
  faith?: string;
  lifestyle?: string;
  organizations?: string;
  onUpdateIdentity?: (update: CharacterIdentityUpdate) => void;
  onSetLevel?: (level: number) => void;
  classId?: string;
  subclassName?: string;
  classLevels?: ClassLevel[];
  onAddClass?: (classId: string, className: string) => void;
  onLevelUpClass?: (classId: string) => void;
}

const MAX_DICE_HISTORY = 20;

const XP_TABLE = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 1; i < XP_TABLE.length; i++) {
    if (xp >= XP_TABLE[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 20);
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
  onUpdatePreparedSpells,
  backgroundName,
  backgroundDescription,
  backgroundSkills,
  backgroundTool,
  backgroundEquipment,
  equippedArmorId,
  hasShieldEquipped,
  onEquipArmor,
  onEquipShield,
  alignment,
  currency,
  onUpdateCurrency,
  backstory,
  appearance,
  personalityTraits,
  faith,
  lifestyle,
  organizations,
  onUpdateIdentity,
  onSetLevel,
  classId,
  subclassName,
  classLevels,
  onAddClass,
  onLevelUpClass,
}: CharacterSheetPageProps) {
  /* ── HP state ── */
  const [hpInput, setHpInput] = useState('');
  const [hpPulse, setHpPulse] = useState<'damage' | 'heal' | null>(null);
  const prevHpRef = useRef(playState.currentHp);

  /* ── Sidebar state ── */
  const [sidebarStack, setSidebarStack] = useState<Exclude<SidebarState, null>[]>([]);
  const sidebar: SidebarState = sidebarStack.length > 0 ? sidebarStack[sidebarStack.length - 1] : null;
  const setSidebar = useCallback((state: SidebarState) => {
    if (state === null) setSidebarStack([]);
    else setSidebarStack([state]);
  }, []);
  const pushSidebar = useCallback((state: Exclude<SidebarState, null>) => {
    setSidebarStack(prev => [...prev, state]);
  }, []);
  const popSidebar = useCallback(() => {
    setSidebarStack(prev => prev.length > 1 ? prev.slice(0, -1) : []);
  }, []);

  /* ── Responsive layout ── */
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const isDesktopWide = useMediaQuery('(min-width: 1200px)');

  /* ── Rest modal state ── */
  const [restModal, setRestModal] = useState<'short' | 'long' | null>(null);
  const [shortRestOpen, setShortRestOpen] = useState(false);
  const [hdCount, setHdCount] = useState('1');

  /* ── Advantage mode ── */
  const [advantageMode, setAdvantageMode] = useState<AdvantageMode>('normal');

  /* ── Dice toast state (D&D Beyond style floating roll result) ── */
  const [diceToast, setDiceToast] = useState<{
    result: DiceRollResult;
    label: string;
    onReroll?: () => void;
  } | null>(null);
  const [diceToastExiting, setDiceToastExiting] = useState(false);
  const diceToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDiceToast = useCallback((result: DiceRollResult, label: string, onReroll?: () => void) => {
    if (diceToastTimer.current) clearTimeout(diceToastTimer.current);
    setDiceToastExiting(false);
    setDiceToast({ result, label, onReroll });
    diceToastTimer.current = setTimeout(() => {
      setDiceToastExiting(true);
      setTimeout(() => { setDiceToast(null); setDiceToastExiting(false); }, 250);
    }, 5000);
  }, []);

  const dismissDiceToast = useCallback(() => {
    if (diceToastTimer.current) clearTimeout(diceToastTimer.current);
    setDiceToastExiting(true);
    setTimeout(() => { setDiceToast(null); setDiceToastExiting(false); }, 250);
  }, []);

  /* ── XP state ── */
  const [xpInput, setXpInput] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showUnlockHistory, setShowUnlockHistory] = useState(false);
  const currentXP = playState.xp ?? 0;
  const xpLevel = getLevelFromXP(currentXP);
  const xpCurrentFloor = XP_TABLE[Math.min(xpLevel - 1, 19)] ?? 0;
  const xpNextCeil = XP_TABLE[Math.min(xpLevel, 19)] ?? XP_TABLE[19];
  const xpPercent = xpLevel >= 20 ? 100 : ((currentXP - xpCurrentFloor) / (xpNextCeil - xpCurrentFloor)) * 100;

  const handleAddXP = () => {
    const amount = parseInt(xpInput, 10);
    if (!isNaN(amount) && amount > 0) {
      onUpdatePlayState(prev => ({ ...prev, xp: (prev.xp ?? 0) + amount }));
      setXpInput('');
    }
  };

  /* ── HP pulse effect ── */
  useEffect(() => {
    if (playState.currentHp !== prevHpRef.current) {
      setHpPulse(playState.currentHp < prevHpRef.current ? 'damage' : 'heal');
      prevHpRef.current = playState.currentHp;
      const timer = setTimeout(() => setHpPulse(null), 600);
      return () => clearTimeout(timer);
    }
  }, [playState.currentHp]);

  const effectiveMaxHP = playState.maxHpOverride ?? derivedSheet.maxHP;
  const hitDieSize = parseInt((derivedSheet.hitDie ?? 'd8').replace('d', ''), 10) || 8;
  const conMod = derivedSheet.modifiers?.constituicao ?? 0;

  /* ── Hit Dice tracking ── */
  const totalHitDice = characterLevel;
  const availableHitDice = totalHitDice - (playState.spentHitDice ?? 0);

  /* ── Dice History helper ── */
  const addToHistory = useCallback((result: DiceRollResult) => {
    onUpdatePlayState(prev => ({
      ...prev,
      diceHistory: [
        { label: result.label, total: result.total, type: result.type, timestamp: Date.now() },
        ...(prev.diceHistory ?? []),
      ].slice(0, MAX_DICE_HISTORY),
    }));
  }, [onUpdatePlayState]);

  /* ── HP handlers ── */
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

  const handleTempHp = () => {
    const amount = parseInt(hpInput, 10);
    if (!isNaN(amount)) {
      onUpdatePlayState(prev => ({
        ...prev,
        tempHp: amount > 0 ? amount : 0,
      }));
      setHpInput('');
    }
  };

  /* ── Rest handlers ── */
  const handleLongRest = () => {
    onUpdatePlayState(prev => ({
      ...prev,
      currentHp: effectiveMaxHP,
      tempHp: 0,
      spentSpellSlots: {},
      activeConditions: [],
      heroicInspiration: true,
      deathSaves: { successes: 0, failures: 0 },
      spentHitDice: Math.max(0, (prev.spentHitDice ?? 0) - Math.floor(totalHitDice / 2)),
      customActions: prev.customActions.map(a =>
        a.resetOn === 'long' || a.resetOn === 'short' ? { ...a, usesSpent: 0 } : a
      ),
      customCounters: (prev.customCounters ?? []).map(c =>
        c.resetOn === 'long' || c.resetOn === 'short' ? { ...c, current: c.max } : c
      ),
      exhaustionLevel: Math.max(0, (prev.exhaustionLevel ?? 0) - 1),
    }));
    setRestModal(null);
  };

  const handleShortRest = () => {
    const count = Math.max(1, Math.min(parseInt(hdCount, 10) || 1, availableHitDice));
    if (count <= 0) return;
    const rolled = Array.from({ length: count }, () => Math.floor(Math.random() * hitDieSize) + 1);
    const total = rolled.reduce((sum, r) => sum + r + conMod, 0);
    onUpdatePlayState(prev => ({
      ...prev,
      currentHp: Math.min(prev.currentHp + Math.max(1, total), effectiveMaxHP),
      spentHitDice: (prev.spentHitDice ?? 0) + count,
      customActions: prev.customActions.map(a =>
        a.resetOn === 'short' ? { ...a, usesSpent: 0 } : a
      ),
      customCounters: (prev.customCounters ?? []).map(c =>
        c.resetOn === 'short' ? { ...c, current: c.max } : c
      ),
    }));
    setShortRestOpen(false);
    setHdCount('1');
  };

  /* ── Death Saves handler ── */
  const handleUpdateDeathSaves = useCallback((deathSaves: CharacterPlayState['deathSaves']) => {
    onUpdatePlayState(prev => ({ ...prev, deathSaves }));
  }, [onUpdatePlayState]);

  /* ── Condition / Defense handlers ── */
  const handleAddCondition = (condition: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      activeConditions: prev.activeConditions.includes(condition)
        ? prev.activeConditions
        : [...prev.activeConditions, condition],
    }));
  };

  const handleRemoveCondition = (condition: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      activeConditions: prev.activeConditions.filter(c => c !== condition),
    }));
  };

  const handleAddDefense = (defense: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      activeDefenses: prev.activeDefenses.includes(defense)
        ? prev.activeDefenses
        : [...prev.activeDefenses, defense],
    }));
  };

  const handleRemoveDefense = (defense: string) => {
    onUpdatePlayState(prev => ({
      ...prev,
      activeDefenses: prev.activeDefenses.filter(d => d !== defense),
    }));
  };

  /* ── Heroic Inspiration toggle ── */
  const toggleInspiration = () => {
    onUpdatePlayState(prev => ({ ...prev, heroicInspiration: !prev.heroicInspiration }));
  };

  /* ── Sidebar handlers ── */
  const closeSidebar = useCallback(() => setSidebar(null), [setSidebar]);

  const handleSkillClick = useCallback((skill: DerivedSkill) => {
    const abbr = ATTR_ABBR[skill.attribute] ?? skill.attribute;
    const result = rollD20Check(skill.modifier, `${skill.label} (${abbr})`, 'check', advantageMode);
    setSidebar({ type: 'skill', skill, result });
    addToHistory(result);
    showDiceToast(result, `${skill.label} (${abbr})`, () => {
      const reroll = rollD20Check(skill.modifier, `${skill.label} (${abbr})`, 'check', advantageMode);
      setSidebar({ type: 'skill', skill, result: reroll });
      addToHistory(reroll);
      showDiceToast(reroll, `${skill.label} (${abbr})`);
    });
  }, [advantageMode, addToHistory, setSidebar, showDiceToast]);

  const handleSaveClick = useCallback((save: DerivedSavingThrow) => {
    const result = rollD20Check(save.modifier, `Teste de Resistência (${save.label})`, 'save', advantageMode);
    setSidebar({ type: 'save', save, result });
    addToHistory(result);
    showDiceToast(result, `Resistência (${save.label})`, () => {
      const reroll = rollD20Check(save.modifier, `Teste de Resistência (${save.label})`, 'save', advantageMode);
      setSidebar({ type: 'save', save, result: reroll });
      addToHistory(reroll);
      showDiceToast(reroll, `Resistência (${save.label})`);
    });
  }, [advantageMode, addToHistory, setSidebar, showDiceToast]);

  const handleAbilityClick = useCallback((key: string, label: string, score: number, modifier: number) => {
    setSidebar({ type: 'ability', key, label, score, modifier });
  }, [setSidebar]);

  const handleAttackClick = useCallback((attack: WeaponAttack) => {
    const dmgFormula = `${attack.damageDice}${attack.damageBonus !== 0 ? (attack.damageBonus > 0 ? '+' : '') + attack.damageBonus : ''}`;
    const hitResult = rollD20Check(attack.attackBonus, attack.weaponName, 'attack', advantageMode);
    const damageResult = rollDamage(dmgFormula, attack.weaponName);
    setSidebar({ type: 'attack', attack, hitResult, damageResult });
    addToHistory(hitResult);
    addToHistory(damageResult);
    showDiceToast(hitResult, `${attack.weaponName} (Ataque)`);
  }, [advantageMode, addToHistory, setSidebar, showDiceToast]);

  /* ── Sidebar reroll helpers ── */
  const rerollSkill = () => {
    if (sidebar?.type === 'skill') {
      const abbr = ATTR_ABBR[sidebar.skill.attribute] ?? sidebar.skill.attribute;
      const result = rollD20Check(sidebar.skill.modifier, `${sidebar.skill.label} (${abbr})`, 'check', advantageMode);
      setSidebar({ ...sidebar, result });
      addToHistory(result);
      showDiceToast(result, `${sidebar.skill.label} (${abbr})`);
    }
  };

  const rerollSave = () => {
    if (sidebar?.type === 'save') {
      const result = rollD20Check(sidebar.save.modifier, `Teste de Resistência (${sidebar.save.label})`, 'save', advantageMode);
      setSidebar({ ...sidebar, result });
      addToHistory(result);
      showDiceToast(result, `Resistência (${sidebar.save.label})`);
    }
  };

  const rerollAttackHit = () => {
    if (sidebar?.type === 'attack') {
      const hitResult = rollD20Check(sidebar.attack.attackBonus, sidebar.attack.weaponName, 'attack', advantageMode);
      setSidebar({ ...sidebar, hitResult });
      addToHistory(hitResult);
      showDiceToast(hitResult, `${sidebar.attack.weaponName} (Ataque)`);
    }
  };

  const rerollAttackDamage = () => {
    if (sidebar?.type === 'attack') {
      const atk = sidebar.attack;
      const dmgFormula = `${atk.damageDice}${atk.damageBonus !== 0 ? (atk.damageBonus > 0 ? '+' : '') + atk.damageBonus : ''}`;
      const damageResult = rollDamage(dmgFormula, atk.weaponName);
      setSidebar({ ...sidebar, damageResult });
      addToHistory(damageResult);
      showDiceToast(damageResult, `${atk.weaponName} (Dano)`);
    }
  };

  /* Ability detail: roll from within ability sidebar */
  const handleAbilitySkillRoll = (label: string, modifier: number) => {
    const result = rollD20Check(modifier, label, 'check', advantageMode);
    const fakeSkill: DerivedSkill = { label, attribute: sidebar?.type === 'ability' ? sidebar.key : '', modifier, proficient: false, expertise: false, halfProficient: false, baseAbilityMod: modifier, proficiencyValue: 0 };
    pushSidebar({ type: 'skill', skill: fakeSkill, result });
    addToHistory(result);
    showDiceToast(result, label);
  };

  const handleAbilitySaveRoll = (modifier: number) => {
    if (sidebar?.type === 'ability') {
      const result = rollD20Check(modifier, `Teste de Resistência (${sidebar.label})`, 'save', advantageMode);
      const fakeSave: DerivedSavingThrow = { label: sidebar.label, attribute: sidebar.key, modifier, proficient: false };
      pushSidebar({ type: 'save', save: fakeSave, result });
      addToHistory(result);
      showDiceToast(result, `Resistência (${sidebar.label})`);
    }
  };

  /* ── Derived values ── */
  const hpPercent = effectiveMaxHP > 0 ? (playState.currentHp / effectiveMaxHP) * 100 : 0;
  const hpColor = hpPercent > 50 ? '#4ade80' : hpPercent > 25 ? '#fbbf24' : '#f87171';

  /* ── Compact roll result for sidebar ── */
  const renderRollResult = (result: DiceRollResult, onReroll: () => void) => {
    const d20 = result.rolls[0];
    return (
      <>
        <div className={styles.sidebarRollResult}>
          <div className={
            result.isCritical ? styles.sidebarRollD20Crit
              : result.isFumble ? styles.sidebarRollD20Fumble
                : styles.sidebarRollD20
          }>
            {d20}
          </div>
          <div className={styles.sidebarRollDetails}>
            <div className={styles.sidebarRollFormula}>{result.formula}</div>
            <div className={styles.sidebarRollTotal}>Total: {result.total}</div>
            {result.isCritical && <div className={styles.sidebarCritLabel}>Acerto Crítico!</div>}
            {result.isFumble && <div className={styles.sidebarFumbleLabel}>Falha Crítica!</div>}
          </div>
        </div>
        <button onClick={onReroll} className={styles.sidebarRerollBtn}>
          🎲 Rolar Novamente
        </button>
      </>
    );
  };

  /* ── Sidebar content renderer (D&D Beyond style) ── */
  const renderSidebarContent = () => {
    if (!sidebar) return null;

    switch (sidebar.type) {
      case 'skill': {
        const abbr = ATTR_ABBR[sidebar.skill.attribute] ?? sidebar.skill.attribute;
        const description = SKILL_DESCRIPTIONS[sidebar.skill.label] ?? '';
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span className={styles.sidebarInfoDot} />
              <span>{abbr.toUpperCase()}</span>
              <span>{sidebar.skill.label}</span>
              <span className={styles.sidebarInfoMod}>{signedMod(sidebar.skill.modifier)}</span>
            </div>
            {renderRollResult(sidebar.result, rerollSkill)}
            {description && (
              <>
                <hr className={styles.sidebarDivider} />
                <div className={styles.sidebarDescription}>{description}</div>
              </>
            )}
          </div>
        );
      }

      case 'save': {
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>🛡️</span>
              <span>{sidebar.save.label} Saving Throw</span>
              <span className={styles.sidebarInfoMod}>{signedMod(sidebar.save.modifier)}</span>
            </div>
            {renderRollResult(sidebar.result, rerollSave)}
            <hr className={styles.sidebarDivider} />
            <div className={styles.sidebarDescription}>{SAVING_THROW_DESCRIPTION}</div>
          </div>
        );
      }

      case 'ability': {
        const relatedSkills = derivedSheet.skills
          .filter(s => s.attribute === sidebar.key)
          .map(s => ({ label: s.label, modifier: s.modifier, proficient: s.proficient }));
        const savingThrow = derivedSheet.derivedSavingThrows.find(st => st.attribute === sidebar.key);
        const abilityDescription = ABILITY_SCORE_DESCRIPTIONS[sidebar.key];
        return (
          <>
            <AbilityDetailPanel
              abilityName={sidebar.label}
              score={sidebar.score}
              modifier={sidebar.modifier}
              relatedSkills={relatedSkills}
              savingThrow={savingThrow ? { modifier: savingThrow.modifier, proficient: savingThrow.proficient } : undefined}
              onRollSkill={handleAbilitySkillRoll}
              onRollSave={handleAbilitySaveRoll}
            />
            {abilityDescription && (
              <>
                <hr className={styles.sidebarDivider} />
                <div className={styles.sidebarDescription}>{abilityDescription}</div>
              </>
            )}
          </>
        );
      }

      case 'attack':
        return (
          <AttackDetailPanel
            weaponName={sidebar.attack.weaponName}
            range={sidebar.attack.range}
            properties={sidebar.attack.properties}
            hitResult={sidebar.hitResult}
            damageResult={sidebar.damageResult}
            damageType={sidebar.attack.damageType}
            onRerollHit={rerollAttackHit}
            onRerollDamage={rerollAttackDamage}
          />
        );

      case 'proficiency':
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>{signedMod(derivedSheet.proficiencyBonus)}</span>
            </div>
            <div className={styles.sidebarDescription}>{PROFICIENCY_BONUS_DESCRIPTION}</div>
          </div>
        );

      case 'speed':
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>{derivedSheet.speed}</span>
            </div>
            <div className={styles.sidebarDescription}>{SPEED_DESCRIPTION}</div>
          </div>
        );

      case 'initiative':
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>{signedMod(derivedSheet.initiative)}</span>
            </div>
            <div className={styles.sidebarDescription}>{INITIATIVE_DESCRIPTION}</div>
          </div>
        );

      case 'ac':
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>{derivedSheet.armorClass}</span>
            </div>
            <div className={styles.sidebarDescription}>{AC_DESCRIPTION}</div>
          </div>
        );

      case 'senses':
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>Percepção Passiva</span>
              <span className={styles.sidebarInfoMod}>{derivedSheet.passivePerception}</span>
            </div>
            <div className={styles.sidebarInfoItem}>
              <span>Investigação Passiva</span>
              <span className={styles.sidebarInfoMod}>{derivedSheet.passiveInvestigation}</span>
            </div>
            <div className={styles.sidebarInfoItem}>
              <span>Intuição Passiva</span>
              <span className={styles.sidebarInfoMod}>{derivedSheet.passiveInsight}</span>
            </div>
            {derivedSheet.specialSenses.length > 0 && (
              <>
                <hr className={styles.sidebarDivider} />
                {derivedSheet.specialSenses.map(s => (
                  <div key={s} className={styles.sidebarInfoItem}>
                    <span>{s}</span>
                  </div>
                ))}
              </>
            )}
            <hr className={styles.sidebarDivider} />
            <div className={styles.sidebarDescription}>{SENSES_DESCRIPTION}</div>
          </div>
        );

      case 'hp':
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>Atual</span>
              <span className={styles.sidebarInfoMod}>{playState.currentHp}</span>
            </div>
            <div className={styles.sidebarInfoItem}>
              <span>Máximo</span>
              <span className={styles.sidebarInfoMod}>{effectiveMaxHP}</span>
            </div>
            {playState.tempHp > 0 && (
              <div className={styles.sidebarInfoItem}>
                <span>Temporário</span>
                <span className={styles.sidebarInfoMod}>{playState.tempHp}</span>
              </div>
            )}
            <hr className={styles.sidebarDivider} />
            <div className={styles.sidebarDescription}>{HP_DESCRIPTION}</div>
          </div>
        );

      case 'history':
        return (
          <div className={styles.historyList}>
            {(playState.diceHistory ?? []).length === 0 ? (
              <div className={styles.historyEmpty}>Nenhuma rolagem registrada.</div>
            ) : (
              (playState.diceHistory ?? []).map((entry, i) => (
                <div key={`${entry.timestamp}-${i}`} className={styles.historyEntry}>
                  <div className={styles.historyLabel}>{entry.label}</div>
                  <div className={styles.historyTotal}>{entry.total}</div>
                  <div className={styles.historyType}>{entry.type}</div>
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const sidebarTitle = sidebar
    ? sidebar.type === 'skill' ? 'Perícias'
      : sidebar.type === 'save' ? 'Testes de Resistência'
        : sidebar.type === 'ability' ? sidebar.label
          : sidebar.type === 'attack' ? sidebar.attack.weaponName
            : sidebar.type === 'proficiency' ? 'Bônus de Proficiência'
              : sidebar.type === 'speed' ? 'Deslocamento'
                : sidebar.type === 'initiative' ? 'Iniciativa'
                  : sidebar.type === 'ac' ? 'Classe de Armadura'
                    : sidebar.type === 'senses' ? 'Sentidos'
                      : sidebar.type === 'hp' ? 'Pontos de Vida'
                        : sidebar.type === 'history' ? 'Histórico de Rolagens'
                          : ''
    : '';

  const sidebarSubtitle = sidebar
    ? sidebar.type === 'skill' ? `${sidebar.skill.label} (${ATTR_ABBR[sidebar.skill.attribute] ?? sidebar.skill.attribute}) ${signedMod(sidebar.skill.modifier)}`
      : sidebar.type === 'save' ? `${sidebar.save.label} ${signedMod(sidebar.save.modifier)}`
        : sidebar.type === 'ability' ? `Pontuação ${sidebar.score} · Modificador ${signedMod(sidebar.modifier)}`
          : sidebar.type === 'attack' ? sidebar.attack.range
            : sidebar.type === 'senses' ? `Percepção Passiva ${derivedSheet.passivePerception}`
              : sidebar.type === 'hp' ? `${playState.currentHp} / ${effectiveMaxHP} PV`
                : sidebar.type === 'history' ? `Últimas ${(playState.diceHistory ?? []).length} rolagens`
                  : undefined
    : undefined;

  /* ── Sticky header sentinel ── */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* Sentinel for scroll detection */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* ===== STICKY CONDENSED HEADER ===== */}
      {isStuck && (
        <div className={styles.stickyHeader}>
          <div className={styles.stickyInner}>
            <div className={styles.stickyPortrait}>
              {portrait ? (
                <img src={`/imgs/portrait_caracter/${portrait}`} alt="" className={styles.stickyPortraitImg} />
              ) : '🧙'}
            </div>
            <div className={styles.stickyInfo}>
              <span className={styles.stickyName}>{characterName || 'Sem Nome'}</span>
              <span className={styles.stickyMeta}>
                {className}{subclassName ? ` (${subclassName})` : ''} · {speciesName || '—'}
              </span>
            </div>
            <div className={styles.stickyStats}>
              <span className={styles.stickyStat}>
                <span className={styles.stickyStatLabel}>HP</span>
                <span style={{ color: playState.currentHp < effectiveMaxHP / 2 ? '#ef4444' : '#22c55e' }}>
                  {playState.currentHp}/{effectiveMaxHP}
                </span>
              </span>
              <span className={styles.stickyStat}>
                <span className={styles.stickyStatLabel}>CA</span>
                {derivedSheet.armorClass}
              </span>
              <span className={styles.stickyStat}>
                <span className={styles.stickyStatLabel}>INIT</span>
                {signedMod(derivedSheet.initiative)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOP BAR ===== */}
      <div className={styles.topBar}>

        {/* ROW 1: Header + Rest Actions */}
        <div className={styles.topBarRow1}>
          <SheetHeader
            name={characterName}
            portrait={portrait}
            speciesName={speciesName}
            className={className}
            level={characterLevel}
            creatureSize={derivedSheet.creatureSize}
            alignment={alignment}
            subclassName={subclassName}
            classLevels={classLevels}
            backgroundName={backgroundName}
            onUpdateIdentity={onUpdateIdentity}
          />
          <div className={styles.topBarActions}>
            {/* Advantage Mode Toggle */}
            <div className={styles.advantageToggle}>
              {(['normal', 'advantage', 'disadvantage'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAdvantageMode(mode)}
                  className={advantageMode === mode ? `${styles.advantageBtn} ${styles.advantageBtnActive}` : styles.advantageBtn}
                  title={mode === 'normal' ? 'Normal' : mode === 'advantage' ? 'Vantagem' : 'Desvantagem'}
                >
                  {mode === 'normal' ? '⚖' : mode === 'advantage' ? '▲' : '▼'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSidebar({ type: 'history' })}
              className={styles.restBtn}
              title="Histórico de Rolagens"
            >
              🎲 HISTÓRICO
            </button>
            <button
              onClick={() => setShortRestOpen(prev => !prev)}
              className={shortRestOpen ? `${styles.restBtn} ${styles.restBtnActive}` : styles.restBtn}
            >
              ⚡ DESCANSO CURTO
            </button>
            <button
              onClick={() => setRestModal('long')}
              className={styles.restBtn}
            >
              🔴 DESCANSO LONGO
            </button>
          </div>
        </div>

        {/* XP + LEVEL ROW */}
        <div className={styles.xpRow}>
          {onSetLevel && (
            <div className={styles.levelCtrl}>
              <button
                className={styles.levelBtn}
                onClick={() => onSetLevel(Math.max(1, characterLevel - 1))}
                disabled={characterLevel <= 1}
                title="Diminuir nível"
              >−</button>
              <span className={styles.levelDisplay}>NIV {characterLevel}</span>
              <button
                className={styles.levelBtn}
                onClick={() => setShowLevelUp(true)}
                disabled={characterLevel >= 20}
                title="Aumentar nível"
              >+</button>
              {onAddClass && characterLevel >= 1 && (
                <button
                  className={styles.levelBtn}
                  onClick={() => setShowAddClass(true)}
                  title="Adicionar classe (multiclasse)"
                  style={{ marginLeft: 4, fontSize: '0.7rem', width: 'auto', padding: '0 6px' }}
                >+ Classe</button>
              )}
            </div>
          )}
          <span className={styles.xpLabel}>XP</span>
          <span className={styles.xpValue}>{currentXP.toLocaleString()}</span>
          <div className={styles.xpBarWrap}>
            <div className={styles.xpBarFill} style={{ width: `${Math.min(xpPercent, 100)}%` }} />
          </div>
          <span className={styles.xpMeta}>
            {xpLevel >= 20 ? 'Máx.' : `Próx. Nível: ${xpNextCeil.toLocaleString()} XP`}
          </span>
          <input
            type="number"
            min="0"
            value={xpInput}
            onChange={e => setXpInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddXP(); }}
            placeholder="+XP"
            className={styles.xpInput}
          />
          <button onClick={handleAddXP} className={styles.xpBtn}>Adicionar</button>
        </div>
      </div>

      {/* ===== STATS BAND (full-width: Abilities + PB/Speed + Heroic/HP) ===== */}
      <div className={styles.statsBand}>
        {/* 6 ability scores in horizontal row */}
        <div className={styles.statsBandAbilities}>
          <AbilityScoreCards
            finalAttributes={derivedSheet.finalAttributes}
            modifiers={derivedSheet.modifiers}
            attributeBreakdowns={derivedSheet.attributeBreakdowns}
            onAbilityClick={handleAbilityClick}
            horizontal
          />
        </div>

        {/* PB + Speed + Heroic Inspiration + HP (aligns with col3) */}
        <div className={styles.statsBandRight}>
          {/* Proficiency Bonus */}
          <div
            className={`${styles.statBox} ${styles.statBoxClickable}`}
            onClick={() => setSidebar({ type: 'proficiency' })}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSidebar({ type: 'proficiency' }); }}
          >
            <div
              className={styles.statLabel}
              title="Bônus de Proficiência: somado a ataques, testes e perícias treinadas. Cresce conforme o nível (+2 a +6)."
            >PROFICIÊNCIA</div>
            <div className={styles.statValue}>{signedMod(derivedSheet.proficiencyBonus)}</div>
            <div className={styles.statSubLabel}>BÔNUS</div>
          </div>

          {/* Walking Speed */}
          <div
            className={`${styles.statBox} ${styles.statBoxClickable}`}
            onClick={() => setSidebar({ type: 'speed' })}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSidebar({ type: 'speed' }); }}
          >
            <div
              className={styles.statLabel}
              title="Velocidade de Caminhada: distância percorrida em metros por turno (1 quadrado = 1,5 m)."
            >CAMINHADA</div>
            <div className={styles.statValueInline}>
              {derivedSheet.speed}
            </div>
            <div className={styles.statSubLabel}>VELOCIDADE</div>
          </div>

          {/* Heroic Inspiration */}
          <div
            className={`${styles.heroicBox} ${playState.heroicInspiration ? styles.heroicBoxActive : ''}`}
            onClick={toggleInspiration}
            role="checkbox"
            aria-checked={playState.heroicInspiration}
            aria-label="Inspiração Heróica"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleInspiration(); }}
            title="Inspiração Heróica: gaste para rolar novamente um d20. Clique para alternar."
          >
            {playState.heroicInspiration && <span className={styles.heroicCheck}>★</span>}
            <span className={styles.heroicLabel}>INSPIRAÇÃO</span>
          </div>

          {/* HP Panel */}
          <div className={styles.hpPanel}>
            <div
              className={`${styles.redBox} ${hpPulse === 'damage' ? styles.hpPulseDamage : hpPulse === 'heal' ? styles.hpPulseHeal : ''}`}
              style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div className={styles.hpHeader}>
                <div className={styles.sectionHeader}>PONTOS DE VIDA</div>
                <div className={styles.hpHeaderBtns}>
                  <input
                    type="number"
                    min="0"
                    value={hpInput}
                    onChange={e => setHpInput(e.target.value)}
                    className={styles.hpInput}
                    placeholder="0"
                  />
                  <button onClick={handleHeal} className={styles.healBtn} title="Curar">+</button>
                  <button onClick={handleDamage} className={styles.damageBtn} title="Dano">−</button>
                  <button onClick={handleTempHp} className={styles.tempBtn} title="HP Temporário">♡</button>
                </div>
              </div>
              <div className={styles.hpValues}>
                <span className={styles.hpCurrent} style={{ color: hpColor }}>{playState.currentHp}</span>
                <span className={styles.hpSeparator}>/</span>
                <span className={styles.hpMax}>{effectiveMaxHP}</span>
                {playState.tempHp > 0 && (
                  <span className={styles.hpTemp}>+{playState.tempHp}</span>
                )}
              </div>
              <div className={styles.hpBar} style={{ width: '100%' }}>
                <div className={styles.hpBarFill} style={{ width: `${Math.min(hpPercent, 100)}%`, background: hpColor }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN 3-COLUMN GRID (D&D Beyond layout) ===== */}
      <div className={styles.mainGrid}>

        {/* ── Col 1: Saves / Senses / Proficiencies ── */}
        <div className={styles.colLeft}>
          <CollapsibleSection title="Testes de Resistência" defaultOpen forceOpen={!isMobile}>
            <div className={styles.redBox}>
              <div className={styles.sectionHeader}>TESTES DE RESISTÊNCIA ⚙</div>
              <SavingThrowsCard
                derivedSavingThrows={derivedSheet.derivedSavingThrows}
                onSaveClick={handleSaveClick}
              />
              <div className={styles.savingThrowLabel}>Modificadores de Resistência</div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Sentidos" forceOpen={!isMobile}>
            <div
              className={`${styles.redBox} ${styles.redBoxClickable}`}
              onClick={() => setSidebar({ type: 'senses' })}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSidebar({ type: 'senses' }); }}
            >
              <div className={styles.sectionHeader}>SENTIDOS ⚙</div>
              <SensesCard
                passivePerception={derivedSheet.passivePerception}
                passiveInvestigation={derivedSheet.passiveInvestigation}
                passiveInsight={derivedSheet.passiveInsight}
                specialSenses={derivedSheet.specialSenses}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Proficiências" forceOpen={!isMobile}>
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
          </CollapsibleSection>

          <CollapsibleSection title="Recursos de Classe" defaultOpen forceOpen={!isMobile}>
            <div className={styles.redBox}>
              <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span>RECURSOS DE CLASSE ⚙</span>
                <button
                  type="button"
                  onClick={() => setShowUnlockHistory(true)}
                  title="Ver histórico de desbloqueios por nível"
                  aria-label="Histórico de desbloqueios"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-dim)',
                    padding: '2px 8px',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  📜 Histórico {(playState.unlockHistory?.length ?? 0) > 0 && `(${playState.unlockHistory!.length})`}
                </button>
              </div>
              <ClassResourcesCard
                playState={playState}
                onUpdatePlayState={onUpdatePlayState}
                classId={classId}
                characterLevel={characterLevel}
                subclassName={subclassName}
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* ── Col 2: Skills ── */}
        <div className={styles.colMid}>
          <div className={`${styles.redBox} ${styles.skillsPanel}`}>
            <div className={styles.sectionHeader}>PERÍCIAS ⚙</div>
            <SkillsCard
              skills={derivedSheet.skills}
              onSkillClick={handleSkillClick}
              expertiseSkills={playState.expertiseSkills ?? []}
              canGrantExpertise={derivedSheet.classGrantsExpertise}
              expertiseCount={derivedSheet.expertiseCount}
              onToggleExpertise={(label) => {
                onUpdatePlayState(prev => {
                  const list = prev.expertiseSkills ?? [];
                  const next = list.includes(label)
                    ? list.filter(s => s !== label)
                    : list.length < derivedSheet.expertiseCount
                      ? [...list, label]
                      : list;
                  return { ...prev, expertiseSkills: next };
                });
              }}
            />
          </div>
        </div>

        {/* ── Col 3: Combat Row + Tabs ── */}
        <div className={styles.colRight}>

          {/* Short Rest Overlay */}
          {shortRestOpen && (
            <div className={`${styles.redBox} ${styles.shortRestOverlay}`}>
              <div className={styles.sectionHeader}>DESCANSO CURTO</div>
              <div className={styles.hitDicePanel}>
                <div className={styles.hitDiceHeader}>
                  <span className={styles.hitDiceTitle}>
                    Dados de Vida ({derivedSheet.hitDie})
                  </span>
                  <span className={styles.hitDiceCount}>
                    <strong>{availableHitDice}</strong> / {totalHitDice}
                  </span>
                </div>
                <div className={styles.hitDiceRow}>
                  {Array.from({ length: totalHitDice }).map((_, i) => {
                    const isAvailable = i < availableHitDice;
                    const dieClass =
                      hitDieSize === 6 ? styles.hitDieD6 :
                      hitDieSize === 8 ? styles.hitDieD8 :
                      hitDieSize === 10 ? styles.hitDieD10 :
                      hitDieSize === 12 ? styles.hitDieD12 :
                      hitDieSize === 20 ? styles.hitDieD20 : '';
                    const minHeal = Math.max(1, 1 + conMod);
                    const maxHeal = Math.max(1, hitDieSize + conMod);
                    const conSign = conMod >= 0 ? '+' : '';
                    return (
                      <span key={i} className={styles.hitDieWrap}>
                        <button
                          type="button"
                          className={`${styles.hitDie} ${dieClass} ${isAvailable ? styles.hitDieAvailable : styles.hitDieSpent}`}
                          onClick={() => { if (isAvailable) { setHdCount('1'); handleShortRest(); } }}
                          disabled={!isAvailable}
                          aria-label={isAvailable ? `Gastar dado de vida ${i + 1}` : `Dado ${i + 1} gasto`}
                        >
                          d{hitDieSize}
                        </button>
                        <span className={styles.hitDieTooltip} role="tooltip">
                          <span className={styles.hitDieTooltipFormula}>
                            1d{hitDieSize}{conSign}{conMod} CON
                          </span>
                          <span className={styles.hitDieTooltipRange}>
                            = {minHeal}–{maxHeal} PV
                          </span>
                        </span>
                      </span>
                    );
                  })}
                </div>
                <div className={styles.shortRestControls}>
                  <span className={styles.shortRestLabel}>
                    Clique em um dado para gastar e recuperar PV
                  </span>
                  <button
                    onClick={() => setShortRestOpen(false)}
                    className={styles.shortRestBtn}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Combat Row: Initiative + AC + Death Saves + Defenses + Conditions */}
          <div className={styles.combatRow}>
            <div className={styles.combatRowStats}>
              <div
                className={`${styles.statBox} ${styles.statBoxHex} ${styles.statBoxClickable}`}
                onClick={() => setSidebar({ type: 'initiative' })}
                role="button"
                tabIndex={0}
              >
                <div className={styles.statValue}>{signedMod(derivedSheet.initiative)}</div>
                <div className={styles.statLabel}>INICIATIVA</div>
              </div>
              <div
                className={`${styles.statBox} ${styles.statBoxShield} ${styles.statBoxClickable}`}
                onClick={() => setSidebar({ type: 'ac' })}
                role="button"
                tabIndex={0}
              >
                <div className={styles.statValue}>{derivedSheet.armorClass}</div>
                <div className={styles.statLabel}>CLASSE ARMADURA</div>
              </div>
            </div>

            <div className={styles.combatRowPanels}>
              <div className={styles.redBox} style={{ flex: 0.8, padding: '16px 12px' }}>
                <div className={styles.sectionHeader}>TESTES CONTRA A MORTE</div>
                <DeathSavesCard
                  deathSaves={playState.deathSaves}
                  onUpdate={handleUpdateDeathSaves}
                />
              </div>

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
                  concentratingOn={playState.concentratingOn}
                  onAdd={handleAddCondition}
                  onRemove={handleRemoveCondition}
                  onStopConcentrating={() => onUpdatePlayState(prev => ({ ...prev, concentratingOn: null }))}
                />
                <ExhaustionTracker
                  level={playState.exhaustionLevel ?? 0}
                  onChange={(level) => onUpdatePlayState(prev => ({ ...prev, exhaustionLevel: level }))}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`${styles.redBox} ${styles.tabsPanel}`}>
            <SheetTabs
              derivedSheet={derivedSheet}
              playState={playState}
              onUpdatePlayState={onUpdatePlayState}
              classFeatures={classFeatures}
              speciesTraits={speciesTraits}
              inventory={inventory}
              learnedCantrips={learnedCantrips}
              preparedSpells={preparedSpells}
              onUpdatePreparedSpells={onUpdatePreparedSpells}
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
              onAttackClick={handleAttackClick}
              currency={currency}
              onUpdateCurrency={onUpdateCurrency}
              backstory={backstory}
              appearance={appearance}
              personalityTraits={personalityTraits}
              faith={faith}
              lifestyle={lifestyle}
              organizations={organizations}
              alignment={alignment}
              onUpdateIdentity={onUpdateIdentity}
              classId={classId}
            />
          </div>
        </div>

      </div>

      {/* ===== INFO PANEL (fixed top-right overlay) ===== */}
      {sidebar !== null && (
        isDesktopWide ? (
          <div className={styles.colSidebar}>
            <div className={styles.colSidebarHeader}>
              <div>
                {sidebarStack.length > 1 && (
                  <button onClick={popSidebar} className={styles.colSidebarBack} aria-label="Voltar">←</button>
                )}
              </div>
              <div>
                <div className={styles.colSidebarTitle}>{sidebarTitle}</div>
                {sidebarSubtitle && <div className={styles.colSidebarSubtitle}>{sidebarSubtitle}</div>}
              </div>
              <button onClick={closeSidebar} className={styles.colSidebarClose} aria-label="Fechar">✕</button>
            </div>
            {renderSidebarContent()}
          </div>
        ) : (
          <SheetSidebar
            isOpen
            onClose={closeSidebar}
            onBack={popSidebar}
            canGoBack={sidebarStack.length > 1}
            title={sidebarTitle}
            subtitle={sidebarSubtitle}
          >
            {renderSidebarContent()}
          </SheetSidebar>
        )
      )}

      {/* ===== DICE RESULT TOAST (D&D Beyond style) ===== */}
      {diceToast && (
        <div className={`${styles.diceToast} ${diceToastExiting ? styles.diceToastExiting : ''}`}>
          <div className={styles.diceToastHeader}>
            <span className={styles.diceToastLabel}>{diceToast.label}</span>
            <button onClick={dismissDiceToast} className={styles.diceToastClose} aria-label="Fechar">✕</button>
          </div>
          <div className={styles.diceToastBody}>
            <div className={
              diceToast.result.isCritical ? styles.diceToastD20Crit
                : diceToast.result.isFumble ? styles.diceToastD20Fumble
                  : styles.diceToastD20
            }>
              {diceToast.result.rolls[0]}
            </div>
            <div className={styles.diceToastInfo}>
              <div className={styles.diceToastTotal}>Total: {diceToast.result.total}</div>
              <div className={styles.diceToastFormula}>{diceToast.result.formula}</div>
              {diceToast.result.isCritical && <div className={styles.diceToastCritBadge}>Acerto Crítico!</div>}
              {diceToast.result.isFumble && <div className={styles.diceToastFumbleBadge}>Falha Crítica!</div>}
            </div>
          </div>
          {diceToast.onReroll && (
            <div className={styles.diceToastActions}>
              <button onClick={diceToast.onReroll} className={styles.diceToastReroll}>
                🎲 Rolar Novamente
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== MODALS ===== */}
      <RestModal
        type={restModal ?? 'long'}
        isOpen={restModal !== null}
        onClose={() => setRestModal(null)}
        onConfirm={restModal === 'long' ? handleLongRest : handleShortRest}
        restoredResources={(playState.customCounters ?? []).reduce<RestRestoredResource[]>((acc, c) => {
          const restoresOnThisRest =
            restModal === 'long'
              ? c.resetOn === 'long' || c.resetOn === 'short'
              : c.resetOn === 'short';
          if (restoresOnThisRest) {
            acc.push({ id: c.id, name: c.name, icon: c.icon, restored: c.max - c.current });
          }
          return acc;
        }, [])}
      />

      <LevelUnlockHistoryModal
        open={showUnlockHistory}
        onClose={() => setShowUnlockHistory(false)}
        playState={playState}
        onClear={() => {
          onUpdatePlayState(prev => ({ ...prev, unlockHistory: [] }));
          setShowUnlockHistory(false);
        }}
      />

      {onSetLevel && classId && (
        <LevelUpModal
          isOpen={showLevelUp}
          onClose={() => setShowLevelUp(false)}
          onConfirm={(newLevel, levelUpClassId) => {
            if (levelUpClassId && onLevelUpClass) {
              onLevelUpClass(levelUpClassId);
            }
            onSetLevel(newLevel);
            setShowLevelUp(false);
          }}
          currentLevel={characterLevel}
          classId={classId}
          className={className}
          classFeatures={classFeatures}
          derivedSheet={derivedSheet}
          classLevels={classLevels}
        />
      )}

      {onAddClass && classLevels && (
        <AddClassModal
          isOpen={showAddClass}
          onClose={() => setShowAddClass(false)}
          onAddClass={(id, name) => { onAddClass(id, name); setShowAddClass(false); }}
          currentClassLevels={classLevels}
          derivedSheet={derivedSheet}
        />
      )}
    </div>
  );
}
