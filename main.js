const puppeteer = require('puppeteer');
const fs = require('fs');

fs.readFile('login.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Une erreur est survenue lors de la lecture du fichier', err);
        return;
    }
    const lines = data.split('\n');
    const username = lines[0];
    const password = lines[1];


    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Wait until page has loaded
        await page.goto('https://www.instagram.com/360_brat/', {
            waitUntil: 'networkidle0',
        });

        // POP UP : DECLINE COOKIES
        const button = await page.$x("//button[contains(., 'Decline optional cookies')]");
        if (button.length > 0) {
            await button[0].click();
        } else {
            throw new Error("Le bouton n'a pas été trouvé");
        }

        // wait loading
        console.log("Waiting...")
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("Done !")

        await page.waitForSelector('button');

        // Click login button
        const buttons = await page.$$('button');
        if (buttons.length >= 7) {
            await buttons[6].click();
        } else {
            console.log('Il n\'y a pas assez de boutons sur la page');
        }

        console.log("Waiting...")
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("Done !")

        const bodyText = await page.evaluate(() => document.body.innerText);
        console.log(bodyText);

        await Promise.all([
            page.waitForSelector('[name="username"]'),
            page.waitForSelector('[name="password"]'),
            page.waitForSelector('[name="submit"]'),
        ]);

        // Enter username and password

        await page.type('[name="username"]', username);
        await page.type('[name="password"]', password);

        // Submit log in credentials and wait for navigation

        await Promise.all([
            page.click('[type="submit"]'),
            page.waitForNavigation({
                waitUntil: 'networkidle0',
            }),
        ]);

        // Download PDF

        await page.pdf({
            path: 'page.pdf',
            format: 'A4',
        });

        await browser.close();
    })();
});
