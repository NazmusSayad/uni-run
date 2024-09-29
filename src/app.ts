import * as arg from './arg'
import colors from './lib/colors'
import Execution from './execution'
import getConfig from './helpers/getConfig'
import { mapFlagsToOptions } from './argHelper'
import scriptExecutors from './scriptExecutors'
import checkRuntime from './scriptExecutors/checkRuntime'
import getUserExecutors from './helpers/getUserExecutors'
import { cleanCacheDir, getCacheDir } from './scriptExecutors/helpers'

arg.app.on(async ([script, listArs, trailingArgs], flags) => {
  if (process.env.NODE_ENV_UNI_RUN === 'LAB') {
    flags.clear = false
    flags['safe-stdin'] = true
    flags['key-reload'] = false
  }

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
  const userExecutors = getUserExecutors()
  const totalExecutors = [
    ...(Array.isArray(userExecutors) ? userExecutors : []),
    ...scriptExecutors,
  ]

  console.log(colors.bold('Supported scripts:'))
  totalExecutors.forEach(({ name, exts }) => {
    console.log(
      `- ${colors.blue(name)}`,
      `[${exts.map((e) => '.' + colors.green(e)).join(', ')}]`
    )
  })
})

arg.clean.on(() => {
  console.log(colors.bgGreen('CACHE:'), colors.dim(getCacheDir()))
  cleanCacheDir()
  console.log(colors.green('Cache directory cleaned.'))
})
