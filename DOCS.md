# CodeSage Academy — Maintenance Handbook

Everything about how the app is built, where data lives, and exactly what to touch when you add or change content.

---

## 1. Big picture

- **Frontend only**: React 18 + Vite + TypeScript + Tailwind. All course content is *static TypeScript files in the bundle* — no lesson text is stored in the database.
- **Backend (Lovable Cloud / Postgres)** stores only *user state*: profile, XP, streak, completed lessons/tests, enrollments, suggestions + votes, announcements, student IDs, promo codes.
- **Local storage** holds device-level preferences and caches (see §6).

---

## 2. Adding a NEW TRACK — the 10-step checklist

Use C++ as the reference implementation. Suppose your new track is `rust`.

| # | File | What to add |
|---|------|-------------|
| 1 | `src/data/rustLessons.ts` | `RUST_LESSONS` array + `getRustLessonById()` + `isRustLessonUnlocked()`. Lesson ids must share a unique prefix, e.g. `rust-01`. |
| 2 | `src/pages/RustLearn.tsx` | Track home page (lesson list + progress bar). Copy `CppLearn.tsx`. |
| 3 | `src/pages/RustLessonPage.tsx` | Lesson viewer (concept / practical / quiz). Copy `CppLessonPage.tsx`. |
| 4 | `src/App.tsx` | Two routes: `/rust` and `/rust-lesson/:id`, both wrapped in `<ProtectedRoute>`. |
| 5 | `src/data/lessonIndex.ts` | Add `'rust'` to `LessonTrackKey`, `TRACK_LESSON_IDS`, `TRACK_LESSON_LABELS`. This one file drives Settings progress, Roadmap totals and the registry list. |
| 6 | `src/lib/enrollment.ts` | Add `'rust'` to `TrackId`, `VALID_TRACK_IDS`, and a `TRACK_META.rust` entry (`label`, `short`, `route`, `idPrefix`, `seed`, optional `prereq`). |
| 7 | **Database** | Add `'rust'` to the allowed list inside `enroll_track()` **and** insert every `rust-*` id into `lesson_registry`. Without the registry rows, `award_lesson` raises "Unknown lesson id" and progress silently fails. |
| 8 | `src/pages/Dashboard.tsx` | Add a `SECTIONS` entry or a track object inside an existing section, plus `ROUTE_TO_TRACK['/rust']`, a `TOUR_STEPS` entry, and (optional) `GUEST_ALLOWED` + `GUEST_FIRST_LESSON` for guest previews. |
| 9 | `src/pages/Roadmap.tsx` | Import the lessons, add the route prefix to the `routePrefix` union, add a `buildTrack(...)` entry, and add `{ key: 'rust', label: 'Rust' }` to `TRACKS`. |
| 10 | `src/pages/LessonComplete.tsx` | Add a `TRACKS` row (`prefix: 'rust-'`, `path: '/rust-lesson'`) and `TRACK_HOME['rust-'] = '/rust'`, so the celebration card, "next lesson" and "lesson path" buttons work. |

Optional: `src/components/EnrollDialog.tsx` — only needed if the track has prerequisites (add a `PREREQ_COPY` entry).

**Rule of thumb:** if a lesson completes but progress disappears after refresh, you forgot step 7.

---

## 3. Adding / editing LESSONS

- Lesson shape (all non-frontend tracks) = `NetworkingLesson`: `id, module, order, title, icon, philosophy, concepts[{title, beginner, advanced}], practical{title, intro, steps[], goal}, quiz[{question, options[], correctIndex, explanation}], keyTakeaways[]`.
- Quizzes need at least 4 questions; the pass rule in the lesson pages is **3 correct**.
- Unlocking is sequential: `isXLessonUnlocked` checks that the *previous* lesson id is in `completedLessons`.
- **Every new lesson id must be inserted into `lesson_registry`** (a one-line migration). This is the server-side allowlist that prevents XP farming.
- Frontend track lessons live in `src/data/lessons.ts` and are grouped by level (basics / intermediate / expert).

## 4. Adding / editing CHALLENGES

- File: `src/data/challengesData.ts`. Each challenge has a tier (`easy | medium | hard | complex`), title, prompt, starter code and validation.
- Page: `src/pages/Challenges.tsx` groups by tier automatically — adding an entry with a valid tier is enough, no other file to touch.

