# CodeSage Academy — Full-Stack Interactive Learning Platform

> A production-grade e-learning and interactive coding platform serving over 3,000 active students. Architected with modern React, TypeScript, and Supabase, with an enterprise 59-point black-box security audit.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)
![Security Audit](https://img.shields.io/badge/Security-59%20Test%20Vectors%20Audited-success)

---

## 🚀 Overview

CodeSage Academy is a high-performance web platform designed to deliver interactive programming courses, real-time code sandboxes, and student progress tracking. Built from scratch with an emphasis on speed, sub-100ms database queries, and airtight authorization.

- **Active Students:** 3,000+ registered users
- **Database Architecture:** Supabase (PostgreSQL) with 30+ custom RPC functions
- **Security Posture:** 59-point black-box penetration assessment completed and verified

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend & Database:** Supabase (PostgreSQL), Custom PL/pgSQL RPC Stored Procedures
- **Authentication & Authorization:** Row-Level Security (RLS) policies, JWT session management
- **AI Integrations:** Server-side proxy API routes for automated student feedback

---

## 🛡️ Security Audit & Hardening (59-Point Assessment)

This codebase underwent a rigorous 59-point security audit covering:
1. **Row-Level Security (RLS) Enforcement:** Verified tenant isolation so students cannot query or modify peer records.
2. **Atomic Credit Transactions:** Patched race conditions and negative integer edge cases in credit consumption via `deduct_user_ai_credits` RPC.
3. **HTTP Security Headers:** Strict Content Security Policy (CSP), anti-clickjacking (`X-Frame-Options: DENY`), and strict HTTPS transport.
4. **Input Sanitization & Injection Defense:** Parameterized SQL queries and sanitized user inputs across all interactive playground routes.

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Zainrao9246/CodeSage-Academy.git

# Install dependencies
npm install

# Start development server
npm run dev
