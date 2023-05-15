const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Wait until page has loaded

    await page.goto('https://www.instagram.com/360_brat/', {
        waitUntil: 'networkidle0',
    });

    // POP UP : DECLINER LES COOKIES
    const button = await page.$x("//button[contains(., 'Decline optional cookies')]");
    if (button.length > 0) {
        await button[0].click();
    } else {
        throw new Error("Le bouton n'a pas été trouvé");
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
    const bodyText = await page.evaluate(() => {
        return Array.from(document.getElementsByTagName('button'))[6]
    });

    const connectButton = bodyText
    console.log(connectButton.outerHTML)
    if (connectButton.length > 0) {
        await connectButton[0].click();
    } else {
        throw new Error("Le bouton n'a pas été trouvé");

    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Wait for log in form

    await Promise.all([
        page.waitForSelector('[name="username"]'),
        page.waitForSelector('[name="password"]'),
        page.waitForSelector('[name="submit"]'),
    ]);

    // Enter username and password

    await page.type('[name="username"]', 'username');
    await page.type('[name="password"]', 'password');

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