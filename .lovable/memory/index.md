# Memory: index.md
Updated: Sep 2026

# Project Memory

## Core
CodeSage - free coding learning platform for students. Dark theme.
Primary orange #e94560, bg #1a1a2e. JetBrains Mono + Inter fonts.
Backend = user's OWN self-managed Supabase project (dnjssaeyfjoduauvcavk), pinned via `define` in vite.config.ts which OVERRIDES .env. Lovable Cloud backend exists but is UNUSED by the app — do NOT deploy edge functions/migrations there expecting the app to see them.
App is published on Netlify (netlify.toml: dist, SPA redirect). Cloudflare Pages was considered; static SPA needs NO wrangler config.
No Supabase connector exists in the workspace; connection is via hardcoded public URL + publishable key in vite.config.ts.
Backend/AI sections locked by default, unlockable via promo codes or completing frontend.
Duolingo-style progression: lessons unlock sequentially, level tests gate next level.

## Memories
- [App structure](mem://features/app-structure) — Pages: Auth, Onboarding, Dashboard, Learn, LessonPage, Playground, Challenges, LevelTest, Settings
- [Lesson system](mem://features/lessons) — Basics/Intermediate/Expert with sequential unlock, inline challenges, level tests at 70% pass
