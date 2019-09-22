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

getJointMarkup = (order, rel, type) =>
  `<img class="joint ${rel} ${order} ${type}" src="http://localhost:8080/${rel}-${type}.png" />`;

getAttrMarkup = (c, i) => (
  (c == 'Z')
  ? `<img class="attribute life" src="http://localhost:8080/${shortcut(c)}.png" />`
  : `<img class="attribute" src="http://localhost:8080/attr-${shortcut(c)}.png" />`
);



getFieldMarkup = (title, value, card) => {
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
      markup = `<div class="attributes">${value.split('').map(getAttrMarkup).join('')}</div>`;
    break;
    default:
      markup = `<div class="${title}">${value}</div>`;
  }
  return markup;
}

module.exports = (cardData) => {
  return `<div class="card ${cardData.typ || ''}"> ${
    Object.keys(cardData).map(cardProperty =>
      cardData[cardProperty]
      ? getFieldMarkup(cardProperty, cardData[cardProperty], cardData)
      : ''
    ).join('')
  }</div>`;
}