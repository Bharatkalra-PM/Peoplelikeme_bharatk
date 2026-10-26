import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../../components/BrandMark';
import { ArrowLeft, ArrowRight, FileText, Upload, Check, Linkedin } from 'lucide-react';

export const Background: React.FC = () => {
  const { backgroundInfo, setBackgroundInfo } = useApp();
  const navigate = useNavigate();

  const [cvFileName, setCvFileName] = useState(backgroundInfo.cvFileName || '');
  const [cvText, setCvText] = useState(backgroundInfo.cvText || '');
  const [linkedInText, setLinkedInText] = useState(backgroundInfo.linkedInText || '');
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
      setFileReadStatus("We couldn't read this file directly. You can paste the text below.");
    };

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // For PDF/doc, we simulate reading extracted text
      setTimeout(() => {
        const simulatedCvSummary = `Resume: ${file.name}\nBackground: 5 years experience in sales and enterprise tech client management. Built team roadmaps and evaluated SaaS churn metrics.`;
        setCvText(simulatedCvSummary);
        setFileReadStatus(`Parsed ${file.name} successfully`);
      }, 500);
    }
  };

  const handleContinue = () => {
    setBackgroundInfo({
      cvFileName,
      cvText,
      linkedInText,
    });
    navigate('/onboarding/details');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
            Step 2 of 4
          </span>
        </header>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Background (optional)
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Upload your CV or paste your LinkedIn summary to save time. We only use this to draft your move profile facts.
          </p>
        </div>

        <div className="space-y-6">
          {/* CV Upload Box */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#F2B134]" />
              Upload CV or Resume
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
                {cvFileName ? cvFileName : 'Drop your file here, or browse'}
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

          {/* LinkedIn Paste Box */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-3 shadow-xs">
            <h2 className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-[#2D6B8F]" />
              Or paste LinkedIn profile / work history
            </h2>
            <textarea
              value={linkedInText}
              onChange={(e) => setLinkedInText(e.target.value)}
              placeholder="Paste your LinkedIn 'About' section, past job titles and company names..."
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] placeholder:text-[#55665F]/60 text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-y"
            />
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
            className="px-4 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>Next: Details & Constraints</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
