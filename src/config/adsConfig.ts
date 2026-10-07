/**
 * Central Configuration for CodeSage Real Monetag Ads & Monetization
 * Wired with:
 * - Vignette Banner Zone: 11911764 (https://n6wxm.com/vignette.min.js)
 * - In-Page Push Zone: 11911770 (https://nap5k.com/tag.min.js)
 * - Direct SmartLink 1 (Positive link): https://omg10.com/4/11911757
 * - Direct SmartLink 2 (Joyful link): https://omg10.com/4/11858088
 */

export interface AdZoneConfig {
  enabled: boolean;
  network?: 'ethicalads' | 'monetag' | 'direct';
  title?: string;
  monetagZoneId?: string;
  monetagSmartLink?: string;
  ethicalAdsPlacement?: string;
}

export interface LiveAdCreative {
  id: string;
  tag: string;
  badge: string;
  headline: string;
  subtext: string;
  cta: string;
  accentColor: string;
  url: string;
  zoneId: string;
  scriptSrc: string;
  displayDomain: string;
}

export const MONETAG_DIRECT_LINK_1 = 'https://omg10.com/4/11911757'; // Positive link · 11911757
export const MONETAG_DIRECT_LINK_2 = 'https://omg10.com/4/11858088'; // Joyful link · 11858088
export const MONETAG_VIGNETTE_ZONE = '11911764';
export const MONETAG_VIGNETTE_SRC = 'https://n6wxm.com/vignette.min.js';
export const MONETAG_INPAGE_ZONE = '11911770';
export const MONETAG_INPAGE_SRC = 'https://nap5k.com/tag.min.js';

