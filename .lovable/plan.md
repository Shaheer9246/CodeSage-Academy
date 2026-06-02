
## 1. Suggestions box → shared backend

Move suggestions from `localStorage` to Lovable Cloud so everyone sees the same feed.

**New table `public.suggestions`**
- `id uuid pk`, `user_id uuid` (auth.uid), `username text`, `text text` (≤500 chars), `reply text` (nullable), `reply_at timestamptz`, `created_at`, `updated_at`
- Trigger: auto-update `updated_at`
- Trigger: enforce one suggestion per user per UTC day on INSERT (raises if a row exists for `user_id` with `date_trunc('day', created_at) = current_date`)
- RLS:
  - SELECT: everyone authenticated (`true`)
  - INSERT: `auth.uid() = user_id`
  - UPDATE own row text: `auth.uid() = user_id` (cannot touch `reply`/`reply_at` — enforced by trigger that rejects updates to those columns unless caller is admin)
  - DELETE: own row only
- Admin reply RPC: `reply_suggestion(_id uuid, _reply text, _password text)` — SECURITY DEFINER, checks `_password = 'codesage-admin-2026'`, sets `reply` and `reply_at`. Password kept server-side; never sent on regular reads.
- GRANTs: SELECT/INSERT/UPDATE/DELETE to authenticated; ALL to service_role.

**Suggestions.tsx rework**
- Load list via realtime channel on `public.suggestions` (live updates).
- Submit button disabled if user already has a row today (query check). Error toast "You can only post one suggestion per day."
- Each row: if `row.user_id === auth.uid()` show inline edit (textarea + Save) → updates own row.
- Reply button visible to everyone; clicking opens a small password input (hidden by default). On submit calls `reply_suggestion` RPC. Wrong password → toast error. Correct → reply appears for all users.
- Remove the persistent "Admin mode" unlock and localStorage logic.

## 2. Computer & Networking landing page

Currently the dashboard tile jumps straight to `/n-lesson/net-1`. Replace with a learning-path page like Frontend's `/learn`.

- New route `/networking` → `NetworkingLearn.tsx`
  - Header: "Computer & Networking Fundamentals", progress bar (completed networking lessons / total).
  - List all 10 lessons from `NETWORKING_LESSONS`, with lock/check/play states using `isNetworkingLessonUnlocked`.
  - Clicking a lesson → `/n-lesson/:id` (already exists with concept/practical/quiz tabs).
- Dashboard: change Networking tile `onClick` to `navigate('/networking')`.

## 3. Mobile keyboard shortcut bar

`EditorShortcuts` exists but on mobile the device keyboard covers it.

- Wrap shortcut bar so on mobile (`md:` breakpoint) it uses `position: fixed; left:0; right:0; bottom:0; z-index:50` and uses `env(safe-area-inset-bottom)`.
- Only render the fixed version while the Monaco editor is focused (track focus via `onDidFocusEditorText` / `onDidBlurEditorText` in `CodeEditor`).
- Use `visualViewport` listener to set `bottom = window.innerHeight - visualViewport.height + visualViewport.offsetTop` so the bar sits exactly above the on-screen keyboard.
- Desktop unchanged (inline below editor).
- Applies automatically to LessonPage, NetworkingLessonPage, and Playground since they all use `<CodeEditor>`.

## 4. Freelance & Client — full module

Create `src/data/freelanceLessons.ts` mirroring `networkingLessons.ts` schema (concepts/practical/quiz/keyTakeaways) for the 8 freelance topics already listed (Find Niche, Portfolio, Branding, Platforms, Outreach, Pricing, Contracts, Management).

- New page `FreelanceLessonPage.tsx` — copy structure from `NetworkingLessonPage` (3 tabs lesson/practical/test).
- New landing `FreelanceLearn.tsx` like step 2 above.
- Routes: `/freelance` and `/f-lesson/:id`.
- Dashboard: unlock Freelance tile (remove `opacity-60` + Lock), wire to `/freelance`.
- Lesson IDs prefixed `free-1`…`free-8`; sequential unlock (free-1 always unlocked, others require previous completed).

## 5. Full Stack Frontend Dev — full module

Create `src/data/fullstackLessons.ts` for the 20 topics already listed. Each lesson:
- Standard concept + practical + quiz (same schema as networking) **plus** a `code` block `{ starterHtml, starterCss, starterJs, expected }` for hands-on lessons (HTML/CSS/JS/Flexbox/Grid/React/etc.).
- For non-code lessons (Architecture, Terminal, Git, GitHub, NPM, Deployment, Security, Testing) the code block is optional.

- New page `FullstackLessonPage.tsx` — same 3-tab structure but the **Practical** tab renders a Monaco editor + LivePreview side-by-side (mobile: Code / Preview tabs), reusing existing `CodeEditor` and `LivePreview` components.
- New landing `FullstackLearn.tsx`.
- Routes: `/fullstack` and `/fs-lesson/:id`.
- Dashboard: unlock Full Stack tile, replace the scrollable preview with a single navigate button to `/fullstack`.

## Technical notes

- All new lessons store completion via existing `completeLesson(id)` RPC (`award_lesson`) — no DB schema change needed for unlock tracking; just use unique IDs (`net-*`, `free-*`, `fs-*`).
- Quiz pass threshold reuses networking convention (≥3 of 5 correct, or ≥70% — match what networking uses).
- Realtime: enable on suggestions with `ALTER PUBLICATION supabase_realtime ADD TABLE public.suggestions;` inside the migration.
- Admin password check happens server-side in the RPC — never exposed to client code/network unless user explicitly types it.

## Files

**New**
- `src/data/freelanceLessons.ts`
- `src/data/fullstackLessons.ts`
- `src/pages/NetworkingLearn.tsx`
- `src/pages/FreelanceLearn.tsx`
- `src/pages/FreelanceLessonPage.tsx`
- `src/pages/FullstackLearn.tsx`
- `src/pages/FullstackLessonPage.tsx`
- Migration: suggestions table + RLS + RPC + realtime

**Edited**
- `src/pages/Suggestions.tsx` (rewrite to use cloud + realtime)
- `src/pages/Dashboard.tsx` (unlock 3 tiles, new routes)
- `src/components/CodeEditor.tsx` + `src/components/EditorShortcuts.tsx` (mobile floating keyboard bar)
- `src/App.tsx` (5 new routes)
