import { ExecuteOptions } from '../argHelper'

export type ExecutorConfig = Partial<{
  'javascript-runtime': string
  'typescript-runtime': string
}>

export type RuntimeOptions = {
  run: string[]
  install?: string[]
  installHints?: string[]
  isInstalled?: string[]
  watchExts?: string[]
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
