import { portraitSrc } from '../../utils/portraitSrc';
import React, { useMemo, useRef, useState } from 'react';
import {
  listSavedCharacters,
  deleteCharacter,
  loadSavedCharacter,
  saveCharacter,
  downloadCharacterFile,
  parseCharacterFile,
} from '../../utils/persistence';
import type { SavedCharacterMeta } from '../../utils/persistence';
import { useCharacter } from '../../context/CharacterContext';
import { useWizard } from '../../context/WizardContext';
import styles from './CharacterManagerModal.module.css';

interface CharacterManagerModalProps {
  onClose: () => void;
}

export function CharacterManagerModal({ onClose }: CharacterManagerModalProps) {
  const [listVersion, setListVersion] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const characters = useMemo(() => listSavedCharacters(), [listVersion]);
  const [importMessage, setImportMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeCharacterId, handleLoadCharacter, handleResetCharacter } = useCharacter();
  const { setCurrentStep } = useWizard();

  const handleCreateNew = () => {
    handleResetCharacter();
    setCurrentStep(0);
    onClose();
  };

  const handleLoad = (meta: SavedCharacterMeta) => {
    const fullChar = loadSavedCharacter(meta.id);
    if (fullChar) {
      handleLoadCharacter(fullChar);
      setCurrentStep(fullChar.creationSnapshot.currentStep ?? 0);
      onClose();
    }
  };

  const handleDelete = (e: React.MouseEvent, meta: SavedCharacterMeta) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja apagar ${meta.name || 'este personagem'}? Isso não pode ser desfeito.`)) {
      deleteCharacter(meta.id);
      setListVersion(v => v + 1);
      if (activeCharacterId === meta.id) {
        handleResetCharacter();
        setCurrentStep(0);
      }
    }
  };

  const handleExport = (e: React.MouseEvent, meta: SavedCharacterMeta) => {
    e.stopPropagation();
    const fullChar = loadSavedCharacter(meta.id);
    if (fullChar) downloadCharacterFile(fullChar);
  };

  const handleImport = async (file: File) => {
    try {
      const saved = parseCharacterFile(await file.text());
      saveCharacter(saved);
      setListVersion(v => v + 1);
      setImportMessage({ ok: true, text: `${saved.name || 'Personagem'} importado. Clique no card para abrir a ficha.` });
    } catch (err) {
      setImportMessage({ ok: false, text: err instanceof Error ? err.message : 'Não foi possível ler o arquivo.' });
    }
  };

  // Sort by savedAt descending
  const sorted = useMemo(() => {
    return [...characters].sort((a, b) => b.savedAt - a.savedAt);
  }, [characters]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Gerenciador de Personagens</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className={styles.actionBar}>
          <button className={styles.newCharBtn} onClick={handleCreateNew}>
            ✦ Criar Novo Personagem
          </button>
          <button className={styles.importBtn} onClick={() => fileInputRef.current?.click()}>
            ⬆ Importar ficha
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.target.value = '';
            }}
          />
        </div>
        <p className={styles.shareHint}>
          Para mandar a ficha ao mestre: clique em <b>Exportar</b> no card e envie o arquivo (pelo Discord, por exemplo). O mestre usa <b>Importar ficha</b>.
        </p>
        {importMessage && (
          <div className={importMessage.ok ? styles.importOk : styles.importError} role="status">{importMessage.text}</div>
        )}

        {sorted.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⚔️</div>
            Gere ou crie um novo personagem para vê-lo aqui.
          </div>
        ) : (
          <div className={styles.grid}>
            {sorted.map((c) => {
              const isActive = activeCharacterId === c.id;
              const dateCreated = new Date(c.savedAt).toLocaleDateString('pt-BR');
              const timeCreated = new Date(c.savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={c.id} className={`${styles.card} ${isActive ? styles.cardActive : ''}`} onClick={() => handleLoad(c)}>
                  <div className={styles.cardVisual}>
                    {c.portrait ? (
                      <img src={portraitSrc(c.portrait)} alt={c.name} className={styles.cardPortrait} />
                    ) : (
                      <div className={styles.cardPortraitFallback}>?</div>
                    )}
                    {isActive && <div className={styles.activeBadge}>Sessão Atual</div>}
                  </div>
                  
                  <div className={styles.cardInfo}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardName}>{c.name || 'Herói sem Nome'}</span>
                    </div>
                    
                    <div className={styles.cardMetaItems}>
                      <span className={styles.metaChip}>NV {c.level || 1}</span>
                      <span className={styles.metaChip}>{c.className || 'Aventureiro'}</span>
                      <span className={styles.metaChip}>{c.speciesName || 'Convidado'}</span>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardDate}>Salvo em {dateCreated} às {timeCreated}</span>
                      <button className={styles.exportBtn} onClick={(e) => handleExport(e, c)} title="Baixar arquivo da ficha para enviar ao mestre">
                        Exportar
                      </button>
                      <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, c)} title="Apagar personagem">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
