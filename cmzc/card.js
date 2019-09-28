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
    default:
      markup = `<div class="${title}">${value}</div>`;
  }
  return markup;
}

const isHorizontal = (cardData) =>
  cardData.type != 'voodoo' && !cardData.requires && !cardData.provides && !cardData.text;

const isVertical = (cardData) =>
  cardData.type != 'voodoo' && cardData.text

const hasBigText = (cardData) =>
  cardData.type == 'bio' && cardData.text && !cardData.requires && !cardData.provides && !cardData.attributes;

module.exports = (cardData) => {
  return `<div
    class="card
      ${cardData.type || ''}
      ${isHorizontal(cardData) ? ' card-horizontal' : ''}
      ${isVertical(cardData) ? ' card-vertical' : ''}
      ${hasBigText(cardData) ? ' card-big-text' : ''}
  }">
    <div class="card-frame"></div>
    ${
      Object.keys(cardData).map(cardProperty =>
        cardData[cardProperty]
        ? getFieldMarkup(cardProperty, cardData[cardProperty], cardData)
        : ''
      ).join('')
    }
  </div>`;
}