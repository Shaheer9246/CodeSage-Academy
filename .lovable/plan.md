# New Backend Verification & Repair Plan

## What I verified (tested your new project directly)

Your new backend has all **tables** and **data** (you copied everything — confirmed, tables exist). But two things are broken:

1. **No permissions (GRANTs) on anything.** Every table and function returns `401 permission denied`. When you recreated the schema, the `GRANT ... TO authenticated/anon` statements didn't come along. This is why the app spams failing requests right now.
2. **3 functions are completely missing** (404): `award_lesson_v2`, `spend_coins`, `purchase_extra_lesson`. These power lesson completion (XP/energy) and the coin shop — lessons can't complete without them.

Also confirmed: old users' saved login sessions belong to the OLD backend, so the new one rejects them — everyone must log in fresh once. That's expected, not a bug.

## The fix (you run it, I prepare everything)

### Step 1 — One SQL repair script (I write it, you paste it)

On approval I'll create **`supabase/fix-new-backend.sql`** — a complete, safe-to-re-run script for your new project's SQL editor containing:

- The 3 missing functions, copied exactly from the old backend (`award_lesson_v2`, `spend_coins`, `purchase_extra_lesson`)
- `GRANT` statements for every table (`profiles`, `enrollments`, `announcements`, `announcement_reads`, `suggestions`, `suggestion_reads`, `suggestion_votes`, `suggestions_public` view, `track_stats`, `user_roles`, `promo_codes`, registries) → `authenticated` + `service_role`
- `GRANT EXECUTE` on all ~25 functions → `authenticated`
- Re-creation of all triggers (new-user profile creation, student ID, suggestion guard, vote counter sync, updated_at) — uses `DROP IF EXISTS` first, so safe if they already exist
- Re-assertion of all RLS policies (drop + recreate, so no duplicates)
- Seed checks for `badge_levels`, `lesson_registry`, `test_registry`, `track_stats` in case any rows didn't survive the copy

### Step 2 — Make yourself admin (manual, 2 minutes)

Since your old admin used a fake email:

1. Sign up in the app with a **real email you control**
2. In the new project's SQL editor run:
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'YOUR-EMAIL-HERE'
ON CONFLICT DO NOTHING;
```
3. Log out / log in — the admin page, announcement posting, and suggestion reply/edit/delete all unlock automatically (they check the role server-side, no password anymore)

### Step 3 — Fix "forgot password" for old users (dashboard settings)

Old accounts migrated without usable passwords, so they need the reset flow. In your new project's dashboard:

- **Authentication → URL Configuration**: set Site URL to your app URL and add these to Redirect URLs:
  - `https://id-preview--e5ab3999-b7fc-47ac-8feb-344acef7365f.lovable.app/**`
  - your published/custom domain (when you publish) + `/**`
- **Authentication → Emails**: the default email sender works but is rate-limited (~3/hour). Fine for testing; for many users, connect a free SMTP (Resend/Brevo) later.
- Test: log out → Forgot Password → email arrives → set new password → you're in. All your old data (XP, lessons, streaks) is still there because profiles were copied.

### Step 4 — Known gap: account deletion

The "delete my account" feature uses a server function that lives on the OLD backend. Your new project doesn't have it, so deletion will fail until you deploy it there (Supabase CLI: `supabase functions deploy delete-account` — needs your project's access token). I'll include the function code and exact commands in the script file's comments. Everything else works without it.

## Verification checklist (we test together after Steps 1–3)

| # | Test | Must happen |
|---|------|-------------|
| 1 | Fresh signup | Profile + Student ID (ID-CSA-xxxx) created |
| 2 | Old user → forgot password | Email arrives, reset works, old progress intact |
| 3 | Dashboard | Loads, track student counts show |
| 4 | Complete any lesson | XP/coins/streak update, lesson stays done after refresh |
| 5 | Enroll / end a track | Works, no "database timeout", count updates |
| 6 | Suggestions | Post, upvote/downvote, see others' posts |
| 7 | Admin page | User list loads with emails, enrollments, lesson counts |
| 8 | Inbox | Admin posts announcement, users see badge + can mark read |

## Safety / fallback

- The old Lovable Cloud backend stays **untouched and running**. If the new one fails, switching back = restoring 3 lines in `.env`. Nothing is deleted.
- The repair script is idempotent — running it twice breaks nothing.

## After approval

I create `supabase/fix-new-backend.sql` (full script + commented instructions) and update `DOCS.md` with the new-backend admin/runbook section. Then you run Steps 1–3 and we go through the checklist.
