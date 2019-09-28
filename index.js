const parse = require('csv-parse/lib/sync')
const puppeteer = require('puppeteer')
const fs = require('fs')
const generateCmzcCard = require('./cmzc/card.js')

csvToObject = (data) => parse(data, {
  columns: true,
  skip_empty_lines: true
});

generateCardMarkup = cardData => {
  if (process.argv[2] == 'cmzc') {
    return generateCmzcCard(cardData);
  } else return `<div class="card"}"> ${
    Object.keys(cardData).map(cardProperty =>
      cardData[cardProperty]
      ? `<div class="${cardProperty}">${cardData[cardProperty]}</div>` // here condition for specific fields
      : ''
    ).join('')
  }</div>`
}

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
        cardsData.map(generateCardMarkup).join('')
      }</div>
    </body>
  </html>`;


(async function() {
  try {
    let csvFile = 'cards.csv';
    let cssFile = 'style.css';
    if (process.argv[2]) {
      csvFile = `${process.argv[2]}/${csvFile}`;
      cssFile = `${process.argv[2]}/${cssFile}`;
    }
    const csvData = fs.readFileSync(csvFile, 'utf8');
    const cssData = fs.readFileSync(cssFile, 'utf8');
    const cardsData = csvToObject(csvData);
    const htmlData = generateHtml(cardsData, cssData);
// console.log(htmlData); // kontrolni vypis HTML
fs.writeFile("myhtml.html", htmlData, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The HTML file was saved 👍");
});


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlData);
    // await page.evaluateHandle('document.fonts.ready');
    // await page.emulateMedia('screen');
    await page.emulateMedia('print');
    await page.content();
    await page.pdf({
      path: 'mypdf.pdf',
      format: 'A4',
      printBackground: true,
      landscape: true
    });

    console.log('PDF generated 👍');
    await browser.close();
    process.exit();

  } catch (e) {
    console.log('you made an error: ', e);
  }
})();


