import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';
import { GenderOption } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  Target,
  Users,
  Shield,
  Briefcase,
  UserCheck,
} from 'lucide-react';

const POPULAR_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'London',
  'New York',
  'San Francisco',
  'Singapore',
  'Remote',
];

const DEPENDANTS_OPTIONS = ['None', 'Children', 'Elderly parents', 'Partner'];

const PRIORITY_OPTIONS = [
  'Speed to role',
  'Target salary',
  'Domain fit',
  'Work-life balance',
];

const AVAILABILITY_OPTIONS = [
  'Weekday evenings (6:00 PM – 8:00 PM)',
  'Weekday late evenings (8:00 PM – 10:00 PM)',
  'Weekend mornings (9:00 AM – 12:00 PM)',
  'Weekend afternoons (2:00 PM – 5:00 PM)',
  'Weekday lunchtimes (12:30 PM – 2:00 PM)',
];

const COMMON_CONSTRAINTS = [
  'Self-taught tech knowledge',
  'Notice period: 60 days',
  'Caregiving duties',
  'Target salary parity',
  'Career break / returning',
  'Remote-only transition',
];

const GENDER_OPTIONS: GenderOption[] = [
  'No preference',
  'Female',
  'Male',
  'Non-binary',
];

export const Details: React.FC = () => {
  const { detailChips, setDetailChips, storyAnswers, backgroundInfo } = useApp();
  const navigate = useNavigate();

  const [fromField, setFromField] = useState(
    detailChips.from_field || backgroundInfo.manualIndustry || 'Sales & Consumer Goods'
  );
  const [fromRole, setFromRole] = useState(
    detailChips.from_role ||
      backgroundInfo.manualRole ||
      storyAnswers?.coming_from?.answer ||
      'B2B Sales Lead'
  );
  const [yearsExperience, setYearsExperience] = useState<number>(
    detailChips.years_experience ??
      (backgroundInfo.manualYears ? parseInt(backgroundInfo.manualYears) || 5 : 5)
  );
  const [toRole, setToRole] = useState(
    detailChips.to_role || storyAnswers?.going_to?.answer || 'Product Manager'
  );
  const [city, setCity] = useState(detailChips.city || 'Bengaluru');
  const [priority, setPriority] = useState(detailChips.priority || PRIORITY_OPTIONS[0]);
  const [dependants, setDependants] = useState(detailChips.dependants || 'None');
  const [availability, setAvailability] = useState<string[]>(
    detailChips.availability?.length
      ? detailChips.availability
      : [AVAILABILITY_OPTIONS[0], AVAILABILITY_OPTIONS[2]]
  );
  const [constraints, setConstraints] = useState<string[]>(detailChips.constraints || []);
  const [customConstraint, setCustomConstraint] = useState('');
  const [preferredGender, setPreferredGender] = useState<GenderOption>(
    detailChips.preferred_guide_gender || 'No preference'
  );

  const toggleAvailability = (opt: string) => {
    setAvailability((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const toggleConstraint = (opt: string) => {
    setConstraints((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const addCustomConstraint = () => {
    if (customConstraint.trim() && !constraints.includes(customConstraint.trim())) {
      setConstraints((prev) => [...prev, customConstraint.trim()]);
      setCustomConstraint('');
    }
  };

  const handleContinue = () => {
    setDetailChips({
      from_field: fromField,
      from_role: fromRole,
      years_experience: yearsExperience,
      to_role: toRole,
      dependants,
      priority,
      availability,
      city,
      constraints,
      preferred_guide_gender: preferredGender,
    });
    navigate('/onboarding/confirm');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <OnboardingProgressBar step={3} label="A few details" />

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            A few details
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Share your role, experience, city, schedule, and what matters most so we can match you with the right Career Guide and pod.
          </p>
        </div>

        <div className="space-y-6">
          {/* Role, Industry & Experience */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#F2B134]" />
              <span>Your role & experience</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label htmlFor="details-industry" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Industry
                </label>
                <input
                  id="details-industry"
                  type="text"
                  value={fromField}
                  onChange={(e) => setFromField(e.target.value)}
                  placeholder="e.g. Sales, Consumer goods, Engineering"
                  className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="details-current-role" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Current role
                </label>
                <input
                  id="details-current-role"
                  type="text"
                  value={fromRole}
                  onChange={(e) => setFromRole(e.target.value)}
                  placeholder="e.g. B2B Sales Lead"
                  className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="details-years" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Years of experience
                </label>
                <input
                  id="details-years"
                  type="number"
                  min={0}
                  max={45}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="details-target-role" className="font-medium text-[#55665F] dark:text-[#A6B8B0]">
                  Target role
                </label>
                <input
                  id="details-target-role"
                  type="text"
                  value={toRole}
                  onChange={(e) => setToRole(e.target.value)}
                  placeholder="e.g. Product Manager, Product Designer"
                  className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-sm text-[#13231F] dark:text-[#E6EEEA]"
                />
              </div>
            </div>
          </div>

          {/* City Selection */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F2B134]" />
                <span>City</span>
              </h2>
              <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                Selected: <strong className="text-[#13231F] dark:text-[#E6EEEA]">{city || 'None'}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {POPULAR_CITIES.map((c) => {
                const isSelected = city.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] shadow-xs'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0]">
                Or enter another city:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Toronto, Berlin, Chennai"
                className="w-full mt-1 px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
              />
            </div>
          </div>

          {/* What matters most */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#F2B134]" />
              <span>What matters most</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPriority(opt)}
                  className={`p-3 rounded-xl text-xs font-medium text-left transition-all cursor-pointer flex items-center justify-between ${
                    priority.toLowerCase().includes(opt.toLowerCase())
                      ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] shadow-xs'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                  }`}
                >
                  <span>{opt}</span>
                  {priority.toLowerCase().includes(opt.toLowerCase()) && (
                    <Check className="w-4 h-4 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* When you're free */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <div>
              <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F2B134]" />
                <span>When you're free</span>
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
                Concrete time windows so we match you with a Career Guide and pod whose schedules overlap.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {AVAILABILITY_OPTIONS.map((opt) => {
                const selected = availability.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAvailability(opt)}
                    className={`w-full p-3 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] shadow-xs'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        selected
                          ? 'border-white dark:border-[#102A2E] bg-white/20'
                          : 'border-[#55665F]'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Who depends on you */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2D6B8F]" />
              <span>Who depends on you</span>
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {DEPENDANTS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDependants(opt)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    dependants === opt
                      ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Prefer a Career Guide of a particular gender */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <div>
              <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#2F7D5B]" />
                <span>Prefer a Career Guide of a particular gender (optional)</span>
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
                Used only if you choose a preference.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setPreferredGender(g)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    preferredGender === g
                      ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2F7D5B]" />
              <span>Specific constraints (optional)</span>
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {COMMON_CONSTRAINTS.map((opt) => {
                const selected = constraints.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleConstraint(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customConstraint}
                onChange={(e) => setCustomConstraint(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addCustomConstraint())
                }
                placeholder="Add other constraint..."
                className="flex-1 px-3 py-1.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-xs text-[#13231F] dark:text-[#E6EEEA]"
              />
              <button
                type="button"
                onClick={addCustomConstraint}
                className="px-3.5 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523] cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <button
            type="button"
            onClick={() => navigate('/onboarding/background')}
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
            <span>Next: Confirm your move</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
