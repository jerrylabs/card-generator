module.exports = (cardData) => {
  const bgLeft = (cardData.col - 1) * 4.4;
  const bgTop = Math.floor(cardData.row - 1) * 6.35;

  return (
    `<div class="card" style="background-position: -${bgLeft}cm -${bgTop}cm;">
    </div>`
  )
}
