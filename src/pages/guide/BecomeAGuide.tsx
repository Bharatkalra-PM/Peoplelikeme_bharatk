import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../../components/BrandMark';
import { ArrowLeft, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';

export const BecomeAGuide: React.FC = () => {
  const { login, guidesList } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [fromRole, setFromRole] = useState('');
  const [toRole, setToRole] = useState('');
  const [yearsSinceMove, setYearsSinceMove] = useState(2);
  const [wentBack, setWentBack] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [story, setStory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'guide@example.com', 'guide', fullName || 'New Guide');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-2xl mx-auto w-full pt-4">
        <BrandMark />
      </header>

      <main className="max-w-2xl mx-auto w-full py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            <ShieldCheck className="w-4 h-4" />
            <span>Guide Community</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Become a Guide
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Help someone making the career move you navigated 1–5 years ago. Weekly 30-minute conversations, at most two switchers at a time.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-8 space-y-4 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="font-heading text-xl">Thank you for applying to guide</h2>
            <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] max-w-md mx-auto">
              In version 1, all guides are verified by an administrator to protect switcher safety. We have set up your profile and queued it for review.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/guide-home')}
                className="px-6 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
              >
                Go to Guide Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya S."
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Moved from role</label>
                <input
                  type="text"
                  required
                  value={fromRole}
                  onChange={(e) => setFromRole(e.target.value)}
                  placeholder="e.g. Retail Store Manager"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Moved into role</label>
                <input
                  type="text"
                  required
                  value={toRole}
                  onChange={(e) => setToRole(e.target.value)}
                  placeholder="e.g. Associate Product Manager"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Years since you made the move (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={yearsSinceMove}
                  onChange={(e) => setYearsSinceMove(parseInt(e.target.value) || 2)}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. London, Bengaluru, Remote"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">LinkedIn URL (for verification)</label>
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                />
              </div>

              <div className="sm:col-span-2 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={wentBack}
                    onChange={(e) => setWentBack(e.target.checked)}
                    className="mt-0.5 rounded border-[#D3DDD8] text-[#F2B134] focus:ring-[#F2B134]"
                  />
                  <span>
                    <strong>I eventually moved back to my original field</strong> (e.g. Sales → PM → back to Sales).
                    We value this honesty highly; switchers appreciate knowing what a role is really like.
                  </span>
                </label>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Brief story of your move (2–3 sentences)
                </label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="What was the hardest part? What do you wish someone had told you during the transition?"
                  className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[#D3DDD8] dark:border-[#2A403C]">
              <Link to="/" className="text-xs text-[#55665F] hover:underline">
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold shadow-xs"
              >
                Submit guide application
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Guides never solicit business or sell courses. Every session is peer mentorship.
      </footer>
    </div>
  );
};
