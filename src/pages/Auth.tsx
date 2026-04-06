import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import heroImage from '@/assets/hero-coder.png';

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,hsl(270,65%,15%)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,hsl(25,95%,15%)_0%,transparent_40%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,hsl(270,65%,20%)_0%,transparent_60%)] opacity-30 animate-pulse" />
      </div>

      {/* Floating code symbols */}
      <span className="absolute text-5xl top-[10%] left-[5%] text-primary/15 animate-float font-mono">{`{}`}</span>
      <span className="absolute text-4xl top-[20%] right-[8%] text-accent/15 animate-float font-mono" style={{ animationDelay: '2s' }}>{`</>`}</span>
      <span className="absolute text-3xl bottom-[15%] left-[10%] text-primary/10 animate-float font-mono" style={{ animationDelay: '4s' }}>{`()`}</span>
      <span className="absolute text-6xl bottom-[20%] right-[5%] text-accent/10 animate-float font-mono" style={{ animationDelay: '1s' }}>{`{}`}</span>
      <span className="absolute text-2xl top-[40%] left-[25%] text-foreground/5 animate-float font-mono" style={{ animationDelay: '3s' }}>{`<>`}</span>

      {/* Network dots */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
          style={{ top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%`, animationDelay: `${Math.random() * 5}s` }} />
      ))}

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 border border-primary/20">
              <span className="text-xl font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-mono tracking-tight">CodeSage</h1>
          <p className="text-muted-foreground text-xs mt-1">Learn to code, one step at a time</p>
        </div>

        {/* Hero illustration */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img src={heroImage} alt="CodeSage - Learn to code" width={280} height={280} className="relative z-0 drop-shadow-2xl" />
          </div>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-card/70 rounded-3xl p-6 shadow-2xl shadow-primary/5 border border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-foreground mb-5 text-center">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm backdrop-blur-sm" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input type="email" placeholder="Email or Username" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm backdrop-blur-sm" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-10 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm backdrop-blur-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && <p className="text-destructive text-xs text-center bg-destructive/10 rounded-lg py-2">{error}</p>}

              <button type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-primary via-[hsl(35,95%,55%)] to-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-all text-base shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? 'Please wait...' : isLogin ? 'Get Started' : 'Sign Up'}
              </button>
            </form>

            {isLogin && (
              <p className="text-center text-xs text-muted-foreground mt-3 cursor-pointer hover:text-primary transition-colors">
                Forgot Password?
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setSubmitting(false); }} className="text-primary font-semibold hover:underline">
                {isLogin ? 'Sign Up.' : 'Log In'}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center mt-6">
          <div className="flex gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-3 h-5 bg-secondary/40 rounded-sm border border-border/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom sparkle */}
      <div className="absolute bottom-6 right-8 text-2xl text-primary/20 animate-pulse">✦</div>
    </div>
  );
};

export default Auth;
