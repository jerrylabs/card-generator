module.exports = (cardData, i, extraParams) => {
  const czech = extraParams.includes('cs');
  const { cost, color, name, status, text, power, health, csname, cstext } = cardData;
  const longStatus = status.split(' ').length > 3;
  const displayedStatus = czech ? translateStatus(status, 'cs') : status;
  const longStatusParts = longStatus ? [
    displayedStatus.split(' ').slice(0, 2).join(' '),
    displayedStatus.split(' ').slice(-2).join(' ')
  ] : null;
  return `<div class="card">
      <div class="card__edge"></div>
      <div class="card__frame card__frame--${color}"></div>
      <div class="card__name">
        <svg viewBox="0 -2 30 8" xmlns="http://www.w3.org/2000/svg">
          <path id="MyPath" fill="none" stroke="none"  d="M 0 5 Q 15 -5 30 5" pathLength="2" />
          <text class="title is-4" font-size="3.5" dominant-baseline="middle" text-anchor="middle">
            <textPath href="#MyPath" startOffset="1">
              ${czech ? csname : name}
            </textPath>
          </text>
        </svg>
      </div>
      <div class="card__cost">
        ${Array.from(Array(parseInt(cost)).keys()).map((i) => {
          let mid_index = Math.min((cost - 1) / 2.0, 2);
          let second_row = false;
          let relative_i = i;
          if (i > 4) {
            second_row = true;
            relative_i = i - 5;
            mid_index = (cost - 6) / 2.0;
          }
          let vertical_level = Math.floor(Math.abs(mid_index - relative_i));
          if (second_row) {
            vertical_level += 3;
          }
          return `<img class="card__energy${vertical_level ? ` card__energy--shift${vertical_level}` : ''}" src="card_components/energy-${color}.png" alt="Energy">`;
        }).join('')}
      </div>
      <div class="card__image${!!text ? '' : ' card__image--no-text'}">
        <img src="ilus/${name}.png" alt="${name}">
      </div>
      <div class="card__status${!!text ? '' : ' card__status--no-text'}${longStatus ? ' card__status--bigger' : ''}${czech ? ' card__status--czech' : ''}">
        <svg viewBox="0 4 30 8" xmlns="http://www.w3.org/2000/svg">
          <path id="MyPath2" fill="none" stroke="none"  d="M 0 5 Q 15 10 30 5" pathLength="2" />
          <text class="title is-4" font-size="2.5" dominant-baseline="middle" text-anchor="middle">
            <textPath href="#MyPath2" startOffset="1">
              ${longStatus ? longStatusParts[0] : displayedStatus}
            </textPath>
          </text>
        </svg>
        ${longStatus && longStatusParts[1] ? `
        <svg viewBox="0 4 30 8" xmlns="http://www.w3.org/2000/svg" class="card__status--row2">
          <path id="MyPath2" fill="none" stroke="none"  d="M 0 5 Q 15 10 30 5" pathLength="2" />
          <text class="title is-4" font-size="2.5" dominant-baseline="middle" text-anchor="middle">
            <textPath href="#MyPath2" startOffset="1">
              ${longStatusParts[1]}
            </textPath>
          </text>
        </svg>
        ` : ''}
      </div>
      ${text ? `
        <div class="card__text${power ? ' card__text--with-power' : ''}${health ? ' card__text--with-health' : ''}">
          <div>
            ${filterText(czech ? cstext : text)}
          </div>
        </div>
      ` : ''}
      ${power ? `
        <div class="card__power">
          ${power}
          <br>
          <span class="card__symbol">⚔</span>
        </div>
      ` : ''}
      ${health ? `
        <div class="card__health">
          ${health}
          <br>
          <span class="card__symbol">🛡</span>
        </div>
      ` : ''}
    </div>`;
}

const filterText = (text) => text
  .replace(/((💥)+|⚔|🛡)/g, '<span class="text__emoji">$1</span>')
  .replace(/\-/g, '&#8288-&#8288')
  .replace(/ a /g, ' a&nbsp;')
  .replace(/((\[[A-Z]\])+)/g, '<span class="text__energy-wrap">$1</span>')
  .replace(/\[E\]/g, '<img class="text__energy" src="card_components/energy-any.png" alt="[E]">')
  .replace(/\[W\]/g, '<img class="text__energy" src="card_components/energy-w.png" alt="[W]">')
  .replace(/\[Y\]/g, '<img class="text__energy" src="card_components/energy-y.png" alt="[Y]">')
  .replace(/\[B\]/g, '<img class="text__energy" src="card_components/energy-b.png" alt="[B]">')
  .replace(/\[N\]/g, '<img class="text__energy" src="card_components/energy-n.png" alt="[N]">')
  .replace(/\[R\]/g, '<img class="text__energy" src="card_components/energy-r.png" alt="[R]">')
  .replace(/\[P\]/g, '<img class="text__energy" src="card_components/energy-p.png" alt="[P]">');

const translateStatus = (status, lang) => {
  switch (lang) {
    case 'cs':
      const czechStatus = status.toLowerCase()
        .replace('unit', 'tvor')
        .replace('guard', 'strážný')
        .replace('flying', 'létající')
        .replace('shooting', 'střelecký')
        .replace('tempo', 'rychlý')
        .replace('charm', 'čár')
        .replace('wonder', 'kouzlo')
        .replace('relic', 'relikvie');
      return `${czechStatus.slice(0, 1).toUpperCase()}${czechStatus.slice(1)}`;
    default:
      return status;
  }
}