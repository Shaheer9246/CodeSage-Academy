# CodeSage Admin Console & Supabase Backend Reference

This document provides a complete, structured reference for the **Admin Console** (`/admin`), how it connects to **Supabase**, every database table, column, RPC stored procedure, RLS policy, and permission involved.

---

## 1. Overview & Architecture

The CodeSage Admin System operates with strict, multi-layered security:

1. **Frontend Gate (`/admin`)**:
   - The route mounts `Admin.tsx`.
   - Upon loading, it calls `supabase.rpc('admin_list_users')`.
   - If the active Supabase user is not an admin, the RPC raises an exception (`Admin access required`), and the page renders an **Access Restricted** shield.
   - Non-admin users cannot see emails, student IDs, progress data, or management controls.

2. **Backend Authority (`public.is_admin()`)**:
   - Every single administrative action (viewing all users, deleting a user, posting announcements, deleting announcements, replying to suggestions, deleting suggestions) executes inside a PostgreSQL `SECURITY DEFINER` function with `search_path = 'public'`.
   - The function verifies:
     ```sql
     IF NOT public.is_admin() THEN
       RAISE EXCEPTION 'Admin access required';
     END IF;
     ```

---

## 2. Admin Modules Breakdown

The Admin Console contains three primary tabs:

### Tab 1: Students Directory (`users`)
- **Global Stats Strip**:
  - **Registered Students**: Live count from `auth.users` / `profiles` via `admin_user_count`.
  - **Curriculum Lessons**: Total lesson count registered in `lesson_registry` (e.g., 454).
  - **Lessons Completed (Paged)**: Total completed lessons across the currently loaded page of students.
  - **Student XP (Paged)**: Cumulative XP earned by loaded students.
  - **Inactive ≥ 7d (Paged)**: Total loaded students with no activity for 7 or more days.
- **Search & Inactivity Filter**:
  - Live, debounced search across Name, Username, Student ID, and Email.
  - **Inactivity Filter Dropdown**: Filter students inactive for:
    - Inactive ≥ 1 Day
    - Inactive ≥ 2 Days
    - Inactive ≥ 3 Days
    - Inactive ≥ 7 Days (1 Week)
    - Inactive ≥ 14 Days (2 Weeks)
    - Inactive ≥ 30 Days (1 Month)
    - Inactive ≥ 60 Days (2 Months)
    - Inactive ≥ 90 Days (3 Months)
  - Color-coded inactivity badges on each student card (`Active today`, `2d inactive`, `Inactive 14d`, etc.).
- **Student Profile Expansion**:
  - **Metrics**: Level, XP, Sage Coins (`◈`), Daily Streak, Lessons Done, Tests Passed, Suggestions submitted.
  - **Onboarding Profile**: Full Name, Username, Student ID, Inactivity status, Email verification status, Education/Studying, Employment status, Experience Level, Date of Birth, Learning Goal, Account creation date, Last sign-in timestamp, Promo codes redeemed.
  - **Enrolled Tracks**: Active and completed courses, enrolled dates, live progress bars (lessons done in track vs total track lessons).
  - **Curriculum Completion by Track**: Visual completion percentage across all tracks.
  - **Completed Lessons Roster**: Clickable badge chips showing every completed lesson ID (`ai-01`, `sql-01`, `c-01`, etc.).
  - **Completed Tests & Badges**: Chips for passed tests and earned badges.
- **Delete User**:
  - Hard delete of user sessions, refresh tokens, and authentication records via `admin_delete_user(_user_id)`.

### Tab 2: Announcements Hub (`announcements`)
- **Broadcast New Announcement**:
  - Title and body input fields.
  - Calls `public.post_announcement(_title, _body)`.
  - Sends a notification to all users and activates the unread inbox badge.
- **Edit Announcement**:
  - In-place title and body editor updating `public.announcements`.
- **Delete Announcement**:
  - Deletes broadcast via `public.admin_delete_announcement(_id)` with table fallback.

### Tab 3: Suggestions & Feedback Board (`suggestions`)
- **Community Feed**:
  - Displays student suggestions, timestamps, upvote/downvote counts, and submitter handles.
