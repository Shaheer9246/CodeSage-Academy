# C++ track wiring, full app handbook, dashboard restructure, cost & course roadmap

## 1. Wire the C++ track everywhere

The C++ content and pages already exist (`src/data/cppLesson.ts` with 30 lessons + helpers, `src/pages/CppLearn.tsx`, `src/pages/CppLessonPage.tsx`, `src/components/CppWorkspace.tsx`), but the track is not connected to the app. Both C++ pages import `@/data/cppLessons` while the file is named `cppLesson.ts` — that import fails today.

Changes:

- Rename the data file to `src/data/cppLessons.ts` so existing imports resolve.
- `src/App.tsx`: add routes `/cpp` (CppLearn) and `/cpp-lesson/:id` (CppLessonPage), both inside ProtectedRoute.
- `src/data/lessonIndex.ts`: add `cpp` to `LessonTrackKey`, `TRACK_LESSON_IDS`, `TRACK_LESSON_LABELS` so Settings progress and Roadmap totals count it.
- `src/lib/enrollment.ts`: add `'cpp'` to `TrackId`, `VALID_TRACK_IDS`, and `TRACK_META` (label "C++ Programming", short "C++", route `/cpp`, idPrefix `CS-CPP`, seed count, no prerequisite).
- Database: extend the `enroll_track` function's allowed-track list with `cpp`, and insert the 30 `cpp-*` ids into `lesson_registry` (required or lesson completion is rejected server-side).
- `src/pages/Dashboard.tsx`: add the C++ tile (category, emoji, lesson count, guest-preview lesson mapping, tour entry, trackId).
- `src/pages/Roadmap.tsx`: add the C++ track column built from `CPP_LESSONS` with route prefix `cpp-lesson`.
- `src/pages/LessonComplete.tsx`: register the `cpp-` prefix → `/cpp-lesson` and back-route `/cpp`, so finishing a C++ lesson shows the standard completion card.
- `src/components/EnrollDialog.tsx`: include C++ in the selectable tracks list.
- Confirm the C++ lesson page awards XP through the same `award_lesson` path as Java, and that exit-back goes to Roadmap or Dashboard depending on the `?from=` param.

## 2. Written handbook (`DOCS.md` in the repo, plus a summary in chat)

A single maintenance guide covering:

- **Add a new track** — the exact 10-step checklist above, in order, with the file and the reason for each.
- **Add / edit lessons** — lesson object shape, unlock rule, why every new lesson id must also be added to `lesson_registry`.
- **Add / edit challenges** — where the 4 tiers live and how to add entries.
- **Add / edit exams** — the `src/data/exams/*` files and how the Testing Center picks them up.
- **Where state lives** — what is in the database (profiles, XP, completed lessons/tests, enrollments, suggestions + votes, announcements, student IDs, promo codes, admin password) versus localStorage (guest gate, enrollment cache, login lockout, theme/editor prefs, tour seen fallback).
- **How each runtime works** — HTML/CSS/JS live preview, Python (Skulpt), SQL, Java and C++ workspaces, and their limits.
- **How the backend enforces progress** — the security-definer functions (`award_lesson`, `complete_test`, `enroll_track`, `update_streak`, admin RPCs) and why lesson ids are validated.

## 3. Dashboard restructure (proposal implemented after your OK)

Current dashboard shows every track as a flat wall of tiles. Proposed structure:

```text
[ Continue where you left off ]   <- single wide card, active enrollment + next lesson
[ Your tracks ]                   <- only enrolled tracks, compact progress rows
[ Explore ]  Foundations | Languages | AI | Career | Advanced   <- collapsed category rows
                                     each row scrolls horizontally, 4-5 cards visible
```

Result: a new user sees three things instead of fifteen, and browsing happens by category rather than one long list. Existing filters stay as a fallback.

## 4. Reducing backend usage

Practical measures, described with expected impact: cache reads in context instead of refetching per page, batch profile writes, keep static lesson/challenge/exam content in the bundle (never the database), avoid realtime subscriptions except on Suggestions, prune the count/stat caches, and keep images as bundled assets rather than storage objects.

## 5. Paid-course catalogue

A vast list of course ideas that are hard to find free and in depth, grouped by AI (including "Build your own Jarvis" style assistant projects, RAG, agents, fine-tuning, local LLMs), systems and performance, cybersecurity (offensive, defensive, forensics), data and infrastructure, and career/business tracks — each with a one-line pitch and suggested prerequisite track.

## Technical notes

- The database changes are two migrations-safe operations: replacing the `enroll_track` function body and inserting `cpp-*` rows into `lesson_registry`.
- No changes to auth, RLS policies, or existing track data.
- Items 2, 4 and 5 are documentation deliverables (`DOCS.md`, `COURSE-IDEAS.md`); item 3 is a UI change to `Dashboard.tsx` only.
