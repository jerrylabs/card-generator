module.exports = (cardData) => {

  const {title, fraction, flavor} = cardData;

  return (
    `<div class="card ${fraction}" style="background-image: url(images/${title}.jpg);">
      <div class="title">${title}</div>
      <hr>
      <div class="flavor">${flavor}</div>
    </div>`
  )
}