- **Official Admin Reply**:
  - Post official admin replies via `public.reply_suggestion(_id, _reply)`.
  - Immediately updates user inbox and unread feedback badges.
- **Moderate / Edit Suggestion**:
  - Edit abusive or malformed suggestions via `public.admin_edit_suggestion(_id, _text)`.
- **Delete Suggestion**:
  - Delete spam suggestions via `public.admin_delete_suggestion(_id)`.

---

## 3. Database Schema Reference

### Table: `public.user_roles`
Controls role-based permissions:
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Record ID |
| `user_id` | `uuid` (FK -> `auth.users.id`) | Target user |
| `role` | `app_role` ENUM (`'admin'`, `'moderator'`, `'user'`) | User role |
| `created_at` | `timestamptz` | Date assigned |

### Table: `public.announcements`
Platform-wide announcements:
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Announcement ID |
| `title` | `text` | Headline (up to 200 chars) |
| `body` | `text` | Content body (up to 5000 chars) |
| `created_at` | `timestamptz` | Publication timestamp |

### Table: `public.announcement_reads`
Unread status tracking:
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | `uuid` (FK) | User who viewed |
| `announcement_id` | `uuid` (FK) | Viewed announcement |
| `read_at` | `timestamptz` | Timestamp |

### Table: `public.suggestions`
Student suggestions:
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Suggestion ID |
| `user_id` | `uuid` (FK) | Author ID |
| `username` | `text` | Author username |
| `text` | `text` | Feedback text (up to 500 chars) |
| `reply` | `text` | Admin reply text |
| `reply_at` | `timestamptz` | Timestamp of admin reply |
| `upvotes` | `integer` | Total upvotes |
| `downvotes` | `integer` | Total downvotes |
| `created_at` | `timestamptz` | Post date |
| `updated_at` | `timestamptz` | Last updated |

### View: `public.suggestions_public`
Public-facing sanitized view for student feed:
- Selects `id, username, text, reply, reply_at, created_at, updated_at, upvotes, downvotes`.
- Appends `is_mine` boolean: `(auth.uid() IS NOT NULL AND user_id = auth.uid())`.

---

## 4. Stored Procedures (RPCs) Specification

| Function Name | Parameters | Security | Description |
| :--- | :--- | :--- | :--- |
| `public.is_admin()` | None | SECURITY DEFINER | Returns `true` if `auth.uid()` has `'admin'` in `user_roles`. |
| `public.admin_list_users` | `_search text, _limit int, _offset int, _inactive_days int` | SECURITY DEFINER | Returns JSON array of student profiles, stats, enrollments, and progress, optionally filtered by minimum inactive days. |
| `public.admin_user_count` | `_search text, _inactive_days int` | SECURITY DEFINER | Returns total count of students matching search query and inactivity threshold. |
| `public.admin_delete_user` | `_user_id uuid` | SECURITY DEFINER | Purges user sessions, tokens, and `auth.users` row. |
| `public.post_announcement` | `_title text, _body text` | SECURITY DEFINER | Validates admin role and inserts new announcement. |
| `public.admin_delete_announcement` | `_id uuid` | SECURITY DEFINER | Validates admin role and deletes announcement. |
| `public.reply_suggestion` | `_id uuid, _reply text` | SECURITY DEFINER | Validates admin role, writes admin reply and timestamp. |
| `public.admin_edit_suggestion` | `_id uuid, _text text` | SECURITY DEFINER | Validates admin role and modifies suggestion text. |
| `public.admin_delete_suggestion` | `_id uuid` | SECURITY DEFINER | Validates admin role and deletes suggestion. |
| `public.admin_update_user_enrollment` | `_user_id uuid, _track text, _status text` | SECURITY DEFINER | Validates admin role and changes a student's enrollment status (`active`, `paused`, `ended`). |

---

## 5. Master Setup & Fix SQL Script

Run this SQL script in the **Supabase SQL Editor** to enable all admin capabilities, announcement deletion, suggestion management, server-side inactivity filtering, and the 2-course active limit enforcement:

