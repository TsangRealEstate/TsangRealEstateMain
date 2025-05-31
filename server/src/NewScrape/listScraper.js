const { load } = require("cheerio");
const { delay } = require("../utils/commons");
const { ScrapeListModel } = require("../models/scrapeList");

class ListScraper {
  async run() {
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
      const updatedInfo = { lastScrapeInfo: "none" };

      const { html, status } = await this.getPageHtml(url);

      if (status !== "200") {
        updatedInfo.lastScrapeInfo = "failed";
        console.log(`[X] Failed - HTTP Status ${status}`);
        return;
      }

      const scriptData = this.extractScriptById(html);

      const propertyInformation = this.extractPropertyInformation(scriptData);

      if (propertyInformation === null) {
        updatedInfo.lastScrapeInfo = "failed";
        console.log(`[X] Failed - No property information found`);
        return;
      }

      const cleanedInformation = this.cleanUnitData(propertyInformation);

      updatedInfo.lastScrapeInfo = "success";
      Object.assign(updatedInfo, { Information: cleanedInformation });

      const result = await ScrapeListModel.findOneAndUpdate(
        { destinationURL: url },
        updatedInfo,
        { new: true }
      );

      console.log(`Successfully updated: ${url}`);
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

  cleanUnitData(propertyData) {
    if (!propertyData || typeof propertyData !== "object") {
      return propertyData;
    }

    // Handle the property information structure from apartmentlist.com
    if (
      propertyData.available_units &&
      Array.isArray(propertyData.available_units)
    ) {
      const cleanedData = { ...propertyData };
      cleanedData.available_units = propertyData.available_units.map((unit) => {
        if (!unit.units || !Array.isArray(unit.units)) return unit;

        const cleanedUnit = { ...unit };
        cleanedUnit.units = unit.units.map((subUnit) => {
          const cleanedSubUnit = { ...subUnit };

          // Only replace if the field contains both letters and numbers
          const shouldReplaceName =
            subUnit.name &&
            /[a-zA-Z]/.test(subUnit.name) &&
            /\d/.test(subUnit.name);

          const shouldReplaceDisplayName =
            subUnit.display_name &&
            /[a-zA-Z]/.test(subUnit.display_name) &&
            /\d/.test(subUnit.display_name);

          // Use remote_listing_id if available, otherwise keep original
          if (shouldReplaceName && subUnit.remote_listing_id) {
            cleanedSubUnit.name = subUnit.remote_listing_id;
          }

          if (shouldReplaceDisplayName && subUnit.remote_listing_id) {
            cleanedSubUnit.display_name = subUnit.remote_listing_id;
          }

          return cleanedSubUnit;
        });

        return cleanedUnit;
      });

      return cleanedData;
    }

    // If it's not in the expected format, return as-is
    return propertyData;
  }
}

module.exports = { ListScraper };
