const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const generateCmzcCard = require('./cmzc/card');

const csvToObject = (data) => parse(data, {
  columns: true,
  skip_empty_lines: true
});

const generateCardMarkup = cardData => {
  if (process.argv[2] == 'cmzc' || process.argv[2] == 'test') {
    return generateCmzcCard(cardData);
  } else return `<div class="card"}"> ${
    Object.keys(cardData).map(cardProperty =>
      cardData[cardProperty]
      ? `<div class="${cardProperty}">${cardData[cardProperty]}</div>` // here condition for specific fields
      : ''
    ).join('')
  }</div>`
}

const addBackSides = (cardsMarkups) => {
  let cardsMarkupsWithBacks = [];
  let count = 0;
  cardsMarkups.map((item, i) => {
    cardsMarkupsWithBacks.push(item);
    count++;
    if ((item.includes('basic') || item.includes('bio') || item.includes('tech') || item.includes('voodoo')) && count == 18) {
      for (i = 0; i < 18; i++) {
        cardsMarkupsWithBacks.push(`<div class="card back-side${
          item.includes('Ruka') ? ' ruka' : ''
        }${
          item.includes('Noha') ? ' noha' : ''
        }"></div>`);
      }
      count = 0;
    } else if (item.includes('quest') && count == 9) {
      for (i = 0; i < 9; i++) {
        cardsMarkupsWithBacks.push('<div class="card quest back-side"></div>');
      }
      count = 0;
    }
    return item;
  });
  return cardsMarkupsWithBacks;
}

const generateHtml = (cardsData, includeBackSides, css) => {
  let cardsMarkups = cardsData.map(generateCardMarkup);
  if (includeBackSides) {
    cardsMarkups = addBackSides(cardsMarkups);
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

(async function() {
  try {
    let csvFile = 'cards.csv';
    let cssFile = 'style.css';
    if (process.argv[2]) {
      csvFile = `${process.argv[2]}/${csvFile}`;
      cssFile = `${process.argv[2]}/${cssFile}`;
    }
    let includeBackSides = false;
    if (process.argv.includes('ruby')) {
      includeBackSides = true;
    }
    const csvData = fs.readFileSync(csvFile, 'utf8');
    const cssData = fs.readFileSync(cssFile, 'utf8');
    const cardsData = csvToObject(csvData);
    const htmlData = generateHtml(cardsData, includeBackSides, cssData);

    if (process.argv.includes('log')) {
      console.log(htmlData); // kontrolni vypis HTML
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

    process.exit();

  } catch (e) {
    console.log('you made an error: ', e);
  }
})();


