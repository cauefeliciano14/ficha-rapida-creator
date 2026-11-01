import React from "react";
import { AttributesStep } from "../AttributesStep";
import { StepLayout } from "./StepLayout";
import styles from "./StepLayout.module.css";
import { useCharacter } from "../../context/CharacterContext";
import { useWizard } from "../../context/WizardContext";
import { SmartHints } from "../ui/SmartHints";
import { computeSmartHints } from "../../utils/smartHints";

export const AttributesStepWrapper: React.FC = () => {
  const {
    character,
    setCharacter,
    getAttributeBonus,
    selectedBackground,
    validationResult,
    derivedSheet,
  } = useCharacter();

  const { setCurrentStep, setIsPortraitModalOpen } = useWizard();

  const validationErrors = validationResult.byStep.attributes;
  const canAdvance = validationErrors.length === 0;

  return (
    <StepLayout
      onPrev={() => setCurrentStep(2)}
      onNext={() => setCurrentStep(4)}
      canAdvance={canAdvance}
      errors={validationErrors}
      characterName={character.name}
      setCharacterName={(n) => setCharacter((prev) => ({ ...prev, name: n }))}
      portrait={character.portrait}
      onPortraitClick={() => setIsPortraitModalOpen(true)}
      impactSection="attributes"
    >
      <div className={styles.stepContent}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.4rem", color: "#e6ebef", margin: "0 0 6px 0", fontWeight: 700 }}>
            Atributos do Personagem
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#8a96a0", margin: 0, lineHeight: 1.5 }}>
            Escolha o método para definir os valores base. Bônus do antecedente são somados automaticamente.
          </p>
        </div>

        <AttributesStep
          character={character}
          setCharacter={setCharacter}
          getAttributeBonus={getAttributeBonus}
          selectedBackground={selectedBackground}
          derived={derivedSheet}
        />

        <SmartHints hints={computeSmartHints(character, selectedBackground)} />
      </div>
    </StepLayout>
  );
};
