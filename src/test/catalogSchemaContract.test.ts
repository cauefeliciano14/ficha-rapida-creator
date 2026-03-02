import { describe, expect, it } from "vitest";
import { classes } from "@/data/classes";
import { races } from "@/data/races";
import { backgrounds } from "@/data/backgrounds";

const REQUIRED_CLASS_FIELDS = [
  "id", "name", "description", "textBlocks", "primaryAbility", "hitDie", "savingThrows",
  "proficiencies", "skillChoices", "equipmentChoices", "spellcasting", "featuresByLevel", "subclasses", "asiLevels",
] as const;

const REQUIRED_RACE_FIELDS = ["id", "name", "description", "traits"] as const;

const REQUIRED_BACKGROUND_FIELDS = [
  "id", "name", "description", "abilityOptions", "originFeatId",
  "skillsGranted", "toolsGranted", "equipmentOptionA", "equipmentOptionB",
] as const;

function expectRequiredFields(payload: Record<string, unknown>, fields: readonly string[], label: string, nullableFields: readonly string[] = []) {
  for (const field of fields) {
    expect(payload[field], `${label}.${field} should be defined`).not.toBeUndefined();
    if (!nullableFields.includes(field)) {
      expect(payload[field], `${label}.${field} should not be null`).not.toBeNull();
    }
  }
}

describe("catalog schema contract", () => {
  it("mantém contrato de campos obrigatórios para classes", () => {
    expect(REQUIRED_CLASS_FIELDS).toEqual([
      "id", "name", "description", "textBlocks", "primaryAbility", "hitDie", "savingThrows",
      "proficiencies", "skillChoices", "equipmentChoices", "spellcasting", "featuresByLevel", "subclasses", "asiLevels",
    ]);

    for (const entry of classes) {
      expectRequiredFields(entry as unknown as Record<string, unknown>, REQUIRED_CLASS_FIELDS, `classes/${entry.id}`, ["spellcasting"]);
    }
  });

  it("mantém contrato de campos obrigatórios para raças", () => {
    expect(REQUIRED_RACE_FIELDS).toEqual(["id", "name", "description", "traits"]);

    for (const entry of races) {
      expectRequiredFields(entry as unknown as Record<string, unknown>, REQUIRED_RACE_FIELDS, `races/${entry.id}`);
    }
  });

  it("mantém contrato de campos obrigatórios para origens", () => {
    expect(REQUIRED_BACKGROUND_FIELDS).toEqual([
      "id", "name", "description", "abilityOptions", "originFeatId",
      "skillsGranted", "toolsGranted", "equipmentOptionA", "equipmentOptionB",
    ]);

    for (const entry of backgrounds) {
      expectRequiredFields(entry as unknown as Record<string, unknown>, REQUIRED_BACKGROUND_FIELDS, `backgrounds/${entry.id}`);
    }
  });
});
