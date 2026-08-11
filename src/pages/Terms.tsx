import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScrollText } from 'lucide-react';
import { useEffect } from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-7">
    <h2 className="font-display text-base font-semibold text-foreground mb-2">{title}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
  </section>
);

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Terms of Service · CodeSage Academy';
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
          <ScrollText className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Terms of Service</h1>
        </div>
        <p className="text-xs font-mono text-muted-foreground mb-8">
          CodeSage Academy · Last updated 11 August 2026
        </p>

        {/* ---------------------------------------------------------------- */}
        {/* EDIT ME: every Section below is plain text — change freely.       */}
        {/* ---------------------------------------------------------------- */}

        <Section title="1. Accepting these terms">
          <p>
            By creating an account on CodeSage Academy you confirm that you have read and agreed to these
            Terms of Service and to our Privacy Policy. If you do not agree, please do not create an account.
          </p>
        </Section>

        <Section title="2. Your account">
          <p>
            You are responsible for keeping your password safe and for everything that happens under your
            account. One person, one account. Accounts found sharing credentials or automating progress may
            be suspended.
          </p>
        </Section>

        <Section title="3. Our content">
          <p>
            All lessons, challenges, exams and exercises on CodeSage Academy are original work owned by the
            CodeSage team. You may use them freely for your own learning. You may not copy, resell,
            republish or redistribute them, in whole or in part, without written permission.
          </p>
        </Section>

        <Section title="4. Your content">
          <p>
            Code you write in the playground and messages you post in the suggestion box remain yours. By
            posting publicly you allow other students and the CodeSage team to read them. Do not post
            abusive, illegal or spam content — such posts may be edited or removed by an administrator.
          </p>
        </Section>

        <Section title="5. Progress and rewards">
          <p>
            XP, coins, streaks, badges and student IDs are learning aids with no monetary value. Attempts to
            farm or manipulate progress may reset your account data.
          </p>
        </Section>

        <Section title="6. Availability">
          <p>
            CodeSage Academy is provided free of charge, "as is", without warranty. We may change, pause or
            remove features, and we cannot guarantee uninterrupted service or that data is never lost.
          </p>
        </Section>

        <Section title="7. Ending your account">
          <p>
            You can delete your account at any time from Settings; this removes your profile and progress.
            We may suspend accounts that break these terms.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            Questions about these terms? Reach us through the{' '}
            <button onClick={() => navigate('/contact')} className="text-primary hover:underline">
              contact page
            </button>.
          </p>
        </Section>

        <button
          onClick={() => navigate('/privacy')}
          className="text-xs font-mono text-primary hover:underline"
        >
          read the privacy policy →
        </button>
      </div>
    </div>
  );
};

export default Terms;
