shortcut = (c) => {
  switch (c) {
    case 'B': return 'bone';
    case 'H': return 'hand';
    case 'L': return 'leg';
    case 'P' : return 'power';
    case 'S' : return 'speed';
    case 'I' : return 'iq';
    case 'Z' : return 'heart';
    default: return undefined;
  }
}

const getJointMarkup = (order, rel, type) =>
  `<img class="joint ${rel} ${order} ${type}" src="http://localhost:8080/${rel}-${type}.png" />`;

const getLiveMarkup = (c, i) => `<img class="life" src="http://localhost:8080/${shortcut(c)}.png" />`;

const getAttrMarkup = (c, i) => `<img class="attribute attribute-${shortcut(c)}" src="http://localhost:8080/attr-${shortcut(c)}.png" />`;

const getRerollsMarkup = (value) => {
  let markup = '';

  /* pozadavek na test, je-li nejaky */
  if (value.includes('P') || value.includes('S') || value.includes('I')){
    let testImgNamePart;
    if (value.includes('PI'))      { testImgNamePart = 'poweriq'; }
    else if (value.includes('PS')) { testImgNamePart = 'powerspeed'; }
    else if (value.includes('P'))  { testImgNamePart = 'power'; }
    else if (value.includes('S'))  { testImgNamePart = 'speed'; }
    else if (value.includes('I'))  { testImgNamePart = 'iq'; }
    markup = `<img class="test" src="http://localhost:8080/test-${testImgNamePart}.png" />`;
  }
  let diceAmount;
  if (diceAmount = value.match(/[1-3]/g)) {
    markup = `${markup}
      <div class="reroll reroll${value.includes('X') ? '-red' : '-green'}">
        <img src="http://localhost:8080/dice${diceAmount}.png" />
      </div>`;
  }
  return markup;
}

const getFieldMarkup = (title, value, card) => {
  let markup;
  switch (title) {

    /* nazev karty */
    case 'title':
      markup = `<div class="${title}"><span>${value}</span></div>`;
      if (card.text == '') {
        markup += `<div class="title title-reversed"><span>${value}</span></div>`;
      }
    break;

    /* vyzadovane a poskytovane kosti, ruce a nohy */
    case 'requires':
    case 'provides':
      const relation = title.replace('s', 'd');
      if (value.length == 1) {
        markup = getJointMarkup('single', relation, shortcut(value));
      } else if (value.length == 2) {
        markup = `${getJointMarkup('first', relation, shortcut(value[0]))}
          ${getJointMarkup('second', relation, shortcut(value[1]))}`;
      }
    break;
    case 'attributes':
      markup = `<div class="lives-and-attributes">
        <div class="lives">
          ${value.split('').filter(v => v == 'Z').map(getLiveMarkup).join('')}
        </div>
        <div class="attributes">
          ${value.split('').filter(v => v != 'Z').map(getAttrMarkup).join('')}
        </div>
      </div>`;
    break;
    case 'image':
      markup = `<img src="http://localhost:8080/imgs/${value}.png" class="illustration" />`;
    break;
    case 'rerolls':
      markup = `<div class="rerolls">${getRerollsMarkup(value)}</div>`;
    break;
    default:
      markup = `<div class="${title}">${value}</div>`;
  }
  return markup;
}

const isHorizontal = (cardData) =>
  cardData.type != 'voodoo' && !cardData.requires && !cardData.provides && !cardData.text && !cardData.rerolls;

const isVertical = (cardData) =>
  cardData.type != 'voodoo' && cardData.text

const hasNoAttributes = (cardData) =>
  cardData.type == !cardData.attributes;

module.exports = (cardData) => {
  return `<div
    class="card
      ${cardData.type || ''}
      ${isHorizontal(cardData) ? ' card-horizontal' : ''}
      ${isVertical(cardData) ? ' card-vertical' : ''}
      ${!cardData.attributes ? ' card-no-attributes' : ''}
      ${!cardData.requires && !cardData.provides ? 'card-no-joints' : ''}
  }">
    <div class="card-frame"></div>
    <div class="card-icons"></div>
    ${
      Object.keys(cardData).map(cardProperty =>
        cardData[cardProperty]
        ? getFieldMarkup(cardProperty, cardData[cardProperty], cardData)
        : ''
      ).join('')
    }
  </div>`;
}