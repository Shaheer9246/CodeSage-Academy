import { useEffect, useMemo, useState, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Loader2, Terminal, ShieldAlert, Sparkles, Check, Circle } from 'lucide-react';
import {
  getLockRemaining, getAttemptsLeft, registerFailure, clearFailures, formatRemaining, MAX_ATTEMPTS,
} from '@/lib/loginGuard';

type Mode = 'login' | 'signup' | 'forgot';

/* ---------- Bot & Spam signup protection ---------- */
const SIGNUP_ATTEMPTS_KEY = 'codesage_signup_attempts';
const MAX_SIGNUP_ATTEMPTS = 3;
const SIGNUP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkSignupRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(SIGNUP_ATTEMPTS_KEY);
    const now = Date.now();
    const attempts: number[] = raw ? JSON.parse(raw) : [];
    const validAttempts = attempts.filter(t => now - t < SIGNUP_WINDOW_MS);
    return validAttempts.length >= MAX_SIGNUP_ATTEMPTS;
  } catch {
    return false;
  }
}

function recordSignupAttempt(): void {
  try {
    const raw = localStorage.getItem(SIGNUP_ATTEMPTS_KEY);
    const now = Date.now();
    const attempts: number[] = raw ? JSON.parse(raw) : [];
    const validAttempts = attempts.filter(t => now - t < SIGNUP_WINDOW_MS);
    validAttempts.push(now);
    localStorage.setItem(SIGNUP_ATTEMPTS_KEY, JSON.stringify(validAttempts));
  } catch {
    // ignore
  }
}

