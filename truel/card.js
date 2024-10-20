module.exports = (cardData) => {
  let symbol = '❌'
  if (cardData.type.includes('type')) {
    symbol = '☐'
  }
  if (cardData.type.includes('player')) {
    symbol = '👤'
  }

  if (cardData.value === 'triumph') {
    let description = 'jakákoliv hodnota'
    if (cardData.type.includes('player')) {
      description = 'jakýkoliv hráč'
    }
    if (cardData.type.includes('type')) {
      description = 'jakákoliv jednotka'
    }
    return `
      <div class="card triumph ${cardData.type}">
        <div class="frame"></div>
        <div class="type"><span>${symbol}</span></div>
        <div class="value"><span>?</span></div>
        <div class="description">${description}</div>
        <div class="special  ${cardData.special}"><span>${cardData.special}</span></div>
      </div>
    `;
    }

  if (cardData.type === 'value') {
    return `
      <div class="card ${cardData.type}">
        <div class="frame"></div>
        <div class="type"><span>${symbol}</span></div>
        <div class="value"><span>${cardData.value > 0 ? '+' : ''}${cardData.value}</span></div>
        <div class="special  ${cardData.special}"><span>${cardData.special}</span></div>
      </div>
    `;
  }
  if (cardData.type === 'type') {
    let type = 'políčka'
    let value = '⬡'
    let color = ''
    if (cardData.value === 'cards') {
      type = 'karty'
      value = '🂡'
    }
    if (cardData.value === 'ruby') {
      type = 'rubíny'
      value = '💎'
      color='red'
    }
    if (cardData.value === 'sapphire') {
      type = 'safíry'
      value = '💎'
      color='blue'
    }
    if (cardData.value === 'emerald') {
      type = 'smaragdy'
      value = '💎'
      color='green'
    }
    return `
      <div class="card ${cardData.type}">
        <div class="frame"></div>
        <div class="type"><span>${symbol}</span></div>
        <div class="value ${color}"><span>${value}</span></div>
        <div class="description"><span>${type}</span></div>
        <div class="special ${cardData.special}"><span>${cardData.special}</span></div>
      </div>
    `;
  }
  if (cardData.type === 'player') {
    let color = 'zelený'
    if (cardData.value === 'red') {
      color = 'červený'
    }
    if (cardData.value === 'blue') {
      color = 'modrý'
    }
    return `
      <div class="card ${cardData.type}">
        <div class="frame"></div>
        <div class="type"><span>${symbol}</span></div>
        <div class="value ${cardData.value}"><span>👤</span></div>
        <div class="description"><span>${color} hráč</span></div>
        <div class="special  ${cardData.special}"><span>${cardData.special}</span></div>
      </div>
    `;
  }

}
