const fs = require('fs')

let i = 0
setInterval(() => {
  console.log(i)
  fs.appendFileSync('scripts/log.txt', `Hello, ${i++}\n`)
}, 500)
