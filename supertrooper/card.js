module.exports = (cardData) => {
  const attributes = cardData.type === "trooper" ? cardData.attributes.split('/') : null;

  const fixTextIcons = (text) => text
    .replace(/(🏆|🌕|💰|👊|🎯|🛡️|💎)/g, '<span class="text__icon $1">$1</span>')
    .replace(/@/,'<span class="text__action">@</span>')

  const longestTitleWord = Math.max(cardData.title.split(' ').map(w => w.length));

  return `
    <div class="card ${cardData.affiliation}">
      <div class="icon-type ${cardData.type}"></div>
      <div class="icon-affiliation ${cardData.affiliation}"></div>
      <div class="title${longestTitleWord > 12 ? ' title-small' : ''}"><div>${cardData.title}</div></div>
      <div class="image" style="background-image: url('http://localhost:8080/images/${cardData.image}.jpg');" /></div>
      ${attributes ? `
        <div class="attributes">
          <div class="attribute fight">${attributes[0]}</div>
          <div class="attribute shoot">${attributes[1]}</div>
          <div class="attribute defense">${attributes[2]}</div>
          <div class="attribute value">${attributes[3]}</div>
        </div>
        <div class="attributes shadow"></div>
      ` : ``}
      <div class="text${cardData.text.length > 80 ? ' text-long' : ''}">
        <div>${fixTextIcons(cardData.text)}</div>
        ${cardData.flavor ? `<div class="flavor">„${cardData.flavor}“</div>` : ''}
      </div>
      <div class="copyleft"><span>cc</span> JerryLabs ${new Date().getFullYear()}</div>
    </div>
  `;
};