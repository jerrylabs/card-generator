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

const getTestMarkup = (value, lang) => {
  let markup = '';
  if (value.includes('P') || value.includes('S') || value.includes('I')){
    let testImgNamePart, testDescription = '';
    if (value.includes('PI'))      { testImgNamePart = 'poweriq'; }
    else if (value.includes('PS')) { testImgNamePart = 'powerspeed'; }
    else if (value.includes('P'))  { testImgNamePart = 'power'; testDescription = lang === 'english' ? 'your power' : 'Síly'; }
    else if (value.includes('S'))  { testImgNamePart = 'speed'; testDescription = lang === 'english' ? 'your speed' : 'RYCHLOSTI'; }
    else if (value.includes('I'))  { testImgNamePart = 'iq'; testDescription = lang === 'english' ? 'intelligence' : 'INTELIGENCE'; }
    markup = `
      <img class="test" src="http://localhost:8080/imgs/attr-${testImgNamePart}.png" />
      <div class="quest__label">test</div>
      <div class="quest__description">${testDescription}</div>
      <div class="quest__success">${lang === 'english' ? 'success' : 'úspěch'}</div>
      <div class="quest__fail">${lang === 'english' ? '&nbsp;&nbsp;fail' : 'neúspěch'}</div>
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
      // animatroni maji title hardcoded
      if (card.type === 'animatron') {
        break;
      }
      markup = `<div class="${title}
        ${value.length > 32 || (card.type == 'quest' && value.length >= 17) ? ' title-long' : ''}
      ">
        <span>${value}</span>
      </div>`;
      markup += markup.replace('"title', '"title title-shadow');
    break;

    case 'image':
      if (card.type === 'quest') {
        markup = `<div class="quest__illustration" style="background-image: url('http://localhost:8080/imgs/ilus/png/${value}.png');"></div>`;
      } else {
        markup = `<img
          src="http://localhost:8080/imgs/ilus/characters/${value}.jpg"
          class="illustration" />`;
      }
    break;

    case 'test':
      markup = getTestMarkup(value, card.lang);
    break;

    case 'lang':
    break;

    case 'reward':
       const questLevel = parseInt(value);
       const match = value.match(/c/g);
       const rewardCards = match ? match.length : 0;
       const rewardReputation = questLevel - rewardCards;
       markup = `
        <div class="quest__reward">
          ${rewardReputation > 0 ? `<div class="quest__reputation v${rewardReputation}">
            <span class="val${rewardReputation}">${rewardReputation}</span>
          </div>` : ''}
          ${rewardCards > 0 ? `<div class="quest__cards">
            <span class="val${rewardCards}">+${rewardCards}</span>
          </div>` : ''}
        </div>
      <div class="quest__penalty">
        <span class="val${questLevel}">-${questLevel}</span>
      </div>`;
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
  ${card.image == 'zombik'
    ? '<div class="animatron__reputation"><span>-2</span></div>'
    : '<img class="attribute attribute-iq" src="http://localhost:8080/imgs/attr-iq.png" />'
  }
`

module.exports = (cardData) => {
  if (cardData.type === 'background') {
    return ''; //'<div class="card background"></div>';
  }
  if (cardData.type === 'background') {
    return '<div class="card background"></div>';
  }
  return `<div
    class="card ${cardData.type || ''} ${cardData.type === 'quest' ? cardData.test : ''} ${cardData.type === 'animatron' ? cardData.image : ''}
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