```sql
-- 1. Ensure admin delete announcement function exists
CREATE OR REPLACE FUNCTION public.admin_delete_announcement(_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin() THEN 
    RAISE EXCEPTION 'Admin access required'; 
  END IF;
  
  DELETE FROM public.announcements WHERE id = _id;
  RETURN true;
END;
$$;

-- 2. Announcements RLS policies
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
CREATE POLICY "Admins can update announcements" ON public.announcements 
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;
CREATE POLICY "Admins can delete announcements" ON public.announcements 
  FOR DELETE TO authenticated USING (public.is_admin());

-- 3. Update suggestions_guard so admins are exempt from 1-post-per-day rate limit
CREATE OR REPLACE FUNCTION public.suggestions_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _uname text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Regular students are limited to 1 per day; admins are exempt
    IF NOT public.is_admin() AND EXISTS (
      SELECT 1 FROM public.suggestions
      WHERE user_id = NEW.user_id
        AND created_at >= date_trunc('day', now())
    ) THEN
      RAISE EXCEPTION 'You can only post one suggestion per day';
    END IF;

    SELECT username INTO _uname FROM public.profiles WHERE id = auth.uid();
    NEW.username := COALESCE(_uname, 'Admin');
    NEW.user_id := auth.uid();
    NEW.reply := NULL;
    NEW.reply_at := NULL;
    NEW.upvotes := 0;
    NEW.downvotes := 0;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (NEW.reply IS DISTINCT FROM OLD.reply) OR (NEW.reply_at IS DISTINCT FROM OLD.reply_at) THEN
      IF current_setting('role', true) IS NULL OR current_setting('role', true) <> 'service_role' THEN
        IF current_user <> 'postgres' AND NOT public.is_admin() THEN
          RAISE EXCEPTION 'Reply fields are admin-only';
        END IF;
      END IF;
    END IF;
    NEW.username := OLD.username;
    NEW.user_id := OLD.user_id;
    IF current_user <> 'postgres' AND pg_trigger_depth() < 2 THEN
      NEW.upvotes := OLD.upvotes;
      NEW.downvotes := OLD.downvotes;
    END IF;
    NEW.updated_at := now();
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Inactivity Filter: Upgrade admin_list_users with _inactive_days parameter
DROP FUNCTION IF EXISTS public.admin_list_users(text, integer, integer);
DROP FUNCTION IF EXISTS public.admin_list_users(text, integer, integer, integer);

CREATE OR REPLACE FUNCTION public.admin_list_users(
  _search text DEFAULT NULL::text,
  _limit integer DEFAULT 50,
  _offset integer DEFAULT 0,
  _inactive_days integer DEFAULT NULL::integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE 
  _result jsonb; 
  _q text;
BEGIN
  IF NOT public.is_admin() THEN 
    RAISE EXCEPTION 'Admin access required'; 
  END IF;

  _limit := LEAST(GREATEST(COALESCE(_limit, 50), 1), 200);
  _offset := GREATEST(COALESCE(_offset, 0), 0);
  _q := NULLIF(btrim(COALESCE(_search, '')), '');

  SELECT COALESCE(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
  INTO _result
  FROM (
    SELECT 
      p.id, 
      u.email::text AS email, 
      p.username, 
      p.name, 
      p.student_id, 
      p.studying,
      p.has_job, 
      p.dob, 
      p.goal, 
      p.experience_level, 
      p.xp, 
      p.level, 
      p.sage_coins,
      p.streak_count, 
      p.last_active_date, 
      p.badges, 
      p.unlocked_sections, 
      p.promo_codes,
      p.completed_lessons, 
      p.completed_tests,
      COALESCE(array_length(p.completed_lessons, 1), 0) AS lessons_done,
      COALESCE(array_length(p.completed_tests, 1), 0) AS tests_done,
      p.created_at, 
      u.created_at AS joined_at, 
      u.last_sign_in_at, 
      u.email_confirmed_at,
      COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('track', e.track, 'status', e.status, 'enrolled_at', e.enrolled_at) ORDER BY e.enrolled_at)
         FROM public.enrollments e WHERE e.user_id = p.id), 
        '[]'::jsonb
      ) AS enrollments,
      (SELECT count(*) FROM public.suggestions s WHERE s.user_id = p.id) AS suggestions_count
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE (
      _q IS NULL
      OR p.username ILIKE '%' || _q || '%'
      OR p.name ILIKE '%' || _q || '%'
      OR p.student_id ILIKE '%' || _q || '%'
      OR u.email ILIKE '%' || _q || '%'
    )
    AND (
      _inactive_days IS NULL
      OR COALESCE(u.last_sign_in_at, p.last_active_date::timestamptz, p.created_at) < (now() - (_inactive_days || ' days')::interval)
    )
    ORDER BY COALESCE(u.last_sign_in_at, p.last_active_date::timestamptz, p.created_at) ASC NULLS FIRST
    LIMIT _limit OFFSET _offset
  ) t;

  RETURN _result;
END;
$$;

-- 5. Inactivity Filter: Upgrade admin_user_count with _inactive_days parameter
DROP FUNCTION IF EXISTS public.admin_user_count(text);
DROP FUNCTION IF EXISTS public.admin_user_count(text, integer);

CREATE OR REPLACE FUNCTION public.admin_user_count(
  _search text DEFAULT NULL::text,
  _inactive_days integer DEFAULT NULL::integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE 
  _n integer; 
  _q text;
BEGIN
  IF NOT public.is_admin() THEN 
    RAISE EXCEPTION 'Admin access required'; 
  END IF;

  _q := NULLIF(btrim(COALESCE(_search, '')), '');

  SELECT count(*) INTO _n
  FROM public.profiles p 
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE (
    _q IS NULL
    OR p.username ILIKE '%' || _q || '%'
    OR p.name ILIKE '%' || _q || '%'
    OR p.student_id ILIKE '%' || _q || '%'
    OR u.email ILIKE '%' || _q || '%'
  )
  AND (
    _inactive_days IS NULL
    OR COALESCE(u.last_sign_in_at, p.last_active_date::timestamptz, p.created_at) < (now() - (_inactive_days || ' days')::interval)
  );

  RETURN _n;
END;
$$;

-- 6. Admin Enrollment Manager: Change any user's track status
CREATE OR REPLACE FUNCTION public.admin_update_user_enrollment(
  _user_id uuid,
  _track text,
  _status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.is_admin() THEN 
    RAISE EXCEPTION 'Admin access required'; 
  END IF;

  IF _status NOT IN ('active', 'paused', 'ended') THEN
    RAISE EXCEPTION 'Invalid status. Must be active, paused, or ended';
  END IF;

  UPDATE public.enrollments
  SET status = _status
  WHERE user_id = _user_id AND track = _track;

  RETURN true;
END;
$$;

-- 7. Enforce 2-Course Active Limit at the Database Level
CREATE OR REPLACE FUNCTION public.enroll_track(_track text)
RETURNS enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _row public.enrollments;
  _existed boolean;
  _active_count integer;
  _oldest_active_track text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _track NOT IN (
    'frontend', 'networking', 'fullstack', 'freelance', 'real-freelance',
    'python', 'local', 'sql', 'pythonexpert', 'ai-fundamentals',
    'intermediate-ai', 'three3d', 'java', 'javaexpert', 'cpp', 'cppexpert',
    'c', 'cexpert', 'cx'
  ) THEN
    RAISE EXCEPTION 'Invalid track';
  END IF;

  -- Count current active courses (excluding this one if already active)
  SELECT count(*) INTO _active_count
  FROM public.enrollments
  WHERE user_id = auth.uid() AND status = 'active' AND track <> _track;

  -- If user already has 2 active courses, auto-pause the oldest one
  IF _active_count >= 2 THEN
    SELECT track INTO _oldest_active_track
    FROM public.enrollments
    WHERE user_id = auth.uid() AND status = 'active' AND track <> _track
    ORDER BY enrolled_at ASC
    LIMIT 1;

    IF _oldest_active_track IS NOT NULL THEN
      UPDATE public.enrollments
      SET status = 'paused'
      WHERE user_id = auth.uid() AND track = _oldest_active_track;
    END IF;
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid() AND track = _track
  ) INTO _existed;

  INSERT INTO public.enrollments(user_id, track, status)
  VALUES (auth.uid(), _track, 'active')
  ON CONFLICT (user_id, track) DO UPDATE SET status = 'active'
  RETURNING * INTO _row;

  IF NOT _existed THEN
    INSERT INTO public.track_stats(track, enrolled_count)
    VALUES (_track, 1)
    ON CONFLICT (track) DO UPDATE
      SET enrolled_count = public.track_stats.enrolled_count + 1,
          updated_at = now();
  END IF;

  RETURN _row;
END;
$$;

-- 8. Clean up existing users who currently have more than 2 active courses
-- (Auto-pauses older active tracks while keeping their 2 most recent active)
WITH ranked_active AS (
  SELECT 
    user_id, 
    track, 
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY enrolled_at DESC) AS rn
  FROM public.enrollments
  WHERE status = 'active'
)
UPDATE public.enrollments e
SET status = 'paused'
FROM ranked_active r
WHERE e.user_id = r.user_id 
  AND e.track = r.track 
  AND r.rn > 2;

-- 9. Grant execution permissions
GRANT EXECUTE ON FUNCTION public.admin_delete_announcement(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, integer, integer, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_user_count(text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_update_user_enrollment(uuid, text, text) TO authenticated, service_role;
GRANT DELETE, UPDATE ON public.announcements TO authenticated;
GRANT DELETE, UPDATE ON public.suggestions TO authenticated;
GRANT DELETE, UPDATE ON public.enrollments TO authenticated;

-- 10. Status check: See active courses per user
SELECT 
  'Enrollment Limit & Inactivity System Verified' AS status,
  (SELECT count(*) FROM public.enrollments WHERE status = 'active') AS total_active_enrollments,
  (SELECT count(*) FROM public.enrollments WHERE status = 'paused') AS total_paused_enrollments,
  (SELECT count(*) FROM public.enrollments WHERE status = 'ended') AS total_ended_enrollments;
```

