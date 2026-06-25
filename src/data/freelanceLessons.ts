// Freelance & Clients Module — 12 lessons (same schema as networking)
import type { NetworkingLesson } from './networkingLessons';

export type FreelanceLesson = NetworkingLesson;

export const FREELANCE_LESSONS: FreelanceLesson[] = [
  {
    id: 'free-1',
    module: 'Module 1: Freelance & Clients',
    order: 1,
    title: 'Find Your Niche',
    icon: '🎯',
    philosophy: 'Choosing a niche is your Character Class selection. A generalist is a level 1 peasant competing with millions for scrap gold. A specialist is a High-Tier Hero who commands premium bounties because they are the only ones capable of beating a specific boss.',
    concepts: [
      {
        title: '1. Skill × Industry',
        beginner: 'Your Class Build. A niche is your weapon multiplied by your hunting ground. Instead of a generic dev, you become "The Webflow Expert for Orthodontists."',
        advanced: 'Stack two rare vectors: a specialized mechanism (e.g., 3D/WebGL landing pages) × a high-revenue industry (e.g., AI Dev Tools). It slashes your competition to zero.',
      },
      {
        title: '2. Demand vs Passion',
        beginner: 'Gold Over Glory. Chasing passion blindly drains your health points (cash). Target zones where clients already have deep gold reserves and massive problems.',
        advanced: 'Run a Recon Mission on active job boards. If there are zero gigs, the market doesn\'t exist. If there are 10,000 low-tier gigs, it\'s a crowded starting zone. Look for premium problem patterns.',
      },
      {
        title: '3. Positioning Statement',
        beginner: 'Your Player Card slogan: "I help [Industry] achieve [Result] using [My Custom Skill Vector]."',
        advanced: 'Test your slogan on 5 network contacts. If they cannot instantly explain what high-value problem you solve within 5 seconds, your positioning is dropping aggro.',
      },
      {
        title: '4. Iteration',
        beginner: 'Your starter build isn\'t permanent. You will respec your character points as you gain experience.',
        advanced: 'Run a quarterly loot review. Analyze which clients paid the highest rewards with the lowest stress, then aggressively optimize your positioning toward that specific profile.',
      },
    ],
    practical: {
      title: 'Niche Discovery Worksheet',
      intro: 'Spend 20 minutes calculating your optimized character class build.',
      steps: [
        'List 5 high-value skills you can execute better than 80% of casual users.',
        'List 5 industries or domains you actually understand (hobbies, past jobs, family businesses).',
        'Cross-multiply: pick the absolute sharpest skill × industry pair.',
        'Craft your positioning spell: "I help [industry person] [solve specific crisis] using [skill]."',
        'Cast this sentence at 3 peers and verify if its value is instantly crystal clear.',
      ],
      goal: 'Walk away with one unshakeable, hyper-targeted positioning statement.',
    },
    quiz: [
      {
        question: 'What is the ultimate freelance niche formula for commanding high premiums?',
        options: ['Pick whatever topic you find relaxing', 'Multiply a sharp skill by a specific target audience', 'Bid on random assignments every single week', 'Change your target market every 15 days'],
        correctIndex: 1,
      },
      {
        question: 'How do you run a recon mission to validate market demand?',
        options: ['Ask family members if it sounds cool', 'Analyze active digital marketplaces for existing high-tier gigs', 'Pick the rarest, most un-vetted skill possible', 'Build the final product first before talking to buyers'],
        correctIndex: 1,
      },
      {
        question: 'What makes an elite positioning statement successful?',
        options: ['It is incredibly long and filled with text', 'It remains vague to try and catch every single client type', 'A user can grasp your specific value in under 5 seconds', 'It uses confusing academic phrasing to sound advanced'],
        correctIndex: 2,
      },
      {
        question: 'When is the best time to respec or refine your niche?',
        options: ['Absolutely never change your trajectory', 'Regularly as you discover which clients yield high returns and low stress', 'Only after working straight for a full decade', 'Only when your bank balance hits exactly zero'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Specialists dominate generalists every single time.',
      'Niche = unique mechanism × specific target audience.',
      'Always validate your hunting ground before farming it.',
      'Review client profiles quarterly to optimize your build.',
    ],
  },
  {
    id: 'free-2',
    module: 'Module 1: Freelance & Clients',
    order: 2,
    title: 'Portfolio That Sells',
    icon: '🎨',
    philosophy: 'Clients don\'t buy empty promises; they buy verified loot logs. Your portfolio is your automated merchant shop—it must display your highest-quality items and do the heavy selling for you while you are completely offline.',
    concepts: [
      {
        title: '1. Case Studies > Screenshots',
        beginner: 'Don\'t just display raw imagery. Show the initial quest prompt, your custom execution path, and the final boss defeat metrics.',
        advanced: 'Deploy a strict 4-tier layout: Crisis → Battle Plan → Execution → Business ROI. Always quantify results ("boosted conversion velocity by 32%").',
      },
      {
        title: '2. Three Strong > Ten Weak',
        beginner: 'Your inventory loadout must be top-tier. Discard weak, filler side-projects that dilute your profile value.',
        advanced: 'Recency determines authority. Clients discount achievements older than 12-18 months. Replace aging inventory items with premium case studies aggressively.',
      },
      {
        title: '3. Spec Work',
        beginner: 'Zero active quests? Invent mock campaigns. Re-engineer real-world apps to prove your build works.',
        advanced: 'Target highly recognizable systems, isolate a critical flaw, and publish your redesign as a "Concept Campaign." It displays expert skill without fabricated claims.',
      },
      {
        title: '4. The First Fold',
        beginner: 'Your landing page hero zone must state exactly what you build and showcase your top tier piece instantly.',
        advanced: 'User telemetry shows 80% of traffic never travels below the fold. Anchor your primary case study and main Action Button directly in the initial viewport.',
      },
    ],
    practical: {
      title: 'Portfolio Audit',
      intro: 'Analyze your active portfolio site (or a top competitor) and score its battle-readiness.',
      steps: [
        'Open the site: Can a stranger identify your target class and audience within 5 seconds?',
        'Audit your projects: How many feature clear metrics instead of raw images?',
        'Verify dates: Are all displayed case studies completed within the last 18 months?',
        'Check actions: Is there a single, prominent call-to-action button visible without scrolling?',
        'Purge the system: Delete or archive the bottom 30% of your weakest items today.',
      ],
      goal: 'Streamline your portfolio down to a tight setup of ultra-high-impact case studies.',
    },
    quiz: [
      {
        question: 'Which strategy constructs a high-converting freelance developer portfolio?',
        options: ['Displaying a massive wall of 15 un-contextualized screenshots', 'Publishing 3 detailed case studies tracking real business outcomes', 'Using a completely empty landing page with just an email link', 'Hiding all work behind a complex, multi-step password screen'],
        correctIndex: 1,
      },
      {
        question: 'What is the best play if your quest log is empty and you have no real clients yet?',
        options: ['Wait quietly until a lead magically discovers you', 'Build advanced "Spec/Concept" work for existing recognizable brands', 'Invent completely fake client companies and metrics', 'Skip building a portfolio altogether and rely on luck'],
        correctIndex: 1,
      },
      {
        question: 'How should a professional developer treat old portfolio pieces?',
        options: ['Keep every single item since day one to show volume', 'Prioritize modern work under 18 months old to maintain high trust', 'Delete everything and only show a brief text resume', 'Rotate items randomly every single morning'],
        correctIndex: 1,
      },
      {
        question: 'What rule governs the top layout (above the fold) of your portfolio site?',
        options: ['It should be filled entirely by a long, deep personal biography', 'It must clearly frame your positioning and pin your strongest work', 'It should list every framework and programming language in alphabetical order', 'It should keep your primary contact button hidden to build mystery'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Comprehensive case studies beat simple static screenshots.',
      'Inventory quality always trumps raw asset volume.',
      'Spec campaigns are a legitimate method to demonstrate raw skill.',
      'Hook user attention completely before they ever scroll your page.',
    ],
  },
  
  {
    id: 'free-3',
    module: 'Module 1: Freelance & Clients',
    order: 3,
    title: 'Personal Branding',
    icon: '💡',
    philosophy: 'Your brand is your Global Server Reputation. It is what other players whisper about your skills when you aren\'t in the room. Build it deliberately or let the market define it for you by default.',
    concepts: [
      {
        title: '1. Pick One Voice',
        beginner: 'Maintain a single, cohesive signature across all outputs—your site, communication channels, and invoices.',
        advanced: 'Consistency builds brand recall. Fragments in your messaging trigger security alerts in a buyer\'s mind, making your business look unverified.',
      },
      {
        title: '2. Visual Identity',
        beginner: 'Lock down your starter visual pack: 1 clean emblem, 2 signature colors, and 1 core typography standard.',
        advanced: 'Enforce a strict layout math: use a 60/30/10 color distribution rule and a permanent spacing scale across all public touchpoints.',
      },
      {
        title: '3. Show Up Publicly',
        beginner: 'Broadcast your development journey. Share active code challenges, logs, and technical lessons learned.',
        advanced: 'Isolate ONE primary public channel (e.g., LinkedIn or X) and publish high-value logs weekly for a year. Maxing out one node beats stalling out on five.',
      },
      {
        title: '4. Be a Person',
        beginner: 'Use a high-quality personal portrait and your actual name. People form contracts with people, not abstract shapes.',
        advanced: 'Faceless entities encounter extreme friction when charging high-tier prices. Transparency eliminates buyer anxiety and accelerates deal closure.',
      },
    ],
    practical: {
      title: 'Brand Kit in 60 Minutes',
      intro: 'Initialize your public visual identity inside an editor workspace.',
      steps: [
        'Select one commanding primary color and one high-contrast accent color.',
        'Choose a modern heading font paired clean with a highly readable body font.',
        'Refine your 1-line bio formula: "[Specialized Role] assisting [Target Audience]."',
        'Render a clean, high-resolution personal profile template.',
        'Synchronize this updated identity asset pack across your LinkedIn, GitHub, and X profiles.',
      ],
      goal: 'Deploy a completely unified, professional aesthetic across all public channels.',
    },
    quiz: [
      {
        question: 'What does true brand consistency across your freelance operation achieve?',
        options: ['It ensures your logo takes up half the screen real estate', 'It aligns your voice, visuals, and style to build high consumer trust', 'It guarantees you will post updates every single hour without fail', 'It forces you to hire an incredibly expensive branding consultant'],
        correctIndex: 1,
      },
      {
        question: 'What is the most effective channel strategy for an independent developer?',
        options: ['Create empty profiles on every single social network in existence', 'Dominate one clear, highly-targeted hub consistently for an extended period', 'Only post technical code updates to personal developer forums', 'Completely avoid social channels and only run paid search marketing'],
        correctIndex: 1,
      },
      {
        question: 'Why is displaying an authentic, clear personal portrait considered a security buff?',
        options: ['It directly signals optimization to modern search engine web scrapers', 'High-value buyers complete contracts with real people they trust', 'It is an absolute legal mandate for global independent operators', 'It decreases the total processing footprint of your application hosting'],
        correctIndex: 1,
      },
      {
        question: 'What components construct a baseline functional business brand kit?',
        options: ['A corporate statement accompanied by fifty variant accent swatches', 'A primary emblem, two calibrated colors, and a matching type scale', 'Just a simple font styling with an unformatted business title', 'A complex mood board lacking concrete color or layout variables'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'A singular, polished voice secures superior retention.',
      'Lock your UI visual systems down to prevent style decay.',
      'Consolidate marketing actions onto one highly effective stream.',
      'Human-centric presence commands significantly higher pricing potential.',
    ],
  },
  
 {
    id: 'free-4',
    module: 'Module 1: Freelance & Clients',
    order: 4,
    title: 'Platforms & Marketplaces',
    icon: '🌐',
    philosophy: 'Every marketplace is a different World Zone with its own rules, economy, and boss mobs. If you try to fish for high-tier loot in a low-level starting zone, you will waste your energy. Match your current character level and gear to the right zone.',
    concepts: [
      {
        title: '1. Upwork — Volume',
        beginner: 'The massive public trading hub. Lots of low-level quests and high competition.',
        advanced: 'Win your first reputation shards with low-cost bids to secure high-tier reviews, then aggressively scale your rates. Speed is your stat: apply within 1 hour of a quest drop to win the loot.',
      },
      {
        title: '2. Fiverr — Productized',
        beginner: 'The "Storefront" model. You sell pre-packaged items rather than bidding on custom hourly quests.',
        advanced: 'Deploy the 3-Tier Loot Table (Basic/Standard/Premium). Using a high-value "Premium" tier acts as a psychological anchor, driving buyers toward the more profitable Standard tier.',
      },
      {
        title: '3. Toptal / Contra — Curated',
        beginner: 'The elite VIP guild halls. Much harder to join, but the reward multipliers are significantly higher.',
        advanced: 'Toptal gates access through intense skill-checks but offers $80–$200/hr bounty rates. For senior-class developers, the grueling application grind is a permanent buff to your income ceiling.',
      },
      {
        title: '4. LinkedIn — Inbound',
        beginner: 'The public tavern where clients look for adventurers. Post your work, and let the quests find you.',
        advanced: 'Convert your profile into a high-conversion landing page. Your headline is your title, and your Featured section is your public trophy case. Positioning here creates a constant flow of inbound leads.',
      },
    ],
    practical: {
      title: 'Pick Your Platform',
      intro: 'Don\'t spread your skill points thin. Choose one active zone to conquer first.',
      steps: [
        'Entry-level adventurer needing volume? Claim your spot on Upwork or Fiverr.',
        'Offering repeatable, productized tasks? Set up a storefront on Fiverr.',
        'Senior-level veteran looking for premium bounties? Start the gate-check for Toptal/Contra.',
        'Long-term fame? Build your reputation through consistent posting on LinkedIn.',
        'Execute the registration quest: finalize your profile on your chosen zone today.',
      ],
      goal: 'One perfectly optimized presence in a single zone beats five broken accounts in empty ones.',
    },
    quiz: [
      {
        question: 'Which zone is best for generating high-volume early experience and reviews?',
        options: ['Toptal', 'Upwork', 'Contra', 'LinkedIn'],
        correctIndex: 1,
      },
      {
        question: 'What is the primary mechanic for winning on Fiverr?',
        options: ['Winning hourly contract bids', 'Selling pre-packaged, fixed-price services', 'Maintaining long-term retainers', 'Aggressive manual networking'],
        correctIndex: 1,
      },
      {
        question: 'What is the main reward multiplier for passing the Toptal gate-check?',
        options: ['Instant access to thousands of daily low-effort quests', 'Access to elite, vetted clients paying high hourly bounties', 'Automatic permanent free account status', 'Removal of all platform transaction fees'],
        correctIndex: 1,
      },
      {
        question: 'What is the optimal long-term strategy for your LinkedIn zone?',
        options: ['Spamming unsolicited DMs to random users', 'Posting high-value content and optimizing your profile for inbound leads', 'Investing all your gold into paid reach ads', 'Avoiding the platform entirely to maintain mystery'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Match your character build to the rules of the platform zone.',
      'Start narrow; do not attempt to farm every zone simultaneously.',
      'Reviews are your account’s compounding interest.',
      'Inbound traffic eventually yields higher-tier rewards than active outbound bidding.',
    ],
  },
  
{
    id: 'free-5',
    module: 'Module 1: Freelance & Clients',
    order: 5,
    title: 'Outreach That Works',
    icon: '📧',
    philosophy: 'Cold outreach is not spam—it is a specialized "Diplomatic Mission." Sending mass-produced messages is like shouting at the city gates. The difference between being ignored by the guards and meeting the King is 90 seconds of reconnaissance research.',
    concepts: [
      {
        title: '1. Personalize First Line',
        beginner: 'Your opening greeting is your only chance to bypass the spam filters. Reference one specific detail you discovered about them in your recon.',
        advanced: 'Generic lines like "Hope you\'re well!" trigger immediate auto-delete. A line like "Saw your new feature launch Tuesday—the UX flow is crisp" proves you are a real human, not a bot.',
      },
      {
        title: '2. Lead With Value',
        beginner: 'Do not arrive empty-handed. Point out a tactical problem you identified AND offer a quick, low-stakes fix.',
        advanced: 'Use the "Audit Hook." Example: "Noticed your checkout flow has 4 unnecessary form fields. Recorded a 90-sec Loom video showing how to optimize it—want to see it?"',
      },
      {
        title: '3. Short Asks',
        beginner: 'Do not demand a 30-minute guild meeting. Ask for a simple "Yes/No" response to reduce friction.',
        advanced: 'Optimize for the "CTA Hierarchy": Reply > Click > Schedule > Purchase. Always demand the lowest amount of effort for the next step.',
      },
      {
        title: '4. Follow Up',
        beginner: 'Persistence is a skill. Statistics show that the majority of successful interactions occur after the second contact.',
        advanced: 'Execute a 3-Touch Sequence: Day 0 (Initial), Day 4 (Reminder), Day 10 (Break-up). After the third attempt, disengage gracefully to focus on other high-value targets.',
      },
    ],
    practical: {
      title: 'Send 5 Researched Pitches',
      intro: 'Execute a targeted diplomatic mission with 5 high-value prospects.',
      steps: [
        'Identify 5 entities in your niche zone that show visible need for your specific class-skills.',
        'Spend 5 minutes of recon on each site to identify one critical tactical improvement.',
        'Draft a 4-sentence broadcast: The Hook (relevance), The Problem, The Free Value, and The Soft CTA.',
        'Send your broadcast today and schedule follow-up pings for Day 4 and Day 10.',
        'Log your conversion data and iterate your hook based on response patterns.',
      ],
      goal: 'Establish a repeatable, professional outreach habit that produces a steady stream of leads.',
    },
    quiz: [
      {
        question: 'What is the most effective opener for a high-converting diplomatic outreach?',
        options: ['Generic greetings like "Hope you are doing well!"', 'A highly specific reference to the prospect\'s recent work or achievements', 'Asking "Can I ask you a quick question?" immediately', 'A long, detailed biography explaining your full career history'],
        correctIndex: 1,
      },
      {
        question: 'What is the optimal Call-to-Action (CTA) strategy for a cold message?',
        options: ['Demanding a massive 30-minute discovery call', 'A simple Yes/No question that requires minimal effort', 'Demanding they sign a contract immediately', 'Including three separate, confusing links to different project pages'],
        correctIndex: 1,
      },
      {
        question: 'Statistically, when does the highest volume of positive replies occur?',
        options: ['Within the first message sent', 'After the 2nd or 3rd follow-up contact', 'They never actually respond to cold emails', 'It happens completely at random'],
        correctIndex: 1,
      },
      {
        question: 'What is the tactical purpose of an "Audit Hook"?',
        options: ['Providing free value to build trust before asking for compensation', 'An automated scam strategy used to trick unsuspecting users', 'A legal requirement for all professional email communications', 'Just a fancy, unnecessary term for a standard resume'],
        correctIndex: 0,
      },
    ],
    keyTakeaways: [
      'Precision research always outperforms mass-volume spam.',
      'Always lead by providing tangible value first.',
      'Optimize for the lowest friction "next step" to maximize replies.',
      'Follow up 2-3 times before gracefully walking away.',
    ],
  },
  
{
    id: 'free-6',
    module: 'Module 1: Freelance & Clients',
    order: 6,
    title: 'Pricing & Rates',
    icon: '💰',
    philosophy: 'Novice adventurers underprice out of fear. In the marketplace, price is a signal of item rarity and quality—if your bounty reward is too low, clients will assume your "gear" is broken or your skills are cursed.',
    concepts: [
      {
        title: '1. Value-Based > Hourly',
        beginner: 'Do not trade time for gold. Trade results for gold.',
        advanced: 'A landing page costing $5k that generates $50k in client revenue is a steal. Billed at $50/hr, that same project feels like a massive expense. Always price the outcome, not the clock.',
      },
      {
        title: '2. The 3× Rule',
        beginner: 'Set your base quest reward at 3× what a full-time employee would cost the client.',
        advanced: 'As a freelancer, you bear the costs of taxes, tools, downtime, and marketing. 3× is not your profit margin; it is the absolute floor required to keep your operation solvent.',
      },
      {
        title: '3. Anchor High',
        beginner: 'Always offer your most premium bounty first.',
        advanced: 'Deploy a 3-Tier Proposal (Anchor/Target/Budget). Most clients will choose the middle option. Without the high-tier "Anchor," clients will almost always default to the lowest-value tier.',
      },
      {
        title: '4. Raise Yearly',
        beginner: 'Increase your bounty rates by 15–25% for every new quest-giver.',
        advanced: 'For current clients, provide 60 days notice for rate adjustments. If they refuse, fire them—losing the bottom 20% of your low-paying clients is necessary to make room for high-level ones.',
      },
    ],
    practical: {
      title: 'Build a 3-Tier Quote',
      intro: 'Construct a pricing matrix for your next project.',
      steps: [
        'Define a standard project for your niche.',
        'Set your "Budget" price (what you would normally quote).',
        'Build a "Target" tier (1.8× multiplier) with one extra high-value deliverable.',
        'Build an "Anchor" tier (3× multiplier) with white-glove, premium extras.',
        'Use this 3-tier template on your next 3 proposals.',
      ],
      goal: 'Eliminate "pricing in a vacuum" by using standardized anchor strategies.',
    },
    quiz: [
      {
        question: 'What is the most sustainable long-term pricing model?',
        options: ['Billing by the hour', 'Value-based fixed pricing', 'Charging per word written', 'Working for free in exchange for "exposure"'],
        correctIndex: 1,
      },
      {
        question: 'What is the purpose of the "3× Rule"?',
        options: ['To charge 3 times as much as the freelancer next to you', 'To cover your overhead costs and ensure the business stays solvent', 'To triple your total income every single calendar year', 'To provide the client with 3 rounds of free, infinite revisions'],
        correctIndex: 1,
      },
      {
        question: 'In a 3-tier proposal structure, which tier do most clients select?',
        options: ['The cheapest tier', 'The middle "Target" tier', 'The most expensive "Anchor" tier', 'Clients choose completely at random'],
        correctIndex: 1,
      },
      {
        question: 'What is the optimal strategy for adjusting your rates over time?',
        options: ['Never raise rates to ensure loyalty', 'Increase rates 15-25% annually for new clients', 'Adjust rates on a month-by-month basis', 'Only raise rates if the client specifically asks you to'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Value outcomes far outweigh hourly billing.',
      'Use the 3× rule as the foundation for your pricing floor.',
      'Anchor every proposal with a high-tier option.',
      'Raise rates annually to filter for high-value clients.',
    ],
  },
  
  {
    id: 'free-7',
    module: 'Module 1: Freelance & Clients',
    order: 7,
    title: 'Contracts & Scope',
    icon: '📃',
    philosophy: 'A contract is a "Protection Ward" cast before the battle begins. No contract equals guaranteed discord; a weak contract is just an open door for "Scope Creep" monsters to drain your health points.',
    concepts: [
      {
        title: '1. Scope of Work',
        beginner: 'Explicitly list exactly what is inside the quest log AND what remains outside of it.',
        advanced: 'The "Out of Scope" section is your primary defense. It is more critical than the inclusions because it defines the boundary where "extra work" triggers extra gold.',
      },
      {
        title: '2. Milestones & Payment',
        beginner: 'Split the total gold bounty into three distinct phases: Deposit, Mid-point, and Final Delivery.',
        advanced: 'Adopt the 50/25/25 or 33/33/34 rule. Never initiate a single line of work until the "Deposit" gold has been confirmed. Every milestone requires a tangible deliverable before the next payment triggers.',
      },
      {
        title: '3. Revisions',
        beginner: 'Cap your revision rounds (e.g., 2 rounds included) and set a price for any additional labor.',
        advanced: 'Define "Revision" with extreme precision: distinguish between "minor visual polish" and a "full system redesign." Vague definitions are exploited by rogue clients to demand infinite labor.',
      },
      {
        title: '4. IP & Kill Fee',
        beginner: 'Intellectual Property rights transfer to the client ONLY after the final bounty payment is cleared.',
        advanced: 'The "Kill Fee" (30–50%) acts as your escape scroll. If a client terminates the quest mid-battle, this fee covers your time and the opportunity cost of losing that slot in your schedule.',
      },
    ],
    practical: {
      title: 'Build Your Contract Template',
      intro: 'Initialize your reusable protection ward using platforms like Bonsai, Contract.io, or a trusted industry template.',
      steps: [
        'Insert a Scope section with a bulleted list of mandatory deliverables.',
        'Create an explicit "Out of Scope" section to prevent feature-creep.',
        'Formalize your payment structure using the 50/25/25 milestone rule.',
        'Define a hard revision cap at 2 rounds with a fixed surcharge for extra work.',
        'Integrate "Kill Fee" and "IP Transfer" clauses to finalize your protection.',
      ],
      goal: 'A hardened, reusable contract template you can deploy in under 5 minutes.',
    },
    quiz: [
      {
        question: 'Which section of your contract is the most vital defense against scope creep?',
        options: ['The list of inclusions', 'The explicit "Out of Scope" exclusions', 'The signature line', 'The current date'],
        correctIndex: 1,
      },
      {
        question: 'What is the recommended milestone payment structure for a standard quest?',
        options: ['100% upfront gold', 'A split like 50/25/25', '100% payment upon completion', 'A pay-as-you-go honor system'],
        correctIndex: 1,
      },
      {
        question: 'When should you officially transfer Intellectual Property (IP) rights?',
        options: ['On the very first day of the project', 'Immediately after the deposit clears', 'Only after final payment is confirmed', 'Never transfer IP rights'],
        correctIndex: 2,
      },
      {
        question: 'What is the tactical purpose of a "Kill Fee"?',
        options: ['Paying for free lunches during the project', 'Covering your time and opportunity costs if a client cancels', 'A punishment fee for fixing client bugs', 'Paying for your server hosting costs'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'No contract equals guaranteed conflict; always cast your ward.',
      'Explicitly defining what is "Out of Scope" is your strongest defense.',
      'Milestone-based payments ensure steady cash flow.',
      'IP transfer is the final reward for project completion.',
    ],
  },
  
  {
    id: 'free-8',
    module: 'Module 1: Freelance & Clients',
    order: 8,
    title: 'Project Management & Clients',
    icon: '🤝',
    philosophy: 'Most adventurers don\'t lose quests because of poor craftsmanship—they lose them due to poor communication. Become the calmest, clearest navigator on the project, and you will secure a permanent reputation that generates infinite referral quests.',
    concepts: [
      {
        title: '1. Weekly Update Ritual',
        beginner: 'Every Friday, dispatch a concise, 5-line status scroll to your client.',
        advanced: 'Structure your report: [Done This Week] / [Doing Next Week] / [Blocked By You]. This proactive communication calms client anxiety and eliminates the endless "Any updates?" ping-spam.',
      },
      {
        title: '2. One Source of Truth',
        beginner: 'Choose a single management tool (Notion, Linear, Trello) and reside there permanently.',
        advanced: 'Splitting your project across Slack, WhatsApp, Email, and Figma comments is a path to chaos. Funnel every detail into one central async command board to keep the records pristine.',
      },
      {
        title: '3. Set Boundaries',
        beginner: 'Define your operating hours clearly. Establish a 24-hour window for standard communication.',
        advanced: 'Embed your boundaries directly into the contract. Premium-tier clients may pay for accelerated response times, but never train a standard client to expect midnight messages.',
      },
      {
        title: '4. Ask for Referrals',
        beginner: 'After successfully delivering the loot, simple ask: "Do you know anyone else who needs this service?"',
        advanced: '80% of referral quests are found only by asking. Deploy your referral request exactly 1 week after final payment—this is the peak moment of client satisfaction.',
      },
    ],
    practical: {
      title: 'Set Up Your Operations Stack',
      intro: 'A streamlined adventurer only needs 3 core tools to maintain order.',
      steps: [
        'Select one primary project management portal (e.g., Notion or Linear).',
        'Consolidate communication channels to one hub (e.g., Slack Connect or Email).',
        'Choose a single invoicing rail (e.g., Stripe, Wise, or Bonsai).',
        'Draft your "Friday Status" template for rapid, weekly deployment.',
        'Append a professional "Referral" request line to your final invoice/email.',
      ],
      goal: 'Reduce your administrative overhead to under 30 minutes per week.',
    },
    quiz: [
      {
        question: 'What is the primary tactical advantage of a weekly status email?',
        options: ['It allows you to bill for extra hours', 'It significantly reduces client anxiety and message spam', 'It is a legal requirement for all independent contractors', 'It is specifically designed to boost your search engine ranking'],
        correctIndex: 1,
      },
      {
        question: 'Which communication strategy guarantees the highest project clarity?',
        options: ['Maintain one single "Source of Truth" board for all assets', 'Reply instantly across every available channel and platform', 'Mix Slack, WhatsApp, Email, and Figma comments freely', 'Avoid all communication to focus entirely on building'],
        correctIndex: 0,
      },
      {
        question: 'When is the optimal time to ask for a referral quest?',
        options: ['Never, as it feels unprofessional', 'Approximately 1 week after successful delivery, while satisfaction is high', 'Before starting any work on the project', 'Years after the project has been concluded'],
        correctIndex: 1,
      },
      {
        question: 'How should professional operational boundaries be handled?',
        options: ['Keep them implicit so you can be flexible', 'State them upfront and codify them within the contract', 'Negotiate them daily based on how you feel', 'Skip them entirely to maximize client availability'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Weekly status scrolls eliminate redundant pings.',
      'One Source of Truth is the only defense against operational chaos.',
      'Establish clear boundaries upfront to protect your mental health.',
      'Referrals are the most powerful growth mechanism—never forget to ask.',
    ],
  },
  
  {
    id: 'free-9',
    module: 'Module 1: Freelance & Clients',
    order: 9,
    title: 'Discovery Calls & Scoping',
    icon: '🔍',
    philosophy: 'Most failed quests are not lost during the "construction" phase, but during the initial planning phase. A masterfully executed Discovery Call replaces 20 hours of blind guesswork with 30 minutes of high-precision reconnaissance.',
    concepts: [
      {
        title: '1. The Five Questions',
        beginner: 'Ask the core interrogatives: What is the primary problem? Has anyone else attempted it? What is your budget range? What is the deadline? How do you define "done"?',
        advanced: 'These five questions are your primary scanner for red flags. If a client fails to define "done," they are effectively asking you to walk into a dungeon without a map—decline the quest or increase the bounty significantly.',
      },
      {
        title: '2. Listen, Don\'t Sell',
        beginner: 'The 30/70 rule: Spend 30% of your time speaking and 70% gathering intelligence through active listening.',
        advanced: 'Clients hire the skilled listener, not the loudest salesman. Mirror the specific terminology and pain points they use during the call within your final proposal to demonstrate deep understanding.',
      },
      {
        title: '3. Red Flags',
        beginner: 'Beware phrases like "this should be quick," "we don\'t have a budget yet," or "we\'ll figure out the scope later."',
        advanced: 'Decision-by-committee, lack of a clear point of contact, or vague written feedback are warning signs of a "Dungeon of Chaos." Either charge a high "Hazard Fee" or retreat immediately.',
      },
      {
        title: '4. Document Everything',
        beginner: 'Always dispatch a summary scroll within 24 hours to confirm the quest requirements in writing.',
        advanced: 'Use Loom recordings and shared strategy documents as your "Single Source of Truth." This hard-coded record prevents "I never said that" gaslighting from clients when project expectations shift.',
      },
    ],
    practical: {
      title: 'Run Your First Discovery Call',
      intro: 'Execute a 30-minute structured reconnaissance mission.',
      steps: [
        'Distribute a calendar link with your five core questions included in the invite.',
        'During the call: Ask, listen, and record the intelligence.',
        'End the call with crystal-clear agreement on: Budget, Timeline, and Decision Authority.',
        'Dispatch a formal written recap within 24 hours.',
        'Submit your high-precision proposal within 48 hours.',
      ],
      goal: 'Gather sufficient intelligence to construct a perfect, low-risk proposal.',
    },
    quiz: [
      {
        question: 'What is considered the most dangerous "Red Flag" during a discovery call?',
        options: ['A client with a tight deadline', 'A client who cannot define what "done" looks like', 'A client with a small initial budget', 'A client who lives in a different time zone'],
        correctIndex: 1,
      },
      {
        question: 'What is the optimal ratio of listening versus speaking?',
        options: ['90% speaking, 10% listening', '70% listening, 30% speaking', '50% speaking, 50% listening', '30% listening, 70% speaking'],
        correctIndex: 1,
      },
      {
        question: 'When should you dispatch your project recap scroll?',
        options: ['Within 1 week', 'Within 24 hours', 'Within 1 month', 'Never, oral agreements are enough'],
        correctIndex: 1,
      },
      {
        question: 'How should you classify a client who relies on "Decision by Committee"?',
        options: ['They are faster at approving milestones', 'They are often a red flag for future scope-creep and delays', 'They are a required element of high-level freelancing', 'They are a bonus feature that makes work easier'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Master the five core questions to scan for threats.',
      'Listen far more than you speak to understand the true boss-battle.',
      'Document all intelligence in writing to establish a Single Source of Truth.',
      'Red flags are not warnings; they are instructions to either charge more or retreat.',
    ],
  },
  
  {
    id: 'free-10',
    module: 'Module 1: Freelance & Clients',
    order: 10,
    title: 'Invoicing, Taxes & Payments',
    icon: '🧾',
    philosophy: 'Crafting the product is only half the battle; collecting your gold bounty is the other half. Smooth liquid flow depends on professional documentation, clear payment terms, and rigorous tax discipline.',
    concepts: [
      {
        title: '1. Invoice Anatomy',
        beginner: 'Your data, client data, line items, total, due date, and payment portal links are mandatory.',
        advanced: 'Maintain sequential log numbers (e.g., INV-2026-001). Always mandate "Net-7" terms over "Net-30" to reduce cash-flow float, and embed a formal late-fee clause to protect your revenue.',
      },
      {
        title: '2. Payment Rails',
        beginner: 'Utilize established trading hubs like Stripe, Wise, or PayPal based on the client\'s regional zone.',
        advanced: 'Wise is your primary engine for cheap international currency exchange. Stripe is the standard for US-based bounties. Avoid crypto unless you have an established bond of trust with the guild-leader.',
      },
      {
        title: '3. Deposits',
        beginner: 'Never initiate a quest without a 30–50% upfront deposit.',
        advanced: 'For high-level, long-term campaigns, switch to 25/25/25/25 milestone billing. This mitigates your collection risk and keeps your operation’s cash reserves healthy throughout the project lifecycle.',
      },
      {
        title: '4. Taxes (Basics)',
        beginner: 'Automatically siphon ~25–30% of every incoming bounty into a separate treasury for tax obligations.',
        advanced: 'Initialize a dedicated "Tax Treasury" account immediately. Master quarterly estimated payments to avoid end-of-year shocks, and recruit a professional accountant during your first year of business.',
      },
    ],
    practical: {
      title: 'Send a Real Invoice',
      intro: 'Deploy your financial documentation systems today.',
      steps: [
        'Register with a professional invoice rail like Stripe Invoicing or Wise.',
        'Initialize your business profile and branding.',
        'Construct a master template including line items, terms, and direct payment links.',
        'Dispatch your first invoice with a strict "Net-7" term and 1.5% monthly late-fee clause.',
        'Open a distinct "Tax Treasury" account and move your first 30% contribution into it.',
      ],
      goal: 'Develop the ability to generate and dispatch professional invoices in under 5 minutes.',
    },
    quiz: [
      {
        question: 'What is the standard protective deposit percentage for new quest-givers?',
        options: ['0% (I work on faith alone)', '30-50% upfront', '100% upon final completion', 'Negotiate the payment only after the quest is finished'],
        correctIndex: 1,
      },
      {
        question: 'Which rail offers the most efficient rates for international currency exchange?',
        options: ['PayPal', 'Wise', 'Standard Bank Wire', 'Bitcoin'],
        correctIndex: 1,
      },
      {
        question: 'What is the recommended tax-savings siphon rate for every bounty?',
        options: ['10%', '~25-30% of every invoice', '50%', 'None (I pay taxes when they arrive)'],
        correctIndex: 1,
      },
      {
        question: 'How should you view the inclusion of a late-fee clause?',
        options: ['It is considered rude and unprofessional', 'It is a standard, highly recommended protective measure', 'It is an illegal practice in most freelance zones', 'It is optional and bad for client morale'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Always secure your deposit before moving a single pixel.',
      'Use Stripe and Wise to optimize your financial transaction rails.',
      'Establish a dedicated Tax Treasury from day one to avoid ruin.',
      'Codify late-fee clauses in writing to ensure punctual bounty rewards.',
    ],
  },
  
{
    id: 'free-11',
    module: 'Module 1: Freelance & Clients',
    order: 11,
    title: 'Handling Difficult Clients & Scope Creep',
    icon: '🛡️',
    philosophy: 'Every adventurer eventually encounters an "Impossible Client" boss-mob. Your ultimate defense is not aggression; it is your Shield of Contracts, your Written Records, and the calm, strategic willingness to walk away from a cursed quest.',
    concepts: [
      {
        title: '1. Scope Creep',
        beginner: 'Tiny, unlogged extras are small leaks that will eventually sink your ship.',
        advanced: 'Every adjustment must pass through the Change Request Gate: write the new spec, calculate the added gold cost, and obtain signature approval. No exceptions, no matter how small.',
      },
      {
        title: '2. The "Just One Thing"',
        beginner: 'When asked for a "quick favor," push back politely: "I would be happy to add that; let me send over a quote."',
        advanced: 'You are training your client. If you grant one free favor, you invite ten more. If you charge for the first one, the requests vanish. Protect your time as your most valuable asset.',
      },
      {
        title: '3. Communication Breakdowns',
        beginner: 'If a project begins to destabilize, shift all correspondence from casual chat to formal email.',
        advanced: 'Always summarize verbal quest-updates in writing: "Per our call, you will deliver X by Friday." This locks reality into a timestamped record, preventing future gaslighting.',
      },
      {
        title: '4. Firing a Client',
        beginner: 'Recognize that it is perfectly acceptable to terminate a toxic partnership.',
        advanced: 'Provide 30 days notice. Maintain extreme professionalism: "It is not a good fit" is a complete, unarguable sentence. Sometimes, rejecting gold is the only way to save your sanity.',
      },
    ],
    practical: {
      title: 'Write Your Change Request Template',
      intro: 'Initialize your formal documentation shield.',
      steps: [
        'Draft a document with headers: Request Description, Time/Gold Impact, and Approval Signature.',
        'Export as a clean PDF or shared digital document.',
        'When a "Just One Thing" request arises, reply: "That is a great idea! I will prepare a Change Request form for that now."',
        'Send the filled document along with your new quote.',
        'Refuse to start any additional labor until the document is signed.',
      ],
      goal: 'Stop the constant bleeding of hours to unauthorized feature-creep.',
    },
    quiz: [
      {
        question: 'What is your primary line of defense against scope creep?',
        options: ['Displaying extreme anger to intimidate the client', 'A formal Change Request process', 'Working faster to compensate for the free hours', 'Maintaining total silence'],
        correctIndex: 1,
      },
      {
        question: 'How should you respond to a "Just one thing" request?',
        options: ['Accept it as a free favor to boost morale', 'Respond with: "I would be happy to add that; here is a quote."', 'Provide a flat "No" and ignore further pings', 'Ignore the request entirely'],
        correctIndex: 1,
      },
      {
        question: 'What is the standard procedure for locking verbal agreements?',
        options: ['Relying solely on your memory', 'Dispatching a summary "Recap" email immediately', 'Sending a public tweet about the conversation', 'Using a phone call as the final authority'],
        correctIndex: 1,
      },
      {
        question: 'How should you view the act of firing a client?',
        options: ['It is never an acceptable action for a freelancer', 'It is sometimes the only healthy choice to protect your sanity', 'It is always an act of bad faith', 'It is an illegal breach of contract'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Enforce Change Requests to stop silent scope expansion.',
      'Charge for every minor favor to train your clients.',
      'Confirm all verbal reality in writing to prevent gaslighting.',
      'The ability to walk away is your most powerful tool.',
    ],
  },
  
  {
    id: 'free-12',
    module: 'Module 1: Freelance & Clients',
    order: 12,
    title: 'Scaling: From Solo to Agency',
    icon: '🏢',
    philosophy: 'The "Hours-for-Gold" model has a hard ceiling. To ascend, you must transcend simple labor. Scaling is the art of productizing your unique weapon, recruiting support squads, or maximizing your bounty until the market hits your prestige limit.',
    concepts: [
      {
        title: '1. Raise Rates First',
        beginner: 'The simplest path to higher yields is to simply charge more for your expertise.',
        advanced: 'Implement a 20% rate increase every 6 months for all new clients. Continue this climb until you reach your "Prestige Ceiling"—the point where you begin losing potential leads. This threshold is your true market value.',
      },
      {
        title: '2. Productize',
        beginner: 'Transform bespoke, chaotic quests into rigid, fixed-price "Gear Packages" (e.g., "The Conversion Audit — $1,500").',
        advanced: 'Productized services are your scaling engine. Because they are repeatable, they eliminate haggling, accelerate decision-making, and drastically increase your profit margins per cycle.',
      },
      {
        title: '3. First Hire',
        beginner: 'Identify the tasks that drain your health points or bore you (e.g., admin, editing) and delegate them first.',
        advanced: 'Prioritize Contractors over full-time Employees for your first year. This maintains high operational flexibility. Train your recruits via Loom-recorded SOPs to ensure standardized output quality.',
      },
      {
        title: '4. Becoming an Agency',
        beginner: 'Transition to Agency-status when 80% of your operational time is spent managing high-level quests rather than executing them.',
        advanced: 'Beware the trap: many freelancers actually net more gold and experience less stress as a solo elite than as a stressed-out commander of a 5-person squad. Choose your path deliberately.',
      },
    ],
    practical: {
      title: 'Pick Your Scale Path',
      intro: 'Choose your next evolution strategy to break the hours-for-gold ceiling.',
      steps: [
        'Path A: Execute a 20% rate increase on your very next client.',
        'Path B: Codify and publish one "Productized Service" landing page.',
        'Path C: Audit your workflow; list 3 tasks you hate and budget gold to outsource them next month.',
        'Commit to your chosen path with ruthless focus for 90 days.',
        'Review your loot: Did your income-per-hour ratio actually climb?',
      ],
      goal: 'Shatter the hours-for-dollars ceiling and achieve professional leverage.',
    },
    quiz: [
      {
        question: 'What is the absolute easiest, fastest path to scaling your freelance income?',
        options: ['Hiring an expensive support team', 'Systematically raising your rates', 'Investing heavily in experimental marketing', 'Drinking more coffee to work longer hours'],
        correctIndex: 1,
      },
      {
        question: 'What is the core definition of "Productizing" your service?',
        options: ['Going to a corporate office to work', 'Selling rigid, fixed-scope service packages', 'Offering endless free trials to capture leads', 'Outsourcing every single task to another party'],
        correctIndex: 1,
      },
      {
        question: 'Who should be your very first hire in your scaling journey?',
        options: ['A fellow coder or technical expert', 'Someone to handle the tasks you hate or find inefficient', 'A high-level growth marketer', 'A Venture Capitalist partner'],
        correctIndex: 1,
      },
      {
        question: 'When is the transition to a full-scale Agency actually the "right" move?',
        options: ['Always, as soon as you have your first dollar', 'When you genuinely prefer managing people over doing the work', 'On Day 1 of your freelance career', 'Never, as it is a trap'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Raise your rates regularly until the market signals a limit.',
      'Productization is your primary engine for leverage.',
      'Delegate what you hate; automate what you can.',
      'The solo path is often more profitable and less stressful than the agency path.',
    ],
  },
];

export const getFreelanceLessonById = (id: string): FreelanceLesson | undefined =>
  FREELANCE_LESSONS.find(l => l.id === id);

export const isFreelanceLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = FREELANCE_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(FREELANCE_LESSONS[idx - 1].id);
};
