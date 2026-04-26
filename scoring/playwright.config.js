const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: ['test_issues.spec.js'],
  timeout: 30_000,
  reporter: [['list'], ['json', { outputFile: 'results.json' }]],
  use: {
    headless: true,
    baseURL: 'http://127.0.0.1:8002',
  },
  webServer: {
    command: 'npx --yes serve ../app -p 8002 -s',
    url: 'http://127.0.0.1:8002',
    timeout: 30_000,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
