import NoArg from 'noarg'
import * as arg from './arg'
import builtinBin from './builtin-bin'
import execute, { ExecuteOptions } from './execute'

function mapFlagsToOptions(
  flags: NoArg.InferFlags<typeof arg.app>
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
    watchExtensions: flags.ext,
    watchIgnore: flags.ignore,
  }
}

arg.app.on(([script, listArs, trailingArgs], flags) => {
  if (script) {
    const bin = builtinBin.find((bin) => bin.isSupported(script))

    if (!bin) {
      console.log('Unsupported script:', script)
      console.log('You may try "ur exec bin script.ext - --flags"')
      process.exit(1)
    }

    if (!bin.isInstalled()) {
      console.error(`${bin.displayName} is not installed.`)

      if (bin.howToInstall) {
        console.log('How to install:')
        bin.howToInstall()
      }

      process.exit(1)
    }

    return execute(
      bin.run(script, ...listArs, ...trailingArgs),
      mapFlagsToOptions(flags)
    )
  }

  arg.app.renderHelp()
})

arg.exec.on(([listArs, trailingArgs], flags) => {
  execute([...listArs, ...trailingArgs], mapFlagsToOptions(flags))
})