export const ADS_CONFIG = {
  // Global toggle
  enabled: true,

  // Local sponsor prompt only; no automatic popup scripts or impression simulation.
  lessonStart: { enabled: true, cooldownMinutes: 10 },

  // EthicalAds Publisher ID
  ethicalAdsPublisherId: 'codesage-academy',

  // Real Monetag Zones & Scripts
  monetagDomain: 'nap5k.com',
  monetagDefaultZoneId: MONETAG_INPAGE_ZONE,
  monetagInPageZoneId: MONETAG_INPAGE_ZONE,
  monetagInPageScriptSrc: MONETAG_INPAGE_SRC,
  monetagVignetteZoneId: MONETAG_VIGNETTE_ZONE,
  monetagVignetteScriptSrc: MONETAG_VIGNETTE_SRC,

  // Real Monetag Direct Links (SmartLinks that pay for every view/click)
  monetagDirectLink: MONETAG_DIRECT_LINK_1,
  monetagDirectLinkSecondary: MONETAG_DIRECT_LINK_2,
  monetagDirectLinks: [MONETAG_DIRECT_LINK_1, MONETAG_DIRECT_LINK_2],

  // Fallback sponsor URL -> points to real Monetag Direct Link so clicks always earn revenue
  defaultSponsorLink: MONETAG_DIRECT_LINK_1,

  // User's Monetag Publisher Referral Link (only used on the "Monetize Your Own Site" button)
  monetagReferralLink: 'https://monetag.com/?ref_id=tHSJ',

  // How many seconds each ad rotates inside the live banner
  bannerRotationIntervalSec: 12,

  // Duration of each Support Us ad in seconds
  supportAdDurationSec: 30,

  // Live rotating ad feeds backed by your real Monetag Direct Links & Zones
  liveCreatives: [
    {
      id: 'monetag-live-1',
      tag: 'Monetag Live Feed · Zone #11911757',
      badge: 'SPONSORED AD',
      headline: 'Featured Sponsor Offer · Click to Open Live Partner Deal',
      subtext: 'Real-time advertiser feed powered by Monetag Direct SmartLink #11911757.',
      cta: 'Open Sponsored Ad',
      accentColor: 'from-cyan-500/20 via-primary/15 to-blue-600/20',
      url: MONETAG_DIRECT_LINK_1,
      zoneId: MONETAG_INPAGE_ZONE,
      scriptSrc: MONETAG_INPAGE_SRC,
      displayDomain: 'omg10.com/4/11911757',
    },
    {
      id: 'monetag-live-2',
      tag: 'Monetag Live Feed · Zone #11858088',
      badge: 'LIVE OFFER',
      headline: 'Trending Partner Promotion · Supporting Free Student Servers',
      subtext: 'Interactive sponsor showcase powered by Monetag Direct SmartLink #11858088.',
      cta: 'View Sponsor Offer',
      accentColor: 'from-emerald-500/20 via-teal-500/15 to-primary/20',
      url: MONETAG_DIRECT_LINK_2,
      zoneId: MONETAG_VIGNETTE_ZONE,
      scriptSrc: MONETAG_VIGNETTE_SRC,
      displayDomain: 'omg10.com/4/11858088',
    },
    {
      id: 'monetag-live-3',
      tag: 'Monetag Vignette · Zone #11911764',
      badge: 'PARTNER AD',
      headline: 'Exclusive Developer & Tech Partner Showcase',
      subtext: 'Every view and click directly funds CodeSage free coding tracks.',
      cta: 'Visit Advertiser',
      accentColor: 'from-purple-500/20 via-indigo-500/15 to-primary/20',
      url: MONETAG_DIRECT_LINK_1,
      zoneId: MONETAG_VIGNETTE_ZONE,
      scriptSrc: MONETAG_VIGNETTE_SRC,
      displayDomain: 'n6wxm.com · #11911764',
    },
    {
      id: 'monetag-live-4',
      tag: 'Monetag In-Page · Zone #11911770',
      badge: 'LIVE STREAM',
      headline: 'Global Advertiser Feed · Keep CodeSage 100% Free',
      subtext: 'Live sponsor stream via Monetag In-Page Push & SmartLink network.',
      cta: 'Open Ad Link',
      accentColor: 'from-amber-500/20 via-orange-500/15 to-primary/20',
      url: MONETAG_DIRECT_LINK_2,
      zoneId: MONETAG_INPAGE_ZONE,
      scriptSrc: MONETAG_INPAGE_SRC,
      displayDomain: 'nap5k.com · #11911770',
    },
  ] as LiveAdCreative[],

  // Ad slot placements across the platform
  slots: {
    dashboardSidebar: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Live Ad',
      monetagZoneId: MONETAG_INPAGE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
    },
    dashboardSidebarMonetagBig: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Live Stream',
      monetagZoneId: MONETAG_VIGNETTE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_2,
    },
    dashboardContinueLearning: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Tech Partner',
      monetagZoneId: MONETAG_INPAGE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
    },
    lessonSidebar: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Live Sponsor',
      monetagZoneId: MONETAG_INPAGE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_2,
    },
    marketplace: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Partner Showcase',
      monetagZoneId: MONETAG_VIGNETTE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
    },
    inbox: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Dev Sponsor',
      monetagZoneId: MONETAG_INPAGE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_2,
    },
    exams: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Certification Partner',
      monetagZoneId: MONETAG_VIGNETTE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
    },
    aiTeacher: {
      enabled: true,
      network: 'monetag' as const,
      title: 'AI Cloud Compute Sponsor',
      monetagZoneId: MONETAG_INPAGE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_2,
    },
    profile: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Developer Career Sponsor',
      monetagZoneId: MONETAG_VIGNETTE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
    },
    learnTrackPage: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Developer Track Sponsor',
      monetagZoneId: MONETAG_INPAGE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
    },
    supportPageTop: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Live Ad Feed',
      monetagZoneId: MONETAG_VIGNETTE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
    },
    supportPageMid: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Monetag Dev Network',
      monetagZoneId: MONETAG_INPAGE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_2,
    },
    supportPageBottom: {
      enabled: true,
      network: 'monetag' as const,
      title: 'Tech Affiliate & Tools',
      monetagZoneId: MONETAG_VIGNETTE_ZONE,
      monetagSmartLink: MONETAG_DIRECT_LINK_1,
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
