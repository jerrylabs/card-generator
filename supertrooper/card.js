module.exports = (cardData) => {
  const attributes = cardData.type === "trooper" ? cardData.attributes.split('/') : null;
  return `
    <div class="card ${cardData.affiliation}">
      <div class="icon-type ${cardData.type}"></div>
      <div class="icon-affiliation ${cardData.affiliation}"></div>
      <div class="title"><div>${cardData.title}</div></div>
      <div class="image" style="background-image: url('http://localhost:8080/images/${cardData.image}.jpg');" /></div>
      ${attributes ? `
        <div class="attributes">
          <div class="attribute fight">${attributes[0]}</div>
          <div class="attribute shoot">${attributes[1]}</div>
          <div class="attribute defense">${attributes[2]}</div>
          <div class="attribute value">${attributes[3]}</div>
        </div>
      ` : ``}
      <div class="text ${cardData.text.length > 80 ? 'text-long' : ''}"><div>${cardData.text}</div></div>
    </div>
  `;
};