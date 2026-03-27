import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const DOMAIN_REGEX = /^[a-zA-Z0-9._%+-]+@dypiu\.ac\.in$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!DOMAIN_REGEX.test(email)) {
      setError('Only @dypiu.ac.in institutional emails are allowed.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const demoAccounts = [
    { label: 'Admin / T&P Head', email: 'priya.sharma@dypiu.ac.in', color: 'text-brand-primary' },
    { label: 'Faculty', email: 'rahul.mehta@dypiu.ac.in', color: 'text-brand-secondary-light' },
    { label: 'Student (Placed)', email: 'aryan.kapoor@dypiu.ac.in', color: 'text-success' },
    { label: 'Student (In Process)', email: 'sneha.patil@dypiu.ac.in', color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-brand-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md mx-4 animate-fade-in">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-red-800 shadow-glow-red mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">
            DYPIU <span className="text-gradient-red">Collab</span>
          </h1>
          <p className="text-text-muted mt-1 text-sm">Training & Placement Super-App</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-text-muted">Secure · Institutional · Private</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="card p-8 shadow-panel">
          <h2 className="text-lg font-semibold text-text-main mb-6">Sign in to your account</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@dypiu.ac.in"
                className="input"
                required
                id="login-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input pr-12"
                  required
                  id="login-password"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-danger/10 border border-danger/30 rounded-lg px-3 py-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? (
                <><Loader className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-border-subtle">
            <p className="text-xs text-text-faint mb-3 uppercase tracking-wider font-medium">Quick Demo Access (password: demo123)</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <button key={acc.email}
                  onClick={() => { setEmail(acc.email); setPassword('demo123'); }}
                  className="text-left bg-surface-hover hover:bg-surface-active rounded-lg px-3 py-2.5 transition-all duration-150 group">
                  <p className={`text-xs font-semibold ${acc.color} truncate`}>{acc.label}</p>
                  <p className="text-[10px] text-text-faint truncate mt-0.5">{acc.email.split('@')[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-text-faint mt-6">
          Restricted to DY Patil International University members only.
          <br />All activity is monitored per the institutional privacy policy.
        </p>
      </div>
    </div>
  );
}
