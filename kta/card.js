module.exports = (cardData) => {
  let titleLong = '';
  if (cardData.title.length > 16) {
    titleLong = ' long';
  }
  if (cardData.title.length >= 20) {
    titleLong = ' extralong';
  }
  return `
    ${cardData.type == 'car'
      ? `
      <div class="card ${cardData.type} ${cardData.level}">
        <div class="frame"></div>
        <div class="title${titleLong}"><span>${cardData.title}</span></div>
        <div class="title${titleLong} shadow"><span>${cardData.title}</span></div>
        <div class="subtitle"><span>${cardData.level.replace('deluxe', 'de luxe')}</span></div>
        <div class="subtitle shadow"><span>${cardData.level.replace('deluxe', 'de luxe')}</span></div>
        <img class="logo" src="http://localhost:8080/logos/${cardData.logo}.png" />
        <div class="ilus" style="background-image: url('http://localhost:8080/ilus/${cardData.pic}');" /></div>
        <div class="stats">
          <div class="stat acc">${cardData.acc}</div>
          <div class="stat grip">${cardData.endurance}</div>
          <div class="stat grip shadow">${cardData.endurance}</div>
          <div class="stat max">${cardData.speed}</div>
          </div>
        </div>
      ` : ``
    }
    ${cardData.type == 'mission'
      ? `
      <div class="card ${cardData.type} m${cardData.level}">
        <div class="frame"></div>
        <div class="title">${cardData.title}</div>
        <div class="subtitle">Mise</div>
        <img class="ilus" src="http://localhost:8080/ilus/placeholders/mission2.png" />

        <div class="reqs reqs${cardData.requirements.length}">${cardData.requirements.split('').map((r) => {
          switch (r) {
            case 'S': return '<div class="req speed"></div>';
            case 'G': return '<div class="req pistol"></div>';
            case 'P': return '<div class="req police"></div>';
            case 'D': return '<div class="req explosion"></div>';
          }
        }).join('')}</div>
        <div class="reward">${cardData.level} $</div>
      </div>
    `: ``
    }
    ${cardData.type == 'action'
      ? `

      <div class="card ${cardData.type} action">
        <div class="frame"></div>
        <div class="title">${cardData.title}</div>
        <div class="ilus" style="background-image: url('http://localhost:8080/actions/${cardData.ilus}.png');" /></div>
        <div class="text ${cardData.ilus}">${cardData.requirements}</div>
      </div>
    `: ``
    }
  `;
};
