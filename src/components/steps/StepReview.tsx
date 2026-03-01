import { useCharacterStore } from "@/state/characterStore";
import { useBuilderStore, type StepId } from "@/state/builderStore";
import { races, hasPlannedRaceContent } from "@/data/races";
import { classes } from "@/data/classes";
import { backgrounds } from "@/data/backgrounds";
import { spells as spellsData } from "@/data/spells";
import { featsById } from "@/data/feats";
import { itemsById } from "@/data/items";
import {
  ABILITY_LABELS, ABILITY_SHORT, ABILITIES, calcAbilityMod,
  getFinalAbilityScores, ALL_SKILLS, type AbilityKey,
} from "@/utils/calculations";
import { validateCharacterCompleteness } from "@/utils/validation";
import {
  downloadCharacterJSON, generateSummaryText,
  readFileAsJSON, validateImportPayload, exportSharePayload, sharePayloadToBase64,
} from "@/utils/export";
import {
  CheckCircle2, AlertCircle, Download, Copy, Printer, ArrowLeft,
  ChevronDown, Shield, Swords, Wand2, BookOpen, Users, Scroll, Star,
  Upload, Share2, FileText, Heart, Zap, Eye, Footprints,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function StepReview() {
  const char = useCharacterStore();
  const builder = useBuilderStore();
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const race = races.find((r) => r.id === char.race);
  const subrace = race?.subraces.find((sr) => sr.id === char.subrace);
  const cls = classes.find((c) => c.id === char.class);
  const bg = backgrounds.find((b) => b.id === char.background);
  const isSpellcaster = cls?.spellcasting != null;

  const finalScores = useMemo(
    () => getFinalAbilityScores(char.abilityScores, char.racialBonuses, char.backgroundBonuses, char.asiBonuses, char.featAbilityBonuses),
    [char.abilityScores, char.racialBonuses, char.backgroundBonuses, char.asiBonuses, char.featAbilityBonuses]
  );

  const validation = useMemo(() => validateCharacterCompleteness(char, builder.choicesRequirements?.needsStep ?? false), [
    char.race, char.subrace, char.class, char.background,
    char.abilityGeneration.confirmed, char.abilityGeneration.method,
    char.classSkillChoices, char.classEquipmentChoice, char.backgroundEquipmentChoice,
    char.spells.cantrips, char.spells.prepared, char.spells.spellcastingAbility,
    char.raceAbilityChoices, char.backgroundAbilityChoices,
    char.inventory, char.equipped, char.features,
    builder.choicesRequirements?.needsStep,
  ]);

  const goToStep = (stepId: string) => builder.goToStep(stepId as StepId);

  const handleExport = () => {
    downloadCharacterJSON(char);
    toast({ title: "Exportado!", description: "Arquivo JSON baixado com sucesso." });
  };

  const handleCopy = async () => {
    const text = generateSummaryText(char);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copiado!", description: "Resumo copiado para a área de transferência." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => navigate("/print");

  const handleShare = async () => {
    const payload = exportSharePayload(char);
    const b64 = sharePayloadToBase64(payload);
    await navigator.clipboard.writeText(b64);
    toast({ title: "Link copiado!", description: "Payload compartilhável copiado (Base64)." });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const raw = await readFileAsJSON(file);
      const result = validateImportPayload(raw);
      if (!result.success) {
        toast({ title: "Erro na importação", description: result.errors.join("\n"), variant: "destructive" });
        return;
      }
      if (result.warnings.length > 0) toast({ title: "Aviso", description: result.warnings.join("\n") });
      if (result.data) {
        char.patchCharacter(result.data as any);
        char.recalc();
        toast({ title: "Importado!", description: "Personagem importado com sucesso." });
      }
    } catch (err: any) {
      toast({ title: "Erro", description: err.message ?? "Falha ao ler arquivo.", variant: "destructive" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const visibleSteps = builder.getVisibleSteps();
  const lastIncompleteStep = visibleSteps.find(
    (s) => s.id !== "sheet" && !builder.completedSteps.includes(s.id)
  );

  const dexMod = calcAbilityMod(finalScores.dex);

  return (
    <div className="p-3 sm:p-6 print:p-2 max-w-5xl mx-auto animate-fade-in">
      {/* ── Validation Banner ── */}
      {(validation.missing.length > 0 || validation.warnings.length > 0) && (
        <div className="mb-4 space-y-2 animate-fade-in">
          {validation.missing.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 sm:p-4">
              <p className="text-sm font-semibold text-destructive flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" /> {validation.missing.length} itens pendentes
              </p>
              <ul className="space-y-1">
                {validation.missing.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground text-xs sm:text-sm">• {m.label}</span>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-primary shrink-0" onClick={() => goToStep(m.stepId)}>
                      Etapa {m.stepNumber} →
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          PAGE 1 — Character Sheet (Official Layout)
         ════════════════════════════════════════════════════ */}

      {/* ── Identity Header Row ── */}
      <div className="sheet-section mb-3">
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="sheet-box-label block mb-1">Nome do Personagem</label>
              <input
                type="text"
                placeholder="Nome..."
                value={char.name}
                onChange={(e) => char.setField("name", e.target.value)}
                className="w-full bg-transparent border-b-2 border-gold/30 focus:border-gold outline-none pb-1 text-lg sm:text-xl font-display font-bold transition-colors"
              />
            </div>
            <SheetField label="Espécie" value={`${race?.name ?? "—"}${subrace ? ` (${subrace.name})` : ""}`} />
            <SheetField label="Classe / Nível" value={`${cls?.name ?? "—"} ${char.level}`} />
            <SheetField label="Antecedente" value={bg?.name ?? "—"} />
          </div>
        </div>
      </div>

      {/* ── Main Content: 2-column layout like official sheet ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3">

        {/* ══ LEFT COLUMN: Abilities + Saves + Skills ══ */}
        <div className="space-y-3">

          {/* Proficiency Bonus */}
          <div className="sheet-box animate-pulse-gold">
            <span className="sheet-box-label">Bônus de Proficiência</span>
            <p className="text-2xl font-bold font-display mt-1">+{char.proficiencyBonus}</p>
          </div>

          {/* Ability Scores - Vertical Stack */}
          <div className="space-y-2">
            {ABILITIES.map((a, i) => {
              const total = finalScores[a];
              const mod = calcAbilityMod(total);
              const profSave = char.savingThrows.some(
                (st) => st.toLowerCase().startsWith(ABILITY_LABELS[a].toLowerCase().substring(0, 3))
              );
              const saveTotal = mod + (profSave ? char.proficiencyBonus : 0);

              return (
                <div
                  key={a}
                  className="ability-diamond animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-center min-w-[56px]">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gold">{ABILITY_LABELS[a]}</p>
                        <p className="text-2xl font-bold font-display leading-none mt-0.5">{mod >= 0 ? "+" : ""}{mod}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{total}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`prof-dot ${profSave ? "filled" : "empty"}`} />
                      <div className="text-right min-w-[40px]">
                        <p className="text-[9px] uppercase text-muted-foreground">Salva</p>
                        <p className={`text-sm font-bold ${profSave ? "text-success" : "text-muted-foreground"}`}>
                          {saveTotal >= 0 ? "+" : ""}{saveTotal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inspiration */}
          <div className="sheet-box">
            <span className="sheet-box-label">Inspiração Heroica</span>
            <div className="mt-1 h-6 w-6 mx-auto rounded-full border-2 border-gold/40" />
          </div>
        </div>

        {/* ══ RIGHT COLUMN: Combat + Skills + Features ══ */}
        <div className="space-y-3">

          {/* Combat Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <CombatBox icon={<Shield className="h-4 w-4" />} label="Classe de Armadura" value={String(char.armorClass)} highlight />
            <CombatBox icon={<Heart className="h-4 w-4" />} label="Pontos de Vida" value={String(char.hitPoints.max)} subValue={`d${char.hitDie}`} />
            <CombatBox icon={<Zap className="h-4 w-4" />} label="Iniciativa" value={`${dexMod >= 0 ? "+" : ""}${dexMod}`} />
            <CombatBox icon={<Footprints className="h-4 w-4" />} label="Deslocamento" value={`${char.speed}m`} />
          </div>

          {/* Skills Table */}
          <div className="sheet-section">
            <div className="sheet-section-header">
              <BookOpen className="h-3.5 w-3.5" />
              Perícias
            </div>
            <div className="divide-y divide-border/50">
              {ALL_SKILLS.map((skill) => {
                const mod = calcAbilityMod(finalScores[skill.ability]);
                const proficient = char.skills.includes(skill.name);
                const expert = char.expertiseSkills?.includes(skill.name);
                const total = mod + (proficient ? char.proficiencyBonus : 0) + (expert ? char.proficiencyBonus : 0);
                return (
                  <div
                    key={skill.name}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-secondary/30 ${proficient ? "" : "text-muted-foreground/70"}`}
                  >
                    <span className={`prof-dot ${expert ? "filled" : proficient ? "filled" : "empty"}`} />
                    {expert && <span className="prof-dot filled -ml-1.5" />}
                    <span className="flex-1 truncate text-xs sm:text-sm">{skill.name}</span>
                    <span className="text-[10px] uppercase text-muted-foreground/60 w-6 text-center font-semibold">{ABILITY_SHORT[skill.ability]}</span>
                    <span className={`font-mono font-bold text-sm w-7 text-right ${proficient ? "text-foreground" : "text-muted-foreground/40"}`}>
                      {total >= 0 ? "+" : ""}{total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passive Perception */}
          <div className="sheet-box">
            <span className="sheet-box-label">Percepção Passiva</span>
            <p className="sheet-box-value">
              {10 + calcAbilityMod(finalScores.wis) + (char.skills.includes("Percepção") ? char.proficiencyBonus : 0)}
            </p>
          </div>

          {/* Attacks & Cantrips */}
          {char.attacks.length > 0 && (
            <div className="sheet-section">
              <div className="sheet-section-header">
                <Swords className="h-3.5 w-3.5" />
                Armas e Truques de Dano
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase text-muted-foreground bg-secondary/30">
                      <th className="text-left py-2 px-3">Nome</th>
                      <th className="text-center py-2 px-2">Bônus Atq/CD</th>
                      <th className="text-left py-2 px-2">Dano e Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {char.attacks.map((atk) => (
                      <tr key={atk.weaponId} className="border-t border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="py-2 px-3 font-medium text-xs sm:text-sm">{atk.name}</td>
                        <td className="text-center py-2 px-2">
                          <span className="font-bold text-primary">{atk.attackBonus >= 0 ? "+" : ""}{atk.attackBonus}</span>
                          {!atk.proficient && <span className="text-[10px] text-warning ml-1">!</span>}
                        </td>
                        <td className="py-2 px-2 text-muted-foreground text-xs sm:text-sm">{atk.damage.split(" (")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Features */}
          {char.features.length > 0 && (
            <div className="sheet-section">
              <div className="sheet-section-header">
                <Star className="h-3.5 w-3.5" />
                Características
              </div>
              <div className="p-3 space-y-1">
                {groupFeaturesWithLevel(char.features).map(([group, feats]) => (
                  <div key={group}>
                    <p className="text-[10px] uppercase text-gold/70 font-bold tracking-widest mb-1 mt-2 first:mt-0">{group}</p>
                    {feats.map((f, i) => (
                      <Collapsible key={`${f.sourceId}-${f.name}-${i}`}>
                        <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 hover:bg-secondary/40 transition-colors text-left group">
                          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                          <span className="text-xs sm:text-sm font-medium">{f.name}</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-7 pb-2 text-xs text-muted-foreground leading-relaxed animate-fade-in">
                          {f.description}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feats */}
          {char.appliedFeats.length > 0 && (
            <div className="sheet-section">
              <div className="sheet-section-header">
                <Scroll className="h-3.5 w-3.5" />
                Talentos
              </div>
              <div className="p-3 space-y-2">
                {char.appliedFeats.map((af, i) => {
                  const feat = featsById[af.featId];
                  return (
                    <Collapsible key={`${af.featId}-${i}`}>
                      <CollapsibleTrigger className="flex items-center justify-between gap-2 w-full rounded-md px-2 py-1.5 hover:bg-secondary/40 transition-colors text-left group">
                        <div className="flex items-center gap-2">
                          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                          <span className="text-xs sm:text-sm font-medium">{feat?.name ?? af.featId}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-2 py-0.5 shrink-0">
                          {af.source === "background" ? "Origem" : `Nv. ${af.levelTaken}`}
                        </span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-7 pb-2 text-xs text-muted-foreground leading-relaxed animate-fade-in">
                        {feat?.description ?? ""}
                        {af.choices?.abilityIncreases && Object.keys(af.choices.abilityIncreases).some(k => (af.choices!.abilityIncreases![k as AbilityKey] ?? 0) > 0) && (
                          <div className="mt-1.5 flex gap-1 flex-wrap">
                            {Object.entries(af.choices.abilityIncreases).filter(([, v]) => v && v > 0).map(([k, v]) => (
                              <span key={k} className="rounded bg-gold/10 border border-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-gold">{ABILITY_SHORT[k as AbilityKey]} +{v}</span>
                            ))}
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          )}

          {/* Proficiencies */}
          <div className="sheet-section">
            <div className="sheet-section-header">
              <Shield className="h-3.5 w-3.5" />
              Treinamento em Equipamentos
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ProfList label="Armaduras" items={char.proficiencies.armor} />
              <ProfList label="Armas" items={char.proficiencies.weapons} />
              <ProfList label="Ferramentas" items={char.proficiencies.tools} />
              <ProfList label="Idiomas" items={char.proficiencies.languages} />
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PAGE 2 — Spells & Equipment
         ════════════════════════════════════════════════════ */}

      {/* ── Spells Section ── */}
      {isSpellcaster && cls?.spellcasting && (
        <div className="mt-4 sheet-section print:break-before-page">
          <div className="sheet-section-header">
            <Wand2 className="h-3.5 w-3.5" />
            Magias
          </div>
          <div className="p-3 sm:p-4 space-y-4">
            {/* Spellcasting Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="sheet-box">
                <span className="sheet-box-label">Atributo de Conjuração</span>
                <p className="text-sm sm:text-base font-bold font-display mt-1">{cls.spellcasting.ability}</p>
              </div>
              <div className="sheet-box">
                <span className="sheet-box-label">CD para Evitar</span>
                <p className="sheet-box-value">{char.spells.spellSaveDC}</p>
              </div>
              <div className="sheet-box">
                <span className="sheet-box-label">Mod. de Conjuração</span>
                <p className="sheet-box-value">+{char.spells.spellAttackBonus}</p>
              </div>
            </div>

            {/* Spell Slots */}
            {char.spells.slots.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gold mb-2">Espaços de Magias</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                  {char.spells.slots.map((count, i) => (
                    <div key={i} className={`sheet-box ${count > 0 ? "" : "opacity-40"}`}>
                      <span className="text-[9px] uppercase text-muted-foreground">{i + 1}º Circ.</span>
                      <p className="text-lg font-bold mt-0.5">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cantrips */}
            {char.spells.cantrips.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gold mb-2">Truques</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {char.spells.cantrips.map((id) => {
                    const sp = spellsData.find((s) => s.id === id);
                    return (
                      <div key={id} className="flex items-center gap-2 rounded border border-border/50 bg-secondary/20 px-3 py-1.5 text-sm hover:bg-secondary/40 transition-colors">
                        <Sparkle className="h-3 w-3 text-gold/60 shrink-0" />
                        <span className="font-medium text-xs sm:text-sm">{sp?.name ?? id}</span>
                        {sp?.school && <span className="text-[10px] text-muted-foreground ml-auto">{sp.school}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prepared/Known Spells */}
            {char.spells.prepared.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gold mb-2">
                  {cls.spellcasting.type === "known" || cls.spellcasting.type === "pact" ? "Magias Conhecidas" : "Magias Preparadas"}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[9px] uppercase text-muted-foreground bg-secondary/30">
                        <th className="text-left py-1.5 px-2">Círculo</th>
                        <th className="text-left py-1.5 px-2">Nome</th>
                        <th className="text-left py-1.5 px-2 hidden sm:table-cell">Escola</th>
                        <th className="text-center py-1.5 px-2 hidden sm:table-cell">C</th>
                        <th className="text-center py-1.5 px-2 hidden sm:table-cell">R</th>
                      </tr>
                    </thead>
                    <tbody>
                      {char.spells.prepared.map((id) => {
                        const sp = spellsData.find((s) => s.id === id);
                        return (
                          <tr key={id} className="border-t border-border/30 hover:bg-secondary/20 transition-colors">
                            <td className="py-1.5 px-2 text-xs text-gold font-bold">{sp?.level ?? "?"}</td>
                            <td className="py-1.5 px-2 font-medium text-xs sm:text-sm">{sp?.name ?? id}</td>
                            <td className="py-1.5 px-2 text-xs text-muted-foreground hidden sm:table-cell">{sp?.school ?? ""}</td>
                            <td className="text-center py-1.5 px-2 hidden sm:table-cell">{sp?.concentration ? "●" : ""}</td>
                            <td className="text-center py-1.5 px-2 hidden sm:table-cell">{sp?.ritual ? "●" : ""}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Equipment Section ── */}
      <div className="mt-4 sheet-section">
        <div className="sheet-section-header">
          <Shield className="h-3.5 w-3.5" />
          Equipamento
        </div>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {char.equipped?.armor && (
              <div className="sheet-box">
                <span className="sheet-box-label">Armadura</span>
                <p className="text-xs sm:text-sm font-bold mt-1">{itemsById[char.equipped.armor]?.name ?? "—"}</p>
              </div>
            )}
            {char.equipped?.shield && (
              <div className="sheet-box">
                <span className="sheet-box-label">Escudo</span>
                <p className="text-xs sm:text-sm font-bold mt-1">{itemsById[char.equipped.shield]?.name ?? "—"}</p>
              </div>
            )}
            <div className="sheet-box">
              <span className="sheet-box-label">Ouro (PO)</span>
              <p className="sheet-box-value text-gold">{char.gold?.gp ?? 0}</p>
            </div>
          </div>

          {char.inventory.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase text-muted-foreground bg-secondary/30">
                    <th className="text-left py-2 px-3">Item</th>
                    <th className="text-center py-2 px-2">Qtd</th>
                    <th className="text-center py-2 px-2 hidden sm:table-cell">Peso</th>
                    <th className="text-center py-2 px-2">Equip.</th>
                  </tr>
                </thead>
                <tbody>
                  {char.inventory.map((entry) => {
                    const item = itemsById[entry.itemId];
                    const isEquipped =
                      char.equipped?.armor === entry.itemId ||
                      char.equipped?.shield === entry.itemId ||
                      char.equipped?.weapons.includes(entry.itemId);
                    return (
                      <tr key={entry.itemId} className={`border-t border-border/30 transition-colors hover:bg-secondary/20 ${isEquipped ? "bg-primary/5" : ""}`}>
                        <td className="py-1.5 px-3 font-medium text-xs sm:text-sm">{item?.name ?? entry.itemId}</td>
                        <td className="text-center py-1.5 px-2 text-xs">{entry.quantity}</td>
                        <td className="text-center py-1.5 px-2 text-xs text-muted-foreground hidden sm:table-cell">
                          {item ? `${(item.weight * entry.quantity).toFixed(1)}` : "—"}
                        </td>
                        <td className="text-center py-1.5 px-2">
                          {isEquipped && <CheckCircle2 className="h-3.5 w-3.5 text-success mx-auto" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Actions Bar ── */}
      <div className="mt-6 mb-4 print:hidden animate-fade-in">
        <div className="flex flex-wrap gap-2">
          {lastIncompleteStep && (
            <Button variant="outline" size="sm" onClick={() => goToStep(lastIncompleteStep.id)} className="gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar e Ajustar
            </Button>
          )}
          <Button size="sm" onClick={handleExport} className="gap-1">
            <Download className="h-3.5 w-3.5" /> JSON
          </Button>
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1">
            <Upload className="h-3.5 w-3.5" /> Importar
          </Button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
          <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1">
            <Copy className="h-3.5 w-3.5" /> {copied ? "Copiado!" : "Copiar"}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleShare} className="gap-1">
            <Share2 className="h-3.5 w-3.5" /> Compartilhar
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePrint} className="gap-1">
            <FileText className="h-3.5 w-3.5" /> Imprimir
          </Button>
        </div>
      </div>

      {/* Completion badge */}
      <div className="flex justify-center pb-4 print:hidden">
        {validation.isComplete ? (
          <Badge className="bg-success text-success-foreground gap-1.5 px-4 py-1.5 text-sm animate-scale-in">
            <CheckCircle2 className="h-4 w-4" /> Ficha Completa
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1.5 px-4 py-1.5 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" /> Faltam {validation.missing.length} itens
          </Badge>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──

function Sparkle({ className }: { className?: string }) {
  return <Wand2 className={className} />;
}

function SheetField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="sheet-box-label mb-0.5">{label}</p>
      <p className="text-sm font-medium border-b border-border/50 pb-1">{value}</p>
    </div>
  );
}

function CombatBox({ icon, label, value, subValue, highlight }: { icon: React.ReactNode; label: string; value: string; subValue?: string; highlight?: boolean }) {
  return (
    <div className={`sheet-box ${highlight ? "border-gold/40 animate-pulse-gold" : ""}`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        <span className="text-gold/70">{icon}</span>
      </div>
      <p className="sheet-box-label">{label}</p>
      <p className={`font-bold font-display mt-0.5 ${highlight ? "text-2xl text-gold" : "text-xl"}`}>{value}</p>
      {subValue && <p className="text-[10px] text-muted-foreground">{subValue}</p>}
    </div>
  );
}

function ProfList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => a.localeCompare(b, "pt-BR"));
  return (
    <div>
      <p className="text-[10px] uppercase text-gold/60 font-bold tracking-widest mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {sorted.map((i) => (
          <span key={i} className="rounded bg-secondary px-2 py-0.5 text-[11px] font-medium">{i}</span>
        ))}
      </div>
    </div>
  );
}

const SOURCE_LABELS: Record<string, string> = {
  race: "Raça", subrace: "Sub-raça", class: "Classe",
  subclass: "Subclasse", background: "Antecedente", other: "Outro",
};

function groupFeaturesWithLevel(features: { sourceType: string; name: string; description: string; sourceId: string; level?: number }[]) {
  const groups: Record<string, typeof features> = {};
  for (const f of features) {
    let key = SOURCE_LABELS[f.sourceType] ?? f.sourceType;
    if (f.sourceType === "class" && f.level) {
      key = `${key} — Nível ${f.level}`;
    }
    (groups[key] ??= []).push(f);
  }
  return Object.entries(groups);
}