## 5. Adding / editing EXAMS

- Files: `src/data/exams/*.ts` (one file per subject: frontend, python, java, sql, ai, fundamentals).
- `src/pages/QuestionsPage.tsx` (the Testing Center) reads those files: Daily Challenge picks a random subset, Full Exam Simulator runs the timed set with elimination tools and analytics.
- To add a new subject: create `src/data/exams/<subject>.ts` exporting a question array, then register it in the exam list inside `QuestionsPage.tsx`.

---

## 6. Where state lives

### Database (per user, survives devices)

| Table | Holds |
|---|---|
| `profiles` | name, username, avatar fields, XP, level, sage coins, streak, `completed_lessons[]`, `completed_tests[]`, `unlocked_sections[]`, `promo_codes[]`, `student_id`, `has_seen_tour`, `streak_freeze_until` |
| `enrollments` | one row per user+track with status `active / paused / ended` |
| `track_stats` | public enrolled counters shown on the dashboard tiles |
| `lesson_registry`, `test_registry` | server-side allowlists of valid ids |
| `suggestions`, `suggestion_votes`, `suggestion_reads` | community board + real-time up/down votes |
| `announcements`, `announcement_reads` | admin inbox messages |
| `promo_codes`, `app_secrets` | unlock codes and the admin password (never readable from the client) |

### Local storage (per device, disposable)

`codesage_guest_lesson_taken` (guest one-lesson gate) · `codesage:enroll_cache:v2` and `codesage:count_cache:v2` (enrollment/count cache for instant reads) · login lockout counters (`loginGuard.ts`) · theme, editor font size, auto-run · `dash.sections.collapsed.v1` (dashboard folds) · `codesage_dashboard_category` · playground drafts.

Clearing local storage never loses real progress — it only resets preferences and caches.

---

## 7. How the backend enforces progress

All writes that grant rewards go through `SECURITY DEFINER` functions, not direct table updates:

- `award_lesson(_lesson_id)` — validates the id against `lesson_registry`, refuses duplicates, adds **+5 XP / +2 coins**, recomputes level (`xp / 200 + 1`) and badge thresholds.
- `complete_test(_test_id)` — same idea against `test_registry`.
- `enroll_track(_track)` — validates the track name, upserts the enrollment, bumps `track_stats`.
- `update_enrollment_status(_track, _status)` — pause / end, keeps counters consistent.
- `update_streak()` — daily streak with freeze support; `buy_freeze_streak()` costs 10 XP.
- `redeem_promo(_code)` — unlocks sections.
- Admin RPCs (`post_announcement`, `reply_suggestion`, `admin_edit_suggestion`, `admin_delete_suggestion`) require the admin password stored in `app_secrets`.

Anonymous users cannot execute any of these; every table has RLS and explicit grants.

---

## 8. The runtimes (which terminal does what)

| Track | Engine | Notes |
|---|---|---|
| Frontend / Full Stack / Local / 3D | `LivePreview.tsx` — sandboxed iframe running real HTML/CSS/JS | Debounced hot-swap so typing doesn't flash. Three.js loads from CDN inside the iframe. |
| Python / Python Expert | **Skulpt**, lazy-loaded on first run | Supports `input()`, prints to the in-page terminal. No pip packages, no file system. |
| SQL | `SqlWorkspace.tsx` — in-browser SQL engine | Queries run against a seeded demo dataset. |
| Java | `JavaWorkspace.tsx` | Pattern/keyword validation of the exercise, not a real JVM. |
| C++ | `CppWorkspace.tsx` | Same approach: guided validation; lesson 1 teaches installing a real g++/clang locally. |
| Playground | Monaco editor + LivePreview | Single-file or multi-folder mode, ZIP import/export, mobile cut/copy/paste, dockable console. |

---

## 9. Common edits — quick answers

- **Change lesson count shown on a dashboard tile** → `SECTIONS` in `Dashboard.tsx` (`lessons:` field).
- **Change XP per lesson** → the `award_lesson` function (server), then the copy in the lesson pages.
- **Change the admin password** → update the `admin_password` row in `app_secrets`.
- **Change enrollment limits / prerequisites** → `src/lib/enrollment.ts` (`TRACK_META.prereq`, active-track limit) and `EnrollDialog.tsx` copy.
- **Reset a user's progress** → clear their `completed_lessons` array in `profiles`.
