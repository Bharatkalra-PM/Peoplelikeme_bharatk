import { Milestone, MoveProfile } from '../types';
import { draftPersonalMilestones } from './matching';

export async function transcribeVoiceAudio(
  audioBase64: string,
  mimeType = 'audio/webm'
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType }),
    });
    if (!res.ok) throw new Error('Transcription network error');
    const data = await res.json();
    return data.transcript || '';
  } catch (error) {
    console.warn('Voice transcription fallback triggered');
    return 'Voice answer recorded. (Feel free to edit this text)';
  }
}

export async function requestDraftMoveProfile(payload: {
  storyAnswers: Record<string, any>;
  cvText?: string;
  linkedInText?: string;
  detailChips: {
    from_role?: string;
    from_field?: string;
    to_role?: string;
    years_experience?: number;
    dependants: string;
    priority: string;
    availability: string[];
    city: string;
    constraints: string[];
    preferred_guide_gender?: string;
  };
}): Promise<{ draft: Partial<MoveProfile>; usedFallback: boolean }> {
  try {
    const res = await fetch('/api/gemini/draft-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Draft profile error');
    const data = await res.json();
    return { draft: data, usedFallback: false };
  } catch (error) {
    console.warn('Draft profile fallback:', error);
    return {
      usedFallback: true,
      draft: {
        from_role:
          payload.detailChips.from_role ||
          payload.storyAnswers?.coming_from ||
          'Sales Lead',
        from_field: payload.detailChips.from_field || 'Sales & Client Strategy',
        from_company_type: 'Growth tech company',
        to_role:
          payload.detailChips.to_role ||
          payload.storyAnswers?.going_to ||
          'Product Manager',
        years_experience: payload.detailChips.years_experience ?? 5,
        months_since_leaving: null,
        dependants: payload.detailChips.dependants || 'None',
        priority: payload.detailChips.priority || 'Speed to role',
        availability: payload.detailChips.availability || ['Weekday evenings (6:00 PM – 8:00 PM)'],
        constraints: payload.detailChips.constraints || [],
        story:
          payload.storyAnswers?.pushing_change ||
          'Transitioning customer-facing experience into product discovery and delivery.',
      },
    };
  }
}

export async function requestMatchReason(
  switcherProfile: MoveProfile,
  guideProfile: MoveProfile
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/match-reason', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ switcherProfile, guideProfile }),
    });
    if (!res.ok) throw new Error('Match reason error');
    const data = await res.json();
    return data.reason || '';
  } catch (error) {
    if (guideProfile.went_back) {
      return `Both moved from ${switcherProfile.from_role} into ${guideProfile.to_role}; later returned to ${guideProfile.from_role}.`;
    }
    return `Both navigated moving from ${switcherProfile.from_role} to ${guideProfile.to_role} with similar experience.`;
  }
}

export async function requestDraftMilestones(
  moveProfile: MoveProfile,
  triedSoFar?: string
): Promise<Milestone[]> {
  try {
    const res = await fetch('/api/gemini/draft-milestones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moveProfile, triedSoFar }),
    });
    if (!res.ok) throw new Error('Milestones error');
    const data = await res.json();
    if (Array.isArray(data.milestones) && data.milestones.length >= 4) {
      return data.milestones;
    }
  } catch (error) {
    // Fallback to deterministic milestone generator
  }
  return draftPersonalMilestones(moveProfile, { triedSoFar });
}
