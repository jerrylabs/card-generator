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
  `<img class="joint ${rel} ${order} ${type}" src="http://localhost:8080/imgs/${rel}-${type}.png" />`;

const getLifeMarkup = (c, i) => `<img class="life" src="http://localhost:8080/imgs/${shortcut(c)}.png" />`;

const getAttrMarkup = (c, i) => `<img class="attribute attribute-${shortcut(c)}" src="http://localhost:8080/imgs/attr-${shortcut(c)}.png" />`;

const getTestMarkup = (value) => {
  let markup = '';
  if (value.includes('P') || value.includes('S') || value.includes('I')){
    let testImgNamePart;
    if (value.includes('PI'))      { testImgNamePart = 'poweriq'; }
    else if (value.includes('PS')) { testImgNamePart = 'powerspeed'; }
    else if (value.includes('P'))  { testImgNamePart = 'power'; }
    else if (value.includes('S'))  { testImgNamePart = 'speed'; }
    else if (value.includes('I'))  { testImgNamePart = 'iq'; }
    markup = `<img class="test" src="http://localhost:8080/imgs/test-${testImgNamePart}.png" />`;
  }
  return markup;
}

const getRerollsMarkup = (value) => {
  let markup = getTestMarkup(value); /* pozadavek na test, je-li nejaky */
  let diceAmount;
  diceAmount = value.match(/[1-3]/g);
  if (value.includes('🙁')) { diceAmount = '-small-sad'; }
  else if (value.includes('😬')) { diceAmount = '-small-tragic'; }
  if (diceAmount) {
    markup = `${markup}
      <div class="reroll reroll${value.includes('X') ? '-red' : '-green'}">
        <img src="http://localhost:8080/imgs/dice${diceAmount}.png" />
      </div>`;
  }
  if (value.includes('Z')) {
    markup = `${markup}
      ${value.split('').filter(v => v == 'Z').map(getLifeMarkup).join('')}
    `;
  }
  if (value.includes('D')) {
    markup = `${markup}
      <img class="test" src="http://localhost:8080/imgs/dice-cross.png" />
    `;
  }
  return markup;
}

