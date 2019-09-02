const parse = require('csv-parse/lib/sync')
const puppeteer = require('puppeteer')
const fs = require('fs')

csvToObject = (data) => parse(data, {
  columns: true,
  skip_empty_lines: true
});

generateHtml = (cardsData, css) =>
  `<!DOCTYPE html>
  <html>
    <head>
      <style type="text/css">
        ${css}
      </style>
    </head>
    <body>
      <div class="cards"> ${
        cardsData.map(cardData =>
          `<div class="card ${cardData.typ || ''}"> ${
            Object.keys(cardData).map(cardProperty =>
              `<div class="${cardProperty}">${cardData[cardProperty]}</div>` // here condition for specific fields
            ).join('')
          }</div>`
        ).join('')
      }</div>
    </body>
  </html>`;


(async function() {
  try {
    const csvData = fs.readFileSync('sample.csv', 'utf8');
    const cssData = fs.readFileSync('style.css', 'utf8');
    const cardsData = csvToObject(csvData);
    const htmlData = generateHtml(cardsData, cssData);
console.log(htmlData);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlData);
    await page.emulateMedia('screen');
    await page.content();
    await page.pdf({
      path: 'mypdf.pdf',
      format: 'A4',
      printBackground: true,
      landscape: true
    });

    console.log('PDF generated');
    await browser.close();
    process.exit();

  } catch (e) {
    console.log('you made an error: ', e);
  }
})();


