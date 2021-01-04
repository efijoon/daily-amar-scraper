
async function getData(page) {

    await page.goto('https://www.mosaddeghian.com/wp-admin/admin.php?page=tablepress&action=edit&table_id=5');

    const data = await page.evaluate(async () => {
        const tableBody = Array.from(document.querySelectorAll('#edit-form-body tr'));

        let data = {};
        let jameeHajm = 0;
        let jameeArzeshB = 0;
        let jameeArzeshM = 0;

        // Default setting is 1 & 6
        for(let i = 1; i < 5; i++) {

            jameeHajm += Math.ceil(parseInt(numberWithOutCommas(tableBody[i].childNodes[4].childNodes[1].innerHTML)));
            jameeArzeshB += parseInt(numberWithOutCommas(tableBody[i].childNodes[8].childNodes[1].innerHTML));
            jameeArzeshM += parseInt(numberWithOutCommas(tableBody[i].childNodes[6].childNodes[1].innerHTML));

            if(i == 4) {
                data = {
                    jameeHajm,
                    jameeArzeshB,
                    jameeArzeshM,
                }

                jameeHajm = 0;
                jameeArzeshB = 0;
                jameeArzeshM = 0;
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

