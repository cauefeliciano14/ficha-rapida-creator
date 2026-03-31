import { lazy, Suspense } from 'react';
import { GlossaryTooltipProvider } from './components/GlossaryTooltip';
import { CharacterProvider } from './context/CharacterContext';
import { WizardProvider } from './context/WizardContext';
import { ChangeHistoryProvider } from './context/ChangeHistoryContext';
import { SoundProvider } from './context/SoundContext';
import { DiceProvider } from './context/DiceContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const CreatorShell = lazy(() => import('./features/creator/CreatorShell').then(m => ({ default: m.CreatorShell })));
const DiceTrayOverlay = lazy(() => import('./components/dice3d/DiceTrayOverlay').then(m => ({ default: m.DiceTrayOverlay })));

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <ChangeHistoryProvider>
          <CharacterProvider>
            <WizardProvider>
              <DiceProvider>
                <GlossaryTooltipProvider>
                  <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando...</div>}>
                    <CreatorShell />
                    <DiceTrayOverlay />
                  </Suspense>
                </GlossaryTooltipProvider>
              </DiceProvider>
            </WizardProvider>
          </CharacterProvider>
        </ChangeHistoryProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;
