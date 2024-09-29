import * as arg from './arg'
import Execution from './execution'
import getConfig from './helpers/getConfig'
import { mapFlagsToOptions } from './argHelper'
import scriptExecutors from './scriptExecutors'
import checkRuntime from './scriptExecutors/checkRuntime'
import getUserExecutors from './helpers/getUserExecutors'
import colors from './lib/colors'

arg.app.on(async ([script, listArs, trailingArgs], flags) => {
  const userExecutors = getUserExecutors(flags.cwd)
  const executionConfig = getConfig(flags.cwd)
  const totalExecutors = [
    ...(Array.isArray(userExecutors) ? userExecutors : []),
    ...scriptExecutors,
  ]

  const scriptExecutor = totalExecutors.find((executor) =>
    executor.exts.includes(script.split('.').pop()!)
  )

  if (!scriptExecutor) {
    console.error('Unsupported script:', script)
    return console.log('You may try "run exec YOUR_BIN script.ext -- --flags"')
  }

  const executionOptions = mapFlagsToOptions(flags)
  const runtime = scriptExecutor.getRuntime(
    [script, ...listArs, ...trailingArgs],
    executionOptions,
    executionConfig
  )

  checkRuntime(runtime)
  Execution.start(runtime.start, {
    ...executionOptions,
    watchExtensions: executionOptions.watchExtensions.length
      ? executionOptions.watchExtensions
      : [...scriptExecutor.exts, ...(runtime.watchExts ?? [])],
  })
})

arg.exec.on(([listArs, trailingArgs], flags) => {
  Execution.start([...listArs, ...trailingArgs], mapFlagsToOptions(flags))
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
      `- ${colors.magenta(name)}`,
      `[${exts.map((e) => '.' + colors.green(e)).join(', ')}]`
    )
  })
})
