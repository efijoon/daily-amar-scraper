
const takeWeeklyDataFromRoozaneTable = require("./takeWeeklyDataFromRoozaneTable");

async function updateWeeklyData(page) {

  const data = await takeWeeklyDataFromRoozaneTable(page);

  await page.goto(
    "https://www.mosaddeghian.com/wp-admin/admin.php?page=tablepress&action=edit&table_id=5"
  );
  
  const previouseWeekData = await page.evaluate(async () => {
    const tableBody = Array.from(document.querySelectorAll('#edit-form-body tr'));

    let oldData = {};
    let hajmMoamelat = 0;
    let arzeshMoamelat = 0;
    let arzeshkolbazar = 0;

    hajmMoamelat = Math.ceil(parseInt(numberWithOutCommas(tableBody[1].childNodes[4].childNodes[1].innerHTML)));
    arzeshMoamelat = parseInt(numberWithOutCommas(tableBody[1].childNodes[6].childNodes[1].innerHTML));
    arzeshkolbazar = parseInt(numberWithOutCommas(tableBody[1].childNodes[8].childNodes[1].innerHTML));

    return oldData = {
      hajmMoamelat,
      arzeshMoamelat,
      arzeshkolbazar
    }

    function numberWithOutCommas(number) {
      return number.toString().replace(/,/g, "");
    }
  });

  // data variable is the data of this week
  let weeklyHajmPercent = (-100 + (data.jameeHajm * 100 / previouseWeekData.hajmMoamelat)).toFixed(2);
  let weeklyArzeshBPercent = (-100 + (data.jameeArzeshB * 100 / previouseWeekData.arzeshkolbazar)).toFixed(2);
  let weeklyArzeshMPercent = (-100 + (data.jameeArzeshM * 100 / previouseWeekData.arzeshMoamelat)).toFixed(2);

  await page.evaluate(async () => {
    let checkBox = document.getElementsByClassName('hide-if-no-js')[20];
    await checkBox.click();
    const rowInserter = document.getElementById('rows-insert');
    rowInserter.click();
  });

  // This i is for looping throw each row columns
  let i = 2;

  await page.waitForSelector(`#cell-A${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(data.range);
  });

  await page.waitForSelector(`#cell-B${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(data.jameeHajm.toString());
  });

  await page.waitForSelector(`#cell-C${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(weeklyHajmPercent.toString());
  });

  await page.waitForSelector(`#cell-D${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(data.jameeArzeshM.toString());
  });

  await page.waitForSelector(`#cell-E${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(weeklyArzeshMPercent.toString());
  });

  await page.waitForSelector(`#cell-F${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(data.jameeArzeshB.toString());
  });

  await page.waitForSelector(`#cell-G${i}`).then(async (selector) => {
    await selector.click();
    await selector.type(weeklyArzeshBPercent.toString());
  });

  // For saving the insterted data in table
  await page
    .waitForXPath('//*[@id="postbox-container-2"]/p[2]/input[1]')
    .then((selector) => {
      selector.click();
  });

  await page.waitForTimeout(15000);
}

module.exports = updateWeeklyData;
