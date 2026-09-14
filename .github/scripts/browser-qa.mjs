import puppeteer from 'puppeteer-core';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173/';
const chrome = process.env.CHROME_BIN || '/usr/bin/google-chrome';
await mkdir('qa/screenshots', { recursive: true });

const report = { pages: [], consoleErrors: [], pageErrors: [], requestFailures: [], checks: [] };
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

function wire(page, label) {
  page.on('console', msg => {
    if (msg.type() === 'error') report.consoleErrors.push({ page: label, text: msg.text() });
  });
  page.on('pageerror', error => report.pageErrors.push({ page: label, text: String(error) }));
  page.on('requestfailed', request => report.requestFailures.push({ page: label, url: request.url(), error: request.failure()?.errorText || 'failed' }));
}

async function check(name, fn) {
  try {
    const value = await fn();
    report.checks.push({ name, pass: Boolean(value), value });
    if (!value) throw new Error(`Check failed: ${name}`);
  } catch (error) {
    report.checks.push({ name, pass: false, error: String(error) });
    throw error;
  }
}

async function waitForWorkspace(page) {
  await page.waitForFunction(() => !document.querySelector('.workspace-loading'), { timeout: 8000 });
  await page.waitForSelector('.page-head h1', { timeout: 8000 });
}

let fatalError;
try {
  const desktop = await browser.newPage();
  wire(desktop, 'desktop');
  await desktop.setViewport({ width: 1440, height: 1050, deviceScaleFactor: 1 });
  await desktop.goto(base, { waitUntil: 'networkidle0', timeout: 20000 });
  await desktop.waitForSelector('.login-page');
  report.pages.push({ name: 'login', url: desktop.url() });
  await check('login heading', async () => (await desktop.$eval('.login-brand h1', el => el.textContent?.trim())) === 'Run projects without losing the thread.');
  await desktop.screenshot({ path: 'qa/screenshots/01-login-desktop.png', fullPage: true });

  await Promise.all([
    desktop.click('button[type=submit]'),
    desktop.waitForFunction(() => location.pathname.includes('/app/overview'), { timeout: 8000 })
  ]);
  await waitForWorkspace(desktop);
  report.pages.push({ name: 'overview', url: desktop.url() });
  await check('overview heading', async () => (await desktop.$eval('.page-head h1', el => el.textContent?.trim()))?.includes('Good morning'));
  await check('desktop no page overflow', async () => desktop.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await desktop.screenshot({ path: 'qa/screenshots/02-overview-desktop.png', fullPage: true });

  for (const [name, href, expected] of [
    ['projects', '/app/projects', 'Projects'],
    ['customers', '/app/customers', 'Customers'],
    ['inventory', '/app/inventory', 'Inventory'],
    ['tasks', '/app/tasks', 'Tasks']
  ]) {
    await desktop.click(`.sidebar a[href="${href}"]`);
    await desktop.waitForFunction((text) => document.querySelector('.page-head h1')?.textContent?.trim() === text, {}, expected);
    report.pages.push({ name, url: desktop.url() });
    await check(`${name} heading`, async () => (await desktop.$eval('.page-head h1', el => el.textContent?.trim())) === expected);
    await check(`${name} no page overflow`, async () => desktop.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  }
  await desktop.screenshot({ path: 'qa/screenshots/03-tasks-desktop.png', fullPage: true });

  await desktop.click('.sidebar a[href="/app/projects"]');
  await desktop.waitForFunction(() => document.querySelector('.page-head h1')?.textContent?.trim() === 'Projects');
  await desktop.click('.page-head button.primary');
  await desktop.waitForSelector('.dialog-panel');
  await check('new project dialog opens', async () => Boolean(await desktop.$('.dialog-panel')));
  await desktop.screenshot({ path: 'qa/screenshots/04-project-dialog-desktop.png', fullPage: true });
  await desktop.click('.icon-close');

  await desktop.keyboard.down('Control');
  await desktop.keyboard.press('KeyK');
  await desktop.keyboard.up('Control');
  await desktop.waitForSelector('.search-page input');
  await check('global search shortcut', async () => desktop.url().includes('/app/search'));

  const mobile = await browser.newPage();
  wire(mobile, 'mobile');
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mobile.goto(base, { waitUntil: 'networkidle0', timeout: 20000 });
  await mobile.evaluate(() => localStorage.setItem('rivet-auth', '1'));
  await mobile.goto(base, { waitUntil: 'networkidle0', timeout: 20000 });
  await waitForWorkspace(mobile);
  await check('mobile no page overflow', async () => mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await check('mobile menu button visible', async () => mobile.$eval('.menu-btn', el => getComputedStyle(el).display !== 'none'));
  await mobile.screenshot({ path: 'qa/screenshots/05-overview-mobile.png', fullPage: true });

  await mobile.click('.menu-btn');
  await mobile.waitForSelector('.sidebar.open');
  await new Promise(resolve => setTimeout(resolve, 300));
  await mobile.screenshot({ path: 'qa/screenshots/06-menu-mobile.png', fullPage: true });

  await mobile.click('.sidebar a[href="/app/projects"]');
  await mobile.waitForFunction(() => location.pathname.includes('/app/projects'), { timeout: 8000 });
  await mobile.waitForFunction(() => !document.querySelector('.sidebar.open'), { timeout: 2000 });
  await check('mobile menu closes after navigation', async () => !Boolean(await mobile.$('.sidebar.open')));
  await check('mobile projects no page overflow', async () => mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await new Promise(resolve => setTimeout(resolve, 300));
  await mobile.screenshot({ path: 'qa/screenshots/07-projects-mobile.png', fullPage: true });
} catch (error) {
  fatalError = error;
  report.fatalError = String(error);
} finally {
  await writeFile('qa/browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

const failures = [
  ...report.checks.filter(item => !item.pass),
  ...report.consoleErrors,
  ...report.pageErrors,
  ...report.requestFailures
];
if (fatalError || failures.length) process.exit(1);
