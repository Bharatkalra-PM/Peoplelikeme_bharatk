import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { formatMoveLine } from '../lib/matching';
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';

export const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { guidesList, sendGuideRequest } = useApp();
  const navigate = useNavigate();

  const cleanId = (id || '').replace(/^sample-/, '');
  const guideItem =
    guidesList.find(
      (g) =>
        g.profile.id === id ||
        g.profile.id === cleanId ||
        g.move_profile.user_id === id ||
        g.move_profile.user_id === cleanId
    ) || guidesList[0];

  const { profile: guide, move_profile: moveProf } = guideItem;
  const isCurrentlyFull =
    (guideItem.active_switchers_count ?? 0) >= 2 || id === 'guide-karthik-s';
  const moveLine = formatMoveLine(moveProf.from_role, moveProf.to_role, moveProf.went_back);

  const [note, setNote] = useState(() =>
    `Hi ${guide.first_name}, I saw that you transitioned from ${moveProf.from_role} to ${moveProf.to_role}. I am currently navigating a similar move and would love your guidance during my 4-week pilot.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCurrentlyFull) return;
    sendGuideRequest(guide.id, note, `Shared transition background in ${moveProf.to_role}.`, true);
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

            {isCurrentlyFull ? (
              <span
                data-testid="guide-currently-full-badge"
                className="text-xs px-3 py-1 rounded-full bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73] font-semibold flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Currently full</span>
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified guide</span>
              </span>
            )}
          </div>

          {/* Currently Full Banner if Guide has 2 active career changers (Section 4) */}
          {isCurrentlyFull && (
            <div
              data-testid="guide-currently-full-banner"
              className="p-4 rounded-xl bg-[#A8432C]/10 border border-[#A8432C]/30 text-xs text-[#13231F] dark:text-[#E6EEEA] space-y-2"
            >
              <p className="font-semibold text-[#A8432C] dark:text-[#E58C73]">
                Currently full (guiding 2 of 2 career changers)
              </p>
              <p className="text-[#55665F] dark:text-[#A6B8B0]">
                Each Career Guide supports at most two career changers at a time so every weekly 30-minute conversation stays personal and focused. Please choose another matched Career Guide.
              </p>
              <Link
                to="/guides"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline pt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Browse available Career Guides</span>
              </Link>
            </div>
          )}

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
              Their story &amp; how they made the change
            </h2>
            <p className="text-sm text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
              {moveProf.story || 'Transitioned into product management and learned how to translate non-traditional backgrounds into strengths.'}
            </p>
          </div>

          {/* Request Form */}
          {!isCurrentlyFull && (
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
                className="w-full py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Request {guide.first_name} as your Career Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0]">
          If {guide.first_name} doesn&apos;t respond within 48 hours, we&apos;ll automatically rematch you with your next best option.
        </p>
      </div>
    </div>
  );
};
