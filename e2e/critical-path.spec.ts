import { expect, test } from '@playwright/test';

test('a player can add a selection, stake it, and place a bet', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Live odds. Sharper lines.' }),
  ).toBeVisible();

  await page.getByRole('link', { name: /view football events/i }).click();
  await expect(page).toHaveURL(/\/sport\/football$/);
  await expect(page.getByRole('heading', { name: 'Football' })).toBeVisible();

  const oddsButton = page.getByRole('button', { name: /, odds/i }).first();
  await expect(oddsButton).toBeEnabled();
  await oddsButton.click();
  await expect(oddsButton).toHaveAttribute('aria-pressed', 'true');

  const betSlip = page
    .getByRole('complementary')
    .filter({ hasText: 'Bet Slip' });
  await expect(betSlip).toBeVisible();
  await expect(betSlip.getByText('1 selection')).toBeVisible();

  await betSlip.getByLabel(/stake/i).fill('10');
  await expect(betSlip.getByText('€10.00')).toBeVisible();

  await betSlip.getByRole('button', { name: 'Place Bet' }).click();

  await expect(page.getByRole('alertdialog')).toBeVisible();
  await expect(page.getByText(/confirm your bet/i)).toBeVisible();

  await page.getByRole('button', { name: 'Confirm bet' }).click();

  await expect(page.getByText('Bet placed')).toBeVisible();
  await expect(betSlip.getByText('Your bet slip is empty.')).toBeVisible();
});
