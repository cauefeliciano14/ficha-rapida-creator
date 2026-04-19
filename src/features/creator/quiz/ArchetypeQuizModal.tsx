import { useState, useMemo } from 'react';
import { QUIZ_QUESTIONS, scoreClasses, type QuizAnswers, type QuizMatch } from '../../../utils/archetypeQuiz';
import { CLASS_ROLE_META } from '../../../data/classRoles';
import bgData from '../../../data/db.json';
import styles from './ArchetypeQuizModal.module.css';

interface Props {
  onClose: () => void;
  onPickClass: (classSelection: { id: string; name: string; description: string }) => void;
}

const getClassIconSrc = (classId: string) => `/imgs/icone_classe/${classId}.png`;

export function ArchetypeQuizModal({ onClose, onPickClass }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const isResults = step >= QUIZ_QUESTIONS.length;
  const currentQ = !isResults ? QUIZ_QUESTIONS[step] : null;

  const matches: QuizMatch[] = useMemo(() => (isResults ? scoreClasses(answers) : []), [isResults, answers]);

  const handlePick = (value: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
    setStep((s) => s + 1);
  };

  const handlePickClass = (classId: string) => {
    const cls = bgData.classes.find((c: { id: string; name: string; description: string }) => c.id === classId);
    if (cls) {
      onPickClass(cls);
      onClose();
    }
  };

  const handleRestart = () => { setStep(0); setAnswers({}); };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Quiz de Arquétipo">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>🧭 Quiz de Arquétipo</h2>
            <p className={styles.subtitle}>
              {isResults ? 'Suas melhores combinações de classe' : `Pergunta ${step + 1} de ${QUIZ_QUESTIONS.length}`}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className={styles.progress}>
          {QUIZ_QUESTIONS.map((_, i) => (
            <div key={i} className={`${styles.progressDot} ${i < step || isResults ? styles.progressDotActive : ''}`} />
          ))}
        </div>

        {!isResults && currentQ && (
          <>
            <h3 className={styles.question}>{currentQ.question}</h3>
            <div className={styles.options}>
              {currentQ.options.map((opt) => (
                <button key={opt.value} className={styles.option} onClick={() => handlePick(opt.value)}>
                  <span className={styles.optionIcon}>{opt.icon}</span>
                  <div className={styles.optionBody}>
                    <div className={styles.optionLabel}>{opt.label}</div>
                    <div className={styles.optionDesc}>{opt.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {isResults && (
          <>
            <div className={styles.matches}>
              {matches.map((m, i) => {
                const cls = bgData.classes.find((c: { id: string; name: string }) => c.id === m.classId);
                const meta = CLASS_ROLE_META[m.classId];
                if (!cls) return null;
                return (
                  <button
                    key={m.classId}
                    className={`${styles.matchCard} ${i === 0 ? styles.matchTop : ''}`}
                    onClick={() => handlePickClass(m.classId)}
                  >
                    <img className={styles.matchIcon} src={getClassIconSrc(m.classId)} alt="" />
                    <div className={styles.matchBody}>
                      <div className={styles.matchNameRow}>
                        <span className={styles.matchName}>{cls.name}</span>
                        <span className={styles.matchScore}>{m.score}% match</span>
                      </div>
                      <div className={styles.matchTagline}>{meta?.tagline ?? ''}</div>
                      {m.reasons.length > 0 && (
                        <div className={styles.matchReasons}>
                          {m.reasons.map((r) => (<span key={r} className={styles.reasonChip}>{r}</span>))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={handleRestart}>↻ Refazer</button>
              <button className={styles.primaryBtn} onClick={onClose}>Fechar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
