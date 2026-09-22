import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { Copy, Scissors, ClipboardPaste } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type MonacoEditor = {
  onDidFocusEditorText: (callback: () => void) => { dispose: () => void };
  onDidBlurEditorText: (callback: () => void) => { dispose: () => void };
  getSelection: () => unknown;
  getModel: () => { getValueInRange: (range: unknown) => string } | null;
  executeEdits: (source: string, edits: Array<{ range: unknown; text: string; forceMoveMarkers: boolean }>) => void;
  getPosition: () => { lineNumber: number; column: number } | null;
  setPosition: (position: { lineNumber: number; column: number }) => void;
  focus: () => void;
};

interface Props { editorRef: MutableRefObject<unknown>; }

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
  const isMobile = useIsMobile();
  const [focused, setFocused] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(0);

  const getEditor = useCallback(
    (): MonacoEditor | null => editorRef.current as MonacoEditor | null,
    [editorRef],
  );

  useEffect(() => {
    const editor = getEditor();
    if (!editor || !editor.onDidFocusEditorText) return;
    const d1 = editor.onDidFocusEditorText(() => setFocused(true));
    const d2 = editor.onDidBlurEditorText(() => setTimeout(() => setFocused(false), 100));
    return () => { d1.dispose(); d2.dispose(); };
  }, [getEditor]);

  useEffect(() => {
    if (!isMobile || typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;
   const update = () => {
      // Calculate exactly how much the native keyboard pushed up the viewport
      const offset = window.innerHeight - vv.height;
      // Ensure we only set an offset if the keyboard is actually visible
      setBottomOffset(offset > 40 ? offset : 0);
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    update();
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [isMobile]);

  const insert = (text: string, cursorBack?: number) => {
    const editor = getEditor();
    if (!editor) return;
    const sel = editor.getSelection();
    if (!sel) return;
    editor.executeEdits('shortcut', [{ range: sel, text, forceMoveMarkers: true }]);
    if (cursorBack) {
      const pos = editor.getPosition();
      if (pos) editor.setPosition({ lineNumber: pos.lineNumber, column: Math.max(1, pos.column - cursorBack) });
    }
    editor.focus();
  };

  const getSelectedText = (): string => {
    const editor = getEditor();
    if (!editor) return '';
    const sel = editor.getSelection();
    const model = editor.getModel();
    if (!sel || !model) return '';
    return model.getValueInRange(sel) || '';
  };

  const doCopy = async () => {
    const text = getSelectedText();
    if (!text) return;
    try { await navigator.clipboard.writeText(text); } catch {
      // Ignore clipboard write failures on unsupported browsers.
    }
    getEditor()?.focus();
  };
  const doCut = async () => {
    const text = getSelectedText();
    if (!text) return;
    try { await navigator.clipboard.writeText(text); } catch {
      // Ignore clipboard write failures on unsupported browsers.
    }
    insert('', 0);
  };
  const doPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) insert(text);
    } catch {
      // Ignore clipboard paste failures on unsupported browsers.
    }
  };

  const bar = (
    <div className="flex items-center gap-1 px-2 py-1.5 border-t border-border/40 bg-card/95 backdrop-blur-md overflow-x-auto flex-shrink-0">
      {isMobile && (
        <>
          <button onMouseDown={(e) => { e.preventDefault(); doCut(); }}
            onTouchStart={(e) => { e.preventDefault(); doCut(); }}
            className="flex-shrink-0 h-8 px-2 rounded-md bg-secondary/60 hover:bg-primary/20 border border-border/30 text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1">
            <Scissors className="w-3 h-3" /> Cut
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); doCopy(); }}
            onTouchStart={(e) => { e.preventDefault(); doCopy(); }}
            className="flex-shrink-0 h-8 px-2 rounded-md bg-secondary/60 hover:bg-primary/20 border border-border/30 text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1">
            <Copy className="w-3 h-3" /> Copy
          </button>
          <button onMouseDown={(e) => { e.preventDefault(); doPaste(); }}
            onTouchStart={(e) => { e.preventDefault(); doPaste(); }}
            className="flex-shrink-0 h-8 px-2 rounded-md bg-secondary/60 hover:bg-primary/20 border border-border/30 text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1">
            <ClipboardPaste className="w-3 h-3" /> Paste
          </button>
          <div className="w-px h-5 bg-border/40 mx-1 flex-shrink-0" />
        </>
      )}
      {SHORTCUTS.map(s => (
        <button key={s.label}
          onMouseDown={(e) => { e.preventDefault(); insert(s.insert, s.cursor); }}
          onTouchStart={(e) => { e.preventDefault(); insert(s.insert, s.cursor); }}
          className="flex-shrink-0 min-w-[36px] h-8 px-2 rounded-md bg-secondary/60 hover:bg-primary/20 border border-border/30 hover:border-primary/40 text-[11px] font-mono text-muted-foreground hover:text-primary transition-colors"
          title={`Insert ${s.label}`}
        >{s.label}</button>
      ))}
    </div>
  );

 if (isMobile && focused) {
    return (
      <div className="fixed left-0 right-0 z-50 shadow-2xl transition-all duration-75" style={{ bottom: `${bottomOffset}px` }}>
        {bar}
      </div>
    );
  }
  return bar;
}
