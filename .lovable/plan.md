
## 1. Python Interactive Workspace (Skulpt)

**Scope:** Only affects the Python track (`PythonLessonPage.tsx`). HTML/CSS/JS tracks and the general Playground stay untouched.

### 1a. New component: `src/components/PythonWorkspace.tsx`

A self-contained 3-pane workbench used inside the "Practical" tab of the Python lesson page.

Layout (mobile-first, stacks vertically on small screens, splits on `md`):

```text
┌─────────────────────────────────────────┐
│  Tabs:  [ Assignment ] [ Terminal ]     │  <- mobile
├─────────────────────────────────────────┤
│  Monaco Python editor                   │
│  [ ▶ Run Code ] [ Reset ] [ Clear ]     │
├─────────────────────────────────────────┤
│  Active tab pane                        │
│   - Assignment: intro, steps, goal      │
│   - Terminal:   dark stdout console     │
└─────────────────────────────────────────┘
```

On desktop (`md+`): editor left, tabbed panel (Assignment / Terminal) right.

Props: `starterCode`, `practical` (intro/steps/goal), `onSolved?`.

### 1b. Skulpt integration

- Load Skulpt from CDN once on mount via a small `useSkulpt()` hook that injects two `<script>` tags:
  - `https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js`
  - `https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js`
- Track load state so Run is disabled until ready.
- `runPython(src)`:
  - `Sk.configure({ output: writeToTerminal, read: builtinRead, inputfun: promptInput, inputfunTakesPrompt: true })`
  - `Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, src, true))`
  - On error, print `err.toString()` and the line number in red.
- `stdout` handler appends chunks to a `lines` state array rendered in the terminal (monospace, `bg-zinc-950 text-emerald-300`).
- `input()` support:
  - `inputfun` returns a Promise. Terminal renders an inline `<input>` at the bottom while awaiting; pressing Enter resolves with the value and echoes it to the log.
- Clear Console empties `lines`; Reset restores `starterCode` in the editor.

### 1c. Editor

- Reuse existing `CodeEditor` (Monaco) with `language="python"`. If it doesn't accept a language prop, extend it minimally (frontend-only change).

### 1d. Wire into `PythonLessonPage`

- Import `PythonWorkspace` and render it inside the `section === 'practical'` block, above the existing "Take the Mastery Test" button.
- Pull `starterCode` from the lesson data if present; otherwise fall back to a friendly `# Write your code here\nprint("Hello, Python!")`. Add an optional `starterCode?: string` field to the Python lesson type (data-shape change only, existing lessons default to placeholder).

### 1e. Non-goals

- No change to Playground.tsx or LivePreview (HTML iframe preview stays intact).
- No backend calls — Skulpt runs 100% in-browser.

## 2. Roadmap mobile fix

Problem on ~360–540px widths: the zigzag layout uses `w-[78%]` per node with `justify-start`/`justify-end`, so long labels wrap awkwardly and the connector line looks off-center.

Change in `src/pages/Roadmap.tsx`:

- On mobile (`< sm`): switch to single-column, full-width nodes (drop the `isLeft` alternating flex and the empty `flex-1` spacers, use `w-full`). Keep the zigzag only from `sm:` and up.
- Move the vertical dashed connector to a centered absolute rail on mobile so it lines up under each node's icon.
- Reduce sticky header/track-selector horizontal padding on `< sm` to reclaim space; make the track pills `text-[11px] px-3 py-1.5`.
- Ensure the current-node ring (`ring-2`) doesn't clip by adding `mx-1`.

No changes to lesson data, routing, or the track selector logic.

## Technical notes

- Skulpt types: add a minimal `declare global { interface Window { Sk: any } }` in the workspace file; no npm dep needed.
- CSP: CDN scripts from jsdelivr are already used elsewhere for JSZip — safe.
- Files touched:
  - **new** `src/components/PythonWorkspace.tsx`
  - **edit** `src/pages/PythonLessonPage.tsx` (render workspace in practical tab)
  - **edit** `src/components/CodeEditor.tsx` (accept optional `language` prop, default `html`)
  - **edit** `src/data/pythonLessons.ts` (optional `starterCode` field on type)
  - **edit** `src/pages/Roadmap.tsx` (mobile layout tweaks only)
