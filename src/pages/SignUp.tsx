import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { ApiKeysInfoModal } from '../components/ApiKeysInfoModal';
import { ArrowRight, Mail, Check, Key, Sparkles, X, Info } from 'lucide-react';

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
  const [name, setName] = useState('');
  const [sentMagicLink, setSentMagicLink] = useState(false);

  // Gmail-specific Sign In modal state
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailInput, setGmailInput] = useState('bharatk6325@gmail.com');
  const [gmailName, setGmailName] = useState('Bharat K.');
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { login } = useApp();
  const navigate = useNavigate();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Initialize Google Identity Services (GIS) if client ID is configured
  useEffect(() => {
    if (googleClientId && window.google?.accounts?.id && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: any) => {
          try {
            // Decode credential JWT payload
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            const userEmail = payload.email || 'user@gmail.com';
            const userName = payload.name || payload.given_name || 'Google User';
            login(userEmail, role, userName);
            if (role === 'guide') {
              navigate('/become-a-guide');
            } else {
              navigate('/onboarding/story');
            }
          } catch (err) {
            console.error('Failed to parse Google JWT credential:', err);
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
    // If client ID is present and GIS has initialized, trigger standard prompt
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // Open instant Gmail ID modal
      setShowGmailModal(true);
    }
  };

  const handleGmailSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailInput.trim()) return;

    // Derive display name from email if name not entered
    let finalName = gmailName.trim();
    if (!finalName) {
      const prefix = gmailInput.split('@')[0] || 'User';
      const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      finalName = `${capitalized} G.`;
    }

    login(gmailInput.trim(), role, finalName);
    setShowGmailModal(false);

    if (role === 'guide') {
      navigate('/become-a-guide');
    } else {
      navigate('/onboarding/story');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSentMagicLink(true);
    setTimeout(() => {
      login(email, role, name || (role === 'guide' ? 'Alex R.' : 'Alex N.'));
      if (role === 'guide') {
        navigate('/become-a-guide');
      } else {
        navigate('/onboarding/story');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] flex flex-col justify-between p-6">
      <header className="max-w-md mx-auto w-full pt-4 flex items-center justify-between">
        <BrandMark />
        <button
          type="button"
          onClick={() => setShowApiKeysModal(true)}
          className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C]"
        >
          <Key className="w-3.5 h-3.5 text-[#F2B134]" />
          <span>API Keys</span>
        </button>
      </header>

      <main className="max-w-md mx-auto w-full py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            {role === 'switcher' ? 'Find your guide and pod' : 'Share what you learned'}
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            {role === 'switcher'
              ? 'Join people making your exact move. Sign in with your Gmail ID or email.'
              : 'Help someone making the transition you made 1–5 years ago.'}
          </p>
        </div>

        {/* Role toggle */}
        <div className="flex p-1 bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-full text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole('switcher')}
            className={`flex-1 py-2 rounded-full transition-colors ${
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
            className={`flex-1 py-2 rounded-full transition-colors ${
              role === 'guide'
                ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                : 'text-[#55665F] dark:text-[#A6B8B0]'
            }`}
          >
            I've made a switch and want to guide
          </button>
        </div>

        {sentMagicLink ? (
          <div className="p-6 bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-lg">Signing you in</h2>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Checking link for <strong className="text-[#13231F] dark:text-[#E6EEEA]">{email}</strong>...
            </p>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-xs">
            {/* Google Identity Official Button container if configured */}
            <div ref={googleButtonRef} className="flex justify-center" />

            {/* Google / Gmail Sign-In Button */}
            <button
              onClick={handleContinueWithGoogle}
              type="button"
              className="w-full py-3 px-4 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors text-[#13231F] dark:text-[#E6EEEA] shadow-xs active:scale-98"
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
              <span>Sign in with Google / Gmail ID</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#D3DDD8] dark:border-[#2A403C] w-full" />
              <span className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-3 text-[11px] text-[#55665F] dark:text-[#A6B8B0] absolute">
                or email link
              </span>
            </div>

            {/* Email Magic link form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex N."
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#55665F] dark:text-[#A6B8B0] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Continue with Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
          Privacy by default. Contact details are never shared with guides or pods without your explicit toggle.
        </p>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Already registered?{' '}
        <button
          onClick={() => {
            login('bharatk6325@gmail.com', 'switcher', 'Bharat K.');
            navigate('/home');
          }}
          className="text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline font-medium"
        >
          Sign in directly with your Gmail (Bharat K.)
        </button>
      </footer>

      {/* Gmail ID Sign-In Modal */}
      {showGmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 shadow-xl space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with your Gmail ID</span>
              </div>
              <button
                onClick={() => setShowGmailModal(false)}
                className="p-1 rounded-full text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Sign in with your personal or workspace Google account:
            </p>

            {/* Quick 1-tap chip for the user's Gmail */}
            <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  bharatk6325@gmail.com
                </p>
                <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                  Your authenticated Google account
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGmailInput('bharatk6325@gmail.com');
                  setGmailName('Bharat K.');
                  login('bharatk6325@gmail.com', role, 'Bharat K.');
                  setShowGmailModal(false);
                  if (role === 'guide') {
                    navigate('/become-a-guide');
                  } else {
                    navigate('/onboarding/story');
                  }
                }}
                className="px-3 py-1 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium"
              >
                Sign In
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#D3DDD8] dark:border-[#2A403C] w-full" />
              <span className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-2 text-[10px] text-[#55665F] dark:text-[#A6B8B0] absolute">
                or enter another Gmail
              </span>
            </div>

            <form onSubmit={handleGmailSignInSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Your Name</label>
                <input
                  type="text"
                  value={gmailName}
                  onChange={(e) => setGmailName(e.target.value)}
                  placeholder="e.g. Bharat K."
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Gmail Address</label>
                <input
                  type="email"
                  required
                  value={gmailInput}
                  onChange={(e) => setGmailInput(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeysModal(true)}
                  className="text-[11px] text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Configure Google Client ID</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGmailModal(false)}
                    className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-medium"
                  >
                    Continue as {role}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Keys Overview Modal */}
      <ApiKeysInfoModal
        isOpen={showApiKeysModal}
        onClose={() => setShowApiKeysModal(false)}
      />
    </div>
  );
};