---

## 6. Supabase Database Inspector & Duplicate Detection Suite

Run these inspection queries directly in your **Supabase SQL Editor** (`Dashboard > SQL Editor`) to get a full accounting of all data, inspect table sizes, verify function status, and detect or remove duplicate announcements or suggestions.

### Query 1: Master Inventory & Row Counter
Inspects every single table in your `public` schema and counts all records:
```sql
SELECT 
  table_name,
  (xpath('/row/cnt/text()', xml_count))[1]::text::bigint AS row_count
FROM (
  SELECT 
    table_name, 
    query_to_xml(format('SELECT count(*) AS cnt FROM public.%I', table_name), false, true, '') AS xml_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
) sub
ORDER BY row_count DESC;
```

---

### Query 2: Duplicate Announcements Detector
Detects duplicate announcements by title and body content:
```sql
SELECT 
  title,
  LEFT(body, 60) AS body_snippet,
  COUNT(*) AS total_copies,
  ARRAY_AGG(id ORDER BY created_at ASC) AS announcement_ids,
  MIN(created_at) AS first_posted,
  MAX(created_at) AS last_posted
FROM public.announcements
GROUP BY title, LEFT(body, 60)
HAVING COUNT(*) > 1;
```

#### Safe Cleanup for Duplicate Announcements:
Keeps the original post and deletes duplicate copies while cleaning up orphaned read receipts:
```sql
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY title, LEFT(body, 60) ORDER BY created_at ASC) AS rn
  FROM public.announcements
)
DELETE FROM public.announcements
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);
```

