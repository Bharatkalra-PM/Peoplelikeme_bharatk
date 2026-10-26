import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { Loader2 } from 'lucide-react';

export const Matching: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/guides');
    }, 1600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] flex flex-col justify-between p-6">
      <header className="max-w-2xl mx-auto w-full pt-4">
        <BrandMark />
      </header>

      <main className="max-w-md mx-auto w-full text-center space-y-6 py-12">
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#F2B134] animate-spin" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Finding your people
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Checking Career Guides who made your move and pods forming at your stage...
          </p>
        </div>

        {/* Calm subtle dots */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <span className="w-2 h-2 rounded-full bg-[#102A2E] dark:bg-[#E6EEEA] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-[#102A2E] dark:bg-[#E6EEEA] animate-pulse delay-150" />
          <span className="w-2 h-2 rounded-full bg-[#102A2E] dark:bg-[#E6EEEA] animate-pulse delay-300" />
        </div>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Matching uses strictly shared facts. No match scores or percentages are displayed.
      </footer>
    </div>
  );
};
