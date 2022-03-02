module.exports = (cardData) => {
  if (cardData.type === 'back') {
    return `<div class="card back"></div>`;
  }
  if (cardData.type === 'monsterback') {
    return `<div class="card monsterback"></div>`;
  }

  let titleColor = '';
  let titleShadow = '';
  if (cardData.color) {
    titleColor = ` style="color: ${cardData.color};"`;
    titleShadow = ` style="text-shadow: 0 0 5px ${cardData.color};"`;
  }

  if (cardData.type === 'monster') {
    return `<div class="card monster" style="background-image: url(http://localhost:8080/img/monster-${cardData.title.replace(' ',  '')}.jpg)">
      <div class="title"${titleShadow}>${cardData.title}</div>
      <div class="titleStroke"${titleColor}>${cardData.title}</div>
    </div>`;
  }

  const bgLeft = ((cardData.i - 1)  % 10) * 6.35;
  const bgTop = Math.floor((cardData.i - 1) / 10) * 8.89;
  let cardTypeText = '';

  if (cardData.type === 'keep') {
    cardTypeText = `<div class="cardType">vylož</div><div class="cardTypeStroke">vylož</div>`;
  } else if (cardData.type === 'discard') {
    cardTypeText = `<div class="cardType">odhoď</div><div class="cardTypeStroke">odhoď</div>`;
  }

  return (
    `<div class="card ${cardData.type}" style="background-position: -${bgLeft}cm -${bgTop}cm;">
      <div class="title"${titleShadow}>${cardData.title}</div>
      <div class="titleStroke"${titleColor}>${cardData.title}</div>
      <div class="text ${cardData.text.length < 20 ? 'super' : ''}${cardData.text.length < 60 ? 'short' : ''}">
        ${cardData.text.replace(/⚡/g,'<span class="energy">⚡</span>').replace(/🖐/g,'<span class="hand">🖐</span>')}
        ${cardTypeText}
      </div>
    </div>`
  )
}
