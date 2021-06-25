module.exports = (cardData) => {
  const getPolice = (level) => {
    switch (level) {
      case 'standard':
      return `
        <div class="policeboxes">
          <div class="policebox police-standard">
            <span class="nopolice">-</span>
          </div>
          <div class="policebox police-premium">
          <span class="nopolice">-</span>
          </div>
          <div class="policebox police-deluxe">
            <span class="policehead"></span>
          </div>
        </div>
      `;
      case 'premium':
        return `
        <div class="policeboxes">
          <div class="policebox police-standard">
            <span class="nopolice">-</span>
          </div>
          <div class="policebox police-premium">
            <span class="policehead"></span>
          </div>
          <div class="policebox police-deluxe">
            <span class="policehead"></span>
            <span class="policehead"></span>
          </div>
        </div>
      `;
      case 'deluxe':
        return `
        <div class="policeboxes">
          <div class="policebox police-standard">
            <span class="policehead"></span>
          </div>
          <div class="policebox police-premium">
            <span class="policehead"></span>
            <span class="policehead"></span>
          </div>
          <div class="policebox police-deluxe">
            <span class="policehead"></span>
            <span class="policehead"></span>
            <span class="policehead"></span>
          </div>
        </div>
      `;
      default:
      return;
    }
  }

  return `<div class="card ${cardData.type} ${cardData.type == 'mission' ? 'm': ''}${cardData.level}">
    ${cardData.type == 'car'
      ? `
        <div class="title"><span>${cardData.title}</span></div>
        <div class="type">${cardData.level}</div>
        <div class="ilus" style="background-image: url('http://localhost:8080/ilus/${cardData.ilus}.png');" /></div>
        <div class="stats">
          <div class="stat">Zrychlení: ${cardData.acc}</div>
          <div class="stat">Max. rychlost: ${cardData.speed}</div>
          <div class="stat">Odolnost: ${cardData.endurance}</div>
        </div>
        ${getPolice(cardData.level  )}
      ` : ``
    }
    ${cardData.type == 'mission'
      ? `
      <div class="title">Mise</div>
      <div class="reqs reqs${cardData.requirements.length}">${cardData.requirements.split('').map((r) => {
        switch (r) {
          case 'S': return '<div class="req speed"></div>';
          case 'P': return '<div class="req pistol"></div>';
          case 'G': return '<div class="req police"></div>';
          case 'D': return '<div class="req explosion"></div>';
        }
      }).join('')}</div>
      <div class="level">${cardData.level} $</div>
    `: ``
    }
    ${cardData.type == 'action'
      ? `
      <div class="title">${cardData.title}</div>
      <div class="ilus" style="background-image: url('http://localhost:8080/actions/${cardData.ilus}.png');" /></div>
      <div class="text ${cardData.ilus}">${cardData.requirements}</div>
    `: ``
    }
  </div>`;
};
