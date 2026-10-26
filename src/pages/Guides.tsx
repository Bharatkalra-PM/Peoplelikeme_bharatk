import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { isNewGuide } from '../lib/matching';
import { GenderOption } from '../types';
import {
  ShieldCheck,
  Bell,
  Info,
  SlidersHorizontal,
  Star,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';

export const Guides: React.FC = () => {
  const {
    guideCandidates,
    rematchOffered,
    rematchReasonNote,
    currentMoveProfile,
    currentUser,
    updateMatchingParameters, sendGuideRequest, acceptGuideRequest,
  } = useApp();
  const navigate = useNavigate();
  const [notified, setNotified] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Adjust What Matters form state
  const [adjFromRole, setAdjFromRole] = useState(
    currentMoveProfile?.from_role || 'Sales'
  );
  const [adjFromField, setAdjFromField] = useState(
    currentMoveProfile?.from_field || 'Sales'
  );
  const [adjToRole, setAdjToRole] = useState(
    currentMoveProfile?.to_role || 'Product Manager'
  );
  const [adjYears, setAdjYears] = useState<number>(
    currentMoveProfile?.years_experience ?? 5
  );
  const [adjCity, setAdjCity] = useState(currentUser?.city || 'Bengaluru');
  const [adjPriority, setAdjPriority] = useState(
    currentMoveProfile?.priority || 'Speed to role'
  );
  const [adjGender, setAdjGender] = useState<GenderOption>(
    currentMoveProfile?.preferred_guide_gender || 'No preference'
  );

  const openAdjustModal = () => {
    setAdjFromRole(currentMoveProfile?.from_role || 'Sales');
    setAdjFromField(currentMoveProfile?.from_field || 'Sales');
    setAdjToRole(currentMoveProfile?.to_role || 'Product Manager');
    setAdjYears(currentMoveProfile?.years_experience ?? 5);
    setAdjCity(currentUser?.city || 'Bengaluru');
    setAdjPriority(currentMoveProfile?.priority || 'Speed to role');
    setAdjGender(currentMoveProfile?.preferred_guide_gender || 'No preference');
    setShowAdjustModal(true);
  };

  const handleApplyAdjustments = (e: React.FormEvent) => {
    e.preventDefault();
    updateMatchingParameters({
      from_role: adjFromRole,
      from_field: adjFromField,
      to_role: adjToRole,
      years_experience: adjYears,
      priority: adjPriority,
      preferred_guide_gender: adjGender,
      city: adjCity,
    });
    setShowAdjustModal(false);
  };

  const { matches, isNoMatch } = guideCandidates;
  // Never show more than 5 at once
  const visibleMatches = matches.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <button
              type="button"
              onClick={openAdjustModal}
              className="px-3.5 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:border-[#102A2E] dark:hover:border-[#F2B134] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F2B134]" />
              <span>Adjust what matters</span>
            </button>
          </div>
        </header>

        {/* Rematch banner if 48h expired or previous Career Guide declined */}
        {rematchOffered && (
          <div className="p-4 rounded-xl bg-[#F2B134]/15 border border-[#F2B134]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-[#8A5A00] dark:text-[#F2B134] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs uppercase tracking-wide text-[#8A5A00] dark:text-[#F2B134]">
                Next Best Career Guide Match
              </p>
              <p className="text-xs sm:text-sm mt-0.5">
                {rematchReasonNote ||
                  "Your previous Career Guide couldn't take this on right now. Here is your next best match."}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              Recommended Career Guides
            </h1>
            {!isNoMatch && (
              <p className="text-sm font-medium text-[#55665F] dark:text-[#A6B8B0]">
                These are your closest matches, not everyone.
              </p>
            )}
          </div>

          {!isNoMatch && (
            <button
              type="button"
              onClick={openAdjustModal}
              className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#102A2E] dark:border-[#F2B134] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] hover:bg-[#102A2E] hover:text-white dark:hover:bg-[#F2B134] dark:hover:text-[#102A2E] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Adjust what matters</span>
            </button>
          )}
        </div>

        {/* Empty / No Match State */}
        {isNoMatch ? (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-8 text-center space-y-5 shadow-xs">
            <div className="max-w-lg mx-auto space-y-2">
              <h2 className="font-heading text-xl text-[#13231F] dark:text-[#E6EEEA]">
                Nobody has made exactly this move with us yet. We'd rather tell you honestly than show a weak match.
              </h2>
              <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0]">
                You can ask us to notify you as soon as an approved Career Guide with this path joins, or adjust your matching parameters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNotified(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notified ? 'âœ“ We will notify you' : 'Notify me'}</span>
              </button>

              <button
                type="button"
                onClick={openAdjustModal}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Adjust what matters</span>
              </button>
            </div>
          </div>
        ) : (
          /* 3 to 5 Approved Career Guide Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visibleMatches.map((candidate) => {
              const guide = candidate.profile;
              const moveProf = candidate.move_profile;
              const guideIsNew = isNewGuide(guide);
              const guidedCount = guide.guided_count ?? 1;

              return (
                <div
                  key={guide.id}
                  data-testid={`guide-card-${guide.id}`}
                  className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-[#102A2E]/50 dark:hover:border-[#F2B134]/50 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar + First name & last initial + Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <InitialsAvatar
                          firstName={guide.first_name}
                          lastInitial={guide.last_initial}
                          size="md"
                        />
                        <div className="min-w-0">
                          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] whitespace-nowrap truncate">
                            {guide.first_name} {guide.last_initial}
                          </h2>
                          <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] truncate">
                            {guide.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {guide.is_sample && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134]">
                            Sample profile
                          </span>
                        )}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      </div>
                    </div>

                    {/* Rating & Guided N people (Guides with < 3 ratings show "New" instead of stars) */}
                    <div className="flex items-center gap-2 text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      {guideIsNew ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#7FB6D6] font-semibold text-[11px]">
                          New
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                          <Star className="w-3.5 h-3.5 fill-[#F2B134] text-[#F2B134]" />
                          <span>{(guide.rating_avg ?? 4.9).toFixed(1)}</span>
                        </span>
                      )}
                      <span>Â·</span>
                      <span>
                        Guided {guidedCount} {guidedCount === 1 ? 'person' : 'people'}
                      </span>
                    </div>

                    {/* Move Line ("Sales, consumer goods â†’ Product manager Â· 2 years ago") */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0] tracking-wider">
                        Career Move
                      </span>
                      <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                        {candidate.move_line}
                      </p>
                    </div>

                    {/* Why we matched you (one sentence under 20 words, only shared facts) */}
                    <div className="p-3 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] space-y-1">
                      <span className="text-[10px] font-semibold text-[#55665F] dark:text-[#A6B8B0] uppercase tracking-wide">
                        Why we matched you
                      </span>
                      <p className="text-xs text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
                        {candidate.match_reason}
                      </p>
                    </div>

                    {/* Key facts chips */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                      <span className="px-2 py-0.5 rounded-full bg-[#F1F5F2] dark:bg-[#122523]">
                        {moveProf.priority}
                      </span>
                      {moveProf.went_back && (
                        <span className="px-2 py-0.5 rounded-full bg-[#A8432C]/10 text-[#A8432C] dark:text-[#E58C73]">
                          Returned to {moveProf.from_field}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-5 mt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
                    <button
                      type="button"
                      onClick={() => navigate(`/guides/${guide.id}`)}
                      className="w-full py-2.5 rounded-full border border-[#102A2E] dark:border-[#F2B134] hover:bg-[#102A2E] hover:text-white dark:hover:bg-[#F2B134] dark:hover:text-[#102A2E] text-xs font-medium transition-colors text-center cursor-pointer"
                    >
                      Ask {guide.first_name} to be your Career Guide
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0]">
          Contact details are hidden until your Career Guide accepts. You can request one Career Guide at a time.
        </p>
      </div>

      {/* Adjust What Matters Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="adjust-modal-title"
            className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
              <h2
                id="adjust-modal-title"
                className="font-heading text-lg text-[#13231F] dark:text-[#E6EEEA]"
              >
                Adjust what matters
              </h2>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="p-1 text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustments} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="adj-from-role" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                    Moving from role
                  </label>
                  <input
                    id="adj-from-role"
                    type="text"
                    value={adjFromRole}
                    onChange={(e) => setAdjFromRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adj-to-role" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                    Target role
                  </label>
                  <input
                    id="adj-to-role"
                    type="text"
                    value={adjToRole}
                    onChange={(e) => setAdjToRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adj-industry" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                    Industry
                  </label>
                  <input
                    id="adj-industry"
                    type="text"
                    value={adjFromField}
                    onChange={(e) => setAdjFromField(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adj-city" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                    City
                  </label>
                  <input
                    id="adj-city"
                    type="text"
                    value={adjCity}
                    onChange={(e) => setAdjCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adj-years" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                    Years of experience
                  </label>
                  <input
                    id="adj-years"
                    type="number"
                    min={0}
                    max={45}
                    value={adjYears}
                    onChange={(e) => setAdjYears(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adj-priority" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                    What matters most
                  </label>
                  <select
                    id="adj-priority"
                    value={adjPriority}
                    onChange={(e) => setAdjPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  >
                    <option value="Speed to role">Speed to role</option>
                    <option value="Target salary">Target salary</option>
                    <option value="Domain fit">Domain fit</option>
                    <option value="Work-life balance">Work-life balance</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="adj-gender" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                    Prefer a Career Guide of a particular gender
                  </label>
                  <select
                    id="adj-gender"
                    value={adjGender}
                    onChange={(e) => setAdjGender(e.target.value as GenderOption)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  >
                    <option value="No preference">No preference</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D3DDD8] dark:border-[#2A403C]">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update matches</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

