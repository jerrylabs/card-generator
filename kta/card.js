module.exports = (cardData) => {
  let titleLong = '';
  if (cardData.title.length > 16) {
    titleLong = ' long';
  }
  if (cardData.title.length >= 20) {
    titleLong = ' extralong';
  }
  if (cardData.type == 'car') {
    return `
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
    `;
  }
  if (cardData.type == 'mission') {
    return `
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
    `;
  }
  // if (cardData.type == 'action') {
  //   return `
  //     <div class="card ${cardData.type} mission">
  //       <div class="frame"></div>
  //       <div class="title">${cardData.title}</div>
  //       <div class="subtitle">akce</div>
  //       <img class="ilus ${cardData.ilus}" src="http://localhost:8080/actions/${cardData.ilus}.png" />
  //       <div class="text ${cardData.ilus}">${cardData.requirements.replace('~', '&nbsp;')}</div>
  //     </div>
  //   `;
  // }
  // if (cardData.type == 'special') {
  //   return `
  //     <div class="card mission special">
  //       <div class="frame"></div>
  //       ${cardData.ilus === 'christmas' ? '<div class="xmasbg"></div>' : ''}
  //       <div class="title">${cardData.title}</div>
  //       <div class="subtitle">speciální akce</div>
  //       <img class="ilus ${cardData.ilus}" src="http://localhost:8080/actions/${cardData.ilus}.png" />
  //       <div class="text ${cardData.ilus}">${cardData.requirements.replace('~', '&nbsp;')}</div>
  //     </div>
  //   `;
  // }
  if (cardData.type == 'token') {
    return `
      <div class="token ${cardData.level}">
      </div>
    `;
  }
  if (cardData.type == 'pagebreak') {
    return `
      <div class="pagebreak">
      </div>
    `;
  }
};
