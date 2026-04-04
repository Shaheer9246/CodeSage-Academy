

# CodeSage Visual Redesign & Feature Completion Plan

The screenshots show a **premium, futuristic dark purple/blue theme** with glassmorphism cards, gradient accents, floating code symbols, and an illustrated character. This is a significant visual overhaul from the current orange/dark theme.

---

## Phase 1: Design System Overhaul

**Update color palette and visual language across the entire app.**

- Change `index.css` CSS variables from current orange/teal to a **deep purple-blue palette** (background ~`#0f0a2e`, cards with glassmorphism `rgba(255,255,255,0.05)` + `backdrop-blur`, primary gradient orange-gold for CTAs)
- Add CSS for floating decorative elements (code brackets `{}`, `</>` scattered with low opacity), glowing orb backgrounds
- Update border styles to use subtle glass borders (`border: 1px solid rgba(255,255,255,0.1)`)
- Keep JetBrains Mono + Inter fonts

**Files:** `src/index.css`, `tailwind.config.ts`

---

## Phase 2: Auth Page Redesign

**Match the first screenshot — immersive login with illustration area.**

- Redesign `Auth.tsx` with a centered layout: CodeSage logo at top, decorative illustration area (CSS-only with floating code symbols and gradient orbs since we can't embed the exact illustration), then the login form card with glassmorphism styling
- Orange gradient "Get Started" button
- "Forgot Password?" link and "Don't have an account? Sign Up" toggle
- Floating `{}` and `</>` symbols as background decorations

**Files:** `src/pages/Auth.tsx`

---

## Phase 3: Onboarding Redesign

**Match the second screenshot — cards-based onboarding with visual flair.**

- Redesign `Onboarding.tsx` to show questions in glassmorphism cards with the same purple-blue theme
- "LEARN CODE" and "EDIT CODE LIVE" option cards with gradient backgrounds (for goal selection)
- Experience level selection with Beginner/Experienced icons
- Orange gradient "CONTINUE" button at bottom
- Same floating decorative elements as auth page

**Files:** `src/pages/Onboarding.tsx`

---

## Phase 4: Dashboard Redesign

**Match screenshots 3 & 4 — professional dashboard with learning roadmap, badges, streaks, and daily challenge.**

- Redesign `Dashboard.tsx` with:
  - **Welcome banner** with user avatar placeholder and greeting
  - **Code Editor Live Preview** card (top-right) — small preview with "LEARN CODE" and "EDIT CODE LIVE" buttons
  - **Learning sections** as colored horizontal bars: Frontend (blue), Backend (green, locked), AI Integration (green, locked), Data Structures (purple, coming soon), Full-Stack Projects (yellow, coming soon)
  - **Badges section** with icon grid
  - **Streaks section** with fire emoji and streak count
  - **Daily Code Challenge** card (new feature) — shows a rotating daily challenge
  - **Left sidebar** with Badges, Streaks, Settings links (on desktop)
  - **Learning Roadmap** visual (from screenshot 4) — nodes connected by a flowing path

- Add **daily challenge logic**: pick a challenge based on day-of-year, show in dashboard card, link to solve it

**Files:** `src/pages/Dashboard.tsx`, `src/contexts/UserContext.tsx` (add daily challenge tracking)

---

## Phase 5: Fix Preview Bug

**HTML code showing JS output instead of rendered HTML.**

- Review `LivePreview.tsx` — ensure `srcdoc` properly wraps HTML content and doesn't evaluate raw tags as JS
- Test that typing `<h1>` renders a heading, not text output

**Files:** `src/components/LivePreview.tsx`

---

## Phase 6: More Lessons & Challenges

**Expand intermediate and expert lesson content.**

- Add **10+ intermediate lessons**: CSS animations, transitions, Flexbox deep-dive, Grid layouts, responsive design with media queries, CSS variables, pseudo-elements, JavaScript DOM manipulation, event handling, fetch API
- Add **10+ expert lessons**: async/await, promises, error handling, localStorage/sessionStorage, Web APIs (Geolocation, Notifications), React component patterns, state management, React Router, form handling with validation, deploying a website
- Add **5+ more challenges** beyond the initial 5: navigation bar, responsive grid gallery, todo app, animated landing page, API data display

**Files:** `src/data/lessons.ts`, `src/pages/Challenges.tsx`

---

## Phase 7: Mobile Responsive

**Ensure all pages work well on small screens (384px viewport).**

- Dashboard: stack cards vertically, hide sidebar on mobile
- Learn page: full-width lesson cards
- LessonPage/Playground: stack editor and preview vertically on mobile
- Auth/Onboarding: already mostly centered, minor padding adjustments

**Files:** All page components with responsive Tailwind classes

---

## Summary of Changes

| Phase | What | Key Files |
|-------|------|-----------|
| 1 | Purple-blue glassmorphism design system | `index.css`, `tailwind.config.ts` |
| 2 | Auth page visual redesign | `Auth.tsx` |
| 3 | Onboarding visual redesign | `Onboarding.tsx` |
| 4 | Dashboard with daily challenge & roadmap | `Dashboard.tsx`, `UserContext.tsx` |
| 5 | Fix HTML preview bug | `LivePreview.tsx` |
| 6 | 20+ new lessons, 5+ challenges | `lessons.ts`, `Challenges.tsx` |
| 7 | Mobile responsive pass | All pages |

