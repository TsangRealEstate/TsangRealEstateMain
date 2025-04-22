const puppeteer = require("puppeteer");
const config = require("./config");
const extractListingsFn = require("./extractListings");
require("dotenv").config();
const connectDB = require("../db");
const Listing = require("../models/Listing");

// Configuration
const PAGES_TO_SCRAPE = 3;
const DELAY_BETWEEN_PAGES = 2000;
const POPUP_TIMEOUT = 10000;

(async () => {
  let browser;
  try {
    await connectDB();
    const { state, city } = config;
    const baseUrl = `https://www.apartmentlist.com/${state}/${city}`;

    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--start-maximized",
        "--single-process",
        "--no-zygote",
      ],
      defaultViewport: null,
      executablePath: puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    console.log("Navigating to baseUrl:", baseUrl);
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

    // Handle the US resident popup if it appears
    try {
      await page.waitForSelector(".MuiButtonBase-root", {
        timeout: POPUP_TIMEOUT,
      });
      await page.click(".MuiButtonBase-root");
      console.log("Clicked 'I am a U.S. resident'");

      await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait after closing popup

      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      console.log("Re-navigated to URL after popup");

      await new Promise((resolve) => setTimeout(resolve, 10000));
    } catch (err) {
      console.warn("Popup didn't appear or button not found:", err.message);
    }

    const scrapePage = async (url, pageNum) => {
      console.log(`\nScraping page ${pageNum}: ${url}`);
      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });

        await page.waitForSelector('[data-testid="listing-card"]', {
          timeout: 15000,
        });

        const listings = await page.evaluate(extractListingsFn);
        console.log(`Found ${listings.length} listings on page ${pageNum}`);

        const saveOps = listings.map((listing) =>
          Listing.create(listing).catch((err) => {
            console.error(
              `Failed to save ${listing.name || "Unknown Listing"}:`,
              err.message
            );
            return null;
          })
        );

        const results = await Promise.all(saveOps);
        const savedCount = results.filter(Boolean).length;

        console.log(
          `Successfully saved ${savedCount}/${listings.length} listings from page ${pageNum}`
        );

        return listings.length;
      } catch (error) {
        console.error(`Error scraping page ${pageNum}:`, error.message);
        return 0;
      }
    };

    let totalScraped = 0;
    for (let i = 1; i <= PAGES_TO_SCRAPE; i++) {
      const pageUrl = i === 1 ? baseUrl : `${baseUrl}/page-${i}`;
      const count = await scrapePage(pageUrl, i);
      totalScraped += count;

      if (i < PAGES_TO_SCRAPE) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_PAGES));
      }
    }

    console.log(`\nDone! Total listings scraped: ${totalScraped}`);
  } catch (err) {
    console.error("Fatal error during scraping:", err);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
    process.exit(0);
  }
})();
