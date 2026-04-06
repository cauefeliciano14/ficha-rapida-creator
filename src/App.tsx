import { lazy, Suspense } from 'react';
import { GlossaryTooltipProvider } from './components/GlossaryTooltip';
import { CharacterProvider } from './context/CharacterContext';
import { WizardProvider } from './context/WizardContext';
import { ChangeHistoryProvider } from './context/ChangeHistoryContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

const CreatorShell = lazy(() => import('./features/creator/CreatorShell').then(m => ({ default: m.CreatorShell })));

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <ChangeHistoryProvider>
          <CharacterProvider>
            <WizardProvider>
              <GlossaryTooltipProvider>
                <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando...</div>}>
                  <CreatorShell />
                </Suspense>
              </GlossaryTooltipProvider>
            </WizardProvider>
          </CharacterProvider>
        </ChangeHistoryProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
