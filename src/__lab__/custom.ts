import something, { Executor } from '../index'

something.addBin(
  new Executor('# Super Hero', {
    extensions: ['idk'],
    run(args) {
      return ['echo', ...args]
    },
  })
)

something.start(['list'])
