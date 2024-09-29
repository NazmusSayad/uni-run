import './app'
import { app } from './arg'
import scriptExecutors from './scriptExecutors'
import { ScriptExecutorOptions } from './scriptExecutors/types.t'

export default {
  addExecutorBefore(executor: ScriptExecutorOptions) {
    scriptExecutors.unshift(executor)
  },

  addExecutorAfter(executor: ScriptExecutorOptions) {
    scriptExecutors.push(executor)
  },

  start(args?: string[]) {
    app.start(args)
  },
}
