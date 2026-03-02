import { describe, it, expect } from "vitest";
import { makeCharacter } from "./fixtures";
import { getChoicesRequirements } from "@/utils/choices";

describe("choice engine", () => {
  it("guerreiro nível 1 sem preencher perícias tem pendências", () => {
    const char = makeCharacter({
      class: "guerreiro",
      race: "humano",
      background: "soldado",
      level: 1,
      abilityGeneration: { ...makeCharacter().abilityGeneration, method: "standard", confirmed: true },
      classEquipmentChoice: "A", backgroundEquipmentChoice: null,
      classSkillChoices: ["atletismo", "intuicao"],
      choiceSelections: { classSkills: ["atletismo", "intuicao"], languages: ["anao", "elfico"], tools: [], instruments: [], cantrips: [], spells: [], raceChoice: null, classFeats: [] },
    });
    const req = getChoicesRequirements(char);
    expect(req.needsStep).toBe(true);
    const totalPending = Object.values(req.buckets).reduce((sum, bucket) => sum + bucket.pendingCount, 0);
    expect(totalPending).toBeGreaterThan(0);
  });

  it("mago nível 2 exige cantrips e magias por ID", () => {
    const char = makeCharacter({
      class: "mago",
      race: "elfo",
      background: "sabio",
      level: 2,
      abilityGeneration: { ...makeCharacter().abilityGeneration, method: "standard", confirmed: true },
      abilityScores: { str: 8, dex: 14, con: 13, int: 16, wis: 10, cha: 10 },
      choiceSelections: { classSkills: [], languages: [], tools: [], instruments: [], cantrips: ["rajada-de-fogo"], spells: ["escudo-arcano"], raceChoice: null, classFeats: [] },
    });
    const req = getChoicesRequirements(char);
    expect(req.buckets.cantrips.requiredCount).toBeGreaterThan(0);
    expect(req.buckets.spells.requiredCount).toBeGreaterThan(0);
    expect(req.buckets.cantrips.options.every((o) => typeof o.id === "string")).toBe(true);
  });

  it("bardo nível 10 mantém requisito obrigatório de expertise", () => {
    const char = makeCharacter({
      class: "bardo",
      race: "humano",
      background: "acolito",
      level: 10,
      classFeatureChoices: {},
      abilityGeneration: { ...makeCharacter().abilityGeneration, method: "standard", confirmed: true },
      choiceSelections: { classSkills: [], languages: [], tools: [], instruments: [], cantrips: [], spells: [], raceChoice: null, classFeats: [] },
    });

    const req = getChoicesRequirements(char);
    expect(req.mandatory.bySource.class.some((r) => r.id === "expertise-bardo:especialista")).toBe(true);
    expect(req.mandatory.pending.some((r) => r.id === "expertise-bardo:especialista")).toBe(true);
  });

  it("guerreiro nível 12 não cria pendências de conjuração", () => {
    const char = makeCharacter({
      class: "guerreiro",
      race: "humano",
      background: "soldado",
      level: 12,
      abilityGeneration: { ...makeCharacter().abilityGeneration, method: "standard", confirmed: true },
      choiceSelections: { classSkills: ["atletismo", "intuicao"], languages: ["anao", "elfico"], tools: [], instruments: [], cantrips: [], spells: [], raceChoice: null, classFeats: ["combate-com-armas-grandes"] },
    });

    const req = getChoicesRequirements(char);
    expect(req.buckets.cantrips.requiredCount).toBe(0);
    expect(req.buckets.spells.requiredCount).toBe(0);
  });

  it("troca de classe invalida seleções antigas", () => {
    const wizard = makeCharacter({
      class: "mago",
      level: 1,
      choiceSelections: { classSkills: [], languages: [], tools: [], instruments: [], cantrips: ["rajada-de-fogo"], spells: ["escudo-arcano"], raceChoice: null, classFeats: [] },
    });
    const reqWizard = getChoicesRequirements(wizard);
    expect(reqWizard.buckets.cantrips.selectedIds).toContain("rajada-de-fogo");

    const fighter = { ...wizard, class: "guerreiro" as const };
    const reqFighter = getChoicesRequirements(fighter);
    expect(reqFighter.buckets.cantrips.requiredCount).toBe(0);
    expect(reqFighter.buckets.cantrips.selectedIds).toEqual([]);
  });

  it("escolha racial obrigatória usa chave canônica e zera pendência", () => {
    const datasets = {
      classes: [],
      backgrounds: [],
      races: [{ id: "draconato", raceChoice: { kind: "dragonAncestry", required: true, options: [{ id: "azul", name: "Azul", availability: "available", effects: {} }] } }],
    } as any;
    const base = makeCharacter({
      race: "draconato",
      choiceSelections: { classSkills: [], languages: [], tools: [], instruments: [], cantrips: [], spells: [], raceChoice: null, classFeats: [] },
      raceChoices: {},
    });

    const reqPending = getChoicesRequirements(base, datasets);
    expect(reqPending.buckets.raceChoice.requiredCount).toBe(1);
    expect(reqPending.buckets.raceChoice.pendingCount).toBe(1);
    expect(reqPending.buckets.raceChoice.sources[0]).toContain(":draconicAncestry");

    const selected = makeCharacter({
      ...base,
      choiceSelections: { ...base.choiceSelections, raceChoice: "azul" },
      raceChoices: { draconicAncestry: "azul" },
    });

    const reqSelected = getChoicesRequirements(selected, datasets);
    expect(reqSelected.buckets.raceChoice.selectedIds).toEqual(["azul"]);
    expect(reqSelected.buckets.raceChoice.pendingCount).toBe(0);
  });

  it("escolha em raceChoices.raceChoice não satisfaz requisito canônico", () => {
    const datasets = {
      classes: [],
      backgrounds: [],
      races: [{ id: "draconato", raceChoice: { kind: "dragonAncestry", required: true, options: [{ id: "azul", name: "Azul", availability: "available", effects: {} }] } }],
    } as any;
    const char = makeCharacter({
      race: "draconato",
      choiceSelections: { classSkills: [], languages: [], tools: [], instruments: [], cantrips: [], spells: [], raceChoice: "azul", classFeats: [] },
      raceChoices: { raceChoice: "azul" } as any,
    });

    const req = getChoicesRequirements(char, datasets);
    expect(req.buckets.raceChoice.pendingCount).toBe(1);
    expect(req.buckets.raceChoice.selectedIds).toEqual([]);
  });

  it("idiomas obrigatórios são agregados por source via metadados", () => {
    const datasets = {
      classes: [{ id: "guerreiro", skillChoices: { choose: 2, from: [] }, proficiencies: { languages: ["Um idioma à sua escolha"], tools: [] }, spellcasting: null }],
      backgrounds: [{ id: "sabio", languages: ["Dois idiomas à sua escolha"], toolsGranted: [] }],
      races: [{ id: "humano", languages: ["Um idioma à sua escolha"] }],
    } as any;
    const char = makeCharacter({ class: "guerreiro", race: "humano", background: "sabio" });
    const req = getChoicesRequirements(char, datasets);
    expect(req.buckets.languages.requiredCount).toBe(4);
    expect(req.buckets.languages.sources).toEqual(["race:humano:1", "background:sabio:2", "class:guerreiro:1"]);
  });

  it("bardo exige exatamente 3 instrumentos", () => {
    const char = makeCharacter({
      class: "bardo",
      race: "humano",
      background: "soldado",
      choiceSelections: { classSkills: [], languages: [], tools: [], instruments: [], cantrips: [], spells: [], raceChoice: null, classFeats: [] },
    });

    const req = getChoicesRequirements(char);
    expect(req.buckets.instruments.requiredCount).toBe(3);
  });

  it("adapters mandatory por source incluem requisitos de classe para clérigo e druida", () => {
    const cleric = makeCharacter({ class: "clerigo", level: 1, classFeatureChoices: {} });
    const druid = makeCharacter({ class: "druida", level: 1, classFeatureChoices: {} });

    const clericReq = getChoicesRequirements(cleric);
    const druidReq = getChoicesRequirements(druid);

    expect(clericReq.mandatory.bySource.class.some((r) => r.id === "clerigo-ordem-divina")).toBe(true);
    expect(druidReq.mandatory.bySource.class.some((r) => r.id === "druida-ordem-primal")).toBe(true);
  });

  it("adapters mandatory por source incluem guardião no nível 2", () => {
    const guardian = makeCharacter({ class: "guardiao", level: 2, classFeatureChoices: {} });
    const req = getChoicesRequirements(guardian);

    expect(req.mandatory.bySource.class.some((r) => r.id === "expertise-guardiao:exploradorHabil:especialista")).toBe(true);
  });

  it("adapters mandatory por source incluem escolha racial de draconato", () => {
    const datasets = {
      classes: [],
      backgrounds: [],
      races: [{ id: "draconato", raceChoice: { kind: "dragonAncestry", required: true, options: [{ id: "azul", name: "Azul", availability: "available", effects: {} }] } }],
    } as any;
    const char = makeCharacter({ race: "draconato", raceChoices: {} });
    const req = getChoicesRequirements(char, datasets);

    expect(req.mandatory.bySource.race.some((r) => r.id === "race-choice")).toBe(true);
    expect(req.mandatory.pending.some((r) => r.id === "race-choice")).toBe(true);
  });

});
