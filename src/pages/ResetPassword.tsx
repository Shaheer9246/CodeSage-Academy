import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Loader2, Terminal, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 ambient-grid">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center neon-glow-strong border border-primary/20">
            <Terminal className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-mono neon-text mt-3">reset_password</h1>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          {done ? (
            <p className="text-sm font-mono text-primary text-center">password updated — redirecting…</p>
          ) : !ready ? (
            <p className="text-xs font-mono text-muted-foreground text-center">
              Open this page from the reset link in your email. Waiting for a valid recovery session…
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-3.5">
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input type={show ? 'text' : 'password'} placeholder="new password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-sm font-mono" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input type={show ? 'text' : 'password'} placeholder="confirm password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-sm font-mono" />
              </div>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  <p className="text-destructive text-xs font-mono">error: {error}</p>
                </div>
              )}
              <button type="submit" disabled={saving}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm font-mono neon-glow disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} update_password()
              </button>
            </form>
          )}
          <button onClick={() => navigate('/auth')} className="w-full text-center text-[11px] font-mono text-muted-foreground hover:text-primary">
            back_to_login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
