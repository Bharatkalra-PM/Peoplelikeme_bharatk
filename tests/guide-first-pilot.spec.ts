import { test, expect } from '@playwright/test';

test.describe('Guide-First 4-Week Pilot Changes', () => {
  test('(a) Sign-up to Week 1 with PODS_ENABLED=false shows 4-week guide-only flow with no pod text', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByText('The go-to place for a career change in any field.')
    ).toBeVisible();
    await expect(page.getByTestId('landing-pilot-moves')).toContainText('Starting with');

    await page.goto('/onboarding/objective');
    await expect(page.getByText('Change to a new role or field')).toBeVisible();
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).not.toContain('your pod');

    await page.goto('/home');
    await expect(page.getByText(/Week 1 of 4/i).first()).toBeVisible();
    await expect(page.getByTestId('entry-my-plan')).toBeVisible();
    await expect(page.getByTestId('entry-my-career-guide')).toBeVisible();
    await expect(page.getByTestId('entry-my-pod')).toHaveCount(0);
  });

  test('(b) A full Career Guide (2 active career changers) is hidden from matching and shows Currently full if opened directly', async ({
    page,
  }) => {
    await page.goto('/guides');
    await expect(page.getByTestId('guide-card-guide-karthik-s')).toHaveCount(0);

    await page.goto('/guides/guide-karthik-s');
    await expect(page.getByTestId('guide-currently-full-badge')).toContainText('Currently full');
    await expect(page.getByTestId('guide-currently-full-banner')).toContainText(
      'Currently full (guiding 2 of 2 career changers)'
    );
  });

  test('(c) A non-pilot move lands on the waitlist with the pilot message', async ({ page }) => {
    await page.goto('/guides');
    await page.getByRole('button', { name: /Adjust what matters/i }).first().click();
    await page.locator('#adj-from-role').fill('Civil Engineer');
    await page.locator('#adj-to-role').fill('Landscape Architect');
    await page.getByRole('button', { name: /Update matches/i }).click();

    await expect(page.getByTestId('waitlist-non-pilot-card')).toContainText(
      "We're starting with a few common moves. We'll let you know when we have Career Guides for yours."
    );
  });

  test('(d) Week-4 Month 2 offer shows one stable price (₹499 or ₹699), and Not now leads to the ₹199 question', async ({
    page,
  }) => {
    await page.goto('/wrap-up');
    const offerCard = page.getByTestId('month2-offer-card');
    await expect(offerCard).toContainText('Keep going with your Career Guide for month 2');

    const priceEl = page.getByTestId('month2-assigned-price');
    const firstPrice = await priceEl.innerText();
    expect(['₹499', '₹699']).toContain(firstPrice.trim());

    // Reload to verify the assigned price stays identical
    await page.reload();
    const secondPrice = await page.getByTestId('month2-assigned-price').innerText();
    expect(secondPrice.trim()).toBe(firstPrice.trim());

    // Click "Not now" -> leads to "Would you continue at ₹199?"
    await page.getByTestId('month2-not-now-btn').click();
    await expect(page.getByTestId('month2-fallback-199-section')).toContainText(
      'Would you continue at ₹199?'
    );
  });

  test('(e) Admin Pilot page shows Go/No-Go counts, price test split, pilot moves, and waitlist', async ({
    page,
  }) => {
    await page.goto('/signup?mode=signin');
    await page.getByRole('button', { name: /Admin →/i }).click();
    await page.goto('/admin/pilot');

    await expect(page.getByTestId('admin-pilot-dashboard')).toBeVisible();
    await expect(page.getByTestId('pilot-measure-calls')).toContainText('7 of 10');
    await expect(page.getByTestId('pilot-measure-goals')).toContainText('6 of 10');
    await expect(page.getByTestId('pilot-measure-ratings')).toContainText('7 of 10');
    await expect(page.getByTestId('pilot-measure-paid')).toContainText('3 of 10');
    await expect(page.getByTestId('pilot-measure-guides')).toContainText('4 of 5');
    await expect(page.getByTestId('pilot-price-test-split')).toBeVisible();
    await expect(page.getByTestId('admin-waitlist-section')).toBeVisible();
  });
});
