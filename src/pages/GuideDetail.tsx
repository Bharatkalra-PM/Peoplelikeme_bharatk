import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { formatMoveLine, isNewGuide } from '../lib/matching';
import { ArrowLeft, ArrowRight, ShieldCheck, Clock, MapPin, Star, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

export const GuideDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { guidesList, sendGuideRequest, acceptGuideRequest } = useApp();
  const navigate = useNavigate();

  // Resilient lookup across standard IDs, sample-prefixed IDs, or name slug
  const cleanId = (id || '').replace(/^sample-/, '');
  const foundGuide = guidesList.find(
    (g) =>
      g.profile.id === id ||
      g.profile.id === cleanId ||
      sample- === id ||
      g.profile.id.toLowerCase().includes(cleanId.toLowerCase())
  );

  // If a custom slug was visited, synthesize a complete profile from the slug so "not found" is impossible
  const slugParts = cleanId.replace(/^guide-/, '').split('-');
  const fallbackFirst = slugParts[0]
    ? slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1)
    : 'Vikram';
  const fallbackInit = slugParts[1] ? ${slugParts[1].charAt(0).toUpperCase()}. : 'S.';

  const guideItem = foundGuide || {
    ...guidesList[0],
    profile: {
      ...guidesList[0].profile,
      id: id || 'guide-vikram-s',
      first_name: fallbackFirst,
      last_initial: fallbackInit,
      full_name: ${fallbackFirst} ,
    },
  };

  const { profile: guide, move_profile: moveProf } = guideItem;

  const [note, setNote] = useState(
    Hi , I saw that you transitioned from  to . I am navigating a similar move and would love your guidance over the next 8 weeks.
  );
  const [requestAccepted, setRequestAccepted] = useState(false);

  const moveLine = formatMoveLine(
    moveProf.from_role,
    moveProf.to_role,
    moveProf.went_back,
    moveProf.from_field,
    moveProf.years_since_move
  );
  const isNew = isNewGuide(guide);
  const guidedCount = guide.guided_count ?? 5;

  const handleAcceptAndContinue = (targetPath: string) => {
    sendGuideRequest(guide.id, note, Shared transition background in .);
    acceptGuideRequest(guide.id);
    setRequestAccepted(true);
    navigate(targetPath);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendGuideRequest(guide.id, note, Shared transition background in .);
    acceptGuideRequest(guide.id);
    setRequestAccepted(true);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
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
              Dashboard
            </Link>
          </div>
        </header>

        {/* Live Request Accepted Banner */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border-2 border-[#2F7D5B] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F7D5B] dark:text-[#5FBF8F] block">
                  {requestAccepted ? 'Request Accepted & Confirmed' : 'Career Guide Available & Ready'}
                </span>
                <h2 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  {guide.first_name} {guide.last_initial} has acknowledged your match and is ready to guide your 8-week sprint!
                </h2>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#13231F] dark:text-[#E6EEEA] bg-[#F1F5F2] dark:bg-[#122523] p-3.5 rounded-xl border border-[#D3DDD8]/70 dark:border-[#2A403C] italic">
            "Hi! I reviewed your transition profile ({moveProf.from_role} → {moveProf.to_role}). I have accepted your request and drafted your Week 1–8 milestones. Click below to move ahead into our Week 1 workspace!" — <strong>{guide.first_name} {guide.last_initial}</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleAcceptAndContinue('/home')}
              className="flex-1 py-3 px-5 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>Accept & Move Ahead to Week 1 Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAcceptAndContinue('/guide')}
              className="py-3 px-5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message {guide.first_name} (1:1 Space)</span>
            </button>
          </div>
        </div>

        {/* Career Guide Full Profile Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
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
                  <span>{Number(guide.rating_avg ?? 4.8).toFixed(1)} · Guided {guidedCount} people</span>
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Approved Career Guide</span>
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C]">
            <span className="text-[10px] font-semibold uppercase text-[#55665F] dark:text-[#A6B8B0] tracking-wider">
              Transition Path
            </span>
            <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-0.5">
              {moveLine}
            </p>
          </div>

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

          <div className="space-y-2">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
              Their story & how they made the switch
            </h2>
            <p className="text-sm text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
              {moveProf.story || 'Switched into product management and learned how to translate non-traditional backgrounds into strengths.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="pt-6 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="request-note" className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Your introductory note to {guide.first_name}
                </label>
                <span className="text-[11px] text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Instant Acknowledgement Enabled</span>
                </span>
              </div>
              <textarea
                id="request-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleAcceptAndContinue('/request-sent')}
              className="w-full py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>Send Request & View {guide.first_name}'s Acceptance →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
