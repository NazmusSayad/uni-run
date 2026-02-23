import { TEMP_DIR } from '@/helpers/lib'
import chalk from 'chalk'
import fs from 'fs'
import { appExecutionConfig, resolveSharedConfigOptions } from '../config'
import { Execution } from '../execution'
import { defaultRuntimes } from '../runtime/default-runtime'
import { app } from './app'

const exec = app.create('exec', {
  ...appExecutionConfig,
  description: 'Execute a script with the given binary',
})

const clean = app.create('clean', {
  description: 'Clean cache directory',
})

const list = app.create('list', {
  description: 'List supported scripts',
})

exec.on(async ([listArs, trailingArgs], flags) => {
  const options = resolveSharedConfigOptions(flags)

  const execution = new Execution({
    ...options,
    startArgs: [...listArs, ...trailingArgs],
  })

  await execution.start()
})

clean.on(async () => {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }

  console.log(chalk.green('Cache directory cleaned:'), TEMP_DIR)
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
