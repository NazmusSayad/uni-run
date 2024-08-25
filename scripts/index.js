const ansiColors = require('ansi-colors')
const { default: NoArg } = require('noarg')

const app = NoArg.create('app', {
  arguments: [
    {
      name: 'random',
      type: NoArg.string().ask('What is the random number?'),
    },
  ],
})

app.on(console.log)
// app.start()
console.log(ansiColors.red('Helloasdfasdfdfasdfasdfasdfsdfsdfsdf World'))
