import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './src/tests/e2e',
    timeout: 30_000,
    retries: 0,
    use: {
        baseURL: 'http://localhost:5174',
        trace: 'on-first-retry',
        viewport: { width: 1280, height: 720 },
        acceptDownloads: true,
    },
    webServer: {
        command: 'npm run dev',
        port: 5173,
        reuseExistingServer: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
