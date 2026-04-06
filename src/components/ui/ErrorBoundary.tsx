import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--text-dim, #94a3b8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <h2 style={{ color: 'var(--color-error, #ef4444)', margin: 0 }}>Algo deu errado</h2>
          <p style={{ margin: 0, maxWidth: '400px' }}>
            Ocorreu um erro inesperado. Tente recarregar a página ou clique abaixo para tentar novamente.
          </p>
          {this.state.error && (
            <pre style={{
              fontSize: '0.75rem',
              background: 'rgba(0,0,0,0.3)',
              padding: '12px',
              borderRadius: '8px',
              maxWidth: '500px',
              overflow: 'auto',
              textAlign: 'left',
            }}>
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid var(--border-input, #334155)',
              background: 'var(--surface-ghost, #1e293b)',
              color: 'var(--text-bright, #f1f5f9)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
