const express = require("express");
const puppeteer = require("puppeteer");
const momentJalaali = require("moment-jalaali");
const setDailyDataInMosaddeghian = require("./setDailyDataInMosaddeghian");
const getData = require("./getData");
const setWeeklyDataInMosaddeghian = require("./setWeeklyDataInMosaddeghian");
const setMonthlyDataInMosaddeghian = require("./setMonthlyDataInMosaddeghian");
const app = express();
// This variable is for changing the monthly data
let weekCounter = 2;

app.get("/", (req, res) => {
  res.send("This is a daily application babe ...");
});

setInterval(async () => {
  momentJalaali.loadPersian({ dialect: "persian-modern" });

  let today = {
    name: momentJalaali().format("dddd"),
    date: momentJalaali().format("jYYYY/jMM/jDD"),
  };

  console.log(`Entered: ${today.date}`);

  if (today.name !== "پنج‌شنبه" && today.name !== "جمعه") {
    const browser = await puppeteer.launch({
      headless: true,
      waitUntil: "domcontentloaded",
      args: ["--no-sandbox"],
    });

    try {
      console.log("Enter ...");

      const page = await browser.newPage();
      await page.goto("http://tsetmc.com/Loader.aspx?ParTree=15");

      const data = await getData(page);

      // Login is going to happen in setDailyDataInMosaddeghian
      await setDailyDataInMosaddeghian(page, data, today);
      if (today.name == "چهارشنبه") {
        weekCounter++;
        await setWeeklyDataInMosaddeghian(page);
      }

      if (weekCounter == 4) {
        weekCounter = 0;
        await setMonthlyDataInMosaddeghian(page);
      }

      console.log(`Done: ${today.date}`);

      await browser.close();
    } catch (e) {
      if (e instanceof puppeteer.errors.TimeoutError) {
        console.log(e);
        await browser.close();
      }
    }
  }
}, 86400000);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port Whatever or 5000");
});
