import chalk from 'chalk'
import { defaultRuntimes } from '../runtime/default-runtime'
import { app } from './app'

export const list = app.create('list', {
  description: 'List supported scripts',
})

list.on(async () => {
  console.log(chalk.bold('Built-in scripts:'))

  defaultRuntimes.forEach((runtime) => {
    console.log(
      `- ${chalk.cyan(runtime.name)}`,
      `[${runtime.extensions.map((e) => '.' + chalk.green(e)).join(', ')}]`
    )
  })
})
