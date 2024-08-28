import NoArg from 'noarg'
import type { app } from './arg'
import { ExecuteOptions } from './execution'

export const executionConfig = NoArg.defineConfig({
  flags: {
    cwd: NoArg.string()
      .default(process.cwd())
      .description('The current working directory'),

    clear: NoArg.boolean()
      .default(true)
      .description('Clear the console before running the script')
      .aliases('c'),

    reloadKey: NoArg.boolean()
      .default(true)
      .description('Reload the page when pressing "Ctrl+R" or "F5"')
      .aliases('rk'),

    watch: NoArg.boolean()
      .default(true)
      .description('Watch for changes')
      .aliases('w'),

    delay: NoArg.number()
      .default(100)
      .description('The delay to wait for the watcher to trigger')
      .aliases('d'),

    ext: NoArg.array(NoArg.string())
      .default([])
      .description('Looks for changes only of the given extensions')
      .aliases('e'),

    ignore: NoArg.array(NoArg.string())
      .default([])
      .description('Ignore the given targets')
      .aliases('ig'),

    env: NoArg.array(NoArg.string())
      .default([])
      .description('Environment variables'),
  },

  listArgument: {
    name: 'args for script',
    description: 'The arguments to pass to the script',
    type: NoArg.string(),
  },

  trailingArguments: '--',

  customRenderHelp: {
    helpUsageTrailingArgsLabel: '--args/flags for script',
  },
})

export function mapFlagsToOptions(
  flags: NoArg.InferFlags<typeof app>,
  watchExtensions?: string[]
): ExecuteOptions {
  return {
    cwd: flags.cwd,
    clearOnReload: flags.clear,
    readlineReload: flags.reloadKey,
    env: flags.env.reduce((acc: any, env) => {
      const [key, value] = env.split('=')
      acc[key] = value
      return acc
    }, {}),

    watch: flags.watch,
    watchDelay: flags.delay,
    watchExtensions: flags.ext.length ? flags.ext : watchExtensions ?? [],
    watchIgnore: flags.ignore,
  }
}
