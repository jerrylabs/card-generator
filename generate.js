/**
 * Node.js CSV => PDF Card Generator version 2.0
 * copyleft JerryLabs 2. 2. 2020
 */

const parse = require('csv-parse/lib/sync');
const puppeteer = require('puppeteer');
const fs = require('fs');
const httpServer = require('http-server');

const printInstructions = () => {
   const instructions = fs.readFileSync('README.md', 'utf8');
   console.log(instructions);
}

const csvToObject = (data) => parse(data, {
  columns: true,
  skip_empty_lines: true
});

const generateDefaultCardMarkup = cardData => (
  `<div class="card"> ${
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

/* Beginning of the Card Generator script */
(async function() {
  try {

    // missing required parameter => display help
    if (!process.argv[2]) {
      printInstructions();
      return;
    }

    // default input file
    let csvFile = `${process.argv[2]}/cards.csv`;

    // check for custom input file name
    if (process.argv.includes('cards')) {
      const cardsIndex = process.argv.indexOf('cards');
      if (process.argv.length < cardsIndex + 1) {
        printInstructions();
        return;
      } else {
        csvFile = `${process.argv[2]}/${process.argv[cardsIndex + 1]}`;
      }
    }
    const cssFile = `${process.argv[2]}/style.css`;
    const backgrounds = parseInt(process.argv[process.argv.indexOf('backgrounds') + 1]);
    const csvData = fs.readFileSync(csvFile, 'utf8');
    const cssData = fs.readFileSync(cssFile, 'utf8');
    const cardsData = csvToObject(csvData);

    const customCardPath = `./${process.argv[2]}/card.js`;
    const generateCardMarkup = fs.existsSync(customCardPath) ? require(customCardPath) : generateDefaultCardMarkup;

    const htmlData = generateHtml(cardsData, backgrounds, cssData, generateCardMarkup);

    // Checking output HTML in console
    if (process.argv.includes('log')) {
      console.log(htmlData);
    }

    // Create HTML file
    fs.writeFileSync(`${process.argv[2]}.html`, htmlData, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The HTML file was saved");
    });

    process.exit();

  } catch (e) {
    console.log('Ooops! You made an error: ', e);
  }
})();
