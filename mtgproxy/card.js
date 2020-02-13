module.exports = (cardData) => {
  return `<div
    class="card"
    style="background-image: url(https://img.scryfall.com/cards/large/front${cardData.image});">
    </div>`;
}