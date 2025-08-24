module.exports = (cardData) => {
  return `<div class="card">
      <div class="card__edge"></div>
      <div class="card__frame card__frame--${cardData.color}"></div>
      <div class="card__name">${cardData.name}</div>
      <div class="card__cost">${cardData.cost}</div>
      <div class="card__image">
        <img src="ilus/${cardData.name}.png" alt="${cardData.name}">
      </div>
      <div class="card__status">${cardData.status}</div>
      <div class="card__text">${cardData.text}</div>
      ${cardData.power ? `<div class="card__power">${cardData.power}</div>` : ''}
      ${cardData.health ? `<div class="card__health">${cardData.health}</div>` : ''}
    </div>`;
}