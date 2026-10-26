import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { ArrowLeft, Send, HeartHandshake, Check, AlertCircle } from 'lucide-react';

export const ReachOut: React.FC = () => {
  const { promptId } = useParams<{ promptId: string }>();
  const { reachOutPrompts, sendPersonalReachOut } = useApp();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [sentToast, setSentToast] = useState(false);

  const prompt = reachOutPrompts.find((p) => p.id === promptId);

  const reasonExplanation =
    prompt?.reason === 'few_goals_two_weeks'
      ? 'Fewer than half of weekly goals were completed in each of the last two weeks.'
      : 'No goal updates or pod posts in the last 7 days.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !message.trim()) return;
    sendPersonalReachOut(prompt.id, message.trim());
    setSentToast(true);
    setTimeout(() => {
      navigate('/guide-home');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <Link
          to="/guide-home"
          className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Career Guide hub</span>
        </Link>
        <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
          Personal Reach Out
        </span>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-xl mx-auto">
        <div className="flex items-center gap-3">
          <InitialsAvatar
            firstName={prompt?.subject_name || 'Priya'}
            lastInitial={prompt?.subject_initial || 'M.'}
            size="lg"
          />
          <div>
            <h1 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              Check in with {prompt?.subject_name || 'Priya'} {prompt?.subject_initial || 'M.'}
            </h1>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              {prompt?.move_line || 'B2B SaaS Sales Lead → Product Manager'}
            </p>
          </div>
        </div>

        {/* Reason box (visible only to guide as per Section 5 & 6.5) */}
        <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] space-y-1">
          <span className="text-[10px] uppercase font-semibold text-[#8A5A00] dark:text-[#F2B134] tracking-wider flex items-center gap-1">
            <HeartHandshake className="w-3 h-3" />
            <span>Why we flagged this check-in</span>
          </span>
          <p className="text-xs text-[#13231F] dark:text-[#E6EEEA]">
            {reasonExplanation}
          </p>
        </div>

        <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
          People Like Me never sends automated check-ins on anyone’s behalf. Send a genuine, low-pressure note to see how they’re doing.
        </p>

        {sentToast ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              Message sent to {prompt?.subject_name || 'Priya'}
            </p>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Returning to your Career Guide dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                Your personal message (blank composer)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                placeholder="Hey Priya, just noticed your goals had slowed down a bit this week. Completely normal when switching careers. How are you feeling about the roadmap? Happy to adapt our call if you want to tackle something else."
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-xs focus:bg-white dark:focus:bg-[#0E1E1D] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Link
                to="/guide-home"
                className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium flex items-center gap-1.5 shadow-xs"
              >
                <span>Send check-in</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
