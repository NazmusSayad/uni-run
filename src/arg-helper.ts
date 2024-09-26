import NoArg from 'noarg'
import type { app } from './arg'
import Executor from './builtin-bin/Executor'

export const executionConfig = NoArg.defineConfig({
  flags: {
    reloadKey: NoArg.boolean()
      .aliases('rk')
      .default(true)
      .description("Reload the page when pressing 'Ctrl+R' or 'F5'"),
    watch: NoArg.boolean()
      .aliases('w')
      .default(true)
      .description('Watch for changes'),
    noWatch: NoArg.boolean()
      .default(false)
      .description('Disable `watch` and `reloadKey` features'),

    clear: NoArg.boolean()
      .aliases('c')
      .default(true)
      .description('Clear the console before running the script'),
    delay: NoArg.number()
      .aliases('d')
      .default(100)
      .description('The delay to wait for the watcher to trigger'),

    ext: NoArg.array(NoArg.string())
      .aliases('e')
      .default([])
      .description('Looks for changes only of the given extensions'),
    ignore: NoArg.array(NoArg.string())
      .aliases('ig')
      .default([])
      .description('Ignore the given folders/files'),

    bench: NoArg.boolean()
      .aliases('b')
      .description('Calculate the execution time'),
    benchPrefix: NoArg.string()
      .aliases('bp')
      .minLength(1)
      .description('The prefix to show before the execution time'),

    cwd: NoArg.string()
      .default(process.cwd())
      .description('Current working directory'),
    shell: NoArg.boolean()
      .default(false)
      .description('Run the script in a shell for more low-level control'),

    info: NoArg.boolean()
      .default(false)
      .description('Show information about the script'),
    time: NoArg.boolean()
      .default(false)
      .description('Show the execution time at the start'),

    env: NoArg.array(NoArg.string())
      .default([])
      .description('Environment variables'),

    // Extra flags

    nodeDev: NoArg.boolean()
      .default(false)
      .description('Set NODE_ENV to "development"'),

    tsn: NoArg.boolean()
      .default(false)
      .description('Run the script with ts-node'),
  },

  listArgument: {
    name: 'args for script',
    description: 'The arguments to pass to the script',
    type: NoArg.string(),
  },

  trailingArguments: '--',

  customRenderHelp: {
    helpUsageTrailingArgsLabel: '...[args/flags for script]',
  },
})

export type ExecuteOptions = ReturnType<typeof mapFlagsToOptions>
export function mapFlagsToOptions(
  flags: NoArg.InferFlags<typeof app>,
  bin?: Executor
) {
  return {
    cwd: flags.cwd,
    shell: flags.shell,
    showInfo: flags.info,
    showTime: flags.time,
    benchmark: flags.bench ?? Boolean(flags.benchPrefix),
    benchmarkPrefix: flags.benchPrefix,

    clearOnReload: flags.clear,
    keystrokeReload: flags.noWatch ? false : flags.reloadKey,
    watch: flags.noWatch ? false : flags.watch,
    watchDelay: flags.delay,
    watchIgnore: flags.ignore,
    watchExtensions:
      (flags.ext.length ? flags.ext : bin?.getRelatedExts()) || [],

    tsNode: flags['tsn'],
    env: {
      ...flags.env.reduce((acc: any, env) => {
        const [key, value] = env.split('=')
        acc[key] = value
        return acc
      }, {}),

      ...(flags.nodeDev ? { NODE_ENV: 'development' } : {}),
    } as NodeJS.ProcessEnv,
  }
}
