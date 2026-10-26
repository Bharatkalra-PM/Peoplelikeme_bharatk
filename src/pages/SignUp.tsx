import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { ApiKeysInfoModal } from '../components/ApiKeysInfoModal';
import {
  ArrowRight,
  Mail,
  Check,
  Key,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

export const SignUp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as 'switcher' | 'guide') || 'switcher';
  const [role, setRole] = useState<'switcher' | 'guide'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [sentMagicLink, setSentMagicLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(() => {
    const errType = searchParams.get('error');
    if (errType === 'expired_link') {
      return 'This sign-in link has expired. Please request a fresh magic link below.';
    }
    if (errType === 'google_cancelled') {
      return 'Google sign-in was cancelled. You can try again or continue with email.';
    }
    if (errType === 'network') {
      return 'Network failure while signing in. Please check your connection and try again.';
    }
    return null;
  });

  // Google Sign-In modal state
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailInput, setGmailInput] = useState('varunk6325@gmail.com');
  const [gmailName, setGmailName] = useState('Varun K.');
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { login } = useApp();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (googleClientId && window.google?.accounts?.id && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: any) => {
          try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            const userEmail = payload.email || 'varunk6325@gmail.com';
            const userName = payload.name || payload.given_name || 'Varun K.';
            const { targetRoute } = login(userEmail, role, userName);
            navigate(targetRoute);
          } catch (err) {
            setAuthError(
              'We could not verify that Google sign-in token. Please try again or continue with email.'
            );
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 380,
        text: 'continue_with',
        shape: 'pill',
      });
    }
  }, [googleClientId, role]);

  const handleContinueWithGoogle = () => {
    setAuthError(null);
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isSkippedMoment?.() || notification.isDismissedMoment?.()) {
          setAuthError(
            'Google sign-in was cancelled. You can retry or continue with email below.'
          );
        }
      });
    } else {
      setShowGmailModal(true);
    }
  };

  const handleGmailSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailInput.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setAuthError(null);

    let finalName = gmailName.trim();
    if (!finalName) {
      const prefix = gmailInput.split('@')[0] || 'Varun';
      const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      finalName = `${capitalized} S.`;
    }

    const { targetRoute } = login(gmailInput.trim(), role, finalName);
    setShowGmailModal(false);
    setIsSubmitting(false);
    navigate(targetRoute);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    if (email.trim().toLowerCase().includes('expired')) {
      setAuthError('This magic link has expired. Please request a fresh link.');
      return;
    }
    if (email.trim().toLowerCase().includes('offline')) {
      setAuthError('Network failure while sending your magic link. Please retry.');
      return;
    }

    setAuthError(null);
    setIsSubmitting(true);
    setSentMagicLink(true);

    setTimeout(() => {
      const displayName =
        name.trim() || (role === 'guide' ? 'Arjun K.' : 'Varun K.');
      const { targetRoute } = login(email.trim(), role, displayName);
      setIsSubmitting(false);
      navigate(targetRoute);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] flex flex-col justify-between p-6">
      <header className="max-w-md mx-auto w-full pt-4 flex items-center justify-between">
        <BrandMark />
        <button
          type="button"
          onClick={() => setShowApiKeysModal(true)}
          className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] cursor-pointer"
        >
          <Key className="w-3.5 h-3.5 text-[#F2B134]" />
          <span>API Keys</span>
        </button>
      </header>

      <main className="max-w-md mx-auto w-full py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            {role === 'switcher'
              ? 'Find your Career Guide and pod'
              : 'Become a Career Guide'}
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            {role === 'switcher'
              ? 'Join people making your exact move. Continue with Google or a magic email link.'
              : 'Help someone making the transition you made 1â€“5 years ago.'}
          </p>
        </div>

        {/* Friendly Error Alert with Retry */}
        {authError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-[#A8432C]/10 border border-[#A8432C]/30 text-xs text-[#A8432C] dark:text-[#E58C73] flex items-start justify-between gap-3"
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
              <span>Retry</span>
            </button>
          </div>
        )}

                {/* Demo Accounts Box */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#F2B134]/60 space-y-2.5 shadow-xs text-xs">
          <p className="font-semibold uppercase tracking-wider text-[11px] text-[#8A5A00] dark:text-[#F2B134]">
            Demo Login Accounts (1-Click or Email + Password)
          </p>
          <div className="p-2.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">Bharat K. (Active Dashboard)</p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">Email: <strong>bharatk6325@gmail.com</strong> • Pass: <strong>Bharat@123</strong></p>
            </div>
            <button type="button" onClick={() => { const { targetRoute } = login('bharatk6325@gmail.com', 'switcher', 'Bharat K.', false); navigate(targetRoute); }} className="px-3 py-1.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold cursor-pointer shrink-0">Login →</button>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#13231F] dark:text-[#E6EEEA]">Varun K. (New Switcher Onboarding)</p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">Email: <strong>varunk6325@gmail.com</strong> • Pass: <strong>Varun@123</strong></p>
            </div>
            <button type="button" onClick={() => { const { targetRoute } = login('varunk6325@gmail.com', 'switcher', 'Varun K.', true); navigate(targetRoute); }} className="px-3 py-1.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold cursor-pointer shrink-0">Login →</button>
          </div>
        </div>
        {/* Role toggle */}
        <div className="flex p-1 bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-full text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole('switcher')}
            className={`flex-1 py-2 rounded-full transition-colors cursor-pointer ${
              role === 'switcher'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            I'm making a career switch
          </button>
          <button
            type="button"
            onClick={() => setRole('guide')}
            className={`flex-1 py-2 rounded-full transition-colors cursor-pointer ${
              role === 'guide'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            I want to be a Career Guide
          </button>
        </div>

        {sentMagicLink ? (
          <div className="p-6 bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg">Signing you in</h2>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Verifying magic link for{' '}
              <strong className="text-[#13231F] dark:text-[#E6EEEA]">{email}</strong>...
            </p>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-xs">
            <div ref={googleButtonRef} className="flex justify-center" />

            {/* Continue with Google Button */}
            <button
              onClick={handleContinueWithGoogle}
              type="button"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors text-[#13231F] dark:text-[#E6EEEA] shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
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

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#D3DDD8] dark:border-[#2A403C] w-full" />
              <span className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-3 text-[11px] text-[#55665F] dark:text-[#A6B8B0] absolute">
                or magic link
              </span>
            </div>

            {/* Continue with email (magic link) form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="signup-name"
                  className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]"
                >
                  Your Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Varun K."
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="signup-email"
                  className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#55665F] dark:text-[#A6B8B0] absolute left-3.5 top-3" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="varunk6325@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="signup-password"
                  className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]"
                >
                  Password (Optional for magic link • Demo: Bharat@123 or Varun@123)
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Bharat@123 or Varun@123"
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>Continue with email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
          Privacy by default. Contact details are never shared with Career Guides or pods without your explicit toggle.
        </p>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Returning member?{' '}
        <button
          type="button"
          onClick={() => {
            const { targetRoute } = login(
              'bharatk6325@gmail.com',
              'switcher',
              'Bharat K.',
              false
            );
            navigate(targetRoute);
          }}
          className="text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium cursor-pointer"
        >
          Sign in as returning user (Bharat K.)
        </button>
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
                onClick={() => {
                  setShowGmailModal(false);
                  setAuthError(
                    'Google sign-in was cancelled. You can retry or continue with email.'
                  );
                }}
                className="p-1 rounded-full text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    Varun K. (varunk6325@gmail.com)
                  </p>
                  <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                    New user journey (starts at Step 2)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const { targetRoute } = login(
                      'varunk6325@gmail.com',
                      role,
                      'Varun K.',
                      true
                    );
                    setShowGmailModal(false);
                    navigate(targetRoute);
                  }}
                  className="px-3 py-1 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium cursor-pointer"
                >
                  Continue
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    Bharat K. (bharatk6325@gmail.com)
                  </p>
                  <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                    Returning user (goes to Dashboard)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const { targetRoute } = login(
                      'bharatk6325@gmail.com',
                      role,
                      'Bharat K.',
                      false
                    );
                    setShowGmailModal(false);
                    navigate(targetRoute);
                  }}
                  className="px-3 py-1 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>

            <form onSubmit={handleGmailSignInSubmit} className="space-y-3 text-xs pt-2 border-t border-[#D3DDD8] dark:border-[#2A403C]">
              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Your Name
                </label>
                <input
                  type="text"
                  value={gmailName}
                  onChange={(e) => setGmailName(e.target.value)}
                  placeholder="e.g. Varun K."
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
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowGmailModal(false);
                    setAuthError(
                      'Google sign-in was cancelled. You can retry or continue with email.'
                    );
                  }}
                  className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-medium cursor-pointer"
                >
                  Sign in with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ApiKeysInfoModal
        isOpen={showApiKeysModal}
        onClose={() => setShowApiKeysModal(false)}
      />
    </div>
  );
};

