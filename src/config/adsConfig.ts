/**
 * Central configuration for CodeSage's Adsterra sponsor links.
 * All ads are centralized as direct sponsor links across designated high-intent spots.
 */

export interface AdZoneConfig {
  enabled: boolean;
  network?: 'adsterra' | 'monetag' | 'direct';
  title?: string;
  adsterraSmartLink?: string;
  monetagSmartLink?: string;
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
  displayDomain: string;
}

// Active Adsterra Configuration
export const ADSTERRA_DIRECT_LINK_1 = 'https://asiafilm.org/4/eca5e087800bb710d5fbb6dc8255917b';
export const ADSTERRA_DIRECT_LINK_2 = 'https://asiafilm.org/4/eca5e087800bb710d5fbb6dc8255917b';

// Backwards-compatible aliases for legacy references
export const MONETAG_DIRECT_LINK_1 = ADSTERRA_DIRECT_LINK_1;
export const MONETAG_DIRECT_LINK_2 = ADSTERRA_DIRECT_LINK_2;

export const ADS_CONFIG = {
  // Global toggle
  enabled: true,

  // Local sponsor prompt only; no automatic popup scripts or impression simulation.
  lessonStart: { enabled: true, cooldownMinutes: 10 },

  // Active Adsterra Direct Links
  adsterraDirectLink: ADSTERRA_DIRECT_LINK_1,
  adsterraDirectLinkSecondary: ADSTERRA_DIRECT_LINK_2,
  adsterraDirectLinks: [ADSTERRA_DIRECT_LINK_1, ADSTERRA_DIRECT_LINK_2],

  // Backwards-compatible aliases so legacy references work seamlessly
  monetagDirectLink: ADSTERRA_DIRECT_LINK_1,
  monetagDirectLinkSecondary: ADSTERRA_DIRECT_LINK_2,
  monetagDirectLinks: [ADSTERRA_DIRECT_LINK_1, ADSTERRA_DIRECT_LINK_2],

  // Primary external sponsor URL
  defaultSponsorLink: ADSTERRA_DIRECT_LINK_1,

  // Partner Referral Link
  monetagReferralLink: ADSTERRA_DIRECT_LINK_1,

  // How many seconds each ad rotates inside any live banner
  bannerRotationIntervalSec: 12,

  // Duration of each voluntary Support Us ad in seconds
  supportAdDurationSec: 15,

  // Live rotating ad creatives backed by Adsterra Direct Links
  liveCreatives: [
    {
      id: 'adsterra-live-1',
      tag: 'Verified Partner Offer',
      badge: 'SPONSORED',
      headline: 'Featured Developer Offer · Click to Open Partner Deal',
      subtext: 'Real-time developer tool and cloud offers supporting CodeSage.',
      cta: 'Open Partner Deal',
      accentColor: 'from-cyan-500/20 via-primary/15 to-blue-600/20',
      url: ADSTERRA_DIRECT_LINK_1,
      displayDomain: 'asiafilm.org',
    },
    {
      id: 'adsterra-live-2',
      tag: 'Developer Cloud Offer',
      badge: 'LIVE OFFER',
      headline: 'Trending Partner Promotion · Supporting Free Student Servers',
      subtext: 'Explore verified cloud infrastructure and dev tools.',
      cta: 'View Partner Offer',
      accentColor: 'from-emerald-500/20 via-teal-500/15 to-primary/20',
      url: ADSTERRA_DIRECT_LINK_2,
      displayDomain: 'asiafilm.org',
    },
    {
      id: 'adsterra-live-3',
      tag: 'Tech Partner Showcase',
      badge: 'PARTNER AD',
      headline: 'Exclusive Developer & Tech Partner Showcase',
      subtext: 'Every view directly funds CodeSage free coding tracks.',
      cta: 'Visit Partner',
      accentColor: 'from-purple-500/20 via-indigo-500/15 to-primary/20',
      url: ADSTERRA_DIRECT_LINK_1,
      displayDomain: 'asiafilm.org',
    },
  ] as LiveAdCreative[],

  // Central slot mappings
  slots: {
    dashboardSidebar: {
      enabled: true,
      network: 'adsterra' as const,
      title: 'Verified Sponsor Offer',
      adsterraSmartLink: ADSTERRA_DIRECT_LINK_1,
      monetagSmartLink: ADSTERRA_DIRECT_LINK_1,
    },
    dashboardContinueLearning: {
      enabled: true,
      network: 'adsterra' as const,
      title: 'Developer Tech Partner',
      adsterraSmartLink: ADSTERRA_DIRECT_LINK_1,
      monetagSmartLink: ADSTERRA_DIRECT_LINK_1,
    },
    lessonSidebar: {
      enabled: true,
      network: 'adsterra' as const,
      title: 'Developer Sponsor',
      adsterraSmartLink: ADSTERRA_DIRECT_LINK_1,
      monetagSmartLink: ADSTERRA_DIRECT_LINK_1,
    },
    marketplace: {
      enabled: true,
      network: 'adsterra' as const,
      title: 'Partner Showcase',
      adsterraSmartLink: ADSTERRA_DIRECT_LINK_1,
      monetagSmartLink: ADSTERRA_DIRECT_LINK_1,
    },
    learnTrackPage: {
      enabled: true,
      network: 'adsterra' as const,
      title: 'Developer Track Sponsor',
      adsterraSmartLink: ADSTERRA_DIRECT_LINK_1,
      monetagSmartLink: ADSTERRA_DIRECT_LINK_1,
    },
    supportPageTop: {
      enabled: true,
      network: 'adsterra' as const,
      title: 'Verified Sponsor Feed',
      adsterraSmartLink: ADSTERRA_DIRECT_LINK_1,
      monetagSmartLink: ADSTERRA_DIRECT_LINK_1,
    },
    supportPageMid: {
      enabled: true,
      network: 'adsterra' as const,
      title: 'Developer Network Offer',
      adsterraSmartLink: ADSTERRA_DIRECT_LINK_2,
      monetagSmartLink: ADSTERRA_DIRECT_LINK_2,
    },
  },

  // Contact for direct payment & sponsorships
  supportContacts: {
    adminEmail: 'zainrao.dev@gmail.com',
    adminTelegram: 'https://t.me/codesage_admin',
    paymentJazzCashNote: 'Contact Admin for verified 0% fee JazzCash transfer details',
    paymentBinanceNote: 'Contact Admin for verified Binance Pay ID or USDT TRC-20 address',
  },
};
