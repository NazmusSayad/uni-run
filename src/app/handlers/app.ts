import NoArg from 'noarg'
import { executionConfig, resolveSharedConfigOptions } from '../config'
import { Execution } from '../execution'

export const app = NoArg.create('uni-run', {
  ...executionConfig,
  description: 'A universal runner for scripts',
  system: { splitListByComma: true },
  arguments: [
    { name: 'script', type: NoArg.string(), description: 'Run a script' },
  ],
})

app.on(async ([script, listArs, trailingArgs], flags) => {
  const options = resolveSharedConfigOptions(flags)

  console.log({
    script,
    flags,
    listArs,
    options,
    trailingArgs,
  })

  const execution = new Execution(options, [...listArs, ...trailingArgs])
  execution.start()
})
