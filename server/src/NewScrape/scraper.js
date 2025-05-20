const { load } = require("cheerio");
const { writeFile, readFile, stat } = require("fs/promises");

class ApartmentListScraper {
  constructor() {
    // this.init();
  }

  async init() {
    try {
      //1- fetch the properties search result page html document as text
      const pageHTML = await this.getPageHtml(
        "https://www.apartmentlist.com/tx/san-antonio"
      );

      // 2- extract the data from the script tag of thier NextJS app
      const scriptData = this.extractScriptById(pageHTML);

      // 3-extract the propery Id's
      const propertyIds = this.extractPropertiesId(scriptData);

      // store the propery ids into file as refrence
      await this.storeDataInFile(
        "propertiesID.json",
        JSON.stringify(propertyIds)
      );

      // 4- extract the API token
      const APIToken = this.extractAPIToken(scriptData);

      // create batch of ids with size of 20 on each batch to reduce api calls
      const batches = this.chunkArray(propertyIds, 20);

      let index = 1;
      for (const batch of batches) {
        // rental_id based on the data fetched
        const arrayOfIds = batch.map(({ rental_id }) => rental_id);
        console.log(`Fetching batch ${index} of properties info`);
        await this.processPropertyFetchingInBatch(APIToken, arrayOfIds);
        index++;
        await this.delay(5);
      }
      console.log("Finished.. for now!");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async getPageHtml(url) {
    try {
      const cookieValue = "geofence_bypass=true";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          cookie: cookieValue,
          Referer: `${url}`,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch HTML. Status: ${response.status}`);
      }

      const html = await response.text();
      return html;
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

  extractPropertiesId(jsonString) {
    try {
      const jsonData = JSON.parse(jsonString);
      return (
        jsonData?.props?.pageProps?.component?.searchResult?.listingPins ?? null
      );
    } catch (error) {
      console.error(`Failed process properties id from string`, error);
      return [];
    }
  }

  extractAPIToken(jsonString) {
    try {
      const jsonData = JSON.parse(jsonString);
      return jsonData?.runtimeConfig?.al_api_token_desktop ?? null;
    } catch (error) {
      console.error(`Failed process properties id from string`, error);
    }
  }

  async processPropertyFetchingInBatch(apiToken, propertyIds) {
    try {
      const fileName = "propertyInfo.json";
      const fileData = await this.readDataFromFile(fileName);
      const { listings } = await this.fetchProperyInformation(
        apiToken,
        propertyIds
      );

      // Clean the data before storing
      const cleanedListings = this.cleanUnitData(listings);

      fileData.push(...cleanedListings);
      await this.storeDataInFile(fileName, JSON.stringify(fileData));
    } catch (error) {
      console.error(`Failed process Property Fetching In Batch`, error);
    }
  }

  async fetchProperyInformation(APIToken, propertiesIdList) {
    try {
      const ids = propertiesIdList.join(",");
      const url = `https://api.apartmentlist.com/listings-search/listings?rental_ids=${ids}`;
      const result = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token token=${APIToken}`,
        },
        redirect: "follow",
      });
      const jsonResult = await result.json();
      return jsonResult;
    } catch (error) {
      console.error(`error while fetching the property information`, error);
    }
  }

  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async storeDataInFile(fileName, fileData) {
    try {
      await writeFile(fileName, fileData);
    } catch (error) {
      console.error(`Failed storing data into file`, error);
    }
  }

  async readDataFromFile(fileName) {
    try {
      await stat(fileName);
      const data = await readFile(fileName, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      } else {
        console.error(`Failed reading datafrom file`, error);
        return [];
      }
    }
  }

  async delay(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time * 1000);
    });
  }
  // Add this method inside your class, just before the module.exports
  cleanUnitData(propertyData) {
    if (!Array.isArray(propertyData)) {
      console.error(
        "Invalid propertyData: Expected array, received",
        typeof propertyData
      );
      return [];
    }

    return propertyData.map((property, propertyIndex) => {
      try {
        if (
          !property.available_units ||
          !Array.isArray(property.available_units)
        ) {
          console.log(
            `Property ${propertyIndex}: No available_units array found`
          );
          return property;
        }

        const cleanedProperty = { ...property };
        cleanedProperty.available_units = property.available_units.map(
          (unit, unitIndex) => {
            try {
              if (!unit.units || !Array.isArray(unit.units)) {
                console.log(
                  `Property ${propertyIndex}, Unit ${unitIndex}: No units array found`
                );
                return unit;
              }

              const cleanedUnit = { ...unit };
              cleanedUnit.units = unit.units.map((subUnit, subUnitIndex) => {
                try {
                  const cleanedSubUnit = { ...subUnit };
                  let changesMade = false;

                  // Clean name field
                  if (subUnit.name && !/^\d+$/.test(subUnit.name)) {
                    const originalName = subUnit.name;
                    cleanedSubUnit.name =
                      unit.remote_listing_id?.replace(/\D/g, "") || "N/A";
                    changesMade = true;
                    console.log(
                      `Cleaned name at Property ${propertyIndex}, Unit ${unitIndex}, SubUnit ${subUnitIndex}:`,
                      {
                        original: originalName,
                        cleaned: cleanedSubUnit.name,
                      }
                    );
                  }

                  // Clean display_name field
                  if (
                    subUnit.display_name &&
                    !/^\d+$/.test(subUnit.display_name)
                  ) {
                    const originalDisplayName = subUnit.display_name;
                    cleanedSubUnit.display_name =
                      unit.remote_listing_id?.replace(/\D/g, "") || "N/A";
                    changesMade = true;
                    console.log(
                      `Cleaned display_name at Property ${propertyIndex}, Unit ${unitIndex}, SubUnit ${subUnitIndex}:`,
                      {
                        original: originalDisplayName,
                        cleaned: cleanedSubUnit.display_name,
                      }
                    );
                  }

                  if (!changesMade) {
                    console.log(
                      `No changes needed at Property ${propertyIndex}, Unit ${unitIndex}, SubUnit ${subUnitIndex}`
                    );
                  }

                  return cleanedSubUnit;
                } catch (subUnitError) {
                  console.error(
                    `Error processing subUnit at Property ${propertyIndex}, Unit ${unitIndex}, SubUnit ${subUnitIndex}:`,
                    subUnitError
                  );
                  return subUnit; // Return original if error occurs
                }
              });

              return cleanedUnit;
            } catch (unitError) {
              console.error(
                `Error processing unit at Property ${propertyIndex}, Unit ${unitIndex}:`,
                unitError
              );
              return unit; // Return original if error occurs
            }
          }
        );

        return cleanedProperty;
      } catch (propertyError) {
        console.error(
          `Error processing property at index ${propertyIndex}:`,
          propertyError
        );
        return property; // Return original if error occurs
      }
    });
  }
}

module.exports = { ApartmentListScraper };
