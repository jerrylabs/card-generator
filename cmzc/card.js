module.exports = (cardData) => {
  return `<div class="card ${cardData.typ || ''}"> ${
    Object.keys(cardData).map(cardProperty =>
      cardData[cardProperty]
      ? `<div class="${cardProperty}">${cardData[cardProperty]}</div>` // here condition for specific fields
      : ''
    ).join('')
  }</div>`;
}