## Fix navigation-after-completion + Python "first lesson undone" bug

### Root causes found

**1. LocalLessonPage drops the `?from=` param on completion**
`src/pages/LocalLessonPage.tsx` line 50 does:

```ts
navigate('/complete/' + lesson.id);   // ❌ no fromQs
```

So the flow `dashboard → /local?from=dashboard → /local-lesson/x?from=dashboard → Urrhhaa` lands on `/complete/x` **without** `?from=dashboard`. From then on, every "Next"/"Lesson Path" button in `LessonComplete` inherits an empty `from`, so `PythonLearn`/`LocalLearn`'s back button falls into the `else` branch and sends the user to `/roadmap` instead of `/dashboard`.

Fix: mirror what `PythonLessonPage.handleSubmit` already does:

```ts
const fromQs = from ? `?from=${from}` : '';
navigate(`/complete/${lesson.id}${fromQs}`);
```

(LocalLessonPage already reads `from` via `useSearchParams`, we just have to append it.)

**2. Python: same class of bug happens after several `Next` clicks**
The Python page already appends `fromQs` on the *first* completion, but `LessonComplete`'s `Next` button navigates to `/py-lesson/py-2?from=dashboard` — good. However on that new lesson page, the user re-enters `handleSubmit`, and everything works... **until** `LessonComplete`'s `Lesson Path` button is used, which navigates to `/python?from=dashboard`. That path is still fine.

The only path that actually loses `from` for Python is when a lesson has no `from` param to begin with — which happens after the *Local* bug pollutes the chain if the user swapped tracks, OR when `from` is missing on the very first jump. To be safe, harden `LessonComplete` to default `from=dashboard` when it's absent (users only reach the Urrhhaa screen through the app, and dashboard is the correct home). Change:

```ts
const from = searchParams.get('from') ?? 'dashboard';
const fromQs = `?from=${from}`;
```

This guarantees every `Next` / `Lesson Path` / `Review` button carries `from=dashboard`, so `PythonLearn` / `LocalLearn` will always send the back arrow to `/dashboard` instead of `/roadmap`.

**3. Python "first lesson (py-01) becomes undone" after several lessons**
`PYTHON_LESSONS[0].id === 'py-01'` (leading zero) while lessons 2–20 use `py-2 … py-20`. Nothing in the app normalizes it, so storage/read is symmetrical. However `isPythonLessonUnlocked` compares raw ids, and `completeLesson` writes `py-01` to the DB — this all works.

The visible symptom ("first lesson unchecked, lessons 2–5 checked, lesson 6 unlocked") happens because after completing lesson 5, `isPythonLessonUnlocked('py-6')` returns `true` (previous lesson is completed), which unlocks lesson 6. That part is expected. The *only* actual bug is the missing checkmark on lesson 1, and that is caused by an **optimistic write race** in `UserContext.completeLesson`:

- Lesson 1 completes → optimistic setUser adds `py-01`, async server fetch returns `completed_lessons = []` (server hasn't received the write yet because it's the same round-trip), we then `UPDATE completed_lessons = [...[], 'py-01']`. Fine.
- Lesson 2 completes fast → optimistic setUser adds `py-2`, server fetch races the previous update and may return `[]` again → we `UPDATE completed_lessons = ['py-2']`, **overwriting `py-01**`.

Fix: replace the "fetch then write full array" pattern with the existing `award_lesson` RPC (already in the DB, uses `array_append` server-side and is idempotent):

```ts
const { data, error } = await supabase.rpc('award_lesson', { _lesson_id: lessonId });
if (!error && data) applyServerProfile(data);
```

Keep the optimistic `setUser` for instant UI feedback, but let the RPC be the authoritative writer. This eliminates the read-modify-write race and also correctly awards XP/coins/badges server-side.

Note: `award_lesson` requires the lesson id to exist in `lesson_registry`. We need a small data migration to insert all Python / Local / Networking / Freelance / Fullstack / Python-Expert lesson ids into `lesson_registry` so the RPC accepts them. (Currently only some ids are registered, which is why the previous author bypassed the RPC with a direct update.)

4. **Enrollment issue:**
  1. he enrollment is not happening according ot what we decided. you should check it out the files for enrollments. (user concept) (becasue we don't have any user yet so we will add mock number of enrollments so if a new student come they don't feel alone. they should feel like more other students are also doing the same thing).
  2. (user concept part 2) (when a new user will join now then the mock number add one user if it was 200 then now it will become 201 from all user all over the app). 
  3. Now if any user end the enrollment then the become which were added while the user enroll that number must substract from it. like 200 --> 201 ---> 200). 
    &nbsp;
    **Note:** only the number show first will be mock not the whole enrollment system. the system is real. 
  &nbsp;

&nbsp;

### Files to change

1. `src/pages/LocalLessonPage.tsx` — append `fromQs` in `handleSubmit`.
2. `src/pages/LessonComplete.tsx` — default `from` to `'dashboard'` when missing.
3. `src/contexts/UserContext.tsx` — rewrite `completeLesson` to call `award_lesson` RPC, keeping optimistic UI.
4. src/lib/enrollment.ts -- check the and update the concept according to the user will. 
5. New migration — `INSERT ... ON CONFLICT DO NOTHING` every lesson id from the six track files into `public.lesson_registry`.

### Out of scope

No visual/layout changes. No changes to `PythonLearn`, `PythonLessonPage`, `LocalLearn` (their nav already reads `from` correctly; fixing sources upstream fixes them).