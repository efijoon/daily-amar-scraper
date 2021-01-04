
async function updateData(page, data, today) {

  await page.goto("https://www.mosaddeghian.com/my-account/");

    page.waitForSelector('#username')
    .then(async selector => {
        await selector.click();
        await selector.type('erfanpoorsina@gmail.com', { delay: 50 });
    });

    await page.waitForTimeout(3000);

    page.waitForSelector('#password')
    .then(async selector => {
        await selector.click();
        await selector.type('CppRockes99', { delay: 50 });
    });

    await page.waitForTimeout(3000);

    page.waitForXPath('//*[@id="content"]/div/div/div/div/div[2]/div/form/p[3]/button')
    .then(selector => {
        selector.click();
    });
    
    await page.waitForTimeout(10000);

    await page.goto('https://www.mosaddeghian.com/wp-admin/admin.php?page=tablepress&action=edit&table_id=6');

    // Format the data in a proper format
    let hajmMoamelat = `${(data.hajmMoamelat / 1000000000).toFixed(2)}`;
    let arzeshMoamelat = `${numberWithCommas(Math.round(data.arzeshMoamelat / 1000000000))}`;
    let arzeshkolbazar = `${numberWithCommas(Math.round(data.arzeshkolbazar / 1000000000))}`;
    let date = today.date;

    await page.evaluate(async () => {
        let checkBox = document.getElementsByClassName('hide-if-no-js')[16];
        await checkBox.click();
        const rowInserter = document.getElementById('rows-insert');
        rowInserter.click();
    });

    // Insert data
    await page.waitForSelector(`#cell-A2`)
        .then(async selector => {
            await selector.click();
            await selector.type(date);
        });

    await page.waitForSelector(`#cell-B2`)
        .then(async selector => {
            await selector.click();
            await selector.type(today.name);
        });

    await page.waitForSelector(`#cell-C2`)
        .then(async selector => {
            await selector.click();
            await selector.type(hajmMoamelat);
        });

    await page.waitForSelector(`#cell-D2`)
        .then(async selector => {
            await selector.click();
            await selector.type(arzeshkolbazar);
        });

    await page.waitForSelector(`#cell-E2`)
        .then(async selector => {
            await selector.click();
            await selector.type(arzeshMoamelat);
        });

    // For saving the insterted data in table
    await page.waitForXPath('//*[@id="postbox-container-2"]/p[2]/input[1]')
    .then(selector => {
        selector.click();
    });

    await page.waitForTimeout(15000);
}

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = updateData;