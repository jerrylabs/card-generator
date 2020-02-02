/**
 * Node.js CSV => PDF Card Generator version 2.0
 * copyleft JerryLabs 2. 2. 2020
 */

const parse = require('csv-parse/lib/sync');
const puppeteer = require('puppeteer');
const fs = require('fs');
const httpServer = require('http-server');
const generateCmzcCard = require('./cmzc/card');


const printInstructions = () => {
   const instructions = fs.readFileSync('README.md', 'utf8');
   console.log(instructions);
}

const csvToObject = (data) => parse(data, {
  columns: true,
  skip_empty_lines: true
});

const generateDefaultCardMarkup = cardData => (
  `<div class="card"}"> ${
    Object.keys(cardData).map(cardProperty =>
      cardData[cardProperty]
      ? `<div class="${cardProperty}">${cardData[cardProperty]}</div>` // here condition for specific fields
      : ''
    ).join('')
  }</div>`
);

const addBackSides = (cardsMarkups, bgInterval) => {
  let cardsMarkupsWithBacks = [];
  let count = 0;
  cardsMarkups.map((item, i) => {
    cardsMarkupsWithBacks.push(item);
    count++;
    if (count === bgInterval) {
      for (i = 0; i < bgInterval; i++) {
        cardsMarkupsWithBacks.push(`<div class="card background"></div>`);
      }
      count = 0;
    }
  });
  return cardsMarkupsWithBacks;
}

const generateHtml = (cardsData, backgrounds, css, generateCardMarkup) => {
  let cardsMarkups = cardsData.map(generateCardMarkup);
  if (backgrounds) {
    cardsMarkups = addBackSides(cardsMarkups, backgrounds);
  }
  return `<!DOCTYPE html>
  <html>
    <head>
      <style type="text/css">
        ${css}
      </style>
    </head>
    <body>
      <div class="cards">
        ${cardsMarkups.join('')}
      </div>
    </body>
  </html>`;
}

const savePdf = async (htmlData, settings ) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlData);
    // await page.evaluateHandle('document.fonts.ready');
    // await page.emulateMedia('screen');
    await page.emulateMedia('screen');
    await page.content();
    await page.pdf(settings);
    await browser.close();
    console.log('PDF generated 👍');
}

/* Beginning of the Card Generator script */
(async function() {
  try {
    if (!process.argv[2]) {
      printInstructions();
      return;
    }
    const csvFile = `${process.argv[2]}/cards.csv`;
    const cssFile = `${process.argv[2]}/style.css`;
    const backgrounds = parseInt(process.argv[process.argv.indexOf('backgrounds') + 1]);
    const csvData = fs.readFileSync(csvFile, 'utf8');
    const cssData = fs.readFileSync(cssFile, 'utf8');
    const cardsData = csvToObject(csvData);

    const customCardPath = `.${process.argv[2]}/card.js`;
    const generateCardMarkup = fs.existsSync(customCardPath) ? require(customCardPath) : generateDefaultCardMarkup;

    const htmlData = generateHtml(cardsData, backgrounds, cssData, generateCardMarkup);

    if (process.argv.includes('log')) {
      console.log(htmlData); // Checking HTML in console
    }

    if (process.argv.includes('html')) {
      console.log(htmlData);
      fs.writeFile("myhtml.html", htmlData, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The HTML file was saved 👍");
      });
    }
return;
    if (process.argv.includes('cmzc')) {
      const horizontalHtmlData = generateHtml(
        cardsData.filter(c => ['basic', 'bio', 'tech', 'voodoo'].includes(c.type)),
        includeBackSides,
        cssData
      );
      const verticalHtmlData = generateHtml(
        cardsData.filter(c => ['quest', 'animatron'].includes(c.type)),
        includeBackSides,
        cssData
      );
      await savePdf(horizontalHtmlData, {
        path: 'cmzc-horizontal.pdf',
        format: 'A4',
        printBackground: true,
        landscape: true,
        margin: {
            top: "9mm",
            right: "16.5mm",
            bottom: "9mm",
            left: "16.5mm"
        }
      });
      await savePdf(verticalHtmlData, {
        path: 'cmzc-vertical.pdf',
        format: 'A4',
        printBackground: true,
        landscape: false,
        margin: {
            right: "9mm",
            top: "16.5mm",
            left: "9mm",
            bottom: "16.5mm"
        }
      });
    } else {
      savePdf(htmlData, {
        path: 'mypdf.pdf',
        format: 'A4',
        printBackground: true
      });
    }

    process.exit();

  } catch (e) {
    console.log('Ooops! You made an error: ', e);
  }
})();


