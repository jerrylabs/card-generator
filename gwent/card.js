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
        <div class="hero"></div>
        <div class="power temeria"></div>
        <div class="background"></div>
        <div class="title">${commanderTitle}

        <div class="subtitle">${commanderSubtitle}</div></div>
        <hr>
        <div class="effect"><div>${effect.replace(/\[/g, '<span class="effect__icon ').replace(/\]/g, '"></span>')}</div></div>
        <hr class="second">
        <div class="flavor">${flavor}</div>
      </div>`
    )
  }

  return (
    `<div class="card ${faction} ${className.replace('hero', '')}" style="background-image: url('http://localhost:8080/cards/${title}.${imageType}');">
      ${className.includes('hero') ? '<div class="hero"></div>' : ''}
      <div class="background"></div>
      ${!!type ? `<div class="type">
        <img src="http://localhost:8080/img/icon-${type}.png" />
      </div>` : ``}
      ${!!effect ? `<div class="effect">
        <img src="http://localhost:8080/img/icon-${effect}.png" />
      </div>` : ``}
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
