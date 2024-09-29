import { ExecuteOptions } from '../argHelper'

export type ExecutorConfig = Partial<{
  'javascript-runtime': string
  'typescript-runtime': string
}>

export type RuntimeOptions = {
  exec: string[]
  compile?: string[]
  watchExts?: string[]
  install?: {
    check: string[]
    hints?: string[]
    command?: string[]
  }
}

export type ScriptExecutorOptions = {
  name: string
  exts: string[]
  getRuntime(
    args: string[],
    options: Omit<ExecuteOptions, 'watchExtensions'>,
    config: ExecutorConfig
  ): RuntimeOptions
}
