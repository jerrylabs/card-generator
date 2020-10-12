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
    let testImgNamePart, testDescription = '';
    if (value.includes('PI'))      { testImgNamePart = 'poweriq'; }
    else if (value.includes('PS')) { testImgNamePart = 'powerspeed'; }
    else if (value.includes('P'))  { testImgNamePart = 'power'; testDescription = 'sílu'; }
    else if (value.includes('S'))  { testImgNamePart = 'speed'; testDescription = 'rychlost'; }
    else if (value.includes('I'))  { testImgNamePart = 'iq'; testDescription = 'inteligenci'; }
    markup = `
      <img class="test" src="http://localhost:8080/imgs/attr-${testImgNamePart}.png" />
      <div class="quest__label">test</div>
      <div class="quest__description">na ${testDescription}</div>
      <div class="quest__success">úspěch</div>
      <div class="quest__fail">neúspěch</div>
    `;
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
      markup = `<div class="${title}
        ${value.length > 32 || (card.type == 'quest' && value.length >= 17) ? ' title-long' : ''}
      ">
        <span>${value}</span>
      </div>`;
      markup += markup.replace('"title', '"title title-shadow');
    break;

    case 'image':
      if (card.type === 'quest') {
        markup = `<div class="quest__illustration" style="background-image: url('http://localhost:8080/imgs/ilus/${value}.jpg');"></div>`;
      } else {
        markup = `<img
          src="http://localhost:8080/imgs/ilus/${value}.jpg"
          class="illustration" />`;
      }
    break;

    case 'test':
      markup = getTestMarkup(value);
    break;

    case 'reward':
       const questLevel = parseInt(value);
       const match = value.match(/c/g);
       const rewardCards = match ? match.length : 0;
       const rewardReputation = questLevel - rewardCards;
       markup = `
        <div class="quest__reward">
          ${rewardReputation > 0 ? `<div class="quest__reputation${rewardReputation === 1 ? ' v1' : ''}">${rewardReputation}</div>` : ''}
          ${rewardCards > 0 ? `<div class="quest__cards">+${rewardCards}</div>` : ''}
        </div>
      <div class="quest__penalty">-${questLevel}</div>`;
    break;

    default:
      markup = `<div class="${title}">${value}</div>`;
  }
  return markup;
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
    class="card ${cardData.type || ''} ${cardData.type === 'quest' ? cardData.test : ''}
  ">
    ${cardData.type == 'animatron'
      ? getAnimatronMarkup(cardData)
      : ``
    }
    ${
      Object.keys(cardData).map(cardProperty =>
        cardData[cardProperty]
        ? getFieldMarkup(cardProperty, cardData[cardProperty], cardData)
        : ''
      ).join('')
    }
  </div>`;
}