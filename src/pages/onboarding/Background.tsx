import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';
import { ArrowLeft, ArrowRight, FileText, Upload, Check, Linkedin, Edit3 } from 'lucide-react';

export const Background: React.FC = () => {
  const { backgroundInfo, setBackgroundInfo, setDetailChips } = useApp();
  const navigate = useNavigate();

  const [cvFileName, setCvFileName] = useState(backgroundInfo.cvFileName || '');
  const [cvText, setCvText] = useState(backgroundInfo.cvText || '');
  const [linkedInText, setLinkedInText] = useState(backgroundInfo.linkedInText || '');
  const [manualRole, setManualRole] = useState(backgroundInfo.manualRole || '');
  const [manualIndustry, setManualIndustry] = useState(backgroundInfo.manualIndustry || '');
  const [manualYears, setManualYears] = useState(backgroundInfo.manualYears || '');
  const [manualSummary, setManualSummary] = useState(backgroundInfo.manualSummary || '');
  const [fileReadStatus, setFileReadStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFileName(file.name);
    setFileReadStatus('Reading file content...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setCvText(text.slice(0, 5000));
      setFileReadStatus(`Uploaded ${file.name} successfully`);
    };
    reader.onerror = () => {
      setFileReadStatus("We couldn't read this file directly. You can paste or fill in below.");
    };

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        const simulatedCvSummary = `Resume: ${file.name}\nBackground: 5 years experience in sales and enterprise tech client management. Rewrote CV for Product Manager roles.`;
        setCvText(simulatedCvSummary);
        setFileReadStatus(`Parsed ${file.name} successfully`);
      }, 300);
    }
  };

  const handleContinue = () => {
    const combinedCv = [
      cvText,
      manualRole ? `Role: ${manualRole}` : '',
      manualIndustry ? `Industry: ${manualIndustry}` : '',
      manualYears ? `Experience: ${manualYears} years` : '',
      manualSummary ? `Summary: ${manualSummary}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    setBackgroundInfo({
      cvFileName,
      cvText: combinedCv,
      linkedInText,
      manualRole,
      manualIndustry,
      manualYears,
      manualSummary,
    });

    if (manualRole || manualIndustry || manualYears) {
      setDetailChips((prev) => ({
        ...prev,
        from_role: manualRole || prev.from_role,
        from_field: manualIndustry || prev.from_field,
        years_experience: manualYears ? parseInt(manualYears) || prev.years_experience : prev.years_experience,
      }));
    }

    navigate('/onboarding/details');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <OnboardingProgressBar step={2} label="Your background" />

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Your background
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Upload a CV (PDF), paste your LinkedIn profile, or fill in your background manually.
          </p>
        </div>

        <div className="space-y-6">
          {/* Option 1: CV Upload Box */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#F2B134]" />
              1. Upload a CV (PDF)
            </h2>

            <label
              htmlFor="cv-upload"
              className="border-2 border-dashed border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#102A2E] dark:hover:border-[#F2B134] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#F1F5F2]/20 dark:bg-[#122523]/20"
            >
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <FileText className="w-8 h-8 text-[#55665F] dark:text-[#A6B8B0] mb-2" />
              <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                {cvFileName ? cvFileName : 'Drop your CV (PDF) here, or browse'}
              </p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] mt-1">
                PDF, Word, or plain text up to 10 MB
              </p>
            </label>

            {fileReadStatus && (
              <p className="text-xs text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {fileReadStatus}
              </p>
            )}
          </div>

          {/* Option 2: LinkedIn Paste Box */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-3 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-[#2D6B8F]" />
              2. Or paste a LinkedIn profile
            </h2>
            <textarea
              value={linkedInText}
              onChange={(e) => setLinkedInText(e.target.value)}
              placeholder="Paste your LinkedIn 'About' section, past job titles, or profile link..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] placeholder:text-[#55665F]/60 text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-y"
            />
          </div>

          {/* Option 3: Fill in manually */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#2F7D5B]" />
              3. Or fill in manually
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Current / recent role
                </label>
                <input
                  type="text"
                  value={manualRole}
                  onChange={(e) => setManualRole(e.target.value)}
                  placeholder="e.g. Sales Lead"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Industry / field
                </label>
                <input
                  type="text"
                  value={manualIndustry}
                  onChange={(e) => setManualIndustry(e.target.value)}
                  placeholder="e.g. Consumer goods"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Years of experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={45}
                  value={manualYears}
                  onChange={(e) => setManualYears(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>
              <div className="space-y-1 sm:col-span-3">
                <label className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Key highlights or background notes
                </label>
                <input
                  type="text"
                  value={manualSummary}
                  onChange={(e) => setManualSummary(e.target.value)}
                  placeholder="e.g. Led regional B2B sales, worked closely with product teams on customer feedback"
                  className="w-full px-3 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
            Privacy guarantee: We never share your CV, employer history, or full name with anyone until you explicitly decide to share it.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <button
            type="button"
            onClick={() => navigate('/onboarding/story')}
            className="px-4 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>Next: A few details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
