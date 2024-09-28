import * as arg from './arg'
import Execution from './execution'
import getConfig from './helpers/getConfig'
import { mapFlagsToOptions } from './argHelper'
import scriptExecutors from './scriptExecutors'
import checkRuntime from './scriptExecutors/checkRuntime'
import getUserExecutors from './helpers/getUserExecutors'

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
    console.log('Unsupported script:', script)
    return console.log('You may try "run exec YOUR_BIN script.ext -- --flags"')
  }

  const executionOptions = mapFlagsToOptions(flags)
  const runtime = scriptExecutor.getRuntime(
    [script, ...listArs, ...trailingArgs],
    executionOptions,
    executionConfig
  )

  checkRuntime(runtime)
  Execution.start(runtime.run, {
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

  console.log('Supported scripts:')
  totalExecutors
    .sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    .forEach(({ name }) => console.log(`- ${name}`))
})
