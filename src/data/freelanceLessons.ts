// Freelance & Clients Module — 8 lessons (same schema as networking)
import type { NetworkingLesson } from './networkingLessons';

export type FreelanceLesson = NetworkingLesson;

export const FREELANCE_LESSONS: FreelanceLesson[] = [
  {
    id: 'free-1', module: 'Module 1: Freelance & Clients', order: 1,
    title: 'Find Your Niche', icon: '🎯',
    philosophy: 'A generalist competes with millions. A specialist competes with hundreds. Picking a niche makes you the obvious choice for a specific buyer instead of a "maybe" for everyone.',
    concepts: [
      { title: '1. Skill × Industry', beginner: 'A niche = what you do + who you do it for. E.g. "Webflow sites for dentists".', advanced: 'Stack two narrow vectors: rare skill (e.g. 3D landing pages) × specific market (SaaS founders). Less competition, higher rates.' },
      { title: '2. Demand vs Passion', beginner: 'Pick something people pay for. Passion alone won\'t pay rent.', advanced: 'Validate: search Upwork/Fiverr — if there are zero gigs in your niche, it doesn\'t exist as a market. If there are 10,000, it\'s saturated.' },
      { title: '3. Positioning Statement', beginner: 'One sentence: "I help X do Y so they can Z."', advanced: 'Test it with 5 strangers in 10 seconds. If they don\'t instantly get what you do or who it\'s for, refine.' },
      { title: '4. Iteration', beginner: 'Your first niche won\'t be perfect — change it as you learn.', advanced: 'Quarterly review: which clients paid most + were easiest? Lean harder into that profile.' },
    ],
    practical: {
      title: 'Niche Discovery Worksheet',
      intro: 'Spend 20 minutes writing answers to these prompts.',
      steps: [
        'List 5 skills you can do better than 80% of people.',
        'List 5 industries you actually understand (worked in, family/friends in, hobbies).',
        'Cross-multiply: pick the most interesting skill × industry pair.',
        'Write: "I help [industry person] [solve specific problem] using [skill]."',
        'Send your sentence to 3 friends and ask if it\'s clear.',
      ],
      goal: 'You walk away with one clear positioning sentence.',
    },
    quiz: [
      { question: 'Best freelance niche formula?', options: ['Just pick what you love','Skill × specific audience','Whatever pays most this week','A new niche every month'], correctIndex: 1 },
      { question: 'How do you validate demand?', options: ['Ask your mom','Search Upwork/Fiverr for similar gigs','Pick the rarest skill','Build first, ask later'], correctIndex: 1 },
      { question: 'A good positioning sentence is:', options: ['Long and detailed','Vague to attract many clients','Clear in under 10 seconds','In Latin so it sounds smart'], correctIndex: 2 },
      { question: 'When should you refine your niche?', options: ['Never','As you learn what clients pay/are easy','Only after 5 years','Only if you\'re losing money'], correctIndex: 1 },
    ],
    keyTakeaways: ['Specialists beat generalists','Niche = skill × audience','Validate with real marketplaces','Refine quarterly'],
  },
  {
    id: 'free-2', module: 'Module 1: Freelance & Clients', order: 2,
    title: 'Portfolio That Sells', icon: '🎨',
    philosophy: 'Clients buy proof, not promises. Your portfolio is the only thing standing between "interested" and "hired" — it has to do the selling for you while you sleep.',
    concepts: [
      { title: '1. Case Studies > Screenshots', beginner: 'Don\'t just show the result. Show the problem, your process, and the outcome.', advanced: 'Structure: Problem → Approach → Solution → Metrics. Quantify ("loaded 3× faster", "+27% signups").' },
      { title: '2. Three Strong > Ten Weak', beginner: 'Quality kills quantity. Cut weak projects.', advanced: 'Recency matters too — clients trust work from the last 12 months. Replace old pieces aggressively.' },
      { title: '3. Spec Work', beginner: 'No clients yet? Redesign real brands as fake projects.', advanced: 'Pick recognizable companies → present as "concept" — shows skill without lying about clients.' },
      { title: '4. The First Fold', beginner: 'Your hero should say what you do + show your best work above the scroll.', advanced: 'Heatmaps show 80% of visitors never scroll. Lead with your strongest piece + clear CTA.' },
    ],
    practical: {
      title: 'Portfolio Audit',
      intro: 'Open your current portfolio (or competitor\'s) and score it.',
      steps: [
        'In 5 seconds — can a stranger tell what you do and who for?',
        'Count case studies that include problem + outcome metrics.',
        'Are all projects from the last 18 months?',
        'Is there one clear CTA (book a call, email, hire) above the fold?',
        'Remove the weakest 30% of work today.',
      ],
      goal: 'Three killer case studies with measurable results.',
    },
    quiz: [
      { question: 'Better portfolio approach?', options: ['10 mediocre screenshots','3 detailed case studies with results','Just a contact form','A wall of logos'], correctIndex: 1 },
      { question: 'No real clients yet — what now?', options: ['Wait','Create spec/concept work for real brands','Lie about clients','Skip portfolio'], correctIndex: 1 },
      { question: 'How old should portfolio pieces be?', options: ['Anything goes','Mostly < 18 months','Older = more experience','Doesn\'t matter'], correctIndex: 1 },
      { question: 'The first fold should:', options: ['Be a long bio','Show best work + clear positioning','List every skill','Hide the CTA'], correctIndex: 1 },
    ],
    keyTakeaways: ['Case studies > screenshots','Quality > quantity','Spec work counts','Lead with strongest piece'],
  },
  {
    id: 'free-3', module: 'Module 1: Freelance & Clients', order: 3,
    title: 'Personal Branding', icon: '💡',
    philosophy: 'Your brand is what people say about you when you\'re not in the room. Build it deliberately or have one made for you by accident.',
    concepts: [
      { title: '1. Pick One Voice', beginner: 'Same tone everywhere — site, Twitter, email, invoice.', advanced: 'Consistency builds recall. Inconsistent brands feel scammy and forgettable.' },
      { title: '2. Visual Identity', beginner: 'Logo + 2 colors + 1 font. That\'s a brand kit.', advanced: 'Lock a system: 60/30/10 color rule, type pairing, spacing scale. Reuse everywhere.' },
      { title: '3. Show Up Publicly', beginner: 'Post your work, write about it, share lessons.', advanced: 'Pick ONE platform you\'ll post to weekly for a year. Owning one beats dabbling on five.' },
      { title: '4. Be a Person', beginner: 'Use your real photo, real name, real opinions.', advanced: 'Faceless brands struggle to charge premium. People hire people they trust.' },
    ],
    practical: {
      title: 'Brand Kit in 60 Minutes',
      intro: 'Open Figma/Canva.',
      steps: [
        'Pick a primary color + one accent.',
        'Pick a heading font + body font (Google Fonts).',
        'Write a 1-line bio: "[Role] for [audience]".',
        'Create a 1080×1080 profile image template.',
        'Apply it to your LinkedIn, Twitter/X, GitHub.',
      ],
      goal: 'Cohesive look across every public surface.',
    },
    quiz: [
      { question: 'Brand consistency means:', options: ['Same logo everywhere','Same voice, visuals, tone across all touchpoints','Posting every day','Hiring a designer'], correctIndex: 1 },
      { question: 'Best platform strategy?', options: ['Be everywhere','Pick one and own it for a year','Only LinkedIn','Only TikTok'], correctIndex: 1 },
      { question: 'Why show your real face?', options: ['SEO','People hire people they trust','Required by law','Looks professional'], correctIndex: 1 },
      { question: 'Minimum brand kit:', options: ['Logo + 50 colors','Logo, 2 colors, 1-2 fonts','Just a name','Mood board only'], correctIndex: 1 },
    ],
    keyTakeaways: ['One consistent voice','Lock visual system','Pick one channel','Be a person, not a logo'],
  },
  {
    id: 'free-4', module: 'Module 1: Freelance & Clients', order: 4,
    title: 'Platforms & Marketplaces', icon: '🌐',
    philosophy: 'Upwork, Fiverr, Toptal, Contra — each platform has a personality. Match your offer to the right one and you fish where the fish actually are.',
    concepts: [
      { title: '1. Upwork — Volume', beginner: 'Bid on jobs. Lots of clients, lots of competition.', advanced: 'Win early with low rates + great reviews → raise prices. Apply within 1 hour for best response.' },
      { title: '2. Fiverr — Productized', beginner: 'Sell packaged "gigs" with fixed prices.', advanced: 'Three-tier pricing (Basic/Standard/Premium) works best. Premium tier anchors perceived value.' },
      { title: '3. Toptal / Contra — Curated', beginner: 'Higher quality, higher fees, harder to get in.', advanced: 'Toptal screens hard but pays $80–$200/hr. Worth the application grind for senior devs.' },
      { title: '4. LinkedIn — Inbound', beginner: 'Post content. Clients come to you.', advanced: 'Treat your profile like a landing page. Featured section = portfolio. Headline = positioning.' },
    ],
    practical: {
      title: 'Pick Your Platform',
      intro: 'Don\'t spread thin. Pick one to start.',
      steps: [
        'Junior + need volume → Upwork or Fiverr.',
        'Productized service (logo, audit, review) → Fiverr.',
        'Senior + want premium → Toptal or Contra.',
        'Long-term + content → LinkedIn / Twitter.',
        'Create profile on chosen platform today.',
      ],
      goal: 'One platform set up properly beats five half-done.',
    },
    quiz: [
      { question: 'Best for volume + early reviews?', options: ['Toptal','Upwork','Contra','LinkedIn'], correctIndex: 1 },
      { question: 'Fiverr works best for:', options: ['Hourly contracts','Productized fixed-price gigs','Long-term retainers','Networking'], correctIndex: 1 },
      { question: 'Toptal\'s main draw?', options: ['Easy entry','High rates + vetted clients','Free','No fees'], correctIndex: 1 },
      { question: 'LinkedIn freelance strategy?', options: ['Spam DMs','Post content, optimize profile, inbound leads','Pay for ads only','Avoid it'], correctIndex: 1 },
    ],
    keyTakeaways: ['Match offer to platform','Start narrow, expand later','Reviews compound','Inbound > outbound long-term'],
  },
  {
    id: 'free-5', module: 'Module 1: Freelance & Clients', order: 5,
    title: 'Outreach That Works', icon: '📧',
    philosophy: 'Cold outreach isn\'t spam if it\'s researched and relevant. The difference between "ignored" and "hired" is 90 seconds of research per message.',
    concepts: [
      { title: '1. Personalize First Line', beginner: 'Reference something specific about them in line 1.', advanced: 'Generic openers ("Hope you\'re well!") get deleted. "Saw your new pricing page launched Tuesday — the hero looks crisp" gets a reply.' },
      { title: '2. Lead With Value', beginner: 'Point out a problem AND a quick fix before asking for anything.', advanced: 'The "audit hook": "Noticed your checkout has 4 form fields where 2 would convert better. Made a 90-sec Loom — want it?"' },
      { title: '3. Short Asks', beginner: 'Don\'t ask for a 30-min call. Ask for a yes/no.', advanced: 'CTA hierarchy: Reply > Click > Schedule > Buy. Always optimize for the easiest next step.' },
      { title: '4. Follow Up', beginner: '80% of replies come after the 2nd message.', advanced: '3-touch sequence: Day 0, Day 4, Day 10. After that, walk away gracefully.' },
    ],
    practical: {
      title: 'Send 5 Researched Pitches',
      intro: 'No templates. Real research.',
      steps: [
        'Find 5 companies in your niche that visibly need your skill.',
        'Spend 5 min on each site — note one specific issue you can improve.',
        'Write a 4-sentence email: hook (their thing), problem, free value, soft CTA.',
        'Send today. Schedule follow-ups for day 4 and day 10.',
        'Track response rate. Iterate the hook.',
      ],
      goal: 'A repeatable, sustainable outreach habit.',
    },
    quiz: [
      { question: 'Best cold email opener?', options: ['"Hope you\'re well!"','Specific reference to their recent work','"Quick question?"','Long bio about yourself'], correctIndex: 1 },
      { question: 'Best CTA in a cold email?', options: ['"Book a 30-min discovery call"','A simple yes/no question','Send a contract','Three different links'], correctIndex: 1 },
      { question: 'When do most replies arrive?', options: ['First message','After 2nd-3rd follow-up','Never','Random'], correctIndex: 1 },
      { question: 'Audit hook means:', offer: '','options': ['Free audit before asking for money','A scam','Required by law','Fancy term for resume'], correctIndex: 0 } as any,
    ],
    keyTakeaways: ['Research > volume','Lead with value','Easiest next step wins','Follow up 2-3 times'],
  },
  {
    id: 'free-6', module: 'Module 1: Freelance & Clients', order: 6,
    title: 'Pricing & Rates', icon: '💰',
    philosophy: 'Most freelancers underprice because they\'re scared. Clients judge price as a signal of quality — too cheap looks suspicious, not generous.',
    concepts: [
      { title: '1. Value-Based > Hourly', beginner: 'Charge based on outcome value, not time.', advanced: 'A $5k landing page that brings $50k in revenue = bargain. Same page billed at $50/hr × 100hrs feels expensive.' },
      { title: '2. The 3× Rule', beginner: 'Charge 3× what an employee would cost the client.', advanced: 'Why? You cover your own taxes, benefits, tools, downtime, sales. 3× is the floor, not ceiling.' },
      { title: '3. Anchor High', beginner: 'Quote the premium option first.', advanced: 'Three-tier proposal: anchor / target / cheap. 60% pick the middle. Without the anchor, they pick the cheap.' },
      { title: '4. Raise Yearly', beginner: 'Increase rates 15–25% per year for new clients.', advanced: 'Existing clients: give 60 days notice. Lose the bottom 20% on purpose to make room for better ones.' },
    ],
    practical: {
      title: 'Build a 3-Tier Quote',
      intro: 'Pick your next project type.',
      steps: [
        'Define a typical "small" project for your niche.',
        'Price the basic version (what you\'d normally quote).',
        'Add a "standard" 1.8× tier with one extra deliverable.',
        'Add a "premium" 3× tier with white-glove extras.',
        'Use this template on your next 3 quotes.',
      ],
      goal: 'Stop pricing in a vacuum.',
    },
    quiz: [
      { question: 'Best pricing model long-term?', options: ['$/hour','Value-based fixed price','Per word','Free + tips'], correctIndex: 1 },
      { question: '3× rule means:', options: ['Charge 3× the freelancer next to you','Charge 3× what an employee would cost','Triple every year','3 free revisions'], correctIndex: 1 },
      { question: 'In 3-tier pricing, most pick:', options: ['Cheapest','Middle','Most expensive','Random'], correctIndex: 1 },
      { question: 'How often raise rates?', options: ['Never','Yearly 15-25% for new clients','Monthly','Only if asked'], correctIndex: 1 },
    ],
    keyTakeaways: ['Value > hourly','Use the 3× rule as a floor','Anchor with a high tier','Raise rates yearly'],
  },
  {
    id: 'free-7', module: 'Module 1: Freelance & Clients', order: 7,
    title: 'Contracts & Scope', icon: '📃',
    philosophy: 'A contract is a forecast of conflict written down before there is any. No contract = guaranteed disagreement. Bad contract = expensive lawyer.',
    concepts: [
      { title: '1. Scope of Work', beginner: 'List exactly what\'s included AND what\'s not.', advanced: 'Use bullet points. "Out of Scope" section is more important than the inclusions — it prevents scope creep.' },
      { title: '2. Milestones & Payment', beginner: 'Break payment into 3 chunks: deposit, midpoint, delivery.', advanced: '50/25/25 or 33/33/34. Never start work without deposit cleared. Each milestone has its own deliverable.' },
      { title: '3. Revisions', beginner: 'Cap revisions: e.g. 2 rounds included, extra at $X.', advanced: 'Define "revision" specifically — "minor copy/color tweaks" vs "redesign". Vague = abuse.' },
      { title: '4. IP & Kill Fee', beginner: 'IP transfers ONLY after final payment.', advanced: 'Kill fee = 30-50% if client cancels mid-project. Covers your time + opportunity cost.' },
    ],
    practical: {
      title: 'Build Your Contract Template',
      intro: 'Use Bonsai, Contract.io, or a free template from "Stuff & Nonsense" by Andy Clarke.',
      steps: [
        'Add a Scope section with bullet list of deliverables.',
        'Add "Out of Scope" with explicit exclusions.',
        'Add payment milestones (50/25/25).',
        'Cap revisions at 2 with extra-round pricing.',
        'Add kill fee + IP transfer on final payment clauses.',
      ],
      goal: 'A reusable contract you send in under 5 minutes.',
    },
    quiz: [
      { question: 'Most important contract section?', options: ['Inclusions','Out of Scope exclusions','Signature','Date'], correctIndex: 1 },
      { question: 'Standard milestone payment split?', options: ['100% upfront','50/25/25','100% at end','Pay-as-you-go'], correctIndex: 1 },
      { question: 'When should IP transfer?', options: ['Day 1','After deposit','After final payment','Never'], correctIndex: 2 },
      { question: 'Kill fee covers:', options: ['Free lunches','Your time + opportunity cost if client cancels','Bug fixes','Server costs'], correctIndex: 1 },
    ],
    keyTakeaways: ['No contract = guaranteed conflict','Out-of-scope > scope','Milestone payments','IP after final payment'],
  },
  {
    id: 'free-8', module: 'Module 1: Freelance & Clients', order: 8,
    title: 'Project Management & Clients', icon: '🤝',
    philosophy: 'Most freelancers don\'t lose clients because of bad work — they lose them because of bad communication. Be the calmest, clearest person in the project and you\'ll never run out of referrals.',
    concepts: [
      { title: '1. Weekly Update Ritual', beginner: 'Every Friday, send a 5-line status email.', advanced: 'Format: Done this week / Doing next week / Blocked by you. Clients sleep better. You get fewer "any updates?" pings.' },
      { title: '2. One Source of Truth', beginner: 'Pick one tool (Notion, Linear, Trello) and use only it.', advanced: 'Mixing email + Slack + WhatsApp + Figma comments = chaos. Funnel everything into one async board.' },
      { title: '3. Set Boundaries', beginner: 'Have working hours. Reply windows: 24h business.', advanced: 'Put it in the contract. Premium tier = faster response. Don\'t train clients to expect midnight Slacks.' },
      { title: '4. Ask for Referrals', beginner: 'After delivering great work, ask "Know anyone else who could use this?"', advanced: '80% of referrals come from asking. Send the request 1 week after final payment, while satisfaction is high.' },
    ],
    practical: {
      title: 'Set Up Your Operations Stack',
      intro: 'You only need 3 tools.',
      steps: [
        'Pick a project tool (Notion or Linear).',
        'Pick a communication tool (Slack Connect or email only).',
        'Pick an invoicing tool (Stripe, Wise, or Bonsai).',
        'Write a 5-line Friday update template.',
        'Add a "Referrals" line to your final invoice/email.',
      ],
      goal: 'You spend < 30 min/week on admin.',
    },
    quiz: [
      { question: 'Why send weekly status emails?', options: ['Bills time','Reduces client anxiety + pings','Required by law','Earns SEO'], correctIndex: 1 },
      { question: 'Best comms strategy?', options: ['One source of truth','Reply on every channel','Slack + WhatsApp + email + SMS','No comms'], correctIndex: 0 },
      { question: 'When to ask for referrals?', options: ['Never','~1 week after delivery, while satisfaction is high','Before starting','Years later'], correctIndex: 1 },
      { question: 'Boundaries should be:', options: ['Implicit','Stated upfront + in contract','Negotiated daily','Skipped'], correctIndex: 1 },
    ],
    keyTakeaways: ['Weekly status = fewer pings','One source of truth','Boundaries upfront','Always ask for referrals'],
  },
];

export const getFreelanceLessonById = (id: string): FreelanceLesson | undefined =>
  FREELANCE_LESSONS.find(l => l.id === id);

export const isFreelanceLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = FREELANCE_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(FREELANCE_LESSONS[idx - 1].id);
};
