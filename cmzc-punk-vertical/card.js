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

getTextMarkup = (text) => text
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
  .replace(/\(2\)/g, '<div class="reroll reroll-green"><img src="http://localhost:8080/imgs/dice2.png"></div>')
  .replace(/\{/g, '<div class="group-all"><span class="white-shadow">všechny</span><div class="group">')
  .replace(/\}/g, '</div></div>');

// Field = any column in source CSV
const getFieldMarkup = (title, value, card) => {
  let markup = ``;
  switch (title) {

    /* nazev karty */
    case 'title':
      markup = `<div class="
        ${title}
        ${value.length > 32 || (card.type == 'quest' && value.length >= 20) ? ' title-long' : ''}
      ">
        <span>${value}</span>
      </div>`;
      if ((card.requires || card.provides) && !card.text && card.type != 'quest') {
        markup += `<div class="title title-reversed"><span>${value}</span></div>`;
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
      let subfolder = 'lq/', extension = 'jpg';
      // if (['quest', 'voodoo', 'animatron', 'basic', 'tech', 'bio'].includes(card.type)) {
      //   subfolder = 'lq/';
      //   extension = 'jpg';
      // }
      markup = `<img
        src="http://localhost:8080/imgs/ilus/${subfolder}${card.type}/${value}.${extension}"
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
          ${ card.disjunction ? '<span class="white-shadow">nebo</span>' : '' }
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
  const questLevel = parseInt(rewards);
  const match = rewards.match(/c/g);
  const rewardCards = match ? match.length : 0;
  const rewardReputation = questLevel - rewardCards;
  return `<div class="text">
    <div class="test">
      Otestuj
      ${getTestMarkup(attribute)}
    </div>
    <div class="quest__success">úspěch</div>
    <div class="quest__fail">neúspěch</div>
    <div class="quest__reward">
      ${rewardReputation > 0 ? `<div class="quest__reputation">${rewardReputation}</div>` : ''}
      ${rewardCards > 0 ? `<div class="quest__cards">+${rewardCards}</div>` : ''}
    </div>
    <div class="quest__penalty">-${questLevel}</div>
  </div>`;
}

// except image which renders as ordinary field
const getAnimatronMarkup = (card) => `
  <img class="joint provided bone bone1" src="http://localhost:8080/imgs/provided-bone.png">
  <img class="joint provided bone bone2" src="http://localhost:8080/imgs/provided-bone.png">
  <img class="joint provided bone bone3" src="http://localhost:8080/imgs/provided-bone.png">
  <img class="joint provided bone bone4" src="http://localhost:8080/imgs/provided-bone.png">
  <div class="animatron__cards">4</div>
  ${card.image == 'zombie'
    ? '<div class="animatron__reputation">-2</div>'
    : '<img class="attribute attribute-iq" src="http://localhost:8080/imgs/attr-iq.png" />'
  }
`

module.exports = (cardData) => {
  return `<div
    class="card
      ${cardData.type || ''}
      ${(cardData.text) ? ' card-with-text' : ''}
      ${!cardData.requires && !cardData.provides ? 'card-no-joints' : 'card-has-joints'}
      ${cardData.requires.length == 2 ? 'two-handed' : ''}
      ${(!cardData.requires && !cardData.provides) || cardData.text ? 'card-vertical' : ''}
      ${(cardData.text2) ? ' card-two-texts' : ''}
  ">
    ${cardData.type == 'animatron'
      ? getAnimatronMarkup(cardData)
      : (`
      <div class="card-frame"></div>
      <div class="card-icons"></div>
    `)}
    ${
      Object.keys(cardData).map(cardProperty =>
        cardData[cardProperty]
        ? getFieldMarkup(cardProperty, cardData[cardProperty], cardData)
        : ''
      ).join('')
    }
  </div>`;
}