import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  loadPilotThresholds,
  savePilotThresholds,
  PilotThresholds,
  loadPilotCohort,
  loadMonth2Offers,
  toggleMonth2PaidByAdmin,
  Month2OfferRecord,
  loadPilotMoves,
  savePilotMoves,
  PilotMove,
  loadWaitlist,
  WaitlistEntry,
} from '../../lib/pilotConfig';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  IndianRupee,
  Compass,
  Clock,
  Plus,
  Check,
  BarChart3,
} from 'lucide-react';

export const AdminPilot: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { currentUser, switchUser } = useApp();

  const [thresholds, setThresholds] = useState<PilotThresholds>(() =>
    loadPilotThresholds()
  );
  const [editingThresholds, setEditingThresholds] = useState(false);
  const [cohort] = useState(() => loadPilotCohort());
  const [offersMap, setOffersMap] = useState<Record<string, Month2OfferRecord>>(() =>
    loadMonth2Offers()
  );
  const [pilotMoves, setPilotMoves] = useState<PilotMove[]>(() => loadPilotMoves());
  const [newMoveLabel, setNewMoveLabel] = useState('');
  const [newMoveFromKw, setNewMoveFromKw] = useState('');
  const [newMoveToKw, setNewMoveToKw] = useState('');
  const [waitlist] = useState<WaitlistEntry[]>(() => loadWaitlist());
  const [simulateRethinkWarning, setSimulateRethinkWarning] = useState(false);

  if (!embedded && currentUser?.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73] mx-auto flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl text-[#13231F] dark:text-[#E6EEEA]">
          Admin access required
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0]">
          The Pilot Go/No-Go dashboard is restricted to Admin users.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => switchUser('admin')}
            className="px-5 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer"
          >
            Switch to Admin Role
          </button>
          <Link
            to="/home"
            className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Compute Cohort Measures (Section 9)
  const totalChangers = cohort.changers.length || 10;
  const totalGuides = cohort.guides.length || 5;

  const attendedAtLeast3Count = cohort.changers.filter(
    (c) => c.callsAttendedOf4 >= 3
  ).length;
  const metHalfGoalsCount = cohort.changers.filter((c) => c.metHalfWeeklyGoals).length;
  const rated4Or5Count = cohort.changers.filter((c) => c.overallGuideRating >= 4).length;

  const offerRecords: Month2OfferRecord[] = Object.values(offersMap);
  const paidMonth2Count = offerRecords.filter((o) => o.paid).length;

  const guidesFinishedAndAgainCount = cohort.guides.filter(
    (g) => g.finishedAllFourWeeks && g.wouldGuideAgain
  ).length;

  // Rethink warning condition (Section 9):
  // Fewer than half of active career changers attended their week-3 call, OR nobody has said yes to month 2 by the end of week 4
  const week3AttendedCount = cohort.changers.filter((c) => c.attendedWeek3Call).length;
  const anySaidYesMonth2 = offerRecords.some(
    (o) => o.primary_response === 'yes' || o.fallback_199_response === 'yes'
  );
  const showRethinkWarning =
    simulateRethinkWarning ||
    week3AttendedCount < Math.ceil(totalChangers / 2) ||
    !anySaidYesMonth2;

  // Price Test Split (Section 9)
  const offers499 = offerRecords.filter((o) => o.assigned_price_inr === 499);
  const offers699 = offerRecords.filter((o) => o.assigned_price_inr === 699);

  const seen499 = offers499.length;
  const yes499 = offers499.filter((o) => o.primary_response === 'yes').length;
  const paid499 = offers499.filter((o) => o.paid).length;

  const seen699 = offers699.length;
  const yes699 = offers699.filter((o) => o.primary_response === 'yes').length;
  const paid699 = offers699.filter((o) => o.paid).length;

  const yes199 = offerRecords.filter((o) => o.fallback_199_response === 'yes').length;

  const goNoGoRows = [
    {
      id: 'calls',
      measure: 'Career changers who attended at least 3 of 4 calls',
      actual: attendedAtLeast3Count,
      total: thresholds.callsAttendedTotal,
      threshold: thresholds.callsAttendedThreshold,
    },
    {
      id: 'goals',
      measure: 'Career changers who met at least half their weekly goals',
      actual: metHalfGoalsCount,
      total: thresholds.goalsMetTotal,
      threshold: thresholds.goalsMetThreshold,
    },
    {
      id: 'ratings',
      measure: 'Career changers rating their guide 4 or 5',
      actual: rated4Or5Count,
      total: thresholds.highRatingTotal,
      threshold: thresholds.highRatingThreshold,
    },
    {
      id: 'paid',
      measure: 'Career changers who paid for month 2',
      actual: paidMonth2Count,
      total: thresholds.paidMonth2Total,
      threshold: thresholds.paidMonth2Threshold,
    },
    {
      id: 'guides',
      measure: 'Career Guides who finished and would guide again',
      actual: guidesFinishedAndAgainCount,
      total: thresholds.guidesAgainTotal,
      threshold: thresholds.guidesAgainThreshold,
    },
  ];

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    savePilotThresholds(thresholds);
    setEditingThresholds(false);
  };

  const handleTogglePaid = (userId: string) => {
    const updated = toggleMonth2PaidByAdmin(userId);
    setOffersMap({ ...updated });
  };

  const handleAddPilotMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoveLabel.trim()) return;
    const fromKws = newMoveFromKw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const toKws = newMoveToKw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const labelParts = newMoveLabel.split(/to|→/i);
    const nextMove: PilotMove = {
      id: `pilot-${Date.now()}`,
      label: newMoveLabel.trim(),
      fromKeywords: fromKws.length ? fromKws : [labelParts[0]?.trim().toLowerCase() || 'general'],
      toKeywords: toKws.length ? toKws : [labelParts[1]?.trim().toLowerCase() || 'product'],
      active: true,
    };
    const updated = [...pilotMoves, nextMove];
    setPilotMoves(updated);
    savePilotMoves(updated);
    setNewMoveLabel('');
    setNewMoveFromKw('');
    setNewMoveToKw('');
  };

  const handleTogglePilotMove = (id: string) => {
    const updated = pilotMoves.map((m) =>
      m.id === id ? { ...m, active: !m.active } : m
    );
    setPilotMoves(updated);
    savePilotMoves(updated);
  };

  return (
    <div className="space-y-8" data-testid="admin-pilot-dashboard">
      {!embedded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
              <BarChart3 className="w-4 h-4" />
              <span>Admin • 4-Week Pilot Evaluation</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA] mt-1">
              Pilot Go/No-Go Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
              Live cohort measures, Month 2 price test split (₹499 vs ₹699 &amp; ₹199), pilot moves, and waitlist.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulateRethinkWarning(!simulateRethinkWarning)}
              className="px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] text-xs font-medium cursor-pointer"
            >
              {simulateRethinkWarning ? 'Hide Rethink Test' : 'Test Rethink Warning'}
            </button>
            <button
              type="button"
              onClick={() => setEditingThresholds(!editingThresholds)}
              className="px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F2B134]" />
              <span>{editingThresholds ? 'Close Settings' : 'Edit Thresholds'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Rethink Warning Banner (Section 9) */}
      {showRethinkWarning && (
        <div
          data-testid="pilot-rethink-warning"
          className="p-4 rounded-2xl bg-[#A8432C]/15 border-2 border-[#A8432C] text-xs sm:text-sm text-[#13231F] dark:text-[#E6EEEA] flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-[#A8432C] dark:text-[#E58C73] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wider text-xs text-[#A8432C] dark:text-[#E58C73]">
              Rethink Warning Triggered
            </p>
            <p className="mt-0.5">
              Fewer than half of active career changers attended their Week 3 call, or nobody has said yes to Month 2 by the end of Week 4. Review call cadence and Career Guide pairing before expanding the cohort.
            </p>
          </div>
        </div>
      )}

      {/* Editable Thresholds Form */}
      {editingThresholds && (
        <form
          onSubmit={handleSaveThresholds}
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs text-xs"
        >
          <h3 className="font-semibold text-sm text-[#13231F] dark:text-[#E6EEEA]">
            Edit Go/No-Go Thresholds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[#55665F] dark:text-[#A6B8B0] mb-1">
                ≥3/4 Calls (of {thresholds.callsAttendedTotal})
              </label>
              <input
                type="number"
                value={thresholds.callsAttendedThreshold}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    callsAttendedThreshold: parseInt(e.target.value) || 7,
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
              />
            </div>
            <div>
              <label className="block text-[#55665F] dark:text-[#A6B8B0] mb-1">
                ≥Half Goals (of {thresholds.goalsMetTotal})
              </label>
              <input
                type="number"
                value={thresholds.goalsMetThreshold}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    goalsMetThreshold: parseInt(e.target.value) || 6,
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
              />
            </div>
            <div>
              <label className="block text-[#55665F] dark:text-[#A6B8B0] mb-1">
                Rating 4–5 (of {thresholds.highRatingTotal})
              </label>
              <input
                type="number"
                value={thresholds.highRatingThreshold}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    highRatingThreshold: parseInt(e.target.value) || 7,
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
              />
            </div>
            <div>
              <label className="block text-[#55665F] dark:text-[#A6B8B0] mb-1">
                Paid Month 2 (of {thresholds.paidMonth2Total})
              </label>
              <input
                type="number"
                value={thresholds.paidMonth2Threshold}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    paidMonth2Threshold: parseInt(e.target.value) || 3,
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
              />
            </div>
            <div>
              <label className="block text-[#55665F] dark:text-[#A6B8B0] mb-1">
                Guides Again (of {thresholds.guidesAgainTotal})
              </label>
              <input
                type="number"
                value={thresholds.guidesAgainThreshold}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    guidesAgainThreshold: parseInt(e.target.value) || 4,
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold cursor-pointer"
            >
              Save thresholds
            </button>
          </div>
        </form>
      )}

      {/* 1. Pilot Go/No-Go Cohort Measures Table (Section 9) */}
      <section className="space-y-3" data-testid="pilot-go-nogo-table">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
            <span>Pilot Cohort Go/No-Go Measures ({totalChangers} Career Changers • {totalGuides} Career Guides)</span>
          </h2>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F2] dark:bg-[#122523] border-b border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Measure</th>
                <th className="py-3 px-4">Go If</th>
                <th className="py-3 px-4">Current Cohort</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C]">
              {goNoGoRows.map((row) => {
                const met = row.actual >= row.threshold;
                return (
                  <tr
                    key={row.id}
                    data-testid={`pilot-measure-${row.id}`}
                    className={met ? 'bg-[#2F7D5B]/5' : ''}
                  >
                    <td className="py-3.5 px-4 font-medium text-[#13231F] dark:text-[#E6EEEA]">
                      {row.measure}
                    </td>
                    <td className="py-3.5 px-4 text-[#55665F] dark:text-[#A6B8B0]">
                      {row.threshold} of {row.total}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      {row.actual} of {row.total}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          met
                            ? 'bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]'
                            : 'bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134]'
                        }`}
                      >
                        {met ? '✓ Go (Met)' : 'Below threshold'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Month 2 Price Test Split (Section 8 & 9) */}
      <section className="space-y-3" data-testid="pilot-price-test-split">
        <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-[#F2B134]" />
          <span>Month 2 Price Test Split (₹499 vs ₹699 &amp; ₹199 Fallback)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
              ₹499 Cohort (50% Split)
            </span>
            <p className="text-base font-bold text-[#13231F] dark:text-[#E6EEEA]">
              Seen: {seen499} • Yes: {yes499} • Paid: {paid499}
            </p>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D6B8F] dark:text-[#7FB6D6]">
              ₹699 Cohort (50% Split)
            </span>
            <p className="text-base font-bold text-[#13231F] dark:text-[#E6EEEA]">
              Seen: {seen699} • Yes: {yes699} • Paid: {paid699}
            </p>
          </div>

          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2F7D5B] dark:text-[#5FBF8F]">
              ₹199 Downsell (After &ldquo;Not now&rdquo;)
            </span>
            <p className="text-base font-bold text-[#13231F] dark:text-[#E6EEEA]">
              Yes at ₹199: {yes199}
            </p>
          </div>
        </div>

        {/* Individual Offer & Payment Marking Table */}
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F2] dark:bg-[#122523] border-b border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Career Changer</th>
                <th className="py-2.5 px-4">Assigned Price</th>
                <th className="py-2.5 px-4">Response</th>
                <th className="py-2.5 px-4">₹199 Follow-up &amp; Notes</th>
                <th className="py-2.5 px-4 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C]">
              {offerRecords.map((rec) => (
                <tr key={rec.user_id}>
                  <td className="py-3 px-4 font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    {rec.full_name}
                  </td>
                  <td className="py-3 px-4 font-semibold">₹{rec.assigned_price_inr}</td>
                  <td className="py-3 px-4">
                    {rec.primary_response === 'yes' ? (
                      <span className="text-[#2F7D5B] dark:text-[#5FBF8F] font-semibold">
                        Yes, continue
                      </span>
                    ) : rec.primary_response === 'not_now' ? (
                      <span className="text-[#8A5A00] dark:text-[#F2B134]">Not now</span>
                    ) : (
                      <span className="text-[#55665F]">Offer seen</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#55665F] dark:text-[#A6B8B0]">
                    {rec.fallback_199_response
                      ? `₹199: ${rec.fallback_199_response.toUpperCase()}`
                      : '—'}
                    {rec.worth_it_feedback ? ` • "${rec.worth_it_feedback}"` : ''}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleTogglePaid(rec.user_id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer ${
                        rec.paid
                          ? 'bg-[#2F7D5B] text-white'
                          : 'border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                      }`}
                    >
                      {rec.paid ? 'Paid ✓' : 'Mark as Paid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Admin-Managed Pilot Moves (Section 5) */}
      <section className="space-y-3" data-testid="admin-pilot-moves-section">
        <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
          <span>Admin-Managed Pilot Moves ({pilotMoves.filter((m) => m.active).length} active)</span>
        </h2>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap gap-2">
            {pilotMoves.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => handleTogglePilotMove(pm.id)}
                className={`px-3.5 py-2 rounded-xl border font-medium flex items-center gap-2 cursor-pointer ${
                  pm.active
                    ? 'bg-[#2F7D5B]/10 border-[#2F7D5B]/40 text-[#13231F] dark:text-[#E6EEEA]'
                    : 'border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] opacity-60'
                }`}
              >
                {pm.active && <Check className="w-3.5 h-3.5 text-[#2F7D5B]" />}
                <span>{pm.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleAddPilotMove} className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
            <input
              type="text"
              value={newMoveLabel}
              onChange={(e) => setNewMoveLabel(e.target.value)}
              placeholder="New pilot move (e.g. Marketing to Product)"
              className="px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
            />
            <input
              type="text"
              value={newMoveFromKw}
              onChange={(e) => setNewMoveFromKw(e.target.value)}
              placeholder="From keywords (e.g. marketing, brand)"
              className="px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
            />
            <input
              type="text"
              value={newMoveToKw}
              onChange={(e) => setNewMoveToKw(e.target.value)}
              placeholder="To keywords (e.g. product, pm)"
              className="px-3 py-2 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pilot Move</span>
            </button>
          </form>
        </div>
      </section>

      {/* 4. Non-Pilot Move Waitlist Table (Section 5 & 9) */}
      <section className="space-y-3" data-testid="admin-waitlist-section">
        <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#8A5A00] dark:text-[#F2B134]" />
          <span>Waitlist for Non-Pilot Moves ({waitlist.length})</span>
        </h2>

        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F2] dark:bg-[#122523] border-b border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Career Changer</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Requested Move</th>
                <th className="py-2.5 px-4">City</th>
                <th className="py-2.5 px-4 text-right">Joined Waitlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3DDD8]/60 dark:divide-[#2A403C]">
              {waitlist.map((wl) => (
                <tr key={wl.id} data-testid={`waitlist-row-${wl.id}`}>
                  <td className="py-3 px-4 font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    {wl.full_name}
                  </td>
                  <td className="py-3 px-4 text-[#55665F] dark:text-[#A6B8B0]">{wl.email}</td>
                  <td className="py-3 px-4 font-semibold text-[#2F7D5B] dark:text-[#5FBF8F]">
                    {wl.from_role} → {wl.to_role}
                  </td>
                  <td className="py-3 px-4">{wl.city}</td>
                  <td className="py-3 px-4 text-right text-[#55665F] dark:text-[#A6B8B0]">
                    {new Date(wl.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
