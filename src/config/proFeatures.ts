/**
 * Central Configuration for CodeSage FREE vs PRO capabilities.
 * Controls feature gating, usage limits, unlocked tracks, AI quotas, and future expansion.
 */

export interface ProFeatureConfig {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'curriculum' | 'tools' | 'community';
  isProOnly: boolean;
  freeLimit: string | number;
  proLimit: string | number;
}

export const PRO_FEATURES: Record<string, ProFeatureConfig> = {
  // AI Mentorship & Intelligent Features
  ai_teacher_credits: {
    id: 'ai_teacher_credits',
    name: 'AI Teacher Mentor Queries',
    description: 'Real-time contextual code hints, syntax debugging, and line-by-line explanation inside lesson editors.',
    category: 'ai',
    isProOnly: false,
    freeLimit: '5 queries / month',
    proLimit: '100 queries / month (Instant response)',
  },
  ai_interviewer: {
    id: 'ai_interviewer',
    name: 'AI Technical Interviewer',
    description: 'Live interactive coding interviews simulation with dynamic behavioral and algorithmic feedback.',
    category: 'ai',
    isProOnly: true,
    freeLimit: 'Locked (Pro only)',
    proLimit: 'Unlimited mock interview sessions',
  },
  ai_career_counselor: {
    id: 'ai_career_counselor',
    name: 'AI Career Counselor & Portfolio Review',
    description: 'Personalized career path advising, CV critiques, and project portfolio positioning.',
    category: 'ai',
    isProOnly: true,
    freeLimit: 'Locked (Pro only)',
    proLimit: 'Unlimited career guidance sessions',
  },

  // Curriculum & Tracks Access
  standard_tracks: {
    id: 'standard_tracks',
    name: '18 Full Core Curriculum Tracks',
    description: 'Full access to Frontend, Python Core, Systems C, Java, SQL, and 3D Graphics.',
    category: 'curriculum',
    isProOnly: false,
    freeLimit: '2 active enrollments at a time',
    proLimit: 'Unlimited concurrent active enrollments',
  },
  expert_tracks: {
    id: 'expert_tracks',
    name: 'Advanced & Specialized Tracks',
    description: 'Python Expert, Systems C Expert, Enterprise Java Architect, and Intermediate AI.',
    category: 'curriculum',
    isProOnly: false,
    freeLimit: 'Included for all learners',
    proLimit: 'Included + Priority milestone review',
  },

  // Developer Tools & Multilingual
  global_translator: {
    id: 'global_translator',
    name: 'Real-Time Curriculum Translator',
    description: 'Translate any lesson, quiz, or UI into Urdu, Hindi, Arabic, Bengali, Chinese, and 10+ languages.',
    category: 'tools',
    isProOnly: false,
    freeLimit: 'English & Urdu preview',
    proLimit: 'All 14 Regional & Global Languages',
  },
  dev_marketplace: {
    id: 'dev_marketplace',
    name: 'Developer Marketplace',
    description: 'Download starter repositories, curated problem sets, tools, and developer themes.',
    category: 'tools',
    isProOnly: false,
    freeLimit: 'Free community starter kits',
    proLimit: 'All Premium starter kits & dev themes',
  },
  priority_code_runner: {
    id: 'priority_code_runner',
    name: 'Cloud Code Execution & Sandboxes',
    description: 'Instant WASM and iframe sandbox code execution with zero queuing latency.',
    category: 'tools',
    isProOnly: false,
    freeLimit: 'Standard execution speed',
    proLimit: 'Priority Turbo execution',
  },
  profile_flair: {
    id: 'profile_flair',
    name: 'Exclusive PRO Profile Badge & Flair',
    description: 'Gold crown indicator on profile, community comments, and student ID card.',
    category: 'community',
    isProOnly: true,
    freeLimit: 'Free Student Badge',
    proLimit: 'Gold PRO Crown + Verified Student ID',
  },
};

/**
 * Pricing structure tailored for affordability for students in Pakistan and Asia.
 */
export const PRO_PRICING = {
  currency_pkr: {
    monthly: 499, // ~ $1.80 USD
    annual: 3999, // ~ $14.30 USD
    label: 'PKR',
    jazzcash_available: true,
    easypaisa_available: true,
  },
  currency_usd: {
    monthly: 2.99,
    annual: 19.99,
    label: 'USD',
  },
  lemon_squeezy: {
    store_slug: 'codesage',
    monthly_url: 'https://codesage.lemonsqueezy.com/buy/monthly',
    annual_url: 'https://codesage.lemonsqueezy.com/buy/annual',
  }
};

/**
 * Utility helper to check if a specific feature is enabled for a user profile.
 */
export function isFeatureAllowed(featureId: keyof typeof PRO_FEATURES, isPro: boolean): boolean {
  const feature = PRO_FEATURES[featureId];
  if (!feature) return true;
  if (!feature.isProOnly) return true;
  return isPro;
}
