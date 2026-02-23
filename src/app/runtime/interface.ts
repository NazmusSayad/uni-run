import { AppExecutionConfig } from '../config'

type ScriptRuntimeResult = {
  start: string[]
  compile?: string[]
  extensions?: string[]
}

export interface ScriptRuntime {
  name: string
  extensions: string[]

  parse(
    args: string[],
    options: AppExecutionConfig
  ): Promise<ScriptRuntimeResult>

  isInstalled?(options: AppExecutionConfig): Promise<boolean>
}
