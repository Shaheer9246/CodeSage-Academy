import { Terminal, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface ConsolePanelProps {
  logs: { type: string; message: string }[];
  onClear: () => void;
}

const ConsolePanel = ({ logs, onClear }: ConsolePanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col bg-card border-t border-border transition-all ${isOpen ? 'h-full' : 'h-8'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-1.5 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors flex-shrink-0"
      >
        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
          <Terminal className="w-3.5 h-3.5" />
          Console
          {logs.length > 0 && (
            <span className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded">{logs.length}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
         {isOpen ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stops the bar from toggling back open
                setIsOpen(false);
              }}
              className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Close console"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      </button>
      {isOpen && (
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
      )}
    </div>
  );
};

export default ConsolePanel;
