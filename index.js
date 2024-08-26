import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
import {
  allLocation,
  allVariantsCSS,
  cardLink,
  descriptionCSS,
  filterCSS,
  nextPage,
  productCards,
  productDetailCSS,
  productImgCSS,
  productNameCSS,
  selectLocation,
  show100CSS,
  totalProductsCSS,
  viewMoreButtonCSS,
} from "./utils/cssSelector.js";
import { BASE_URL } from "./utils/constants.js";

// Initialize the CSV writer with the specified columns

let csvWriter;
let count;
async function scrape() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    protocolTimeout: 600000,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"',
    ],
  });
  const page = await browser.newPage();
  console.log("Browser launched and new page opened.");
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.resourceType() === "image") {
      request.abort();
    } else {
      request.continue();
    }
  });

  const cookiesPath = path.resolve("cookies.json");

  if (fs.existsSync(cookiesPath)) {
    console.log("Loading cookies from file...");
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf8"));
    await page.setCookie(...cookies);
    console.log("Cookies loaded from file.");
  } else {
    console.log("No cookies file found, starting without cookies.");
  }

  console.log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 600000 });
  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  });

  const getCookies = await page.cookies();
  fs.writeFileSync("cookies.json", JSON.stringify(getCookies, null, 2));
  console.log("Cookies saved to file.");

  let allLocationElement;
  try {
    console.log("Waiting for location selector...");
    await page.waitForSelector(selectLocation);
    console.log("Clicking on location selector...");
    await page.click(selectLocation);
    allLocationElement = await page.$$(allLocation);
    console.log("Locations found.");
  } catch (err) {
    console.error("Error waiting for location selector:", err.message);
  }

  // for (let i = 4; i < allLocationElement.length / 2; i++) {
  //change index for a state
  let i = 5;
  let stateName = "";
  count = 1;

  await new Promise((res, rej) => setTimeout(() => res(), 10000));

  try {
    await page.waitForSelector(filterCSS, { timeout: 5000 });
    await page.click(filterCSS);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
  } catch (err) {
    console.error("Error waiting for location selector:", err.message);
  }

  try {
    console.log("Waiting for location selector...");
    await page.waitForSelector(selectLocation);
    if (i != 0) {
      console.log("Clicking on location selector...");

      await page.click(selectLocation);
    }
    allLocationElement = await page.$$(allLocation);
    console.log(`Clicking on location ${i + 1}...`);
    await allLocationElement[i].click();
  } catch (err) {
    console.error("Error selecting location:", err.message);
  }

  try {
    stateName = await page.evaluate(
      (ele) => ele.innerText.trim(),
      allLocationElement[i]
    );
  } catch (err) {
    console.log(err.message);
  }
  if (!fs.existsSync(`${stateName}.csv`)) {
    csvWriter = createObjectCsvWriter({
      path: `${stateName}.csv`,
      header: [
        { id: "name", title: "name (Product Name)" },
        { id: "description", title: "description" },
        { id: "product_variants", title: "product_variants" },
        { id: "sku", title: "sku" },
        { id: "pack", title: "pack" },
        { id: "size", title: "size" },
        { id: "gtin", title: "gtin" },
        { id: "retail_price", title: "retail_price" },
        { id: "is_catch_weight", title: "is_catch_weight" },
        { id: "average_case_weight", title: "average_case_weight" },
        { id: "image_url", title: "image_url" },
        { id: "manufacturer_sku", title: "manufacturer_sku" },
        { id: "content_url", title: "content_url" },
        { id: "ordering_unit", title: "ordering_unit" },
        { id: "is_broken_case", title: "is_broken_case" },
        { id: "avg_case_weight", title: "avg_case_weight" },
        { id: "brand", title: "brand" },
        { id: "category", title: "category" },
        { id: "manufacturer_name", title: "manufacturer_name" },
        { id: "distributor_name", title: "distributor_name" },
        { id: "supplier_name", title: "supplier_name" },
        { id: "country_of_origin", title: "country_of_origin" },
      ],
    });
  } else {
    csvWriter = createObjectCsvWriter({
      path: `${stateName}.csv`,
      header: [
        { id: "name", title: "name (Product Name)" },
        { id: "description", title: "description" },
        { id: "product_variants", title: "product_variants" },
        { id: "sku", title: "sku" },
        { id: "pack", title: "pack" },
        { id: "size", title: "size" },
        { id: "gtin", title: "gtin" },
        { id: "retail_price", title: "retail_price" },
        { id: "is_catch_weight", title: "is_catch_weight" },
        { id: "average_case_weight", title: "average_case_weight" },
        { id: "image_url", title: "image_url" },
        { id: "manufacturer_sku", title: "manufacturer_sku" },
        { id: "content_url", title: "content_url" },
        { id: "ordering_unit", title: "ordering_unit" },
        { id: "is_broken_case", title: "is_broken_case" },
        { id: "avg_case_weight", title: "avg_case_weight" },
        { id: "brand", title: "brand" },
        { id: "category", title: "category" },
        { id: "manufacturer_name", title: "manufacturer_name" },
        { id: "distributor_name", title: "distributor_name" },
        { id: "supplier_name", title: "supplier_name" },
        { id: "country_of_origin", title: "country_of_origin" },
      ],
      append: true, // This option allows appending to the existing file
    });
  }
  let totalProducts;
  try {
    console.log("Waiting for total products selector...");
    await page.waitForSelector(totalProductsCSS);
    const productCardDetail = await page.$(totalProductsCSS);
    totalProducts = await page.evaluate(
      (element) => element.innerText,
      productCardDetail
    );
    console.log(`Total products found: ${totalProducts}`);
  } catch (err) {
    console.error("Error getting total products:", err.message);
  }

  for (let i = 0; i < Math.ceil(Number(totalProducts) / 100); i++) {
    let cards;
    let cardLinks;

    try {
      console.log("Waiting before scraping product cards...");
      await new Promise((res) => setTimeout(res, 5000));
      console.log("Waiting for product cards...");
      await page.waitForSelector(productCards);
      cards = await page.$$(productCards);
      console.log("Product cards found.");
    } catch (err) {
      console.error("Error finding product cards:", err.message);
      continue;
    }

    try {
      console.log("Waiting for card links...");
      await page.waitForSelector(cardLink);
      cardLinks = await page.$$(cardLink);
      console.log("Card links found.");
    } catch (err) {
      console.error("Error finding card links:", err.message);
      continue;
    }

    for (let i = 0; i < cards.length; i++) {
      count++;
      try {
        console.log("Waiting before scraping product cards...");
        await new Promise((res) => setTimeout(res, 5000));
        console.log("Waiting for product cards...");
        await page.waitForSelector(productCards);
        cards = await page.$$(productCards);
        console.log("Product cards found.");
      } catch (err) {
        console.error("Error finding product cards:", err.message);
        continue;
      }

      try {
        console.log("Waiting for card links...");
        await page.waitForSelector(cardLink);
        cardLinks = await page.$$(cardLink);
        console.log("Card links found.");
      } catch (err) {
        console.error("Error finding card links:", err.message);
        continue;
      }

      let product = {
        name: "",
        description: "",
        product_variants: "",
        sku: "",
        pack: "",
        size: "",
        gtin: "",
        retail_price: "",
        is_catch_weight: "",
        average_case_weight: "",
        image_url: "",
        manufacturer_sku: "",
        content_url: "",
        ordering_unit: "",
        is_broken_case: "",
        avg_case_weight: "",
        brand: "",
        category: "",
        manufacturer_name: "",
        distributor_name: "",
        supplier_name: "",
        country_of_origin: "",
      };
      let newPage;

      try {
        console.log(`Getting link for product ${i + 1}...`);
        let link = await page.evaluate((el) => el.href, cardLinks[i]);
        product.content_url = link; // Saving the link as content_url
        console.log(`Opening link: ${link}`);
        newPage = await browser.newPage();
        await newPage.setRequestInterception(true);
        newPage.on("request", (request) => {
          if (request.resourceType() === "image") {
            request.abort();
          } else {
            request.continue();
          }
        });

        await newPage.goto(link, {
          waitUntil: "networkidle2",
          timeout: 600000,
        });

        await newPage.setViewport({
          width: 1280,
          height: 800,
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false,
          isLandscape: false,
        });
        console.log("Product page opened.");
      } catch (err) {
        console.error("Error opening product page:", err.message);
        continue;
      }

      try {
        console.log("Waiting for view more buttons...");
        await newPage.waitForSelector(viewMoreButtonCSS);
        let viewMoreElement = await newPage.$$(viewMoreButtonCSS);
        console.log(`Found ${viewMoreElement.length} view more buttons.`);
        for (let viewMore of viewMoreElement) {
          await viewMore.click();
          console.log("Clicked view more button.");
          await new Promise((res) => setTimeout(res, 2000));
        }
      } catch (err) {
        console.error("Error handling view more buttons:", err.message);
        continue;
      }

      try {
        console.log("Waiting for product name...");
        await newPage.waitForSelector(productNameCSS);
        const productNameElement = await newPage.$(productNameCSS);
        const productName = await newPage.evaluate(
          (el) => el.innerText,
          productNameElement
        );
        product.name = productName; // Saving the product name
        console.log(`Product name: ${productName}`);
      } catch (err) {
        console.error("Error getting product name:", err.message);
        await newPage.close();
        continue;
      }

      try {
        console.log("Waiting for description...");
        await newPage.waitForSelector(descriptionCSS);
        const descriptionElement = await newPage.$(descriptionCSS);
        const description = await newPage.evaluate(
          (el) => el.innerText,
          descriptionElement
        );
        product.description = description; // Saving the description
        console.log(`Description: ${description}`);
      } catch (err) {
        console.error("Error getting description:", err.message);
        await newPage.close();
        continue;
      }

      try {
        console.log("Waiting for variants...");
        let variants = [];
        await newPage.waitForSelector(allVariantsCSS);
        const allVariantElement = await newPage.$$(allVariantsCSS);
        variants = await Promise.all(
          allVariantElement.map(async (link) => {
            return await newPage.evaluate(
              (el) =>
                el.innerText
                  .split("\n")
                  .map((ele) => ele.trim())
                  .filter((ele) => ele.length >= 1),
              link
            );
          })
        );
        product.product_variants = JSON.stringify(
          segregateProductVariants(variants)
        ); // Saving the variants as a comma-separated string
        console.log(`Variants: ${product.product_variants}`);
      } catch (err) {
        console.error("Error getting variants:", err.message);
        await newPage.close();
        continue;
      }

      try {
        console.log("Waiting for product images...");
        await newPage.waitForSelector(productImgCSS);
        const productImageElement = await newPage.$$(productImgCSS);
        let productImages = await Promise.all(
          productImageElement.map(async (link) => {
            return await newPage.evaluate((el) => el.src, link);
          })
        );
        product.image_url = productImages.filter(
          (ele) => ele.trim().length > 4
        ); // Saving images as a comma-separated string
        console.log(`Images: ${product.image_url}`);
      } catch (err) {
        console.error("Error getting product images:", err.message);
        await newPage.close();
        continue;
      }

      try {
        console.log("Waiting for product details...");
        await newPage.waitForSelector(productDetailCSS);
        const productDetailElement = await newPage.$(productDetailCSS);
        const productDetail = await newPage.evaluate(
          (ele) => ele.innerText.split("\n\n"),
          productDetailElement
        );
        productDetail.pop();
        // Here, you can extract specific details like SKU, pack, etc., based on how they are presented
        // Example:
        const mappedProductDetails = mapProductDetails(productDetail);

        Object.assign(product, mappedProductDetails);
        // Assign pack from productDetail if available
        // Continue this for other fields as necessary
        console.log("Product details extracted.");
      } catch (err) {
        console.error("Error getting product details:", err.message);
        await newPage.close();
        continue;
      }

      try {
        console.log("Writing product data to CSV...");
        await csvWriter.writeRecords([product]);
        console.log("Product data written to CSV.");
      } catch (err) {
        console.error("Error writing to CSV:", err.message);
      }

      await newPage.close();
    }

    try {
      console.log("Waiting for next page button...");
      await page.waitForSelector(nextPage);
      console.log("Clicking next page button...");
      await page.click(nextPage);
    } catch (err) {
      console.error("Error navigating to next page:", err.message);
      break; // Exit the loop if there's an error navigating to the next page
    }
  }
  // }

  console.log("Closing browser...");
  await browser.close();
  console.log("Browser closed.");
}

