import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../../components/BrandMark';
import { requestDraftMoveProfile } from '../../lib/gemini';
import { formatMoveLine } from '../../lib/matching';
import { MoveProfile } from '../../types';
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Check } from 'lucide-react';

export const Confirm: React.FC = () => {
  const {
    currentUser,
    storyAnswers,
    backgroundInfo,
    detailChips,
    confirmMoveProfile,
    draftedProfile,
    setDraftedProfile,
  } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!draftedProfile);
  const [profile, setProfile] = useState<MoveProfile>(() => {
    return (
      draftedProfile || {
        user_id: currentUser?.id || 'switcher-priya-m',
        from_role: storyAnswers?.coming_from?.answer || 'B2B SaaS Sales Lead',
        from_field: 'Sales & Solutions',
        from_company_type: 'Growth-stage tech',
        to_role: 'Product Manager',
        years_experience: 5,
        months_since_leaving: null,
        dependants: detailChips.dependants || 'None',
        priority: detailChips.priority || 'Speed to role',
        availability: detailChips.availability || ['Weekday evenings'],
        constraints: detailChips.constraints || [],
        went_back: false,
        years_since_move: null,
        story:
          storyAnswers?.pushing_change?.answer ||
          'Spent 5 years closing enterprise software deals and solving customer friction; transitioning into full-time product management.',
        confirmed_at: null,
      }
    );
  });

  // Call Gemini to draft profile
  useEffect(() => {
    let isMounted = true;
    if (!draftedProfile) {
      setLoading(true);
      requestDraftMoveProfile({
        storyAnswers: {
          coming_from: storyAnswers?.coming_from?.answer,
          going_to: storyAnswers?.going_to?.answer,
          pushing_change: storyAnswers?.pushing_change?.answer,
          tried_so_far: storyAnswers?.tried_so_far?.answer,
          holding_back: storyAnswers?.holding_back?.answer,
          story: storyAnswers?.story?.answer,
        },
        cvText: backgroundInfo.cvText,
        linkedInText: backgroundInfo.linkedInText,
        detailChips,
      })
        .then((draft) => {
          if (!isMounted) return;
          const merged: MoveProfile = {
            user_id: currentUser?.id || 'switcher-priya-m',
            from_role: draft.from_role || 'B2B SaaS Sales',
            from_field: draft.from_field || 'Sales',
            from_company_type: draft.from_company_type || 'Growth-stage startup',
            to_role: draft.to_role || 'Product Manager',
            years_experience: draft.years_experience ?? 5,
            months_since_leaving: draft.months_since_leaving ?? null,
            dependants: draft.dependants || detailChips.dependants || 'None',
            priority: draft.priority || detailChips.priority || 'Speed to role',
            availability: draft.availability?.length ? draft.availability : detailChips.availability,
            constraints: draft.constraints?.length ? draft.constraints : detailChips.constraints,
            went_back: false,
            years_since_move: null,
            story: draft.story || 'Making a focused move based on customer problem-solving experience.',
            confirmed_at: null,
          };
          setProfile(merged);
          setDraftedProfile(merged);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirm = () => {
    confirmMoveProfile(profile);
    navigate('/matching');
  };

  const moveLine = formatMoveLine(profile.from_role, profile.to_role, false);

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
            Step 4 of 4
          </span>
        </header>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            <Sparkles className="w-4 h-4" />
            <span>AI Drafted Profile</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Confirm your move profile
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Review and adjust what our model drafted from your answers. This is the only profile fact sheet used for matching.
          </p>
        </div>

        {loading ? (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-12 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#F2B134] mx-auto" />
            <p className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">
              Drafting your move profile with Gemini...
            </p>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Extracting facts strictly from your answers without inventing employers or numbers.
            </p>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Move Line Summary Banner */}
            <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/70 dark:border-[#2A403C] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0] uppercase tracking-wide">
                  Your Move Line
                </span>
                <p className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA] mt-0.5">
                  {moveLine}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Ready to match
              </span>
            </div>

            {/* Editable Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Moving from role</label>
                <input
                  type="text"
                  value={profile.from_role}
                  onChange={(e) => setProfile({ ...profile, from_role: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Moving to role</label>
                <input
                  type="text"
                  value={profile.to_role}
                  onChange={(e) => setProfile({ ...profile, to_role: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Field / Industry</label>
                <input
                  type="text"
                  value={profile.from_field}
                  onChange={(e) => setProfile({ ...profile, from_field: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Company environment</label>
                <input
                  type="text"
                  value={profile.from_company_type}
                  onChange={(e) => setProfile({ ...profile, from_company_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Years of prior experience</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={profile.years_experience}
                  onChange={(e) => setProfile({ ...profile, years_experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Primary priority</label>
                <input
                  type="text"
                  value={profile.priority}
                  onChange={(e) => setProfile({ ...profile, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Dependants setup</label>
                <input
                  type="text"
                  value={profile.dependants}
                  onChange={(e) => setProfile({ ...profile, dependants: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Summary story</label>
                <textarea
                  rows={3}
                  value={profile.story || ''}
                  onChange={(e) => setProfile({ ...profile, story: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <button
            type="button"
            onClick={() => navigate('/onboarding/details')}
            className="px-4 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="px-8 py-3.5 rounded-full bg-[#F2B134] hover:bg-[#e0a32e] text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
          >
            <span>Confirm & find my people</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
