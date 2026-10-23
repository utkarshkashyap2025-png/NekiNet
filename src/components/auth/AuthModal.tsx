import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'requester' | 'volunteer';
  onAuthSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'requester',
  onAuthSuccess,
}) => {
  const { isConfigured, signInWithEmail, signUpWithEmail, simulateDemoLogin } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'requester' | 'volunteer'>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!isConfigured) {
      // In demo mode without configured credentials
      simulateDemoLogin(role);
      setSuccessMessage(`Logged in as demo ${role}. Supabase credentials not yet provided in .env.local.`);
      setTimeout(() => {
        onAuthSuccess?.();
        onClose();
      }, 1000);
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUpWithEmail(email, password, fullName, role);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        setTimeout(() => {
          onAuthSuccess?.();
          onClose();
        }, 1500);
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Successfully signed in with Supabase Auth!');
        setTimeout(() => {
          onAuthSuccess?.();
          onClose();
        }, 800);
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {mode === 'signin' ? 'Sign In to NekiNet' : 'Create an Account'}
              </h3>
              <p className="text-xs text-slate-500">Supabase Secure Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Backend Connection Indicator Banner */}
        <div className={`mt-4 p-3 rounded-xl border text-xs ${
          isConfigured 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-0.5">
            <Database className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isConfigured ? '🟢 Live Supabase Connected' : '🟡 Supabase Unconfigured (Demo Fallback)'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {isConfigured
              ? 'Connected to your live PostgreSQL database with Row Level Security.'
              : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local to link your project. You can still test in Demo Mode below!'}
          </p>
        </div>

        {/* Demo Fast Logins (when unconfigured) */}
        {!isConfigured && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Quick Test Switcher (Demo Mode)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  simulateDemoLogin('requester');
                  onAuthSuccess?.();
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 text-center transition"
              >
                👤 As Requester
              </button>
              <button
                type="button"
                onClick={() => {
                  simulateDemoLogin('volunteer');
                  onAuthSuccess?.();
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-teal-300 text-slate-700 text-center transition"
              >
                🤝 As Volunteer
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarti Verma"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Primary Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('requester')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      role === 'requester'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Need Help (Requester)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('volunteer')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      role === 'volunteer'
                        ? 'bg-teal-50 text-teal-800 border-teal-400 font-bold'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Offer Help (Volunteer)
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@neighborhood.org"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Complete Registration'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-center text-xs text-slate-500">
          {mode === 'signin' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
