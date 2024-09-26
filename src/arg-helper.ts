import NoArg from 'noarg'
import type { app } from './arg'
import Executor from './builtin-bin/Executor'

export const executionConfig = NoArg.defineConfig({
  flags: {
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

    bench: NoArg.boolean()
      .default(false)
      .description('Show the execution time'),

    benchPrefix: NoArg.string().description(
      'The prefix for the benchmark to show at the start of the line'
    ),

    clear: NoArg.boolean()
      .default(true)
      .description('Clear the console before running the script')
      .aliases('c'),

    reloadKey: NoArg.boolean()
      .default(true)
      .description("Reload the page when pressing 'Ctrl+R' or 'F5'")
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
      .description('Ignore the given folders/files')
      .aliases('ig'),

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
    benchmark: flags.bench,
    benchmarkPrefix: flags.benchPrefix,

    clearOnReload: flags.clear,
    readlineReload: flags.reloadKey,

    watch: flags.watch,
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
