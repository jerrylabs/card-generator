module.exports = (cardData) => {
  return `
    <div class="card ${cardData.type}">
      ${cardData.image ? `<div class="image" style="background-image: url('ilus/${cardData.image}.jpg')"></div>` : ''}
      <div class="frame"></div>
      <div class="name"><span>${cardData.name}</span></div>
      <div class="text"><span>${cardData.text}</span></div>
    </div>
  `;
}

