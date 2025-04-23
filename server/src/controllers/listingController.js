const Listing = require("../models/Listing");
const puppeteer = require("puppeteer");

const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    console.error("Failed to fetch listings:", error.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clickButtonByText = async (page, selector, textMatch) => {
  const elements = await page.$$(selector);
  for (const el of elements) {
    const text = await page.evaluate((el) => el.textContent, el);
    if (text && text.includes(textMatch)) {
      await page.evaluate((el) => el.click(), el);
      return true;
    }
  }
  return false;
};

const scrapeListingDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    const slug = listing.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const url = `https://www.apartmentlist.com/tx/san-antonio/${slug}`;

    const browser = await puppeteer.launch({
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

    console.log("🌐 Navigating to URL:", url);
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Handle initial modal
    await page.waitForSelector(".MuiButtonBase-root", { timeout: 10000 });
    await page.click(".MuiButtonBase-root");
    console.log("✅ Clicked 'I am a U.S. resident'");
    await delay(4000);

    // Reload full page content after modal
    console.log("🔄 Re-navigating to listing page...");
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await delay(10000);
    console.log("⏳ Waiting 10 seconds after re-navigation");

    // Click 'See all Floor Plans'
    await page.waitForSelector(".MuiButtonBase-root", { timeout: 15000 });
    const floorPlansClicked = await clickButtonByText(
      page,
      ".MuiButtonBase-root",
      "See all Floor Plans"
    );

    if (floorPlansClicked) {
      console.log("✅ Clicked 'See all Floor Plans'");

      // Wait for modal to appear
      try {
        await page.waitForSelector('[role="dialog"], .MuiDialog-root', {
          timeout: 10000,
        });
        console.log("✅ Modal opened successfully");
      } catch {
        console.warn(
          "⚠️ Modal did not appear after clicking 'See all Floor Plans'"
        );
      }
    } else {
      console.warn("⚠️ 'See all Floor Plans' button not found");
    }

    res.status(200).json({
      success: true,
      message: `Opened listing page for '${listing.name}', handled modal, and clicked 'See all Floor Plans'`,
      url,
    });

    setTimeout(async () => {
      await browser.close();
      console.log("🛑 Browser closed after preview.");
    }, 15000);
  } catch (error) {
    console.error("🔥 Error scraping listing by ID:", error.message);
    res.status(500).json({ success: false, error: "Failed to open Puppeteer" });
  }
};

module.exports = {
  getAllListings,
  scrapeListingDetailsById,
};