/* ---------- Password requirements ---------- */
const CHECKS = [
  { id: 'len',   label: '8+ chars',       test: (p: string) => p.length >= 8 },
  { id: 'upper', label: '1 uppercase',    test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lower', label: '1 lowercase',    test: (p: string) => /[a-z]/.test(p) },
  { id: 'num',   label: '1 number',       test: (p: string) => /\d/.test(p) },
  { id: 'sym',   label: '1 symbol (!@#)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const rand = (max: number) => {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
};

const BOOT_LINES = [
  'codesage_os v2.1 — secure boot',
  'mounting /dev/knowledge ....... [ok]',
  'loading auth_module ........... [ok]',
  'handshake TLS 1.3 / AES-256 ... [ok]',
  'theme: neon_green ............. [ok]',
  'clearance check: guest ........ [ok]',
];

const pad = (n: number) => String(n).padStart(2, '0');

const Auth = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [lockLeft, setLockLeft] = useState(0);
  const [bootCount, setBootCount] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [honeypot, setHoneypot] = useState('');
  const formMountedAt = useRef<number>(Date.now());
  const { login, signup } = useUser();

  const isLogin = mode === 'login';

  /* Boot sequence typing */
  useEffect(() => {
    if (bootCount >= BOOT_LINES.length) return;
    const t = setTimeout(() => setBootCount(c => c + 1), bootCount === 0 ? 250 : 380);
    return () => clearTimeout(t);
  }, [bootCount]);

  /* Live uptime HUD */
  useEffect(() => {
    const id = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  /* Live lockout timer for the typed email */
  useEffect(() => {
    const tick = () => setLockLeft(email.trim() ? getLockRemaining(email) : 0);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [email]);

  /* Binary rain columns */
  const rain = useMemo(() => Array.from({ length: 9 }, (_, i) => ({
    left: `${(i * 11 + 4) % 96}%`,
    dur: `${7 + (i % 5) * 2.5}s`,
    delay: `${-(i * 1.7)}s`,
    text: Array.from({ length: 40 }, () => (Math.random() > 0.5 ? '1' : '0')).join('\n'),
  })), []);

  const attemptsLeft = email.trim() ? getAttemptsLeft(email) : MAX_ATTEMPTS;

  /* ---------- Live strength ---------- */
  const passed = CHECKS.filter(c => c.test(password)).length;
  const strength = password ? passed : 0;
  const meta =
    strength <= 2 ? { label: 'weak',   text: 'text-destructive', bar: 'bg-destructive' } :
    strength === 3 ? { label: 'fair',  text: 'text-amber-400',   bar: 'bg-amber-400' } :
    strength === 4 ? { label: 'strong',text: 'text-primary',     bar: 'bg-primary' } :
                     { label: 'elite', text: 'text-primary',     bar: 'bg-primary shadow-[0_0_8px_hsl(153,100%,50%,0.6)]' };
  const segments = Math.round((strength / CHECKS.length) * 4);
  const uptimeStr = `${pad(Math.floor(uptime / 3600))}:${pad(Math.floor(uptime / 60) % 60)}:${pad(uptime % 60)}`;

  const generateStrongPassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const nums = '23456789';
    const syms = '!@#$%^&*()_+-=';
    const all = upper + lower + nums + syms;
    const chars = [upper[rand(upper.length)], lower[rand(lower.length)], nums[rand(nums.length)], syms[rand(syms.length)]];
    while (chars.length < 16) chars.push(all[rand(all.length)]);
    for (let i = chars.length - 1; i > 0; i--) { const j = rand(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
    setPassword(chars.join(''));
    setShowPassword(true);
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
            ? `Too many attempts on this device. Try again in ${formatRemaining(locked)} (or use forgot_password)`
            : `${err} — ${remaining} attempt${remaining === 1 ? '' : 's'} left`);
          setSubmitting(false);
        } else {
          clearFailures(email);
        }
      } else {
        // 1. Honeypot check: automated bots fill hidden inputs
        if (honeypot.trim().length > 0) {
          // Simulate brief delay and fake success without sending network requests to Supabase
          await new Promise(r => setTimeout(r, 800));
          setSubmitting(false);
          setInfo('Account created successfully. Redirecting...');
          return;
        }

        // 2. Submission timing guard (bots submit forms instantaneously)
        const elapsed = Date.now() - formMountedAt.current;
        if (elapsed < 1800) {
          setError('Please take a moment before submitting.');
          setSubmitting(false);
          return;
        }

        // 3. Client cooldown / rate limiting
        if (checkSignupRateLimit()) {
          setError('Too many attempts. Please wait a few minutes before trying again.');
          setSubmitting(false);
          return;
        }

        if (!username.trim()) { setError('Username is required'); setSubmitting(false); return; }
        if (!email.trim()) { setError('Email is required'); setSubmitting(false); return; }
        if (passed < CHECKS.length) { setError('Password too weak — complete all requirements below'); setSubmitting(false); return; }
        if (!acceptedTerms) { setError('You must accept the Terms of Service and Privacy Policy'); setSubmitting(false); return; }

        recordSignupAttempt();
        const err = await signup(username, email, password);
        if (err) {
          setError(/weak|pwned|known to be weak/i.test(err)
            ? 'That password appears in known data breaches — pick a more unique one (mix words, numbers and symbols).'
            : err);
          setSubmitting(false);
        }
      }
    } catch {
      setError('Something went wrong');
      setSubmitting(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    setInfo('');
    setSubmitting(false);
    setPassword('');
    setShowPassword(false);
    setAcceptedTerms(false);
    setHoneypot('');
    formMountedAt.current = Date.now();
  };

  const locked = isLogin && lockLeft > 0;

  const inputCls = "w-full bg-black/30 border border-border/60 rounded-lg px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:shadow-[0_0_16px_hsl(153,100%,50%,0.15)] transition-all text-sm font-mono disabled:opacity-50";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4 font-mono">
      {/* ===== Custom keyframes ===== */}
      <style>{`
        @keyframes cs-fall { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes cs-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes cs-scan { 0% { top: -15%; } 100% { top: 115%; } }
        @keyframes cs-glitch {
          0%, 100% { text-shadow: 0 0 10px hsl(153 100% 50% / .6); transform: translateX(0); }
          20% { text-shadow: -2px 0 #0ff, 2px 0 #f0f; transform: translateX(1px); }
          40% { text-shadow: 2px 0 #0ff, -2px 0 #f0f; transform: translateX(-1px); }
          60% { text-shadow: 0 0 14px hsl(153 100% 50% / .9); }
        }
        .cs-logo:hover { animation: cs-glitch .35s steps(2) infinite; }
      `}</style>

      {/* ===== Background layers ===== */}
      <div className="absolute inset-0 ambient-grid opacity-60 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />
      {/* binary rain */}
      {rain.map((r, i) => (
        <div key={i} className="absolute top-0 text-[9px] leading-3 text-primary/10 select-none pointer-events-none whitespace-pre"
          style={{ left: r.left, animation: `cs-fall ${r.dur} linear infinite`, animationDelay: r.delay }}>
          {r.text}
        </div>
      ))}
      {/* CRT scanlines + moving scan bar + vignette */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)' }} />
      <div className="pointer-events-none absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent" style={{ animation: 'cs-scan 7s linear infinite' }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)' }} />

      {/* ===== Terminal Window ===== */}
      <div className="w-full max-w-3xl relative z-10 animate-fade-in">
        <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-[0_0_60px_hsl(153,100%,50%,0.08)]">

          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/40 bg-secondary/30">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-[10px] text-muted-foreground truncate">codesage@auth:~ — secure_shell</span>
            <span className="ml-auto text-[9px] text-primary flex items-center gap-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> LIVE
            </span>
          </div>

          <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* ===== LEFT: boot log + HUD (desktop) ===== */}
            <div className="hidden md:flex flex-col p-6 border-r border-border/40 bg-black/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center neon-glow-strong">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="cs-logo text-xl font-bold text-primary neon-text tracking-tight cursor-default">CodeSage</h1>
                  <p className="text-[9px] text-muted-foreground">master the art of code</p>
                </div>
              </div>

              <div className="space-y-1 min-h-[130px]">
                {BOOT_LINES.slice(0, bootCount).map((l, i) => (
                  <p key={i} className="text-[10px] leading-relaxed text-muted-foreground">
                    <span className="text-primary/60 mr-1.5">&gt;</span>
                    {l.endsWith('[ok]') ? (<>{l.slice(0, -4).trimEnd()} <span className="text-primary">[ok]</span></>) : l}
                  </p>
                ))}
                {bootCount >= BOOT_LINES.length && (
                  <p className="text-[10px] text-primary pt-1">
                    &gt; awaiting credentials
                    <span style={{ animation: 'cs-blink 1s steps(1) infinite' }}>_</span>
                  </p>
                )}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                {[['operator', 'guest'], ['clearance', 'L0'], ['node', 'eu-west-1'], ['ping', '23ms']].map(([k, v]) => (
                  <div key={k} className="bg-black/30 border border-border/40 rounded-lg px-2.5 py-1.5">
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{k}</p>
                    <p className="text-[10px] text-primary font-bold">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== RIGHT: form ===== */}
            <div className="p-5 sm:p-6">
              {/* Mobile logo */}
              <div className="md:hidden flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center neon-glow-strong">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h1 className="cs-logo text-lg font-bold text-primary neon-text tracking-tight">CodeSage</h1>
                  <p className="text-[9px] text-muted-foreground">master the art of code</p>
                </div>
              </div>
              <p className="md:hidden text-[9px] text-muted-foreground mb-3">
                &gt; secure_channel established <span className="text-primary">[ok]</span>
              </p>

              <h2 className="text-base font-semibold text-foreground mb-4">
                <span className="text-primary/60 mr-1">&gt;</span>
                {mode === 'login' ? 'login' : mode === 'signup' ? 'create_account' : 'reset_password'}
                <span className="text-primary" style={{ animation: 'cs-blink 1s steps(1) infinite' }}>_</span>
              </h2>

              {mode === 'forgot' && (
                <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
                  Enter your email and we'll send you a secure link to set a new password.
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Honeypot trap for scripted bots */}
                {mode === 'signup' && (
                  <div className="opacity-0 absolute top-0 left-0 h-0 w-0 -z-50 pointer-events-none" aria-hidden="true">
                    <input
                      type="text"
                      name="website_verify_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={e => setHoneypot(e.target.value)}
                    />
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">&gt; enter_username</label>
                    <input type="text" placeholder="neo_coder" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" className={inputCls} />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">&gt; enter_email</label>
                  <input type="email" placeholder="you@matrix.dev" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className={inputCls} />
                </div>

                {mode !== 'forgot' && (
                  <>
                    <div>
                      <label className="block text-[10px] text-muted-foreground mb-1">&gt; enter_password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)}
                          disabled={locked} autoComplete={isLogin ? 'current-password' : 'new-password'} className={`${inputCls} pr-10`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* ===== Password Security Panel ===== */}
                    {mode === 'signup' && (
                      <div className="bg-black/30 border border-border/40 rounded-xl p-3 space-y-2.5">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest">// password_security</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 flex gap-1">
                            {[0, 1, 2, 3].map(i => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < segments ? meta.bar : 'bg-border/40'}`} />
                            ))}
                          </div>
                          <span className={`text-[10px] font-bold ${password ? meta.text : 'text-muted-foreground'}`}>
                            {password ? meta.label : '—'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                          {CHECKS.map(c => {
                            const ok = c.test(password);
                            return (
                              <div key={c.id} className="flex items-center gap-1.5">
                                {ok ? <Check className="w-3 h-3 text-primary flex-shrink-0" /> : <Circle className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />}
                                <span className={`text-[10px] transition-colors ${ok ? 'text-primary' : 'text-muted-foreground'}`}>{c.label}</span>
                              </div>
                            );
                          })}
                        </div>
                        <button type="button" onClick={generateStrongPassword}
                          className="w-full bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 text-[11px] font-bold text-primary hover:bg-primary/20 hover:shadow-[0_0_12px_hsl(153,100%,50%,0.25)] transition-all flex items-center justify-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          generate_strong_password()
                        </button>
                      </div>
                    )}
                  </>
                )}

                {mode === 'signup' && (
                  <label className="flex items-start gap-2.5 cursor-pointer select-none bg-black/20 border border-border/40 rounded-lg px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 accent-primary flex-shrink-0"
                    />
                    <span className="text-[11px] leading-relaxed text-muted-foreground">
                      I have read and accept the{' '}
                      <a href="/terms" target="_blank" rel="noreferrer" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and the{' '}
                      <a href="/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                )}

                {locked && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-destructive text-xs">locked: too many failed attempts</p>
                      <p className="text-destructive/80 text-[11px] mt-0.5">
                        try again in <span className="font-bold">{formatRemaining(lockLeft)}</span>
                      </p>
                    </div>
                  </div>
                )}

                {!locked && isLogin && attemptsLeft < MAX_ATTEMPTS && (
                  <p className="text-[11px] text-muted-foreground">
                    {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} left before a 24h lock
                  </p>
                )}

                {error && !locked && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    <p className="text-destructive text-xs">error: {error}</p>
                  </div>
                )}

                {info && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                    <p className="text-primary text-xs">{info}</p>
                  </div>
                )}

                <button type="submit" disabled={submitting || locked}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_24px_hsl(153,100%,50%,0.35)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 neon-glow">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="opacity-70">&gt;</span>}
                  {submitting ? 'connecting...' : mode === 'login' ? 'run login()' : mode === 'signup' ? 'run signup()' : 'run sendResetLink()'}
                </button>
              </form>

              {isLogin && (
                <button onClick={() => switchMode('forgot')}
                  className="block w-full text-center text-[11px] text-muted-foreground mt-3 hover:text-primary transition-colors">
                  [ forgot_password ]
                </button>
              )}

              <div className="mt-4 pt-4 border-t border-border/40">
                <p className="text-center text-xs text-muted-foreground">
                  {mode === 'forgot' ? (
                    <button onClick={() => switchMode('login')} className="text-primary font-semibold hover:underline">[ back_to_login ]</button>
                  ) : (
                    <>
                      {isLogin ? 'new_user? ' : 'existing_user? '}
                      <button onClick={() => switchMode(isLogin ? 'signup' : 'login')} className="text-primary font-semibold hover:underline">
                        [{isLogin ? 'create_account' : 'login'}]
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 border-t border-border/40 bg-secondary/30 text-[9px] text-muted-foreground">
            <span className="hidden sm:inline">ENC: AES-256 · TLS 1.3</span>
            <span>UPTIME {uptimeStr}</span>
            <span className="text-primary flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-primary animate-pulse" /> secure
            </span>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-5">
          &lt;/&gt; built for learners, by learners
        </p>
      </div>
    </div>
  );
};

export default Auth;
