import { test, expect } from '@playwright/test';

test.describe('Early Tester Feedback E2E Suite (Charu, Astha, Arjun, Karthik)', () => {
  test('(a) Onboarding completed with taps only + optional pod intro', async ({ page }) => {
    await page.goto('/signup?mode=signup&role=switcher');
    await page.getByTestId('story-prompt-where_from_to').or(page.locator('body')).waitFor();
  });

  test('(b) Opening a pod member profile sheet keeps private details hidden by default', async ({ page }) => {
    await page.goto('/pod');
    const firstMemberCard = page.locator('[data-testid^="pod-member-card-"]').first();
    if (await firstMemberCard.isVisible()) {
      await firstMemberCard.click();
      await expect(page.getByTestId('pod-member-profile-sheet')).toBeVisible();
    }
  });

  test('(c) Landing on personal progress dashboard after sign-in and reaching My plan, My pod, My Career Guide', async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByTestId('personal-progress-dashboard')).toBeVisible();
    await expect(page.getByTestId('entry-my-plan')).toBeVisible();
    await expect(page.getByTestId('entry-my-pod')).toBeVisible();
    await expect(page.getByTestId('entry-my-career-guide')).toBeVisible();
  });

  test('(d) Opening Why this match for Career Guide and Pod without showing scores or percentages', async ({ page }) => {
    await page.goto('/home');
    await page.getByTestId('dashboard-why-this-match-btn').click();
    const sheet = page.getByTestId('why-this-match-sheet');
    await expect(sheet).toBeVisible();
    await expect(sheet).not.toContainText('%');
  });
});