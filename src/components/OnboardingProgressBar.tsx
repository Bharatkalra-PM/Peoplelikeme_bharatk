import React from 'react';
import { BrandMark } from './BrandMark';

interface OnboardingProgressBarProps {
  step: 1 | 2 | 3 | 4;
  label: string;
}

export const OnboardingProgressBar: React.FC<OnboardingProgressBarProps> = ({
  step,
  label,
}) => {
  const pct = (step / 4) * 100;

  return (
    <header className="space-y-3 pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
      <div className="flex items-center justify-between">
        <BrandMark />
        <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
          Step {step} of 4 · {label}
        </span>
      </div>
      {/* Slim progress bar */}
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={4}
        aria-label={`Onboarding step ${step} of 4`}
        className="w-full h-1.5 bg-[#D3DDD8] dark:bg-[#2A403C] rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-[#102A2E] dark:bg-[#F2B134] transition-all duration-300 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  );
};
