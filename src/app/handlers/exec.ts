import { appExecutionConfig, resolveSharedConfigOptions } from '../config'
import { Execution } from '../execution'
import { app } from './app'

export const exec = app.create('exec', {
  ...appExecutionConfig,
  description: 'Execute a script with the given binary',
})

exec.on(async ([listArs, trailingArgs], flags) => {
  const options = resolveSharedConfigOptions(flags)

  const execution = new Execution({
    ...options,
    startArgs: [...listArs, ...trailingArgs],
  })

  await execution.start()
})
