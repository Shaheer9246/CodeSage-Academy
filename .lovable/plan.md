# CodeSage — 5-Item Restructure Plan

## 1. Fix top spacing (small)
The huge gap above "Learning Path" header on `/learn` (and similar pages) comes from `AppShell` adding mobile top padding while pages also have their own padding. Audit:
- `src/components/AppShell.tsx` — remove/reduce duplicate top padding for mobile
- `src/pages/Learn.tsx`, `Dashboard.tsx`, `Roadmap.tsx`, `QuestionsPage.tsx`, `CommunityPage.tsx`, `SettingsPage.tsx` — make sure the first element sits flush with safe-area top.

## 2. Mobile Playground = 4 tabs (small)
Restructure `src/pages/Playground.tsx` for mobile (keep desktop split layout):
- **Files** tab — folder/file tree (HTML/CSS/JS files, add/rename/delete)
- **Code** tab — Monaco editor for the active file
- **Preview** tab — live iframe preview
- **Recent** tab — list of recently edited snippets pulled from `localStorage` with a yellow warning banner: *"These are saved only in your browser cache. Export them to keep them safe."* + an Export (download .zip/.html) button per item.

## 3. Pre-login intro page (small)
New `src/pages/Welcome.tsx` shown at `/` (replaces current `Index` redirect):
- Brief pitch: what CodeSage is, who it's for, what you'll learn (HTML/CSS/JS → React → Networking → Freelancing).
- Two buttons:
  - **Start Learning** → `/auth`
  - **Just Edit Code** → `/playground` (allow guest access to playground)
- Update `src/App.tsx` route table; allow `/playground` without auth.

## 4. Post-lesson celebration page (medium)
New `src/pages/LessonComplete.tsx` at `/lesson/:id/complete`:
- Confetti + "Lesson Complete!" headline
- Recap: 3-4 bullet points of "what you learned" pulled from the lesson's `keyTakeaways` field
- XP earned (+50), Sage Coins (+10), streak status, new level if leveled up
- Buttons: **Next Lesson →**, **Back to Roadmap**, **Review Lesson**
After clicking "Complete" in `LessonPage.tsx`, navigate here instead of straight to next lesson.

## 5. Full lesson restructure (LARGE — main focus)
Rebuild the lesson data model and renderer to match the PDF format.

### New lesson schema (`src/data/lessons.ts`)
```ts
type Lesson = {
  id, title, track, module, order,
  philosophy: string,        // "I. The Core Philosophy" — short intro
  concepts: Concept[],       // "II. Detailed Technical Breakdown" — multiple sub-topics with beginner/advanced views
  practical: {               // "III. Practical Lab"
    title, instructions[], goal,
    starterCode?: { html, css, js }   // optional — opens in embedded editor
  },
  quiz: QuizQuestion[],      // "IV. Mastery Quiz" — 4 MCQs
  keyTakeaways: string[],    // for the Complete page
  xpReward: 50,
}
```

### New `LessonPage.tsx` flow (4 sequential sections)
1. **Concept** tab — read philosophy + concepts (with "Beginner View" / "Advanced View" toggle per concept)
2. **Practical** tab — instructions on the left, embedded Monaco + live preview on the right (mobile = sub-tabs)
3. **Quiz** tab — must score 3/4 to pass; retry on fail
4. On pass → navigate to `/lesson/:id/complete`

### Content to seed (from the attached PDF — Computer & Networking Module 1)
Add all 10 lessons fully written:
1. Hardware Architecture for Developers
2. Operating Systems
3. The Command Line
4. IP Addressing
5. DNS & DHCP
6. The OSI Model
7. Protocols (TCP/UDP/HTTP/SMTP/SSH/FTP)
8. Web Security Basics
9. The Browser (Rendering Engine, V8, Storage)
10. Servers & Cloud

Plus extend Frontend track lessons (HTML/CSS/JS) into the same Concept→Practical→Quiz format using existing content as the philosophy/concepts.

### Roadmap update
- Update `Roadmap.tsx` so the **Networking track is unlocked** with these 10 nodes (Frontend already there).
- Each roadmap node maps to a lesson id; clicking goes to `/lesson/:id` and follows the new flow.
- Group nodes by Module with milestone banners every ~5 lessons.

## Technical notes
- Lesson data file will grow large — split into `src/data/lessons/frontend.ts`, `src/data/lessons/networking.ts`, then re-export from `src/data/lessons.ts`.
- Quiz state stored in component; pass result up to `UserContext` to award XP via existing `addXp`/`addCoins`.
- Confetti: use a tiny custom CSS animation (no new dep) or `canvas-confetti` (~3kb).
- Guest playground: `Playground.tsx` should not require `user`; use `localStorage` for guest snippets.

## Order of execution (today)
1 → 3 → 2 → 4 → 5 (small wins first, then the big lesson restructure last so we have all infrastructure ready).