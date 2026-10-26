import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../../components/InitialsAvatar';
import { DatabaseRecords } from '../DatabaseRecords';
import {
  Shield,
  ShieldAlert,
  Check,
  X,
  UserCheck,
  AlertTriangle,
  FileText,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminHub: React.FC = () => {
  const {
    currentUser,
    switchUser,
    guideApplications,
    approveGuideApplication,
    rejectGuideApplication,
    askMoreGuideApplication,
    reportsList,
    resolveReport,
  } = useApp();

  // Admin role only check (Pillar 4)
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73] mx-auto flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl text-[#13231F] dark:text-[#E6EEEA]">
          Admin access required
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0]">
          The `/admin` moderation queue is restricted to users with the Admin role.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => switchUser('admin')}
            className="px-5 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
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

  const activeReports = reportsList.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-8">
      <div className="pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
          <Shield className="w-4 h-4" />
          <span>Internal Moderation Hub (Admin Role Only)</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA] mt-1">
          Admin Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
          Review Career Guide applications with automatic checks, CV, and move story. Only approved Career Guides can be recommended.
        </p>
      </div>

      <DatabaseRecords embedded />

      {/* Career Guide Applications Queue (Pillar 4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
            <span>Career Guide Applications ({guideApplications.length})</span>
          </h2>
          <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
            Automatic checks: LinkedIn connected â€¢ Email verified â€¢ Move found (&ge;2y earlier, &ge;1y current)
          </span>
        </div>

        <div className="space-y-4">
          {guideApplications.map((app) => {
            const nameParts = app.full_name.split(' ');
            const firstName = nameParts[0] || 'Guide';
            const lastInitial = nameParts.length > 1 ? `${nameParts[1][0]}.` : 'G.';

            const statusBadge =
              app.status === 'approved'
                ? 'bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]'
                : app.status === 'needs_more_info'
                ? 'bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134]'
                : app.status === 'rejected'
                ? 'bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73]'
                : 'bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]';

            const statusText =
              app.status === 'approved'
                ? 'Approved'
                : app.status === 'needs_more_info'
                ? 'We need a little more'
                : app.status === 'rejected'
                ? 'Rejected'
                : 'Under review';

            return (
              <div
                key={app.id}
                data-testid={`admin-application-${app.id}`}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar firstName={firstName} lastInitial={lastInitial} size="md" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                          {app.full_name}
                        </h3>
                        <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                          ({app.email} â€¢ {app.city})
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] mt-0.5">
                        {app.from_role} ({app.years_in_earlier_role} yrs) â†’ {app.to_role} ({app.years_in_current_role} yrs) â€¢ Took {app.how_long_it_took}
                      </p>
                    </div>
                  </div>

                  <span
                    data-testid={`admin-app-status-${app.id}`}
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge}`}
                  >
                    {statusText}
                  </span>
                </div>

                {/* Automatic Checks Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-xs">
                  <div className="flex items-center gap-2">
                    {(app.checks?.linkedin_connected ?? (app as any).linkedin_connected) ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#A8432C] dark:text-[#E58C73] shrink-0" />
                    )}
                    <span className="font-medium">
                      LinkedIn connected: {(app.checks?.linkedin_connected ?? (app as any).linkedin_connected) ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(app.checks?.email_verified ?? (app as any).work_email_verified) ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#A8432C] dark:text-[#E58C73] shrink-0" />
                    )}
                    <span className="font-medium">
                      Email verified: {(app.checks?.email_verified ?? (app as any).work_email_verified) ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(app.checks?.move_found ?? (app as any).move_found_check) ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#A8432C] dark:text-[#E58C73] shrink-0" />
                    )}
                    <span className="font-medium">
                      Move found: {(app.checks?.move_found ?? (app as any).move_found_check) ? 'Verified (â‰¥2y / â‰¥1y)' : 'Flagged (<2y or <1y)'}
                    </span>
                  </div>
                </div>

                {/* Mismatch Flags if any */}
                {(app.checks?.mismatch_flags ?? (app as any).mismatch_flags ?? []).length > 0 && (
                  <div className="p-3 rounded-xl bg-[#A8432C]/10 border border-[#A8432C]/30 text-xs text-[#A8432C] dark:text-[#E58C73] space-y-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Automatic Check Flags:</span>
                    </span>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {(app.checks?.mismatch_flags ?? (app as any).mismatch_flags ?? []).map((flag, i) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Story & CV */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                      Your move, in your words
                    </span>
                    <p className="text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
                      "{(app.story ?? (app as any).story_in_words)}"
                    </p>
                    <p className="text-[#55665F] dark:text-[#A6B8B0] pt-1">
                      <strong>What they'd do differently:</strong> {(app.what_would_do_differently ?? (app as any).what_do_differently)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Uploaded CV ({app.cv_file_name})</span>
                    </span>
                    <p className="text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
                      {(app.cv_text ?? (app as any).cv_text_summary)}
                    </p>
                  </div>
                </div>

                {/* Three Action Buttons: Approve, Reject, Ask for more */}
                <div className="pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-end gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => approveGuideApplication(app.id)}
                    className="px-4 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      askMoreGuideApplication(
                        app.id,
                        'Please share a little more detail on your current role responsibilities and CV dates.'
                      )
                    }
                    className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#8A5A00] dark:text-[#F2B134] flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask for more</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectGuideApplication(app.id)}
                    className="px-4 py-2 rounded-full border border-[#A8432C]/40 hover:bg-[#A8432C]/10 text-xs font-medium text-[#A8432C] dark:text-[#E58C73] flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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

