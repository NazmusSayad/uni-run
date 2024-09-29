import * as arg from './arg'
import colors from './lib/colors'
import Execution from './execution'
import getConfig from './helpers/getConfig'
import { mapFlagsToOptions } from './argHelper'
import scriptExecutors from './scriptExecutors'
import checkRuntime from './scriptExecutors/checkRuntime'
import getUserExecutors from './helpers/getUserExecutors'
import { ScriptExecutorOptions } from './scriptExecutors/types.t'
import { cleanCacheDir, getCacheDir } from './scriptExecutors/helpers'

arg.app.on(async ([script, listArs, trailingArgs], flags) => {
  const executionConfig = getConfig(flags.cwd)
  const userExecutors = getUserExecutors(flags.cwd)

  const totalExecutors = [
    ...(Array.isArray(userExecutors) ? userExecutors : []),
    ...scriptExecutors,
  ]

  const scriptExecutor = totalExecutors.find((executor) =>
    executor.exts.includes(script.split('.').pop()!)
  )

  if (!scriptExecutor) {
    console.error(colors.red('Unsupported script:'), colors.yellow(script))
    return console.log(
      colors.bgGreen('TIPS:'),
      'You may try',
      colors.cyan(`run exec <YOUR_BIN> ${colors.yellow(script)}`)
    )
  }

  const executionOptions = mapFlagsToOptions(flags)
  const runtime = scriptExecutor.getRuntime(
    [script, ...listArs, ...trailingArgs],
    executionOptions,
    executionConfig
  )

  if (!(await checkRuntime(runtime))) return
  const exec = new Execution(
    {
      ...executionOptions,
      watchExtensions: executionOptions.watchExtensions.length
        ? executionOptions.watchExtensions
        : [...scriptExecutor.exts, ...(runtime.watchExts ?? [])],
    },
    runtime.exec,
    runtime.compile
  )

  exec.start()
})

arg.exec.on(([listArs, trailingArgs], flags) => {
  new Execution(mapFlagsToOptions(flags), [...listArs, ...trailingArgs]).start()
})

arg.list.on(() => {
  function printExecutorsFactory(
    clrFn: Function,
    executors: ScriptExecutorOptions[]
  ) {
    executors.forEach(({ name, exts }) => {
      console.log(
        `- ${clrFn(name)}`,
        `[${exts.map((e) => '.' + colors.green(e)).join(', ')}]`
      )
    })
  }

  console.log(colors.bold('Supported scripts:'))
  printExecutorsFactory(colors.cyan, getUserExecutors() ?? [])
  printExecutorsFactory(colors.blue, scriptExecutors)
})

arg.clean.on(() => {
  console.log(colors.bgGreen('CACHE:'), getCacheDir())
  cleanCacheDir()
  console.log(colors.green('Cache directory cleaned.'))
})