scrape();

function mapProductDetails(productDetail) {
  const product = {};

  // Iterate through the array, using even indices as keys and odd indices as values
  for (let i = 0; i < productDetail.length; i += 2) {
    const key = productDetail[i].toLowerCase().replace(/\s+/g, "_"); // Convert key to lowercase and replace spaces with underscores
    const value = productDetail[i + 1];

    // Map the extracted key-value pairs to specific product properties
    switch (key) {
      case "supplier":
        product.supplier_name = value;
        break;
      case "producer":
        product.manufacturer_name = value;
        break;
      case "region":
        product.region = value;
        break;
      case "country_of_origin":
        product.country_of_origin = value;
        break;
      case "bpc":
        product.pack = value;
        break;
      case "size":
        product.size = value;
        break;
      case "alcohol_proof":
        product.alcohol_proof = value;
        break;
      case "sub-type":
        product.category = value;
        break;
      default:
        console.log(`Unmapped key: ${key}, value: ${value}`);
    }
  }

  return product;
}

function segregateProductVariants(variantsArray) {
  return variantsArray.map((variant) => {
    const variantObject = {};
    for (let i = 0; i < variant.length; i += 2) {
      const key = variant[i]
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/:/g, ""); // Normalize key
      const value = variant[i + 1];
      variantObject[key] = value;
    }
    return variantObject;
  });
}
