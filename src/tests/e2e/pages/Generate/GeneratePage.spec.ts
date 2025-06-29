import { test, expect } from '@playwright/test';

test('файл скачивается после успешной генерации', async ({ page }) => {
    await page.goto('/generate');

    await page.getByTestId('generate-button').click();

    const download = await page.waitForEvent('download', { timeout: 5000 });

    expect(download.suggestedFilename()).toContain('.csv');
});
