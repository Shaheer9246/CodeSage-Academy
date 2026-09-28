import { Component, ReactNode } from 'react';
import { RefreshCw, Home } from 'lucide-react';

interface Props { children: ReactNode }
interface State { error: Error | null; retried: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, retried: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info?.componentStack);

    // Clear any stale Service Worker caches that could have served mismatched chunks
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(keys => {
        keys.forEach(k => void caches.delete(k));
      }).catch(() => {});
    }

    // Auto-recover once if it was a transient context/chunk hydration issue
    if (!this.state.retried) {
      this.setState({ error: null, retried: true });
    }
  }

  reset = () => {
    this.setState({ error: null, retried: false });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 max-w-md text-center space-y-3 border border-destructive/30">
            <div className="text-4xl">🚧</div>
            <h1 className="font-display font-bold text-lg text-foreground">Something broke.</h1>
            <p className="text-xs text-muted-foreground break-words">
              {this.state.error.message || 'Unexpected error'}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={this.reset}
                className="flex items-center gap-1 bg-primary text-primary-foreground text-xs px-3 py-2 rounded-lg font-semibold hover:neon-glow"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload
              </button>
              <button
                onClick={() => {
                  this.setState({ error: null, retried: false });
                  window.location.href = '/dashboard';
                }}
                className="flex items-center gap-1 bg-secondary/60 text-foreground text-xs px-3 py-2 rounded-lg"
              >
                <Home className="w-3.5 h-3.5" /> Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
