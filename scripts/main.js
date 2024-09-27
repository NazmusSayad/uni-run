const fs = require('fs')

let i = 0
setInterval(() => {
  console.log(i)
  fs.appendFileSync('scripts/log.txt', `Hello, ${i++}\n`)

  if (i > 2) {
    throw new Error('I am an error')
  }
}, 1000)
