import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, Settings, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const CookiePolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Cookie Policy · CodeSage';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div className="border-b border-border/60 pb-6 mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Cookie className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-secondary/20 border border-border/50 rounded-2xl p-5">
            <h2 className="font-display text-base font-bold text-foreground mb-3">What Are Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit CodeSage. They help us provide a better learning experience by remembering your preferences and tracking your progress.
            </p>
          </section>

          <section className="bg-secondary/20 border border-border/50 rounded-2xl p-5">
            <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Types of Cookies We Use
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Required for authentication and security. These cookies enable core features like login sessions and cannot be disabled.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Preference Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Remember your settings like theme preferences (dark/light mode), language selection, and UI customizations.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Help us understand how students use the platform (pages visited, time spent) to improve our courses. These are anonymous and aggregated.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-secondary/20 border border-border/50 rounded-2xl p-5">
            <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              How to Control Cookies
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              You can manage cookie preferences through your browser settings. However, disabling essential cookies may prevent certain features from working properly.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground marker:text-primary">
              <li>Browser settings allow you to block or delete cookies</li>
              <li>Incognito/private browsing modes limit cookie storage</li>
              <li>You can clear localStorage data from browser developer tools</li>
            </ul>
          </section>

          <section className="bg-secondary/20 border border-border/50 rounded-2xl p-5">
            <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-primary" />
              Third-Party Cookies
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CodeSage does not use third-party advertising cookies. We only use cookies from our authentication provider and analytics services to improve the platform. We do not sell or share your data with advertisers.
            </p>
          </section>

          <div className="pt-6 border-t border-border/60">
            <p className="text-xs text-muted-foreground mb-3">
              Questions about cookies? Contact us at:{' '}
              <button 
                onClick={() => navigate('/contact')}
                className="text-primary hover:underline"
              >
                shahzain4805@gmail.com
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
