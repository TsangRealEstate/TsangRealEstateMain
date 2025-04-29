const { load } = require("cheerio");
const { delay } = require("../utils/commons");
const { ScrapeListModel } = require("../models/scrapeList");

class ListScraper {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const dataList = await this.fetchAllList();
      for (const property of dataList) {
        console.log("Processing => ", property.destinationURL);
        if (this.hostNameMatch(property.destinationURL, "apartmentlist.com")) {
          await this.scrapeApartmentListPropertyByURL(property.destinationURL);
          console.log("Finished Processing => ", property.destinationURL);
          await delay(2);
        } else {
          console.log("Skipping => ", property.destinationURL);
        }
      }
    } catch (error) {
      console.log("Processing failed => ", error);
    }
  }

  async fetchAllList() {
    try {
      const allList = await ScrapeListModel.find(
        {},
        { title: 1, destinationURL: 1 }
      ).lean();
      return allList;
    } catch (error) {
      console.log(`Error while fetching all list data => `, error);
      return [];
    }
  }

  hostNameMatch(url, hostName) {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace(/^www\./, "");
      return hostname === hostName;
    } catch (error) {
      console.error("Invalid URL:", error);
      return false;
    }
  }

  async scrapeApartmentListPropertyByURL(url) {
    try {
      //   console.log(`[1] Starting scrape for ${url}`);
      const updatedInfo = { lastScrapeInfo: "none" };

      // 1- fetch the page information
      //   console.log(`[2] Fetching page HTML...`);
      const { html, status } = await this.getPageHtml(url);
      //   console.log(`[3] Got status: ${status}, HTML length: ${html.length}`);

      if (status !== "200") {
        updatedInfo.lastScrapeInfo = "failed";
        console.log(`[X] Failed - HTTP Status ${status}`);
        return;
      }

      // 2- extract the script data
      //   console.log(`[4] Extracting script data...`);
      const scriptData = this.extractScriptById(html);
      //   console.log(`[5] Script data length: ${scriptData.length}`);

      // 3- extract the propertyInfo
      //   console.log(`[6] Extracting property info...`);
      const propertyInformation = this.extractPropertyInformation(scriptData);
      //   console.log(
      //     `[7] Property info:`,
      //     propertyInformation ? "Exists" : "NULL"
      //   );

      if (propertyInformation === null) {
        updatedInfo.lastScrapeInfo = "failed";
        console.log(`[X] Failed - No property information found`);
        return;
      }

      updatedInfo.lastScrapeInfo = "success";
      Object.assign(updatedInfo, { Information: propertyInformation });

      //   console.log(`[8] Saving to database...`);
      const result = await ScrapeListModel.findOneAndUpdate(
        { destinationURL: url },
        updatedInfo,
        { new: true } // Return the updated document
      );

      //   console.log(`[✓] Successfully updated:`, {
      //     matched: result?.lastScrapeInfo,
      //     updated: result?.updatedAt,
      //   });
    } catch (error) {
      console.error(`[!] Error in scrapeApartmentListPropertyByURL:`, error);
    }
  }

  async getPageHtml(url) {
    try {
      const cookieValue = [
        "geofence_bypass=true",
        "al_geo=bypass",
        "ak_bmsc=...",
      ].join("; ");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          cookie: cookieValue,
          Referer: url,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        redirect: "follow",
      });

      if (!response.ok) {
        console.error(`Failed to fetch HTML. Status: ${response.status}`);
      }
      return {
        html: await response.text(),
        status: response.status.toString(),
      };
    } catch (error) {
      console.error("Error fetching HTML:", error);
      throw error;
    }
  }

  extractScriptById(pageHTMLContent) {
    const $ = load(pageHTMLContent);
    const scriptElement = $(`script#__NEXT_DATA__`);
    if (scriptElement.length > 0) {
      return scriptElement.html() || ``;
    } else {
      return ``;
    }
  }
  

  extractPropertyInformation(jsonString) {
    try {
      const jsonData = JSON.parse(jsonString);

      // 1. First try the new search results location
      if (jsonData?.props?.pageProps?.component?.searchResult) {
        const results = jsonData.props.pageProps.component.searchResult;
        return {
          listings: results.listingPins,
          apiToken: jsonData.runtimeConfig?.al_api_token_desktop,
          totalResults: results.totalResults,
        };
      }

      // 2. Try alternative locations
      const possiblePaths = [
        "props.pageProps.component.listing",
        "props.pageProps.searchResults",
        "props.pageProps.initialState.listings",
        "props.pageProps.dehydratedState.queries",
      ];

      for (const path of possiblePaths) {
        const value = path.split(".").reduce((o, i) => o?.[i], jsonData);
        if (value) {
          console.log(`Found data at: ${path}`);
          return value;
        }
      }

      return null;
    } catch (error) {
      console.error("Extraction error:", error);
      return null;
    }
  }
}

module.exports = { ListScraper };
