module.exports = (cardData, i) => {
  return `
    <div class="card ${cardData.type}${textLenghtClasses(cardData.text.length)}">
      ${cardData.image ? `<div class="image" style="background-image: url('ilus/${cardData.image}.jpg')"></div>` : ''}
      <div class="frame"></div>
      <div class="name"><span> ${cardData.name} </span></div>
      <div class="text"><span>${filterEmojis(cardData.text)}</span></div>
    </div>
  `;
}

textLenghtClasses = (length) => {
  let classes = '';
  if (length > 80) {
    classes = `${classes} long-text`;
  }
  if (length > 150) {
    classes = `${classes} ultra-long-text`;
  }
  if (length > 230) {
    classes = `${classes} mega-fucking-long-text`;
  }
  return classes
}

filterEmojis = (text) => text.replace(/(🎲|💎|🧉|📿|🪙|🔪|🏮|📜|🙂)/g, '<span class="text__icon $1">$1</span>')
