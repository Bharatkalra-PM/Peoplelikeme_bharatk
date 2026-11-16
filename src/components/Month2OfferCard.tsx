import React, { useState, useEffect } from 'react';
import {
  getOrAssignMonth2Offer,
  recordMonth2PrimaryChoice,
  recordMonth2Fallback199,
  Month2OfferRecord,
  loadPilotCohort,
  savePilotCohort,
} from '../lib/pilotConfig';
import { Sparkles, CheckCircle2, Star } from 'lucide-react';

interface Month2OfferCardProps {
  userId: string;
  userName: string;
  userEmail: string;
  guideName: string;
}

export const Month2OfferCard: React.FC<Month2OfferCardProps> = ({
  userId,
  userName,
  userEmail,
  guideName,
}) => {
  const [offer, setOffer] = useState<Month2OfferRecord>(() =>
    getOrAssignMonth2Offer(userId, userName, userEmail)
  );
  const [worthItText, setWorthItText] = useState(offer.worth_it_feedback || '');
  const [fallbackSubmitted, setFallbackSubmitted] = useState(
    Boolean(offer.fallback_199_response)
  );
  const [overallRating, setOverallRating] = useState<number | null>(() => {
    const saved = localStorage.getItem(`plm_overall_guide_rating_${userId}`);
    return saved ? parseInt(saved, 10) : null;
  });

  useEffect(() => {
    setOffer(getOrAssignMonth2Offer(userId, userName, userEmail));
  }, [userId, userName, userEmail]);

  const handlePrimaryChoice = (choice: 'yes' | 'not_now') => {
    const updated = recordMonth2PrimaryChoice(userId, userName, userEmail, choice);
    setOffer(updated);
  };

  const handleFallback199 = (choice: 'yes' | 'no') => {
    const updated = recordMonth2Fallback199(userId, choice, worthItText);
    if (updated) {
      setOffer(updated);
      setFallbackSubmitted(true);
    }
  };

  const handleSaveWorthIt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer.fallback_199_response) return;
    const updated = recordMonth2Fallback199(
      userId,
      offer.fallback_199_response,
      worthItText
    );
    if (updated) {
      setOffer(updated);
      setFallbackSubmitted(true);
    }
  };

  const handleRateOverall = (score: number) => {
    setOverallRating(score);
    try {
      localStorage.setItem(`plm_overall_guide_rating_${userId}`, String(score));
      const cohort = loadPilotCohort();
      const idx = cohort.changers.findIndex((c) => c.id === userId);
      if (idx >= 0) {
        cohort.changers[idx].overallGuideRating = score;
        savePilotCohort(cohort);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      {/* Section 7: End-of-Week-4 Overall Career Guide Rating */}
      <div
        data-testid="week4-overall-rating-card"
        className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
              End of 4-Week Pilot
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              Overall, how would you rate your Career Guide ({guideName})?
            </h3>
          </div>
          {overallRating && (
            <span className="text-xs font-semibold text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rated {overallRating} of 5</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              data-testid={`overall-rating-btn-${num}`}
              onClick={() => handleRateOverall(num)}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                overallRating === num
                  ? 'bg-[#102A2E] text-white border-[#102A2E] dark:bg-[#F2B134] dark:text-[#102A2E] dark:border-[#F2B134]'
                  : 'border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/50 dark:bg-[#122523]/50 text-[#13231F] dark:text-[#E6EEEA] hover:border-[#F2B134]'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  overallRating && num <= overallRating
                    ? 'fill-[#F2B134] text-[#F2B134]'
                    : 'text-[#55665F]'
                }`}
              />
              <span>{num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 8: Month 2 Offer (Price Test) */}
      <div
        data-testid="month2-offer-card"
        className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border-2 border-[#F2B134] rounded-2xl p-6 space-y-4 shadow-xs"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134] text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Week 4 • Month 2 Continuation</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl text-[#13231F] dark:text-[#E6EEEA]">
              Keep going with your Career Guide for month 2
            </h2>
            <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0]">
              Your 4-week pilot was free. Continue your weekly 30-minute 1:1 calls and accountability plan with {guideName} for Month 2 at{' '}
              <strong
                data-testid="month2-assigned-price"
                className="text-[#13231F] dark:text-[#E6EEEA] font-semibold"
              >
                ₹{offer.assigned_price_inr}
              </strong>
              .
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C] text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] block">
              Month 2 (4 weeks)
            </span>
            <span className="font-heading text-xl font-bold text-[#13231F] dark:text-[#E6EEEA]">
              ₹{offer.assigned_price_inr}
            </span>
          </div>
        </div>

        {/* State 1: Primary choice not yet made */}
        {!offer.primary_response && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              data-testid="month2-yes-continue-btn"
              onClick={() => handlePrimaryChoice('yes')}
              className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Yes, continue
            </button>
            <button
              type="button"
              data-testid="month2-not-now-btn"
              onClick={() => handlePrimaryChoice('not_now')}
              className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs sm:text-sm font-medium text-[#13231F] dark:text-[#E6EEEA] cursor-pointer"
            >
              Not now
            </button>
          </div>
        )}

        {/* State 2: User chose "Yes, continue" (or "Yes" at ₹199) */}
        {(offer.primary_response === 'yes' ||
          offer.fallback_199_response === 'yes') && (
          <div
            data-testid="month2-payment-details-confirmation"
            className="p-4 rounded-xl bg-[#2F7D5B]/15 border border-[#2F7D5B]/40 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#2F7D5B] dark:text-[#5FBF8F] font-medium"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>We&apos;ll send you payment details.</span>
            </div>
            {offer.paid && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#2F7D5B] text-white text-[11px] font-semibold">
                Paid ✓
              </span>
            )}
          </div>
        )}

        {/* State 3: User chose "Not now" -> Ask once: "Would you continue at ₹199?" + "What would make it worth it?" */}
        {offer.primary_response === 'not_now' && (
          <div
            data-testid="month2-fallback-199-section"
            className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C] space-y-3"
          >
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                Would you continue at ₹199?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="month2-199-yes-btn"
                  onClick={() => handleFallback199('yes')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    offer.fallback_199_response === 'yes'
                      ? 'bg-[#2F7D5B] text-white'
                      : 'bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E]'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  data-testid="month2-199-no-btn"
                  onClick={() => handleFallback199('no')}
                  className={`px-4 py-1.5 rounded-full border text-xs font-medium cursor-pointer ${
                    offer.fallback_199_response === 'no'
                      ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                      : 'border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveWorthIt} className="space-y-2 pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
              <label
                htmlFor="worth-it-input"
                className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] block"
              >
                What would make it worth it? (optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="worth-it-input"
                  type="text"
                  value={worthItText}
                  onChange={(e) => setWorthItText(e.target.value)}
                  placeholder="e.g. More mock interviews, resume referrals, bi-weekly check-ins..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-xs"
                />
                <button
                  type="submit"
                  onClick={() => {
                    if (!offer.fallback_199_response) {
                      handleFallback199('no');
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer shrink-0"
                >
                  {fallbackSubmitted ? 'Saved ✓' : 'Save feedback'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
