import { MutableRefObject } from 'react';

interface Props {
  editorRef: MutableRefObject<any>;
}

const SHORTCUTS: { label: string; insert: string; cursor?: number }[] = [
  { label: '<>',  insert: '<>',  cursor: 1 },
  { label: '</>', insert: '</>' },
  { label: '{}',  insert: '{}',  cursor: 1 },
  { label: '()',  insert: '()',  cursor: 1 },
  { label: '[]',  insert: '[]',  cursor: 1 },
  { label: '""',  insert: '""',  cursor: 1 },
  { label: "''",  insert: "''",  cursor: 1 },
  { label: '=',   insert: '=' },
  { label: '=>',  insert: '=> ' },
  { label: ';',   insert: ';' },
  { label: ':',   insert: ':' },
  { label: '?',   insert: '?' },
  { label: '!',   insert: '!' },
  { label: '&&',  insert: '&&' },
  { label: '||',  insert: '||' },
  { label: '/*', insert: '/*  */', cursor: 3 },
  { label: 'Tab', insert: '  ' },
];

export default function EditorShortcuts({ editorRef }: Props) {
  const insert = (text: string, cursorBack?: number) => {
    const editor = editorRef.current;
    if (!editor) return;
    const sel = editor.getSelection();
    if (!sel) return;
    editor.executeEdits('shortcut', [{ range: sel, text, forceMoveMarkers: true }]);
    if (cursorBack) {
      const pos = editor.getPosition();
      if (pos) {
        editor.setPosition({ lineNumber: pos.lineNumber, column: Math.max(1, pos.column - cursorBack) });
      }
    }
    editor.focus();
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-t border-border/40 bg-card/60 backdrop-blur-md overflow-x-auto flex-shrink-0">
      {SHORTCUTS.map(s => (
        <button
          key={s.label}
          onMouseDown={(e) => { e.preventDefault(); insert(s.insert, s.cursor); }}
          className="flex-shrink-0 min-w-[36px] h-7 px-2 rounded-md bg-secondary/60 hover:bg-primary/20 border border-border/30 hover:border-primary/40 text-[11px] font-mono text-muted-foreground hover:text-primary transition-colors"
          title={`Insert ${s.label}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
