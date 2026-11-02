import { describe, it, expect } from 'vitest';
import { buildSummaryCopyText } from './summaryCopy';

describe('buildSummaryCopyText', () => {
  it('monta o resumo com Classe, Espécie, Origem e Atributos, nessa ordem', () => {
    const text = buildSummaryCopyText(
      'Bárbaro',
      'Humano',
      'Soldado',
      { forca: 15, destreza: 10, constituicao: 14, inteligencia: 8, sabedoria: 13, carisma: 12 },
    );
    const lines = text.split('\n');
    expect(lines[0]).toBe('Classe: Bárbaro');
    expect(lines[1]).toBe('Raça: Humano');
    expect(lines[2]).toBe('Antecedente: Soldado');
    expect(lines[3]).toBe('Atributos: FOR 15 · DES 10 · CON 14 · INT 8 · SAB 13 · CAR 12');
  });

  it('usa "Não definida" para campos vazios e inclui todos os 6 atributos', () => {
    const text = buildSummaryCopyText(undefined, undefined, undefined, {});
    const lines = text.split('\n');
    expect(lines[0]).toBe('Classe: Não definida');
    expect(lines[1]).toBe('Raça: Não definida');
    expect(lines[2]).toBe('Antecedente: Não definida');
    expect(lines[3]).toBe('Atributos: FOR 0 · DES 0 · CON 0 · INT 0 · SAB 0 · CAR 0');
  });
});
