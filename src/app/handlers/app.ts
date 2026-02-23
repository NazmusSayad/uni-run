import { getSystemRuntime } from '@/helpers/hack'
import { installTip } from '@/helpers/lib'
import chalk from 'chalk'
import { spawnSync } from 'child_process'
import NoArg from 'noarg'
import os from 'os'
import { appExecutionConfig, resolveSharedConfigOptions } from '../config'
import { Execution } from '../execution'
import { getRuntimeByScript } from '../runtime'

export const app = NoArg.create('uni-run', {
  ...appExecutionConfig,
  description: 'A universal runner for scripts',
  system: { splitListByComma: true },
  arguments: [
    { name: 'script', type: NoArg.string(), description: 'Run a script' },
  ],
})

app.on(async ([script, listArs, trailingArgs], flags) => {
  if (getSystemRuntime() === 'rux') {
    flags.exit = true
    flags.keep = flags.keep ?? true
  }

  const options = resolveSharedConfigOptions(flags)

  const scriptRunner = getRuntimeByScript(script)
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
    if (runtime.compile?.length) {
      const compileBinary = runtime.compile[0]

      const compileBin = spawnSync(
        os.platform() === 'win32' ? 'where' : 'which',
        [compileBinary],
        {
          stdio: 'ignore',
        }
      )

      if (compileBin.status !== 0) {
        console.error(
          chalk.red('Compiler is not installed:'),
          chalk.yellow(compileBinary)
        )

        return installTip(compileBinary)
      }
    } else {
      const binary = runtime.start[0]

      const startBin = spawnSync(
        os.platform() === 'win32' ? 'where' : 'which',
        [binary],
        {
          stdio: 'ignore',
        }
      )

      if (startBin.status !== 0) {
        console.error(
          chalk.red('Runtime is not installed:'),
          chalk.yellow(binary)
        )

        return installTip(binary)
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
