import { useNavigate } from 'react-router-dom';
import { Shield, Lock, BookOpen, AlertTriangle, Scale, ArrowLeft, ArrowRight } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          go back
        </button>

        {/* Header */}
        <div className="border-b border-border pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono">
            <Scale className="w-3.5 h-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground font-mono">
            Last updated: August 2026 • Please read carefully before using the platform.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          
          {/* Section 1: Individual License & Account Rules */}
          <section className="space-y-3 bg-secondary/20 border border-border/60 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Lock className="w-4 h-4 text-primary" />
              <h2>1. Account Integrity & Single-User Access</h2>
            </div>
            <p className="text-muted-foreground">
              Your CodeSage account is strictly personal and non-transferable. Each registration represents a single-user license to access our educational materials and features.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-1">
              <li>
                <strong className="text-foreground">No Account Sharing:</strong> You may not share, sell, rent, or transfer your login credentials or account access to any third party.
              </li>
              <li>
                <strong className="text-foreground">Credential Responsibility:</strong> You are entirely responsible for maintaining the confidentiality of your credentials and all activity conducted through your account.
              </li>
              <li>
                <strong className="text-foreground">Concurrent Monitoring:</strong> We reserve the right to monitor account sessions. Suspicious login behavior across multiple locations or simultaneous device access may result in automatic session termination or account restriction.
              </li>
            </ul>
          </section>

          {/* Section 2: Intellectual Property & App Protection */}
          <section className="space-y-3 bg-secondary/20 border border-border/60 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2>2. Intellectual Property & Content Protection</h2>
            </div>
            <p className="text-muted-foreground">
              All proprietary content—including but not limited to lessons, curriculum architecture, code challenges, streak systems, quizzes, UI/UX designs, graphics, and documentation—is owned exclusively by CodeSage.
            </p>
            <p className="text-muted-foreground">
              You are granted a limited, personal, non-exclusive, non-transferable license to access content strictly for personal learning. You strictly agree <strong className="text-foreground">NOT</strong> to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground pl-1">
              <li>Copy, record, reproduce, re-upload, or redistribute any lessons, curriculum designs, or platform structures outside CodeSage.</li>
              <li>Use automated web crawlers, bots, scrapers, or scripts to extract platform data, lessons, or code exercises.</li>
              <li>Decompile, reverse-engineer, dissemble, or attempt to recreate the source code or database structure of CodeSage.</li>
              <li>Use our educational materials to build competing educational platforms or products.</li>
            </ul>
          </section>

          {/* Section 3: Fair Use & Automated Abuse */}
          <section className="space-y-3 bg-secondary/20 border border-border/60 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <h2>3. Fair Use & Platform Conduct</h2>
            </div>
            <p className="text-muted-foreground">
              You agree to use CodeSage strictly for legitimate learning purposes. You may not exploit bugs, manipulate server requests, or use automated scripts to auto-complete lessons, artificially inflate streaks, or manipulate XP/level statistics.
            </p>
          </section>

          {/* Section 4: Account Termination */}
          <section className="space-y-3 bg-secondary/20 border border-border/60 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h2>4. Termination & Suspension</h2>
            </div>
            <p className="text-muted-foreground">
              We reserve the full right to suspend or permanently delete any account found in violation of these terms, engaging in unauthorized content sharing, or attempting to compromise platform security, without prior notice.
            </p>
          </section>

          {/* Section 5: Contact Info */}
          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base font-semibold text-foreground">Questions Regarding Terms?</h2>
            <p className="text-muted-foreground">
              If you have any questions or concerns regarding our terms, feel free to reach out through our{' '}
              <button
                onClick={() => navigate('/contact')}
                className="text-primary hover:underline font-medium"
              >
                contact page
              </button>
              .
            </p>
          </section>

        </div>

        {/* Link to Privacy Policy */}
        <div className="pt-4 border-t border-border flex justify-between items-center">
          <button
            onClick={() => navigate('/privacy')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
          >
            read the privacy policy
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Terms;
