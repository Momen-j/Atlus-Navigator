/*
const puppeteer = require("puppeteer");
const json2csv = require("json2csv").parse;
const fs = require("fs");
const path = require("path");

async function scrapeData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto("https://aqiu384.github.io/megaten-fusion-tool/p3e/shadows", {
    waitUntil: "networkidle2", // Ensures page is fully loaded with js-rendered content
  });

  // Extract table data using Puppeteer since site renders table using JS, not HTML
  //! REVIEW ENTIRE FUNCTION BELOW ESCPECIALLY EVALUATE AND QUERY SELECTOR ALL TABLE TR & TD
  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("table tr"));
    return rows.slice(5).map((row) => {
      // Skipping the first 5 rows on site page
      const columns = row.querySelectorAll("td");
      // grab columns needed to add to DB
      return {
        race: columns[0]?.innerText.trim() || "",
        level: parseInt(columns[1]?.innerText.trim(), 10) || 0,
        name: columns[2]?.innerText.trim() || "",
        hp: parseInt(columns[3]?.innerText.trim(), 10) || 0,
        mp: parseInt(columns[4]?.innerText.trim(), 10) || 0,
        sword: columns[5]?.innerText.trim() || "",
        strike: columns[6]?.innerText.trim() || "",
        gun: columns[7]?.innerText.trim() || "",
        fire: columns[8]?.innerText.trim() || "",
        ice: columns[9]?.innerText.trim() || "",
        elec: columns[10]?.innerText.trim() || "",
        wind: columns[11]?.innerText.trim() || "",
        light: columns[12]?.innerText.trim() || "",
        dark: columns[13]?.innerText.trim() || "",
        almighty: columns[14]?.innerText.trim() || "",
        drops: columns[15]?.innerText.trim() || "",
        appears: columns[16]?.innerText.trim() || "",
      };
    });
  });

  await browser.close();
  return data;
}

async function main() {
  const data = await scrapeData();

  if (data.length === 0) {
    console.log("No data extracted. Exiting...");
    return;
  }

  // convert JSON data to csv format
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.resolve(__dirname, `P3Rdata-${timestamp}.csv`);
    const csv = json2csv(data);
    fs.writeFileSync(filePath, csv);

    console.log(`Data written to ${filePath}`);
  } catch (error) {
    console.error("Error converting to CSV:", error);
  }
}

main();
*/