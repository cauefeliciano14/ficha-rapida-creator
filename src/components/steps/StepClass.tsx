import { useCharacterStore, mergeUnique, replaceFeatures, type NormalizedFeature } from "@/state/characterStore";
import { useBuilderStore } from "@/state/builderStore";
import { classes, type ClassData } from "@/data/classes";
import { CheckCircle2, Search, Info, ChevronDown, ChevronUp, Package, Loader2 } from "lucide-react";
import { getChoicesRequirements } from "@/utils/choices";
import { instruments } from "@/data/instruments";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { MAX_SUPPORTED_LEVEL, SUPPORTED_LEVEL_MESSAGE } from "@/config/builder";

function hasAttributeBonus(cls: ClassData): boolean {
  return Array.isArray(cls.attributeBonus) && cls.attributeBonus.length > 0;
}

export function StepClass() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  const classId = useCharacterStore((s) => s.class);
  // subclassId removed — subclass UI moved to future step
  const classEquipmentChoice = useCharacterStore((s) => s.classEquipmentChoice);
  const classFeatureChoices = useCharacterStore((s) => s.classFeatureChoices);
  const level = useCharacterStore((s) => s.level);
  const patchCharacter = useCharacterStore((s) => s.patchCharacter);
  const completeStep = useBuilderStore((s) => s.completeStep);
  const uncompleteStep = useBuilderStore((s) => s.uncompleteStep);
  const setMissing = useBuilderStore((s) => s.setMissing);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setIsFiltering(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [search]);

  const sorted = useMemo(
    () => [...classes]
      .filter((c) => c.name.toLowerCase().includes(debouncedSearch))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [debouncedSearch]
  );

  const selectedClass = classes.find((c) => c.id === classId);
  const choiceSelections = useCharacterStore((s) => s.choiceSelections);
  const raceId = useCharacterStore((s) => s.race);
  const backgroundId = useCharacterStore((s) => s.background);
  const datasetsVersion = `${classes.length}:${instruments.length}`;
  const requirements = useMemo(() => getChoicesRequirements(useCharacterStore.getState()), [classId, raceId, backgroundId, level, choiceSelections, datasetsVersion]);

  // --- Level handler ---
  const handleLevelChange = useCallback((newLevel: number) => {
    if (newLevel < 1 || newLevel > MAX_SUPPORTED_LEVEL) return;
    if (newLevel === level) return;

    const state = useCharacterStore.getState();
    const patch: Partial<typeof state> = { level: newLevel };

    if (state.class) {
      const cls = classes.find((c) => c.id === state.class);
      if (cls) {
        const newFeatures: NormalizedFeature[] = [];
        for (const lvlBlock of cls.featuresByLevel) {
          if (lvlBlock.level <= newLevel) {
            for (const f of lvlBlock.features) {
              newFeatures.push({
                sourceType: "class",
                sourceId: cls.id,
                name: f.name,
                description: f.description,
                level: lvlBlock.level,
              });
            }
          }
        }
        patch.features = replaceFeatures(state.features, ["class"], newFeatures);

        if (cls.spellcasting) {
          const slotData = cls.spellcasting.spellSlotsByLevel[newLevel] ?? {};
          patch.spells = { ...state.spells, slots: Object.values(slotData) };
        }
      }
    }

    patchCharacter(patch);
  }, [level, patchCharacter]);

  // --- Validation ---
  const computeMissing = useCallback(() => {
    const missing: string[] = [];
    if (!classId) {
      missing.push("Escolher classe");
    } else {
      const cls = classes.find((c) => c.id === classId);
      if (cls) {
        // Cleric: Divine Order required
        if (classId === "clerigo" && !classFeatureChoices["clerigo:ordemDivina"]) {
          missing.push("Escolher Ordem Divina");
        }
        // Druid: Primal Order required
        if (classId === "druida" && !classFeatureChoices["druida:ordemPrimal"]) {
          missing.push("Escolher Ordem Primal");
        }
        if (classId === "bardo" && requirements.buckets.instruments.pendingCount > 0) {
          const sel = requirements.buckets.instruments.requiredCount - requirements.buckets.instruments.pendingCount;
          missing.push(`Escolher instrumentos (${sel}/${requirements.buckets.instruments.requiredCount})`);
        }
      }
    }
    return missing;
  }, [classId, classFeatureChoices, requirements.buckets.instruments.pendingCount, requirements.buckets.instruments.requiredCount]);

  useEffect(() => {
    const missing = computeMissing();
    setMissing("class", missing);
    if (missing.length === 0 && classId) {
      completeStep("class");
    } else {
      uncompleteStep("class");
    }
  }, [classId, classFeatureChoices, computeMissing, completeStep, setMissing, uncompleteStep]);

  // --- Select class ---
  const handleSelect = (id: string) => {
    if (id === classId) return;

    const cls = classes.find((c) => c.id === id)!;
    const state = useCharacterStore.getState();

    // Build features up to current level
    const currentLevel = state.level;
    const newFeatures: NormalizedFeature[] = [];
    for (const lvlBlock of cls.featuresByLevel) {
      if (lvlBlock.level <= currentLevel) {
        for (const f of lvlBlock.features) {
          newFeatures.push({
            sourceType: "class" as const,
            sourceId: cls.id,
            name: f.name,
            description: f.description,
            level: lvlBlock.level,
          });
        }
      }
    }

    // Remove old class/subclass features, add new
    const features = replaceFeatures(state.features, ["class", "subclass"], newFeatures);

    // Spells setup
    const spells = cls.spellcasting
      ? {
          cantrips: [],
          prepared: [],
          slots: Object.values(cls.spellcasting.spellSlotsByLevel[currentLevel] ?? {}),
          spellcastingAbility: cls.spellcasting.ability,
          spellSaveDC: 0,
          spellAttackBonus: 0,
        }
      : {
          cantrips: [],
          prepared: [],
          slots: [],
          spellcastingAbility: null,
          spellSaveDC: 0,
          spellAttackBonus: 0,
        };

    // Rebuild proficiencies: keep race-sourced, replace class
    // For simplicity we just set class proficiencies directly.
    // Race profs are merged in from race step.
    const racialFeatures = state.features.filter(
      (f) => f.sourceType === "race" || f.sourceType === "subrace"
    );

    // Set class-specific flags for engine overrides
    const classFlags: Record<string, number | boolean> = {
      ...state.flags,
      unarmoredDefenseBarbarian: id === "barbaro",
      unarmoredDefenseMonk: id === "monge",
      draconicResilience: false, // reset on class change; set by subclass
    };

    patchCharacter({
      class: id,
      subclass: null,
      classSkillChoices: [],
      classEquipmentChoice: null,
      backgroundEquipmentChoice: null,
      backgroundEquipmentItems: [],
      backgroundGold: 0,
      hitDie: cls.hitDie,
      savingThrows: cls.savingThrows,
      proficiencies: {
        ...state.proficiencies,
        armor: cls.proficiencies.armor,
        weapons: cls.proficiencies.weapons,
        tools: mergeUnique(state.proficiencies.tools, cls.proficiencies.tools),
      },
      features,
      spells,
      equipment: [],
      flags: classFlags,
      classFeatureChoices: {},
      expertiseSkills: [],
      choiceSelections: { ...state.choiceSelections, classSkills: [], instruments: [] },
    });
  };


  // --- Select equipment ---
  const handleEquipment = (choiceId: string) => {
    if (!selectedClass) return;
    const choice = selectedClass.equipmentChoices.find((e) => e.id === choiceId);
    patchCharacter({
      classEquipmentChoice: choiceId,
      equipment: choice?.items ?? [],
    });
  };

  // Subclass logic removed — will be in future step

  const toggleInstrument = (instrumentId: string) => {
    if (classId !== "bardo") return;
    const current = new Set(choiceSelections.instruments ?? []);
    if (current.has(instrumentId)) current.delete(instrumentId);
    else if (current.size < 3) current.add(instrumentId);
    patchCharacter({ choiceSelections: { ...choiceSelections, instruments: [...current] } });
  };

  const toggleFeature = (name: string) => {
    setExpandedFeatures((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-0">
      {/* Left - Class list */}
      <div className="w-full md:w-72 md:shrink-0 border-b md:border-b-0 md:border-r p-4 overflow-y-auto">
        {/* Level Selector */}
        <section className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Nível Inicial
          </h3>
          <p className="mb-2 text-xs text-muted-foreground">{SUPPORTED_LEVEL_MESSAGE}</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 rounded-lg border bg-card p-1 gap-1 w-full">
            {Array.from({ length: MAX_SUPPORTED_LEVEL }, (_, index) => index + 1).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`min-h-11 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  level === lvl
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                Nível {lvl}
              </button>
            ))}
          </div>
        </section>

        <h2 className="mb-3 text-lg font-bold">1. Escolha sua Classe</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full bg-secondary py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground"
          />
          {isFiltering && (
            <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="space-y-2">
          {isFiltering && (
            <div className="space-y-2 pb-1" aria-label="Filtrando classes">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          )}
          {sorted.map((cls) => {
            const isSelected = classId === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => handleSelect(cls.id)}
                className={`w-full rounded-lg border p-3 text-left transition-all duration-200 group ${
                  isSelected
                    ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_4px_12px_hsl(var(--primary)/0.15)]"
                    : "border-border/60 hover:border-gold/30 hover:bg-secondary/60 hover:shadow-[0_2px_8px_hsl(0_0%_0%/0.2)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {cls.name}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-border/60 shrink-0 group-hover:border-gold/30 transition-colors" />
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                  <span className="rounded bg-secondary/80 px-1.5 py-0.5 font-bold text-gold/70 font-display">d{cls.hitDie}</span>
                  <span className="text-muted-foreground">{cls.primaryAbility.join(", ")}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                  {cls.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right - Details */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {selectedClass ? (
          <ClassDetails
            cls={selectedClass}
            classEquipmentChoice={classEquipmentChoice}
            classFeatureChoices={classFeatureChoices}
            level={level}
            expandedFeatures={expandedFeatures}
            instrumentSelections={choiceSelections.instruments ?? []}
            instrumentOptions={requirements.buckets.instruments.options}
            instrumentPending={requirements.buckets.instruments.pendingCount}
            onToggleInstrument={toggleInstrument}
            onToggleFeature={toggleFeature}
            onSetFeatureChoice={(key, value) => {
              const state = useCharacterStore.getState();
              const newChoices = { ...state.classFeatureChoices, [key]: value };

              // Apply Cleric Protetor proficiencies
              if (key === "clerigo:ordemDivina") {
                const baseCls = classes.find((c) => c.id === "clerigo")!;
                let armor = [...baseCls.proficiencies.armor];
                let weapons = [...baseCls.proficiencies.weapons];
                if (value === "protetor") {
                  armor = mergeUnique(armor, ["Armaduras Pesadas"]);
                  weapons = mergeUnique(weapons, ["Armas Marciais"]);
                }
                patchCharacter({
                  classFeatureChoices: newChoices,
                  proficiencies: { ...state.proficiencies, armor, weapons },
                });
                return;
              }

              // Apply Druid Protetor proficiencies
              if (key === "druida:ordemPrimal") {
                const baseCls = classes.find((c) => c.id === "druida")!;
                let armor = [...baseCls.proficiencies.armor];
                let weapons = [...baseCls.proficiencies.weapons];
                if (value === "protetor") {
                  armor = mergeUnique(armor, ["Armaduras Médias"]);
                  weapons = mergeUnique(weapons, ["Armas Marciais"]);
                }
                patchCharacter({
                  classFeatureChoices: newChoices,
                  proficiencies: { ...state.proficiencies, armor, weapons },
                });
                return;
              }

              patchCharacter({ classFeatureChoices: newChoices });
            }}
          />
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gold/15 bg-secondary/10">
            <div className="text-3xl opacity-30">⚔️</div>
            <p className="text-sm text-muted-foreground/60 font-display">Selecione uma classe para começar</p>
          </div>
        )}
      </div>

      {/* Subclass swap removed */}
    </div>
  );
}

// ─── Detail Panel ───

interface ClassDetailsProps {
  cls: ClassData;
  classEquipmentChoice: string | null;
  classFeatureChoices: Record<string, string | string[]>;
  level: number;
  expandedFeatures: Record<string, boolean>;
  instrumentSelections: string[];
  instrumentOptions: { id: string; name: string }[];
  instrumentPending: number;
  onToggleInstrument: (id: string) => void;
  onToggleFeature: (name: string) => void;
  onSetFeatureChoice: (key: string, value: string) => void;
}

function ClassDetails({
  cls,
  classEquipmentChoice,
  classFeatureChoices,
  level,
  expandedFeatures,
  instrumentSelections,
  instrumentOptions,
  instrumentPending,
  onToggleInstrument,
  onToggleFeature,
  onSetFeatureChoice,
}: ClassDetailsProps) {
  const isSpellcaster = cls.spellcasting !== null;
  const avgHitPointsPerLevel = Math.floor(cls.hitDie / 2) + 1;

  return (
    <div>
      <h2 className="text-2xl font-bold">{cls.name}</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {cls.description}
      </p>

      <div className="mt-6 space-y-4">
        {/* Basic Traits */}
        <Section title="Traços Básicos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg border border-primary/35 bg-primary/10 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">Atributo Primário</p>
              <p className="mt-1 text-lg font-bold">{cls.primaryAbility.join(", ")}</p>
            </div>
            <div className="rounded-lg border border-primary/35 bg-primary/10 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">Dado de Vida</p>
              <p className="mt-1 text-lg font-bold">d{cls.hitDie}</p>
            </div>
            <div className="rounded-lg border border-primary/35 bg-primary/10 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">Salvaguardas</p>
              <p className="mt-1 text-lg font-bold">{cls.savingThrows.join(", ")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Pontos de Vida no Nível 1:</span>{" "}
              {cls.hitDie} + modificador de Constituição
            </div>
            <div>
              <span className="text-muted-foreground">Pontos de Vida por Nível:</span>{" "}
              d{cls.hitDie} + modificador de Constituição, ou, {avgHitPointsPerLevel} + modificador de Constituição
            </div>
            <div>
              <span className="text-muted-foreground">Conjurador:</span>{" "}
              {isSpellcaster ? "Sim" : "Não"}
            </div>
          </div>
        </Section>

        {/* Conjuração — logo após Traços Básicos */}
        {isSpellcaster && cls.spellcasting && (
          <Section title="Conjuração">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="rounded-lg border border-primary/35 bg-primary/10 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">Atributo de Conjuração</p>
                <p className="mt-1 text-lg font-bold">{cls.spellcasting.ability}</p>
              </div>
              <div className="rounded-lg border border-primary/35 bg-primary/10 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">Tipo</p>
                <p className="mt-1 text-lg font-bold">
                  {cls.spellcasting.type === "prepared" ? "Magias Preparadas" : cls.spellcasting.type === "known" ? "Magias Conhecidas" : "Magia de Pacto"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Truques no Nível {level}:</span>{" "}
                <span className="font-bold">
                  {(() => {
                    const entries = Object.entries(cls.spellcasting!.cantripsKnownAtLevel)
                      .map(([l, c]) => [Number(l), c] as [number, number])
                      .sort((a, b) => a[0] - b[0]);
                    let lim = 0;
                    for (const [l, c] of entries) { if (level >= l) lim = c; }
                    return lim;
                  })()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Fórmula:</span>{" "}
                <span className="font-medium text-xs">{cls.spellcasting.spellsPreparedFormula}</span>
              </div>
              {cls.spellcasting.spellSlotsByLevel[level] && (
                <div>
                  <span className="text-muted-foreground">Espaços:</span>{" "}
                  <span className="font-bold">
                    {Object.entries(cls.spellcasting.spellSlotsByLevel[level])
                      .map(([lvl, slots]) => `${slots}× ${lvl}º`)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground italic">
              A seleção de magias será feita na etapa "Escolhas".
            </p>
          </Section>
        )}

        {hasAttributeBonus(cls) && (
          <Section title="Bônus de atributo">
            <div className="flex flex-wrap gap-2">
              {cls.attributeBonus!
                .slice()
                .sort((a, b) => a.localeCompare(b, "pt-BR"))
                .map((bonus) => (
                  <span key={bonus} className="rounded bg-secondary px-2 py-1 text-xs">
                    {bonus}
                  </span>
                ))}
            </div>
          </Section>
        )}

        {/* Armor proficiencies */}
        {cls.proficiencies.armor.length > 0 && (
          <Section title="Proficiências em Armadura">
            <div className="flex flex-wrap gap-2">
              {cls.proficiencies.armor
                .sort((a, b) => a.localeCompare(b, "pt-BR"))
                .map((p) => (
                  <span key={p} className="rounded bg-secondary px-2 py-1 text-xs">
                    {p}
                  </span>
                ))}
            </div>
          </Section>
        )}

        {/* Weapon proficiencies */}
        <Section title="Proficiências em Armas">
          <div className="flex flex-wrap gap-2">
            {cls.proficiencies.weapons
              .sort((a, b) => a.localeCompare(b, "pt-BR"))
              .map((p) => (
                <span key={p} className="rounded bg-secondary px-2 py-1 text-xs">
                  {p}
                </span>
              ))}
          </div>
        </Section>

        <Section title="Perícias">
          <p className="text-sm text-muted-foreground mb-2">
            Escolha {cls.skillChoices.choose}: {cls.skillChoices.from.slice().sort((a, b) => a.localeCompare(b, "pt-BR")).join(", ")}.
          </p>
          <p className="text-xs text-muted-foreground">
            A seleção final de perícias é feita na etapa <span className="font-medium">5. Equipamentos</span>.
          </p>
        </Section>

        {cls.id === "bardo" && (
          <Section title="Instrumentos Musicais (Proficiência)">
            <p className="text-sm text-muted-foreground mb-3">Escolha exatamente 3 instrumentos.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {instrumentOptions.map((opt) => {
                const selected = instrumentSelections.includes(opt.id);
                const disabled = !selected && instrumentSelections.length >= 3;
                return (
                  <button key={opt.id} onClick={() => onToggleInstrument(opt.id)} disabled={disabled} className={`rounded-md border px-3 py-2 text-left text-sm ${selected ? "border-primary bg-primary/10" : disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-secondary"}`}>
                    {opt.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{instrumentSelections.length}/3 selecionados • pendentes: {instrumentPending}</p>
          </Section>
        )}

        {/* Equipment preview (selection happens in step 5: Equipamentos) */}
        <Section title="Equipamento Inicial">
          <p className="text-sm text-muted-foreground">
            Você escolherá seu equipamento inicial na etapa <span className="font-medium">5. Equipamentos</span>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cls.equipmentChoices.map((choice) => (
              <div key={choice.id} className="rounded-lg border p-4 bg-secondary/40">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{choice.label}</span>
                </div>
                {choice.items.length > 0 ? (
                  <ul className="ml-6 text-xs text-muted-foreground space-y-0.5">
                    {choice.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-6 text-xs text-muted-foreground">
                    {choice.gold} PO para comprar equipamento
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ── Cleric: Divine Order ── */}
        {cls.id === "clerigo" && (
          <Section
            title="Ordem Divina (Nível 1)"
            badge={!classFeatureChoices["clerigo:ordemDivina"] ? <RequiredBadge label="Obrigatório" /> : null}
          >
            <p className="text-sm text-muted-foreground mb-3">
              Escolha sua Ordem Divina. Isso determina proficiências extras e habilidades.
            </p>
            <div className="space-y-2">
              {[
                { id: "protetor", name: "Protetor", desc: "Proficiência com armaduras pesadas e armas marciais." },
                { id: "taumaturgo", name: "Taumaturgo", desc: "+1 truque de clérigo. Bônus em Arcanismo e Religião (= max(mod. SAB, +1))." },
              ].map((opt) => {
                const selected = classFeatureChoices["clerigo:ordemDivina"] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSetFeatureChoice("clerigo:ordemDivina", opt.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selected ? "border-primary bg-primary/10" : "hover:border-muted-foreground/40 hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{opt.name}</span>
                      {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── Druid: Primal Order ── */}
        {cls.id === "druida" && (
          <Section
            title="Ordem Primal (Nível 1)"
            badge={!classFeatureChoices["druida:ordemPrimal"] ? <RequiredBadge label="Obrigatório" /> : null}
          >
            <p className="text-sm text-muted-foreground mb-3">
              Escolha sua Ordem Primal. Isso determina proficiências extras e habilidades.
            </p>
            <div className="space-y-2">
              {[
                { id: "protetor", name: "Protetor", desc: "Proficiência com armaduras médias e armas marciais." },
                { id: "xama", name: "Xamã", desc: "+1 truque de druida. Bônus em Arcanismo e Natureza (= max(mod. SAB, +1))." },
              ].map((opt) => {
                const selected = classFeatureChoices["druida:ordemPrimal"] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSetFeatureChoice("druida:ordemPrimal", opt.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selected ? "border-primary bg-primary/10" : "hover:border-muted-foreground/40 hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{opt.name}</span>
                      {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* Class features grouped by level */}
        <Section title={`Características de Classe de ${cls.name}`}>
          {cls.featuresByLevel
            .filter((fl) => fl.level <= level)
            .sort((a, b) => a.level - b.level)
            .map((fl) => {
              const levelKey = `level-${fl.level}`;
              const levelOpen = expandedFeatures[levelKey] ?? true;
              return (
                <div key={fl.level} className="mb-2 rounded-md border bg-secondary/30">
                  <button
                    onClick={() => onToggleFeature(levelKey)}
                    className="flex w-full items-center justify-between p-3"
                  >
                    <span className="font-semibold text-sm">Nível {fl.level}</span>
                    {levelOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {levelOpen && (
                    <div className="space-y-2 px-3 pb-3">
                      {fl.features.map((f) => {
                        const key = `${fl.level}-${f.name}`;
                        const isOpen = expandedFeatures[key] ?? true;
                        return (
                          <div key={key} className="rounded-md border bg-card/80">
                            <button
                              onClick={() => onToggleFeature(key)}
                              className="flex w-full items-center justify-between p-3"
                            >
                              <span className="font-medium text-sm">{f.name}</span>
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                            {isOpen && (
                              <p className="px-3 pb-3 text-xs text-muted-foreground">{f.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </Section>

        {level >= 2 && (
          <p className="text-xs text-muted-foreground italic mt-1 mb-4">
            Você começará com as características dos níveis 1 e {level}.
          </p>
        )}

        {/* Conjuração movida para após Traços Básicos */}

        {/* Subclasses removidas da etapa Classe */}
      </div>
    </div>
  );
}

// ─── Helpers ───

function Section({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
        {badge}
      </div>
      <div>{children}</div>
    </div>
  );
}

function RequiredBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
      <Info className="h-3 w-3" />
      {label}
    </span>
  );
}

// Subclass section removed — will be used in a future step
