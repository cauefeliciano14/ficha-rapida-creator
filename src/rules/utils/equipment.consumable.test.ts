import { describe, expect, it } from 'vitest';
import { isConsumable } from './equipment';

describe('Itens com botão Usar', () => {
  it.each(['Poção de Cura', '20 Flechas', 'Virotes', 'Rações (1 dia)', 'Óleo', 'Frasco de Ácido', 'Tocha', 'Fogo de Alquimista'])(
    '%s é consumível', name => expect(isConsumable(name)).toBe(true),
  );
  it.each(['Machadinha', 'Kit de Aventureiro', 'Besta Leve', 'Adaga', 'Escudo'])(
    '%s não é consumível', name => expect(isConsumable(name)).toBe(false),
  );
});
