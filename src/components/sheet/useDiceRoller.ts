import { useState, useCallback } from 'react';

export interface DiceRollResult {
  id: string;
  label: string;
  type: string;
  result: number;
  timestamp: number;
}

export function useDiceRoller() {
  const [rolls, setRolls] = useState<DiceRollResult[]>([]);

  const roll = useCallback((label: string, type: string, modifier: number) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + modifier;
    const result: DiceRollResult = {
      id: `roll-${Date.now()}-${Math.random()}`,
      label,
      type,
      result: total,
      timestamp: Date.now(),
    };
    setRolls(prev => [result, ...prev].slice(0, 5));
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setRolls(prev => prev.filter(r => r.id !== result.id));
    }, 5000);
    return result;
  }, []);

  const dismiss = useCallback((id: string) => {
    setRolls(prev => prev.filter(r => r.id !== id));
  }, []);

  return { rolls, roll, dismiss };
}
