import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { formatMoveLine, isNewGuide } from '../lib/matching';
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, MapPin, Star, Sparkles, Zap } from 'lucide-react';

export const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { guidesList, sendGuideRequest, acceptGuideRequest } = useApp();
  const navigate = useNavigate();

  // Resilient lookup across both standard IDs and sample-prefixed IDs, falling back to guidesList[0]
  const cleanId = (id || '').replace(/^sample-/, '');
  const guideItem =
    guidesList.find(
      (g) =>
        g.profile.id === id ||
        g.profile.id === cleanId ||
        `sample-${g.profile.id}` === id
    ) || guidesList[0];

  const [note, setNote] = useState(() =>
    guideItem
      ? `Hi ${guideItem.profile.first_name}, I saw that you transitioned from ${guideItem.move_profile.from_role} to ${guideItem.move_profile.to_role}. I am currently navigating a similar move and would love your guidance on prioritizing my weekly learning and navigating the transition.`
      : 'Hi, I would love your guidance on navigating this career transition.'
  );
  const [submitting, setSubmitting] = useState(false);

  const { profile: guide, move_profile: moveProf } = guideItem;
  const moveLine = formatMoveLine(
    moveProf.from_role,
    moveProf.to_role,
    moveProf.went_back,
    moveProf.from_field,
    moveProf.years_since_move
  );
  const isNew = isNewGuide(guide);
  const guidedCount = guide.guided_count ?? 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    sendGuideRequest(guide.id, note, `Shared transition background in ${moveProf.to_role}.`);
    navigate('/request-sent');
  };

  const handleInstantMatchAndStart = () => {
    if (submitting) return;
    setSubmitting(true);
    sendGuideRequest(guide.id, note, `Shared transition background in ${moveProf.to_role}.`);
    acceptGuideRequest('req-instant');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Link
              to="/guides"
              className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Recommended Career Guides</span>
            </Link>
            <Link
              to="/home"
              className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA]"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Career Guide Profile Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <InitialsAvatar firstName={guide.first_name} lastInitial={guide.last_initial} size="lg" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                    {guide.first_name} {guide.last_initial}
                  </h1>
                  {guide.is_sample && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]">
                      Sample profile
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{guide.city}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isNew ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New · Guided {guidedCount} people</span>
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{(guide.rating_avg ?? 4.8).toFixed(1)} · Guided {guidedCount} people</span>
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Approved Career Guide</span>
              </span>
            </div>
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
              <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{moveProf.years_since_move || 2} years</span>
            </div>
            <div className="p-3 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] col-span-2 sm:col-span-1">
              <span className="text-[#55665F] dark:text-[#A6B8B0] block text-[11px]">Field / Industry</span>
              <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{moveProf.from_field || moveProf.from_company_type || 'Tech'}</span>
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
                <label htmlFor="request-note" className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Add a short note with your request
                </label>
                <span className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>48-hour response rule</span>
                </span>
              </div>
              <textarea
                id="request-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-none"
              />
            </div>

            <div className="space-y-2.5">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <span>{submitting ? 'Sending request...' : `Ask ${guide.first_name} to be your Career Guide`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleInstantMatchAndStart}
                className="w-full py-2.5 rounded-full border border-[#2F7D5B] text-[#2F7D5B] dark:text-[#5FBF8F] hover:bg-[#2F7D5B]/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fast-Track Demo: Ask & Immediately Start Week 1 with {guide.first_name} →</span>
              </button>
            </div>
          </form>
        </div>

        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0]">
          If {guide.first_name} doesn't respond within 48 hours, we'll automatically offer your next best match.
        </p>
      </div>
    </div>
  );
};
