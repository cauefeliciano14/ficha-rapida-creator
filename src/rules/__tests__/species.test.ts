import { describe, it, expect } from 'vitest';
import { getSpeciesLevelOneEffects } from '../data/speciesRules';

describe('Espécies — efeitos por nível (Livro do Jogador 2024)', () => {
  it('Alto Elfo ganha Detectar Magia no 3 e Passo Nebuloso no 5', () => {
    expect(getSpeciesLevelOneEffects('elfo', { elfo: 'alto-elfo' }, 1).preparedSpells).toEqual([]);
    expect(getSpeciesLevelOneEffects('elfo', { elfo: 'alto-elfo' }, 3).preparedSpells).toEqual(['Detectar Magia']);
    expect(getSpeciesLevelOneEffects('elfo', { elfo: 'alto-elfo' }, 5).preparedSpells).toEqual(['Detectar Magia', 'Passo Nebuloso']);
  });

  it('Tiferino Abissal ganha Raio Nauseante no 3', () => {
    expect(getSpeciesLevelOneEffects('tiferino', { tiferino: 'abissal' }, 3).preparedSpells).toContain('Raio Nauseante');
  });

  it('Sentidos Aguçados do Elfo não vira sentido especial', () => {
    const senses = getSpeciesLevelOneEffects('elfo', { elfo: 'elfo-silvestre' }).specialSenses ?? [];
    expect(senses.some(s => /Sentidos Aguçados/.test(s))).toBe(false);
  });

  it('Ataque de Sopro escala com o nível', () => {
    const at = (lvl: number) => (getSpeciesLevelOneEffects('draconato', {}, lvl).notes ?? []).join(' ');
    expect(at(1)).toContain('1d10');
    expect(at(5)).toContain('2d10');
    expect(at(17)).toContain('4d10');
  });
});
