const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage();
  const response = await page.goto(
    "https://keyboard-racing.com/typing-games.html"
  );
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );

  await Promise.all([
    page.evaluate(() => {
      let elements = document.getElementsByClassName("action-game-create");
      for (let element of elements) element.click();
    }),
    page.evaluate(() => {
      let target = document.getElementsByTagName("input")[55];
    })
  ]);

  // console.log(
  // await page.evaluate(() => {
  //   let inputs = document.getElementsByTagName("input");
  //   for (let input of inputs) console.log("INPUT", input.value);
  // })
  // );

  // page.waitForTimeout(3000).then(() => console.log("Waited a second!"));
  // page.waitForNavigation();
  // await page.screenshot({ path: "racer.png", fullPage: true });

  await browser.close();
})();
