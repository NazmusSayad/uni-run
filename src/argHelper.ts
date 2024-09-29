import NoArg from 'noarg'
import type { app } from './arg'

export const executionConfig = NoArg.defineConfig({
  flags: {
    'do-not-watch': NoArg.boolean()
      .aliases('dw')
      .description('Watch for file changes and reload the script'),
    'disable-reload-key': NoArg.boolean()
      .aliases('dk')
      .description("Disable 'Ctrl+R' or 'F5' to reload the script"),
    'disable-raw-stdin': NoArg.boolean()
      .aliases('drs')
      .description(
        'Disable raw mode for stdin. Do not needed with `--disable-reload-key`'
      ),

    exit: NoArg.boolean()
      .aliases('x')
      .description('Exit the script after the first execution'),
    quiet: NoArg.boolean()
      .aliases('q')
      .description('Do not show any output of the script'),
    keep: NoArg.boolean()
      .aliases('k')
      .description('Do not clear the console while starting the script'),

    ext: NoArg.array(NoArg.string())
      .aliases('e')
      .description('Looks for changes only of the given extensions'),
    focus: NoArg.array(NoArg.string())
      .aliases('f')
      .description('Only watch the given items. `chokidar` syntax'),
    ignore: NoArg.array(NoArg.string())
      .aliases('ig')
      .description('Exclude the given items. `gitignore` syntax'),
    delay: NoArg.number()
      .aliases('d')
      .default(100)
      .description('The delay to wait for the watcher to trigger'),

    bench: NoArg.boolean()
      .aliases('b')
      .description('Calculate the execution time'),
    'bench-prefix': NoArg.string()
      .aliases('bp')
      .minLength(1)
      .description('The prefix to show before the execution time'),

    shell: NoArg.boolean()
      .aliases('sh')
      .description('Run the script in a shell for more low-level control.'),
    cwd: NoArg.string()
      .default(process.cwd())
      .description('Set the current working directory'),

    info: NoArg.boolean().description('Show information about the script'),
    time: NoArg.boolean().description('Show the execution time at the start'),
    env: NoArg.array(NoArg.string()).description('Set environment variables'),
    'node-dev': NoArg.boolean().description(
      'Set env.NODE_ENV to "development"'
    ),
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
export function mapFlagsToOptions(flags: NoArg.InferFlags<typeof app>) {
  if (flags.exit) {
    flags['disable-reload-key'] = true
    flags['do-not-watch'] = true
  }

  return {
    cwd: flags.cwd,
    shell: !!flags.shell,
    silent: !!flags.quiet,
    showInfo: !!flags.info,
    showTime: !!flags.time,
    benchmark: !!(flags.bench ?? flags['bench-prefix']),
    benchmarkPrefix: flags['bench-prefix'],

    clearOnReload: !flags.keep,
    keystrokeReload: !flags['disable-reload-key'],
    stdinSafeMode: !!flags['disable-raw-stdin'],

    watch: !flags['do-not-watch'],
    watchDelay: flags.delay,
    watchFocus: flags.focus?.length ? flags.focus : [flags.cwd],
    watchIgnore: flags.ignore ?? [],
    watchExtensions: flags.ext ?? [],

    env: {
      ...(flags.env ?? []).reduce((acc: any, env) => {
        const [key, value] = env.split('=')
        acc[key] = value
        return acc
      }, {}),

      ...(flags['node-dev'] ? { NODE_ENV: 'development' } : {}),
    } as NodeJS.ProcessEnv,
  }
}
