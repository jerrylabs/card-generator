module.exports = (cardData) => (
  `<div class="card ${cardData.type}"> ${
    Object.keys(cardData).map(cardProperty => {
       if (cardProperty === 'image') {
         return `<img class="${cardProperty}" src="img/${cardData[cardProperty]}.jpg" />`
       }
       return `<div class="${cardProperty}">${cardData[cardProperty]}</div>`
    }).join('')
  }</div>`
)
