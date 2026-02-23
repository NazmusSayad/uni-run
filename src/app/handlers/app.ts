import chalk from 'chalk'
import { spawnSync } from 'child_process'
import NoArg from 'noarg'
import os from 'os'
import { appExecutionConfig, resolveSharedConfigOptions } from '../config'
import { Execution } from '../execution'
import { getRuntimeByPath } from '../runtime'

export const app = NoArg.create('uni-run', {
  ...appExecutionConfig,
  description: 'A universal runner for scripts',
  system: { splitListByComma: true },
  arguments: [
    { name: 'script', type: NoArg.string(), description: 'Run a script' },
  ],
})

app.on(async ([script, listArs, trailingArgs], flags) => {
  const options = resolveSharedConfigOptions(flags)

  const scriptRunner = getRuntimeByPath(script)
  if (!scriptRunner) {
    console.error(chalk.red('Unsupported script:'), chalk.yellow(script))
    return console.log(
      chalk.bgGreen('TIPS:'),
      'You may try',
      chalk.cyan(`run exec <YOUR_BIN> ${chalk.yellow(script)}`)
    )
  }

  if (scriptRunner.isInstalled) {
    if (!(await scriptRunner.isInstalled(options))) {
      console.error(
        chalk.red('Runtime is not installed:'),
        chalk.yellow(scriptRunner.name)
      )

      return console.log(
        chalk.bgGreen('TIPS:'),
        'You may try',
        chalk.cyan(`run exec <YOUR_BIN> ${chalk.yellow(scriptRunner.name)}`)
      )
    }
  }

  const runtime = await scriptRunner.parse(
    [script, ...listArs, ...trailingArgs],
    options
  )

  if (!scriptRunner.isInstalled) {
    const startBin = spawnSync(
      os.platform() === 'win32' ? 'where' : 'which',
      [runtime.start[0]],
      {
        stdio: 'ignore',
      }
    )

    if (startBin.status !== 0) {
      console.error(
        chalk.red('Runtime is not installed:'),
        chalk.yellow(runtime.start[0])
      )
      return console.log(
        chalk.bgGreen('TIPS:'),
        'You may try',
        chalk.cyan(`run exec <YOUR_RUNTIME> ${chalk.yellow(runtime.start[0])}`)
      )
    }

    if (runtime.compile) {
      const compileBin = spawnSync(
        os.platform() === 'win32' ? 'where' : 'which',
        [runtime.compile[0]],
        {
          stdio: 'ignore',
        }
      )

      if (compileBin.status !== 0) {
        console.error(
          chalk.red('Compiler is not installed:'),
          chalk.yellow(runtime.compile[0])
        )
        return console.log(
          chalk.bgGreen('TIPS:'),
          'You may try',
          chalk.cyan(
            `run exec <YOUR_COMPILER> ${chalk.yellow(runtime.compile[0])}`
          )
        )
      }
    }
  }

  const execution = new Execution({
    ...options,

    watchExtensions: options.watchExtensions.length
      ? options.watchExtensions
      : (runtime.extensions ?? scriptRunner.extensions),

    preStartArgs: runtime.compile,
    startArgs: runtime.start,
  })

  await execution.start()
})
