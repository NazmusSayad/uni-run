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

    reload: NoArg.boolean()
      .default(true)
      .description('Reload the page when pressing "Ctrl+R" or "Meta+R"')
      .aliases('r'),

    watch: NoArg.boolean()
      .default(true)
      .description('Watch for changes')
      .aliases('w'),

    watchDelay: NoArg.number()
      .default(100)
      .description('The delay to wait for the watcher to trigger')
      .aliases('wd'),

    ext: NoArg.array(NoArg.string())
      .default([])
      .description('Looks for changes only of the given extensions')
      .aliases('e'),

    ignore: NoArg.array(NoArg.string())
      .default([])
      .description('Ignore the given targets'),

    env: NoArg.array(NoArg.string())
      .default([])
      .description('Environment variables'),
  },

  listArgument: {
    name: 'args',
    description: 'The arguments to pass to the script',
    type: NoArg.string(),
  },

  trailingArguments: '--',
})

export function mapFlagsToOptions(
  flags: NoArg.InferFlags<typeof app>,
  watchExtensions?: string[]
): ExecuteOptions {
  return {
    cwd: flags.cwd,
    clearOnReload: flags.clear,
    readlineReload: flags.reload,
    env: flags.env.reduce((acc: any, env) => {
      const [key, value] = env.split('=')
      acc[key] = value
      return acc
    }, {}),

    watch: flags.watch,
    watchDelay: flags.watchDelay,
    watchExtensions: flags.ext.length ? flags.ext : watchExtensions ?? [],
    watchIgnore: flags.ignore,
  }
}
