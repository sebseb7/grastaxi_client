import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const START_URL = 'http://grastaxi.info';
const OUTPUT_DIR = './coverage-report';

async function analyzeCoverage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  const page = await browser.newPage();
  
  // Start coverage collection
  await Promise.all([
    page.coverage.startJSCoverage({ resetOnNavigation: false }),
    page.coverage.startCSSCoverage({ resetOnNavigation: false }),
  ]);

  // Navigate to the page
  await page.goto(START_URL, { waitUntil: 'networkidle0' });
  
  // Wait a bit for any lazy-loaded content
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Collect coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  await browser.close();

  // Process coverage data
  let totalBytes = 0;
  let usedBytes = 0;
  const results = [];

  for (const entry of jsCoverage) {
    const url = entry.url;
    if (!url.includes('vendor') && !url.includes('main')) continue; // Only analyze our bundles

    let total = 0;
    let used = 0;

    for (const range of entry.ranges) {
      total += range.end - range.start;
      used += range.end - range.start;
    }

    // More accurate: count actual text length
    total = entry.text.length;
    used = 0;
    for (const range of entry.ranges) {
      used += range.end - range.start;
    }

    const unused = total - used;
    const percentUsed = total > 0 ? ((used / total) * 100).toFixed(2) : 0;

    results.push({
      url: url.split('/').pop(),
      total,
      used,
      unused,
      percentUsed: parseFloat(percentUsed),
    });

    totalBytes += total;
    usedBytes += used;
  }

  const totalUnused = totalBytes - usedBytes;
  const overallPercentUsed = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(2) : 0;

  // Generate report
  const report = `
# JavaScript Coverage Report

## Summary
- **Total JS Size**: ${(totalBytes / 1024).toFixed(2)} KB
- **Used**: ${(usedBytes / 1024).toFixed(2)} KB (${overallPercentUsed}%)
- **Unused**: ${(totalUnused / 1024).toFixed(2)} KB (${(100 - overallPercentUsed).toFixed(2)}%)

## Per-Bundle Breakdown

| Bundle | Total | Used | Unused | % Used |
|--------|-------|------|--------|--------|
${results.map(r => `| ${r.url} | ${(r.total/1024).toFixed(2)} KB | ${(r.used/1024).toFixed(2)} KB | ${(r.unused/1024).toFixed(2)} KB | ${r.percentUsed}% |`).join('\n')}

## Recommendations
${results.filter(r => r.percentUsed < 70).map(r => `- **${r.url}**: Only ${r.percentUsed}% used. Consider code-splitting or removing unused dependencies.`).join('\n') || '- All bundles have reasonable usage (>70%).'}
`.trim();

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write report
  const reportPath = path.join(OUTPUT_DIR, 'coverage-summary.md');
  fs.writeFileSync(reportPath, report);
  
  // Write detailed JSON
  const jsonPath = path.join(OUTPUT_DIR, 'coverage-details.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ summary: { totalBytes, usedBytes, totalUnused, overallPercentUsed }, results }, null, 2));

  console.log(report);
  console.log(`\n✅ Coverage report saved to ${reportPath}`);
}

analyzeCoverage().catch(console.error);