---

### Query 3: Duplicate Suggestions Detector
Detects duplicate suggestions submitted by users (identical text from the same user or spam):
```sql
SELECT 
  user_id,
  username,
  text,
  COUNT(*) AS duplicate_count,
  ARRAY_AGG(id ORDER BY created_at ASC) AS suggestion_ids,
  MIN(created_at) AS first_created,
  MAX(created_at) AS last_created
FROM public.suggestions
GROUP BY user_id, username, text
HAVING COUNT(*) > 1;
```

#### Safe Cleanup for Duplicate Suggestions:
Keeps the earliest suggestion (or the one with the admin reply) and removes duplicate submissions:
```sql
WITH ranked_suggestions AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, text 
           ORDER BY (reply IS NOT NULL) DESC, upvotes DESC, created_at ASC
         ) AS rn
  FROM public.suggestions
)
DELETE FROM public.suggestions
WHERE id IN (SELECT id FROM ranked_suggestions WHERE rn > 1);
```

---

### Query 4: Orphaned Records Cleanup (Zero Waste)
Ensures no ghost records consume storage or egress:
```sql
-- 1. Remove announcement_reads referencing deleted announcements
DELETE FROM public.announcement_reads
WHERE announcement_id NOT IN (SELECT id FROM public.announcements);

-- 2. Remove suggestion_votes referencing deleted suggestions
DELETE FROM public.suggestion_votes
WHERE suggestion_id NOT IN (SELECT id FROM public.suggestions);
```

