import NoArg from 'noarg'
import type { app } from './arg'
import Executor from './builtin-bin/Executor'

export const executionConfig = NoArg.defineConfig({
  flags: {
    // Watch/Reload flags
    'key-reload': NoArg.boolean()
      .aliases('k')
      .default(true)
      .description("Reload the page when pressing 'Ctrl+R' or 'F5'"),
    watch: NoArg.boolean()
      .aliases('w')
      .default(true)
      .description('Watch for file changes and reload the script'),
    exit: NoArg.boolean()
      .default(false)
      .description(
        'Exit after code execution, disabling `watch` and `reloadKey`'
      ),
    delay: NoArg.number()
      .aliases('d')
      .default(100)
      .description('The delay to wait for the watcher to trigger'),
    ext: NoArg.array(NoArg.string())
      .aliases('e')
      .default([])
      .description('Looks for changes only of the given extensions'),
    focus: NoArg.array(NoArg.string())
      .aliases('f')
      .default([])
      .description('Only watch the given items. `chokidar` syntax'),
    ignore: NoArg.array(NoArg.string())
      .aliases('ig')
      .default([])
      .description('Exclude the given items. `gitignore` syntax'),

    // Benchmark flags
    bench: NoArg.boolean()
      .aliases('b')
      .description('Calculate the execution time'),
    'bench-prefix': NoArg.string()
      .aliases('bp')
      .minLength(1)
      .description('The prefix to show before the execution time'),

    clear: NoArg.boolean()
      .aliases('c')
      .default(true)
      .description('Clear the console before running the script'),
    cwd: NoArg.string()
      .default(process.cwd())
      .description('Current working directory'),
    shell: NoArg.boolean()
      .default(false)
      .description('Run the script in a shell for more low-level control'),
    'safe-stdin': NoArg.boolean()
      .default(false)
      .description('Disable raw mode for stdin (useful for some scripts)'),

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

    'node-dev': NoArg.boolean()
      .default(false)
      .description('Set NODE_ENV to "development"'),

    tsn: NoArg.boolean()
      .default(false)
      .description('Run the script with ts-node (TypeScript)'),
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
    stdinSafeMode: flags['safe-stdin'],
    showInfo: flags.info,
    showTime: flags.time,
    benchmark: flags.bench ?? Boolean(flags['bench-prefix']),
    benchmarkPrefix: flags['bench-prefix'],

    clearOnReload: flags.clear,
    keystrokeReload: flags.exit ? false : flags['key-reload'],
    watch: flags.exit ? false : flags.watch,
    watchDelay: flags.delay,
    watchFocus: flags.focus.length ? flags.focus : [flags.cwd],
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

      ...(flags['node-dev'] ? { NODE_ENV: 'development' } : {}),
    } as NodeJS.ProcessEnv,
  }
}
