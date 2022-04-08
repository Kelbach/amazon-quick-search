const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to https://www.wikipedia.org/
  await page.goto('https://www.wikipedia.org/');

  // Click strong:has-text("English")
  await page.locator('strong:has-text("English")').click();
  // assert.equal(page.url(), 'https://en.wikipedia.org/wiki/Main_Page');

  // Click text=liberal arts >> nth=1
  await page.locator('text=liberal arts').nth(1).click();
  // assert.equal(page.url(), 'https://en.wikipedia.org/wiki/Liberal_arts_education');

  // Click #toc >> text=History
  await page.locator('#toc >> text=History').click();
  // assert.equal(page.url(), 'https://en.wikipedia.org/wiki/Liberal_arts_education#History');

  // Click text=Seneca the Younger
  await page.locator('text=Seneca the Younger').click();
  // assert.equal(page.url(), 'https://en.wikipedia.org/wiki/Seneca_the_Younger');
  await page.screenshot({path: 'wiki_seneca.png'});

  // ---------------------
  await context.close();
  await browser.close();
})();