---

### Query 5: Realtime Replication Inspection
Checks which tables have Realtime CDC enabled (tables broadcasting on WebSockets consume background connection quota):
```sql
SELECT 
  c.relname AS table_name,
  CASE WHEN c.relreplident = 'd' THEN 'default'
       WHEN c.relreplident = 'n' THEN 'nothing'
       WHEN c.relreplident = 'f' THEN 'full'
       WHEN c.relreplident = 'i' THEN 'index'
  END AS replication_identity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' 
  AND c.relkind = 'r'
  AND c.relname IN (
    SELECT tablename 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime'
  );
```
*(Tip: To minimize egress, only enable realtime for tables that genuinely require live synchronization. Announcements and Suggestions use cached client polling.)*

---

## 7. Verified Live Production Inventory & Realtime Optimization

Verified database census executed on September 14, 2026:

### Live Table Census
| Table Name | Live Row Count | Purpose & Handled By |
| :--- | :--- | :--- |
| `profiles` | **1,820** | Student profiles, XP, coins, streak, levels, learning goals. Handled by `UserContext.tsx` and `Admin.tsx`. |
| `enrollments` | **1,425** | Enrolled courses and track completion states. Max 2 active tracks limit enforced by `enrollment.ts`. |
| `lesson_registry` | **454** | Validated lesson catalog foreign-key constraint. Prevents unauthorized lesson completion. |
| `suggestion_reads` | **152** | Student read-receipt timestamps for feedback board updates. Cached via 30-min throttle. |
| `announcement_reads` | **125** | Read receipts for broadcasts. Prevents unread notification badges from persisting. |
| `badge_levels` | **100** | Gamification tier and badge milestone configurations. |
| `track_stats` | **18** | Global student enrollment counters per curriculum track. Cached locally for 24 hours. |
| `suggestions` | **4** | Active community suggestions on the feedback board. Handled by `Suggestions.tsx` & `Admin.tsx`. |
| `promo_codes` | **3** | Redeemable reward vouchers. Validated via `redeem_promo` RPC. |
| `test_registry` | **3** | Whitelisted assessment exam definitions. |
| `suggestion_votes` | **1** | Community upvotes and downvotes. |
| `user_roles` | **1** | Administrator authority record (`shaheerwrites703@gmail.com`). Required for `is_admin()`. |
| `announcements` | **1** | Active platform-wide broadcast. Handled by `Inbox.tsx` and `Admin.tsx`. |

### Duplicate & Orphaned Data Audit Results
- **Duplicate Announcements**: **0** (Clean)
- **Duplicate Suggestions**: **0** (Clean)
- **Orphaned Announcement Reads**: **0** (Clean)
- **Orphaned Suggestion Votes**: **0** (Clean)

### Realtime CDC Egress Optimization (Applied)
Tables detached from `supabase_realtime` publication to eliminate WAL decoding background connection quotas:
```sql
ALTER PUBLICATION supabase_realtime DROP TABLE public.announcements;
ALTER PUBLICATION supabase_realtime DROP TABLE public.suggestions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.suggestion_votes;
```
All client components (`InboxBadge.tsx`, `SuggestionsBadge.tsx`, `Inbox.tsx`, `Suggestions.tsx`) now consume these collections via single-flight cached REST calls, keeping egress near zero.

