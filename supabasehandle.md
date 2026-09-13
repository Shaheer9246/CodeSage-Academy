# Complete Supabase Database & Architecture Reference

This document provides a comprehensive, verified guide to how CodeSage connects to Supabase, how every table and column is structured, and how the frontend interacts with the database.

---

## 1. Architectural Model

CodeSage uses a **hybrid client-first architecture**:
1. **Course Content, Code & Quizzes**: Stored entirely in static TypeScript data files on the frontend (`src/data/*.ts`). This keeps client response time near 0ms and ensures no egress bandwidth is wasted delivering static lesson text.
2. **User Identity, Progress, Social, & Stats**: Persisted in Supabase PostgreSQL (`public` schema) via Row Level Security (RLS) and Security Definer Stored Procedures (RPCs).

---

## 2. Master Table Reference (All 13 Tables + 1 View)

### 1. `public.profiles` (User Account & Gamification State)
Stores the entire persistent state of an individual student.
- `id` (`uuid`, PK, references `auth.users.id`): Unique user identifier.
- `username` (`text`): Display handle.
- `name` (`text`): Full name.
- `student_id` (`text`): Formatted identifier (e.g. `CS-10023`).
- `xp` (`integer`): Cumulative Experience Points across all tracks.
- `level` (`integer`): Current calculated level.
- `sage_coins` (`integer`): In-app currency (`◈`) earned via lesson and test completions.
- `streak_count` (`integer`): Current daily streak.
- `last_active_date` (`text`): Date string of previous activity to calculate streak breaks.
- `streak_freeze_until` (`date`): Active streak freeze protection date.
- `daily_xp` (`numeric`): XP earned today (resets daily).
- `daily_xp_date` (`date`): Date stamp tracking daily XP cap/progress.
- `completed_lessons` (`text[]`): Array of lesson IDs completed by the user (e.g., `['html-1', 'cpp-01', 'cppx-01']`).
- `completed_tests` (`text[]`): Array of test IDs passed (e.g., `['py-test-1', 'java-test-2']`).
- `badges` (`text[]`): IDs of unlocked achievement badges.
- `unlocked_sections` (`text[]`): Sections unlocked via progress or promo codes.
- `promo_codes` (`text[]`): Array of promo codes redeemed by this user.
- `experience_level` (`text`): Self-selected proficiency (e.g., Beginner, Intermediate).
- `studying` (`text`), `has_job` (`text`), `dob` (`text`), `goal` (`text`): Onboarding survey answers.
- `dark_mode` (`boolean`): Theme preference.
- `has_seen_tour` (`boolean`): Onboarding walkthrough completed flag.
- `created_at` (`timestamptz`), `updated_at` (`timestamptz`).

---

### 2. `public.lesson_registry` (Foreign Key Authority)
The master catalog of all allowable lesson IDs in CodeSage.
- `id` (`text`, PK): Unique lesson identifier (e.g., `html-1`, `cpp-01`, `cppx-01`, `c-01`, `javax-01`).
- **Total Rows**: Exactly **367** registered lessons.
- **Purpose**: Prevents tampering. Any lesson submitted for completion must match a registered ID in this table.

---

### 3. `public.test_registry` (Exam Master Catalog)
Master catalog of valid midterm and final assessments.
- `id` (`text`, PK): e.g., `py-test-1`, `py-test-2`, `java-test-2`.

---

### 4. `public.enrollments` (User Course Enrollments)
Tracks which courses each user has active, paused, or ended.
- `id` (`uuid`, PK): Primary record identifier.
- `user_id` (`uuid`, FK references `auth.users.id`): Student user ID.
- `track` (`text`): Track ID (e.g. `'frontend'`, `'cpp'`, `'cppexpert'`, `'java'`, `'javaexpert'`, `'c'`, `'cexpert'`, `'cx'`).
- `status` (`text`): `'active'`, `'paused'`, or `'ended'`. (Maximum 2 active tracks allowed per user).
- `enrolled_at` (`timestamptz`): Initial enrollment timestamp.

---

### 5. `public.track_stats` (Student Counters)
Aggregate enrollment numbers displayed on course cards and roadmaps.
- `track` (`text`, PK): Track identifier.
- `enrolled_count` (`integer`): Number of students enrolled.
- `updated_at` (`timestamptz`): Timestamp of latest update.

---

### 6. `public.suggestions` & `public.suggestions_public` (Feedback System)
Community feature requests and feedback.
- `id` (`uuid`, PK): Feedback ID.
- `user_id` (`uuid`, FK): Submitter's ID.
- `username` (`text`): Submitter's username.
- `text` (`text`): Suggestion body.
- `reply` (`text`): Admin reply.
- `reply_at` (`timestamptz`): Admin response timestamp.
- `upvotes` (`integer`), `downvotes` (`integer`): Vote tallies.
- `created_at`, `updated_at` (`timestamptz`).
- **`suggestions_public`** (View): Public-facing view stripping private user attributes and adding `is_mine` boolean.

