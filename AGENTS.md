# Architecture rules
- Centralize lesson-start sponsor timing at the router boundary; route changes must never interrupt an already-open lesson.
- Use Monetag SmartLinks only as explicit external links, not automatically loaded frames or simulated video impressions; the integration has no verified impression/reward API.
- Store ad frequency caps locally with in-memory fallback; ad timing is non-sensitive UI state and must not generate database requests.