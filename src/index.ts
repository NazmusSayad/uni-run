import './app'
import { app } from './arg'
import scriptExecutors from './scriptExecutors'
import { ScriptExecutorOptions } from './scriptExecutors/types.t'

export default {
  addExecutor(executor: ScriptExecutorOptions) {
    scriptExecutors.unshift(executor)
  },

  start(args?: string[]) {
    app.start(args)
  },
}
