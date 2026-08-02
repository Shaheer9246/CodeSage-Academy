import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useEffect } from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-7">
    <h2 className="font-display text-base font-semibold text-foreground mb-2">{title}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
  </section>
);

const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Privacy Policy & Terms · CodeSage';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Privacy Policy &amp; Terms</h1>
        </div>
        <p className="text-xs font-mono text-muted-foreground mb-8">
          Maintained by the CodeSage team · Last updated 2 August 2026
        </p>

        <Section title="Who we are">
          <p>
            CodeSage is a free coding learning platform for students. All lessons, challenges and exams
            on this platform are original content written by the CodeSage team.
          </p>
        </Section>

        <Section title="What we collect">
          <p>When you create an account, we store:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your email address and username (used for sign-in and your profile).</li>
            <li>Onboarding answers you choose to give (goal, experience level, study status).</li>
            <li>Learning progress: completed lessons, tests, XP, level, streak, badges and enrolled tracks.</li>
            <li>Anything you post yourself, such as suggestions and votes.</li>
          </ul>
          <p>
            We do not collect payment details, we do not sell your data, and we never post anything on your
            behalf.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            Your data is used only to run the platform: to show your progress, unlock the next lesson, keep
            your streak, rank community suggestions, and send you in-app announcements. Aggregated,
            non-identifying counts (for example how many students joined a track) may be shown publicly.
          </p>
        </Section>

        <Section title="Where it is stored">
          <p>
            Accounts and progress are stored in our managed cloud database and protected by row-level access
            rules, so each account can read and write only its own records. Passwords are handled by the
            authentication provider and are never visible to us. Some preferences (theme, playground code,
            editor settings) stay in your browser's local storage only.
          </p>
        </Section>

        <Section title="Advertising and analytics">
          <p>
            CodeSage is free to use. We may display advertising to cover hosting costs. Ad providers can set
            their own cookies or device identifiers to measure and serve ads. We do not share your email,
            username or learning progress with advertisers. You can control cookies through your browser
            settings.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can edit your profile at any time from Settings, and you can delete your account from
            Settings — deleting removes your profile, progress and enrolments. If you need help, contact us
            using the contact page.
          </p>
        </Section>

        <Section title="Children">
          <p>
            CodeSage is intended for students aged 13 and above. If you believe a younger child has created an
            account, contact us and we will remove it.
          </p>
        </Section>

        <Section title="Terms of use">
          <ul className="list-disc pl-5 space-y-1">
            <li>One account per person. Do not share accounts or attempt to farm XP through automation.</li>
            <li>
              Lessons, challenges, exams and artwork on CodeSage are our original work. You may use them to
              learn; you may not republish, resell or redistribute them.
            </li>
            <li>Code you write in the playground stays yours.</li>
            <li>
              Keep community suggestions respectful. Abusive, spam or illegal content may be removed and the
              account suspended.
            </li>
            <li>
              The platform is provided "as is". We work hard to keep it accurate and online, but we cannot
              guarantee uninterrupted service or specific career outcomes.
            </li>
          </ul>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes in a meaningful way, we will post an announcement in your inbox. Continued
            use after a change means you accept the updated terms.
          </p>
        </Section>

        <p className="text-xs text-muted-foreground/70 font-mono border-t border-border/50 pt-5">
          Questions about this policy? Use the{' '}
          <button onClick={() => navigate('/contact')} className="text-primary hover:underline">
            contact page
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default Privacy;
