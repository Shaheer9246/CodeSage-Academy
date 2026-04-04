import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      if (login(email, password)) {
        navigate('/onboarding');
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!username.trim()) { setError('Username is required'); return; }
      if (!email.trim()) { setError('Email is required'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
      if (signup(username, email, password)) {
        navigate('/onboarding');
      } else {
        setError('Email already registered');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="glow-orb glow-primary w-72 h-72 -top-20 -left-20" />
      <div className="glow-orb glow-accent w-96 h-96 -bottom-32 -right-32" />
      <div className="glow-orb glow-primary w-48 h-48 top-1/3 right-1/4" />

      {/* Floating code symbols */}
      <span className="code-float text-5xl top-16 left-8 text-primary">{`{ }`}</span>
      <span className="code-float text-4xl top-32 right-16 text-accent">{`< />`}</span>
      <span className="code-float text-3xl bottom-24 left-16 text-primary">{`</>`}</span>
      <span className="code-float text-6xl bottom-32 right-8 text-accent">{`{ }`}</span>
      <span className="code-float text-2xl top-1/2 left-1/4 text-foreground">{`( )`}</span>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-2xl font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground font-mono tracking-tight">CodeSage</h1>
          <p className="text-muted-foreground text-sm mt-1">Learn to code, one step at a time</p>
        </div>

        {/* Illustration area */}
        <div className="glass-card rounded-3xl p-6 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative">
            <div className="text-6xl mb-3">👨‍💻</div>
            <p className="text-sm text-muted-foreground font-mono">
              <span className="text-primary">const</span> <span className="text-accent">future</span> = <span className="text-success">"starts here"</span>;
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="glass-card-strong rounded-3xl p-6 shadow-2xl shadow-primary/5">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl pl-10 pr-10 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs text-primary hover:underline">Forgot Password?</button>
              </div>
            )}

            {error && <p className="text-destructive text-xs text-center bg-destructive/10 rounded-lg py-2">{error}</p>}

            <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-all text-base shadow-lg shadow-primary/20">
              {isLogin ? 'Get Started' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-primary font-semibold hover:underline">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
