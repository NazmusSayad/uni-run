import * as arg from './arg'
import Execution from './execution'
import builtinBin from './builtin-bin'
import { mapFlagsToOptions } from './arg-helper'

arg.app.on(([script, listArs, trailingArgs], flags) => {
  const bin = builtinBin.find((bin) => bin.isSupported(script))

  if (!bin) {
    console.log('Unsupported script:', script)
    return console.log('You may try "ur exec bin script.ext - --flags"')
  }

  if (!bin.isInstalled()) {
    return bin.renderHowToInstall()
  }

  Execution.start(
    bin.getArgs(script, ...listArs, ...trailingArgs),
    mapFlagsToOptions(flags, bin.config.watchExtensions)
  )
})

arg.exec.on(([listArs, trailingArgs], flags) => {
  Execution.start([...listArs, ...trailingArgs], mapFlagsToOptions(flags))
})
