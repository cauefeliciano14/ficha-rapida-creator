import type { Character } from '../types/character';
import type { CharacterPlayState } from '../types/playState';
import { DEFAULT_PLAY_STATE } from '../types/playState';

export const CREATION_STORAGE_KEY = 'dnd_creation_state';
export const CREATION_STATE_VERSION = 1;
export const CHARACTERS_LIST_KEY = 'dnd_characters_list';
export const ACTIVE_CHARACTER_KEY = 'dnd_active_character_id';

export interface CreationStateSnapshot {
  character: Character;
  currentStep: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auxiliaryState?: any;
  shellState?: {
    sidebarCollapsed?: boolean;
    summaryCollapsed?: boolean;
  };
}

export function loadCreationState(): CreationStateSnapshot | null {
  try {
    const raw = localStorage.getItem(CREATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CREATION_STATE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ── Multi-character management ──────────────────────────────────────────────

export interface SavedCharacterMeta {
  id: string;
  name: string;
  className: string;
  speciesName: string;
  level: number;
  portrait: string | null;
  savedAt: number;
}

export interface SavedCharacter extends SavedCharacterMeta {
  creationSnapshot: CreationStateSnapshot;
  playState: CharacterPlayState;
  selectedBackgroundId?: string | null;
  attrChoiceMode?: string;
  attrPlus1?: string;
  attrPlus2?: string;
}

export function listSavedCharacters(): SavedCharacterMeta[] {
  try {
    const raw = localStorage.getItem(CHARACTERS_LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedCharacterMeta[];
  } catch {
    return [];
  }
}

export function loadSavedCharacter(id: string): SavedCharacter | null {
  try {
    const raw = localStorage.getItem(`dnd_char_${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as SavedCharacter;
  } catch {
    return null;
  }
}

export function saveCharacter(saved: SavedCharacter): boolean {
  try {
    localStorage.setItem(`dnd_char_${saved.id}`, JSON.stringify(saved));
    const list = listSavedCharacters();
    const meta: SavedCharacterMeta = {
      id: saved.id,
      name: saved.name,
      className: saved.className,
      speciesName: saved.speciesName,
      level: saved.level,
      portrait: saved.portrait,
      savedAt: saved.savedAt,
    };
    const idx = list.findIndex(c => c.id === saved.id);
    if (idx >= 0) list[idx] = meta;
    else list.push(meta);
    localStorage.setItem(CHARACTERS_LIST_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    console.warn('[persistence] Failed to save character — storage may be full:', err);
    return false;
  }
}

export function deleteCharacter(id: string): void {
  try {
    localStorage.removeItem(`dnd_char_${id}`);
    const list = listSavedCharacters().filter(c => c.id !== id);
    localStorage.setItem(CHARACTERS_LIST_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getActiveCharacterId(): string | null {
  return localStorage.getItem(ACTIVE_CHARACTER_KEY);
}

export function setActiveCharacterId(id: string | null): void {
  if (id) localStorage.setItem(ACTIVE_CHARACTER_KEY, id);
  else localStorage.removeItem(ACTIVE_CHARACTER_KEY);
}

export function makeEmptyPlayState(): CharacterPlayState {
  return { ...DEFAULT_PLAY_STATE };
}

// ── Arquivo de personagem (exportar / importar) ─────────────────────────────

const CHARACTER_FILE_FORMAT = 'ficha-rapida-personagem';

/** Baixa o personagem salvo como .json, para backup ou para abrir em outro navegador. */
export function downloadCharacterFile(saved: SavedCharacter): void {
  const payload = { format: CHARACTER_FILE_FORMAT, version: 1, character: saved };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (saved.name || 'personagem').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w-]+/g, '-').toLowerCase();
  a.href = url;
  a.download = `${safeName}-nivel-${saved.level}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Lê um arquivo exportado e devolve o personagem com id novo. Lança erro se o arquivo não for de ficha. */
export function parseCharacterFile(text: string): SavedCharacter {
  const data = JSON.parse(text);
  const character = data?.format === CHARACTER_FILE_FORMAT ? data.character : null;
  if (!character || typeof character !== 'object' || !character.creationSnapshot) {
    throw new Error('Este arquivo não é uma ficha exportada por este app.');
  }
  return { ...character, id: `char-${Date.now()}`, savedAt: Date.now() } as SavedCharacter;
}