getTextMarkup = (text, lang) => text
  .replace(/\[😀\]/g, '<img class="emo dice" src="http://localhost:8080/imgs/dice-epic.png" />')
  .replace(/\[😬\]/g, '<img class="emo dice" src="http://localhost:8080/imgs/dice-tragic.png" />')
  .replace(/\[🙂\]/g, '<img class="emo dice" src="http://localhost:8080/imgs/dice-happy.png" />')
  .replace(/\[😐\]/g, '<img class="emo dice" src="http://localhost:8080/imgs/dice-neutral.png" />')
  .replace(/\[🙁\]/g, '<img class="emo dice" src="http://localhost:8080/imgs/dice-sad.png" />')
  .replace(/\[🙂🙂\]/g, '<img class="emo dice" src="http://localhost:8080/imgs/dice-double.png" />')
  .replace(/X😀/g, '<img class="emo emo-epic" src="http://localhost:8080/imgs/cross.png" />')
  .replace(/X😬/g, '<img class="emo emo-tragic" src="http://localhost:8080/imgs/cross.png" />')
  .replace(/X🙂/g, '<img class="emo emo-happy" src="http://localhost:8080/imgs/cross.png" />')
  .replace(/X🙁/g, '<img class="emo emo-sad" src="http://localhost:8080/imgs/cross.png" />')
  .replace(/😀/g, '<img class="emo" src="http://localhost:8080/imgs/emo-epic.png" />')
  .replace(/😬/g, '<img class="emo" src="http://localhost:8080/imgs/emo-tragic.png" />')
  .replace(/🙂/g, '<img class="emo" src="http://localhost:8080/imgs/emo-happy.png" />')
  .replace(/😐/g, '<img class="emo" src="http://localhost:8080/imgs/emo-neutral.png" />')
  .replace(/🙁/g, '<img class="emo" src="http://localhost:8080/imgs/emo-sad.png" />')
  .replace(/#/g, '<img class="emo" src="http://localhost:8080/imgs/dice-cross.png" />')
  .replace(/=>/g, '<img class="emo arrow" src="http://localhost:8080/imgs/arrow.png" />')
  .replace(/\?/g, '<img class="emo dice" src="http://localhost:8080/imgs/dice-any.png" />')
  .replace(/\(2\)/g, '<div class="reroll reroll-red"><img src="http://localhost:8080/imgs/dice2.png"></div>')
  .replace(/\{/g, `<div class="group-all"><span class="white-shadow">${lang === 'english' ? 'all' : 'všechny'}</span><div class="group">`)
  .replace(/\}/g, '</div></div>');

// Field = any column in source CSV
const getFieldMarkup = (title, value, card) => {
  let markup = ``;
  switch (title) {

    /* nazev karty */
    case 'title':
      markup = `<div class="${title}

        ${value.length >= 18 ? ' title-long' : ''}
        ${value.length > 32 || (card.type == 'quest' && value.length >= 20) ? ' title-long' : ''}
      ">
        <span>${value}</span>
      </div>`;
      if ((card.requires || card.provides) && !card.text && card.type != 'quest') {
        markup += `<div class="title title-reversed
          ${value.length >= 18 ? ' title-long' : ''}
          "><span>${value}</span></div>`;
      }
      if (card.type === 'bio' || card.type === 'tech') {
         markup += markup.replace(/\"title/g, '"title title-shadow');
      }
    break;

    /* vyzadovane a poskytovane kosti, ruce a nohy, u ukolu vlastnost, stupen a odmeny */
    case 'requires':
    case 'provides':
      if (card.type == 'quest') {
        markup = getQuestMarkup(card.requires, card.provides);
      } else {
        const relation = title.replace('s', 'd'); // requires, provides => required, provided
        if (value.length == 1) {
          markup = getJointMarkup('single', relation, shortcut(value));
        } else if (value.length == 2) {
          markup = `${getJointMarkup('first', relation, shortcut(value[0]))}
            ${getJointMarkup('second', relation, shortcut(value[1]))}`;
        }
    }
    break;
    case 'attributes':
      markup = `<div class="lives-and-attributes attr${card.attributes.length}">
        <div class="attributes">
          ${value.split('').filter(v => v != 'Z').map(getAttrMarkup).join('')}
        </div>
        <div class="lives ${
          (card.title == 'Údní nástavec' || card.type == 'tech')
          ? 'lives-down' : ''
        }
        ${card.title == 'Jízdní pásy' ? 'lives-with-rerolls' : ''
      }">
          ${value.split('').filter(v => v == 'Z').map(getLifeMarkup).join('')}
        </div>
      </div>`;
    break;
    case 'image':
	  const imageFormat = (card.type == 'voodoo') ? 'jpg' : 'png';
      markup = `<img
        src="http://localhost:8080/imgs/ilus/${imageFormat}/${value}.${imageFormat}"
        class="illustration" />`;
    break;
    case 'rerolls':
      markup = `<div class="rerolls">${getRerollsMarkup(value)}</div>`;
    break;
    case 'text2':
    case 'disjunction':
    case 'lang':
    break;
    case 'text':
      if (card.text2) {
        markup = `<div class="text texts">
          <div class="text-part">${getTextMarkup(value, card.lang)}</div>
          ${card.disjunction ? `<span class="white-shadow or">${card.lang === 'english' ? 'or' : 'nebo'}</span>` : '<span class="texts-between"></span>' }
          <div class="text-part">${getTextMarkup(card.text2, card.lang)}</div>
        </div>`;
        markup += `<div class="text texts text-shadow">
          <div class="text-part">${getTextMarkup(value, card.lang)}</div>
          ${card.disjunction ? `<span class="white-shadow or">${card.lang === 'english' ? 'or' : 'nebo'}</span>` : '<span class="texts-between"></span>' }
          <div class="text-part">${getTextMarkup(card.text2, card.lang)}</div>
        </div>`;
      } else {
        markup =  `<div class="text${value.includes('<br>') ? ' special' : ''}">${getTextMarkup(value, card.lang)}</div>`;
        markup += `<div class="text text-shadow">${getTextMarkup(value, card.lang)}</div>`;
      }
    break;
    case 'test':
      markup = getTestMarkup(value);
    break;
    default:
      markup = `<div class="${title}">${value}</div>`;
  }
  return markup;
}

module.exports = (cardData) => {
  if (cardData.type === 'background') {
  //   return `<div class="card background ${cardData.title}"></div>`;
  // }
  // if (!cardData.type) {
    return '';
  }
  return `<div
    class="card
      ${cardData.type || ''}
      ${(cardData.text) ? ' card-with-text' : ''}
      ${!cardData.requires && !cardData.provides ? 'card-no-joints' : 'card-has-joints'}
      ${cardData.requires.length > 1 || cardData.provides.length > 1 ? 'card-double-joint' : ''}
      ${cardData.requires.length > 1 ? 'card-double-req-joint ' : ''}
      ${cardData.provides.length > 1 ? 'card-double-prov-joint' : ''}
      ${cardData.requires.length == 2 ? 'two-handed' : ''}
      ${(cardData.text2) ? ' card-two-texts' : ''}
  ">
    ${
      Object.keys(cardData).map(cardProperty =>
        cardData[cardProperty]
        ? getFieldMarkup(cardProperty, cardData[cardProperty], cardData)
        : ''
      ).join('')
    }
  </div>`;
}