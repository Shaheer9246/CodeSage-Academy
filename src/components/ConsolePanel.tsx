import { Terminal, Trash2 } from 'lucide-react';

interface ConsolePanelProps {
  logs: { type: string; message: string }[];
  onClear: () => void;
}

const ConsolePanel = ({ logs, onClear }: ConsolePanelProps) => {
  return (
    <div className="flex flex-col h-full bg-card border-t border-border">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
          <Terminal className="w-3.5 h-3.5" />
          Console
          <span className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded">{logs.length}</span>
        </div>
        <button onClick={onClear} className="text-muted-foreground hover:text-foreground transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-auto font-mono text-xs p-2 space-y-0.5">
        {logs.length === 0 && (
          <div className="text-muted-foreground italic">No console output yet...</div>
        )}
        {logs.map((log, i) => (
          <div
            key={i}
            className={`px-2 py-1 rounded ${
              log.type === 'error' ? 'bg-destructive/10 text-destructive' :
              log.type === 'warn' ? 'bg-warning/10 text-warning' :
              'text-accent'
            }`}
          >
            <span className="text-muted-foreground mr-2">{log.type === 'error' ? '✕' : log.type === 'warn' ? '⚠' : '›'}</span>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsolePanel;
