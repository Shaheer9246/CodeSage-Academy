# Major Update — 8 Areas

A big batch, but each piece is contained. Done in one pass.

## 1. Expand Existing Tracks (Full Stack Frontend + Freelance)

**Full Stack Frontend Dev** — current 20 lessons cover the basics. Add 8 more to make it truly export-ready:
- `fs-21` TypeScript fundamentals
- `fs-22` React Router & navigation patterns
- `fs-23` State management (Zustand/Context patterns)
- `fs-24` Forms & validation (react-hook-form + zod)
- `fs-25` Accessibility (a11y, ARIA, keyboard nav)
- `fs-26` Performance (lazy loading, memoization, bundle size)
- `fs-27` Animations (CSS transitions, Framer Motion basics)
- `fs-28` Real-world project: build a full SPA

**Freelance & Clients** — current 8 are good but shallow. Add 4 more:
- `free-9` Discovery calls & scoping
- `free-10` Invoicing, taxes, payments
- `free-11` Handling difficult clients & scope creep
- `free-12` Scaling: from freelancer to agency

All new lessons use the same `concepts/practical/quiz/keyTakeaways` schema with depth (beginner + advanced for every concept).

## 2. Challenges — 4 Difficulty Tiers

Restructure `Challenges.tsx`:
- Add `'Complex'` to the difficulty type
- Group UI into 4 tabs: **Easy · Medium · Hard · Complex**
- Add ~6 new challenges per tier so each has 5–8 entries
- Complex tier = multi-feature mini-projects (e.g. "Build a Kanban board", "Real-time clock + theme switcher", "Image carousel with keyboard nav")

## 3. Playground Improvements

a. **4th file preview** — when active file is a standalone `.html`, render its own content in the preview instead of the default html+css+js combo. Detect: if `activeFile.lang === 'html'` and id is not `'html'`, use that file's content directly.

b. **Mobile text selection** — wrap mobile preview/code areas with `user-select: text` + `-webkit-user-callout: default` so iOS/Android show cut/copy/paste menu. Add a long-press helper hint.

c. **ZIP upload** — add JSZip-based handler. On `.zip` upload, replace `DEFAULT_FILES` with the extracted file tree (any folder count). Preview uses the uploaded `index.html` as entry.

d. **Top selector** — add a segmented control: **Single file** | **Multi-file project** at the top of the header. Single = one editable HTML file with auto-preview. Multi = current behavior.

e. **Console dock button** — when console panel is detached/floating, add a "Dock to bottom" button (↓ icon) to return it inline.

## 4. New-User Round Trip

After first successful signup → before Onboarding, show `Tour.tsx` (modal carousel):
- 7 slides explaining: Dashboard, Tracks, Lessons, Playground, Challenges, Community, Suggestions
- Buttons: **Skip** / **Next** / **Finish**
- Mark `profile.has_seen_tour = true` (new column) so it never replays

Migration: add `has_seen_tour boolean default false` to `profiles`.

## 5. Guest Mode for `/trip`

Currently `/trip` is a static tour. Change behavior:
- "Take a Trip" → navigates to `/dashboard?guest=1`
- Dashboard detects `guest=1` (no auth) and renders normally
- Guest can click **Frontend Development** → see lesson list → open **lesson 1 only**
- After completing lesson 1, modal: "Sign up to keep going" → `/auth`
- Other tiles (Roadmap, Questions, Community, Profile, other tracks past lesson 1) → click shows toast "Log in to access" + redirect to `/auth`

Implement via a `GuestContext` wrapper that fakes a minimal user object and gates routes.

## 6. Admin Powers on Suggestions

Extend `reply_suggestion` RPC pattern with two new RPCs:
- `admin_edit_suggestion(_id, _text, _password)` — edits any user's message text
- `admin_delete_suggestion(_id, _password)` — deletes any message

Both check the same password (`codesage-admin-2026`), SECURITY DEFINER.

UI: when admin password is entered in the reply dialog, also show Edit/Delete buttons on every suggestion card.

## 7. Smarter Back Navigation

In `NetworkingLearn.tsx`, `FreelanceLearn.tsx`, `FullstackLearn.tsx`:
- Read `?from=dashboard` query param when navigated from Dashboard
- Back button → if entered via Dashboard, go to `/roadmap` instead of `/dashboard`
- Update Dashboard tile links to include `?from=dashboard`

## 8. Two New Tracks: Python + Local-Only Coding

**Python track** (`src/data/pythonLessons.ts`, `PythonLearn.tsx`, `PythonLessonPage.tsx`, routes `/python`, `/py-lesson/:id`):
- 20 lessons: syntax → variables → control flow → functions → data structures → OOP → modules → file I/O → error handling → list comprehensions → decorators → generators → virtual envs → pip → requests → JSON/CSV → web scraping → automation scripts → testing → mini-project
- Uses lesson page same layout as Networking (concepts / practical / quiz tabs — no live editor since no Python runtime)

**Local-Only Coding** (`localLessons.ts`, `LocalLearn.tsx`, `LocalLessonPage.tsx`, routes `/local`, `/local-lesson/:id`):
- 15 lessons focused on no-server / no-deploy coding: HTML+CSS+JS files on disk, localStorage, IndexedDB, File API, service workers (offline), PWA basics, building a local journal, local task manager, local note-taking app, etc.
- Uses Fullstack-style page (live editor + preview) since everything runs in browser

Add both tiles to Dashboard with the same pattern as existing track tiles.

## Technical Section

**New files:**
- `src/data/pythonLessons.ts`, `src/data/localLessons.ts`
- `src/pages/PythonLearn.tsx`, `src/pages/PythonLessonPage.tsx`
- `src/pages/LocalLearn.tsx`, `src/pages/LocalLessonPage.tsx`
- `src/pages/Tour.tsx` (new-user round trip)
- `src/contexts/GuestContext.tsx`

**Edited:**
- `src/data/fullstackLessons.ts` (+8 lessons)
- `src/data/freelanceLessons.ts` (+4 lessons)
- `src/pages/Challenges.tsx` (4 tiers + new challenges)
- `src/pages/Playground.tsx` (zip, single/multi toggle, 4th-file preview, mobile select, console dock)
- `src/pages/Suggestions.tsx` (admin edit/delete UI)
- `src/pages/Dashboard.tsx` (2 new tiles, `?from=dashboard` links, guest mode)
- `src/pages/NetworkingLearn.tsx`, `FreelanceLearn.tsx`, `FullstackLearn.tsx` (smart back)
- `src/pages/Trip.tsx` → wire "Take a Trip" to `/dashboard?guest=1`
- `src/pages/Auth.tsx` (route new signups to Tour first)
- `src/App.tsx` (new routes + GuestProvider)

**Migrations:**
- `ALTER TABLE profiles ADD COLUMN has_seen_tour boolean DEFAULT false`
- Two new RPCs: `admin_edit_suggestion`, `admin_delete_suggestion`

**Dependencies:** add `jszip` for ZIP upload.

After approval I'll batch-create the files and run the migration.
