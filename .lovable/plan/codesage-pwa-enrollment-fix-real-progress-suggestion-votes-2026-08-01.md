# CodeSage: PWA, Enrollment Fix, Real Progress, Suggestion Votes

## Health check first

No TypeScript errors right now — a full typecheck passes clean. The real bugs are logic/data ones, listed below.

## 1. Lessons showing as "not done" (Java, 3D Web Dev, Real-World Freelancing)

Cause (verified): completing a lesson calls a server function that rejects any lesson ID not present in the `lesson_registry` table. That table has 167 IDs and contains none of the Java, 3D, Real-Freelance, SQL or AI lesson IDs, so the tick appears instantly then vanishes on reload.

Fix:

- Generate the full ID list from every lesson data file and load the missing IDs into `lesson_registry`.
- Add a small shared module that exports every track's lesson IDs from one place, so future tracks can't drift again.
- Surface the failure instead of silently swallowing it: if the server rejects a completion, show a toast rather than leaving a fake tick.

## 2. Enrollment system

Problems found:

- `java`, `sql`, `ai-fundamentals`, `three3d`, `real-freelance` are not real tracks in the database. `java` isn't even in the track list in code (the Dashboard force-casts it), which is why touching lesson files near it breaks the app.
- Those five tracks are hard-coded as "database unsupported" and run in browser storage only, so their student counts are fake and reset per device.
- Student counts mix a hardcoded seed number with the real count, so the number shown is not the real number of students.

Fix:

- Add `java` (and the other missing tracks) as first-class tracks: track list, metadata, route, prerequisites, dashboard mapping.
- Widen the database's allowed-track list to cover all 11 tracks and remove the "unsupported" bypass so every enrollment persists to the account.
- Show the true student count from the server. Seeds are kept only as a display floor for brand-new tracks with zero students, or dropped entirely — see the question below.
- Keep the 2-active-track rule, and make prerequisite checks use the shared lesson-ID module so adding a lesson file can never break the dialog again.

## 3. Installable app (PWA) for mobile and desktop

- Add a web app manifest (name, icons, theme colour matching the dark orange theme, standalone display).
- Generate app icons (192, 512, maskable, Apple touch icon).
- Add the manifest and icon tags to the page head.
- this is from user: SO bro...... i want you to chagne the app logo..... i don't have anything in my mind..... so make a unique new an dfantasitc logo for our app everywhere where needed. the logo should be unique and for an aesthethic platform. 

This makes CodeSage installable from Chrome/Edge on desktop and "Add to Home Screen" on phones. No offline mode is included unless you ask for it.

## 4. Settings: real lesson groups and real progress

- Replace the ID-prefix guessing with the shared lesson-ID module, so each track's group shows `completed / actual total`.
- Overall progress becomes completed across all tracks divided by the true grand total, instead of only counting frontend lessons.

## 5. Suggestions: upvote / downvote

- New `suggestion_votes` table (one vote per user per suggestion, switchable between up and down, removable by clicking again).
- Vote counts read live so totals update in real time across users.
- Up/down buttons on each suggestion card with the current score and your own vote highlighted.  
  
6. 2 mober things to add.... 1 is privacy and term and policy page then 2 a contact page...... if we nee dto run add these 2 things are improtatns. 

&nbsp;

&nbsp;

6. i have one more question kinldy give me the list of courses... that we can add in future but there isn't anyplace those can be find for free. mean we will keep them for less amount.. so we can earn a bit...... 

## Your two questions

**Do you have to run migrations manually if you give me your Supabase ID?**
No. Database changes go through the migration tool here — you approve it in chat and it runs itself. You never open a dashboard or run SQL by hand.

**If we switch to a different Supabase project, does it break anything and do users move?**
Users and their data do **not** move automatically. A new project starts empty: all 850 profiles, 596 enrollments, suggestions and announcements stay in the old project, and everyone would have to sign up again. Switching also needs the whole schema (tables, policies, functions, triggers) re-created there. It's doable as a deliberate migration with an export/import step, but it is not a flip of a switch — I'd recommend staying on the current backend unless there's a strong reason.

## Technical notes

- New file `src/data/lessonIndex.ts` exporting `TRACK_LESSON_IDS: Record<TrackId, string[]>` plus `ALL_LESSON_IDS`, built by importing each track's exported lesson array. Used by `lesson_registry` seeding, `EnrollDialog` prerequisites, `SettingsPage` groups, and Roadmap totals.
- Migration: insert missing `lesson_registry` rows; relax the `enroll_track` track whitelist to all 11 track IDs; create `suggestion_votes` (`user_id`, `suggestion_id`, `value smallint`) with grants, RLS (users manage own vote, all authenticated can read), and add the table to the realtime publication.
- `src/lib/enrollment.ts`: delete `DB_UNSUPPORTED`, add `java` to `TrackId`/`VALID_TRACK_IDS`/`TRACK_META`, and change `getStudentCount` to report the server value.
- PWA: `public/manifest.webmanifest` + icons in `public/`, tags in `index.html`. No service worker, no `vite-plugin-pwa`.