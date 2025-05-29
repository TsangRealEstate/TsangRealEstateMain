require("dotenv").config();
const mongoDBInstance = require("./database/connectors/mongoose.connector");
const { ListScraper } = require("./NewScrape/listScraper");

async function App() {
  console.log(`\x1b[32m`, `App Starting`, `\x1b[0m`);
  await mongoDBInstance.initializeMongoDB();
  const scraper = new ListScraper();
  await scraper.run();
}

// Ensure clean exit + error handling
(async () => {
  try {
    await App();
    console.log(`\x1b[32m`, `Scraper finished successfully`, `\x1b[0m`);
    process.exit(0);
  } catch (err) {
    console.error(`\x1b[31m`, `Scraper failed:`, err, `\x1b[0m`);
    process.exit(1);
  }
})();
