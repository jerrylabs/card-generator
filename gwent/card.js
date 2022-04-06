const fs = require('fs');

module.exports = (cardData) => {

  const {title, power, faction, type, effect, flavor} = cardData;

  const imageType = fs.existsSync(`./${process.argv[2]}/images/${title}.jpg`) ? 'jpg' : 'webp';

  return (
    `<div class="card ${faction}" style="background-image: url('http://localhost:8080/images/${title}.${imageType}');">
      <div class="title">${title}</div>
      <hr>
      <div class="flavor">${flavor}</div>
    </div>`
  )
}
