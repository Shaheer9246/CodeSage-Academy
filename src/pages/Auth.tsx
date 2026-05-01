import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Terminal } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        const err = await login(email, password);
        if (err) { setError(err); setSubmitting(false); }
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
            {isLogin ? '> login' : '> create_account'}
            <span className="text-primary animate-pulse">_</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
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
            <div className="relative group">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input type={showPassword ? 'text' : 'password'} placeholder="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_12px_hsl(153,100%,50%,0.1)] transition-all text-sm font-mono" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                <p className="text-destructive text-xs font-mono">error: {error}</p>
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm font-mono hover:shadow-[0_0_20px_hsl(153,100%,50%,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 neon-glow">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? 'connecting...' : isLogin ? 'login()' : 'signup()'}
            </button>
          </form>

          {isLogin && (
            <p className="text-center text-[11px] text-muted-foreground mt-3 cursor-pointer hover:text-primary transition-colors font-mono">
              forgot_password?
            </p>
          )}

          <div className="mt-5 pt-4 border-t border-border/40">
            <p className="text-center text-xs text-muted-foreground font-mono">
              {isLogin ? "new_user? " : 'existing_user? '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setSubmitting(false); }}
                className="text-primary font-semibold hover:underline">
                {isLogin ? 'create_account()' : 'login()'}
              </button>
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
