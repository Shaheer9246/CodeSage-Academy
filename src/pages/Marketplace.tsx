import { useState } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Gamepad2,
  Wrench,
  Sparkles,
  Search,
  ArrowUpRight,
  Gift,
  ShieldCheck,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { AdBannerCard } from '@/components/AdBannerCard';

interface MarketItem {
  id: string;
  title: string;
  category: 'affiliate' | 'tools' | 'games';
  badge: string;
  description: string;
  link: string;
  perk?: string;
  isAffiliate?: boolean;
  playable?: boolean;
  gameEmbedUrl?: string;
  iconName: 'hosting' | 'ai' | 'tool' | 'game';
}

const MARKETPLACE_ITEMS: MarketItem[] = [
  // --- AFFILIATE & FREE CREDITS (TODO: Update referral links soon) ---
  {
    id: 'monetag-publisher',
    title: 'Monetag Ad Network & Monetization',
    category: 'affiliate',
    badge: 'Monetize Websites Free',
    description: 'Turn your websites, web apps, and projects into cash. Join Monetag to run clean banners, in-page push, and smart monetization with instant payouts.',
    link: 'https://monetag.com/?ref_id=tHSJ',
    perk: 'Earn revenue from your web visitors from day 1 with zero setup fee',
    isAffiliate: true,
    iconName: 'tool',
  },
  {
    id: 'hostinger-dev',
    title: 'Hostinger Cloud & VPS Hosting',
    category: 'affiliate',
    badge: 'Up to 75% OFF + Free Domain',
    description: 'Ultra-fast web and full-stack cloud hosting for student projects. Includes free SSL, Git integration, and automated Docker deploys.',
    link: 'https://www.hostinger.com?REFERRALCODE=CODESAGE',
    perk: 'Claim free .com domain + 100 free email addresses',
    isAffiliate: true,
    iconName: 'hosting',
  },
  {
    id: 'neural-cloud-inference',
    title: 'Ultra-Fast Neural Inference API',
    category: 'affiliate',
    badge: '100% Free API Tier',
    description: 'Instant ultra-low latency AI inference engine powered by specialized hardware. Generate 500+ tokens per second on open models.',
    link: 'https://console.groq.com/keys',
    perk: 'Free developer tier: 30 requests/min with no credit card required',
    isAffiliate: false,
    iconName: 'ai',
  },
  {
    id: 'supabase-free',
    title: 'Supabase PostgreSQL & Auth',
    category: 'affiliate',
    badge: 'Generous Free Tier',
    description: 'The open-source Firebase alternative. Dedicated Postgres database, authentication, instant REST/GraphQL APIs, and Edge Functions.',
    link: 'https://supabase.com',
    perk: '2 free production databases with up to 500MB storage',
    isAffiliate: false,
    iconName: 'tool',
  },
  {
    id: 'render-cloud',
    title: 'Render Web Services',
    category: 'affiliate',
    badge: 'Free Web Services',
    description: 'Deploy Node.js, Python, Rust, and Go backends directly from your GitHub repositories with automatic continuous deployment.',
    link: 'https://render.com',
    perk: '750 free monthly server hours for student projects',
    isAffiliate: false,
    iconName: 'hosting',
  },

  // --- FREE DEVELOPER TOOLS (Verified & Enhanced) ---
  {
    id: 'transform-tools',
    title: 'Transform.tools',
    category: 'tools',
    badge: 'All-in-One Converter',
    description: 'Instantly convert JSON to TypeScript types, SVG to React JSX, CSS to Tailwind, HTML to JSX, and SQL to Prisma schemas in your browser.',
    link: 'https://transform.tools',
    perk: 'No signup, 100% browser-based code generation',
    iconName: 'tool',
  },
  {
    id: 'regex101',
    title: 'Regex101 Debugger',
    category: 'tools',
    badge: 'Essential Utility',
    description: 'Test, debug, and optimize regular expressions in real-time with comprehensive breakdown explanations and syntax highlighting.',
    link: 'https://regex101.com',
    perk: 'Supports PCRE, Python, JavaScript, and Golang flavors',
    iconName: 'tool',
  },
  {
    id: 'dbdiagram',
    title: 'dbdiagram.io',
    category: 'tools',
    badge: 'ERD Generator',
    description: 'Quickly design and visualize relational database schemas using simple syntax. Export directly to PostgreSQL, MySQL, and SQL Server DDL.',
    link: 'https://dbdiagram.io',
    perk: 'Free unlimited public schema diagrams and SQL export',
    iconName: 'tool',
  },
  {
    id: 'quicktype',
    title: 'QuickType Generator',
    category: 'tools',
    badge: 'API Tool',
    description: 'Generate strongly-typed models, serializers, and client code from JSON payloads in TypeScript, C++, Python, Java, C#, and Swift.',
    link: 'https://quicktype.io',
    perk: 'Instant code generation for 20+ programming languages',
    iconName: 'tool',
  },
  {
    id: 'carbon',
    title: 'Carbon Code Snippets',
    category: 'tools',
    badge: 'Design Utility',
    description: 'Create and share beautiful, high-quality images of your source code. Perfect for documentation, social media, or presentations.',
    link: 'https://carbon.now.sh',
    perk: 'Highly customizable themes, fonts, and window styles',
    iconName: 'tool',
  },
  {
    id: 'json-crack',
    title: 'JSON Crack',
    category: 'tools',
    badge: 'Data Visualizer',
    description: 'Visualize JSON data instantly into interactive graphs and trees. Makes understanding complex, nested API responses effortless.',
    link: 'https://jsoncrack.com',
    perk: 'Free online JSON to graph visualization tool',
    iconName: 'tool',
  },
  {
    id: 'excalidraw',
    title: 'Excalidraw',
    category: 'tools',
    badge: 'Virtual Whiteboard',
    description: 'Collaborative whiteboard tool that lets you easily sketch diagrams with a hand-drawn feel. Perfect for system design and architecture.',
    link: 'https://excalidraw.com',
    perk: 'End-to-end encrypted, open-source, and completely free',
    iconName: 'tool',
  },

  // --- FREE GAMES (Mobile Focus) ---
  {
    id: 'tekken-6-mobile',
    title: 'Tekken 6 (Mobile)',
    category: 'games',
    badge: 'Free to Play',
    description: 'Play Tekken 6 for free. Download directly from the Play Store on your mobile device. More games will be added soon for your refreshment.',
    link: 'https://play.google.com/store/search?q=tekken+offline+psp+6&c=apps&hl=en',
    perk: 'Mobile optimized – Download now to unleash your combos',
    playable: false,
    iconName: 'game',
  },
];

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'all' | 'affiliate' | 'tools' | 'games'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGameEmbed, setActiveGameEmbed] = useState<MarketItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = MARKETPLACE_ITEMS.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-primary/20 bg-gradient-to-br from-card via-card/90 to-primary/5">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Developer Marketplace & Mobile Arcade</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Curated Dev Perks, Essential Tools & Gaming
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Discover exclusive cloud credits, essential browser-based engineering utilities, and mobile gaming downloads to recharge your focus between coding sessions.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              100% Free Resources
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Verified Safe Tools
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              Mobile Ready
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Category Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="inline-flex p-1 bg-secondary/50 rounded-2xl border border-border/40 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Items ({MARKETPLACE_ITEMS.length})
          </button>
          <button
            onClick={() => setActiveTab('affiliate')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'affiliate'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Perks & Credits</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'tools'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Free Dev Tools</span>
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Arcade & Games</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tools, games, perks..."
            className="w-full bg-secondary/50 text-foreground text-xs rounded-xl pl-9 pr-3 py-2 border border-border/40 focus:outline-none focus:border-primary transition-all font-mono placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Featured High-CPM Monetag Partner Box */}
      <div>
        <AdBannerCard slotName="marketplace" format="big-box" />
      </div>

      {/* Grid of Marketplace Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="glass-card-hover p-5 rounded-2xl border border-border/40 bg-card/40 flex flex-col justify-between group transition-all"
          >
            <div className="space-y-3">
              {/* Card Header: Category Icon & Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                  {item.category === 'games' ? (
                    <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  ) : item.category === 'affiliate' ? (
                    <Gift className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Wrench className="w-5 h-5 text-primary" />
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {item.badge}
                  </span>
                  {item.isAffiliate && (
                    <span className="text-[9px] font-mono text-muted-foreground/70 uppercase">
                      Sponsored Lead
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              {/* Special Perk Highlight */}
              {item.perk && (
                <div className="p-2 rounded-xl bg-secondary/60 border border-border/30 text-[11px] text-foreground/90 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span className="line-clamp-1">{item.perk}</span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-border/30 flex items-center justify-between gap-2 mt-4">
              <button
                onClick={() => handleCopyLink(item.link, item.id)}
                title="Copy Link"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors border border-border/30"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {item.playable && item.gameEmbedUrl ? (
                <button
                  onClick={() => setActiveGameEmbed(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Play In Browser</span>
                </button>
              ) : (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold transition-all shadow-sm"
                >
                  <span>
                    {item.category === 'games' 
                      ? 'Download on Play Store' 
                      : item.isAffiliate 
                        ? 'Claim Offer' 
                        : 'Launch Tool'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 glass-card rounded-3xl space-y-2">
          <p className="text-sm font-semibold text-foreground">No items match your search.</p>
          <p className="text-xs text-muted-foreground">Try clearing filters or search terms.</p>
        </div>
      )}

      {/* Retro Game In-Browser Embed Modal (Kept for future playable additions) */}
      {activeGameEmbed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-card border border-border/60 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{activeGameEmbed.title}</h3>
                  <p className="text-[11px] text-muted-foreground">Emulator runs via WebAssembly directly in your browser</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeGameEmbed.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary"
                >
                  <span>Full Screen Tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setActiveGameEmbed(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Responsive Emulator Iframe Container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-border/40 shadow-inner">
              <iframe
                src={activeGameEmbed.gameEmbedUrl}
                title={activeGameEmbed.title}
                className="w-full h-full border-0"
                allow="autoplay; gamepad; fullscreen; keyboard"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Tip: Click canvas to capture keyboard controls or connect a USB controller.</span>
              <button
                onClick={() => setActiveGameEmbed(null)}
                className="text-primary hover:underline font-semibold"
              >
                Close Arcade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
