import './app'
import { app } from './arg'
import builtinBin from './builtin-bin'
import Executor from './builtin-bin/Executor'

export { Executor }

export default {
  addBin(bin: Executor) {
    builtinBin.push(bin)
  },

  start(args?: string[]) {
    app.start(args)
  },
}
