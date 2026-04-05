import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden animated-bg">
      {/* Glow orbs */}
      <div className="glow-orb glow-primary w-72 h-72 -top-20 -left-20" />
      <div className="glow-orb glow-accent w-96 h-96 -bottom-32 -right-32" />
      <div className="glow-orb glow-primary w-48 h-48 top-1/3 right-1/4 animate-pulse-glow" />

      {/* Floating code symbols */}
      <span className="code-float text-5xl top-16 left-8 text-primary animate-float">{`{ }`}</span>
      <span className="code-float text-4xl top-32 right-16 text-accent animate-float" style={{ animationDelay: '2s' }}>{`< />`}</span>
      <span className="code-float text-3xl bottom-24 left-16 text-primary animate-float" style={{ animationDelay: '4s' }}>{`</>`}</span>
      <span className="code-float text-6xl bottom-32 right-8 text-accent animate-float" style={{ animationDelay: '1s' }}>{`{ }`}</span>
      <span className="code-float text-2xl top-1/2 left-1/4 text-foreground/10 animate-float" style={{ animationDelay: '3s' }}>{`( )`}</span>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 neon-border">
              <span className="text-2xl font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text font-mono tracking-tight">CodeSage</h1>
          <p className="text-muted-foreground text-sm mt-1">Learn to code, one step at a time</p>
        </div>

        {/* Illustration */}
        <div className="glass-card rounded-3xl p-6 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative">
            <div className="text-6xl mb-3">👨‍💻</div>
            <p className="text-sm text-muted-foreground font-mono">
              <span className="text-primary">const</span> <span className="text-accent">future</span> = <span className="text-success">"starts here"</span>;
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card-strong rounded-3xl p-6 shadow-2xl shadow-primary/5 neon-border-subtle">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-10 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-destructive text-xs text-center bg-destructive/10 rounded-lg py-2">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-all text-base shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? 'Please wait...' : isLogin ? 'Get Started' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); setSubmitting(false); }} className="text-primary font-semibold hover:underline">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
