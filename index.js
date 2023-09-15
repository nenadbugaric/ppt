const puppeteer = require("puppeteer");

// const url = "https://corepresent-staging.kvcore.com/ssr/DpxFmptJ532m";
const url = "http://localhost:3001/ssr/DpxFmptJ532m";
// const url = "https://goo.gl/maps/yuhNeAZaSEEKAZcD8";

function delay(time, cb) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      cb?.();
      resolve();
    }, time);
  });
}

(async function () {
  try {
    const browser = await puppeteer.launch({
      // args,
      defaultViewport: null,
      headless: "new",
      ignoreHTTPSErrors: true,
      dumpio: true,
      // devtools: true,
    });

    const page = await browser.newPage();

    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    await page.setViewport({
      width: 1700,
      height: 1800,
    });

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    await page.emulateMediaType("print");
    await page.evaluateHandle("document.fonts.ready");

    const mapsHandle = await page.$$(".google-map");
    console.log("MAPS OUTSIDE: ", mapsHandle?.length);

    if (mapsHandle?.length) {
      for (const mapHandle of mapsHandle) {
        await delay(1000);
        await page.evaluate((map) => {
          console.log("MAP: ", map);

          map.scrollIntoView();
        }, mapHandle);
      }

      await delay(2000);
    }

    console.log("GENERATING PDF");
    await page.pdf({
      width: "17in",
      height: "22in",
      printBackground: true,
      preferCSSPageSize: false,
      path: "output.pdf",
    });

    await browser.close();
  } catch (err) {
    throw new Error("PDF generation failed! " + (err.message || err));
  }
})();
