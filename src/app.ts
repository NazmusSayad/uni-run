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

  const executionOptions = mapFlagsToOptions(flags, bin)
  bin.start(executionOptions, [script, ...listArs, ...trailingArgs])
})

arg.exec.on(([listArs, trailingArgs], flags) => {
  Execution.start([...listArs, ...trailingArgs], mapFlagsToOptions(flags))
})

arg.list.on(() => {
  console.log('Supported scripts:')
  builtinBin
    .sort((a, b) => {
      const aName = a.getName()
      const bName = b.getName()

      if (aName < bName) return -1
      if (aName > bName) return 1
      return 0
    })
    .forEach((bin) => {
      console.log(`- ${bin.getName()}`)
    })
})