---

### 7. `public.suggestion_votes` (Vote Records)
Prevents duplicate upvotes/downvotes.
- `suggestion_id` (`uuid`, FK references `suggestions.id`)
- `user_id` (`uuid`, FK references `auth.users.id`)
- `vote_type` (`text`): `'up'` or `'down'`.
- `created_at`, `updated_at` (`timestamptz`).

---

### 8. `public.suggestion_reads` (Notification Tracking)
Tracks when a user last viewed the suggestions page.
- `user_id` (`uuid`, PK, FK references `auth.users.id`)
- `last_seen_at` (`timestamptz`): Timestamp used to show "New reply" badge alerts.

---

### 9. `public.announcements` (Platform Broadcasts)
Official news, release notes, and updates posted by admins.
- `id` (`uuid`, PK): Announcement ID.
- `title` (`text`): Headline.
- `body` (`text`): Content markdown or text.
- `created_at` (`timestamptz`): Publication time.

---

### 10. `public.announcement_reads` (Read Status per User)
Records which announcements a user has already seen to display unread badge dots in the navbar.
- `user_id` (`uuid`, FK references `auth.users.id`)
- `announcement_id` (`uuid`, FK references `announcements.id`)
- `read_at` (`timestamptz`)

---

### 11. `public.badge_levels` (Achievement Thresholds)
Defines XP requirements for tiered badges.
- `badge_id` (`text`)
- `level` (`integer`)
- `xp_required` (`integer`)

---

### 12. `public.promo_codes` (Discount / Track Access Vouchers)
- `code` (`text`, PK): The secret coupon string.
- `sections` (`text[]`): Array of sections or tracks unlocked by the code.
- `created_at` (`timestamptz`).

---

### 13. `public.user_roles` (Role-Based Access Control)
- `id` (`uuid`, PK)
- `user_id` (`uuid`, FK references `auth.users.id`)
- `role` (`app_role` ENUM: e.g. `'admin'`, `'moderator'`, `'student'`)
- `created_at` (`timestamptz`).

---

## 3. Core Stored Procedures (RPCs)

1. `public.enroll_track(_track text)`: Validates track whitelist, upserts `enrollments`, increments `track_stats.enrolled_count`.
2. `public.update_enrollment_status(_track text, _status text)`: Updates enrollment state (`active`, `paused`, `ended`).
3. `public.record_lesson_completion(_lesson_id text, ...)`: Validates against `lesson_registry`, appends to `profiles.completed_lessons`, credits XP and Sage Coins.
4. `public.post_announcement(_title text, _body text)`: Restricted to admins (`is_admin()`). Inserts a new system-wide broadcast.
5. `public.reply_suggestion(_id uuid, _reply text)`: Restricted to admins (`is_admin()`). Adds official admin response to user suggestions.
6. `public.admin_edit_suggestion(_id uuid, _text text)`: Restricted to admins (`is_admin()`). Allows editing spam or inappropriate suggestions.
7. `public.admin_delete_suggestion(_id uuid)`: Restricted to admins (`is_admin()`). Deletes a suggestion permanently.
8. `public.admin_list_users(_search text, _limit int, _offset int)`: Paginated user lookup with enrollment progress.
9. `public.admin_delete_user(_user_id uuid)`: Deletes profile and auth record.

---

## 4. Admin Command Center Architecture

All admin powers have been consolidated exclusively into `/admin`:
- **Regular Users (`/inbox`, `/suggestions`)**:
  - Hardcoded passwords and administrative modals removed completely.
  - Users only see official announcements and community suggestions with voting and personal deletion/editing of their own posts.
- **Admin Console (`/admin`)**:
  - Verified against Supabase `user_roles` using `public.is_admin()`.
  - **Users Management**: Student directory, search, progress stats, account deletion.
  - **Announcements Hub**: Compose new system broadcasts, edit existing announcements, delete broadcasts.
  - **Suggestions & Feedback**: View feedback feed, write official admin responses, edit suggestions, and delete items.

---

## 5. Egress Optimization Blueprint

To minimize Supabase data transfer and stay comfortably within free/pro tier egress limits:
- **Cache Profiles locally**: Never re-fetch `profiles` on route navigation; only fetch when explicitly invalidated or on auth state change.
- **Cache Announcements & Suggestions**: Store fetched announcements and suggestions in `localStorage` with a TTL (Time-To-Live). Check lightweight timestamps or counts first rather than querying entire table payloads.
- **Batch & Debounce Writes**: Debounce streak updates and profile preference saves.
- **Selective Column Queries**: Replace `select('*')` with targeted columns (e.g. `select('id, title, created_at')`) across all queries.
