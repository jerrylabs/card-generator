

module.exports = ({type, title, subtitle, text}) => (
  `<div class="card ${type}">
  <div class="title">${title}</div>
  ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
  <div class="text">${text}</div>
  </div>`
)
