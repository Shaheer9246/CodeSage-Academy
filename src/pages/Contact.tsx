import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Bug, Copy, Check, Shield } from 'lucide-react';

const SUPPORT_EMAIL = 'shahzain4805@gmail.com';

const Contact = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Contact CodeSage · Support & Feedback';
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <h1 className="font-display text-2xl font-bold mb-1">Contact us</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Real people build CodeSage. Tell us what is broken, what is missing, or what you want to learn next.
        </p>

        <div className="glass-card border border-border/50 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm font-semibold">Email support</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Best for account issues, deletion requests, partnerships and privacy questions. We usually reply
            within 2–3 days.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono bg-muted/40 border border-border/50 rounded-lg px-3 py-2 truncate">
              {SUPPORT_EMAIL}
            </code>
            <button
              onClick={copyEmail}
              className="p-2 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
              aria-label="Copy support email"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-block mt-3 text-xs font-mono text-primary hover:underline"
          >
            Open in mail app →
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <button
            onClick={() => navigate('/suggestions')}
            className="glass-card border border-border/50 rounded-2xl p-5 text-left hover:border-primary/40 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-primary mb-2" />
            <h2 className="font-display text-sm font-semibold mb-1">Suggestion box</h2>
            <p className="text-xs text-muted-foreground">
              Ask for a course or feature. Other students vote, and we reply publicly.
            </p>
          </button>

          <button
            onClick={() => navigate('/suggestions')}
            className="glass-card border border-border/50 rounded-2xl p-5 text-left hover:border-primary/40 transition-colors"
          >
            <Bug className="w-4 h-4 text-primary mb-2" />
            <h2 className="font-display text-sm font-semibold mb-1">Report a bug</h2>
            <p className="text-xs text-muted-foreground">
              Tell us the page, what you did, and what happened. Screenshots help a lot.
            </p>
          </button>
        </div>

        <div className="glass-card border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="font-display text-sm font-semibold">Privacy &amp; data requests</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            You can delete your account and all of its data yourself from Settings. For anything else, read the{' '}
            <button onClick={() => navigate('/privacy')} className="text-primary hover:underline">
              privacy policy
            </button>{' '}
            or email us.
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground/60 font-mono text-center mt-8">
          CodeSage · original coding courses for students · built and maintained independently
        </p>
      </div>
    </div>
  );
};

export default Contact;
