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

const scrapeListingDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found" });
    }

    const { name } = listing;
    const slug = name
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
    await page.goto(url, { waitUntil: "networkidle2" });

    res.status(200).json({
      success: true,
      message: `Opened listing page for '${name}'`,
      url,
    });

    // Optionally keep browser open for dev or close after delay
    setTimeout(async () => {
      await browser.close();
      console.log("Browser closed after preview.");
    }, 15000);
  } catch (error) {
    console.error("Error scraping listing by ID:", error.message);
    res.status(500).json({ success: false, error: "Failed to open Puppeteer" });
  }
};

module.exports = {
  getAllListings,
  scrapeListingDetailsById,
};
