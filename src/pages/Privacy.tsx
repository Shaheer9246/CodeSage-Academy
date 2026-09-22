import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Server, Award, UserCheck, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

const Section = ({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  icon?: React.ElementType; 
  children: React.ReactNode 
}) => (
  <section className="mb-8 bg-secondary/20 border border-border/50 rounded-2xl p-5 transition-all hover:border-border/80">
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-2.5">{children}</div>
  </section>
);

const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Privacy Policy & Terms · CodeSage';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* Page Header */}
        <div className="border-b border-border/60 pb-6 mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Privacy Policy & Terms</h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Maintained by the CodeSage team • Last updated August 2026
          </p>
        </div>

        {/* Section 1: Platform Overview */}
        <Section title="1. Who We Are" icon={Shield}>
          <p>
            CodeSage is an interactive educational platform designed for students and developers to learn programming. All curriculum, code challenges, streak structures, and exams hosted on CodeSage are proprietary, original content created by our team.
          </p>
        </Section>

        {/* Section 2: Data Collection */}
        <Section title="2. Information We Collect" icon={Eye}>
          <p>To provide personal progress tracking and account authorization, we collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
            <li><strong className="text-foreground">Identity Data:</strong> Email address, name, and username provided during sign-up.</li>
            <li><strong className="text-foreground">Onboarding Preferences:</strong> Educational status, experience level, and learning goals.</li>
            <li><strong className="text-foreground">Activity & Progress:</strong> Completed lessons, test scores, XP, level status, streak logs, badges, and enrolled tracks.</li>
            <li><strong className="text-foreground">User Contributions:</strong> Suggestions, votes, and community feedback submitted to the platform.</li>
          </ul>
          <p className="pt-1 text-xs text-muted-foreground/80 font-mono">
            We do not collect sensitive payment financial details directly, nor do we sell personal data to third parties.
          </p>
        </Section>

        {/* Section 3: Data Usage */}
        <Section title="3. How We Use Your Data" icon={Award}>
          <p>
            Collected information is strictly used to run and safeguard CodeSage:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-primary">
            <li>Syncing learning progress across your devices and calculating daily streaks.</li>
            <li>Unlocking curriculum sections based on completed prerequisites.</li>
            <li>Ranking community feedback and delivering in-app announcements.</li>
          </ul>
          <p>
            Aggregated, non-identifiable statistics (such as overall enrollment counts per track) may be displayed publicly.
          </p>
        </Section>

        {/* Section 4: Security & Storage */}
        <Section title="4. Storage & Infrastructure Security" icon={Server}>
          <p>
            Your account and progress records are stored in a managed cloud database enforced by strict <strong className="text-foreground">Row-Level Security (RLS)</strong> policies, ensuring your private data can only be accessed or modified by your authenticated session.
          </p>
          <p>
            Passwords are encrypted and processed by our authentication provider and are never stored in plaintext or readable by platform administrators. Client-side preferences (such as dark mode toggles or playground drafts) remain stored locally in your browser’s <code className="text-xs bg-secondary px-1.5 py-0.5 rounded font-mono">localStorage</code>.
          </p>
        </Section>

        {/* Section 5: Account Integrity & Anti-Sharing Terms */}
        <Section title="5. Account Rules & Single-User License" icon={Lock}>
          <ul className="list-disc pl-5 space-y-2 marker:text-primary">
            <li>
              <strong className="text-foreground">Single-User Access:</strong> Each account is assigned to an individual user. Sharing credentials, selling accounts, or attempting simultaneous concurrent access across multiple users is strictly prohibited.
            </li>
            <li>
              <strong className="text-foreground">Automated Abuse:</strong> Using bots, automated scripts, or exploits to auto-complete lessons, bypass timers, or artificially farm XP/streaks will result in immediate account termination.
            </li>
            <li>
              <strong className="text-foreground">Content Ownership:</strong> Lessons, challenges, graphics, and curriculum architecture are protected intellectual property. You may use them for personal learning, but you may NOT scrape, record, republish, resell, or redistribute them outside CodeSage.
            </li>
            <li>
              <strong className="text-foreground">User Code:</strong> Any original source code you write inside the CodeSage playground remains your intellectual property.
            </li>
          </ul>
        </Section>

        {/* Section 6: User Rights & Account Deletion */}
        <Section title="6. Your Data Rights" icon={UserCheck}>
          <p>
            You retain full control over your personal data. You can edit your user preferences at any time in <strong className="text-foreground">Settings</strong>. 
          </p>
          <p>
            If you wish to leave the platform, you can initiate a complete account deletion from your Settings page. Deleting your account permanently wipes your profile, progress history, streak counts, and enrollments from our cloud database.
          </p>
        </Section>

        {/* Section 7: Age Requirement */}
        <Section title="7. Age Limit" icon={AlertCircle}>
          <p>
            CodeSage is intended for learners aged 13 and older. If you believe a child under 13 has created an account without parental consent, please reach out to us, and we will delete the account and associated records immediately.
          </p>
        </Section>

        {/* Footer Link */}
        <div className="pt-6 mt-10 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>Have questions or privacy concerns?</p>
          <button
            onClick={() => navigate('/contact')}
            className="text-primary hover:underline font-semibold"
          >
            Contact CodeSage Support →
          </button>
        </div>

      </div>
    </div>
  );
};

export default Privacy;
