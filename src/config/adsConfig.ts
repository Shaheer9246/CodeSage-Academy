/**
 * Central Configuration for CodeSage Sponsor Ads & Monetization
 * Supports Monetag (High-CPM Instant Payouts) & EthicalAds (Developer Privacy Banners)
 */

export interface AdZoneConfig {
  enabled: boolean;
  network?: 'ethicalads' | 'monetag' | 'direct';
  title?: string;
  monetagZoneId?: string;
  monetagSmartLink?: string;
  ethicalAdsPlacement?: string;
}

export const ADS_CONFIG = {
  // Global toggle
  enabled: true,

  // EthicalAds Publisher ID (Replace with your Publisher ID from ethicalads.io dashboard)
  ethicalAdsPublisherId: 'codesage-academy',

  // Monetag Publisher Zone ID
  monetagDefaultZoneId: '285789',

  // User's Monetag Referral Link (for other developers to sign up and earn commission)
  monetagReferralLink: 'https://monetag.com/?ref_id=tHSJ',

  // Fallback / Default sponsored partner URLs
  defaultSponsorLink: 'https://codesageacademy.netlify.app/support-us',
  monetagDirectLink: '', // Paste your Monetag Direct Link here when generated from your Monetag dashboard

  // Ad slot placements
  slots: {
    // Secondary Sidebar Top Banner
    dashboardSidebar: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Dev Sponsor',
      monetagZoneId: '285789',
    },
    // Secondary Sidebar Big Ad under Categories (Monetag Big Ad Box)
    dashboardSidebarMonetagBig: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag High-CPM Sponsor',
      monetagZoneId: '285789',
    },
    // Dashboard Continue Learning / Resume Banner
    dashboardContinueLearning: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Tech Partner',
      monetagZoneId: '',
    },
    // Lesson Sidebar
    lessonSidebar: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Developer Sponsor',
      monetagZoneId: '',
    },
    // Other main pages
    marketplace: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Partner Showcase',
      monetagZoneId: '',
    },
    inbox: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Dev Sponsor',
      monetagZoneId: '',
    },
    exams: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Certification Partner',
      monetagZoneId: '',
    },
    aiTeacher: {
      enabled: true,
      network: 'monetag' as const,
      title: 'AI Cloud Compute Sponsor',
      monetagZoneId: '',
    },
    profile: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Developer Career Sponsor',
      monetagZoneId: '',
    },
    learnTrackPage: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Developer Track Sponsor',
      monetagZoneId: '',
    },
    supportPageTop: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag High-CPM Sponsor',
      monetagZoneId: '',
    },
    supportPageMid: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Dev Network',
      monetagZoneId: '',
    },
    supportPageBottom: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Tech Affiliate & Tools',
      monetagZoneId: '',
    },
  },

  // Contact for direct payment & sponsorships
  supportContacts: {
    adminEmail: 'shaheerwrites703@gmail.com',
    adminTelegram: 'https://t.me/codesage_admin',
    paymentJazzCashNote: 'Contact Admin for verified 0% fee JazzCash transfer details',
    paymentBinanceNote: 'Contact Admin for verified Binance Pay ID or USDT TRC-20 address',
  },
};
