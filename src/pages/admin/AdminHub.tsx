import React from 'react';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { Shield, ShieldAlert, Check, X, UserCheck, AlertTriangle } from 'lucide-react';

export const AdminHub: React.FC = () => {
  const {
    guidesList,
    approveGuide,
    reportsList,
    resolveReport,
  } = useApp();

  // Find guides needing verification or active
  const pendingGuides = guidesList.filter((g) => !g.profile.verified || g.profile.status === 'pending_approval');
  const activeReports = reportsList.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-8">
      <div className="pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
          <Shield className="w-4 h-4" />
          <span>Internal Moderation Hub</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA] mt-1">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
          Approve incoming guide applications and review reported community safety concerns.
        </p>
      </div>

      {/* Guide Approvals Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
            <span>Guide Approvals ({pendingGuides.length})</span>
          </h2>
          <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
            Manual review required before guides receive requests
          </span>
        </div>

        {pendingGuides.length === 0 ? (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 text-center text-xs text-[#55665F] dark:text-[#A6B8B0]">
            All current guides are approved and verified.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingGuides.map((g) => (
              <div
                key={g.profile.id}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <InitialsAvatar firstName={g.profile.first_name} lastInitial={g.profile.last_initial} size="md" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      {g.profile.full_name} ({g.profile.email})
                    </p>
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      {g.move_profile.from_role} → {g.move_profile.to_role} • {g.profile.city}
                    </p>
                    <p className="text-xs text-[#13231F] dark:text-[#E6EEEA] italic">
                      "{g.move_profile.story}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => approveGuide(g.profile.id)}
                    className="px-4 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Guide</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reports Review Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#A8432C] dark:text-[#E58C73]" />
            <span>Community Reports ({activeReports.length})</span>
          </h2>
          <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
            Reported users are automatically paused from pods pending review
          </span>
        </div>

        {activeReports.length === 0 ? (
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 text-center text-xs text-[#55665F] dark:text-[#A6B8B0]">
            No pending community reports.
          </div>
        ) : (
          <div className="space-y-3">
            {activeReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#A8432C]/10 text-[#A8432C] dark:text-[#E58C73]">
                    {rep.reason}
                  </span>
                  <span className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                    {new Date(rep.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-[#13231F] dark:text-[#E6EEEA]">
                  <strong>Reported Member:</strong> {rep.reported_name}
                </p>
                {rep.details && (
                  <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] bg-[#F1F5F2] dark:bg-[#122523] p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C]">
                    "{rep.details}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
                  <button
                    type="button"
                    onClick={() => resolveReport(rep.id, 'dismiss')}
                    className="px-4 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523]"
                  >
                    Dismiss report
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveReport(rep.id, 'pause_user')}
                    className="px-4 py-1.5 rounded-full bg-[#A8432C] hover:bg-[#8e3825] text-white text-xs font-medium"
                  >
                    Confirm & keep paused
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
