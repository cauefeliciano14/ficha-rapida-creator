import { useMemo, type ReactNode } from 'react';
import { useCharacter } from '../../../context/CharacterContext';
import { useWizard } from '../../../context/WizardContext';
import { computeWizardProgress } from '../../../utils/wizardProgress';
import styles from './GlobalProgressBar.module.css';

/** Junta mensagens iguais e tira o final que só repete a etapa ("para continuar"…). */
function groupPending(messages: string[]): Array<{ msg: string; count: number }> {
  const out: Array<{ msg: string; count: number }> = [];
  for (const raw of messages) {
    const msg = raw
      .replace(/\s+(para concluir a etapa de [^.]+|para continuar|antes de avançar)\.?$/i, '.')
      .replace(/^Defina Escolha/, 'Escolha');
    const hit = out.find(o => o.msg === msg);
    if (hit) hit.count += 1;
    else out.push({ msg, count: 1 });
  }
  return out;
}

interface Props {
  onQuickBuild?: () => void;
  quickBuildDisabled?: boolean;
  onOpenQuiz?: () => void;
  onRandomize?: () => void;
  onOpenTemplates?: () => void;
  /** Baixa o arquivo da ficha para mandar ao mestre. */
  onSendToGM?: () => void;
  /** Ações fixas à esquerda da barra (personagens, desfazer/refazer). */
  leading?: ReactNode;
}

export function GlobalProgressBar({ onQuickBuild, quickBuildDisabled, onOpenQuiz, onRandomize, onOpenTemplates, onSendToGM, leading }: Props) {
  const { character, selectedBackground, validationResult } = useCharacter();
  const { currentStep, goToStep } = useWizard();

  const progress = useMemo(
    () => computeWizardProgress(character, selectedBackground, validationResult),
    [character, selectedBackground, validationResult],
  );

  return (
    <div id="creator-progress-bar" className={styles.bar} role="region" aria-label="Progresso da criação do personagem">
      {leading}
      {/* D&D Beyond: etapas como abas com nome, sem barra de porcentagem */}
      <nav className={styles.tabs} aria-label="Etapas">
        {[...progress.steps, { key: 'sheet', index: 5, label: 'Ficha', completed: false, pending: 0 }].map((step) => {
          const isActive = currentStep === step.index;
          return (
            <button
              key={step.key}
              type="button"
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => goToStep(step.index)}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Ir para ${step.label}`}
              title={step.pending > 0 ? `${step.pending} pendência${step.pending > 1 ? 's' : ''}` : undefined}
            >
              {step.label}
              {step.completed && !isActive ? <span className={styles.tabCheck}>✓</span> : null}
              {step.pending > 0 ? <span className={styles.tabCount}>{step.pending}</span> : null}
            </button>
          );
        })}
      </nav>

      {progress.totalPending > 0 ? (
        <details className={styles.pendingMenu}>
          <summary className={styles.pendingBadge} title="Ver o que falta">
            ⚠ {progress.totalPending} pendente{progress.totalPending > 1 ? 's' : ''} ▾
          </summary>
          {/* O que falta, por etapa; clicar leva até a etapa. */}
          <div className={styles.pendingPanel}>
            {progress.steps.filter(st => st.pending > 0).map(st => (
              <div key={st.key} className={styles.pendingGroup}>
                <div className={styles.pendingStep}>{st.label}</div>
                <ul className={styles.pendingList}>
                  {groupPending(validationResult.byStep[st.key] ?? []).map(({ msg, count }) => (
                    <li key={msg}>
                      <button
                        type="button"
                        className={styles.pendingItem}
                        onClick={(e) => {
                          (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                          goToStep(st.index);
                        }}
                      >
                        {msg}{count > 1 ? ` (×${count})` : ''}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      ) : (
        <span className={styles.allDone}>✓ Tudo certo</span>
      )}

      {(onOpenTemplates || onOpenQuiz || onRandomize || onQuickBuild || onSendToGM) && (
        <details className={styles.shortcuts}>
          <summary className={styles.shortcutsBtn}>Atalhos ▾</summary>
          <div className={styles.shortcutsMenu}>
            <div className={styles.shortcutsGroup}>Criar mais rápido</div>
            {onOpenTemplates && (
              <button type="button" onClick={onOpenTemplates} title="Personagens prontos em 1 clique">
                Personagens prontos
              </button>
            )}
            {onOpenQuiz && (
              <button type="button" onClick={onOpenQuiz} title="Quiz de 4 perguntas que sugere a classe ideal">
                Quiz: qual classe combina comigo?
              </button>
            )}
            {onRandomize && (
              <button type="button" onClick={onRandomize} title="Gera um personagem 100% aleatório válido">
                Personagem aleatório
              </button>
            )}
            {onQuickBuild && (
              <button
                type="button"
                onClick={onQuickBuild}
                disabled={quickBuildDisabled}
                title="Preenche atributos sugeridos, equipamento A e antecedente sinérgico"
              >
                Completar o resto automaticamente
              </button>
            )}
            {onSendToGM && (
              <>
                <div className={styles.shortcutsGroup}>Ficha</div>
                <button type="button" onClick={onSendToGM} title="Baixa o arquivo da ficha para você enviar ao mestre (ex.: pelo Discord)">
                  📤 Enviar ficha ao mestre
                </button>
              </>
            )}
          </div>
        </details>
      )}
    </div>
  );
}
