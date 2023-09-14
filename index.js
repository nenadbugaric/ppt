const puppeteer = require("puppeteer");

const url = "https://corepresent-staging.kvcore.com/ssr/DpxFmptJ532m";

(async function () {
  try {
    const browser = await puppeteer.launch({
      // args: chromium.args,
      defaultViewport: null,
      headless: "new",
      ignoreHTTPSErrors: true,
      dumpio: true,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1700,
      height: 1800,
    });

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    // await page.emulateMediaType("print");
    await page.evaluateHandle("document.fonts.ready");

    await page.pdf({
      width: "17in",
      height: "22in",
      printBackground: true,
      preferCSSPageSize: true,
      path: "output.pdf",
    });

    await browser.close();
  } catch (err) {
    throw new Error("PDF generation failed! " + (err.message || err));
  }
})();
