import type { NetworkingLesson } from './networkingLessons';

export type RealFreelanceLesson = NetworkingLesson;

export const REAL_FREELANCE_LESSONS: RealFreelanceLesson[] = [
  {
    id: 'real-free-1',
    module: 'Module 2: Real-World Execution',
    order: 1,
    title: 'The Cold Outreach Engine (Loom Teardowns)',
    icon: '📹',
    philosophy: 'Theoretical pitches get deleted. A 90-second personalized video teardown showing a real flaw and a live fix bypasses gatekeepers and creates immediate trust.',
    concepts: [
      {
        title: '1. Reconnaissance & Email Scraping',
        beginner: 'Find target client websites. Use browser extensions like Hunter.io or Apollo.io to get the direct founder or tech lead email.',
        advanced: 'Inspect target sites for broken UX, slow speed scores (Lighthouse), or poor mobile responsiveness before reaching out so you have undeniable proof in hand.',
      },
      {
        title: '2. The 90-Second Loom Formula',
        beginner: 'Record a video under 2 minutes: Compliment their work → Point out 1 major problem → Show your live mock fix.',
        advanced: 'Keep your face camera bubble visible. Structure: 10s praise, 40s problem audit, 30s proposed visual/technical fix, 10s soft call-to-action (CTA).',
      },
      {
        title: '3. Email Delivery Script',
        beginner: 'Send short text with the Loom link. Ask a simple question: "Would you like me to send over the full code/design fix?"',
        advanced: 'Use a thumbnail of their website with a "Play" button in the email body. Do not include attachments; they trigger spam filters.',
      },
      {
        title: '4. The 3-Touch Follow-Up Protocol',
        beginner: 'Follow up on Day 1, Day 4, and Day 8 before stopping. Most replies come on the 2nd or 3rd email.',
        advanced: 'Day 4: Add new micro-value (e.g., a screenshot of a competitor). Day 8: Send a graceful "breakup" email stating you will close the file.',
      },
    ],
    practical: {
      title: 'Send Your First Loom Audit',
      intro: 'Execute a live video audit for 1 prospective client today.',
      steps: [
        'Find 1 business website in your niche with a clear, fixable flaw.',
        'Use Hunter.io to find the Founder or Head of Marketing email.',
        'Record a 90-second Loom recording breaking down the flaw and offering a fix.',
        'Email the video link with a 3-sentence body copy and a thumbnail.',
        'Log the view status and set a calendar reminder for follow-up in 3 days.',
      ],
      goal: 'Send 1 real video pitch and verify client engagement via Loom view analytics.',
    },
    quiz: [
      {
        question: 'What is the optimal length for a cold outreach Loom teardown video?',
        options: ['10–15 minutes', 'Under 90–120 seconds', '30 minutes', '5 seconds'],
        correctIndex: 1,
      },
      {
        question: 'What should the first 10 seconds of a cold video audit focus on?',
        options: ['A long personal introduction', 'Genuine praise or recognition of their recent work', 'Demanding money upfront', 'Complaining about market rates'],
        correctIndex: 1,
      },
      {
        question: 'Why should you avoid sending file attachments in cold emails?',
        options: ['They cost money to send', 'They often trigger spam filters and ruin deliverability', 'Clients do not know how to open them', 'They compress the video quality'],
        correctIndex: 1,
      },
      {
        question: 'When does the highest volume of successful cold outreach replies occur?',
        options: ['On the very first email', 'Only if you call them on the phone', 'On the 2nd or 3rd follow-up attempt', 'They never actually reply'],
        correctIndex: 2,
      },
    ],
    keyTakeaways: [
      'Show, don\'t tell—video teardowns prove competency instantly.',
      'Keep audits concise and hyper-focused on business ROI.',
      'Always track video view engagement to time your follow-ups.',
      'Persistence is a feature: execute the 3-touch follow-up protocol.',
    ],
  },
  {
    id: 'real-free-2',
    module: 'Module 2: Real-World Execution',
    order: 2,
    title: 'Upwork Bidding Masterclass',
    icon: '🎯',
    philosophy: 'Clients scan 50 proposals in 5 minutes. If your first sentence isn\'t a custom solution hook, your proposal gets archived without being opened. Precision beats volume.',
    concepts: [
      {
        title: '1. Filter the Job Feed Like a Veteran',
        beginner: 'Filter for clients with verified payment methods and a >70% hire rate.',
        advanced: 'Target jobs posted less than 2 hours ago with under 10 proposals submitted. This maximizes your early-view probability before the client gets overwhelmed.',
      },
      {
        title: '2. The 3-Paragraph Winning Script',
        beginner: 'Line 1: Direct solution hook. Line 2: Link to 1 identical project. Line 3: Low-friction question.',
        advanced: 'Never start with "Hi, I am a developer with X years experience." Start with: "I checked your site/repo and found exactly why the build is failing..."',
      },
      {
        title: '3. Attach Relevant Proof Points',
        beginner: 'Attach 1 single hyper-relevant case study link rather than your entire broad portfolio.',
        advanced: 'Record a custom 60-second Loom video specifically for the Upwork proposal. Stand out from the 50 copy-pasted text bids.',
      },
      {
        title: '4. The Connects Strategy & ROI',
        beginner: 'Only bid on jobs where your skills match at least 90% of the client\'s requirements.',
        advanced: 'Boost proposals selectively (top 3 spots) ONLY on high-budget, highly-vetted jobs. Do not waste connects boosting $50 tasks.',
      },
    ],
    practical: {
      title: 'Submit 1 Hardened Upwork Proposal',
      intro: 'Filter the active feed and submit a highly optimized proposal.',
      steps: [
        'Set search filters: Payment Verified, Hire Rate >70%, <10 Proposals.',
        'Find a high-value job posted within the last 60 minutes.',
        'Draft a 3-paragraph proposal using the custom solution hook script.',
        'Include 1 hyper-relevant project link or a custom Loom video.',
        'Submit and log your submission time vs. client view rate.',
      ],
      goal: 'Land an interview invitation by executing optimized bidding techniques.',
    },
    quiz: [
      {
        question: 'What is the absolute worst way to start an Upwork proposal?',
        options: ['Addressing the client\'s specific problem statement', 'Starting with "Hi, I am a senior developer with 5 years experience..."', 'Asking a strategic technical question', 'Providing a direct link to a live demo'],
        correctIndex: 1,
      },
      {
        question: 'Which client filter on Upwork saves the most wasted connects?',
        options: ['Unverified payment method', 'Payment verified and Hire Rate >70%', 'Zero total spent', 'Lowest price available'],
        correctIndex: 1,
      },
      {
        question: 'How many portfolio items should you link in your proposal?',
        options: ['Every single project you have ever built', 'None, wait for them to ask', 'One single, hyper-relevant case study that matches their problem', 'Just a link to your GitHub homepage'],
        correctIndex: 2,
      },
      {
        question: 'When should you use the "Boost Proposal" feature?',
        options: ['On every single job to guarantee views', 'Never, it is a scam', 'Only on high-budget jobs where you match 90%+ of the requirements', 'Only on low-budget jobs to secure an easy win'],
        correctIndex: 2,
      },
    ],
    keyTakeaways: [
      'The first 2 lines of your proposal determine if the client clicks or skips.',
      'Filter for active, high-intent buyers to preserve your Connects.',
      'Relevance always beats volume when submitting project samples.',
      'A custom video inside an Upwork proposal gives you an unfair advantage.',
    ],
  },
  {
    id: 'real-free-3',
    module: 'Module 2: Real-World Execution',
    order: 3,
    title: 'The LinkedIn Inbound Magnet',
    icon: '🧲',
    philosophy: 'Outbound pitching is hunting. Inbound marketing is building a trap. By optimizing your LinkedIn profile into a landing page and engaging daily, you force high-tier clients to come to you.',
    concepts: [
      {
        title: '1. The Landing Page Profile',
        beginner: 'Your headline is not your job title. It is your value proposition: "I build [X] for [Y] to achieve [Z]."',
        advanced: 'Design a custom banner image containing social proof. Pin your highest-converting case study in the "Featured" section with a direct booking link.',
      },
      {
        title: '2. The 15-Minute Engagement Engine',
        beginner: 'Leave thoughtful comments on posts from founders and decision-makers in your niche.',
        advanced: 'Do not comment "Great post!" Write mini-essays. Add a unique technical perspective to their post. 80% of your profile views will come from high-quality comments, not your own posts.',
      },
      {
        title: '3. Posting Case Studies',
        beginner: 'Share screenshots of your work with a brief description of what you built.',
        advanced: 'Use the PAS formula (Problem, Agitation, Solution). Describe the terrible state the client was in, the technical fix you engineered, and the concrete business metrics achieved.',
      },
      {
        title: '4. Handling Inbound DMs',
        beginner: 'When someone messages you, reply promptly and ask what they need.',
        advanced: 'Control the frame immediately. Reply: "Thanks for reaching out. To see if I can help, what is the main bottleneck you are facing right now?" Move them to a discovery call within 3 messages.',
      },
    ],
    practical: {
      title: 'Optimize and Engage',
      intro: 'Transform your LinkedIn from a static resume into an active inbound engine.',
      steps: [
        'Rewrite your Headline to the "I help [Target] achieve [Result] with [Skill]" formula.',
        'Add your strongest case study link to the Featured section.',
        'Find 5 target clients (Founders, CTOs, Agency Owners) and leave a highly technical, insightful comment on their recent post.',
        'Draft and schedule 1 "PAS" formatted case study post for this week.',
      ],
      goal: 'Generate profile views from target demographics through strategic commenting.',
    },
    quiz: [
      {
        question: 'What is the primary purpose of your LinkedIn Headline?',
        options: ['To state your current employment status', 'To act as a value proposition stating exactly who you help and how', 'To list every programming language you know', 'To show your university degree'],
        correctIndex: 1,
      },
      {
        question: 'Where do the majority of profile views originate from on LinkedIn for new freelancers?',
        options: ['Paid advertisements', 'Writing long, high-quality comments on decision-makers\' posts', 'Spamming connection requests', 'Having a premium account'],
        correctIndex: 1,
      },
      {
        question: 'What does the PAS formula stand for when writing a case study post?',
        options: ['Post, Analyze, Share', 'Problem, Agitation, Solution', 'Program, Application, System', 'Price, Agreement, Signature'],
        correctIndex: 1,
      },
      {
        question: 'How should you handle an inbound DM asking about your services?',
        options: ['Send them your hourly rate immediately', 'Take control of the frame, ask about their bottleneck, and push to a call', 'Send them a 5-page PDF resume', 'Wait 3 days to reply to seem busy'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Your profile is a landing page, not a resume.',
      'High-quality commenting is the fastest way to drive inbound traffic.',
      'Frame your work posts around business problems, not just code.',
      'Transition DMs to discovery calls as efficiently as possible.',
    ],
  },
  {
    id: 'real-free-4',
    module: 'Module 2: Real-World Execution',
    order: 4,
    title: 'Live Discovery Calls & Closing',
    icon: '📞',
    philosophy: 'A discovery call is not a job interview; it is a doctor-patient diagnosis. If you talk more than 30% of the time, you are losing the sale. Ask precision questions, diagnose the pain, and prescribe the solution.',
    concepts: [
      {
        title: '1. Framing the Call',
        beginner: 'Start the meeting by setting an agenda so the client knows you are a professional.',
        advanced: 'The 30-second frame: "The goal today is to ask a few questions about your infrastructure to see if I can actually help. If I can, I will explain how. If not, I will point you in the right direction. Sound good?"',
      },
      {
        title: '2. The Diagnostic Phase',
        beginner: 'Ask what they want built and when they need it by.',
        advanced: 'Ask the "Why Now?" question. "This problem has existed for a year—why is it a priority to fix it this specific month?" This reveals the true financial urgency behind the project.',
      },
      {
        title: '3. The Price Anchor',
        beginner: 'Avoid talking about price until you send the written proposal.',
        advanced: 'Float an anchor live to test their budget. "Projects of this scope typically range between $3k and $6k. Is that within your ballpark?" Watch their facial expression—if they don\'t flinch, you can aim higher.',
      },
      {
        title: '4. The Next Steps Close',
        beginner: 'End by saying "I will send you an email soon."',
        advanced: 'Lock in the timeline before hanging up. "I will have the proposal to you by 2 PM tomorrow. When is a good time for us to review it together?"',
      },
    ],
    practical: {
      title: 'Roleplay the Discovery Script',
      intro: 'Build the muscle memory required to control a live sales call.',
      steps: [
        'Write down your 30-second Opening Frame script.',
        'List your 5 core diagnostic questions (including the "Why Now?" question).',
        'Write down your specific "Price Anchor" bracket based on your niche.',
        'Record yourself on your webcam practicing the script from start to finish.',
        'Review the footage: eliminate filler words like "um" and "like" to project absolute confidence.',
      ],
      goal: 'Master the flow of a sales call so you never freeze when a client asks a tough question.',
    },
    quiz: [
      {
        question: 'What is the purpose of "Framing" the call in the first 30 seconds?',
        options: ['To brag about your portfolio', 'To establish authority and set a clear agenda for the meeting', 'To ask for their budget immediately', 'To stall for time'],
        correctIndex: 1,
      },
      {
        question: 'Why is the "Why Now?" question so powerful?',
        options: ['It reveals the underlying financial urgency or deadline driving the project', 'It confuses the client', 'It proves you are technically proficient', 'It allows you to finish the call early'],
        correctIndex: 0,
      },
      {
        question: 'What is "Price Anchoring" on a live call?',
        options: ['Refusing to do the work', 'Forcing them to pay via credit card on the call', 'Floating a realistic price range live to gauge their reaction and validate their budget', 'Agreeing to work for whatever they offer'],
        correctIndex: 2,
      },
      {
        question: 'How should you conclude a successful discovery call?',
        options: ['"I\'ll email you sometime next week."', 'Lock in a specific deadline for the proposal and schedule the follow-up review', 'Wait for them to hang up first', 'Ask them to write the proposal for you'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Control the frame of the call immediately to establish authority.',
      'Talk less; let the client explain their pain in detail.',
      'Use price anchoring to prevent wasting time on clients with zero budget.',
      'Never leave a meeting without scheduling the exact next step.',
    ],
  },
  {
    id: 'real-free-5',
    module: 'Module 2: Real-World Execution',
    order: 5,
    title: 'The Perfect Client Onboarding SOP',
    icon: '🚀',
    philosophy: 'Buyer\'s remorse happens the moment the client pays the deposit. A flawless, automated onboarding sequence reassures them that they just hired a top-tier professional, setting the tone for the entire project.',
    concepts: [
      {
        title: '1. The Intake Form',
        beginner: 'Email the client asking for their passwords, assets, and branding files.',
        advanced: 'Send a formalized Typeform or Google Form. Force them to upload all assets (logos, copy, API keys) into structured fields before you write a single line of code.',
      },
      {
        title: '2. The Client Portal (Notion/Trello)',
        beginner: 'Send updates via random emails and Slack messages.',
        advanced: 'Deploy a duplicated Notion Client Portal. It contains the contract, the timeline, the deliverable checklist, and the invoice receipts. This becomes the "Single Source of Truth."',
      },
      {
        title: '3. The Kickoff Video',
        beginner: 'Send a quick "Thanks for the payment, I am starting now" message.',
        advanced: 'Record a 3-minute Loom welcoming them, walking them through the Notion portal, explaining how to leave feedback, and reiterating the Phase 1 delivery date.',
      },
      {
        title: '4. Establishing Boundaries',
        beginner: 'Reply to client texts at 11 PM to show you work hard.',
        advanced: 'Include a "Communication Guidelines" section in the portal. Explicitly state: "All updates happen in this portal. Emails are answered within 24 hours between 9 AM and 5 PM EST." Enforce this ruthlessly.',
      },
    ],
    practical: {
      title: 'Build Your Client Portal Template',
      intro: 'Create the asset that will save you hundreds of hours of project management.',
      steps: [
        'Open Notion (or Trello/Linear) and create a new "Client Dashboard" template.',
        'Create sections for: Important Links, Project Timeline, Meeting Notes, and Assets.',
        'Draft your standard Intake Form using Google Forms (Ask for brand guidelines, domain access, etc.).',
        'Draft a canned "Welcome Email" that includes the Portal Link and Intake Form Link.',
        'Save this setup to duplicate for every future client.',
      ],
      goal: 'Standardize your onboarding so you can start new projects in exactly 5 minutes.',
    },
    quiz: [
      {
        question: 'What is the primary psychological purpose of a strong onboarding sequence?',
        options: ['To ask for more money', 'To eliminate buyer\'s remorse and project extreme professionalism', 'To delay the start of the project', 'To get the client to do the coding for you'],
        correctIndex: 1,
      },
      {
        question: 'Why should you use an Intake Form instead of email threads for assets?',
        options: ['It looks prettier', 'It forces the client to organize their own assets, preventing missing files and lost API keys', 'It automatically writes the code', 'Email is actually better for file management'],
        correctIndex: 1,
      },
      {
        question: 'What is the "Single Source of Truth"?',
        options: ['The client\'s memory', 'A dedicated Client Portal (like Notion) where all project data and communication is centralized', 'A random WhatsApp group chat', 'Your personal notebook'],
        correctIndex: 1,
      },
      {
        question: 'How do you train clients to respect your operational boundaries?',
        options: ['Complain to them constantly', 'Ignore them for weeks at a time', 'Codify your communication rules in the portal and consistently stick to your stated hours', 'Give them your personal cell phone number'],
        correctIndex: 2,
      },
    ],
    keyTakeaways: [
      'A structured intake process eliminates asset-chasing delays.',
      'Client portals centralize communication and prevent scope confusion.',
      'A Loom kickoff video builds deep trust immediately after payment.',
      'Set and enforce communication boundaries on Day 1.',
    ],
  },
  {
    id: 'real-free-6',
    module: 'Module 2: Real-World Execution',
    order: 6,
    title: 'Zero-Friction Delivery & Feedback SOP',
    icon: '⚙️',
    philosophy: 'Delivering the project is where most freelancers lose their profit margin to endless revisions. Control the feedback loop aggressively to protect your hourly rate and your sanity.',
    concepts: [
      {
        title: '1. The Guided Reveal',
        beginner: 'Send a link to the live staging site and ask "What do you think?"',
        advanced: 'Never send a naked link. Always record a Loom video walking them through the staging site, explaining the strategic decisions you made. Guide their perspective before they can form objections.',
      },
      {
        title: '2. Consolidating Revisions',
        beginner: 'Fix things one by one as the client emails you random thoughts over 3 weeks.',
        advanced: 'Enforce "Revision Rounds." Tell the client: "Please review the build and compile ALL feedback into one single list by Friday. This will count as Round 1 of 2." Ignore piecemeal emails.',
      },
      {
        title: '3. Handling "Just One More Thing"',
        beginner: 'Do the extra work for free to keep the client happy.',
        advanced: 'Deploy the Scope-Check Script: "I would love to add that feature! Since it is outside the original SOW, it will add $250 and 2 days to the timeline. Shall I send over the approval link?"',
      },
      {
        title: '4. The Mid-Project Status Scroll',
        beginner: 'Go silent for two weeks while coding, leaving the client anxious.',
        advanced: 'Send a rigid Friday Update every week: 1. What was completed. 2. What is next. 3. What is needed from them (Blockers). Keep it under 5 bullet points.',
      },
    ],
    practical: {
      title: 'Draft Your Delivery Scripts',
      intro: 'Prepare your push-back and delivery templates so you aren\'t writing them while stressed.',
      steps: [
        'Draft the "Guided Reveal Email" (Template holding space for your Loom link and Staging link).',
        'Draft the "Consolidated Feedback Rule" email (explaining how they must submit revisions).',
        'Draft the "Scope-Check Script" for when they ask for free features.',
        'Draft your "Friday Status Update" bulleted format.',
        'Save these in a notes app or text expander for instant deployment.',
      ],
      goal: 'Equip yourself with the exact scripts needed to defend your scope and time.',
    },
    quiz: [
      {
        question: 'Why should you never send a "naked link" to a staging site?',
        options: ['Because URLs are dangerous', 'Because the client will misinterpret the work without your strategic context framing it', 'Because it violates Upwork Terms of Service', 'Because staging sites do not work on mobile'],
        correctIndex: 1,
      },
      {
        question: 'What is the most effective way to handle client revisions?',
        options: ['Accepting random text messages daily', 'Enforcing consolidated "Revision Rounds" where all feedback is grouped together', 'Refusing to do any revisions at all', 'Charging hourly for every single typo fix'],
        correctIndex: 1,
      },
      {
        question: 'How do you stop a client from asking for free extra features?',
        options: ['Yell at them', 'Agree to do it but do a bad job', 'Use the Scope-Check Script to attach a concrete cost and timeline delay to the request', 'Ignore the request completely'],
        correctIndex: 2,
      },
      {
        question: 'What is the purpose of the Friday Status Update?',
        options: ['To prove you are working 40 hours a week', 'To eliminate client anxiety and prevent them from constantly messaging you for updates', 'To ask for more money', 'To complain about bugs'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Guide the client\'s feedback by presenting the work with context.',
      'Force clients to consolidate feedback to avoid endless revision cycles.',
      'Politely attach a price tag to every out-of-scope request.',
      'Proactive Friday updates completely eliminate client anxiety.',
    ],
  },

  {
    id: 'real-free-7',
    module: 'Module 2: Real-World Execution',
    order: 7,
    title: 'The Offboarding & Testimonial Loop',
    icon: '🔄',
    philosophy: 'The end of a quest is not a goodbye; it is the engine for your next gig. A structured offboarding sequence transforms a happy client into a permanent marketing asset through video testimonials and referrals.',
    concepts: [
      {
        title: '1. The Hand-Off Protocol',
        beginner: 'Send the final files in a zip folder and say thank you.',
        advanced: 'Record a "Final Walkthrough" video explaining how they can use, edit, and maintain their new asset. Provide a 1-page PDF "Cheat Sheet" for their team. This eliminates post-launch support tickets.',
      },
      {
        title: '2. The 7-Day Glow Period',
        beginner: 'Ask for a review immediately while they are busy launching.',
        advanced: 'Wait exactly 7 days after the final payment. This is the "Glow Period" where their stress has dropped, the product is live, and they are most receptive to doing you a favor.',
      },
      {
        title: '3. Automating the Testimonial',
        beginner: 'Ask: "Can you write me a testimonial?" (This creates work for them, so they will procrastinate and forget).',
        advanced: 'Send a fill-in-the-blank script or use a tool like Senja/Testimonial.to. Ask 3 specific questions: 1. What was the problem before? 2. How did I solve it? 3. What is the business result? Provide an easy video-recording link.',
      },
      {
        title: '4. The Referral Ask',
        beginner: 'Wait for them to organically recommend you to their friends.',
        advanced: 'Deploy the direct referral script: "I loved working on this. I am looking to take on one more client exactly like you next month. Do you know one founder in your network who needs this exact same upgrade?"',
      },
    ],
    practical: {
      title: 'Draft Your Offboarding Sequence',
      intro: 'Build your automated exit-sequence templates.',
      steps: [
        'Create a "Project Hand-Off" email template holding space for a Loom walkthrough link.',
        'Create a free account on Senja.io or Testimonial.to to collect video/text reviews seamlessly.',
        'Draft your "7-Day Check-in & Review Ask" email, including the 3 guided questions to make writing the review effortless for the client.',
        'Draft your "Referral Ask" script to send 14 days post-launch.',
      ],
      goal: 'Guarantee a 5-star case study asset and a referral lead at the end of every successful project.',
    },
    quiz: [
      {
        question: 'Why should you wait 7 days to ask for a testimonial?',
        options: ['Because the contract legally requires it', 'Because it allows the client to get past the stress of launch day and experience the "Glow Period"', 'Because you need time to count your money', 'To make them think you are busy'],
        correctIndex: 1,
      },
      {
        question: 'What is the biggest mistake freelancers make when asking for a testimonial?',
        options: ['Asking for too much money', 'Asking an open-ended "Can you write a review?" which creates mental friction for the client', 'Asking for a video', 'Sending it via email instead of text'],
        correctIndex: 1,
      },
      {
        question: 'What is the purpose of the "Final Walkthrough" video?',
        options: ['To prove you did the work', 'To show off your coding environment', 'To proactively teach the client how to use the product, eliminating annoying post-launch support emails', 'To ask for more money'],
        correctIndex: 2,
      },
      {
        question: 'How should you ask for a referral?',
        options: ['Do not ask; let it happen naturally', 'Post on Twitter tagging the client', 'Directly ask if they know ONE specific person in their network who needs the exact same result', 'Demand a list of 10 emails from their contacts'],
        correctIndex: 2,
      },
    ],
    keyTakeaways: [
      'Provide a training walkthrough to cleanly cut the cord on a project.',
      'Time your testimonial ask for the 7-Day Glow Period.',
      'Remove friction by providing the client with a testimonial script.',
      'Always ask for exactly ONE referral to make the request feel achievable.',
    ],
  },
  {
    id: 'real-free-8',
    module: 'Module 2: Real-World Execution',
    order: 8,
    title: 'The Retainer Engine (Recurring Revenue)',
    icon: '♾️',
    philosophy: 'Hunting for new quests every month is exhausting. The ultimate freelance cheat code is transforming a one-off project into a monthly recurring subscription (MRR).',
    concepts: [
      {
        title: '1. The Retainer Pitch Timing',
        beginner: 'Ask for a retainer before the first project is even finished.',
        advanced: 'Pitch the retainer during the Offboarding phase. Once they see the final product, say: "Now that this is live, it requires X maintenance to keep generating revenue. I can handle that for you on autopilot."',
      },
      {
        title: '2. Support vs. Growth Retainers',
        beginner: 'Charge $100/mo just to "keep the lights on" (server hosting, basic updates).',
        advanced: 'Pitch a "Growth Retainer." Do not just maintain; optimize. Example: "For $1,000/mo, I will run A/B tests on your landing page and build one new feature per month to increase conversion rates." Tie the retainer to their profit.',
      },
      {
        title: '3. Capping the Hours',
        beginner: 'Sell a retainer as "unlimited work" and get burned out immediately.',
        advanced: 'Sell outputs, not hours. "This retainer guarantees 4 new assets a month and priority bug fixing." If you must sell hours, strictly enforce a "Use It or Lose It" policy—hours do not roll over to the next month.',
      },
      {
        title: '4. The Automatic Billing Rail',
        beginner: 'Send a manual invoice every 30 days and chase them to pay it.',
        advanced: 'Use Stripe Subscriptions to set up an automatic ACH/Credit Card draw on the 1st of every month. Treat your freelance business like a SaaS company.',
      },
    ],
    practical: {
      title: 'Design Your Retainer Package',
      intro: 'Create a subscription product you can upsell to your next client.',
      steps: [
        'Identify a recurring problem your clients face after a project finishes (e.g., SEO updates, security, design tweaks).',
        'Package this into a monthly service tier (e.g., The Growth Pack: 2 updates + 1 analytics report).',
        'Set a flat monthly price (typically 15-30% of the original project cost).',
        'Set up a Stripe Subscription link for this specific package.',
      ],
      goal: 'Have a ready-to-sell recurring revenue product to pitch during offboarding.',
    },
    quiz: [
      {
        question: 'When is the most psychologically effective time to pitch a retainer?',
        options: ['During the very first discovery call', 'In the middle of the project when things are broken', 'During the Offboarding phase, immediately after a successful delivery', 'Years after the project ends'],
        correctIndex: 2,
      },
      {
        question: 'What is the main difference between a Support retainer and a Growth retainer?',
        options: ['Support is expensive; Growth is cheap', 'Support maintains the status quo; Growth actively improves the client\'s revenue metrics', 'Support requires coding; Growth only requires talking', 'There is no difference'],
        correctIndex: 1,
      },
      {
        question: 'How should you handle unused retainer hours at the end of a month?',
        options: ['Refund the client their money', 'Roll them over forever so the client can hoard them', 'Enforce a strict "Use It or Lose It" policy to protect your monthly bandwidth', 'Work double the next month for free'],
        correctIndex: 2,
      },
      {
        question: 'What is the best way to collect retainer payments?',
        options: ['Waiting for paper checks in the mail', 'Sending manual invoices and hoping they pay', 'Automatic subscription billing via platforms like Stripe', 'Getting paid in cash'],
        correctIndex: 2,
      },
    ],
    keyTakeaways: [
      'Pitch retainers to solve post-launch anxiety for the client.',
      'Growth retainers command much higher prices than basic maintenance.',
      'Protect your time by defining strict deliverables, not unlimited access.',
      'Automate your billing to eliminate collection friction.',
    ],
  },
  {
    id: 'real-free-9',
    module: 'Module 2: Real-World Execution',
    order: 9,
    title: 'Financial Execution & Cashflow SOP',
    icon: '💸',
    philosophy: 'Revenue is vanity; profit is sanity; cash flow is reality. Earning gold means nothing if you mismanage your treasury and get wiped out by the Tax Boss at the end of the year.',
    concepts: [
      {
        title: '1. The 3-Bank Account System',
        beginner: 'Mix all your freelance income with your personal grocery money in one checking account.',
        advanced: 'Open 3 separate business accounts: Opex (Operating Expenses), Taxes (Do Not Touch), and Profit (Your Salary). This creates physical barriers preventing you from spending tax money.',
      },
      {
        title: '2. The 30% Siphon Rule',
        beginner: 'Wait until tax season to figure out what you owe the government.',
        advanced: 'Every time an invoice clears, immediately transfer 30% of the gross amount into the Tax account. Act like that money never existed. Pay your estimated taxes quarterly from this pool.',
      },
      {
        title: '3. Expense Tracking Automation',
        beginner: 'Keep a shoebox full of crumbled paper receipts.',
        advanced: 'Run every single business expense (software, hosting, courses, internet) through a dedicated Business Credit Card. Integrate this card with QuickBooks or Wave Accounting to automate your write-offs.',
      },
      {
        title: '4. The Net-Zero Draw',
        beginner: 'Pay yourself whatever is left over at the end of a random month.',
        advanced: 'Pay yourself a fixed, consistent "salary" draw every two weeks, just like an employee. Leave a buffer in the Opex account to survive the inevitable "slow months" without stressing.',
      },
    ],
    practical: {
      title: 'Initialize Your Treasury System',
      intro: 'Set up the financial infrastructure required to run a real business.',
      steps: [
        'Open a dedicated Business Checking account (e.g., Mercury, Novo, or local bank).',
        'Open a high-yield Savings account labeled strictly for "Taxes".',
        'Apply for a dedicated Business Credit Card for software and expenses.',
        'Commit to routing 100% of future client payments directly into the Business account, not your personal one.',
      ],
      goal: 'Separate your personal identity from your business entity to protect your cash flow.',
    },
    quiz: [
      {
        question: 'Why is mixing personal and business funds in one account dangerous?',
        options: ['It is illegal to have a personal bank account', 'It makes tracking expenses impossible and destroys your ability to write off taxes accurately', 'Banks will shut down your account instantly', 'It causes the bank app to crash'],
        correctIndex: 1,
      },
      {
        question: 'What is the "30% Siphon Rule"?',
        options: ['Giving 30% of your income to a business coach', 'Transferring 30% of every payment to a dedicated tax account immediately', 'Working 30% less every year', 'Giving clients a 30% discount'],
        correctIndex: 1,
      },
      {
        question: 'How should you manage business expenses like software subscriptions?',
        options: ['Pay with your personal debit card', 'Pay in cash', 'Run them all through a dedicated Business Credit Card integrated with accounting software', 'Ask the client to buy them for you'],
        correctIndex: 2,
      },
      {
        question: 'What is the most stable way to pay yourself as a freelancer?',
        options: ['Take out all the money the moment it arrives', 'Pay yourself a fixed, consistent salary draw while leaving a buffer in the business account', 'Only pay yourself once a year', 'Never pay yourself, reinvest everything'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Segregate your bank accounts immediately.',
      'The Tax Boss always collects; hoard your 30% religiously.',
      'Automate your bookkeeping by isolating expenses to one card.',
      'Pay yourself a stable salary to eliminate month-to-month panic.',
    ],
  },
  {
    id: 'real-free-10',
    module: 'Module 2: Real-World Execution',
    order: 10,
    title: 'Crisis Management: Defusing Client Bombs',
    icon: '💣',
    philosophy: 'Eventually, a project will catch on fire. The server will crash, a deadline will be missed, or a client will explode in anger. Professionals are defined by how they manage the blast radius.',
    concepts: [
      {
        title: '1. The Immediate Confession',
        beginner: 'Hide the mistake and hope the client doesn\'t notice, or blame a third-party tool.',
        advanced: 'Own the failure immediately. Email the client: "I made an error on X. Here is what happened, here is my plan to fix it, and here is when it will be resolved." Extreme ownership builds massive trust.',
      },
      {
        title: '2. Moving to Voice',
        beginner: 'Argue with an angry client over a 40-message email chain.',
        advanced: 'Text lacks tone and breeds hostility. The moment a client expresses severe frustration, stop typing. Say: "I hear your frustration. Let\'s jump on a 5-minute call to resolve this instantly." Voice humanizes the conflict.',
      },
      {
        title: '3. The "Scope Creep" Stand-off',
        beginner: 'Cave in to demands for massive free features to avoid a bad review.',
        advanced: 'Lean on the Contract Shield. Say: "I agree this feature is vital. Let\'s review our initial SOW document. Since this is outside the original scope, we can either swap it for an existing feature or quote it as Phase 2."',
      },
      {
        title: '4. The Tactical Refund',
        beginner: 'Fight a toxic client to the bitter end over a $500 milestone.',
        advanced: 'Sometimes, your time and mental health are worth more than the gold. If a client becomes abusive, execute a tactical refund: "This partnership isn\'t working. I am refunding your last milestone and releasing all files to you. Good luck." Cut the cord.',
      },
    ],
    practical: {
      title: 'The Crisis Protocol Drill',
      intro: 'Prepare your mental scripts for the inevitable disaster.',
      steps: [
        'Draft your "Ownership Script" (Template: "I discovered an issue with X. Here is the fix. It will be live by Y.").',
        'Draft your "De-escalation Script" (Template: "I completely understand why this is frustrating. Let\'s hop on a Zoom call at 2 PM to sort this out.").',
        'Save a copy of your standard Contract SOW to reference quickly when boundaries are pushed.',
      ],
      goal: 'Remove the emotional panic from mistakes by having pre-written crisis protocols.',
    },
    quiz: [
      {
        question: 'What is the correct protocol when you make a major mistake on a project?',
        options: ['Ignore it and hope it goes away', 'Take extreme ownership immediately, explain the fix, and provide a timeline for resolution', 'Blame the client for giving you bad instructions', 'Quit the project immediately'],
        correctIndex: 1,
      },
      {
        question: 'How should you handle an angry client who is sending hostile emails?',
        options: ['Write a 10-paragraph angry email back', 'Stop texting and move the conversation to a live voice or video call to de-escalate', 'Block their email address', 'Give them a 100% refund immediately without talking'],
        correctIndex: 1,
      },
      {
        question: 'What is the most professional way to reject massive scope creep?',
        options: ['Tell them they are being greedy', 'Reference the original signed Scope of Work and offer the new feature as a paid Phase 2', 'Do it for free but complain the whole time', 'Ignore the request completely'],
        correctIndex: 1,
      },
      {
        question: 'When is a "Tactical Refund" the right move?',
        options: ['Whenever you get slightly bored with the work', 'When a client becomes abusive or toxic, and cutting ties saves your mental health and time', 'When you want to impress the client', 'Never, keep the money at all costs'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Take extreme ownership of mistakes to build unbreakable trust.',
      'Always move heated conflicts off text and onto voice calls.',
      'Use the original contract to logically deflect scope creep.',
      'Protect your sanity by firing abusive clients, even if it costs a refund.',
    ],
  },
  {
    id: 'real-free-11',
    module: 'Module 2: Real-World Execution',
    order: 11,
    title: 'Building Your SOPs (Standard Operating Procedures)',
    icon: '📋',
    philosophy: 'If you are doing a task the exact same way for the 5th time, you are wasting energy. SOPs are the blueprints of your business; they turn chaotic freelancing into a smooth, scalable machine.',
    concepts: [
      {
        title: '1. What Needs an SOP?',
        beginner: 'Only write rules for big coding projects.',
        advanced: 'Everything repeatable needs a system: Client Onboarding, File Structuring, Deploying a Site, Sending an Invoice, and Writing a Proposal. If it happens more than twice, systematize it.',
      },
      {
        title: '2. The Loom + Notion Combo',
        beginner: 'Write a 20-page Word document that no one will ever read.',
        advanced: 'Hit record on Loom. Talk through the task while doing it on screen. Paste the Loom link into a Notion page and use AI to transcribe the video into bullet points. Boom: Instant SOP.',
      },
      {
        title: '3. The "Truck Factor"',
        beginner: 'Store all the passwords, workflows, and client preferences in your own brain.',
        advanced: 'Increase your "Truck Factor" (how many people need to be hit by a truck for the business to fail). If you get sick for a week, a subcontractor should be able to read your SOPs and run the business without calling you.',
      },
      {
        title: '4. Iteration',
        beginner: 'Write an SOP once and never look at it again.',
        advanced: 'Treat SOPs like living code repositories. When a client asks a confusing question, it means your Onboarding SOP had a bug. Update the Notion doc immediately to patch the leak for the next client.',
      },
    ],
    practical: {
      title: 'Record Your First SOP',
      intro: 'Systematize one bottleneck in your business today.',
      steps: [
        'Identify the most annoying, repetitive admin task you do (e.g., setting up a local dev environment or sending an invoice).',
        'Turn on Loom and record your screen while executing the task perfectly.',
        'Speak your thoughts out loud: "I click here because X, and make sure not to do Y." ',
        'Create a "Systems" database in Notion. Paste the video and summarize the 5 main steps.',
      ],
      goal: 'Reclaim mental bandwidth by offloading your processes into documented systems.',
    },
    quiz: [
      {
        question: 'What is the fastest modern method for creating a Standard Operating Procedure (SOP)?',
        options: ['Writing a 50-page technical manual', 'Recording a screen-share Loom video while doing the task and transcribing it into bullet points', 'Hiring an expensive consultant', 'Memorizing it'],
        correctIndex: 1,
      },
      {
        question: 'Which tasks should be turned into an SOP?',
        options: ['Only highly creative design work', 'Only tasks you do once a year', 'Any repetitive task you execute more than twice (Onboarding, Invoicing, Deployments)', 'None, freelancing should be spontaneous'],
        correctIndex: 2,
      },
      {
        question: 'What does the "Truck Factor" refer to in business?',
        options: ['How much it costs to ship physical goods', 'The number of people who hold critical knowledge; if they vanish, the business halts', 'The size of the server you need', 'A metric for measuring website traffic'],
        correctIndex: 1,
      },
      {
        question: 'When should an SOP be updated?',
        options: ['Never, it is a permanent document', 'Every 10 years', 'Immediately, whenever a process breaks down or a client gets confused (patching the bug)', 'Only when you hire a new CEO'],
        correctIndex: 2,
      },
    ],
    keyTakeaways: [
      'Systematize the repetitive to make room for the creative.',
      'Use screen recordings to generate SOPs effortlessly.',
      'Get the operational knowledge out of your head and onto paper.',
      'Treat client friction as a bug report for your SOPs.',
    ],
  },
  {
    id: 'real-free-12',
    module: 'Module 2: Real-World Execution',
    order: 12,
    title: 'Scaling: Hiring Your First Subcontractor',
    icon: '🤝',
    philosophy: 'You can only grind so many hours a week before you burn out. To break the income ceiling, you must transition from a solo player to a guild leader. Buy back your time by delegating low-leverage tasks.',
    concepts: [
      {
        title: '1. The $20/hr vs $100/hr Audit',
        beginner: 'Do everything yourself to save money.',
        advanced: 'Audit your week. Are you, the $100/hr developer, spending 10 hours doing data entry, basic CSS tweaks, or sending emails? You are losing money. Delegate $20/hr tasks to make room for $100/hr work.',
      },
      {
        title: '2. The Trial Quest',
        beginner: 'Hire the first person who sends you a resume on Upwork and give them full access to a client project.',
        advanced: 'Never risk a live client. Hire 3 different freelancers for a small, $50 paid "Trial Quest" (e.g., building a single component). Assess their communication, speed, and code quality before giving them the real job.',
      },
      {
        title: '3. Asynchronous Management',
        beginner: 'Micromanage your subcontractor via constant Slack messages.',
        advanced: 'Manage via SOPs and Tickets. Assign a task in Linear/Trello, attach the Loom SOP from Lesson 11, and set a strict deadline. If the SOP is good, they shouldn\'t need to talk to you until the work is done.',
      },
      {
        title: '4. White-Labeling & Margins',
        beginner: 'Charge the client exactly what the subcontractor charges you, making zero profit.',
        advanced: 'You are now the Project Manager. If you pay a subcontractor $30/hr, you bill the client $90/hr. The $60 difference is your margin for finding the client, managing the QA, and holding the risk.',
      },
    ],
    practical: {
      title: 'Run a Task Audit',
      intro: 'Identify exactly what you need to outsource.',
      steps: [
        'Track every hour of your work this week using a tool like Toggl.',
        'At the end of the week, highlight every task that required zero creative thinking or senior-level skill.',
        'Calculate how many hours those low-level tasks took.',
        'Write a job description for an assistant or junior dev to take over exactly those hours.',
      ],
      goal: 'Visualize how much time and money you are wasting on low-leverage tasks.',
    },
    quiz: [
      {
        question: 'What is the most logical way to decide what to outsource first?',
        options: ['Outsource the most important client meetings', 'Outsource low-leverage ($20/hr) tasks so you can focus on high-leverage ($100/hr) tasks', 'Outsource the things you enjoy doing the most', 'Flip a coin'],
        correctIndex: 1,
      },
      {
        question: 'How should you evaluate a new subcontractor safely?',
        options: ['Give them the login to your main client database on day one', 'Trust their portfolio and give them a massive project', 'Assign a small, paid "Trial Quest" isolated from real clients to test their actual execution', 'Interview them for 5 hours'],
        correctIndex: 2,
      },
      {
        question: 'What is the secret to managing a subcontractor without micromanaging?',
        options: ['Calling them every 30 minutes', 'Using clear SOPs (Standard Operating Procedures) and asynchronous ticketing systems (Trello/Linear)', 'Working in the exact same room as them', 'Screaming at them'],
        correctIndex: 1,
      },
      {
        question: 'Why do you charge the client more than you pay the subcontractor?',
        options: ['Because it is a scam', 'To cover your overhead, QA management time, and the risk you hold as the agency owner', 'Because the subcontractor is always wrong', 'Because taxes are 100%'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Your time is mathematically too valuable for admin work.',
      'Always test new hires with a paid, isolated trial task.',
      'Good management relies on robust SOPs, not constant chatting.',
      'Profit margin is the reward for managing the client and taking the risk.',
    ],
  }
];

export const getRealFreelanceLessonById = (id: string): RealFreelanceLesson | undefined =>
  REAL_FREELANCE_LESSONS.find(l => l.id === id);

export const isRealFreelanceLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = REAL_FREELANCE_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(REAL_FREELANCE_LESSONS[idx - 1].id);
};
