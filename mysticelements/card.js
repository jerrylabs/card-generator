module.exports = (cardData) => {
  const { cost, color, name, status, text, power, health } = cardData;
  return `<div class="card">
      <div class="card__edge"></div>
      <div class="card__frame card__frame--${color}"></div>
      <div class="card__name">${name}</div>
      <div class="card__cost">
        ${Array.from(Array(parseInt(cost)).keys()).map((i) => {
          let mid_index = Math.min((cost - 1) / 2.0, 2);
          let second_row = false;
          let relative_i = i;
          if (i > 4) {
            second_row = true;
            relative_i = i - 5;
            mid_index = (cost - 6) / 2.0;
          }
          let vertical_level = Math.floor(Math.abs(mid_index - relative_i));
          if (second_row) {
            vertical_level += 3;
          }
          return `<img class="card__energy${vertical_level ? ` card__energy--shift${vertical_level}` : ''}" src="card_components/energy-${color}.png" alt="Energy">`;
        }).join('')}
      </div>
      <div class="card__image">
        <img src="ilus/${name}.png" alt="${name}">
      </div>
      <div class="card__status">${status}</div>
      <div class="card__text">${text}</div>
      ${power ? `<div class="card__power">${power}</div>` : ''}
      ${health ? `<div class="card__health">${health}</div>` : ''}
    </div>`;
}