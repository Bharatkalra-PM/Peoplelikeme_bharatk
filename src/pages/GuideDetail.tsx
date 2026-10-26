import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { formatMoveLine } from '../lib/matching';
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, MapPin, Briefcase } from 'lucide-react';

export const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { guidesList, sendGuideRequest } = useApp();
  const navigate = useNavigate();

  const guideItem = guidesList.find((g) => g.profile.id === id);
  const [note, setNote] = useState(() =>
    guideItem
      ? `Hi ${guideItem.profile.first_name}, I saw that you transitioned from ${guideItem.move_profile.from_role} to ${guideItem.move_profile.to_role}. I am currently navigating a similar move and would love your guidance on prioritizing my weekly learning and navigating the transition.`
      : 'Hi, I would love your guidance on navigating this career transition.'
  );

  if (!guideItem) {
    return (
      <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-6 text-center space-y-4">
        <BrandMark />
        <p className="text-sm">Guide not found.</p>
        <Link to="/guides" className="text-xs text-[#2D6B8F] underline">
          Back to guides
        </Link>
      </div>
    );
  }

  const { profile: guide, move_profile: moveProf } = guideItem;
  const moveLine = formatMoveLine(moveProf.from_role, moveProf.to_role, moveProf.went_back);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendGuideRequest(guide.id, note, `Shared transition background in ${moveProf.to_role}.`);
    navigate('/request-sent');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <Link
            to="/guides"
            className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All guide matches</span>
          </Link>
        </header>

        {/* Guide Profile Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <InitialsAvatar firstName={guide.first_name} lastInitial={guide.last_initial} size="lg" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  {guide.first_name} {guide.last_initial}
                </h1>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{guide.city}</span>
                </p>
              </div>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified guide</span>
            </span>
          </div>

          {/* Move Line */}
          <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C]">
            <span className="text-[10px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0] tracking-wider">
              Transition Path
            </span>
            <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-0.5">
              {moveLine}
            </p>
          </div>

          {/* Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C]">
              <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Experience</span>
              <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{moveProf.years_experience} years prior</span>
            </div>
            <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C]">
              <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Time since move</span>
              <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{moveProf.years_since_move} years</span>
            </div>
            <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] col-span-2 sm:col-span-1">
              <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Company type</span>
              <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{moveProf.from_company_type || 'Tech startup'}</span>
            </div>
          </div>

          {/* Story Narrative */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
              Their story & how they made the switch
            </h2>
            <p className="text-sm text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
              {moveProf.story || 'Switched into product management and learned how to translate non-traditional backgrounds into strengths.'}
            </p>
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="pt-6 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Include a note with your request
                </label>
                <span className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>48-hour response rule</span>
                </span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Request {guide.first_name} as your guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0]">
          If {guide.first_name} doesn't respond within 48 hours, we'll automatically rematch you with your next best option.
        </p>
      </div>
    </div>
  );
};
