import { test, expect } from '@playwright/test';

test('прогресс обработки данных отображается корректно', async ({ page }) => {
    await page.goto('/');

    const filePath = 'src/tests/files/test.csv';
    const input = await page.getByTestId('file-input');
    await input.setInputFiles(filePath);

    const sendButton = await page.getByTestId('button-send');
    await sendButton.click();

    const highlightItems = page.locator('[data-testid="highlight-item"]');

    const itemFirstTime = await highlightItems.nth(0).innerText();

    await page.waitForTimeout(1000);

    const itemSecondTime = await highlightItems.nth(0).innerText();

    const changed = itemFirstTime !== itemSecondTime
    expect(changed).toBe(true);
});
