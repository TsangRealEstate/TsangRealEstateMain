const puppeteer = require("puppeteer");
const fs = require("fs");

//Excell Func: =ARRAYFORMULA(IF(A1:A="", "", SUBSTITUTE(SUBSTITUTE(A1:A, """", ""), ",", "")))

const TARGET_NAMES = [
  "100 Labor",
  "Baldwin",
  "Beacon at Meridian",
  "Belcara",
  "Boulevard at Sonterra",
  "Celeste",
  "Cottages at Leon Creek",
  "Dalian 151",
  "Dalian Monterrey Village",
  "District at Medical",
  "Flats at Big Tex",
  "Heron on Hausman",
  "Landmark Grandview",
  "Lodge at Shavano Park",
  "Magnolia Heights",
  "Mira Vista",
  "Mission Ranch",
  "Mosaic",
  "Palmetto Pointe",
  "Ridgeline Rogers Ranch",
  "Rivera",
  "Sienna at Westover Hills",
  "Southtown Flats",
  "Spice Creek",
  "St. John",
  "Summit at TPC",
  "Sunset Ridge",
  "Tacara Stone Oak",
  "Timberhill Commons",
  "TruNorth Bulverde",
  "Indian Hollow",
  "Urban Crest",
  "Villas at Westover Hills",
  "Villages of Briggs Ranch",
  "Anthony Canyon Springs",
  "Aspire at Tampico",
  "Azul",
  "Barcelona Lofts",
  "Chase Hill Apartments",
  "Citadel Lookout",
  "Edge and Stone",
  "Elation Buckskin",
  "Frame Med Center",
  "Grand at Dominion",
  "Hawthorne House",
  "Los Robles",
  "Mark Huebner Oaks",
  "Medwest",
  "Oro Stone Oak",
  "Overlook Exchange",
  "Park at Rialto",
  "Pecos Flats",
  "Presidium Chase Hill",
  "Pulte Davis Ranch",
  "Trails at Culebra",
  "Trophy Oak",
  "Tuscany Park",
  "Valencia Lofts",
  "Vizcaya",
  "Encore 281",
  "Hilltop Shavano",
  "Legacy Creekside",
  "120 Ninth Street",
  "1800 Broadway",
  "7600 Broadway",
  "Abbey at Dominion Crossing",
  "Abbey at Sonterra",
  "Abbey Grande Oaks",
  "Acero Southtown",
  "Agave",
  "Agora",
  "Alamar",
  "Amara",
  "Arbolada",
  "Art House",
  "Artessa",
  "Ascend 1604",
  "Augusta Flats",
  "Axis Hamilton",
  "Azure City Living",
  "Birdsong Leon Springs",
  "Brio Lookout",
  "Caroline Longhorn Quarry",
  "Culebra Commons",
  "Dolce Vita",
  "Durrington Ridge",
  "Easton Luxury",
  "Eleven West",
  "Encore Grayson",
  "Encore SoFlo",
  "Esperanza",
  "Flats at River North",
  "Heritage Plaza",
  "Infinity",
  "Inspire Downtown",
  "Iron Ridge",
  "Judson Pointe",
  "Laurel Canyon",
  "Lofts on Main",
  "Napa Oaks",
  "Nova",
  "Oxford at Estonia",
  "Oxford Medical",
  "Paragon Westover Hills",
  "Prose at Westover Hills",
  "Prose North West",
  "Prose Vista West",
  "Ranch at Westend",
  "Redlands",
  "Remington Ranch",
  "Royal Palms",
  "Tacara Crosswinds",
  "Tacara Dove Creek",
  "Tara",
  "The Highline",
  "Tin Top",
  "Tobin Estate",
  "Tribute Rim",
  "Vantage Fair Oaks",
  "Vantage Helotes",
  "Vecina",
  "Ventura Ridge",
  "Villas at Rogers Ranch",
  "Vista Colina",
  "Vista Ridge",
  "Vue Sonoma Verde",
  "Birdsong at Alamo Ranch",
  "Greenway",
  "Abacus Alamo Ranch",
  "Abacus West",
  "Abbey at Stone Oak",
  "Altamonte",
  "Ascent Cresta Bella",
  "Berkshire at the Rim",
  "Dwell Legacy",
  "Echelon at Monterrey Village",
  "Enclave at Dominion",
  "Hardy Oak",
  "Henley at the Rim",
  "Linden at The Rim",
  "Maxwell Townhomes",
  "Mela Luxury",
  "Melissa Ranch",
  "Overlook Rim",
  "Park at Briggs Ranch",
  "Reveal Skyline",
  "Siena on Sonterra",
  "Toscana at Sonterra",
  "Verandas Alamo Ranch",
  "View at Crown Ridge",
  "Vue",
  "Wiregrass Stone Oak",
  "Maddox Hills",
  "La Tierna",
];

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    const url =
      "https://www.dropbox.com/scl/fo/15ojdx47rlkqfaclxnuoh/AC51xFPvli7ZIQuHS1Y6Y5o?rlkey=jpbbilznsa5hdkmmaxa9dzfaw&e=1&st=td8ewaek&dl=0";
    // console.log(`Opening URL: ${url}`);

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for the table to load
    await page.waitForSelector('[role="row"][data-testid="ROW_TEST_ID"]', {
      timeout: 30000,
    });

    let items = [];
    let previousCount = 0;
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      await page.evaluate(() => window.scrollBy(0, 300));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const currentItems = await page.evaluate(() => {
        const rows = Array.from(
          document.querySelectorAll('[role="row"][data-testid="ROW_TEST_ID"]')
        );
        return rows
          .map((row) => {
            const nameElement = row.querySelector(
              '[data-testid="digTruncateTooltipTrigger"]'
            );
            return nameElement ? nameElement.textContent.trim() : null;
          })
          .filter(Boolean);
      });

      items = [...new Set([...items, ...currentItems])];

      if (items.length === previousCount) {
        attempts++;
      } else {
        attempts = 0;
      }

      previousCount = items.length;

      const isAtBottom = await page.evaluate(() => {
        return (
          window.innerHeight + window.scrollY >= document.body.scrollHeight
        );
      });

      if (isAtBottom && items.length === previousCount) break;
    }

    console.log(`Found ${items.length} Dropbox items total`);

    // Compare target names with scraped items
    const matchesFound = TARGET_NAMES.filter((target) =>
      items.some((item) => item.toLowerCase() === target.toLowerCase())
    );

    const matchesNotFound = TARGET_NAMES.filter(
      (target) =>
        !items.some((item) => item.toLowerCase() === target.toLowerCase())
    );

    // Dropbox items that are NOT in TARGET_NAMES
    const dropboxItemsNotInTargetNames = items.filter(
      (item) =>
        !TARGET_NAMES.some(
          (target) => target.toLowerCase() === item.toLowerCase()
        )
    );

    // console.log("\nMATCHES FOUND:");
    matchesFound.forEach((match, index) => {
      // console.log(`${index + 1}: ${match}`);
    });

    // console.log("\nMATCHES NOT FOUND:");
    matchesNotFound.forEach((missing, index) => {
      // console.log(`${index + 1}: ${missing}`);
    });

    // console.log("\nDROPBOX ITEMS NOT IN TARGET_NAMES:");
    dropboxItemsNotInTargetNames.forEach((name, index) => {
      // console.log(`${index + 1}: ${name}`);
    });

    // Save comprehensive results to file
    const output = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        totalDropboxItems: items.length,
        totalTargetNames: TARGET_NAMES.length,
        totalMatchesFound: matchesFound.length,
        totalMatchesNotFound: matchesNotFound.length,
        totalDropboxItemsNotInTargetNames: dropboxItemsNotInTargetNames.length,
      },
      targetNames: TARGET_NAMES,
      matchesFound,
      matchesNotFound,
      dropboxItemsNotInTargetNames,
      allDropboxItems: items,
    };

    fs.writeFileSync("dropbox_matches.json", JSON.stringify(output, null, 2));
    console.log("\nComplete results saved to dropbox_matches.json");

    await browser.close();
  } catch (error) {
    console.error("Error occurred:", error);
    await browser.close();
  }
})();
