import { test, expect } from '@playwright/test';

test.describe('People Like Me — End-to-End Career Guide & Varun Journey', () => {
  test('(a) Varun full journey from sign-in to Week 1', async ({ page }) => {
    await page.goto('/signup');

    // Step 1: Sign in as a new user (Varun)
    await page.getByPlaceholder('Varun K.').fill('Varun K.');
    await page.getByPlaceholder('varun@domain.com').fill('varun@example.com');
    await page.getByRole('button', { name: /Continue with email/i }).click();
    await page.getByRole('button', { name: /Open Magic Link/i }).click();

    // Step 2: Objective screen
    await expect(page).toHaveURL(/\/onboarding\/objective/);
    await expect(page.getByText('What brings you here?')).toBeVisible();
    await page.getByRole('button', { name: /Switch to a new role or field/i }).click();

    // Step 3 (1/4): Story
    await expect(page).toHaveURL(/\/onboarding\/story/);
    await expect(page.getByTestId('onboarding-progress-bar')).toBeVisible();
    await page.getByRole('button', { name: /Skip for now/i }).click();

    // Step 3 (2/4): Background
    await expect(page).toHaveURL(/\/onboarding\/background/);
    await page.getByPlaceholder(/Senior Sales Manager/i).fill('Regional Sales Manager');
    await page.getByPlaceholder(/Product Manager/i).fill('Product Manager');
    await page.getByPlaceholder(/rewrote my CV/i).fill('Already rewrote my CV for product roles.');
    await page.getByRole('button', { name: /Continue to Details/i }).click();

    // Step 3 (3/4): Details
    await expect(page).toHaveURL(/\/onboarding\/details/);
    await page.getByRole('button', { name: /Draft my profile/i }).click();

    // Step 3 (4/4): Confirm
    await expect(page).toHaveURL(/\/onboarding\/confirm/);
    await expect(page.getByText(/Confirm your move profile/i)).toBeVisible();
    await page.getByRole('button', { name: /Confirm & go to Home/i }).click();

    // Step 4: Home before matching — single focused "Choose your Career Guide" card
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByTestId('next-step-choose-guide-card')).toBeVisible();
    await page.getByRole('link', { name: /Choose your Career Guide/i }).click();

    // Step 5: Recommended Career Guides (3 to 5 cards, "These are your closest matches, not everyone.")
    await expect(page).toHaveURL(/\/guides/);
    await expect(page.getByText('These are your closest matches, not everyone.')).toBeVisible();

    const cards = page.getByTestId('career-guide-card');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);
    expect(cardCount).toBeLessThanOrEqual(5);

    // Step 6: Request a Career Guide
    await cards.first().getByRole('link', { name: /Review & request Career Guide/i }).click();
    await expect(page.getByRole('button', { name: /Ask .* to be your Career Guide/i })).toBeVisible();
    await page.getByRole('button', { name: /Ask .* to be your Career Guide/i }).click();

    // Waiting screen
    await expect(page).toHaveURL(/\/request-sent/);
    await expect(page.getByText(/will reply within 48 hours/i)).toBeVisible();

    // Simulate Career Guide accepting request -> Week 1 of 8
    await page.getByRole('button', { name: /Simulate: Career Guide Accepts Request/i }).click();
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByRole('heading', { name: /Week 1 of 8/i })).toBeVisible();
    await expect(page.getByTestId('eight-week-plan-section')).toBeVisible();
    await expect(page.getByTestId('plan-status-badge')).toContainText(/Draft: you'll finalise this with/i);
  });

  test('(b) "Adjust what matters" returns a fresh set of Career Guides', async ({ page }) => {
    await page.goto('/guides');
    await expect(page.getByText('Recommended Career Guides')).toBeVisible();

    await page.getByRole('button', { name: /Adjust what matters/i }).click();
    await page.getByLabel(/Target role/i).fill('Data Analyst');
    await page.getByLabel(/Industry \/ Field/i).fill('FinTech');
    await page.getByRole('button', { name: /Update matches/i }).click();

    await expect(page.getByText(/Data Analyst/i).first()).toBeVisible();
  });

  test('(c) A Career Guide declining offers the next best match automatically', async ({ page }) => {
    await page.goto('/guides');
    const firstGuideName = await page.getByTestId('career-guide-card').first().locator('h2').textContent();

    await page.getByTestId('career-guide-card').first().getByRole('link', { name: /Review & request Career Guide/i }).click();
    await page.getByRole('button', { name: /Ask .* to be your Career Guide/i }).click();

    await expect(page).toHaveURL(/\/request-sent/);
    await page.getByRole('button', { name: /Simulate: Career Guide Declines/i }).click();

    await expect(page).toHaveURL(/\/guides/);
    await expect(page.getByText(/was unavailable, so we automatically offered your next best Career Guide matches/i)).toBeVisible();
    const newFirstGuideName = await page.getByTestId('career-guide-card').first().locator('h2').textContent();
    expect(newFirstGuideName).not.toEqual(firstGuideName);
  });

  test('(d) Pod-forming state ("Your pod is forming. 2 of 4 have joined.") and notification', async ({ page }) => {
    await page.goto('/pod/intro');
    await expect(page.getByText(/Your pod is forming\. 2 of 4 have joined\./i)).toBeVisible();

    await page.getByRole('button', { name: /Simulate: Remaining members join pod/i }).click();
    await expect(page.getByText(/Your pod is ready!/i)).toBeVisible();
  });

  test('(e) Career Guide application submitted and approved through /admin', async ({ page }) => {
    await page.goto('/become-a-guide');
    await expect(page.getByRole('heading', { name: /Become a Career Guide/i })).toBeVisible();

    await page.getByLabel(/Full name/i).fill('Kiran D.');
    await page.getByLabel(/Work email/i).fill('kiran@company.com');
    await page.getByLabel(/What you moved from/i).fill('Sales Manager');
    await page.getByLabel(/What you moved to/i).fill('Product Manager');
    await page.getByLabel(/Your move, in your words/i).fill('Moved from regional B2B sales into B2B SaaS product management in 7 months.');
    await page.getByLabel(/What you'd do differently/i).fill('Write concrete product teardowns in month one.');
    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: /Submit Career Guide application/i }).click();

    // Applicant sees "Under review"
    await expect(page.getByTestId('applicant-status-badge')).toHaveText('Under review');

    // Switch to Admin role and approve in /admin
    await page.goto('/admin');
    await page.getByRole('button', { name: /Switch to Admin Role/i }).click();

    await expect(page.getByRole('heading', { name: /Admin Dashboard/i })).toBeVisible();
    const kiranCard = page.locator('[data-testid^="admin-application-"]', { hasText: 'Kiran D.' });
    await expect(kiranCard).toBeVisible();
    await kiranCard.getByRole('button', { name: /^Approve$/i }).click();

    await expect(kiranCard.locator('[data-testid^="admin-app-status-"]')).toHaveText('Approved');
  });
});
