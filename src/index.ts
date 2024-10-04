import './app'
import { app } from './arg'
import getConfig from './helpers/getConfig'
import currentModule from './lib/currentModule'
import scriptExecutors from './scriptExecutors'
import getUserExecutors from './helpers/getUserExecutors'
import { ScriptExecutorOptions } from './scriptExecutors/types.t'

export { currentModule, getConfig, getUserExecutors }
export * from './scriptExecutors/types.t'

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
