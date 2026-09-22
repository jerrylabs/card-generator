const fs = require('fs');

module.exports = (cardData) => {

  const {title, power, faction, type, effect, flavor, className} = cardData;
  const imgFile = title.replace(':', ' -').replace('<br>', ' ');
  const imageType = fs.existsSync(`./${process.argv[2]}/cards/${imgFile}.jpg`) ? 'jpg' : 'webp';
  const imgTitle = imgFile.replace('\'', '\\\'');
  const isCommander = title.includes('--');
  const isHero = className.includes('hero');
  const displayTitle = title.replace(/ [1234567]/, '');

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

  const effects = effect && effect.split(' ');

  return (
    `<div class="card ${faction} ${className.replace('hero', '')} ${effects.length > 1 ? `effects${effects.length}` : ''}" style="background-image: url('http://localhost:8080/cards/${imgTitle}.${imageType}');">
      ${isHero ? '<div class="hero"></div><div class="heroLabel">&nbsp;Hrdina</div>' : ''}
      <div class="background"></div>
      ${!!type ? `<div class="type">
        <img src="http://localhost:8080/img/icon-${type}.png" />
      </div>` : ``}
      ${effects.length ? effects.map((e) => `<div class="effect">
        <img src="http://localhost:8080/img/icon-${e}.png" />
      </div>`).join('') : ``}
      ${parseInt(power) == power
        ? `<div class="power">${power}</div>`
        : `<div class="power ${power}"></div>`
      }
      <div class="power shadow"></div>
      <div class="title">${displayTitle}</div>
      <hr>
      <div class="flavor">${flavor}</div>
    </div>`
  )
}
