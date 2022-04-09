const fs = require('fs');

module.exports = (cardData) => {

  const {title, power, faction, type, effect, flavor, className} = cardData;

  const imageType = fs.existsSync(`./${process.argv[2]}/cards/${title}.jpg`) ? 'jpg' : 'webp';
  const isCommander = title.includes('--');
  const displayTitle = title.replace(/ [1234]/, '');

  if (isCommander) {
    const [commanderTitle, commanderSubtitle] = displayTitle.split('--');
    return (
      `<div class="card ${faction} commander" style="background-image: url('http://localhost:8080/cards/${title}.${imageType}');">
        <div class="power temeria"></div>
        <div class="background"></div>
        <div class="title">${commanderTitle}

        <div class="subtitle">${commanderSubtitle}</div></div>
        <hr>
        <div class="effect">${effect}</div>
        <hr class="second">
        <div class="flavor">${flavor}</div>
      </div>`
    )
  }

  return (
    `<div class="card ${faction} ${isCommander ? 'commander' : ''} ${className}" style="background-image: url('http://localhost:8080/cards/${title}.${imageType}');">
      <div class="background"></div>
      ${parseInt(power) == power
        ? `<div class="power">${power}</div>`
        : `<div class="power ${power}"></div>`
      }
      <div class="title">${displayTitle}</div>
      <hr>
      <div class="flavor">${flavor}</div>
    </div>`
  )
}