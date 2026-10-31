import type { SpellRoll } from './tabs/SpellsTab';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DerivedSheet, DerivedSkill, DerivedSavingThrow, WeaponAttack } from '../../rules/types/DerivedSheet';
import type { CharacterPlayState } from '../../types/playState';
import type { DiceRollResult, AdvantageMode } from '../../utils/diceRoller';
import type { CharacterAppearance, PersonalityTraits, CharacterIdentityUpdate } from '../../types/character';
import { rollD20Check, rollDamage } from '../../utils/diceRoller';

import { signedMod, withSquares, parseMeters, metersToSquares } from '../../utils/format';
import { openPrintableSheet } from '../../utils/printSheet';
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
import { CONDITIONS_2024, findCondition } from '../../data/conditions2024';
import { CollapsibleSection } from './CollapsibleSection';
import { useMediaQuery } from '../../hooks/useMediaQuery';
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

/** Largura em que a ficha foi desenhada; abaixo disso ela encolhe por inteiro. */
const SHEET_DESIGN_WIDTH = 1320;

const DEFENSES_TEXT = [
  '**Resistência**: o dano daquele tipo cai pela metade.',
  '**Vulnerabilidade**: o dano daquele tipo dobra.',
  '**Imunidade**: você não sofre dano daquele tipo (ou não é afetado pela condição).',
  'Resistência e Vulnerabilidade não acumulam: duas resistências ao mesmo tipo contam como uma.',
].join('\n');

/** Mostra **trecho** em negrito nos textos de regras do painel (antes os asteriscos apareciam crus). */
function richText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

