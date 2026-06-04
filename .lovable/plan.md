# Implementation Plan — 9 Items

## 1. Suggestions: wire admin edit/delete UI
In `Suggestions.tsx`, every card gets two new admin buttons next to "Reply": **Edit (admin)** and **Delete (admin)**. Clicking opens an inline password + text field that calls `admin_edit_suggestion` / `admin_delete_suggestion` RPCs already deployed. Success toast + realtime refresh handles the rest.

## 2. Challenges: 4 tiers + ~24 new
Rewrite `Challenges.tsx`:
- Add tier `'Complex'` to the `difficulty` union.
- Top tab bar: **Easy · Medium · Hard · Complex** (filter state).
- Append ~24 new challenges (6 per tier). Complex tier = mini-projects (calculator, weather widget mock, kanban, mini-blog, quiz app, image-carousel).
- Show difficulty count per tab and a tier color (green / yellow / orange / purple).

## 3. Playground upgrades
In `Playground.tsx`:
- **ZIP upload**: new "Upload ZIP" button → uses already-installed `jszip` to read `.html/.css/.js` files into the workspace.
- **Single/Multi toggle** at top: Single mode hides Files panel and uses one combined `.html` doc; Multi keeps current 3-file workflow.
- **4th-file preview**: if a 4th custom `.html` file exists, add a "Preview this file" eye icon on its file row that swaps the preview source.
- **Mobile cut/copy/paste bar**: add three buttons in `EditorShortcuts` mobile bar that call `document.execCommand` on the active Monaco selection.
- **Console dock-back**: when console is detached/floating, add a small ◰ "Dock" button to re-anchor it to the bottom panel.

## 4. Auth → /tour for brand-new users
In `UserContext.fetchProfile`, after fetching/creating a profile check `has_seen_tour === false`. If false and we just signed up (no `name` yet), navigate to `/tour` once. `Tour.tsx` already calls an RPC stub to flip `has_seen_tour` on Finish/Skip — wire it through a `profiles.update({ has_seen_tour: true })` (allowed by the new column-level GRANT).

## 5. Trip = real Dashboard in guest mode + Welcome glow + 2 new tiles
- Replace `/trip` to redirect to `/dashboard?guest=1`.
- New `GuestContext` provider wraps the app; `Dashboard.tsx` reads the query param, renders normally with a banner "Guest mode — sign up to save progress". Clicking any tile other than Lesson 1 of Frontend → toast + redirect to `/auth`.
- `Welcome.tsx`: add two more feature rows (**Python**, **Local-only coding**) so all 6 tracks show.
- **Glow on hover**: every Welcome button + every Dashboard tile gets `hover:neon-glow hover:border-primary/60 transition-all` so an arrow/hover triggers a glow halo.

## 6. Smart-back for Freelance & Fullstack learn pages
Mirror what Networking already does:
- Read `?from` query param.
- Back button → `/roadmap` when `from=roadmap`, else `/dashboard`.
- Dashboard tiles for Freelance/Fullstack pass no `from` (default dashboard). Roadmap tiles pass `?from=roadmap`.

## 7. Post-lesson → Dashboard (no Urrhhh page)
For **Python**, **Local**, **Freelance**, **Fullstack** lesson pages: on submit-success, skip the `/lesson-complete/:id` redirect — show a small inline "Lesson complete ✓ +XP" toast and `navigate('/dashboard')`.

For **Networking** and **Frontend Dev** lesson pages: keep `LessonComplete.tsx` but replace the current "Roadmap · Review" pair with **3 buttons**: `Lesson Path` (→ `/learn` or `/networking`), `Review` (→ same lesson), `Next Lesson` (existing, moved into the row). Removes the standalone giant Next button on top.

## 8. Settings power tools
Below the theme buttons in `SettingsPage.tsx`, add 3 grouped sections:

**Execution Control** (glass-card)
- Toggle: *Auto-Run Preview* (writes `codesage_autorun` to localStorage; Playground/Lesson previews read it).
- Button: *Reset Runtime* (clears preview iframe + workspace caches, not XP).

**Data & Workspace**
- Button: *Export All Workspaces (.zip)* — uses `jszip` to zip Playground recents + current files.
- Button: *Clear Sandbox Cache* — wipes `codesage_playground_recent` + autosave only.

**Onboarding**
- Button: *Replay Tour* → flip `has_seen_tour` to false and `navigate('/tour')`.

## 9. XP rebalance + Freeze Streak + Dashboard XP bar
Server changes (migration):
- `award_lesson`: change `_profile.xp + 50` → `+ 5`, `sage_coins + 10` → `+ 2`. Level formula stays.
- New RPC `buy_freeze_streak()`: deducts 10 XP, sets a new profile column `streak_freeze_until date` to tomorrow. Validates `xp >= 10`.
- New column `profiles.streak_freeze_until date`.
- `update_streak` respects `streak_freeze_until` — if yesterday was a freeze day, treat as continuous.

UI:
- `Dashboard.tsx` top header (right of welcome): two pills — `⚡ {xp} XP` and `🔥 {streakCount}d`. Tapping XP pill opens a tiny "Shop" sheet with one item: **Freeze Streak — 10 XP** button → calls `buy_freeze_streak` RPC.
- `UserContext` exposes `buyFreezeStreak()` wrapper.

---

## Technical notes
- New migration: lower XP rewards, `streak_freeze_until` column, `buy_freeze_streak` RPC, GRANT EXECUTE to authenticated.
- Files created: `src/contexts/GuestContext.tsx`, `src/components/FreezeStreakSheet.tsx`.
- Files edited: `Suggestions.tsx`, `Challenges.tsx`, `Playground.tsx`, `EditorShortcuts.tsx`, `Auth.tsx`, `UserContext.tsx`, `Welcome.tsx`, `Trip.tsx`, `Dashboard.tsx`, `FreelanceLearn.tsx`, `FullstackLearn.tsx`, `FreelanceLessonPage.tsx`, `FullstackLessonPage.tsx`, `PythonLessonPage.tsx`, `LocalLessonPage.tsx`, `LessonComplete.tsx`, `SettingsPage.tsx`, `App.tsx`.
- No new dependencies (jszip already installed).
- No changes to existing lesson data files.
