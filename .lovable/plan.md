# CodeSage Update Plan (8 items)

## 1. Python lesson completion + smart back-nav

- After submitting a Python lesson, skip the "Learn Path" detour: navigate straight to `/complete/:id` (already exists) with buttons for Review / Next Lesson / Back to Dashboard — same as Frontend/Networking.
- Fix back-nav from Python **learning path** → currently returns to Roadmap after a lesson; make it always return to Dashboard.
- Rule: entering a lesson via Dashboard tile → back button = Dashboard. Entering via Roadmap → back = Roadmap. This is controlled by the `?from=` query param that is already partially wired; audit `PythonLessonPage.tsx`, `PythonLearn.tsx`, and the `LessonComplete` "Next Lesson" handler for the Python track.

## 1.1 Python lesson page mobile fixes

- Terminal/preview panel currently overflows on mobile (384px viewport). Constrain `PythonWorkspace` panes with `min-w-0`, responsive heights, and horizontal scroll only inside the terminal.
- Remove the yellow/amber warning strip on the Python learning path page (leftover "practical lab" banner).

## 2. Local-Only smart back-nav

- Same fix as #1 for `LocalLessonPage.tsx` + `LocalLearn.tsx`. After finishing a lesson, back should go to Dashboard, not Roadmap.

## 3. Crash hardening

- Investigate the Python page crash — likely Skulpt re-init on route change or Monaco unmount race. Wrap `PythonWorkspace` in an ErrorBoundary, guard Skulpt `configure()` from double-calls, and dispose Monaco editors on unmount.
- Add a global ErrorBoundary in `App.tsx` so a single component crash shows a recoverable screen instead of a white page.

## 4. Enrollment persistence (backend)

- Currently mock counts + enrollments live in `localStorage` → reset on logout / new device.
- Migration: create two tables:
  - `track_stats(track text pk, enrolled_count int)` seeded with the current mock values (200, 140, 90, 75, 180, 60).
  - `enrollments(user_id uuid, track text, status text, student_id text, enrolled_at timestamptz)` with RLS scoped to `auth.uid()`.
- RPC `enroll_track(_track)` — inserts enrollment if new, atomically increments `track_stats.enrolled_count`, returns row. Idempotent (re-enrolling same track does not re-increment).
- Rewrite `src/lib/enrollment.ts` to call Supabase, keep the same public API so existing UI keeps working.
- Result: counts only grow, never reset; enrollment survives logout (4.2).

## 5. Student ID

- Generated server-side on first profile load. Add `student_id text unique` column on `profiles`, format `ID-CSA-0001` (zero-padded sequence via a Postgres sequence).
- Backfill existing profiles. Show on Profile / Settings page as a copyable badge.

## 6. Suggestion unread notifications

- Add `suggestion_reads(user_id uuid, last_seen_at timestamptz)` table.
- Compute unread = suggestions with `created_at > last_seen_at` (and, for a user's own suggestion, `reply_at > last_seen_at`).
- Show red dot + count on the Suggestions nav button. Mark read when the page mounts.
- Admin still replies via existing RPC — unchanged.

## 7. Inbox / Announcements (with admin composer)

- New `announcements` table: `id, title, body, created_by, created_at`. Public read for authenticated users.
- New `announcement_reads(user_id, announcement_id, read_at)` for per-user unread count.
- New RPC `post_announcement(_title, _body, _password)` — validates admin password from `app_secrets` (same pattern as suggestion admin RPCs).
- UI:
  - New Inbox pill button in the top header (Dashboard) next to XP/Streak/Theme, with unread-count badge.
  - `/inbox` page listing announcements newest-first, empty state when none.
  - Shield icon (top-right of inbox) opens password-gated composer modal for admin posts.

## 8. Python Expert track scaffold

- Add `Full Stack Python Expert_LESSONS` a brand new track module set to include `Advance To Expert` 
- Add exactly **one** template Expert lesson (e.g. `py-1` "Metaclasses & Descriptors") using the exact same lesson object shape (`philosophy`, `concepts[]`, `practical`, `quiz[]`, `module: 'Expert'`).
- Create new tracks files pythonexpert and create structure for lesson 1 and user will add the rest of lesson. 
- Add Python expert Learn page module grouping + Dashboard progress denominator dynamically (already reads array length).
- Bro not like this (I want you to read this) make a separate track with the name of python expert on the dashboard there make the structure and add ly py- 1 and I will add the rest of 39 lesson. So we will have 2 courses of python 1 is beginner to advance and the 2nd is full stack python expert

---

## Technical notes

**New migrations (single call):**

- `track_stats`, `enrollments`, `suggestion_reads`, `announcements`, `announcement_reads`, `profiles.student_id` column + sequence.
- GRANTs + RLS for each, per project convention (auth-only, no anon).
- RPCs: `enroll_track`, `mark_suggestions_read`, `mark_announcement_read`, `post_announcement`, `assign_student_id` (trigger on profile insert).

**Files touched (frontend):**

- `src/lib/enrollment.ts` — swap to Supabase.
- `src/pages/PythonLessonPage.tsx`, `PythonLearn.tsx`, `LocalLessonPage.tsx`, `LocalLearn.tsx` — routing + mobile CSS.
- `src/components/PythonWorkspace.tsx` — cleanup, ErrorBoundary wrapper, responsive layout.
- `src/App.tsx` — global ErrorBoundary + `/inbox` route.
- `src/pages/Dashboard.tsx` — Inbox button + unread badges (suggestions + inbox).
- `src/pages/Suggestions.tsx` — mark-read on mount.
- `src/pages/SettingsPage.tsx` — show Student ID.
- New `src/pages/Inbox.tsx` with admin composer modal.
- New `src/data/pythonexpertLessons.ts` — Expert module + 1 template lesson.
- New  src/pages/PythonexpertLessonPage.tsx, PythonExpertLearn.tsx, for the structure of new track

**Order of execution once approved:**

1. Migration (all schema at once, approved by user).
2. Frontend rewrites for enrollment + routing + mobile fixes + ErrorBoundary.
3. Inbox + notifications UI.
4. Python Expert scaffold + documentation comment.
5. Verify with build.