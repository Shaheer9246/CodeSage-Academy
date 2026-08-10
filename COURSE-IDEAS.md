# CodeSage Academy — Paid Course Roadmap & Sustainability Notes

Two parts: (A) how to keep backend usage tiny so the free platform stays free, (B) a large catalogue of premium course ideas that are genuinely hard to find free and in depth.

---

## A. Using less backend

The app currently stores only user state — that is already the right architecture. To keep it that way:

1. **Never move lesson, challenge or exam content into the database.** Static TS files are free, cached by the CDN, and cost zero rows.
2. **One profile read per session.** `UserContext` should hydrate once and keep state in memory; pages read from context, not from new queries.
3. **Batch writes.** Lesson completion already does one RPC call that updates XP, coins, level, badges and the lesson array together — keep that pattern for anything new.
4. **Avoid realtime everywhere except Suggestions.** Realtime channels hold open connections; a manual refresh button is enough for inbox/announcements.
5. **Keep the local caches** (`enroll_cache`, `count_cache`) — they remove a query on every dashboard render.
6. **No file storage.** Ship images/icons as bundled assets instead of storage buckets; storage and egress are the first things to blow up a free tier.
7. **Prune periodically.** Old `announcement_reads` and `suggestion_reads` rows can be deleted after a few months.
8. **Watch row growth, not table count.** 1000 students ≈ 1000 profile rows + a few thousand enrollment rows — a few megabytes. The free tier realistically supports tens of thousands of students at this design.

---

## B. Premium course catalogue

Grouped by pillar. Each is a paid-tier candidate: deep, project-based, and not available free in a coherent form.

### AI — build real systems

1. **Build Your Own Jarvis with Python** — wake word, speech-to-text, LLM brain, text-to-speech, desktop control, memory.
2. **AI Agents from Scratch** — planning loops, tool calling, self-correction, multi-agent handoff, no framework magic.
3. **Production RAG Engineering** — chunking strategies, embeddings, hybrid search, re-ranking, evaluation, hallucination control.
4. **Fine-Tuning LLMs on Your Own Data** — dataset curation, LoRA/QLoRA, evaluation harness, deployment.
5. **Run LLMs Locally** — quantisation, llama.cpp/Ollama, GPU vs CPU, private offline assistants.
6. **AI Voice Products** — real-time speech pipelines, interruption handling, phone/voice agents.
7. **Computer Vision Projects** — detection, tracking, OCR pipelines, real deployment on cheap hardware.
8. **AI for Automation** — document extraction, email triage, scraping + reasoning workflows that businesses pay for.
9. **LLM App Security** — prompt injection, jailbreaks, data exfiltration, guardrails and red-teaming.
10. **Ship & Monetise an AI SaaS** — auth, billing, rate limits, cost control, from repo to paying users.

### Cybersecurity

11. **Ethical Hacking Fundamentals** — recon, scanning, exploitation, reporting, legal boundaries.
12. **Web App Penetration Testing** — OWASP Top 10 hands-on with a deliberately vulnerable lab.
13. **Network Attack & Defence** — packet analysis, MITM, firewall/IDS rules, hardening.
14. **Linux Hardening & Server Security** — SSH, permissions, SELinux/AppArmor, auditing, backups.
15. **Malware Analysis Basics** — static/dynamic analysis in a safe sandbox.
16. **Digital Forensics & Incident Response** — disk/memory artefacts, timelines, incident reports.
17. **Bug Bounty Playbook** — recon automation, finding real bugs, writing reports that get paid.
18. **Cryptography for Developers** — hashing, symmetric/asymmetric, TLS, key management done right.
19. **Cloud Security** — IAM, secrets, least privilege, misconfiguration hunting.
20. **Secure Coding** — how vulnerabilities enter code, and how to review for them.

### Systems & performance

21. **C++ for High-Performance Systems** — memory, cache, profiling, concurrency (paid continuation of the free C++ track).
22. **Data Structures & Algorithms for Interviews** — patterns, complexity, 150 curated problems.
23. **Operating Systems by Building One** — bootloader, scheduler, memory manager in miniature.
24. **Compilers & Interpreters** — build your own language, from lexer to VM.
25. **Rust for Backend Engineers** — ownership, async, real services.
26. **Concurrency & Parallelism** — threads, async, locks, lock-free, real benchmarks.
27. **Game Development Foundations** — game loop, physics, rendering pipeline.

### Backend, data & infrastructure

28. **Backend Architecture at Scale** — caching, queues, sharding, idempotency, failure modes.
29. **Database Internals** — indexes, query planning, transactions, why your query is slow.
30. **DevOps for Solo Developers** — Docker, CI/CD, monitoring, cheap hosting that survives traffic.
31. **Kubernetes without the Fear** — from container to production cluster.
32. **Data Engineering Pipelines** — ingestion, transformation, warehousing, scheduling.
33. **Real-Time Systems** — websockets, presence, conflict resolution, offline sync.
34. **API Design Mastery** — REST vs GraphQL vs RPC, versioning, auth, rate limits, docs.
35. **Testing & Reliability** — unit → integration → e2e, flaky test triage, error budgets.

### Career & business

36. **Freelance to Agency** — pricing, contracts, subcontracting, retainers.
37. **Build & Sell Micro-SaaS** — idea validation, MVP in weeks, first 100 customers.
38. **Technical Interview Mastery** — system design, behavioural, negotiation.
39. **Developer Personal Brand** — portfolio, writing, open source, inbound clients.
40. **Sell AI Services to Local Businesses** — offer design, demos, pricing, delivery.

### Suggested rollout order

Start with the ones that need no new runtime and convert best: **Build Your Own Jarvis**, **Ethical Hacking Fundamentals**, **Production RAG**, **DSA for Interviews**, **Micro-SaaS**. Each pairs naturally with a free track you already have (Python → Jarvis, Networking → Ethical Hacking, AI Fundamentals → RAG, C++/Java → DSA, Freelance → Micro-SaaS), so free students have an obvious next step to buy.