/* ── Sidebar state ── */
type SidebarState =
  | { type: 'skill'; skill: DerivedSkill; result?: DiceRollResult }
  | { type: 'save'; save: DerivedSavingThrow; result?: DiceRollResult }
  | { type: 'saves' }
  | { type: 'defenses' }
  | { type: 'conditions' }
  | { type: 'proficiencies' }
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
  onPortraitClick?: () => void;
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
  onPortraitClick,
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
  // Só celular troca o layout; no desktop a ficha encolhe por zoom (ver pageZoom).
  const isMobile = useMediaQuery('(max-width: 599px)');
  const isDesktopWide = !isMobile;

  // Como no D&D Beyond: a ficha tem um tamanho de projeto fixo e, em janela
  // menor, encolhe inteira (zoom) em vez de cortar ou rearrumar os blocos.
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageZoom, setPageZoom] = useState(1);
  useEffect(() => {
    const parent = pageRef.current?.parentElement;
    if (!parent) return;
    const update = () => {
      // Largura útil do pai (sem o padding), senão a ficha passa da borda direita.
      const cs = getComputedStyle(parent);
      const usable = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setPageZoom(Math.min(1, usable / SHEET_DESIGN_WIDTH));
    };
    update();
    window.addEventListener('resize', update);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    ro?.observe(parent);
    return () => {
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, []);

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

  /* Avisos no canto de cima, como no D&D Beyond ("Fulano rolou …"), além do card central. */
  const [rollLog, setRollLog] = useState<{ id: number; label: string; total: number; crit?: boolean; fumble?: boolean }[]>([]);
  const rollLogId = useRef(0);

  const showDiceToast = useCallback((result: DiceRollResult, label: string, onReroll?: () => void) => {
    const id = ++rollLogId.current;
    setRollLog(log => [{ id, label, total: result.total, crit: result.isCritical, fumble: result.isFumble }, ...log].slice(0, 4));
    setTimeout(() => setRollLog(log => log.filter(item => item.id !== id)), 6000);
    if (diceToastTimer.current) clearTimeout(diceToastTimer.current);
    setDiceToastExiting(false);
    setDiceToast({ result, label, onReroll });
    diceToastTimer.current = setTimeout(() => {
      setDiceToastExiting(true);
      setTimeout(() => { setDiceToast(null); setDiceToastExiting(false); }, 250);
    }, 4000);
  }, []);

  const dismissDiceToast = useCallback(() => {
    if (diceToastTimer.current) clearTimeout(diceToastTimer.current);
    setDiceToastExiting(true);
    setTimeout(() => { setDiceToast(null); setDiceToastExiting(false); }, 250);
  }, []);

  useEffect(() => {
    if (!diceToast) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismissDiceToast(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [diceToast, dismissDiceToast]);

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
        {
          label: result.label, total: result.total, type: result.type, timestamp: Date.now(),
          formula: result.formula, rolls: result.rolls, modifier: result.modifier,
          discardedRoll: result.discardedRoll, isCritical: result.isCritical, isFumble: result.isFumble,
        },
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

  /* Como no D&D Beyond: clicar no nome abre as informações; clicar no número rola.
     A rolagem não troca o painel aberto — só atualiza o resultado se for o mesmo item. */
  const handleSkillClick = useCallback((skill: DerivedSkill) => {
    setSidebar({ type: 'skill', skill });
  }, [setSidebar]);

  const handleSkillRoll = useCallback((skill: DerivedSkill) => {
    const abbr = ATTR_ABBR[skill.attribute] ?? skill.attribute;
    const roll = () => {
      const result = rollD20Check(skill.modifier, `${skill.label} (${abbr})`, 'check', advantageMode);
      setSidebarStack(stack => stack.map(entry => (entry.type === 'skill' && entry.skill.label === skill.label ? { ...entry, result } : entry)));
      addToHistory(result);
      return result;
    };
    const result = roll();
    showDiceToast(result, `${skill.label} (${abbr})`, () => {
      const reroll = roll();
      showDiceToast(reroll, `${skill.label} (${abbr})`);
    });
  }, [advantageMode, addToHistory, showDiceToast]);

  const handleSaveClick = useCallback((save: DerivedSavingThrow) => {
    setSidebar({ type: 'save', save });
  }, [setSidebar]);

  const handleSaveRoll = useCallback((save: DerivedSavingThrow) => {
    const roll = () => {
      const result = rollD20Check(save.modifier, `Teste de Resistência (${save.label})`, 'save', advantageMode);
      setSidebarStack(stack => stack.map(entry => (entry.type === 'save' && entry.save.attribute === save.attribute ? { ...entry, result } : entry)));
      addToHistory(result);
      return result;
    };
    const result = roll();
    showDiceToast(result, `Resistência (${save.label})`, () => {
      const reroll = roll();
      showDiceToast(reroll, `Resistência (${save.label})`);
    });
  }, [advantageMode, addToHistory, showDiceToast]);

  const handleInitiativeRoll = useCallback(() => {
    const result = rollD20Check(derivedSheet.initiative, 'Iniciativa', 'check', advantageMode);
    addToHistory(result);
    showDiceToast(result, 'Iniciativa');
  }, [derivedSheet.initiative, advantageMode, addToHistory, showDiceToast]);

  /* Como no D&D Beyond: clicar no atributo rola o teste dele e abre os detalhes. */
  const handleAbilityClick = useCallback((key: string, label: string, score: number, modifier: number) => {
    setSidebar({ type: 'ability', key, label, score, modifier });
    const result = rollD20Check(modifier, `Teste de ${label}`, 'check', advantageMode);
    addToHistory(result);
    showDiceToast(result, `Teste de ${label}`);
  }, [setSidebar, advantageMode, addToHistory, showDiceToast]);

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

  /* Clique na caixa de dano: rola só o dano, sem abrir o painel. */
  const handleDamageClick = useCallback((atk: WeaponAttack) => {
    const dmgFormula = `${atk.damageDice}${atk.damageBonus !== 0 ? (atk.damageBonus > 0 ? '+' : '') + atk.damageBonus : ''}`;
    const damageResult = rollDamage(dmgFormula, atk.weaponName);
    addToHistory(damageResult);
    showDiceToast(damageResult, `${atk.weaponName} (Dano)`);
  }, [addToHistory, showDiceToast]);

  const handleSpellRoll = useCallback((roll: SpellRoll) => {
    if (roll.kind === 'attack') {
      const result = rollD20Check(roll.bonus, roll.spell, 'attack', advantageMode);
      addToHistory(result);
      showDiceToast(result, `${roll.spell} (Ataque)`);
    } else {
      const kind = roll.damageType === 'Cura' ? 'Cura' : 'Dano';
      const result = rollDamage(roll.formula, roll.spell);
      addToHistory(result);
      showDiceToast(result, `${roll.spell} (${kind} ${roll.damageType === 'Cura' ? '' : roll.damageType})`.replace(' )', ')'));
    }
  }, [advantageMode, addToHistory, showDiceToast]);

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
            {sidebar.result
              ? renderRollResult(sidebar.result, rerollSkill)
              : <button onClick={() => handleSkillRoll(sidebar.skill)} className={styles.sidebarRerollBtn}>🎲 Rolar {signedMod(sidebar.skill.modifier)}</button>}
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
              <span>Teste de Resistência de {sidebar.save.label}</span>
              <span className={styles.sidebarInfoMod}>{signedMod(sidebar.save.modifier)}</span>
            </div>
            {sidebar.result
              ? renderRollResult(sidebar.result, rerollSave)
              : <button onClick={() => handleSaveRoll(sidebar.save)} className={styles.sidebarRerollBtn}>🎲 Rolar {signedMod(sidebar.save.modifier)}</button>}
            <hr className={styles.sidebarDivider} />
            <div className={styles.sidebarDescription}>{SAVING_THROW_DESCRIPTION}</div>
          </div>
        );
      }

      case 'saves':
        return (
          <div>
            <div className={styles.sidebarDescription} style={{ marginBottom: 8 }}>Clique no nome para ver os detalhes ou no número para rolar.</div>
            <SavingThrowsCard
              derivedSavingThrows={derivedSheet.derivedSavingThrows}
              onSaveClick={save => pushSidebar({ type: 'save', save })}
              onSaveRoll={handleSaveRoll}
            />
            <hr className={styles.sidebarDivider} />
            <div className={styles.sidebarDescription}>{SAVING_THROW_DESCRIPTION}</div>
          </div>
        );

      case 'defenses': {
        const all = [...derivedSheet.derivedDefenses, ...playState.activeDefenses];
        return (
          <div>
            <div className={styles.sidebarDescription} style={{ marginBottom: 8 }}>
              {all.length > 0 ? all.join(', ') : 'Nenhuma Resistência, Imunidade ou Vulnerabilidade.'}
            </div>
            <DefensesCard
              derivedDefenses={derivedSheet.derivedDefenses}
              activeDefenses={playState.activeDefenses}
              onAdd={handleAddDefense}
              onRemove={handleRemoveDefense}
            />
            <hr className={styles.sidebarDivider} />
            <div className={styles.sidebarDescription}>
              {richText(DEFENSES_TEXT)}
            </div>
          </div>
        );
      }

      case 'conditions': {
        const active = new Set(playState.activeConditions.map(c => findCondition(c)?.name ?? c));
        return (
          <div>
            {CONDITIONS_2024.filter(c => c.name !== 'Exaustão').map(c => {
              const on = active.has(c.name);
              const stored = playState.activeConditions.find(x => (findCondition(x)?.name ?? x) === c.name);
              return (
                <div key={c.name} className={styles.conditionToggleRow}>
                  <div className={styles.conditionToggleHead}>
                    <span className={on ? styles.conditionToggleNameOn : undefined}>{c.name}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={`${on ? 'Remover' : 'Aplicar'} ${c.name}`}
                      className={`${styles.conditionSwitch} ${on ? styles.conditionSwitchOn : ''}`}
                      onClick={() => (on ? handleRemoveCondition(stored ?? c.name) : handleAddCondition(c.name))}
                    />
                  </div>
                  {on && (
                    <ul className={styles.conditionToggleEffects}>
                      {c.effects.map(e => <li key={e}>{e}</li>)}
                    </ul>
                  )}
                </div>
              );
            })}
            <div className={styles.sidebarDescription}>A Exaustão fica no quadro de Condições da ficha.</div>
            <ExhaustionTracker
              level={playState.exhaustionLevel ?? 0}
              onChange={(level) => onUpdatePlayState(prev => ({ ...prev, exhaustionLevel: level }))}
            />
          </div>
        );
      }

      case 'proficiencies': {
        const custom = playState.customProficiencies ?? [];
        const withCustom = (type: string, base: string[]) => [...base, ...custom.filter(c => c.type === type).map(c => c.name)];
        const groups: [string, string[]][] = [
          ['Perícias', withCustom('Perícias', derivedSheet.skillProficiencies)],
          ['Armaduras', withCustom('Armaduras', derivedSheet.armorProficiencies)],
          ['Armas', withCustom('Armas', derivedSheet.weaponProficiencies)],
          ['Ferramentas', withCustom('Ferramentas', derivedSheet.toolProficiencies)],
          ['Idiomas', withCustom('Idiomas', derivedSheet.languages)],
        ];
        return (
          <div>
            <form
              className={styles.addProfForm}
              onSubmit={e => {
                e.preventDefault();
                const form = e.currentTarget;
                const type = (form.elements.namedItem('type') as HTMLSelectElement).value as NonNullable<CharacterPlayState['customProficiencies']>[number]['type'];
                const input = form.elements.namedItem('name') as HTMLInputElement;
                const name = input.value.trim();
                if (!type || !name) return;
                onUpdatePlayState(prev => ({ ...prev, customProficiencies: [...(prev.customProficiencies ?? []), { type, name }] }));
                input.value = '';
              }}
            >
              <div className={styles.addProfTitle}>Adicionar proficiência</div>
              <select name="type" defaultValue="" className={styles.addProfSelect} aria-label="Tipo de proficiência">
                <option value="" disabled>Tipo…</option>
                <option>Idiomas</option>
                <option>Ferramentas</option>
                <option>Armas</option>
                <option>Armaduras</option>
                <option>Perícias</option>
              </select>
              <input name="name" placeholder="Nome (ex.: Élfico)" className={styles.addProfInput} aria-label="Nome da proficiência" />
              <button type="submit" className={styles.addProfBtn}>Adicionar</button>
            </form>
            {custom.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div className={styles.sidebarInfoItem}><span>Adicionadas por você</span></div>
                {custom.map((c, i) => (
                  <div key={`${c.type}-${c.name}-${i}`} className={styles.breakdownRow}>
                    <span>{c.name} <span className={styles.addProfType}>({c.type})</span></span>
                    <button
                      type="button"
                      className={styles.addProfRemove}
                      aria-label={`Remover ${c.name}`}
                      onClick={() => onUpdatePlayState(prev => ({ ...prev, customProficiencies: (prev.customProficiencies ?? []).filter((_, j) => j !== i) }))}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
            {groups.map(([label, items]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div className={styles.sidebarInfoItem}><span>{label}</span></div>
                <div className={styles.sidebarDescription}>{items.length > 0 ? items.join(', ') : 'Nenhuma'}</div>
              </div>
            ))}
            <hr className={styles.sidebarDivider} />
            <div className={styles.sidebarDescription}>
              Proficiência é o que seu personagem treinou. Em perícias, armas e ferramentas em que é proficiente,
              você soma o Bônus de Proficiência ({signedMod(derivedSheet.proficiencyBonus)}) à jogada. Armadura sem
              treinamento dá Desvantagem em testes de FOR e DES e impede conjurar magias. Para mudar proficiências,
              volte às etapas de criação do personagem ou adicione acima as que o Mestre liberar.
            </div>
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
            <div className={styles.breakdownTable}>
              <div className={styles.breakdownRow}><span>Pontuação total</span><span className={styles.breakdownValue}>{sidebar.score}</span></div>
              <div className={styles.breakdownRow}><span>Modificador</span><span className={styles.breakdownValue}>{signedMod(sidebar.modifier)}</span></div>
              {(derivedSheet.attributeBreakdowns?.[sidebar.key] ?? []).map(row => (
                <div key={row.label} className={styles.breakdownRow}>
                  <span>{row.label}</span>
                  <span className={styles.breakdownValue}>{row.label.toLowerCase().startsWith('base') ? row.value : signedMod(row.value)}</span>
                </div>
              ))}
            </div>
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
            range={withSquares(sidebar.attack.range)}
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
            <div className={styles.sidebarDescription}>{richText(PROFICIENCY_BONUS_DESCRIPTION)}</div>
          </div>
        );

      case 'speed':
        return (
          <div>
            <div className={styles.sidebarInfoItem}>
              <span>{withSquares(derivedSheet.speed)}</span>
            </div>
            <div className={styles.sidebarDescription}>{richText(SPEED_DESCRIPTION)}</div>
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
              <span>Classe de Armadura</span>
              <span className={styles.sidebarInfoMod}>{derivedSheet.armorClass}</span>
            </div>
            {(derivedSheet.acBreakdown ?? []).map(row => (
              <div key={row.label} className={styles.breakdownRow}>
                <span className={styles.breakdownValue}>{row.label === 'Sem armadura' || row.label.startsWith('Armadura (') ? row.value : signedMod(row.value)}</span>
                <span>{row.label}</span>
              </div>
            ))}
            <hr className={styles.sidebarDivider} />
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
            <div className={styles.sidebarDescription}>{richText(SENSES_DESCRIPTION)}</div>
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
            <div className={styles.sidebarDescription}>{richText(HP_DESCRIPTION)}</div>
          </div>
        );

      case 'history': {
        // Game Log no estilo do D&D Beyond: um cartão por rolagem, a mais nova embaixo.
        const entries = [...(playState.diceHistory ?? [])].reverse();
        const typeLabel: Record<string, string> = { check: 'Teste', save: 'Resistência', attack: 'Ataque', damage: 'Dano' };
        const timeAgo = (ts: number) => {
          const min = Math.floor((Date.now() - ts) / 60000);
          if (min < 1) return 'agora';
          if (min < 60) return `há ${min} min`;
          const h = Math.floor(min / 60);
          return h < 24 ? `há ${h} h` : `há ${Math.floor(h / 24)} d`;
        };
        return (
          <div className={styles.gameLog}>
            {entries.length === 0 ? (
              <div className={styles.historyEmpty}>Nenhuma rolagem registrada.</div>
            ) : entries.map((entry, i) => {
              const latest = i === entries.length - 1;
              const dice = entry.rolls && entry.rolls.length > 0
                ? entry.rolls.join(' + ') + (entry.modifier ? ` ${entry.modifier > 0 ? '+' : '−'} ${Math.abs(entry.modifier)}` : '')
                : null;
              return (
                <div key={`${entry.timestamp}-${i}`} className={styles.gameLogItem}>
                  <div className={styles.gameLogWho}>{characterName || 'Sem Nome'}</div>
                  <div className={`${styles.gameLogCard} ${latest ? styles.gameLogCardLatest : ''}`}>
                    <div className={styles.gameLogMain}>
                      <span className={styles.gameLogLabel}>
                        {entry.label}: <span className={styles[`gameLogType_${entry.type}`]}>{typeLabel[entry.type] ?? entry.type}</span>
                      </span>
                      <span className={`${styles.gameLogTotal} ${entry.isCritical ? styles.gameLogCrit : ''} ${entry.isFumble ? styles.gameLogFumble : ''}`}>{entry.total}</span>
                    </div>
                    {latest && dice && (
                      <div className={styles.gameLogDetail}>
                        <span className={styles.gameLogDice}>{dice}</span>
                        {entry.discardedRoll !== undefined && <span className={styles.gameLogDiscard}> (descartado {entry.discardedRoll})</span>}
                        {entry.formula && <div className={styles.gameLogFormula}>{entry.formula}</div>}
                      </div>
                    )}
                  </div>
                  <div className={styles.gameLogTime}>{timeAgo(entry.timestamp)}</div>
                </div>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  };

  const sidebarTitle = sidebar
    ? sidebar.type === 'skill' ? 'Perícias'
      : sidebar.type === 'save' || sidebar.type === 'saves' ? 'Testes de Resistência'
        : sidebar.type === 'proficiencies' ? 'Proficiências e Treinamento'
        : sidebar.type === 'defenses' ? 'Defesas'
        : sidebar.type === 'conditions' ? 'Condições'
        : sidebar.type === 'ability' ? sidebar.label
          : sidebar.type === 'attack' ? sidebar.attack.weaponName
            : sidebar.type === 'proficiency' ? 'Bônus de Proficiência'
              : sidebar.type === 'speed' ? 'Deslocamento'
                : sidebar.type === 'initiative' ? 'Iniciativa'
                  : sidebar.type === 'ac' ? 'Classe de Armadura'
                    : sidebar.type === 'senses' ? 'Sentidos'
                      : sidebar.type === 'hp' ? 'Pontos de Vida'
                        : sidebar.type === 'history' ? 'Game Log'
                          : ''
    : '';

  const sidebarSubtitle = sidebar
    ? sidebar.type === 'skill' ? `${sidebar.skill.label} (${ATTR_ABBR[sidebar.skill.attribute] ?? sidebar.skill.attribute}) ${signedMod(sidebar.skill.modifier)}`
      : sidebar.type === 'save' ? `${sidebar.save.label} ${signedMod(sidebar.save.modifier)}`
        : sidebar.type === 'ability' ? `Pontuação ${sidebar.score} · Modificador ${signedMod(sidebar.modifier)}`
          : sidebar.type === 'attack' ? withSquares(sidebar.attack.range)
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
    <div
      ref={pageRef}
      className={`${styles.page} ${sidebar !== null && isDesktopWide ? styles.pageWithPanel : ''}`}
      style={pageZoom < 1 ? { width: SHEET_DESIGN_WIDTH, maxWidth: 'none', boxSizing: 'border-box', zoom: pageZoom } : undefined}
    >
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
            onPortraitClick={onPortraitClick}
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
                  title={mode === 'normal' ? 'Rolar 1d20' : mode === 'advantage' ? 'Rolar 2d20 e ficar com o maior' : 'Rolar 2d20 e ficar com o menor'}
                  aria-pressed={advantageMode === mode}
                >
                  {mode === 'normal' ? 'Normal' : mode === 'advantage' ? 'Vantagem' : 'Desvantagem'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSidebar({ type: 'history' })}
              className={styles.restBtn}
              title="Game Log: todas as rolagens"
            >
              📜 GAME LOG
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
            <button
              onClick={() => {
                const opened = openPrintableSheet({
                  characterName, className, subclassName, speciesName, backgroundName, alignment,
                  level: characterLevel,
                  maxHp: effectiveMaxHP,
                  derivedSheet,
                  features: classFeatures.filter(f => f.level <= characterLevel),
                  traits: speciesTraits,
                  inventory,
                  currency,
                  cantrips: learnedCantrips,
                  preparedSpells,
                  backstory,
                });
                if (!opened) window.alert('Não foi possível preparar a impressão da ficha. Tente de novo.');
              }}
              className={styles.restBtn}
              title="Imprimir a ficha ou salvar como PDF"
            >
              📄 EXPORTAR PDF
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
        <div
          className={styles.statsBandAbilities}
        >
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
              {parseMeters(derivedSheet.speed) !== null
                ? <>{String(parseMeters(derivedSheet.speed)).replace('.', ',')}<span className={styles.speedUnit}> m</span></>
                : derivedSheet.speed}
            </div>
            <div className={styles.statSubLabel}>
              {parseMeters(derivedSheet.speed) !== null ? `${metersToSquares(parseMeters(derivedSheet.speed)!)} QUADRADOS` : 'VELOCIDADE'}
            </div>
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
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div className={styles.sectionHeader}>PONTOS DE VIDA</div>
              <div className={styles.hpLayout}>
                {/* D&D Beyond: Curar / valor / Dano empilhados à esquerda */}
                <div className={styles.hpControls}>
                  <button onClick={handleHeal} className={styles.healBtn} title="Curar">CURAR</button>
                  <input
                    type="number"
                    min="0"
                    value={hpInput}
                    onChange={e => setHpInput(e.target.value)}
                    className={styles.hpInput}
                    placeholder="0"
                    aria-label="Valor de cura ou dano"
                  />
                  <button onClick={handleDamage} className={styles.damageBtn} title="Dano">DANO</button>
                </div>
                <div className={styles.hpColumns}>
                  <div className={styles.hpCol}>
                    <span className={styles.hpLabel}>Atual</span>
                    <span className={styles.hpCurrent} style={{ color: hpColor }}>{playState.currentHp}</span>
                  </div>
                  <span className={styles.hpSeparator}>/</span>
                  <div className={styles.hpCol}>
                    <span className={styles.hpLabel}>Máx.</span>
                    <span className={styles.hpMax}>{effectiveMaxHP}</span>
                  </div>
                  <button type="button" onClick={handleTempHp} className={styles.hpCol + ' ' + styles.hpTempCol} title="Adicionar PV temporário com o valor digitado">
                    <span className={styles.hpLabel}>Temp.</span>
                    <span className={styles.hpTemp}>{playState.tempHp > 0 ? playState.tempHp : '—'}</span>
                  </button>
                </div>
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
              <button type="button" className={`${styles.sectionHeader} ${styles.sectionHeaderBtn}`} onClick={() => setSidebar({ type: 'saves' })}>TESTES DE RESISTÊNCIA ⚙</button>
              <SavingThrowsCard
                derivedSavingThrows={derivedSheet.derivedSavingThrows}
                onSaveClick={handleSaveClick}
                onSaveRoll={handleSaveRoll}
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
              <button type="button" className={`${styles.sectionHeader} ${styles.sectionHeaderBtn}`} onClick={() => setSidebar({ type: 'proficiencies' })}>PROFICIÊNCIAS E TREINAMENTO ⚙</button>
              <ProficienciesCard
                skillProficiencies={[...derivedSheet.skillProficiencies, ...(playState.customProficiencies ?? []).filter(c => c.type === 'Perícias').map(c => c.name)]}
                armorProficiencies={[...derivedSheet.armorProficiencies, ...(playState.customProficiencies ?? []).filter(c => c.type === 'Armaduras').map(c => c.name)]}
                weaponProficiencies={[...derivedSheet.weaponProficiencies, ...(playState.customProficiencies ?? []).filter(c => c.type === 'Armas').map(c => c.name)]}
                toolProficiencies={[...derivedSheet.toolProficiencies, ...(playState.customProficiencies ?? []).filter(c => c.type === 'Ferramentas').map(c => c.name)]}
                languages={[...derivedSheet.languages, ...(playState.customProficiencies ?? []).filter(c => c.type === 'Idiomas').map(c => c.name)]}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Usos Limitados" defaultOpen forceOpen={!isMobile}>
            <div className={styles.redBox}>
              <div className={styles.sectionHeader}>USOS LIMITADOS</div>
              <p className={styles.usesIntro}>Habilidades que só podem ser usadas algumas vezes. Clique numa bolinha ao usar; elas voltam no descanso indicado.</p>
              {(playState.unlockHistory?.length ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setShowUnlockHistory(true)}
                  title="Ver histórico de desbloqueios por nível"
                  aria-label="Histórico de desbloqueios"
                  style={{
                    display: 'block',
                    margin: '8px 0 0 auto',
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
                  📜 O que liberou por nível ({playState.unlockHistory!.length})
                </button>
              )}
              <ClassResourcesCard
                playState={playState}
                onUpdatePlayState={onUpdatePlayState}
                classId={classId}
                characterLevel={characterLevel}
                subclassName={subclassName}
                abilityModifiers={derivedSheet.modifiers}
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
              onSkillRoll={handleSkillRoll}
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
                onClick={() => { setSidebar({ type: 'initiative' }); handleInitiativeRoll(); }}
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
                <div className={styles.statLabel}>CA</div>
                <div className={styles.statValue}>{derivedSheet.armorClass}</div>
                <div className={styles.statLabel} style={{ whiteSpace: 'normal', lineHeight: 1.15, textAlign: 'center' }}>CLASSE<br />ARMADURA</div>
              </div>
            </div>

            <div className={styles.combatRowPanels}>
              <div className={styles.redBox} style={{ flex: 0.8, padding: '16px 12px 30px' }}>
                <div className={styles.sectionHeader}>TESTES CONTRA A MORTE</div>
                <DeathSavesCard
                  deathSaves={playState.deathSaves}
                  onUpdate={handleUpdateDeathSaves}
                />
              </div>

              <div className={styles.redBox} style={{ flex: 1, padding: '16px 12px 30px' }}>
                <button type="button" className={`${styles.sectionHeader} ${styles.sectionHeaderBtn}`} onClick={() => setSidebar({ type: 'defenses' })}>DEFESAS ⚙</button>
                <DefensesCard
                  derivedDefenses={derivedSheet.derivedDefenses}
                  activeDefenses={playState.activeDefenses}
                  onAdd={handleAddDefense}
                  onRemove={handleRemoveDefense}
                />
              </div>

              <div className={styles.redBox} style={{ flex: 1, padding: '16px 12px 30px' }}>
                <button type="button" className={`${styles.sectionHeader} ${styles.sectionHeaderBtn}`} onClick={() => setSidebar({ type: 'conditions' })}>CONDIÇÕES ⚙</button>
                <ConditionsCard
                  activeConditions={playState.activeConditions}
                  concentratingOn={playState.concentratingOn}
                  onAdd={handleAddCondition}
                  onRemove={handleRemoveCondition}
                  onStopConcentrating={() => onUpdatePlayState(prev => ({ ...prev, concentratingOn: null }))}
                  onOpenPanel={() => setSidebar({ type: 'conditions' })}
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
              onDamageClick={handleDamageClick}
              onSpellRoll={handleSpellRoll}
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
              className={className}
              speciesName={speciesName}
            />
          </div>
        </div>

      </div>

      {/* ===== INFO PANEL (gaveta à direita, como no D&D Beyond) ===== */}
      {/* Portal no body: o desfoque do fundo do criador prenderia o painel fixo. */}
      {sidebar !== null && (
        isDesktopWide ? createPortal(
          <div className={`${styles.page} ${styles.colSidebar}`}>
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
          </div>,
          document.body,
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

      {rollLog.length > 0 && createPortal(
        <div className={styles.rollLog} aria-live="polite">
          {rollLog.map(item => (
            <div key={item.id} className={styles.rollLogItem}>
              <span className={styles.rollLogIcon}>🎲</span>
              <span className={styles.rollLogText}>
                {characterName || 'Sem Nome'} rolou <strong>{item.label}</strong>
              </span>
              <span className={`${styles.rollLogTotal} ${item.crit ? styles.rollLogCrit : ''} ${item.fumble ? styles.rollLogFumble : ''}`}>{item.total}</span>
            </div>
          ))}
        </div>,
        document.body,
      )}

      {/* ===== DICE RESULT (centered overlay card) ===== */}
      {/* Portal no body: a animação da página cria um bloco de contenção e tiraria o card do centro. */}
      {diceToast && createPortal(
        <div
          className={`${styles.diceOverlay} ${diceToastExiting ? styles.diceOverlayExiting : ''}`}
          onClick={dismissDiceToast}
          data-testid="dice-result-overlay"
        >
          <div
            className={`${styles.diceCard} ${diceToast.result.isCritical ? styles.diceCardCrit : diceToast.result.isFumble ? styles.diceCardFumble : ''}`}
            role="status"
            aria-live="assertive"
            aria-atomic="true"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={dismissDiceToast} className={styles.diceCardClose} aria-label="Fechar">✕</button>
            <div className={styles.diceCardLabel}>{diceToast.label}</div>
            <div
              className={
                diceToast.result.isCritical ? styles.diceCardD20Crit
                  : diceToast.result.isFumble ? styles.diceCardD20Fumble
                    : styles.diceCardD20
              }
              aria-label={`Dado: ${diceToast.result.rolls[0]}`}
            >
              {diceToast.result.rolls[0]}
            </div>
            {diceToast.result.discardedRoll !== undefined && (
              <div className={styles.diceCardMode}>
                {diceToast.result.advantageMode === 'advantage' ? 'Vantagem' : 'Desvantagem'}
                {' · '}descartado <s>{diceToast.result.discardedRoll}</s>
              </div>
            )}
            {diceToast.result.isCritical && <div className={styles.diceCardBadge}>Acerto Crítico!</div>}
            {diceToast.result.isFumble && <div className={styles.diceCardBadgeFumble}>Falha Crítica!</div>}
            <div className={styles.diceCardFormula}>{diceToast.result.formula}</div>
            <div className={styles.diceCardTotal}>Total: {diceToast.result.total}</div>
            {diceToast.onReroll && (
              <button onClick={diceToast.onReroll} className={styles.diceCardReroll}>
                🎲 Rolar Novamente
              </button>
            )}
          </div>
        </div>
        , document.body)}

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
