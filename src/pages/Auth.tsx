import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Terminal, ShieldAlert, Sparkles } from 'lucide-react';
import {
  getLockRemaining, getAttemptsLeft, registerFailure, clearFailures, formatRemaining, MAX_ATTEMPTS,
} from '@/lib/loginGuard';

type Mode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lockLeft, setLockLeft] = useState(0);
  const { login, signup } = useUser();

  const isLogin = mode === 'login';

  // Live lockout timer for the typed email
  useEffect(() => {
    const tick = () => setLockLeft(email.trim() ? getLockRemaining(email) : 0);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [email]);

  const attemptsLeft = email.trim() ? getAttemptsLeft(email) : MAX_ATTEMPTS;

  const generateStrongPassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length];
    }
    setPassword(password);
    setShowPassword(true); // Auto-show so user can see and copy it
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');

    if (mode === 'forgot') {
      if (!email.trim()) { setError('Email is required'); return; }
      setSubmitting(true);
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitting(false);
      if (err) { setError(err.message); return; }
      setInfo('Reset link sent — check your inbox (and spam folder).');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const left = getLockRemaining(email);
        if (left > 0) {
          setError(`Too many failed attempts. Try again in ${formatRemaining(left)}`);
          setSubmitting(false);
          return;
        }
        const err = await login(email, password);
        if (err) {
          const locked = registerFailure(email);
          setLockLeft(locked);
          const remaining = getAttemptsLeft(email);
          setError(locked > 0
            ? `Account locked on this device for 24h. Try again in ${formatRemaining(locked)}`
            : `${err} — ${remaining} attempt${remaining === 1 ? '' : 's'} left`);
          setSubmitting(false);
        } else {
          clearFailures(email);
        }
      } else {
        if (!username.trim()) { setError('Username is required'); setSubmitting(false); return; }
        if (!email.trim()) { setError('Email is required'); setSubmitting(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setSubmitting(false); return; }
        const err = await signup(username, email, password);
        if (err) { setError(err); setSubmitting(false); }
      }
    } catch {
      setError('Something went wrong');
      setSubmitting(false);
    }
  };

  const switchMode = (m: Mode) => { setMode(m); setError(''); setInfo(''); setSubmitting(false); };

  const locked = isLogin && lockLeft > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden ambient-grid">
      {/* Subtle glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      {/* Floating terminal symbols */}
      <span className="absolute text-6xl top-[8%] left-[8%] text-primary/6 animate-float font-mono select-none">{`>`}</span>
      <span className="absolute text-5xl bottom-[12%] right-[6%] text-primary/5 animate-float font-mono select-none" style={{ animationDelay: '3s' }}>{`_`}</span>
      <span className="absolute text-4xl top-[50%] right-[15%] text-primary/4 animate-float font-mono select-none" style={{ animationDelay: '1.5s' }}>{`{}`}</span>

      <div className="w-full max-w-sm relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center neon-glow-strong border border-primary/20">
              <Terminal className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary font-mono neon-text tracking-tight">CodeSage</h1>
          <p className="text-muted-foreground text-xs mt-1.5 font-mono">master the art of code</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <h2 className="text-lg font-semibold text-foreground mb-5 font-mono">
            {mode === 'login' ? '> login' : mode === 'signup' ? '> create_account' : '> reset_password'}
            <span className="text-primary animate-pulse">_</span>
          </h2>

          {mode === 'forgot' && (
            <p className="text-[11px] text-muted-foreground font-mono mb-4 leading-relaxed">
              Enter your email and we'll send you a secure link to set a new password.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div className="relative group">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_12px_hsl(153,100%,50%,0.1)] transition-all text-sm font-mono" />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_12px_hsl(153,100%,50%,0.1)] transition-all text-sm font-mono" />
            </div>
            {mode !== 'forgot' && (
              <>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="password" value={password} onChange={e => setPassword(e.target.value)}
                    disabled={locked}
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_12px_hsl(153,100%,50%,0.1)] transition-all text-sm font-mono disabled:opacity-50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {mode === 'signup' && (
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="w-full bg-primary/10 border border-primary/30 rounded-xl px-3 py-2.5 text-xs font-mono text-primary hover:bg-primary/20 hover:neon-glow transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    generate_strong_password()
                  </button>
                )}
              </>
            )}

            {locked && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-destructive text-xs font-mono">locked: too many failed attempts</p>
                  <p className="text-destructive/80 text-[11px] font-mono mt-0.5">
                    try again in <span className="font-bold">{formatRemaining(lockLeft)}</span>
                  </p>
                </div>
              </div>
            )}

            {!locked && isLogin && attemptsLeft < MAX_ATTEMPTS && (
              <p className="text-[11px] font-mono text-muted-foreground">
                {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} left before a 24h lock
              </p>
            )}

            {error && !locked && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                <p className="text-destructive text-xs font-mono">error: {error}</p>
              </div>
            )}

            {info && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                <p className="text-primary text-xs font-mono">{info}</p>
              </div>
            )}

            <button type="submit" disabled={submitting || locked}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm font-mono hover:shadow-[0_0_20px_hsl(153,100%,50%,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 neon-glow">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? 'connecting...' : mode === 'login' ? 'login()' : mode === 'signup' ? 'signup()' : 'sendResetLink()'}
            </button>
          </form>

          {isLogin && (
            <button onClick={() => switchMode('forgot')}
              className="block w-full text-center text-[11px] text-muted-foreground mt-3 hover:text-primary transition-colors font-mono">
              forgot_password?
            </button>
          )}

          <div className="mt-5 pt-4 border-t border-border/40">
            <p className="text-center text-xs text-muted-foreground font-mono">
              {mode === 'forgot' ? (
                <button onClick={() => switchMode('login')} className="text-primary font-semibold hover:underline">
                  back_to_login()
                </button>
              ) : (
                <>
                  {isLogin ? 'new_user? ' : 'existing_user? '}
                  <button onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                    className="text-primary font-semibold hover:underline">
                    {isLogin ? 'create_account()' : 'login()'}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Bottom tag */}
        <p className="text-center text-[10px] text-muted-foreground/50 mt-6 font-mono">
          &lt;/&gt; built for learners, by learners
        </p>
      </div>
    </div>
  );
};

export default Auth;
