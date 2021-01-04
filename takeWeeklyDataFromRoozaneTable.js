
async function getData(page) {
    await page.goto('https://www.mosaddeghian.com/wp-admin/admin.php?page=tablepress&action=edit&table_id=6');

    const data = await page.evaluate(async () => {
        const tableBody = Array.from(document.querySelectorAll('#edit-form-body tr'));

        let data = {};
        let jameeHajm = 0;
        let jameeArzeshB = 0;
        let jameeArzeshM = 0;
        let range = [];

        // Default setting is 1 & 6
        for(let i = 1; i < 6; i++) {

            jameeHajm += Math.ceil(parseInt(numberWithOutCommas(tableBody[i].childNodes[5].childNodes[1].innerHTML)));
            jameeArzeshB += parseInt(numberWithOutCommas(tableBody[i].childNodes[6].childNodes[1].innerHTML));
            jameeArzeshM += parseInt(numberWithOutCommas(tableBody[i].childNodes[7].childNodes[1].innerHTML));

            if(i == 1 || i == 5) range.push(tableBody[i].childNodes[3].childNodes[1].innerHTML);

            if(i == 5) {
                data = {
                    jameeHajm,
                    jameeArzeshB,
                    jameeArzeshM,
                    range: `${range[0]} - ${range[1]}`
                }

                jameeHajm = 0;
                jameeArzeshB = 0;
                jameeArzeshM = 0;
                range = [];
            }
        }

        return data;

        function numberWithOutCommas(number) {
            return number.toString().replace(/,/g, "");
        }
    });

    return data;
}

module.exports = getData;

