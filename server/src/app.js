require("dotenv").config();
const mongoDB = require("./mongodb");
const { ListScraper } = require("./NewScrape/listScraper");

async function App() {
  console.log(`\x1b[32m`, `App Starting`, `\x1b[0m`);
  await mongoDB.initializeMongoDB();
  new ListScraper();
}

App();
