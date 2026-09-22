/**
 * Node.js CSV => PDF Card Generator version 2.0
 * copyleft JerryLabs 2. 2. 2020
 */

const parse = require('csv-parse/lib/sync');
const fs = require('fs');

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

const generateHtml = (cardsData, css, generateCardMarkup, extraParams) => {
  let cardsMarkups = cardsData.map((cardData, i) => generateCardMarkup(cardData, i, extraParams));
  return `<!DOCTYPE html>
  <html>
    <head>
      <style type="text/css">
        ${css}
      </style>
    </head>
    <body>
      <div id="pageborder"></div>
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
    if (process.argv.includes('input')) {
      const cardsIndex = process.argv.indexOf('input');
      if (process.argv.length < cardsIndex + 1) {
        printInstructions();
        return;
      } else {
        csvFile = `${process.argv[2]}/${process.argv[cardsIndex + 1]}.csv`;
      }
    }
    let customOutputName = null;
    // check for custom output file name
    if (process.argv.includes('output')) {
      const fileIndex = process.argv.indexOf('output');
      if (process.argv.length < fileIndex + 1) {
        printInstructions();
        return;
      } else {
        customOutputName = process.argv[fileIndex + 1];
      }
    }
    const cssFile = `${process.argv[2]}/style.css`;
    const csvData = fs.readFileSync(csvFile, 'utf8');
    const cssData = fs.readFileSync(cssFile, 'utf8');
    let cardsData = csvToObject(csvData);

    const customCardPath = `./${process.argv[2]}/card.js`;
    const generateCardMarkup = fs.existsSync(customCardPath) ? require(customCardPath) : generateDefaultCardMarkup;

    const htmlData = generateHtml(cardsData, cssData, generateCardMarkup, process.argv.slice(3));

    // Checking output HTML in console
    if (process.argv.includes('log')) {
      console.log(htmlData);
    }


    // Create HTML file
    fs.writeFileSync(`${process.argv[2]}/${customOutputName || process.argv[2]}.html`, htmlData, function(err) {
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
