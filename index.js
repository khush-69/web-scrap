const { load } = require("cheerio");
const { writeFile, readFile } = require('fs/promises')
const { default: puppeteer } = require("puppeteer");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1368,
      height: 1000,
    },
  });
  const page = await browser.newPage();
  await page.goto("https://www.flipkart.com");
  await page.click("body > div._2Sn47c > div > div > button");
  await page.type(
    'input[title="Search for products, brands and more"]',
    "tshirts"
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);
  const products = []
  const $ = load(await page.content())  


  $("._1xHGtK._373qXS").each((_, el) => {
    
    products.push({
        name: $('div > div > div._2WkVRV',el).text(),
        price:$('div > div > a._3bPFwb > div > div._30jeq3',el).text(),
       image:$('div > div > div > img._2r_T1I',el).attr("src")
      })
  })
  await writeFile('product.json', JSON.stringify(products))
  browser.close()
  
};
main();
