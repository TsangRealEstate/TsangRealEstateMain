require("dotenv").config();
const mongoDBInstance = require("./database/connectors/mongoose.connector");
const { ListScraper } = require("./NewScrape/listScraper");

async function App() {
  console.log(`\x1b[32m`, `App Starting`, `\x1b[0m`);
  await mongoDBInstance.initializeMongoDB();
  new ListScraper();
}

App();
