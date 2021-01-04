const takeMonthlyDataFromWeeklyTable = require("./takeMonthlyDataFromWeeklyTable");

async function updateMonthlyData(page) {
  const data = await takeMonthlyDataFromWeeklyTable(page);

  await page.goto(
    "https://www.mosaddeghian.com/wp-admin/admin.php?page=tablepress&action=edit&table_id=4"
  );

  const previouseMonthData = await page.evaluate(async () => {
    const tableBody = Array.from(
      document.querySelectorAll("#edit-form-body tr")
    );

    let oldData = {};
    let hajmMoamelat = 0;
    let arzeshMoamelat = 0;
    let arzeshkolbazar = 0;
    let month = "";
    let year = "";

    hajmMoamelat = Math.ceil(
      parseInt(
        numberWithOutCommas(tableBody[1].childNodes[4].childNodes[1].innerHTML)
      )
    );
    arzeshMoamelat = parseInt(
      numberWithOutCommas(tableBody[1].childNodes[8].childNodes[1].innerHTML)
    );
    arzeshkolbazar = parseInt(
      numberWithOutCommas(tableBody[1].childNodes[6].childNodes[1].innerHTML)
    );

    month = tableBody[1].childNodes[3].childNodes[1].innerHTML.substr(-2);
    year = tableBody[1].childNodes[3].childNodes[1].innerHTML.substr(
      0,
      4
    );

    return (oldData = {
      hajmMoamelat,
      arzeshMoamelat,
      arzeshkolbazar,
      month: parseInt(month) + 1,
      year,
    });

    function numberWithOutCommas(number) {
      return number.toString().replace(/,/g, "");
    }
  });

  // data variable is the data of this week
  let monthlyHajmPercent = (
    -100 +
    (data.jameeHajm * 100) / previouseMonthData.hajmMoamelat
  ).toFixed(2);
  let monthlyArzeshBPercent = (
    -100 +
    (data.jameeArzeshB * 100) / previouseMonthData.arzeshkolbazar
  ).toFixed(2);
  let monthlyArzeshMPercent = (
    -100 +
    (data.jameeArzeshM * 100) / previouseMonthData.arzeshMoamelat
  ).toFixed(2);

  await page.evaluate(async () => {
    let checkBox = document.getElementsByClassName("hide-if-no-js")[20];
    await checkBox.click();
    const rowInserter = document.getElementById("rows-insert");
    await rowInserter.click();
  });

  // This i is for looping throw each row columns
  let i = 2;

  await page.waitForTimeout(2000);

  await page.waitForSelector(`#cell-A${i}`).then(async (selector) => {
    await selector.click();
    // This is for formatting the 1 length days like 9 in 1399/10/9
    await selector.type(
      previouseMonthData.month.toString().length == 1
        ? `${previouseMonthData.year}/0${previouseMonthData.month}`
        : `${previouseMonthData.year}/${previouseMonthData.month}`
    );
  });

  await page.waitForSelector(`#cell-B${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(data.jameeHajm.toString());
  });

  await page.waitForSelector(`#cell-C${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(monthlyHajmPercent.toString());
  });

  await page.waitForSelector(`#cell-D${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(data.jameeArzeshB.toString());
  });

  await page.waitForSelector(`#cell-E${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(monthlyArzeshBPercent.toString());
  });

  await page.waitForSelector(`#cell-F${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(data.jameeArzeshM.toString());
  });

  await page.waitForSelector(`#cell-G${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(monthlyArzeshMPercent.toString());
  });

  // For saving the insterted data in table
  await page
    .waitForXPath('//*[@id="postbox-container-2"]/p[2]/input[1]')
    .then((selector) => {
      selector.click();
    });

  await page.waitForTimeout(15000);
}

module.exports = updateMonthlyData;
