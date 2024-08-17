module.exports = (cardData) => {
  if (cardData.type === 'N' || cardData.type === 'F') {
    return `
      <div class="card nf">
        <div class="frame"></div>
        <div class="text">
          ${cardData.text}
        </div>
      </div>
    `;
  }
  if (cardData.type === 'P') {
    return `
      <div class="card p">
        <div class="frame"></div>
        <div class="column" style="background-color: #${cardData.color}"></div>
        <div class="content">
        <div class="name">${cardData.text}</div>
        <div class="data">
          <div class="label">
            Náklady na uvedení prostředku na trh
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.cost)},-
          </div>
        </div>
        <div class="data">
          <div class="label">
            Nákup prostředku
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.buy)},-
          </div>
        </div>
        <div class="data border">
          <div class="label">
            Zisk z trhu EU
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.profit1)},-
          </div>
        </div>
        <div class="data">
          <div class="label">
            Zisk z trhu EU<br>a&nbsp;Švýcarska
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.profit2)},-
          </div>
        </div>
        <div class="data">
          <div class="label">
            Zisk z trhu EU,<br>Švýcarska a UK
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.profit3)},-
          </div>
        </div>
        <div class="data">
          <div class="label o">
            Zisk z trhu EU, Švýcarska,&nbsp;UK&nbsp;a&nbsp;Kanady
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.profit4)},-
          </div>
        </div>
        <div class="data">
          <div class="label">
            Zisk z celosvětového prodeje
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.profitmax)},-
          </div>
        </div>
        <div class="data border">
          <div class="label">
            Náklady na expanzi trhu
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(cardData.expand)},-
          </div>
        </div>
        </div>
      </div>
  `;
  }
  if (cardData.type === 'C') {
    return `
    <div class="card c">
      <div class="frame"></div>
      <div class="name">${cardData.text}</div>
      <div class="data">
          <div class="label">
            Cena za ISO 13485<br>Lead Auditor Training
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(4000)},-
          </div>
        </div>
        <div class="data border" style="justify-content: end">
          <div class="value" style="text-align: right; width: 80%;">
            Konzultant vybírá za poskytnutí konzultačních služeb tyto sazby:
          </div>
        </div>
        <div class="data border">
          <div class="label">
            1 konzultační hodina
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(1000)},-
          </div>
        </div>
        <div class="data">
          <div class="label">
            2 konzultační hodiny
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(2000)},-
          </div>
        </div>
        <div class="data">
          <div class="label">
            3 konzultační hodiny
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(3000)},-
          </div>
        </div>
        <div class="data">
          <div class="label">
            4 konzultační hodiny
          </div>
          <div class="value">
            ${new Intl.NumberFormat('cs-CZ').format(4000)},-
          </div>
        </div>
    </div>
  `;
  }
  return `
    <div class="card x">
      <div class="frame"></div>
       <div class="name">${cardData.type}</div>
      ${cardData.text}
    </div>
  `;
};
