const puppeteer = require("puppeteer");
const config = require("./config");
const extractListingsFn = require("./extractListings");

(async () => {
  const {
    state,
    city,
    beds,
    baths,
    minPrice,
    maxPrice,
    moveInDate,
    amenities,
    commuteLocation,
    sort,
  } = config;

  const baseUrl = `https://www.apartmentlist.com/${state}/${city}`;
  const queryParams = new URLSearchParams();

  if (beds) queryParams.set("beds", beds.toString());
  if (baths) queryParams.set("baths", baths.toString());
  if (minPrice) queryParams.set("price_min", minPrice.toString());
  if (maxPrice) queryParams.set("price_max", maxPrice.toString());
  if (moveInDate) queryParams.set("move_in", moveInDate); // Format: YYYY-MM-DD
  if (commuteLocation) queryParams.set("commute_location", commuteLocation);
  if (sort) queryParams.set("sort", sort);

  if (amenities && amenities.length > 0) {
    queryParams.set("amenities", amenities.join(","));
  }

  const finalUrl = `${baseUrl}?${queryParams.toString()}`;

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

  console.log("Navigating to:", finalUrl);

  await page.goto(finalUrl, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector(".MuiButtonBase-root", { timeout: 10000 });

    await page.click(".MuiButtonBase-root");

    console.log("Clicked 'I am a U.S. resident'");

    await new Promise((resolve) => setTimeout(resolve, 4000));

    console.log("Re-navigating to full URL with filters...");

    await page.goto(finalUrl, { waitUntil: "domcontentloaded" });
  } catch (err) {
    console.warn("Popup didn't appear or button not found:", err.message);
  }

  await page.waitForSelector('[data-testid="listing-card"]', {
    timeout: 15000,
  });

  // Inject and run the extractor function
  const listings = await page.evaluate(extractListingsFn);

  console.log("Scraped Listings:");
  console.log(JSON.stringify(listings, null, 2));
  console.log("Total Listings:", listings.length);

  await browser.close();
})();
