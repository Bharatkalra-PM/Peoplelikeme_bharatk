import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApiKeysInfoModal } from '../components/ApiKeysInfoModal';
import {
  Shield,
  Download,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Bell,
  HeartHandshake,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    currentUser,
    updateContactSettings,
    exportDataJson,
    deleteAccount,
  } = useApp();

  const [shareGuide, setShareGuide] = useState(currentUser?.share_contact_with_guide || false);
  const [sharePod, setSharePod] = useState(currentUser?.share_contact_with_pod || false);
  const [saveToast, setSaveToast] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSavePrivacy = () => {
    updateContactSettings(shareGuide, sharePod);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleDownload = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `people-like-me-data-${currentUser?.id || 'archive'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [showApiKeysModal, setShowApiKeysModal] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Privacy & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Privacy by default. You control exactly who sees your contact details.
          </p>
        </div>
        
      </div>

      <ApiKeysInfoModal isOpen={showApiKeysModal} onClose={() => setShowApiKeysModal(false)} />

      {/* Contact Sharing Toggles */}
      <section className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
          <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
            Contact Details Visibility
          </h2>
        </div>
        <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
          By default, peers and Career Guides only see your first name and last initial. You can choose to share your email and full name.
        </p>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C] cursor-pointer hover:bg-[#F1F5F2]/40 dark:hover:bg-[#122523]/40">
            <div>
              <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                Share contact details with my Career Guide
              </p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                Allows your Career Guide to reach you via email for scheduling questions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={shareGuide}
              onChange={(e) => setShareGuide(e.target.checked)}
              className="rounded border-[#D3DDD8] text-[#F2B134] focus:ring-[#F2B134] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-[#D3DDD8]/60 dark:border-[#2A403C] cursor-pointer hover:bg-[#F1F5F2]/40 dark:hover:bg-[#122523]/40">
            <div>
              <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                Share contact details with Pod members
              </p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                Allows your 5 pod peers to see your email address.
              </p>
            </div>
            <input
              type="checkbox"
              checked={sharePod}
              onChange={(e) => setSharePod(e.target.checked)}
              className="rounded border-[#D3DDD8] text-[#F2B134] focus:ring-[#F2B134] w-4 h-4"
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saveToast ? (
            <span className="text-xs text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              Settings saved
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleSavePrivacy}
            className="px-5 py-2 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium transition-colors shadow-xs"
          >
            Save preferences
          </button>
        </div>
      </section>

      {/* Data Export & Deletion */}
      <section className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
          Data Ownership & Portability
        </h2>
        <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
          Export your complete archive or permanently delete your account in accordance with data protection regulations.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download my data (JSON)</span>
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-5 py-2.5 rounded-full border border-[#A8432C]/30 text-[#A8432C] dark:text-[#E58C73] hover:bg-[#A8432C]/10 text-xs font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete account & data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={deleteAccount}
                className="px-4 py-2 rounded-full bg-[#A8432C] text-white text-xs font-medium hover:bg-[#8e3825]"
              >
                Yes, delete everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Privacy Principles (Section 11) */}
      <section className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-3 shadow-xs text-xs">
        <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
          Our Privacy Charter
        </h2>
        <div className="space-y-2 text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
          <p>
            • <strong>No data selling:</strong> We never sell, rent, or trade your personal data, job search stage, or story answers to employers, recruiters, or ad brokers.
          </p>
          <p>
            • <strong>Private buckets:</strong> CVs and uploaded background documents are stored in private encrypted storage, accessed only by you and the extraction service.
          </p>
          <p>
            • <strong>Human conversations:</strong> AI is restricted to drafting profile facts and summarizing shared move reasons. All messages, advice, and check-ins are written by real humans.
          </p>
          <p>
            • <strong>Compliance:</strong> Built following principles of the Digital Personal Data Protection Act (DPDPA) and GDPR.
          </p>
        </div>
      </section>
    </div>
  );
};
