import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { Check, ShieldCheck, ArrowRight, Bell, UserPlus, Info } from 'lucide-react';

export const Guides: React.FC = () => {
  const { guideCandidates, rematchOffered, rematchReasonNote } = useApp();
  const navigate = useNavigate();
  const [notified, setNotified] = useState(false);
  const [invited, setInvited] = useState(false);

  const { matches, isNoMatch, closestGuides } = guideCandidates;

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <Link
            to="/onboarding/confirm"
            className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA]"
          >
            Edit profile
          </Link>
        </header>

        {/* Rematch banner if 48h expired or previous guide declined */}
        {rematchOffered && (
          <div className="p-4 rounded-xl bg-[#F2B134]/15 border border-[#F2B134]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-[#8A5A00] dark:text-[#F2B134] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs uppercase tracking-wide text-[#8A5A00] dark:text-[#F2B134]">
                Automatic Rematch
              </p>
              <p className="text-xs sm:text-sm mt-0.5">
                {rematchReasonNote || "Your previous guide couldn't take this on right now. Here are your next best matches."}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            {isNoMatch ? 'No exact guide match yet' : 'Choose your guide'}
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            {isNoMatch
              ? "Nobody has made exactly this move with us yet. We'd rather tell you honestly than show a weak match."
              : 'Pick one guide to connect with weekly for 30 minutes over your eight-week sprint.'}
          </p>
        </div>

        {/* No Match State */}
        {isNoMatch ? (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-2">
                <h2 className="font-heading text-lg">Closest guides in adjacent moves</h2>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                  Here are guides who navigated close paths, along with what differs from your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {closestGuides.map((guide) => (
                  <div
                    key={guide.profile.id}
                    className="p-5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <InitialsAvatar firstName={guide.profile.first_name} lastInitial={guide.profile.last_initial} />
                      <div>
                        <p className="font-medium text-sm text-[#13231F] dark:text-[#E6EEEA]">
                          {guide.profile.first_name} {guide.profile.last_initial}
                        </p>
                        <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">{guide.move_line}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-medium text-[#55665F] dark:text-[#A6B8B0]">What differs:</span>
                      <ul className="list-disc list-inside text-[#13231F] dark:text-[#E6EEEA] space-y-0.5">
                        {(guide.diffNotes || guide.diff_notes)?.map((note: string, i: number) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={`/guides/${guide.profile.id}`}
                      className="inline-block text-xs font-medium text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline pt-1"
                    >
                      View profile anyway →
                    </Link>
                  </div>
                ))}
              </div>

              {/* No match actions */}
              <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C] flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setNotified(true)}
                  className="px-5 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium flex items-center justify-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{notified ? '✓ Notification set' : 'Notify me when someone joins'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInvited(true)}
                  className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{invited ? '✓ Invite link copied' : 'Invite someone who made this move'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Three Equal Guide Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matches.map((candidate) => {
              const guide = candidate.profile;
              const moveProf = candidate.move_profile;

              return (
                <div
                  key={guide.id}
                  className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-[#102A2E]/50 dark:hover:border-[#F2B134]/50 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar + Name on one single line + Verified Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <InitialsAvatar firstName={guide.first_name} lastInitial={guide.last_initial} size="md" />
                        <div className="min-w-0">
                          {/* Guide's name on one line strictly */}
                          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] whitespace-nowrap truncate">
                            {guide.first_name} {guide.last_initial}
                          </h2>
                          <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] truncate">
                            {guide.city}
                          </p>
                        </div>
                      </div>

                      {/* Verified tag on desktop & mobile */}
                      <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Move Line */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-[#55665F] dark:text-[#A6B8B0] tracking-wider">
                        Career Move
                      </span>
                      <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                        {candidate.move_line}
                      </p>
                    </div>

                    {/* Why we matched you (one sentence under 20 words strictly) */}
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
                        {moveProf.years_since_move}y past move
                      </span>
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

                  {/* Equal Action Button per Section 3 */}
                  <div className="pt-5 mt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
                    <button
                      type="button"
                      onClick={() => navigate(`/guides/${guide.id}`)}
                      className="w-full py-2.5 rounded-full border border-[#102A2E] dark:border-[#F2B134] hover:bg-[#102A2E] hover:text-white dark:hover:bg-[#F2B134] dark:hover:text-[#102A2E] text-xs font-medium transition-colors text-center"
                    >
                      View story & request
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quiet footer note */}
        <p className="text-[11px] text-center text-[#55665F] dark:text-[#A6B8B0]">
          Contact details are hidden until your guide accepts. You can request one guide at a time.
        </p>
      </div>
    </div>
  );
};
