import NoArg from 'noarg'

const executionConfig = NoArg.defineConfig({
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

export const app = NoArg.create('uni-run', {
  ...executionConfig,

  arguments: [
    {
      name: 'script',
      description: 'Run a script',
      type: NoArg.string(),
    },
  ],

  system: {
    splitListByComma: true,
  },
})

export const exec = app.create('exec', {
  ...executionConfig,
  description: 'Execute a script with the given binary',
})
