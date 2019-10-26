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

const getTestMarkup = (value) => {
  let markup = '';
  if (value.includes('P') || value.includes('S') || value.includes('I')){
    let testImgNamePart;
    if (value.includes('PI'))      { testImgNamePart = 'poweriq'; }
    else if (value.includes('PS')) { testImgNamePart = 'powerspeed'; }
    else if (value.includes('P'))  { testImgNamePart = 'power'; }
    else if (value.includes('S'))  { testImgNamePart = 'speed'; }
    else if (value.includes('I'))  { testImgNamePart = 'iq'; }
    markup = `<img class="test" src="http://localhost:8080/test-${testImgNamePart}.png" />`;
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
        <img src="http://localhost:8080/dice${diceAmount}.png" />
      </div>`;
  }
  if (value.includes('Z')) {
    markup = `${markup}
      ${value.split('').filter(v => v == 'Z').map(getLiveMarkup).join('')}
    `;
  }
  if (value.includes('D')) {
    markup = `${markup}
      <img class="test" src="http://localhost:8080/dice-cross.png" />
    `;
  }
  return markup;
}

getTextMarkup = (text) => text
  .replace(/\[😀\]/g, '<img class="emo dice" src="http://localhost:8080/dice-epic.png" />')
  .replace(/\[😬\]/g, '<img class="emo dice" src="http://localhost:8080/dice-tragic.png" />')
  .replace(/\[🙂\]/g, '<img class="emo dice" src="http://localhost:8080/dice-happy.png" />')
  .replace(/\[😐\]/g, '<img class="emo dice" src="http://localhost:8080/dice-neutral.png" />')
  .replace(/\[🙁\]/g, '<img class="emo dice" src="http://localhost:8080/dice-sad.png" />')
  .replace(/\[🙂🙂\]/g, '<img class="emo dice" src="http://localhost:8080/dice-double.png" />')
  .replace(/X😀/g, '<img class="emo emo-epic" src="http://localhost:8080/cross.png" />')
  .replace(/X😬/g, '<img class="emo emo-tragic" src="http://localhost:8080/cross.png" />')
  .replace(/X🙂/g, '<img class="emo emo-happy" src="http://localhost:8080/cross.png" />')
  .replace(/X🙁/g, '<img class="emo emo-sad" src="http://localhost:8080/cross.png" />')
  .replace(/😀/g, '<img class="emo" src="http://localhost:8080/emo-epic.png" />')
  .replace(/😬/g, '<img class="emo" src="http://localhost:8080/emo-tragic.png" />')
  .replace(/🙂/g, '<img class="emo" src="http://localhost:8080/emo-happy.png" />')
  .replace(/😐/g, '<img class="emo" src="http://localhost:8080/emo-neutral.png" />')
  .replace(/🙁/g, '<img class="emo" src="http://localhost:8080/emo-sad.png" />')
  .replace(/#/g, '<img class="emo" src="http://localhost:8080/dice-cross.png" />')
  .replace(/=>/g, '<img class="emo arrow" src="http://localhost:8080/arrow.png" />')
  .replace(/\?/g, '<img class="emo dice" src="http://localhost:8080/dice-any.png" />')
  .replace(/\(2\)/g, '<div class="reroll reroll-green"><img src="http://localhost:8080/dice2.png"></div>')
  .replace(/\{/g, '<div class="group-all">všechny<div class="group">')
  .replace(/\}/g, '</div></div>');

const getFieldMarkup = (title, value, card) => {
  let markup = ``;
  switch (title) {

    /* nazev karty */
    case 'title':
      markup = `<div class="
        ${title}
        ${value.length > 32 || (card.type == 'quest' && value.length >= 20) ? ' title-long' : ''}
        ${value == 'Lektvar podezřele světélkující kapaliny' ? 'title-superlong' : ''}
      ">
        <span>${value}</span>
      </div>`;
      if ((card.requires || card.provides) && !card.text && card.type != 'quest') {
        markup += `<div class="title title-reversed"><span>${value}</span></div>`;
      }
    break;

    /* vyzadovane a poskytovane kosti, ruce a nohy */
    case 'requires':
    case 'provides':
      if (card.type == 'quest') {
        markup = getQuestMarkup(card.requires, card.provides);
      } else {
        const relation = title.replace('s', 'd');
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
          ${value.split('').filter(v => v == 'Z').map(getLiveMarkup).join('')}
        </div>
      </div>`;
    break;
    case 'image':
        markup = `<img
          src="http://localhost:8080/imgs/${card.type == 'quest' ? 'quests/':''}${value}.png"
          class="illustration" />`;
    break;
    case 'rerolls':
      markup = `<div class="rerolls">${getRerollsMarkup(value)}</div>`;
    break;
    case 'text2':
    case 'disjunction':
    break;
    case 'text':
      if (card.text2) {
        markup = `<div class="text texts">
          <div class="text-part">${getTextMarkup(value)}</div>
          ${ card.disjunction ? 'nebo' : '' }
          <div class="text-part">${getTextMarkup(card.text2)}</div>
        </div>`;
      } else {
        markup = `<div class="text${
          card.text.includes("{") ? ' text-all' : ''
        }${
          card.text.length >= 85 ? ' text-long' : ''
        }">${getTextMarkup(value)}</div>`;
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

const getQuestMarkup = (attribute, rewards) => {
  return `<div class="text">
    <div class="test">
      Otestuj
      ${getTestMarkup(attribute)}
    </div>
  </div>`;
}

module.exports = (cardData) => {
  return `<div
    class="card
      ${cardData.type || ''}
      ${(cardData.text) ? ' card-with-text' : ''}
      ${!cardData.requires && !cardData.provides ? 'card-no-joints' : 'card-has-joints'}
      ${cardData.requires.length == 2 ? 'two-handed' : ''}
      ${(!cardData.requires && !cardData.provides) || cardData.text ? 'card-vertical' : ''}
      ${(cardData.text2) ? ' card-two-texts' : ''}
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