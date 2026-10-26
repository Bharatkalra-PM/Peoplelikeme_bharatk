import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, HeartHandshake, ShieldAlert, X } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportModalUser, setReportModalUser, submitReport } = useApp();
  const [reason, setReason] = useState('Unprofessional behaviour');
  const [details, setDetails] = useState('');
  const [showDistressResources, setShowDistressResources] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reportModalUser.id, reportModalUser.name, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportModalUser(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] border-t sm:border border-[#D3DDD8] dark:border-[#2A403C] rounded-t-2xl sm:rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#102A2E] dark:text-[#E6EEEA]">
            <ShieldAlert className="w-4 h-4 text-[#A8432C] dark:text-[#E58C73]" />
            <span id="report-modal-title">Report a concern</span>
          </div>
          <button
            onClick={() => setReportModalUser(null)}
            className="p-1 rounded-full text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center">
              ✓
            </div>
            <h3 className="font-heading text-lg">Thank you for letting us know</h3>
            <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
              We have paused interactions with {reportModalUser.name} while an administrator reviews your report.
            </p>
          </div>
        ) : showDistressResources ? (
          <div className="py-4 space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#2D6B8F]/10 text-[#2D6B8F] dark:text-[#7FB6D6] text-sm">
              <HeartHandshake className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Need immediate emotional or mental health support?</p>
                <p className="text-xs mt-1 text-[#55665F] dark:text-[#A6B8B0]">
                  Career shifts can bring intense stress. Professional confidential listeners are available 24/7.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="p-3 border border-[#D3DDD8] dark:border-[#2A403C] rounded-xl">
                <p className="font-medium">India Tele-MANAS</p>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">Toll-Free 24x7: 14416 or 1800-891-4416</p>
              </div>
              <div className="p-3 border border-[#D3DDD8] dark:border-[#2A403C] rounded-xl">
                <p className="font-medium">UK Samaritans</p>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">Call 116 123 (Free, 24/7)</p>
              </div>
              <div className="p-3 border border-[#D3DDD8] dark:border-[#2A403C] rounded-xl">
                <p className="font-medium">US & International Crisis Lifeline</p>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">Call or text 988 (English & Spanish)</p>
              </div>
            </div>

            <button
              onClick={() => setShowDistressResources(false)}
              className="w-full py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-sm font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523]"
            >
              Back to report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-sm">
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              Reporting <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">{reportModalUser.name}</span>. This person will be paused from pod sessions until reviewed.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Reason for report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA]"
              >
                <option value="Unprofessional behaviour">Unprofessional behaviour</option>
                <option value="Offensive or harmful language">Offensive or harmful language</option>
                <option value="Spam or commercial selling">Spam or commercial selling</option>
                <option value="Privacy or contact violation">Privacy or contact violation</option>
                <option value="Appears in serious personal distress">Appears in serious personal distress</option>
                <option value="Other concern">Other concern</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">Details (optional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="What happened? Please share context to help our moderation team."
                className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] placeholder:text-[#55665F]/60 resize-none text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowDistressResources(true)}
                className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Mental health resources
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReportModalUser(null)}
                  className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#A8432C] hover:bg-[#8e3825] text-white text-xs font-medium"
                >
                  Submit report
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
