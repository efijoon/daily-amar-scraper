
async function getData(page) {
    const shakhesKol = await page.evaluate(async () => {
        let tds = document.querySelectorAll(
          "div > div.box1.blue.tbl.z1_4.h210 > div.content > table tr td"
        );
        return tds[3].childNodes[0].data;
    });

    const shakhesHamVazn = await page.evaluate(async () => {
        let tds = document.querySelectorAll(
            "div > div.box1.blue.tbl.z1_4.h210 > div.content > table tr td"
        );
        return tds[5].childNodes[0].data;
    });

    const arzeshBazarBourse = await page.evaluate(async () => {
        let tds = document.querySelectorAll(
            "div > div.box1.blue.tbl.z1_4.h210 > div.content > table tr td"
        );
        return tds[7].childNodes[0].getAttribute("title");
    });

    const arzeshMoamelatBourse = await page.evaluate(async () => {
        let tds = document.querySelectorAll(
            "div > div.box1.blue.tbl.z1_4.h210 > div.content > table tr td"
        );
        console.log(tds);
        return tds[13].childNodes[0].getAttribute("title");
    });

    const hajmMoamelatBourse = await page.evaluate(async () => {
        let tds = document.querySelectorAll(
            "div > div.box1.blue.tbl.z1_4.h210 > div.content > table tr td"
        );
        return tds[15].childNodes[0].getAttribute("title");
    });

    const arzeshBazarFaraBourse = await page.evaluate(async () => {
        let tables = document.querySelectorAll(
            "div > div.box1.blue.tbl.z1_4.h210 > div.content > table"
        );
        return tables[1].children[0].children[2].children[1].children[0].getAttribute("title");
    });

    const arzeshMoamelatFaraBourse = await page.evaluate(async () => {
        let tables = document.querySelectorAll(
            "div > div.box1.blue.tbl.z1_4.h210 > div.content > table"
        );
        return tables[1].children[0].children[5].children[1].children[0].getAttribute("title");
    });

    const hajmMoamelatFaraBourse = await page.evaluate(async () => {
    let tables = document.querySelectorAll(
        "div > div.box1.blue.tbl.z1_4.h210 > div.content > table"
    );
    return tables[1].children[0].children[6].children[1].children[0].getAttribute("title");
    });
  
    let data = {
    shakheskolvalue: parseInt(numberWithOutCommas(shakhesKol)),
    arzeshkolbazar:
        parseInt(numberWithOutCommas(arzeshBazarBourse)) +
        parseInt(numberWithOutCommas(arzeshBazarFaraBourse)),
    arzeshMoamelat:
        parseInt(numberWithOutCommas(arzeshMoamelatBourse)) +
        parseInt(numberWithOutCommas(arzeshMoamelatFaraBourse)),
    hajmMoamelat:
        parseInt(numberWithOutCommas(hajmMoamelatBourse)) +
        parseInt(numberWithOutCommas(hajmMoamelatFaraBourse)),
    nesbatVazni:
        parseInt(numberWithOutCommas(shakhesKol)) /
        parseInt(numberWithOutCommas(shakhesHamVazn)),
    };

    return data;
}

function numberWithOutCommas(number) {
    return number.toString().replace(/,/g, "");
}

module.exports = getData;