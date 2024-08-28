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
    mapFlagsToOptions(flags, bin)
  )
})

arg.exec.on(([listArs, trailingArgs], flags) => {
  Execution.start([...listArs, ...trailingArgs], mapFlagsToOptions(flags))
})

arg.support.on(() => {
  console.log('Supported scripts:')
  builtinBin
    .sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    .forEach((bin) => {
      console.log(`- ${bin.name}`)
    })
})
