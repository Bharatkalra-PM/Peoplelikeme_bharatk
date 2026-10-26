import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../../components/BrandMark';
import {
  ShieldCheck,
  Check,
  Upload,
  Linkedin,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export const BecomeAGuide: React.FC = () => {
  const { submitGuideApplication, guideApplications, currentUser } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(currentUser?.role === 'guide' ? currentUser.full_name : '');
  const [email, setEmail] = useState(currentUser?.role === 'guide' ? currentUser.email : '');
  const [emailVerified, setEmailVerified] = useState(true);
  const [city, setCity] = useState('Bengaluru');
  const [industry, setIndustry] = useState('Consumer goods');
  const [fromRole, setFromRole] = useState('');
  const [toRole, setToRole] = useState('');
  const [yearsEarlierRole, setYearsEarlierRole] = useState(3);
  const [yearsCurrentRole, setYearsCurrentRole] = useState(2);
  const [howLongItTook, setHowLongItTook] = useState('8 months');
  const [whatDoDifferently, setWhatDoDifferently] = useState('');
  const [storyInWords, setStoryInWords] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  const [cvSummary, setCvSummary] = useState('');
  const [commitmentConfirmed, setCommitmentConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Find existing application for current user or recently submitted
  const existingApp = guideApplications.find(
    (a) =>
      (submittedAppId && a.id === submittedAppId) ||
      (currentUser && (a.user_id === currentUser.id || a.email.toLowerCase() === currentUser.email.toLowerCase()))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFileName(file.name);
      if (!cvSummary) {
        setCvSummary(
          `Uploaded CV (${file.name}): ${yearsEarlierRole} years in ${fromRole || 'earlier role'}, ${yearsCurrentRole} years in ${toRole || 'current role'}.`
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !commitmentConfirmed) return;
    setSubmitting(true);

    const newApp = submitGuideApplication({
      full_name: fullName || 'New Career Guide',
      email: email || 'guide@company.com',
      city: city || 'Bengaluru',
      linkedin_url: linkedInUrl || 'https://linkedin.com/in/careerguide',
      linkedin_connected: linkedinConnected || Boolean(linkedInUrl.trim()),
      work_email_verified: emailVerified,
      cv_file_name: cvFileName || 'career_guide_cv.pdf',
      cv_text_summary:
        cvSummary ||
        `${yearsEarlierRole} years as ${fromRole}, ${yearsCurrentRole} years as ${toRole}.`,
      from_role: fromRole,
      to_role: toRole,
      industry,
      years_in_earlier_role: yearsEarlierRole,
      years_in_current_role: yearsCurrentRole,
      how_long_it_took: howLongItTook,
      what_do_differently:
        whatDoDifferently || 'Start talking to hiring managers and rewriting case studies earlier.',
      story_in_words:
        storyInWords ||
        `Moved from ${fromRole} to ${toRole} in ${howLongItTook}.`,
      commitment_confirmed: commitmentConfirmed,
    });

    setSubmittedAppId(newApp.id);
    setSubmitting(false);
  };

  const getStatusDisplay = (status: string) => {
    if (status === 'approved') {
      return {
        label: 'Approved',
        badgeClass: 'bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]',
        description:
          'Your Career Guide application is approved! You can now receive requests and guide switchers through their 8-week plan.',
      };
    }
    if (status === 'needs_more_info') {
      return {
        label: 'We need a little more',
        badgeClass: 'bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134]',
        description:
          'Our review team needs a little more detail on your CV or move timeline before approving your Career Guide profile.',
      };
    }
    if (status === 'rejected') {
      return {
        label: 'Not approved yet',
        badgeClass: 'bg-[#A8432C]/15 text-[#A8432C] dark:text-[#E58C73]',
        description:
          'Career Guides need at least 2 years in their earlier role and 1 year in their current role.',
      };
    }
    return {
      label: 'Under review',
      badgeClass: 'bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]',
      description:
        'Thank you for applying to be a Career Guide. Your application is currently under review by an admin.',
    };
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-2xl mx-auto w-full pt-4 flex items-center justify-between">
        <BrandMark />
        <Link
          to="/home"
          className="text-xs text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto w-full py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            <ShieldCheck className="w-4 h-4" />
            <span>Career Guide Community</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Become a Career Guide
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Help someone making the career move you navigated. 30 minutes a week for eight weeks, at most two people at a time.
          </p>
        </div>

        {existingApp ? (
          <div
            data-testid="applicant-status-card"
            className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs"
          >
            {(() => {
              const info = getStatusDisplay(existingApp.status);
              return (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs uppercase font-semibold tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                      Application Status
                    </span>
                    <span
                      data-testid="applicant-status-badge"
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${info.badgeClass}`}
                    >
                      {info.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-heading text-xl text-[#13231F] dark:text-[#E6EEEA]">
                      {existingApp.full_name} ({existingApp.from_role} → {existingApp.to_role})
                    </h2>
                    <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
                      {info.description}
                    </p>
                    {existingApp.admin_note && (
                      <div className="p-3.5 rounded-xl bg-[#F2B134]/15 border border-[#F2B134]/40 text-xs text-[#13231F] dark:text-[#E6EEEA]">
                        <strong>Note from Admin:</strong> {existingApp.admin_note}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
                      <span>LinkedIn: {existingApp.linkedin_connected ? 'Connected' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F]" />
                      <span>Email: {existingApp.work_email_verified ? 'Verified' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#8A5A00] dark:text-[#F2B134]" />
                      <span>Move: {existingApp.years_in_earlier_role}y → {existingApp.years_in_current_role}y</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/guide-home')}
                      className="px-6 py-2.5 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold"
                    >
                      Go to Career Guide Dashboard
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Basic Identity & Verification */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                1. Identity, LinkedIn & Work Email Verification
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label htmlFor="guide-full-name" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    Full name
                  </label>
                  <input
                    id="guide-full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Meera S."
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="guide-city" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    City
                  </label>
                  <input
                    id="guide-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Mumbai, London"
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="guide-work-email" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    Work email
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="guide-work-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="flex-1 px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setEmailVerified(true)}
                      className={`px-3.5 py-2 rounded-[10px] border text-xs font-medium flex items-center gap-1.5 ${
                        emailVerified
                          ? 'bg-[#2F7D5B]/15 border-[#2F7D5B] text-[#2F7D5B] dark:text-[#5FBF8F]'
                          : 'border-[#D3DDD8] dark:border-[#2A403C]'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{emailVerified ? 'Work email verified' : 'Verify work email'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="guide-linkedin" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    Connect LinkedIn
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="guide-linkedin"
                      type="url"
                      value={linkedInUrl}
                      onChange={(e) => {
                        setLinkedInUrl(e.target.value);
                        if (e.target.value.trim()) setLinkedinConnected(true);
                      }}
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLinkedinConnected(true);
                        if (!linkedInUrl) setLinkedInUrl('https://linkedin.com/in/connected-guide');
                      }}
                      className={`px-3.5 py-2 rounded-[10px] border text-xs font-medium flex items-center gap-1.5 ${
                        linkedinConnected
                          ? 'bg-[#2F7D5B]/15 border-[#2F7D5B] text-[#2F7D5B] dark:text-[#5FBF8F]'
                          : 'border-[#D3DDD8] dark:border-[#2A403C]'
                      }`}
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>{linkedinConnected ? 'LinkedIn connected' : 'Connect LinkedIn'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload CV */}
            <div className="space-y-3 pt-4 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                2. Upload Your CV
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#102A2E] text-xs font-medium">
                  <Upload className="w-4 h-4 text-[#2D6B8F]" />
                  <span>{cvFileName ? `Uploaded: ${cvFileName}` : 'Upload CV (PDF)'}</span>
                  <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className="hidden" />
                </label>
                <span className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                  We verify at least 2 years in your earlier role and 1 year in your current role.
                </span>
              </div>
            </div>

            {/* Your move, in your words */}
            <div className="space-y-4 pt-4 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                3. Your move, in your words
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label htmlFor="guide-from-role" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    What you moved from
                  </label>
                  <input
                    id="guide-from-role"
                    type="text"
                    required
                    value={fromRole}
                    onChange={(e) => setFromRole(e.target.value)}
                    placeholder="e.g. Sales Manager"
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="guide-to-role" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    What you moved to
                  </label>
                  <input
                    id="guide-to-role"
                    type="text"
                    required
                    value={toRole}
                    onChange={(e) => setToRole(e.target.value)}
                    placeholder="e.g. Product Manager"
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="guide-years-earlier" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    Years in earlier role (min 2 yrs)
                  </label>
                  <input
                    id="guide-years-earlier"
                    type="number"
                    min={0}
                    max={30}
                    value={yearsEarlierRole}
                    onChange={(e) => setYearsEarlierRole(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="guide-years-current" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    Years in current role (min 1 yr)
                  </label>
                  <input
                    id="guide-years-current"
                    type="number"
                    min={0}
                    max={30}
                    value={yearsCurrentRole}
                    onChange={(e) => setYearsCurrentRole(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="guide-how-long" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    How long the move took
                  </label>
                  <input
                    id="guide-how-long"
                    type="text"
                    required
                    value={howLongItTook}
                    onChange={(e) => setHowLongItTook(e.target.value)}
                    placeholder="e.g. 8 months"
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="guide-industry" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    Industry / Field
                  </label>
                  <input
                    id="guide-industry"
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Consumer goods, FinTech"
                    className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-sm"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="guide-story" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    Your move, in your words
                  </label>
                  <textarea
                    id="guide-story"
                    rows={3}
                    required
                    value={storyInWords}
                    onChange={(e) => setStoryInWords(e.target.value)}
                    placeholder="How did you make the switch from your earlier role into your current role?"
                    className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-xs resize-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="guide-differently" className="font-medium text-[#13231F] dark:text-[#E6EEEA]">
                    What you'd do differently
                  </label>
                  <textarea
                    id="guide-differently"
                    rows={2}
                    required
                    value={whatDoDifferently}
                    onChange={(e) => setWhatDoDifferently(e.target.value)}
                    placeholder="What do you wish you had skipped or started earlier?"
                    className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-white dark:bg-[#0E1E1D] text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Commitment Confirmation */}
            <div className="pt-4 border-t border-[#D3DDD8]/60 dark:border-[#2A403C]">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  required
                  checked={commitmentConfirmed}
                  onChange={(e) => setCommitmentConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-[#D3DDD8] text-[#F2B134] focus:ring-[#F2B134]"
                />
                <span className="text-[#13231F] dark:text-[#E6EEEA]">
                  <strong>I confirm the Career Guide commitment:</strong> 30 minutes a week for eight weeks, guiding at most two people at a time.
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[#D3DDD8] dark:border-[#2A403C]">
              <Link to="/" className="text-xs text-[#55665F] hover:underline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || !commitmentConfirmed}
                className="px-6 py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Career Guide application'}
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Career Guides never solicit business or sell courses. Every session is peer mentorship.
      </footer>
    </div>
  );
};
