import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';

export const SignUp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as 'switcher' | 'guide') || 'switcher';
  const initialMode = searchParams.get('mode') === 'signin' ? 'signin' : 'signup';

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [role, setRole] = useState<'switcher' | 'guide'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailInput, setGmailInput] = useState('');
  const [gmailName, setGmailName] = useState('');

  const { login, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    if (!password.trim() || password.trim().length < 4) {
      setAuthError('Please enter a password (at least 4 characters).');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      setAuthError('Please enter your full name to create your account.');
      return;
    }

    setAuthError(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const displayName =
      name.trim() ||
      (cleanEmail === 'bharatk6325@gmail.com'
        ? 'Bharat K.'
        : cleanEmail === 'varunk6325@gmail.com'
        ? 'Varun K.'
        : cleanEmail.split('@')[0].charAt(0).toUpperCase() +
          cleanEmail.split('@')[0].slice(1));

    // Save credentials in localStorage registry
    try {
      const savedCredsRaw = localStorage.getItem('plm_user_credentials_v1');
      const savedCreds: Record<string, { email: string; password: string; name: string; role: 'switcher' | 'guide' }> =
        savedCredsRaw ? JSON.parse(savedCredsRaw) : {};

      if (authMode === 'signin' && savedCreds[cleanEmail]) {
        if (savedCreds[cleanEmail].password && savedCreds[cleanEmail].password !== password) {
          setIsSubmitting(false);
          setAuthError('Incorrect password for this account. Please try again.');
          return;
        }
      } else {
        savedCreds[cleanEmail] = {
          email: cleanEmail,
          password,
          name: displayName,
          role,
        };
        localStorage.setItem('plm_user_credentials_v1', JSON.stringify(savedCreds));
      }
    } catch {
      // ignore storage error
    }

    const isExplicitNewSignup = authMode === 'signup' && cleanEmail !== 'bharatk6325@gmail.com';
    const { targetRoute } = login(
      cleanEmail,
      role,
      displayName,
      isExplicitNewSignup ? true : undefined
    );
    setIsSubmitting(false);
    navigate(targetRoute);
  };

  const handleGmailSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailInput.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setAuthError(null);

    let finalName = gmailName.trim();
    if (!finalName) {
      const prefix = gmailInput.split('@')[0] || 'User';
      const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      finalName = `${capitalized}`;
    }

    const { targetRoute } = login(gmailInput.trim(), role, finalName);
    setShowGmailModal(false);
    setIsSubmitting(false);
    navigate(targetRoute);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] flex flex-col justify-between p-6">
      <header className="max-w-md mx-auto w-full pt-4 flex items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="px-2.5 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F2B134]" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#102A2E]" />
                <span>Dark</span>
              </>
            )}
          </button>
          <Link
            to="/"
            className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] px-2.5 py-1"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full py-6 space-y-5">
        <div className="space-y-1.5 text-center sm:text-left">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            {authMode === 'signin'
              ? 'Sign in to your account'
              : 'Create your account'}
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            {authMode === 'signin'
              ? 'Sign in with your email and password to pick up right where you left off.'
              : 'Create your personal account to get matched with a Career Guide and peer pod.'}
          </p>
        </div>

        {/* Sign In vs Create Account Tabs */}
        <div className="flex p-1 bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-full text-xs font-semibold shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setAuthError(null);
            }}
            className={`flex-1 py-2.5 rounded-full transition-colors cursor-pointer ${
              authMode === 'signin'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setAuthError(null);
            }}
            className={`flex-1 py-2.5 rounded-full transition-colors cursor-pointer ${
              authMode === 'signup'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Friendly Error Alert */}
        {authError && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-[#A8432C]/10 border border-[#A8432C]/30 text-xs text-[#A8432C] dark:text-[#E58C73] flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="shrink-0 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Dismiss</span>
            </button>
          </div>
        )}

        {/* Main Email & Password Form Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-xs">
          {/* Role selector when creating an account */}
          {authMode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
                How are you joining?
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setRole('switcher')}
                  className={`py-2.5 px-3 rounded-xl border transition-colors cursor-pointer ${
                    role === 'switcher'
                      ? 'bg-[#102A2E] text-white border-[#102A2E] dark:bg-[#F2B134] dark:text-[#102A2E] dark:border-[#F2B134]'
                      : 'border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0]'
                  }`}
                >
                  Making a career switch
                </button>
                <button
                  type="button"
                  onClick={() => setRole('guide')}
                  className={`py-2.5 px-3 rounded-xl border transition-colors cursor-pointer ${
                    role === 'guide'
                      ? 'bg-[#102A2E] text-white border-[#102A2E] dark:bg-[#F2B134] dark:text-[#102A2E] dark:border-[#F2B134]'
                      : 'border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0]'
                  }`}
                >
                  Becoming a Career Guide
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label
                  htmlFor="signup-name"
                  className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#55665F] dark:text-[#A6B8B0] absolute left-3.5 top-3" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="signup-email"
                className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#55665F] dark:text-[#A6B8B0] absolute left-3.5 top-3" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-password"
                className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]"
              >
                {authMode === 'signin' ? 'Password' : 'Create Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#55665F] dark:text-[#A6B8B0] absolute left-3.5 top-3" />
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'signin' ? 'Enter your password' : 'Create a password (min. 4 chars)'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <span>
                {authMode === 'signin' ? 'Sign In' : 'Create Account & Continue'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#D3DDD8] dark:border-[#2A403C] w-full" />
            <span className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-3 text-[11px] text-[#55665F] dark:text-[#A6B8B0] absolute">
              or
            </span>
          </div>

          {/* Continue with Google Button */}
          <button
            onClick={() => setShowGmailModal(true)}
            type="button"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors text-[#13231F] dark:text-[#E6EEEA] shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Demo Accounts Box for Quick Review */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] space-y-2.5 shadow-2xs text-xs">
          <p className="font-semibold uppercase tracking-wider text-[11px] text-[#8A5A00] dark:text-[#F2B134]">
            Quick Demo Accounts
          </p>
          <div className="p-2.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">Bharat K. (Active Dashboard)</p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                Email: <strong>bharatk6325@gmail.com</strong> • Pass: <strong>Bharat@123</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const { targetRoute } = login('bharatk6325@gmail.com', 'switcher', 'Bharat K.', false);
                navigate(targetRoute);
              }}
              className="px-3 py-1.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold cursor-pointer shrink-0"
            >
              Sign In →
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">Varun K. (Fresh Onboarding)</p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                Email: <strong>varunk6325@gmail.com</strong> • Pass: <strong>Varun@123</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const { targetRoute } = login('varunk6325@gmail.com', 'switcher', 'Varun K.', true);
                navigate(targetRoute);
              }}
              className="px-3 py-1.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold cursor-pointer shrink-0"
            >
              Sign In →
            </button>
          </div>
        </div>

        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
          Privacy by default. Contact details are never shared with Career Guides or pods without your explicit toggle.
        </p>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        {authMode === 'signin' ? (
          <>
            New to People Like Me?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className="text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-semibold cursor-pointer"
            >
              Create your account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className="text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-semibold cursor-pointer"
            >
              Sign in with email
            </button>
          </>
        )}
      </footer>

      {/* Google Sign-In Modal */}
      {showGmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 shadow-xl space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
              <span className="text-sm font-semibold">Continue with Google</span>
              <button
                type="button"
                onClick={() => setShowGmailModal(false)}
                className="p-1 rounded-full text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGmailSignInSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={gmailName}
                  onChange={(e) => setGmailName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Google Email
                </label>
                <input
                  type="email"
                  required
                  value={gmailInput}
                  onChange={(e) => setGmailInput(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGmailModal(false)}
                  className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-medium cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};